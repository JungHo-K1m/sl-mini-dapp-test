// src/entities/Leaderboard/types/index.ts

export interface LeaderBoardEntry {
    userId: string;
    starCount: number;
    rank: number;
  }
  
  export interface LeaderTabData {
    leaderBoard: LeaderBoardEntry[];
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
  
  export interface LeaderboardPage {
    content: LeaderBoardEntry[];
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
  }
  