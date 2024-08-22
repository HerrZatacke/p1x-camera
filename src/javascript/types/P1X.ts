
export enum P1XType {
  INFO = 'info',
  DATA = 'data',
  SENSITIVITY_UPDATED = 'sensitivityupdated',
  DONE_HOMING = 'donehoming',
  WARNING = 'warning',
  ERROR = 'error',
  MOVED = 'moved',
}

export enum P1XCommands {
  GOTO = 103,
  READ_DATA = 114,
  SILENT_PING = 112,
  SET_SENSITIVITY = 115,
  LED = 108,
}

export enum P1XChannel {
  COLOR_415NM = '415nm',
  COLOR_445NM = '445nm',
  COLOR_480NM = '480nm',
  COLOR_515NM = '515nm',
  COLOR_555NM = '555nm',
  COLOR_590NM = '590nm',
  COLOR_630NM = '630nm',
  COLOR_680NM = '680nm',
  CLEAR = 'clear',
  NIR = 'nir',
}

export const p1xChannels: P1XChannel[] = [
  P1XChannel.COLOR_415NM,
  P1XChannel.COLOR_445NM,
  P1XChannel.COLOR_480NM,
  P1XChannel.COLOR_515NM,
  P1XChannel.COLOR_555NM,
  P1XChannel.COLOR_590NM,
  P1XChannel.COLOR_630NM,
  P1XChannel.COLOR_680NM,
  P1XChannel.CLEAR,
  P1XChannel.NIR,
];

export interface P1XMessage {
  type: P1XType,
}

export interface P1XInfoMessage extends P1XMessage {
  type: P1XType.INFO,
  message: string,
}

export interface P1XWarningMessage extends P1XMessage {
  type: P1XType.WARNING,
  message: string,
}

export interface P1XErrorMessage extends P1XMessage {
  type: P1XType.ERROR,
  message: string,
}

export interface P1XHomingMessage extends P1XMessage {
  type: P1XType.DONE_HOMING,
  axis: string,
  range: number,
}

export type P1XChannels = Record<P1XChannel, number>;

export interface P1XSensitivity {
  aGain: number,
  aStep: number,
  aTime: number,
}

export type P1XDataMessage = P1XMessage & P1XChannels & P1XSensitivity & {
  type: P1XType.DATA,
  maxX: number,
  maxY: number,
  x: number,
  y: number,
}
