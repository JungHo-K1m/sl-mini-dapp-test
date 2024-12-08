// src/pages/DiceEvent/useDiceGame.ts

import { useState, useCallback, useRef } from "react";
import { useGauge } from "@/features/DiceEvent";
import { useRPSGameStore } from "../RPSGame/store";
import { useUserStore, Board } from "@/entities/User/model/userModel"; // 'Board' 임포트 추가
import { anywhereAPI } from "@/features/DiceEvent/api/anywhereApi";
import { RollDiceResponseData } from '@/features/DiceEvent/api/rollDiceApi';

export interface Reward {
  type: string;
  value: number;
  top: string;
  left: string;
}

export const useDiceGame = () => {
  const {
    position,
    setPosition,
    diceCount,
    setDiceCount,
    starPoints,
    setStarPoints,
    lotteryCount,
    setLotteryCount,
    userLv,
    setRank,
    setSlToken,
    error,
    setError,
    isAuto, // isAuto 상태 추가
    setIsAuto,
    boards, // boards 디스트럭처링 추가
    items, // items 디스트럭처링 추가
  } = useUserStore();

  const [moving, setMoving] = useState<boolean>(false);
  const [selectingTile, setSelectingTile] = useState<boolean>(false);
  const [showDiceValue, setShowDiceValue] = useState<boolean>(false);
  const [rolledValue, setRolledValue] = useState<number>(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const [tileSequence, setTileSequence] = useState<number>(position);

  // RPS 게임 및 스핀 게임 상태
  const [isRPSGameActive, setIsRPSGameActive] = useState(false);
  const [isSpinGameActive, setIsSpinGameActive] = useState(false);

  // 주사위 굴리는 중인지 상태
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  // "LUCKY" 이미지 표시 상태
  const [isLuckyVisible, setIsLuckyVisible] = useState<boolean>(false);

  // RPS 게임 스토어 사용
  const rpsGameStore = useRPSGameStore();

  // 주사위 참조
  const diceRef = useRef<any>(null);
  const { gaugeValue, isHolding, setIsHolding } = useGauge();

  // 보상 표시 함수
  const showReward = useCallback((type: string, value: number) => {
    const randomTop = `${Math.random() * 80 + 10}%`;
    const randomLeft = `${Math.random() * 80 + 10}%`;
    setReward({ type, value, top: randomTop, left: randomLeft });
    setTimeout(() => {
      setReward(null);
    }, 1000);
  }, []);

  // gauge value to expected dice value mapping
  const getExpectedDiceValue = useCallback((gaugeValue: number): number => {
    if (gaugeValue >= 0 && gaugeValue < 1.25) return 1;
    if (gaugeValue >= 1.25 && gaugeValue < 2.25) return 2;
    if (gaugeValue >= 2.25 && gaugeValue < 3.25) return 3;
    if (gaugeValue >= 3.25 && gaugeValue < 4.25) return 4;
    if (gaugeValue >= 4.25 && gaugeValue < 5.25) return 5;
    if (gaugeValue >= 5.25 && gaugeValue <= 6) return 6;
    return 0; // default or handle out of range
  }, []);

  // 이동 함수 - 보상 적용 제거
  const movePiece = useCallback(
    (
      startPosition: number,
      endPosition: number,
      onMoveComplete: (finalPosition: number) => void
    ) => {
      setMoving(true);
      console.log('movePiece 호출됨:', startPosition, endPosition);
      let currentPosition = startPosition;

      const moveStep = () => {
        currentPosition = (currentPosition + 1) % 20;

        setPosition(currentPosition);

        if (currentPosition === 0) {
          // 홈을 지났을 때 래플권만 증가
          showReward('lottery', 1);
        }

        if (currentPosition !== endPosition) {
          setTimeout(moveStep, 300);
        } else {
          // 보상 적용 제거
          // applyReward(currentPosition);

          switch (currentPosition) {
            case 2:
              setTimeout(() => {
                setPosition(15);
                setMoving(false);
                onMoveComplete(15); // 최종 위치 전달
              }, 300);
              break;
            case 8:
              setTimeout(() => {
                // 홈을 지났을 때 래플권만 증가
                setPosition(5);
                setMoving(false);
                onMoveComplete(5); // 최종 위치 전달
              }, 300);
              break;
            case 13:
              setTimeout(() => {
                setPosition(0);
                // applyReward(0)를 제거하여 중복 보상 방지
                setMoving(false);
                onMoveComplete(0); // 최종 위치 전달
              }, 300);
              break;
            case 18:
              if (!isAuto) { // isAuto가 false일 때만 활성화
                setSelectingTile(true);
              }
              setMoving(false);
              onMoveComplete(18); // 최종 위치 전달
              break;
            default:
              setMoving(false);
              onMoveComplete(currentPosition); // 최종 위치 전달
              break;
          }
        }
      };
      moveStep();
    },
    [
      setMoving,
      setPosition,
      setSelectingTile,
      showReward,
      setLotteryCount,
      isAuto, // isAuto 의존성 추가
    ]
  );

  // 주사위 결과 처리 함수 - 보상 중복 적용 제거
  const handleRollComplete = useCallback(
    (value: number, data: RollDiceResponseData) => {
      console.log('handleRollComplete 호출됨');

      const previousPosition = position; // 이전 위치 저장
      const newPosition = data.tileSequence; // 서버에서 받은 새로운 위치

      // 서버 응답 데이터를 상태에 업데이트
      setRank(data.rank);
      setStarPoints(data.star);
      setLotteryCount(data.ticket);
      setDiceCount(data.dice);
      setSlToken(data.slToken);
      setPosition(newPosition); // 여기서 position 업데이트

      // 주사위를 굴렸으므로 diceCount는 이미 업데이트 되었으므로 추가 감소 없음
      // setDiceCount((prev) => prev - 1); // 제거

      // 주사위 값 및 애니메이션 처리
      setShowDiceValue(true);
      setRolledValue(value);
      setTimeout(() => {
        setShowDiceValue(false);
      }, 1000);
      setButtonDisabled(true);

      // "LUCKY" 이미지 표시 조건 확인 (isAuto가 false인 경우에만)
      const expectedDiceValue = getExpectedDiceValue(gaugeValue);
      if (!isAuto && value === expectedDiceValue) {
        setIsLuckyVisible(true);
        setTimeout(() => setIsLuckyVisible(false), 800); //0.8초 후 사라짐
      }

      movePiece(previousPosition, newPosition, (finalPosition) => {
        // 타일 데이터 가져오기
        const tileData = boards.find((tile: Board) => tile.sequence === finalPosition);

        if (tileData?.tileType === 'REWARD' && tileData.rewardType && tileData.rewardAmount) {
          showReward(tileData.rewardType, tileData.rewardAmount);
        }

        if (isAuto && [5, 15, 18].includes(finalPosition)) {
          // Auto 모드이고 특정 타일에 도착했을 때 게임을 활성화하지 않음
          console.log(`Auto 모드: 타일 ${finalPosition} 도착, 게임 활성화 건너뜀`);
          setButtonDisabled(false);
        } else {
          // Auto 모드가 아니거나 특정 타일이 아닌 경우 기존 로직 수행
          switch (finalPosition) {
            case 5:
              setIsRPSGameActive(true);
              rpsGameStore.fetchAllowedBetting();
              break;
            case 15:
              setIsSpinGameActive(true);
              break;
            case 18:
              setSelectingTile(true);
              break;
            default:
              setButtonDisabled(false);
              break;
          }
        }
        setIsRolling(false); // 주사위 굴리기 완료 후 상태 리셋
      });
    },
    [
      position,
      setPosition,
      setRank,
      setStarPoints,
      setLotteryCount,
      setDiceCount,
      setSlToken,
      movePiece,
      setButtonDisabled,
      setRolledValue,
      setShowDiceValue,
      setIsRPSGameActive,
      setIsSpinGameActive,
      setIsRolling,
      getExpectedDiceValue,
      setIsLuckyVisible,
      gaugeValue,
      rpsGameStore,
      isAuto, // isAuto 추가
      boards, // boards 추가
    ]
  );

  // 주사위 굴리기 함수
  const rollDice = useCallback(() => {
    if (diceCount > 0 && !isRolling) {
      setIsRolling(true);
      setButtonDisabled(true);
      diceRef.current?.roll(); // Dice 컴포넌트의 roll 메소드 호출
    }
  }, [diceCount, isRolling]);

  const handleTileClick = useCallback(
    async (tileId: number) => {
      if (!selectingTile || tileId === 18) return; // 타일 18 클릭 시 아무 동작도 하지 않음

      try {
        setButtonDisabled(true); // 버튼 비활성화
        setMoving(true); // 이동 중 상태 설정

        // anywhereAPI 호출
        const data = await anywhereAPI(tileId);
        console.log('Move via airplane successful:', data);

        // 서버로부터 받은 데이터로 상태 업데이트
        setRank(data.rank);
        setLotteryCount(data.ticket);
        setDiceCount(data.dice);
        setSlToken(data.slToken);
        setRolledValue(data.diceResult);
        setPosition(data.tileSequence);

        // 필요한 경우 추가적인 보상 처리
        // applyReward(tileId); // 제거

        // 타일 5와 15에 따른 게임 활성화
        if (tileId === 5) {
          setIsRPSGameActive(true); // RPSGame 활성화
          setIsSpinGameActive(false); // SpinGame 비활성화
          rpsGameStore.fetchAllowedBetting(); // RPSGame의 베팅 가능 금액 가져오기
          console.log("RPSGame 활성화됨 (타일 5 클릭).");
        } else if (tileId === 15) {
          setIsSpinGameActive(true); // SpinGame 활성화
          setIsRPSGameActive(false); // RPSGame 비활성화
          console.log("SpinGame 활성화됨 (타일 15 클릭).");
        }

      } catch (error: any) {
        console.error('Error moving via airplane:', error);
        // 에러 처리 (예: 사용자에게 알림)
        // window.location.reload(); // 제거하여 페이지 새로고침 방지
        setError(error.message || 'Airplane 이동에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setSelectingTile(false);
        setMoving(false);
        setButtonDisabled(false);
      }
    },
    [
      selectingTile,
      setButtonDisabled,
      setMoving,
      setRank,
      setLotteryCount,
      setDiceCount,
      setSlToken,
      setRolledValue,
      setPosition,
      setIsRPSGameActive,
      setIsSpinGameActive,
      rpsGameStore,
      setError,
      isAuto, // isAuto 필요 시 추가
      boards, // boards 필요 시 추가
    ]
  );

  // RPS 게임 종료 처리 함수
  const handleRPSGameEnd = useCallback(
    (result: "win" | "lose", winnings: number) => {
      console.log(`useDiceGame - RPS Game Ended: ${result}, Winnings: ${winnings}`);
      setIsRPSGameActive(false);
      setSelectingTile(false);
      setButtonDisabled(false);
      setMoving(false);

      if (result === "win") {
        // 이미 userStore에서 포인트가 업데이트 되었으므로 별도의 업데이트는 필요 없음
        // 추가적인 로직이 필요하다면 여기서 구현
      }

      // 필요시 추가적인 주사위 게임 복귀 로직
    },
    []
  );

  // 스핀 게임 종료 처리 함수
  const handleSpinGameEnd = useCallback(() => {
    setIsSpinGameActive(false);
    setSelectingTile(false);
    setButtonDisabled(false);
    setMoving(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!buttonDisabled && diceCount > 0) {
      setIsHolding(true);
    }
  }, [buttonDisabled, diceCount, setIsHolding]);

  const handleMouseUp = useCallback(() => {
    setIsHolding(false);
    if (!buttonDisabled && diceCount > 0) {
      rollDice();
    }
  }, [buttonDisabled, diceCount, rollDice, setIsHolding]);

  return {
    position,
    moving,
    selectingTile,
    diceCount,
    lotteryCount,
    showDiceValue,
    rolledValue,
    reward,
    diceRef,
    buttonDisabled,
    gaugeValue,
    isHolding,
    userLv,
    showReward,
    handleRollComplete,
    handleTileClick,
    handleMouseDown,
    handleMouseUp,
    setPosition,
    setMoving,
    setSelectingTile,
    setShowDiceValue,
    setRolledValue,
    setReward,
    setButtonDisabled,
    isRPSGameActive,
    isSpinGameActive,
    handleRPSGameEnd, // 노출
    handleSpinGameEnd,
    rollDice,
    setDiceCount,
    setLotteryCount,
    setRank,
    setSlToken,
    isLuckyVisible, // expose the new state
    error, // 에러 상태 노출
    setIsAuto,
    isAuto,
  };
};

export default useDiceGame;
