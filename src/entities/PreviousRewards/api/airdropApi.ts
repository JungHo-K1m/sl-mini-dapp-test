// src\entities\PreviousRewards\api\airdropApi.ts

import api from '@/shared/api/axiosInstance';

export interface AirdropWinner {
  userId: string;
  slRewards: number;
  rank: number; // 1~16
}

export interface AirdropMyReward {
  userId: string;
  slRewards: number;
  rank: number | null; // rank가 없으면 null
}

export interface AirdropResponseData {
  winners: AirdropWinner[];
  myReward: AirdropMyReward;
}

/**
 * 에어드롭 보상 확인 API
 * GET /airdrop
 */
export async function fetchAirdropAPI(): Promise<AirdropResponseData | null> {
  const response = await api.get('/airdrop'); // 실제 엔드포인트: /leader/airdrop인지, /airdrop인지 확인 필요
  // data가 null인 경우(전달에 에어드롭이 없었던 경우)와 있는 경우를 구분
  // response.data.data가 null일 수 있으므로 체크
  return response.data.data ?? null; 
}
