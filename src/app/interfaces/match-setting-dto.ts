import { Oka } from '../types/oka-type';
import { Rate } from '../types/rate-type';
import { Uma } from '../types/uma-type';

export interface MatchSetting {
  roomId?: string; //APIからのレスポンスで設定される
  mahjongNumber: string;
  name1: string;
  name2: string;
  name3: string;
  name4?: string;
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
