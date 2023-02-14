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

@Component({
  selector: 'app-seisan',
  templateUrl: './seisan.component.html',
  styleUrls: ['./seisan.component.scss', '../../app.component.scss']
})
export class SeisanComponent {
  public roomId = 0;
  public matchSetting: MatchSettingDto;
  public isSearchSetting = false; //試合設定を取得したか

  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource<MatchResultDto>();
  public matchResultList: MatchResultDto[] = [];

  constructor(
    private matchSettingApiService: MatchSettingApiService,
    private matchResultApiService: MatchResultApiService,
    public dialog: MatDialog) {
    this.matchSetting = new MatchSettingDto();
    this.dataSource.data = this.matchResultList;
  }

  init() {
    this.matchSetting = new MatchSettingDto();
    this.matchResultList = [];
  }

  /**
   * roomidにて試合の設定情報を取得
   */
  searchMatchSettingByRoomId() {
    this.init();//初期化
    this.matchSettingApiService.getApiMatchSetting(this.roomId)
      .subscribe(res => {
        this.matchSetting = res.body;
        this.isSearchSetting = true;
        this.setDisplayColumns();
      });
  }


  /**
   * 三麻と四麻で表示カラムの切り替え
   */
  setDisplayColumns() {
    if (this.matchSetting.mahjongNumber === '三麻') {
      this.displayedColumns = ['game', 'name1', 'name2', 'name3', 'edit'];
    } else {
      this.displayedColumns = ['game', 'name1', 'name2', 'name3', 'name4', 'edit'];
    }
  }

  /**
   * roomidにて試合結果一覧を取得
   */
  searchMatchResultByRoomId() {
      this.matchResultApiService.getApiMatchResult(this.roomId)
        .subscribe(res => {
          if (res.body === null) { return; }
          const data: MatchResultDto[] = res.body;
          data.forEach(element => {
            this.matchResultList.push(element);
          });
          this.setDatasource();
        });
  }

  /**
   * datasocureに並び替え後、セット
   * @param data
   */
  setDatasource() {
    this.matchResultList.sort((a, b) => {
      return (a.createTimeStamp! < b.createTimeStamp!) ? -1 : 1;  //オブジェクトの昇順ソート
    });
    this.dataSource.data = this.matchResultList;
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
      data: { resultList: data, status: 'add' }
    });

    //ダイアログ事後処理
    dialogRef.afterClosed().subscribe(result => {
      //matchIndexとroomidのオブジェクト作って保存処理、listに追加
      if (result === undefined) { return; }
      const docId = this.genFirebaseRecordId();
      const saveData = this.getResultDataForSave(result.resultList, docId);
      this.saveMatchResult(saveData);
    });
  }


  /**
   * 試合結果修正用のダイアログを表示
   * {name:'', pointOfPerson: any}
   * @param ele
   */
  openEditDialog(ele: MatchResultDto): void {
    const data = this.getDialogEditData(ele);
    const dialogRef = this.dialog.open(
      DialogInputMatchResultComponent, {
      data: { resultList: data, status: 'edit' }
    });

    //ダイアログ事後処理
    dialogRef.afterClosed().subscribe(result => {
      //matchIndexとroomidのオブジェクト作って保存処理、listに追加
      if (result === undefined) { return; }
      const saveData = this.getResultDataForSave(result.resultList, ele.docId);
      this.updateMatchResult(saveData);
      console.log(saveData);
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
    const max = this.getMajongNumber() + 1;
    for (let i = 1; i < max; i++) {
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
   * ダイアログにて修正用のデータ生成、return
   * @param data
   */
  private getDialogEditData(data: MatchResultDto): {
    name: string;
    pointOfPerson: PointOfPerson;
  }[] {
    const matchResultList = [];
    for (let i = 0; i < data.pointList.length; i++) {
      const name = this.getNameFromIndex(data.pointList[i].nameIndex);
      const resultObj = {
        name: name,
        pointOfPerson: data.pointList[i]
      };
      matchResultList.push(resultObj);
    }
    return matchResultList;
  }

  getMajongNumber(): number {
    if (this.matchSetting.mahjongNumber === '三麻') {
      return 3;
    }
    return 4;
  }

  /**
   * ダイアログから帰ってきたデータを保存用に整形
   * @param result
   */
  private getResultDataForSave(result: {
    name: string;
    pointOfPerson: PointOfPerson;
  }[], docId: string): MatchResultDto {
    const matchResult = new MatchResultDto();
    matchResult.docId = docId;
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
        this.setDatasource();
      });
  }

  /**
   * 試合データを更新
   * @param saveData
   */
    private updateMatchResult(saveData: MatchResultDto) {
      this.matchResultApiService.updateApiMatchResult(saveData)
        .subscribe(res => {
          console.log(res);
          // this.matchResultList.push(saveData);
          // this.setDatasource();
        });
    }


/**
 * 数値を指定桁数まで0埋め
 *
 * @param val 数値
 * @param size 桁数
 * @return 0埋めされた数値
 */
  padZero = (val: string | number | null | undefined, size: number): string | null | undefined => {
  if (typeof val === 'undefined') {
    return undefined;
  }

  if (val === null) {
    return null;
  }

  let s = val + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};

/**
 * IDを生成する。
 */
genFirebaseRecordId(suffix?: number): string {
  const now = new Date();

  const fullYear = this.padZero(now.getFullYear(), 4) ?? '2006';
  const month = this.padZero(now.getMonth() + 1, 2) ?? '01';
  const day = this.padZero(now.getDate(), 2) ?? '02';
  const hour = this.padZero(now.getHours(), 2) ?? '03';
  const minute = this.padZero(now.getMinutes(), 2) ?? '04';
  const second = this.padZero(now.getSeconds(), 2) ?? '05';
  const milliSecond  = this.padZero(now.getMilliseconds(), 3) ?? '000';

  let random: string | undefined | null;
  if (suffix === null || suffix === undefined) {
    random = this.padZero(Math.floor(Math.random() * 999999), 6);
  } else {
    random = this.padZero(suffix % 1000000, 6);
  }

  return fullYear + month + day + hour + minute + second + milliSecond + random;
  }
}
