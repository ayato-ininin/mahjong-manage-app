/* eslint-disable indent */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { PointOfPerson } from '../../class/match-result-data';
import { MatchResultDto } from '../../class/match-result-dto';
import { MatchSettingDto } from '../../class/match-setting-dto';
import { MatchResultApiService } from '../../services/match-result-api.service';
import { MatchSettingApiService } from '../../services/match-setting-api.service';
import {
    DialogInputMatchResultComponent
} from '../dialog-input-match-result/dialog-input-match-result.component';

const TEST_DATA: MatchResultDto = {
  roomId: 1,
  pointList: [
    {
      nameIndex: 1,
      point: 25000,
      isYakitori: false
    },
    {
      nameIndex: 2,
      point: 30000,
      isYakitori: false
    },
    {
      nameIndex: 3,
      point: 15000,
      isYakitori: false
    },
    {
      nameIndex: 4,
      point: 10000,
      isYakitori: false
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
  public isSearchSetting = false; //試合設定を取得したか

  public displayedColumns: string[] = ['game', 'name1', 'name2', 'name3', 'name4'];
  public dataSource = new MatTableDataSource<MatchResultDto>();
  public matchResultList: MatchResultDto[] = [];

  constructor(
    private matchSettingApiService: MatchSettingApiService,
    private matchResultApiService: MatchResultApiService,
    public dialog: MatDialog) {
    this.matchSetting = new MatchSettingDto();
    this.matchResultList.push(TEST_DATA);
    this.dataSource.data = this.matchResultList;
  }

  /**
   * roomidにて試合の設定情報を取得
   */
  searchByRoomId() {
    this.matchSettingApiService.getApiMatchSetting(this.roomId)
      .subscribe(res => {
        this.matchSetting = res.body;
        this.isSearchSetting = true;
      });
  }

  /**
   * html側でnameにより点数取得
   * @param data
   * @param i
   */
  getData(data: MatchResultDto, i: number): number {
    const dto = data.pointList.find(d => d.nameIndex === i);
    return dto ? dto.point : 0;
  }

  /**
   * 試合結果登録用のダイアログを表示
   */
  openInputDialog(): void {
    const data = this.getDialogSendData();
    const dialogRef = this.dialog.open(
      DialogInputMatchResultComponent, {
      height: '450px',
      width: '290px',
      data: { resultList: data }
    });

    //ダイアログ事後処理
    dialogRef.afterClosed().subscribe(result => {
      //matchIndexとroomidのオブジェクト作って保存処理、listに追加
      if (result === undefined) { return; }
      const saveData = this.getResultDataForSave(result.resultList);
      this.saveMatchResult(saveData);
    });
  }

  /**
   * nameIndexより、対象の登録者名を取得する
   * @param i
   */
  private getNameFromIndex(i: number): string {
    switch (i) {
      case 1:
        return this.matchSetting.name1;
      case 2:
        return this.matchSetting.name2;
      case 3:
        return this.matchSetting.name3;
      case 4:
        return this.matchSetting.name4 ? this.matchSetting.name4 : '';
      default:
        return '';
    }
  }

  /**
   * ダイアログにて新規追加用のデータ生成、return
   */
  private getDialogSendData(): {
    name: string;
    pointOfPerson: PointOfPerson;
  }[] {
    const matchResultList = [];
    for (let i = 1; i < 5; i++) {
      const obj = new PointOfPerson(i);
      const name = this.getNameFromIndex(i);
      const resultObj = {
        name: name,
        pointOfPerson: obj
      };
      matchResultList.push(resultObj);
    }
    return matchResultList;
  }

  /**
   * ダイアログから帰ってきたデータを保存用に整形
   * @param result
   */
  private getResultDataForSave(result: {
    name: string;
    pointOfPerson: PointOfPerson;
  }[]): MatchResultDto {
    const matchResult = new MatchResultDto();
    matchResult.roomId = this.roomId;
    const list: PointOfPerson[] = [];
    result.forEach((d: {name: string; pointOfPerson: PointOfPerson;}) => {
      list.push(d.pointOfPerson);
    });
    matchResult.pointList = list;
    return matchResult;
  }

  /**
   * 新規試合データを保存
   * @param saveData
   */
  private saveMatchResult(saveData: MatchResultDto) {
    this.matchResultApiService.postApiMatchResult(saveData)
      .subscribe(res => {
        console.log(res);
        this.matchResultList.push(saveData);
        this.dataSource.data = this.matchResultList;//createtimestampで並び替えるくらいしてもいいかも
      });
  }
}
