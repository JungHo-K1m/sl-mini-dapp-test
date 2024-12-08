// src/entities/User/model/userModel.ts

import { create } from 'zustand';
import { fetchHomeData } from '@/entities/User/api/userApi';
import api from '@/shared/api/axiosInstance';
import { rollDiceAPI, RollDiceResponseData } from '@/features/DiceEvent/api/rollDiceApi';
import { refillDiceAPI } from '@/features/DiceEvent/api/refillDiceApi'; // 분리된 API 함수 임포트


// 월간 보상 정보 인터페이스
interface MonthlyPrize {
  year: number;
  month: number;
  prizeType: string;
  amount: number;
}

// 주간 출석 정보 인터페이스
interface WeekAttendance {
  mon: boolean | null;
  tue: boolean | null;
  wed: boolean | null;
  thu: boolean | null;
  fri: boolean | null;
  sat: boolean | null;
  sun: boolean | null;
}

// 사용자 상태 인터페이스
interface UserState {
  // 사용자 관련 상태들
  userId: string | null;
  setUserId: (userId: string | null) => void;

  referrerId: string | null; // 추가된 부분: 초대한 친구 아이디
  setReferrerId: (referrerId: string | null) => void; // 추가된 부분

  isAuto: boolean; // 추가된 부분: 오토 여부
  setIsAuto: (isAuto: boolean) => void; // 추가된 부분

  starPoints: number;
  setStarPoints: (value: number | ((prev: number) => number)) => void;

  diceCount: number;
  setDiceCount: (value: number | ((prev: number) => number)) => void;

  lotteryCount: number;
  setLotteryCount: (value: number | ((prev: number) => number)) => void;

  position: number;
  setPosition: (value: number | ((prev: number) => number)) => void;

  userLv: number;
  setUserLv: (userLv: number) => void;

  characterType: 'dog' | 'cat' | null; // 수정된 부분: null 허용
  setCharacterType: (type: 'dog' | 'cat' | null) => void; // 수정된 부분: null 허용

  slToken: number;
  setSlToken: (value: number | ((prev: number) => number)) => void;

  rank: number;
  setRank: (rank: number) => void;

  monthlyPrize: MonthlyPrize;
  setMonthlyPrize: (monthlyPrize: MonthlyPrize) => void;

  weekAttendance: WeekAttendance;
  setWeekAttendance: (weekAttendance: WeekAttendance) => void;

  currentMiniGame: string;
  setCurrentMiniGame: (game: string) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  // 인증 관련 함수들
  login: (initData: string) => Promise<void>;
  signup: (initData: string, petType: 'DOG' | 'CAT') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;

  // 사용자 데이터 가져오기
  fetchUserData: () => Promise<void>;

  diceResult: number;
  rollDice: (gauge: number) => Promise<RollDiceResponseData>;

  diceRefilledAt: string | null;
  setDiceRefilledAt: (value: string | null) => void;

  items: Items;
  setItems: (items: Items) => void;

  boards: Board[];
  setBoards: (boards: Board[]) => void;

  refillDice: () => Promise<void>;
}

// 필요한 인터페이스 정의
interface Items {
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  timeDiceTimes: number;
  boardRewardTimes: number;
  ticketTimes: number;
  spinTimes: number; // 추가된 필드
  autoNftCount: number; // 추가된 필드
  rewardNftCount: number; // 추가된 필드
}

export interface Board {
  rewardAmount: number | null;
  tileType: 'HOME' | 'REWARD' | 'SPIN' | 'RPS' | 'MOVE' | 'JAIL';
  rewardType: 'STAR' | 'DICE' | null;
  sequence: number;
  moveType: 'SPIN' | 'RPS' | 'HOME' | 'ANYWHERE' | null;
}

interface Pet {
  type: 'DOG' | 'CAT' | null; // 수정된 부분: null 허용
  level: number | null; // 수정된 부분: null 허용
}

