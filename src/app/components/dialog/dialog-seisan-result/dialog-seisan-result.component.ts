import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatchResultDto } from '../../../class/match-result-dto';
import { MatchSettingDto } from '../../../class/match-setting-dto';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-dialog-seisan-result',
  templateUrl: './dialog-seisan-result.component.html',
  styleUrls: ['./dialog-seisan-result.component.scss']
})
export class DialogSeisanResultComponent implements OnInit {
  public title = '精算結果';
  public displayNameList: string[] = [];//表示順位並んだ名前リスト
  public seisanMapByName: Map<string, number> = new Map();//名前,point
  public umaMap: Map<number, number> = new Map();//順位,ウマ Map
  public okaPoint = 0;
  constructor(public dialogRef: MatDialogRef<DialogSeisanResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resultList: MatchResultDto[], setting: MatchSettingDto },
    public utilService: UtilService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.setting.mahjongNumber === '四麻') {
      this.setYonmaUma();
    } else {
      this.setSanmaUma();
    }
    this.okaPoint = this.getOka();
    this.setNameMapInit();
    this.setCaluculatedData();
  }

  /**
   * ウマを順位ごとにセット(四麻)
   */
  setYonmaUma() {
    const umaList = this.data.setting.uma.split('-');
    const umaMin = Number(umaList[0]);
    const umaMax = Number(umaList[1]);
    this.umaMap.set(1, umaMax);
    this.umaMap.set(2, umaMin);
    this.umaMap.set(3, umaMin - umaMin * 2);
    this.umaMap.set(4, umaMax - umaMax * 2);
  }

  /**
   * ウマを順位ごとにセット(三麻)
   */
  setSanmaUma() {
    const uma = Number(this.data.setting.uma);
    this.umaMap.set(1, uma);
    this.umaMap.set(2, 0);
    this.umaMap.set(3, uma - uma * 2);
  }

  /**
   * @returns オカのポイントを返す
   */
  getOka(): number {
    if (this.data.setting.mahjongNumber === '四麻') {
      return this.data.setting.oka - 25000 === 0 ? 0 : (this.data.setting.oka - 25000) / 1000 * 4;
    }
    //三麻
    return this.data.setting.oka - 35000 === 0 ? 0 : (this.data.setting.oka - 35000) / 1000 * 3;
  }

  //初期値セット、名前と0ポイント
  setNameMapInit() {
    const num = this.utilService.getMajongNumber(this.data.setting.mahjongNumber);
    for (let i = 1; i <= num; i++) {
      const name = this.utilService.getNameFromIndex(i, this.data.setting);
      this.seisanMapByName.set(name, 0);
      this.displayNameList.push(name);
    }
  }

  setCaluculatedData() {
    console.log(this.data.resultList);
    //半荘ごとに精算していく
    this.data.resultList.forEach(d => {
      //順位で並び替え(半荘ごと)
      d.pointList.sort((a, b) => {
        return (a.point > b.point) ? -1 : 1;  //オブジェクトの降順ソート
      });
      let yakitoriPoint = 0;//一着が総取り
      let firstPersonName = '';//一着の名前
      //一人ずつ一着から計算
      for (let i = 1; i <= d.pointList.length; i++) {
        let totalPoint = 0;//半荘でのポイント合計
        const pointOfPerson = d.pointList[i - 1];
        const name = this.utilService.getNameFromIndex(pointOfPerson.nameIndex, this.data.setting);
        if (i === 1) {
          firstPersonName = name;
        }
        const uma = this.umaMap.get(i);
        if (uma !== undefined) {
          totalPoint += uma;//順位ポイント(ウマ)
        }
        if (pointOfPerson.isYakitori) {
          yakitoriPoint += this.data.setting.yakitoriPoint;
          totalPoint -= this.data.setting.yakitoriPoint;
        }
        //素点計算
        totalPoint += pointOfPerson.point - this.data.setting.oka === 0 ? 0 : (pointOfPerson.point - this.data.setting.oka) / 1000;
        this.seisanMapByName.set(name, totalPoint);
        console.log(this.seisanMapByName);
      }
      //一着にオカと焼き鳥加算
      let pointOfFirst = this.seisanMapByName.get(firstPersonName);
      pointOfFirst! += this.okaPoint;
      pointOfFirst! += yakitoriPoint;
      this.seisanMapByName.set(firstPersonName, pointOfFirst!);
    });
  }

  /**
   * データ表示用に名前でポイント取得
   * @param name
   * @returns 最終ポイント
   */
  getFinalPoint(name: string): number {
    const data = this.seisanMapByName.get(name);
    return data === undefined ? 0 : data * this.data.setting.rate;
  }
}
