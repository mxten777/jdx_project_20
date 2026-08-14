// utils/lottoApi.ts
// 로또 당첨 번호 조회용 util (동행복권 공식 API 사용)

export interface LottoDrawResult {
  drwNo: number; // 회차
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  returnValue: 'success' | 'fail';
  drwNoDate: string;
}

interface NewApiItem {
  ltEpsd: number;
  tm1WnNo: number;
  tm2WnNo: number;
  tm3WnNo: number;
  tm4WnNo: number;
  tm5WnNo: number;
  tm6WnNo: number;
  bnsWnNo: number;
  ltRflYmd: string; // YYYYMMDD
}

// Round 1 was 2002-12-07; draw time ~20:35 KST = 11:35 UTC
function getLatestDrwNo(): number {
  const FIRST_DRAW_MS = Date.UTC(2002, 11, 7, 11, 35);
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  return Math.max(1, Math.floor((Date.now() - FIRST_DRAW_MS) / MS_PER_WEEK) + 1);
}

function mapToLottoDrawResult(item: NewApiItem): LottoDrawResult {
  const y = item.ltRflYmd.slice(0, 4);
  const m = item.ltRflYmd.slice(4, 6);
  const d = item.ltRflYmd.slice(6, 8);
  return {
    drwNo: item.ltEpsd,
    drwtNo1: item.tm1WnNo,
    drwtNo2: item.tm2WnNo,
    drwtNo3: item.tm3WnNo,
    drwtNo4: item.tm4WnNo,
    drwtNo5: item.tm5WnNo,
    drwtNo6: item.tm6WnNo,
    bnusNo: item.bnsWnNo,
    returnValue: 'success',
    drwNoDate: `${y}-${m}-${d}`,
  };
}

export async function fetchLatestLottoResult(): Promise<LottoDrawResult | null> {
  try {
    const drwNo = getLatestDrwNo();
    // Try latest round; fall back to previous if draw hasn't occurred yet this week
    for (const n of [drwNo, drwNo - 1]) {
      const res = await fetch(`/api/lotto?srchLtEpsd=${n}`);
      if (!res.ok) continue;
      const json = await res.json();
      const list: NewApiItem[] = json?.data?.list;
      if (list && list.length > 0) return mapToLottoDrawResult(list[0]);
    }
    return null;
  } catch {
    return null;
  }
}

export function checkLottoMatch(userNumbers: number[], draw: LottoDrawResult): {match: number, bonus: boolean} {
  const mainNumbers = [draw.drwtNo1, draw.drwtNo2, draw.drwtNo3, draw.drwtNo4, draw.drwtNo5, draw.drwtNo6];
  const match = userNumbers.filter(n => mainNumbers.includes(n)).length;
  const bonus = userNumbers.includes(draw.bnusNo);
  return { match, bonus };
}
