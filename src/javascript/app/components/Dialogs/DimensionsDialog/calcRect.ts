const TARGET_SIZE = 128;

export const calcRect = (
  step: number,
  dimensionsMaxX: number,
  dimensionsMaxY: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
) => {
  const rawWidth = step ? Math.floor(dimensionsMaxX / step) || 0 : 0;
  const rawHeight = step ? Math.floor(dimensionsMaxY / step) || 0 : 0;
  const rawAreaX = minX;
  const rawAreaY = minY;
  const rawAreaWidth = maxX - rawAreaX;
  const rawAreaHeight = maxY - rawAreaY;

  const displayFactor = (rawWidth / TARGET_SIZE) || 1;

  const displayTotalWidth = rawWidth / displayFactor;
  const displayTotalHeight = rawHeight / displayFactor;
  const displayAreaX = rawAreaX / displayFactor;
  const displayAreaY = rawAreaY / displayFactor;
  const displayAreaWidth = rawAreaWidth / displayFactor;
  const displayAreaHeight = rawAreaHeight / displayFactor;

  return {
    rawWidth,
    rawHeight,
    rawAreaX,
    rawAreaY,
    rawAreaWidth,
    rawAreaHeight,
    displayTotalWidth,
    displayTotalHeight,
    displayAreaX,
    displayAreaY,
    displayAreaWidth,
    displayAreaHeight,
  };
};
