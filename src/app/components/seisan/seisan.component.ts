import { Component } from '@angular/core';

import { MatchSettingDto } from '../../class/match-setting-dto';
import { MatchSettingApiService } from '../../services/match-setting-api.service';

@Component({
  selector: 'app-seisan',
  templateUrl: './seisan.component.html',
  styleUrls: ['./seisan.component.scss', '../../app.component.scss']
})
export class SeisanComponent {
  public roomId = 0;
  public matchSetting = new MatchSettingDto();
  public isSearchSetting = false;
  constructor(private matchSettingApiService: MatchSettingApiService) { }

  searchByRoomId() {
    this.matchSettingApiService.getApiMatchSetting(this.roomId)
      .subscribe(res => {
        const data = res.body;
        this.matchSetting.roomId = data.roomId;
        this.matchSetting.mahjongNumber = data.mahjongNumber;
        this.matchSetting.name1 = data.name1;
        this.matchSetting.name2 = data.name2;
        this.matchSetting.name3 = data.name3;
        this.matchSetting.name4 = data.name4;
        this.matchSetting.uma = data.uma;
        this.matchSetting.oka = data.oka;
        this.matchSetting.isYakitori = data.isYakitori;
        this.matchSetting.isTobishou = data.isTobishou;
        this.matchSetting.tobishouPoint = data.tobishouPoint;
        this.matchSetting.rate = data.rate;
        this.matchSetting.isTip = data.isTip;
        this.matchSetting.tipInitialNumber = data.tipInitialNumber;
        this.matchSetting.tipRate = data.tipRate;
        this.isSearchSetting = true;
        console.log(this.matchSetting);
      });
  }
}
