import type { Dimensions } from '../../app/stores/scannedDataStore';
import type { Point } from '../../app/hooks/useScanData';

export const getIndexFromCoordinates = (x: number, y: number, dimensions: Dimensions): number => (
  (y * dimensions.width) + x
);

export const getCoordinatesFromIndex = (index: number, dimensions: Dimensions): Point => ({
  x: index % dimensions.width,
  y: Math.floor(index / dimensions.width),
});
