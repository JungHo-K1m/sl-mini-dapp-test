// src/pages/DiceEvent/GameBoard.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tile from "./tile";
import { StarTile, DiceTile, AirplaneTile, Gauge } from "@/features/DiceEvent";
import Dice from "@/widgets/Dice";
import { BsDice5Fill } from "react-icons/bs";
import Images from "@/shared/assets/images";
import { Switch } from "@/shared/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui";
import { IoDice, IoGameController, IoTicket } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useUserStore } from "@/entities/User/model/userModel";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc"; // UTC 플러그인 추가
import { RollDiceResponseData } from "@/features/DiceEvent/api/rollDiceApi";
import NFTRewardList from "@/widgets/NFTRewardCard";
import { PiSpinnerBallFill } from "react-icons/pi";
import { formatNumber } from "@/shared/utils/formatNumber";
import { FaBookTanakh  } from "react-icons/fa6";
import { useTour } from "@reactour/tour";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

dayjs.extend(duration);
dayjs.extend(utc); // UTC 플러그인 적용
dayjs.extend(timezone); // 타임존 플러그인 적용

interface GameBoardProps {
  position: number;
  selectingTile: boolean;
  handleTileClick: (tileId: number) => void;
  gaugeValue: number;
  diceCount: number;
  showDiceValue: boolean;
  rolledValue: number;
  buttonDisabled: boolean;
  diceRef: React.RefObject<any>;
  handleRollComplete: (value: number, data: RollDiceResponseData) => void;
  reward: { type: string; value: number; top: string; left: string } | null;
  isHolding: boolean;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  isLuckyVisible: boolean;
  rollDice: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  position,
  selectingTile,
  handleTileClick,
  gaugeValue,
  diceCount,
  showDiceValue,
  rolledValue,
  buttonDisabled,
  diceRef,
  handleRollComplete,
  reward,
  isHolding,
  handleMouseDown,
  handleMouseUp,
  isLuckyVisible,
  rollDice,
}) => {
  // Zustand 스토어에서 필요한 상태와 함수 가져오기
  const {
    items,
    diceRefilledAt,
    boards,
    fetchUserData,
    completeTutorial,
    error,
    isAuto,
    setIsAuto,
    refillDice, // refillDice 함수 추가
    addGoldItem,
    removeGoldItem,
    addSilverItem,
    removeSilverItem,
    addBronzeItem,
    removeBronzeItem,
    addRewardItem,
    removeRewardItem,
    addAutoItem,
    removeAutoItem,
    addAllItems,
    addDice,
    addSLToken,
    removeDice,
    removeSLToken,
    autoSwitch,
  } = useUserStore();
  const [timeUntilRefill, setTimeUntilRefill] = useState("");
  const [isRefilling, setIsRefilling] = useState(false); // 리필 중 상태 관리
  const {setIsOpen} = useTour();
  const { playSfx } = useSound();

  // timeUntilRefill 최신값을 보관할 ref 생성
  const timeUntilRefillRef = useRef(timeUntilRefill);

  // timeUntilRefill이 변경될 때마다 ref.current에 최신 값 반영
  useEffect(() => {
    timeUntilRefillRef.current = timeUntilRefill;
  }, [timeUntilRefill]);

  useEffect(() => {
    // completeTutorial가 false일 때만 setIsOpen(true) 실행
    if (!completeTutorial) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [completeTutorial, setIsOpen]);
  


    // Refill Dice API 호출 함수
  const handleRefillDice = async () => {
    // 소리 추가
    playSfx(Audios.button_click);

    try {
      setIsRefilling(true);
      await refillDice();
      // refillDice 호출 후 fetchUserData를 통해 diceRefilledAt이 갱신된다고 가정
      // 여기서 별도로 diceRefilledAt을 조정할 필요 없음
      setIsRefilling(false);
      playSfx(Audios.reward);
    } catch (error: any) {
      console.error("주사위 리필 실패:", error);
      setIsRefilling(false);
    }
  };

  const handleAutoSwitch = async () => {
    // 소리 추가
    playSfx(Audios.button_click);
    
    try {
      await autoSwitch();
    } catch (error: any) {
      console.error("오토 스위치 변경 실패:", error);
    }
  };

  useEffect(() => {
    const updateRefillTime = () => {
      if (diceRefilledAt) {
        const refillTime = dayjs.tz(diceRefilledAt, "Asia/Seoul");
        const now = dayjs().tz("Asia/Seoul");
        const diff = refillTime.diff(now);

        if (diff <= 0 && diceCount === 0) {
          setTimeUntilRefill("Refill dice");
        } else if (diff > 0) {
          const remainingDuration = dayjs.duration(diff);
          const minutes = remainingDuration.minutes();
          const seconds = remainingDuration.seconds();
          setTimeUntilRefill(`${minutes}m ${seconds}s`);
        } else {
          setTimeUntilRefill("Waiting");
        }
      } else {
        setTimeUntilRefill("Waiting");
      }
    };

    updateRefillTime();
    const interval = setInterval(updateRefillTime, 1000);
    return () => clearInterval(interval);
  }, [diceRefilledAt, diceCount]); 
  // fetchUserData, items.autoNftCount 의존성 제거(필요하면 남기되 최소화)

  useEffect(() => {
    let autoInterval: NodeJS.Timeout;

    if (isAuto) {
      autoInterval = setInterval(() => {
        // 이곳에서 최신 timeUntilRefill 값 참조
        const currentTimeUntilRefill = timeUntilRefillRef.current; 

        if (diceCount > 0 && !buttonDisabled) {
          // diceRef.current?.roll();
          rollDice();
        } else if (diceCount === 0) {
          if (currentTimeUntilRefill === "Refill dice" && !isRefilling) {
            handleRefillDice().catch((err) => console.error("오토 리필 실패:", err));
          } else {
          }
        }
      }, 1000);
    } 

    return () => {
      if (autoInterval) {
        clearInterval(autoInterval);
      }
    };
  }, [isAuto, diceCount, buttonDisabled, rollDice, isRefilling]); 
  // timeUntilRefill 제거


  // Mapping from front-end tile IDs to server tile sequences
  const tileIdToSequenceMap: { [key: number]: number } = {
    // Front-end tile ID: Server tile sequence
    10: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    11: 11,
    4: 4,
    12: 12,
    3: 3,
    13: 13,
    2: 2,
    14: 14,
    1: 1,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    0: 0,
  };

  const renderTile = (id: number) => {
    const sequence = tileIdToSequenceMap[id];
    const tileData = boards.find((tile) => tile.sequence === sequence);

    let content: React.ReactNode = null;
    let dataStar = "0";
    let dataDice = "0";

    if (tileData) {
      switch (tileData.tileType) {
        case "HOME":
          content = "Home";
          break;
        case "REWARD":
          if (tileData.rewardType === "STAR") {
            content = <StarTile count={tileData.rewardAmount || 0} />;
            dataStar = (tileData.rewardAmount || 0).toString();
          } else if (tileData.rewardType === "DICE") {
            content = <DiceTile count={tileData.rewardAmount || 0} />;
            dataDice = (tileData.rewardAmount || 0).toString();
          }
          break;
        case "SPIN":
          content = (
            <img
              src={Images.SpinImage}
              alt="Spin"
              className="z-0 w-[41px] h-[41px]"
            />
          );
          break;
        case "RPS":
          content = (
            <img
              src={Images.RPSImage}
              alt="RPS"
              className="z-0 w-[51px] h-[51px]"
            />
          );
          break;
        case "MOVE":
          content = <AirplaneTile text={tileData.moveType || ""} />;
          break;
        case "JAIL":
          content = (
            <img
              src={Images.DesertIsland}
              alt="Jail"
              className="z-0 w-[41px] h-[41px]"
            />
          );
          break;
        default:
          content = null;
      }
    }

    return (
      <Tile
        key={id}
        id={id}
        onClick={() => handleTileClick(id)}
        position={position}
        selectingTile={selectingTile}
        data-star={dataStar}
        data-dice={dataDice}
      >
        {content}
      </Tile>
    );
  };



  // 테스트용 아이템 추가/삭제 핸들러
  const handleAddGold = async () => {
    try {
      await addGoldItem();
      alert("Gold NFT가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("Gold NFT 추가에 실패했습니다.");
      // 에러는 useUserStore에서 처리하므로 여기서는 별도 처리 불필요
    }
  };

  const handleRemoveGold = async () => {
    try {
      await removeGoldItem();
      alert("Gold NFT가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("Gold NFT 삭제에 실패했습니다.");
    }
  };

  const handleAddSilver = async () => {
    try {
      await addSilverItem();
      alert("Silver NFT가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("Silver NFT 추가에 실패했습니다.");
    }
  };

  const handleRemoveSilver = async () => {
    try {
      await removeSilverItem();
      alert("Silver NFT가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("Silver NFT 삭제에 실패했습니다.");
    }
  };

  const handleAddBronze = async () => {
    try {
      await addBronzeItem();
      alert("Bronze NFT가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("Bronze NFT 추가에 실패했습니다.");
    }
  };

  const handleRemoveBronze = async () => {
    try {
      await removeBronzeItem();
      alert("Bronze NFT가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("Bronze NFT 삭제에 실패했습니다.");
    }
  };

  const handleAddReward = async () => {
    try {
      await addRewardItem();
      alert("Reward NFT가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("Reward NFT 추가에 실패했습니다.");
    }
  };

  const handleRemoveReward = async () => {
    try {
      await removeRewardItem();
      alert("Reward NFT가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("Reward NFT 삭제에 실패했습니다.");
    }
  };

  const handleAddAuto = async () => {
    try {
      await addAutoItem();
      alert("Auto NFT가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("Auto NFT 추가에 실패했습니다.");
    }
  };

  const handleRemoveAuto = async () => {
    try {
      await removeAutoItem();
      alert("Auto NFT가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("Auto NFT 삭제에 실패했습니다.");
    }
  };

  const handleAddAll = async () => {
    try {
      await addAllItems();
      alert("모든 NFT가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("모든 NFT 추가에 실패했습니다.");
    }
  };

  const handleAddDice = async () => {
    try {
      await addDice();
      alert("주사위가 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("주사위 추가에 실패했습니다.");
    }
  };

  const handleRemoveDice = async () => {
    try {
      await removeDice();
      alert("주사위가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("주사위 삭제에 실패했습니다.");
    }
  };

  const handleAddSLToken = async () => {
    try {
      await addSLToken();
      alert("SL Token이 성공적으로 추가되었습니다!");
    } catch (error) {
      alert("SL Token 추가에 실패했습니다.");
    }
  };

  const handleRemoveSLToken = async () => {
    try {
      await removeSLToken();
      alert("SL Token이 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("SL Token 삭제에 실패했습니다.");
    }
  };

  
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-1 text-xs md:text-base relative">
      {/* 에러 메시지 표시 */}
      {error && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 text-center z-50">
          {error}
        </div>
      )}

      {/* Tile rendering */}
      {renderTile(10)}
      {renderTile(9)}
      {renderTile(8)}
      {renderTile(7)}
      {renderTile(6)}
      {renderTile(5)}
      {renderTile(11)}

      {/* Central board */}
      <div className="col-span-4 row-span-4 flex flex-col items-center justify-evenly bg-center rotate-background">
        <div  className="w-full flex justify-center mb-4">
          <Gauge  gaugeValue={gaugeValue} />
        </div>
        <div className="relative w-[120px] h-[120px] bg-[#F59E0B] rounded-full md:w-44 md:h-44">
          <AnimatePresence>
            {showDiceValue && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 }}
                className="absolute flex items-center justify-center w-24 h-24 bg-white rounded-full text-black text-4xl font-bold -top-4 left-3 md:left-10"
                style={{
                  transform: "translate(-50%, -50%)",
                  zIndex: 50,
                }}
              >
                {rolledValue}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {reward && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 }}
                className="absolute flex items-center justify-center w-16 h-16 bg-white rounded-full text-black text-sm font-bold border-4 border-yellow-200"
                style={{
                  top: reward.top,
                  left: reward.left,
                  zIndex: 50,
                }}
              >
                {reward.type === "STAR" && (
                  <div className="flex flex-col items-center">
                    <img src={Images.Star} alt="star" className="h-6" />
                    <span className="mt-1 ">
                      +{formatNumber(reward.value * items.boardRewardTimes)}
                    </span>
                  </div>
                )}
                {reward.type === "DICE" && (
                  <div className="flex flex-col items-center">
                    <img src={Images.Dice} alt="dice" className="h-6" />
                    <span className="mt-1">
                      +{formatNumber(reward.value)}
                    </span>
                  </div>
                )}
                {reward.type === "lottery" && (
                  <div className="flex flex-col items-center">
                    <img
                      src={Images.LotteryTicket}
                      alt="lottery"
                      className="h-6"
                    />
                    <span className="mt-1">
                      +{formatNumber(reward.value * items.ticketTimes)}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-[#FACC15] rounded-full w-[110px] h-[110px] object-center absolute left-[5px] top-[5px] md:left-2 md:top-2 md:w-40 md:h-40"></div>
          <div className="flex flex-col w-full h-full items-center justify-center dice-container">
            <Dice
              ref={diceRef}
              onRollComplete={(value: number, data: RollDiceResponseData) =>
                handleRollComplete(value, data)
              }
              gaugeValue={gaugeValue}
            />
          </div>
          <p className="absolute text-white text-sm font-semibold drop-shadow bottom-6 right-5 z-20 md:bottom-11 md:right-9">
            x {formatNumber(diceCount)}
          </p>
          {/* "LUCKY" image animation */}
          <AnimatePresence>
            {isLuckyVisible && (
              <motion.img
                src={Images.Lucky}
                alt="Lucky Dice"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 -left-8 md:-left-14 md:-bottom-4  min-w-[180px] md:min-w-[280px] z-50"
              />
            )}
          </AnimatePresence>

          <Dialog>
            <DialogTrigger>
              <div id="fourth-step" className="absolute text-white -left-11 -bottom-14 md:-left-24 md:-bottom-28 font-semibold text-xs md:text-sm md:space-y-1">
                {/* NFT display */}
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.Gold}
                    alt="gold"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.goldCount}</p>
                </div>
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.Silver}
                    alt="silver"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.silverCount}</p>
                </div>
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.Bronze}
                    alt="bronze"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.bronzeCount}</p>
                </div>
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.RewardNFT}
                    alt="Reward NFT"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.rewardNftCount}</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh md:h-auto overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <DialogHeader className="">
                <DialogTitle>{t("dice_event.inventory")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col mt-4 gap-4">
                <div className="flex flex-col bg-[#1F1E27] p-5 rounded-3xl border-2 border-[#35383F] font-medium gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <IoGameController className="w-6 h-6" />
                    <p>{t("dice_event.points")} : x{items.boardRewardTimes}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <IoTicket className="w-6 h-6" />
                    <p>{t("dice_event.tickets")} : x{items.ticketTimes}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <PiSpinnerBallFill className="w-6 h-6" />
                    <p>{t("dice_event.spin")}: x{items.spinTimes}</p>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <AiOutlineInfoCircle className=" w-5 h-5" />
                  <p className="text-end text-sm font-medium">
                    {t("dice_event.additive")}
                  </p>
                </div>
                <NFTRewardList />
              </div>
            </DialogContent>
          </Dialog>

          {/**릴리스용 */}
          <div onClick={()=>{setIsOpen(true)}} className="absolute cursor-pointer text-white -right-11 -top-8 md:-right-24 md:-top-20 font-semibold text-xs md:text-sm md:space-y-1">
            <FaBookTanakh  className=" w-5 h-5 md:w-8 md:h-8  " />
          </div>

          {/* *테스트용 마스터 컨텐츠 */}
          {/* <Dialog>
            <DialogTrigger>
              <div className="absolute text-white -right-11 -top-8 md:-right-24 md:-top-20 font-semibold text-xs md:text-sm md:space-y-1">
                <FaBookTanakh  className=" w-5 h-5  " />
              </div>
            </DialogTrigger>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh md:h-auto overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleAddDice}
                    className="bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Dice + 100
                  </button>
                  <button
                    onClick={handleAddSLToken}
                    className="bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    SL Token + 100
                  </button>
                  <button
                    onClick={handleAddGold}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Gold NFT + 1
                  </button>
                  <button
                    onClick={handleAddSilver}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Silver NFT + 1
                  </button>
                  <button
                    onClick={handleAddBronze}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Bronze NFT + 1
                  </button>
                  <button
                    onClick={handleAddAuto}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Auto NFT + 1
                  </button>
                  <button
                    onClick={handleAddReward}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Reward NFT + 1
                  </button>
                  <button
                    onClick={handleAddAll}
                    className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded"
                  >
                    All NFTs + 1
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handleRemoveDice}
                    className="bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Dice - 100
                  </button>
                  <button
                    onClick={handleRemoveSLToken}
                    className="bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    SL Token - 100
                  </button>
                  <button
                    onClick={handleRemoveGold}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Gold NFT - 1
                  </button>
                  <button
                    onClick={handleRemoveSilver}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Silver NFT - 1
                  </button>
                  <button
                    onClick={handleRemoveBronze}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Bronze NFT - 1
                  </button>
                  <button
                    onClick={handleRemoveAuto}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Auto NFT - 1
                  </button>
                  <button
                    onClick={handleRemoveReward}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Reward NFT - 1
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog> */}

          {/* 수정된 Auto 스위치 부분 */}
          <div id="fifth-step" className=" absolute flex flex-col items-center text-white -right-11 md:-right-24 md:-bottom-24 -bottom-14 ">
            <Switch
              className="w-[26px] h-4 md:h-6 md:w-11 text-[#0147E5]"
              checked={isAuto} // isAuto 상태에 따라 스위치의 체크 상태를 설정
              onCheckedChange={handleAutoSwitch} // 스위치 토글 시 isAuto 상태를 반전
              disabled={items.autoNftCount < 1} // items.autoNftCount가 1 미만일 때 스위치 비활성화
            />
            <p className="text-xs font-semibold md:text-sm">Auto</p>
          </div>

          {/* 수정된 "Roll Dice" 버튼 */}
          <button
            id="first-step"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`bg-white rounded-full h-10 w-24 self-center absolute -bottom-5 left-3 md:left-2 md:w-40 md:h-14 border border-[#E5E5E5] text-sm md:text-lg font-medium ${
              buttonDisabled || diceCount < 1 || isAuto
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={buttonDisabled || diceCount < 1 || isAuto} // isAuto일 때도 비활성화
          >
            {isAuto ? "Auto Play" : "Roll Dice"}
          </button>
        </div>
        <div id="third-step" className="flex flex-row text-white items-center justify-center gap-1 mt-6">
          {timeUntilRefill === "Refill dice" ? (
            <motion.div
              onClick={handleRefillDice}
              className="flex flex-row items-center justify-center gap-1 cursor-pointer "
              animate={{
                opacity: [1, 0.5, 1], // 반짝이는 효과
              }}
              transition={{
                duration: 1, // 1초 동안 애니메이션 반복
                repeat: Infinity, // 무한 반복
              }}
            >
              <BsDice5Fill className="w-3 h-3" />
              <p>: {t("dice_event.refill")}</p>
            </motion.div>
          ) : (
            <>
              <BsDice5Fill className="w-3 h-3" />
              <p>: {timeUntilRefill}</p>
            </>
          )}
        </div>
      </div>

      {/* Additional tile rendering */}
      {renderTile(4)}
      {renderTile(12)}
      {renderTile(3)}
      {renderTile(13)}
      {renderTile(2)}
      {renderTile(14)}
      {renderTile(1)}
      {renderTile(15)}
      {renderTile(16)}
      {renderTile(17)}
      {renderTile(18)}
      {renderTile(19)}
      {renderTile(0)}
    </div>
  );
};

export default GameBoard;
