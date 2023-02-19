import { Oka } from '../types/oka-type';
import { Rate } from '../types/rate-type';
import { Uma } from '../types/uma-type';

export class MatchSettingDto {
  roomId?: number; //APIからのレスポンスで設定される
  mahjongNumber: string;
  name1: string;
  name2: string;
  name3: string;
  name4?: string;
  uma: Uma;
  oka: Oka;
  isYakitori: boolean;
  yakitoriPoint: number;
  isTobishou: boolean;
  tobishouPoint: number;
  rate: Rate;
  isTip: boolean;
  tipInitialNumber: number;
  tipRate: number;

  constructor() {
    this.roomId = 0;
    this.mahjongNumber = '四麻';
    this.name1 = '';
    this.name2 = '';
    this.name3 = '';
    this.name4 = '';
    this.uma = '5-10';
    this.oka = 30000;
    this.isYakitori = false;
    this.yakitoriPoint = 0;
    this.isTobishou = false;
    this.tobishouPoint = 0;
    this.rate = 10;
    this.isTip = false;
    this.tipInitialNumber = 0;
    this.tipRate = 0;
  }
}
