const calculateTilePosition = (
  tileNumber: number,
  initialX: number,
  initialY: number,
  delta: number,
) => {
  let x = initialX;
  let y = initialY;

  if (tileNumber >= 0 && tileNumber <= 5) {
    y -= delta * tileNumber;
  } else if (tileNumber >= 6 && tileNumber <= 10) {
    x -= delta * (tileNumber - 5);
    y -= delta * 5;
  } else if (tileNumber >= 11 && tileNumber <= 15) {
    x -= delta * 5;
    y -= delta * (15 - tileNumber);
  } else if (tileNumber >= 16 && tileNumber <= 19) {
    x -= delta * (20 - tileNumber);
  }

  return { x, y };
};

export default calculateTilePosition;
