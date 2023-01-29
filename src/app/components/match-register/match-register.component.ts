import { MAHJONG_NUMBERS } from 'src/app/constants';
import { MatchSetting } from 'src/app/interfaces/match-setting-dto';
import { MahjongNumber } from 'src/app/types/mahjong-number-type';
import { Oka } from 'src/app/types/oka-type';
import { Rate } from 'src/app/types/rate-type';
import { Uma } from 'src/app/types/uma-type';

import { Component } from '@angular/core';

import { EXIST_FLAG, OKA_LIST, RATE_LIST, UMA_LIST } from '../../constants';
import { MatchSettingApiService } from '../../services/match-setting-api.service';

@Component({
  selector: 'app-match-register',
  templateUrl: './match-register.component.html',
  styleUrls: ['./match-register.component.scss', '../../app.component.scss']
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
  constructor(private matchSettingApiService: MatchSettingApiService) { }

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

  saveMatchSetting() {
    const matchSettting = this.createPostData();
    this.matchSettingApiService.postApiMatchSetting(matchSettting)
      .subscribe(res => {
        console.log(res)
        window.alert("【保存完了】\r\n部屋番号 : " + res.body.roomId)
      })
  }

  createPostData(): MatchSetting {
    return {
      mahjongNumber: this.selectedNumber,
      uma: this.selectedUma,
      oka: this.selectedOka,
      isYakitori: this.isYakitori,
      isTobishou: this.isTobishou,
      tobishouPoint: this.tobishouPoint,
      rate: this.selectedRate,
      isTip: this.isTip,
      tipInitialNumber: this.tipInitialNumber,
      tipRate: this.tipRate
    }
  }
}
