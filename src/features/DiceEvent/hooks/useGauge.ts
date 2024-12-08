// src/features/DiceEvent/hooks/useGauge.ts
import { useEffect, useState } from 'react';
import useGaugeStore from '../store/useGaugeStore';

const useGauge = () => {
  const { gaugeValue, setGaugeValue } = useGaugeStore();
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isIncreasing, setIsIncreasing] = useState<boolean>(true);

  useEffect(() => {
    let interval: number | undefined;

    if (isHolding) {
      interval = window.setInterval(() => {
        setGaugeValue((prevValue) => {
          let newValue = isIncreasing ? prevValue + 0.25 : prevValue - 0.25;
          
          // Gauge bounds and direction control
          if (newValue >= 6) {
            newValue = 6;
            setIsIncreasing(false);
          } else if (newValue <= 0) {
            newValue = 0;
            setIsIncreasing(true);
          }

          return newValue;
        });
      }, 21);
    } else if (interval !== undefined) {
      window.clearInterval(interval);
    }

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isHolding, isIncreasing, setGaugeValue]);

  return { gaugeValue, isHolding, setIsHolding };
};

export default useGauge;
