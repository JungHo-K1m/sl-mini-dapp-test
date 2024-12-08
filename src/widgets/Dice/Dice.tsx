// src/widgets/Dice.tsx

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { motion, useAnimation } from "framer-motion";
import "./Dice.css";
import Images from "@/shared/assets/images";
import { rollDiceAPI, RollDiceResponseData } from "@/features/DiceEvent/api/rollDiceApi";
import { useUserStore } from '@/entities/User/model/userModel';

interface DiceProps {
  onRollComplete?: (value: number, data: RollDiceResponseData) => void;
  gaugeValue: number;
}

const Dice = forwardRef(({ onRollComplete, gaugeValue }: DiceProps, ref) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState({ rotateX: -30, rotateY: 30 });
  const [faceOrder, setFaceOrder] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [isRolling, setIsRolling] = useState(false);

  // useUserStore에서 현재 위치와 isAuto 상태 가져오기
  const { position, isAuto } = useUserStore();

  useImperativeHandle(ref, () => ({
    roll: () => handleRoll(),
  }));

  const handleRoll = async () => {
    if (isRolling) return;

    setIsRolling(true);

    try {
      // isAuto가 true일 때는 게이지 값을 0부터 6까지의 랜덤 정수로 설정
      const currentGaugeValue = isAuto ? Math.floor(Math.random() * 7) : gaugeValue;

      // 서버에 주사위 결과 요청 시 현재 위치와 랜덤한 gaugeValue 전달
      const data = await rollDiceAPI(currentGaugeValue, position);
      const targetFace = data.diceResult;

      // 애니메이션 처리
      const randomX = (Math.floor(Math.random() * 4) + 1) * 360;
      const randomY = (Math.floor(Math.random() * 4) + 1) * 360;

      await controls.start({
        y: [0, -100, 0],
        rotateX: [
          rotation.rotateX,
          rotation.rotateX + randomX,
          rotation.rotateX + randomX + 360,
        ],
        rotateY: [
          rotation.rotateY,
          rotation.rotateY + randomY,
          rotation.rotateY + randomY + 360,
        ],
        transition: {
          duration: 1,
          ease: "linear",
        },
      });

      setRotation({ rotateX: -30, rotateY: 30 });

      const newFaceOrder = Array.from({ length: 6 }, (_, i) => i + 1).filter(
        (face) => face !== targetFace
      );
      newFaceOrder.splice(4, 0, targetFace);

      setFaceOrder(newFaceOrder);

      setIsRolling(false);

      if (onRollComplete) {
        onRollComplete(targetFace, data); // gaugeValue 대신 data 전달
      }
    } catch (error) {
      console.error("주사위 굴리기 오류:", error);
      alert("Another connection has been detected. The game will restart.");
      window.location.reload();
      setIsRolling(false);
    }
  };

  const getFaceImage = (face: number) => {
    switch (face) {
      case 1:
        return Images.Dice1;
      case 2:
        return Images.Dice2;
      case 3:
        return Images.Dice3;
      case 4:
        return Images.Dice4;
      case 5:
        return Images.Dice5;
      case 6:
        return Images.Dice6;
      default:
        return Images.Dice1;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-16 h-screen">
      <div className="scene">
        <motion.div
          className="cube"
          animate={controls}
          initial={{ rotateX: rotation.rotateX, rotateY: rotation.rotateY }}
        >
          <div className="cube__face cube__face--front">
            <img src={getFaceImage(faceOrder[0])} alt="1" />
          </div>
          <div className="cube__face cube__face--back">
            <img src={getFaceImage(faceOrder[1])} alt="2" />
          </div>
          <div className="cube__face cube__face--right">
            <img src={getFaceImage(faceOrder[2])} alt="3" />
          </div>
          <div className="cube__face cube__face--left">
            <img src={getFaceImage(faceOrder[3])} alt="4" />
          </div>
          <div className="cube__face cube__face--top">
            <img src={getFaceImage(faceOrder[4])} alt="5" />
          </div>
          <div className="cube__face cube__face--bottom">
            <img src={getFaceImage(faceOrder[5])} alt="6" />
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default Dice;
