import { Component } from '@angular/core';

import { MatchResultDto } from '../../class/match-result-dto';
import { MatchSettingDto } from '../../class/match-setting-dto';
import { MatchSettingApiService } from '../../services/match-setting-api.service';

const TEST_DATA: MatchResultDto = {
  roomId: 1,
  matchIndex: 1,
  resultList: [
    {
      nameIndex: 1,
      point: 25000,
      isYakitori: false,
      tipNumber: 0
    },
    {
      nameIndex: 2,
      point: 30000,
      isYakitori: false,
      tipNumber: 0
    },
    {
      nameIndex: 3,
      point: 15000,
      isYakitori: false,
      tipNumber: 0
    },
    {
      nameIndex: 4,
      point: 10000,
      isYakitori: false,
      tipNumber: 0
    },
  ]
};


@Component({
  selector: 'app-seisan',
  templateUrl: './seisan.component.html',
  styleUrls: ['./seisan.component.scss', '../../app.component.scss']
})
export class SeisanComponent {
  public roomId = 0;
  public matchSetting: MatchSettingDto;
  public isSearchSetting = false;

  public displayedColumns: string[] = ['game', 'name1', 'name2', 'name3', 'name4'];
  public dataSource: MatchResultDto[];
  public matchResultList: MatchResultDto[] = [];

  constructor(private matchSettingApiService: MatchSettingApiService) {
    this.matchResultList.push(TEST_DATA);
    this.dataSource = this.matchResultList;
    this.matchSetting = new MatchSettingDto();
  }

  searchByRoomId() {
    this.matchSettingApiService.getApiMatchSetting(this.roomId)
      .subscribe(res => {
        this.matchSetting = res.body;
        this.isSearchSetting = true;
      });
  }

  getData(data: MatchResultDto, i: number): number {
    const dto = data.resultList.find(d => d.nameIndex === i);
    return dto ? dto.point : 0;
  }
}
