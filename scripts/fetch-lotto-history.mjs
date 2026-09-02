// scripts/fetch-lotto-history.mjs
// 개발용 1회성 수집 스크립트: 동행복권 공식 API에서 역대 로또 6/45 당첨번호를 모두 수집하여
// src/data/lottoHistory.json 으로 저장한다. 앱 실행 시에는 이 API를 호출하지 않는다.
//
// 원본 API endpoint (vite.config.ts의 /api/lotto proxy, src/utils/lottoApi.ts 참고):
//   https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchLtEpsd={round}
//
// API 특성(직접 확인함): srchLtEpsd=N 요청 시, N을 포함해 최대 10개 회차를
// [min(N+4, latest)-9, min(N+4, latest)] 범위로 내림차순 반환한다. N이 latest보다 크면 빈 리스트.
// 이 특성을 이용해 N = 6, 16, 26, ... (10회차 단위)로 요청하면 회차 구간을 겹침/누락 없이
// 10배 적은 요청 수로 수집할 수 있다.

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'lottoHistory.json');

const API_BASE = 'https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do';
const REQUEST_DELAY_MS = 250;
const MAX_RETRY = 3;
const RETRY_DELAY_MS = 500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 실제 회차 시작일(2002-12-07) 기준 경과 주 수로 최신 회차를 "추정"만 한다.
// 정확한 최신 회차는 findLatestRound()에서 API 응답으로 확정한다.
function estimateLatestRound() {
  const FIRST_DRAW_MS = Date.UTC(2002, 11, 7, 11, 35);
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  return Math.max(1, Math.floor((Date.now() - FIRST_DRAW_MS) / MS_PER_WEEK) + 1);
}

