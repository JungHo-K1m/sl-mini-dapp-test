import React from "react";
import { StarTile, DiceTile, AirplaneTile } from "@/features/DiceEvent";

interface TileProps {
  id: number;
  onClick: () => void;
  position: number;
  selectingTile: boolean;
  children?: React.ReactNode;
  "data-star"?: string;
  "data-dice"?: string;
}

const Tile: React.FC<TileProps> = ({
  id,
  onClick,
  position,
  selectingTile,
  children,
  "data-star": dataStar,
  "data-dice": dataDice,
}) => {
  const getTileStyle = (tileNumber: number): string => {
    const baseStyle =
      "flex items-center justify-center w-[52px] h-[52px] md:w-24 md:h-24 text-center font-semibold text-xs md:text-sm cursor-pointer";
    const startStyle = `${baseStyle} start-tile text-white text-sm md:text-base font-jalnan`;
    const airplaneStyle = `${baseStyle} airplane-tile`;
    const gameStyle = `${baseStyle} game-tile`;
    const starStyle = `${baseStyle} star-tile`;
    const diceStyle = `${baseStyle} dice-tile`;
    const activeStyle = "active-tile";

    let zIndex = selectingTile ? "z-30" : "z-10";
    switch (tileNumber) {
      case 0:
        return `${startStyle} ${
          position === tileNumber ? activeStyle : ""
        } ${zIndex}`;
      case 2:
      case 8:
      case 13:
      case 18:
        return `${airplaneStyle} ${
          position === tileNumber ? activeStyle : ""
        } ${zIndex}`;
      case 1:
      case 4:
      case 6:
      case 9:
      case 11:
      case 14:
      case 16:
      case 19:
        return `${starStyle} ${
          position === tileNumber ? activeStyle : ""
        } ${zIndex}`;
      case 5:
      case 10:
      case 15:
        return `${gameStyle} ${
          position === tileNumber ? activeStyle : ""
        } ${zIndex}`;
      default:
        return `${diceStyle} ${
          position === tileNumber ? activeStyle : ""
        } ${zIndex}`;
    }
  };

  return (
    <div
      id={id.toString()}
      className={getTileStyle(id)}
      onClick={onClick}
      data-star={dataStar}
      data-dice={dataDice}
    >
      {children}
    </div>
  );
};

export default Tile;
