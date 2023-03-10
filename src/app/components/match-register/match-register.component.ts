/* eslint-disable indent */
import { MatchSettingDto } from 'src/app/class/match-setting-dto';
import { MAHJONG_NUMBERS } from 'src/app/constants';
import { MahjongNumber } from 'src/app/types/mahjong-number-type';
import { Oka } from 'src/app/types/oka-type';
import { Rate } from 'src/app/types/rate-type';
import { Uma } from 'src/app/types/uma-type';

import { Component } from '@angular/core';

import {
    EXIST_FLAG, RATE_LIST, SANMA_OKA_LIST, SANMA_UMA_LIST, YONMA_OKA_LIST, YONMA_UMA_LIST
} from '../../constants';
import { MatchSettingApiService } from '../../services/match-setting-api.service';

@Component({
  selector: 'app-match-register',
  templateUrl: './match-register.component.html',
  styleUrls: ['./match-register.component.scss', '../../app.component.scss']
})
export class MatchRegisterComponent {
  readonly numbers = MAHJONG_NUMBERS;
  readonly existFlagList = EXIST_FLAG;
  readonly rateList = RATE_LIST;

  public selectedNumber: MahjongNumber = '四麻';
  public name1 = '';
  public name2 = '';
  public name3 = '';
  public name4 = '';
  public umaList = YONMA_UMA_LIST;
  public selectedUma: Uma = '5-10';
  public okaList = YONMA_OKA_LIST;
  public selectedOka: Oka = 30000;
  public isYakitori = false;
  public yakitoriPoint = 0;
  public isTobishou = false;
  public tobishouPoint = 0;
  public selectedRate: Rate = 10;
  public isTip = false;
  public tipInitialNumber = 0;
  public tipRate = 0;
  constructor(private matchSettingApiService: MatchSettingApiService) { }

  saveMatchSetting() {
    const matchSettting = this.createPostData();
    this.matchSettingApiService.postApiMatchSetting(matchSettting)
      .subscribe(res => {
        console.log(res);
        window.alert("【保存完了】\r\n部屋番号 : " + res.body.roomId);
        this.init();
      });
  }

  createPostData(): MatchSettingDto {
    return {
      mahjongNumber: this.selectedNumber,
      name1: this.name1,
      name2: this.name2,
      name3: this.name3,
      name4: this.name4,
      uma: this.selectedUma,
      oka: this.selectedOka,
      isYakitori: this.isYakitori,
      yakitoriPoint: this.yakitoriPoint,
      isTobishou: this.isTobishou,
      tobishouPoint: this.tobishouPoint,
      rate: this.selectedRate,
      isTip: this.isTip,
      tipInitialNumber: this.tipInitialNumber,
      tipRate: this.tipRate
    };
  }

  init() {
    this.selectedNumber = '四麻';
    this.name1 = '';
    this.name2 = '';
    this.name3 = '';
    this.name4 = '';
    this.selectedUma = '5-10';
    this.okaList = YONMA_OKA_LIST;
    this.selectedOka = 30000;
    this.isYakitori = false;
    this.yakitoriPoint = 0;
    this.isTobishou = false;
    this.tobishouPoint = 0;
    this.selectedRate = 10;
    this.isTip = false;
    this.tipInitialNumber = 0;
    this.tipRate = 0;
  }

  /**
   * 三麻、四麻の切り替え処理
   */
  changeNumber() {
    if (this.selectedNumber === '四麻') {
      this.okaList = YONMA_OKA_LIST;
      this.selectedOka = 30000;
      this.umaList = YONMA_UMA_LIST;
      this.selectedUma = '5-10';
    } else {
      this.okaList = SANMA_OKA_LIST;
      this.selectedOka = 40000;
      this.umaList = SANMA_UMA_LIST;
      this.selectedUma = '10';
    }
  }
}