async function fetchWindow(round) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(`${API_BASE}?srchLtEpsd=${round}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return Array.isArray(json?.data?.list) ? json.data.list : [];
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRY) await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  throw new Error(`요청 실패 (round=${round}, ${MAX_RETRY}회 재시도 후 포기): ${lastError?.message}`);
}

// N<=latest 이면 응답이 비지 않는다는 특성을 이용해 최신 회차를 확정한다.
async function findLatestRound() {
  let n = estimateLatestRound();

  // 추정치가 너무 높아 이미 빈 응답이면 낮춘다.
  while (n > 1 && (await fetchWindow(n)).length === 0) {
    await sleep(REQUEST_DELAY_MS);
    n--;
  }
  // 추정치가 낮으면 빈 응답이 나올 때까지 올린다.
  while ((await fetchWindow(n + 1)).length > 0) {
    await sleep(REQUEST_DELAY_MS);
    n++;
  }
  return n;
}

function mapItem(item) {
  const y = item.ltRflYmd.slice(0, 4);
  const m = item.ltRflYmd.slice(4, 6);
  const d = item.ltRflYmd.slice(6, 8);
  return {
    round: item.ltEpsd,
    drawDate: `${y}-${m}-${d}`,
    numbers: [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo],
    bonus: item.bnsWnNo,
  };
}

function isValidDateString(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function validateRecord(rec) {
  const errors = [];
  if (!Number.isInteger(rec.round) || rec.round <= 0) errors.push('round는 양의 정수여야 함');
  if (!isValidDateString(rec.drawDate)) errors.push('drawDate가 유효하지 않음');
  if (!Array.isArray(rec.numbers) || rec.numbers.length !== 6) errors.push('numbers는 정확히 6개여야 함');
  else {
    for (const num of rec.numbers) {
      if (!Number.isInteger(num) || num < 1 || num > 45) errors.push(`numbers 값 범위 오류: ${num}`);
    }
    if (new Set(rec.numbers).size !== 6) errors.push('numbers 내부 중복 존재');
  }
  if (!Number.isInteger(rec.bonus) || rec.bonus < 1 || rec.bonus > 45) errors.push('bonus 범위 오류');
  if (Array.isArray(rec.numbers) && rec.numbers.includes(rec.bonus)) errors.push('bonus가 numbers와 중복됨');
  return errors;
}

function validateAll(records, latestRound) {
  const errors = [];
  const rounds = records.map((r) => r.round);
  const roundSet = new Set(rounds);
  if (roundSet.size !== rounds.length) errors.push('회차 중복 존재');

  for (let r = 1; r <= latestRound; r++) {
    if (!roundSet.has(r)) errors.push(`회차 누락: ${r}`);
  }

  const sorted = [...rounds].every((r, i, arr) => i === 0 || arr[i - 1] < r);
  if (!sorted) errors.push('round 오름차순 정렬 아님');

  return errors;
}

async function fetchAllRounds(latestRound) {
  const byRound = new Map();
  // N = 6, 16, 26, ... 요청 시 [10k+1, 10k+10] 구간을 겹침/누락 없이 커버한다.
  const requestRounds = [];
  for (let n = 6; n - 4 <= latestRound; n += 10) {
    requestRounds.push(n);
  }
  // 마지막 구간이 latestRound를 정확히 포함하지 못하면(최신 회차가 10의 배수 경계와 어긋나는 경우)
  // latestRound 자체로 한 번 더 요청해 꼬리 구간을 보충한다.
  if (requestRounds.length === 0 || requestRounds[requestRounds.length - 1] - 4 < latestRound) {
    requestRounds.push(latestRound);
  }

  for (const n of requestRounds) {
    const list = await fetchWindow(n);
    for (const item of list) {
      const rec = mapItem(item);
      if (rec.round >= 1 && rec.round <= latestRound) byRound.set(rec.round, rec);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  return byRound;
}

async function spotCheck(byRound, rounds) {
  const mismatches = [];
  for (const round of rounds) {
    const list = await fetchWindow(round);
    const apiItem = list.find((it) => it.ltEpsd === round);
    if (!apiItem) {
      mismatches.push(`round ${round}: API 재조회 실패`);
      continue;
    }
    const fresh = mapItem(apiItem);
    const stored = byRound.get(round);
    if (JSON.stringify(fresh) !== JSON.stringify(stored)) {
      mismatches.push(`round ${round}: 저장된 데이터와 재조회 결과 불일치`);
    }
    await sleep(REQUEST_DELAY_MS);
  }
  return mismatches;
}

async function main() {
  console.log('[1/5] 최신 회차 확인 중...');
  const latestRound = await findLatestRound();
  console.log(`  -> 최신 회차: ${latestRound}`);

  console.log('[2/5] 전체 회차 수집 중...');
  const byRound = await fetchAllRounds(latestRound);
  console.log(`  -> 수집된 회차 수: ${byRound.size}`);

  const records = [...byRound.values()].sort((a, b) => a.round - b.round);

  console.log('[3/5] 회차별 데이터 검증 중...');
  const perRecordErrors = [];
  for (const rec of records) {
    const errs = validateRecord(rec);
    if (errs.length > 0) perRecordErrors.push(`round ${rec.round}: ${errs.join(', ')}`);
  }

  console.log('[4/5] 전체 데이터 정합성 검증 중...');
  const overallErrors = validateAll(records, latestRound);

  const allErrors = [...perRecordErrors, ...overallErrors];
  if (allErrors.length > 0) {
    console.error('검증 실패. JSON 파일을 저장하지 않습니다.');
    for (const e of allErrors) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }

  console.log('[5/5] 샘플 회차 API 원본 재검증 중 (1회, 중간 회차, 최신 회차)...');
  const midRound = Math.round(latestRound / 2);
  const mismatches = await spotCheck(byRound, [1, midRound, latestRound]);
  if (mismatches.length > 0) {
    console.error('샘플 재검증 실패. JSON 파일을 저장하지 않습니다.');
    for (const m of mismatches) console.error(`  - ${m}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(records, null, 2) + '\n', 'utf-8');

  console.log('\n검증 통과. 저장 완료.');
  console.log(`  파일: ${path.relative(path.join(__dirname, '..'), OUTPUT_PATH)}`);
  console.log(`  회차 범위: ${records[0].round} ~ ${records[records.length - 1].round}`);
  console.log(`  총 회차 수: ${records.length}`);
  console.log(`  1회: ${JSON.stringify(records[0])}`);
  console.log(`  중간(${midRound}회): ${JSON.stringify(byRound.get(midRound))}`);
  console.log(`  최신(${latestRound}회): ${JSON.stringify(records[records.length - 1])}`);
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류 발생:', err);
  process.exitCode = 1;
});
