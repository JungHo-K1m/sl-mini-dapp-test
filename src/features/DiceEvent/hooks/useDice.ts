// src/features/DiceEvent/hooks/useDice.ts
import { useState, useRef } from 'react';
import useGaugeStore from '../store/useGaugeStore'; // 수정된 스토어 경로를 사용하세요.

const useDice = () => {
  const diceRef = useRef<any>(null);
  const [diceValue, setDiceValue] = useState<number>(0);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const { gaugeValue } = useGaugeStore(); // zustand 전역 상태 참조

  const rollDice = () => {
    setButtonDisabled(true);
    diceRef.current?.roll();
  };

  const handleRollComplete = (value: number) => {
    setDiceValue(value);
    setButtonDisabled(false);
    console.log("Gauge Value after rolling dice:", gaugeValue); // 최신 게이지 값 출력
  };

  return {
    diceRef,
    diceValue,
    rollDice,
    handleRollComplete,
    buttonDisabled,
    setButtonDisabled,
  };
};

export default useDice;
