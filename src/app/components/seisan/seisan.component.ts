/* eslint-disable indent */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { PointOfPerson } from '../../class/match-result-data';
import { MatchResultDto } from '../../class/match-result-dto';
import { MatchSettingDto } from '../../class/match-setting-dto';
import { MatchResultApiService } from '../../services/match-result-api.service';
import { MatchSettingApiService } from '../../services/match-setting-api.service';
import { UtilService } from '../../services/util.service';
import {
    DialogInputMatchResultComponent
} from '../dialog/dialog-input-match-result/dialog-input-match-result.component';
import {
    DialogSeisanResultComponent
} from '../dialog/dialog-seisan-result/dialog-seisan-result.component';

@Component({
  selector: 'app-seisan',
  templateUrl: './seisan.component.html',
  styleUrls: ['./seisan.component.scss', '../../app.component.scss']
})
export class SeisanComponent {
  public roomId = 0;
  public matchSetting?: MatchSettingDto;

  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource<MatchResultDto>();
  public matchResultList: MatchResultDto[] = [];

  constructor(
    private matchSettingApiService: MatchSettingApiService,
    private matchResultApiService: MatchResultApiService,
    public dialog: MatDialog,
    public utilService: UtilService) {
    this.dataSource.data = this.matchResultList;
  }

  init() {
    this.matchSetting = new MatchSettingDto();
    this.displayedColumns = [];
    this.matchResultList = [];
    this.dataSource.data = this.matchResultList;
  }

  /**
   * roomidにて試合の設定情報を取得
   */
  searchMatchSettingByRoomId() {
    this.init();//初期化
    this.matchSettingApiService.getApiMatchSetting(this.roomId)
      .subscribe(res => {
        this.matchSetting = res.body;
        this.setDisplayColumns();
      });
  }


  /**
   * 三麻と四麻で表示カラムの切り替え
   */
  setDisplayColumns() {
    if (!this.matchSetting) { return; }
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
        data: {
          resultList: data,
          isYakitori: this.matchSetting?.isYakitori,
          isTobishou: this.matchSetting?.isTobishou,
          status: 'add'
        }
    });

    //ダイアログ事後処理
    dialogRef.afterClosed().subscribe(result => {
      //matchIndexとroomidのオブジェクト作って保存処理、listに追加
      if (result === undefined) { return; }
      const docId = this.utilService.genFirebaseRecordId();
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
        data: {
          resultList: data,
          isYakitori: this.matchSetting?.isYakitori,
          isTobishou: this.matchSetting?.isTobishou,
          status: 'edit'
        }
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
   * 精算用のダイアログを表示
   */
  openSeisanDialog(): void {
    const dialogRef = this.dialog.open(
      DialogSeisanResultComponent, {
      data: { resultList: this.matchResultList, setting: this.matchSetting }
    });

    //ダイアログ事後処理
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    dialogRef.afterClosed().subscribe(_ => { });//何もしない
  }

  /**
   * ダイアログにて新規追加用のデータ生成、return
   */
  private getDialogSendData(): {
    name: string;
    pointOfPerson: PointOfPerson;
  }[] | void {
    if (!this.matchSetting) { return; }
    const matchResultList = [];
    const num = this.utilService.getMajongNumber(this.matchSetting.mahjongNumber);
    for (let i = 1; i <= num; i++) {
      const obj = new PointOfPerson(i, num);
      const name = this.utilService.getNameFromIndex(i, this.matchSetting);
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
  }[] | void {
    if (!this.matchSetting) { return; }
    const matchResultList = [];
    for (let i = 1; i <= data.pointList.length; i++) {
      const point = this.getPointByNameIndex(data.pointList, i);
      if (!point) { return; }//ないはず
      const name = this.utilService.getNameFromIndex(point.nameIndex, this.matchSetting);
      const resultObj = {
        name: name,
        pointOfPerson: point
      };
      matchResultList.push(resultObj);
    }
    return matchResultList;
  }

  /**
   * PointOfPersonの中から対象を取り出す
   * @param data PointOfPersonの配列
   * @param i 名前のインデックス
   */
  getPointByNameIndex(data: PointOfPerson[], i: number): PointOfPerson | undefined {
    let result;
    data.forEach(d => {
      if (i === d.nameIndex) {
        result = d;
      }
    });
    return result;
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
    result.forEach((d: { name: string; pointOfPerson: PointOfPerson; }) => {
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
      });
  }
}
