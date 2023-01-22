import { Oka } from '../types/oka-type';
import { Rate } from '../types/rate-type';
import { Uma } from '../types/uma-type';

export interface MatchSetting {
  mahjongNumber: string;
  uma: Uma;
  oka: Oka;
  isYakitori: boolean;
  isTobishou: boolean;
  tobishouPoint: number;
  rate: Rate;
  isTip: boolean;
  tipInitialNumber: number;
  tipRate: number;
}
