import { MAHJONG_NUMBERS } from 'src/app/constants';
import { MahjongNumber } from 'src/app/types/mahjong-number-type';
import { Oka } from 'src/app/types/oka-type';
import { Rate } from 'src/app/types/rate-type';
import { Uma } from 'src/app/types/uma-type';

import { Component } from '@angular/core';

import { EXIST_FLAG, OKA_LIST, RATE_LIST, UMA_LIST } from '../../constants';

@Component({
  selector: 'app-match-register',
  templateUrl: './match-register.component.html',
  styleUrls: ['./match-register.component.scss']
})
export class MatchRegisterComponent {
  readonly numbers = MAHJONG_NUMBERS;
  readonly umaList = UMA_LIST;
  readonly okaList = OKA_LIST;
  readonly existFlagList = EXIST_FLAG;
  readonly rateList = RATE_LIST;

  public selectedNumber: MahjongNumber = '四麻';
  public selectedUma: Uma = '5-10';
  public selectedOka: Oka = 30000;
  public isYakitori = false;
  public isTobishou = false;
  public tobishouPoint = 0;
  public selectedRate: Rate = 10;
  public isTip = false;
  public tipInitialNumber = 0;
  public tipRate = 0;
  constructor() { }

  test() {
    console.log(this.selectedNumber);
    console.log(this.selectedUma);
    console.log(this.selectedOka);
    console.log(this.isYakitori);
    console.log(this.isYakitori);
    console.log(this.selectedRate);
    console.log(this.isTip);
    console.log(this.tipRate);
  }
}
