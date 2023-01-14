import { MAHJONG_NUMBERS } from 'src/app/constants';
import { MahjongNumber } from 'src/app/types/mahjong-number-type';
import { Oka } from 'src/app/types/oka-type';
import { Uma } from 'src/app/types/uma-type';

import { Component } from '@angular/core';

import { OKA_LIST, UMA_LIST } from '../../constants';

@Component({
  selector: 'app-match-register',
  templateUrl: './match-register.component.html',
  styleUrls: ['./match-register.component.scss']
})
export class MatchRegisterComponent {
  readonly numbers = MAHJONG_NUMBERS;
  readonly umaList = UMA_LIST;
  readonly okaList = OKA_LIST;

  public selectedNumber: MahjongNumber = '四麻';
  public selectedUma: Uma = '5-10';
  public selectedOka: Oka = '30000';
  constructor() { }

  test() {
    console.log(this.selectedNumber);
    console.log(this.selectedUma);
    console.log(this.selectedOka);
  }
}
