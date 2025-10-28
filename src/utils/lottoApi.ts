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

export async function fetchLatestLottoResult(): Promise<LottoDrawResult | null> {
  try {
    const res = await fetch('https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=0');
    const data = await res.json();
    if (data.returnValue === 'success') return data;
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
