export interface MinMax {
  min: number,
  max: number,
}


export const getMinMax = (channelData: number[]): MinMax => (
  channelData.reduce((acc: MinMax, value: number): MinMax => (
    value < 0 ? acc : ({
      min: Math.min(acc.min, value),
      max: Math.max(acc.max, value),
    })
  ), { min: 65536, max: 0 })
);
