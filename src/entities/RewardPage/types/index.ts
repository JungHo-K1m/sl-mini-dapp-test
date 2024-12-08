// src/entities/RewardPage/types/index.ts

export interface RankingAward {
    rangeStart: number;
    rangeEnd: number;
    slRewards: number;
    usdtRewards: number;
    nftType: "GOLD" | "SILVER" | "BRONZE" | null;
  }
  
  export interface DrawAward {
    rangeStart: number;
    rangeEnd: number;
    slRewards: number;
    usdtRewards: number;
    nftType: "GOLD" | "SILVER" | "BRONZE" | null;
  }
  
  export type Award = RankingAward | DrawAward; // 추가된 부분
  
  export interface Rank {
    rank: number;
    star: number;
    ticket: number;
    slToken: number;
    diceRefilledAt: string | null;
  }
  
  export interface LeaderBoardEntry {
    userId: string;
    starCount: number;
    rank: number;
  }
  
  export interface LeaderboardContent {
    userId: string;
    starCount: number;
  }
  
  export interface LeaderHomeData {
    rankingAwards: RankingAward[];
    drawAwards: DrawAward[];
    rank: Rank;
    leaderBoard: LeaderBoardEntry[];
  }
  
  export interface LeaderboardPage {
    content: LeaderboardContent[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
    nextCursor?: number; // API 응답에 따라 추가
    prevCursor?: number; // API 응답에 따라 추가
  }
  
  export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  }
  