// 사용자 상태를 관리하는 Zustand 스토어 생성
export const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태 값 설정
  userId: null,
  setUserId: (userId) => set({ userId }),

  referrerId: null, // 추가된 부분: 초기값 설정
  setReferrerId: (referrerId) => set({ referrerId }), // 추가된 부분

  isAuto: false, // 추가된 부분: 초기값 설정
  setIsAuto: (isAuto) => set({ isAuto }), // 추가된 부분

  position: 0,
  setPosition: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      position: typeof value === 'function' ? value(state.position) : value,
    })),
    
  starPoints: 0,
  setStarPoints: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      starPoints: typeof value === 'function' ? value(state.starPoints) : value,
    })),

  diceCount: 0,
  setDiceCount: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      diceCount: typeof value === 'function' ? value(state.diceCount) : value,
    })),

  lotteryCount: 0,
  setLotteryCount: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      lotteryCount: typeof value === 'function' ? value(state.lotteryCount) : value,
    })),

  userLv: 1,
  setUserLv: (userLv) => set({ userLv }),

  characterType: null, // 수정된 부분: 초기값을 null로 설정
  setCharacterType: (type) => set({ characterType: type }), // 수정된 부분: null 허용

  slToken: 0,
  setSlToken: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      slToken: typeof value === "function" ? value(state.slToken) : value,
    })),

  rank: 0,
  setRank: (rank) => set({ rank }),

  monthlyPrize: {
    year: 0,
    month: 0,
    prizeType: '',
    amount: 0,
  },
  setMonthlyPrize: (monthlyPrize) => set({ monthlyPrize }),

  weekAttendance: {
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
    sat: null,
    sun: null,
  },
  setWeekAttendance: (weekAttendance) => set({ weekAttendance }),

  currentMiniGame: '',
  setCurrentMiniGame: (game) => set({ currentMiniGame: game }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  diceResult: 0,
  rollDice: async (gauge: number): Promise<RollDiceResponseData> => {
    set({ isLoading: true, error: null });
  
    const sequence = get().position; // 현재 위치 가져오기
  
    try {
      const data = await rollDiceAPI(gauge, sequence);
  
      // 상태 업데이트를 여기서 하지 않고, 데이터만 반환합니다.
      set({
        rank: data.rank,
        starPoints: data.star,
        lotteryCount: data.ticket,
        diceCount: data.dice,
        slToken: data.slToken,
        isLoading: false,
        error: null,
        // position: data.tileSequence, // position 업데이트는 나중에
      });
  
      return data; // 데이터를 반환합니다.
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Roll dice failed' });
      throw error;
    }
  },

  diceRefilledAt: null,
  setDiceRefilledAt: (value) => set({ diceRefilledAt: value }),

  items: {
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    timeDiceTimes: 1,
    boardRewardTimes: 1,
    ticketTimes: 1,
    spinTimes: 1, // 추가된 필드 초기값 설정
    autoNftCount: 0, // 추가된 필드 초기값 설정
    rewardNftCount: 0, // 추가된 필드 초기값 설정
  },
  setItems: (items) => set({ items }),

  boards: [],
  setBoards: (boards) => set({ boards }),

  // 사용자 데이터 설정 함수
  fetchUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchHomeData();
      if (!data) {
        throw new Error('No data returned from /home API');
      }
  
      // 서버 응답에서 필요한 데이터 추출
      const {
        user,
        nowDice,
        rank,
        pet,
        monthlyPrize,
        weekAttendance,
        items,
        boards,
      } = data;
  
      set({
        userId: user.userId,
        referrerId: user.referrerId, // 추가된 부분: referrerId 설정
        isAuto: user.isAuto, // 추가된 부분: isAuto 설정

        position: nowDice.tileSequence,
        diceCount: nowDice.dice,
        starPoints: rank.star,
        lotteryCount: rank.ticket,
        userLv: pet.level || 1, // pet.level이 null일 경우 기본값 1
        characterType: pet.type ? pet.type.toLowerCase() as 'dog' | 'cat' : null, // 수정된 부분: pet.type이 null일 수 있음

        slToken: rank.slToken,
        rank: rank.rank,
        diceRefilledAt: rank.diceRefilledAt, // 추가된 부분: diceRefilledAt 설정

        items: {
          goldCount: items.goldCount || 0,
          silverCount: items.silverCount || 0,
          bronzeCount: items.bronzeCount || 0,
          timeDiceTimes: items.timeDiceTimes || 1,
          boardRewardTimes: items.boardRewardTimes || 1,
          ticketTimes: items.ticketTimes || 1,
          spinTimes: items.spinTimes || 1, // 추가된 필드 설정
          autoNftCount: items.autoNftCount || 0, // 추가된 필드 설정
          rewardNftCount: items.rewardNftCount || 0, // 추가된 필드 설정
        },

        boards: boards,

        monthlyPrize: {
          year: monthlyPrize.year,
          month: monthlyPrize.month,
          prizeType: monthlyPrize.prizeType,
          amount: monthlyPrize.amount,
        },

        weekAttendance: {
          mon: weekAttendance.mon,
          tue: weekAttendance.tue,
          wed: weekAttendance.wed,
          thu: weekAttendance.thu,
          fri: weekAttendance.fri,
          sat: weekAttendance.sat,
          sun: weekAttendance.sun,
        },

        isLoading: false,
        error: null,
      });

      console.log("fetchUserData - 데이터 업데이트 완료:", {
        userId: user.userId,
        referrerId: user.referrerId, // 추가된 부분
        isAuto: user.isAuto, // 추가된 부분
        position: nowDice.tileSequence,
        diceCount: nowDice.dice,
        starPoints: rank.star,
        lotteryCount: rank.ticket,
        userLv: pet.level,
        characterType: pet.type ? pet.type.toLowerCase() as 'dog' | 'cat' : null, // 수정된 부분
        slToken: rank.slToken,
        rank: rank.rank,
        diceRefilledAt: rank.diceRefilledAt, // 추가된 부분
        items: {
          goldCount: items.goldCount || 0,
          silverCount: items.silverCount || 0,
          bronzeCount: items.bronzeCount || 0,
          timeDiceTimes: items.timeDiceTimes || 0,
          boardRewardTimes: items.boardRewardTimes || 0,
          ticketTimes: items.ticketTimes || 0,
          spinTimes: items.spinTimes || 0, // 추가된 필드 설정
          autoNftCount: items.autoNftCount || 0, // 추가된 필드 설정
          rewardNftCount: items.rewardNftCount || 0, // 추가된 필드 설정
        },
        boards: boards,
        monthlyPrize: {
          year: monthlyPrize.year,
          month: monthlyPrize.month,
          prizeType: monthlyPrize.prizeType,
          amount: monthlyPrize.amount,
        },
        weekAttendance: weekAttendance,
      });
    } catch (error: any) {
      console.error('fetchUserData 실패:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // 로그인 함수
  login: async (initData: string): Promise<void> => {
    console.log('Step: login 시작, initData:', initData);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { initData });

      if (response.data.code === 'OK') {
        const { userId, accessToken, refreshToken } = response.data.data;
        console.log('Step: login 성공, userId:', userId);
        // 토큰 및 userId 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ userId });

        // 사용자 데이터 가져오기
        await get().fetchUserData();
        set({ isLoading: false, error: null });
      } else if (response.data.code === 'ENTITY_NOT_FOUND') {
        console.warn('Step: login 응답 코드 ENTITY_NOT_FOUND:', response.data.message);
        throw new Error(response.data.message || 'User not found');
      } else {
        console.warn('Step: login 응답 코드가 OK가 아님:', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Step: login 실패:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        // 서버가 응답을 했지만, 상태 코드가 2xx가 아닌 경우
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // 요청이 이루어졌으나, 응답을 받지 못한 경우
        errorMessage = 'No response from server. Please try again later.';
      } else {
        // 다른 에러
        errorMessage = error.message;
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage); // 에러를 다시 던져 호출한 쪽에서 인지할 수 있도록 함
    }
  },

  // 회원가입 함수
  signup: async (initData: string, petType: 'DOG' | 'CAT'): Promise<void> => {
    console.log('Step: signup 시작, initData:', initData, 'petType:', petType);
    set({ isLoading: true, error: null });
    try {
      // 회원가입 요청 보내기
      await api.post('/auth/signup', { initData, petType });

      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.error('Step: signup 실패:', error);
      let errorMessage = 'Signup failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage); // 에러를 다시 던져 호출한 쪽에서 인지할 수 있도록 함
    }
  },

  // 로그아웃 함수
  logout: () => {
    console.log('Step: logout 실행. 토큰 및 userId 제거 및 상태 초기화.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); // 추가된 부분: refreshToken 제거
    set({
      userId: null,
      referrerId: null, // 추가된 부분: referrerId 초기화
      isAuto: false, // 추가된 부분: isAuto 초기화
      position: 0,
      diceCount: 0,
      starPoints: 0,
      lotteryCount: 0,
      userLv: 1,
      characterType: null, // 수정된 부분: characterType 초기화
      slToken: 0,
      rank: 0,
      monthlyPrize: {
        year: 0,
        month: 0,
        prizeType: '',
        amount: 0,
      },
      weekAttendance: {
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
        sun: null,
      },
      currentMiniGame: '',
      isLoading: false,
      error: null,
      items: {
        goldCount: 0,
        silverCount: 0,
        bronzeCount: 0,
        timeDiceTimes: 0,
        boardRewardTimes: 0,
        ticketTimes: 0,
        spinTimes: 0, // 추가된 필드 초기화
        autoNftCount: 0, // 추가된 필드 초기화
        rewardNftCount: 0, // 추가된 필드 초기화
      },
      boards: [],
    });
  },

  // 토큰 갱신 함수
  refreshToken: async (): Promise<boolean> => {
    console.log('Step: refreshToken 시작');
    try {
      const response = await api.get('/auth/refresh');
      console.log('Step: refreshToken 응답:', response);
  
      const newAccessToken = response.headers['authorization'];
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken.replace('Bearer ', ''));
        console.log('Step: 새로운 accessToken 저장 완료');
        return true;
      } else {
        console.warn('Step: Authorization 헤더가 없습니다.');
        throw new Error('Token refresh failed: Authorization header is missing');
      }
    } catch (error: any) {
      console.error('Step: refreshToken 실패:', error);
      // Refresh 실패 시 로그아웃 처리
      get().logout();
      set({ error: 'Token refresh failed. Please log in again.' });
      return false;
    }
  },  

  refillDice: async () => {
    set({ error: null });
    try {
      const data: RollDiceResponseData = await refillDiceAPI();

      // 주사위 리필 후 사용자 데이터 갱신
      await get().fetchUserData();

      console.log('주사위 리필 성공:', data);
    } catch (error: any) {
      console.error('주사위 리필 중 에러 발생:', error);
      set({ error: error.message || '주사위 리필에 실패했습니다.' });
      throw error; // 에러를 다시 던져 컴포넌트에서 처리할 수 있도록 함
    }
  },

}));
