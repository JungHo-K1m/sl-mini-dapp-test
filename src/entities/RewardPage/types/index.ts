// src/entities/RewardPage/types/index.ts

export interface RankingAward {
  rangeStart: number;
  rangeEnd: number;
  slRewards: number;
  usdcRewards: number | null;
  nftType: "GOLD" | "SILVER" | "BRONZE" | null;
}

export interface DrawAward {
  rangeStart: number;
  rangeEnd: number;
  slRewards: number;
  usdcRewards: number | null;
  nftType: "GOLD" | "SILVER" | "BRONZE" | null;
}

export interface AirDropAward {
  winnerNum: number | null;
  slRewards: number;
  usdcRewards?: number | null;
  nftType?: "GOLD" | "SILVER" | "BRONZE" | null;
}

export type Award = RankingAward | DrawAward | AirDropAward;

export interface Rank {
  rank: number;
  star: number;
  ticket: number;
  slToken: number;
  diceRefilledAt: string | null;
}

export interface LeaderHomeData {
  rankingAwards: RankingAward[];
  drawAwards: DrawAward[];
  airDropAwards: AirDropAward[] | null;
  rank: Rank;
}
