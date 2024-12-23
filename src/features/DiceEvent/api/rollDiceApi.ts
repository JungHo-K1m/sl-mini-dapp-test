// src/features/DiceEvent/api/rollDiceApi.ts

import api from '@/shared/api/axiosInstance';

// RollDiceResponseData 인터페이스 정의 및 export
export interface RollDiceResponseData {
  rank: number;
  star: number;
  ticket: number;
  dice: number;
  slToken: number;
  diceResult: number;
  tileSequence: number;
  level: number; // 추가된 속성
  exp: number;    // 추가된 속성
}

export const rollDiceAPI = async (gauge: number, sequence: number): Promise<RollDiceResponseData> => {
  const response = await api.post('/roll-dice', { gauge, sequence });

  if (response.data.code === 'OK') {
    return response.data.data;
  } else {
    console.error('rollDiceAPI Error:', response.data.message);
    throw new Error(response.data.message || 'Roll dice failed');
  }
};
