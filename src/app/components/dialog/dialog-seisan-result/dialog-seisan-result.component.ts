import { PointOfPerson } from 'src/app/class/match-result-data';

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
  public title = '';
  public isFinishTip = false;
  private mahjonNum = 0;//人数
  public displayNameList: string[] = [];//表示順位並んだ名前リスト
  public seisanMapByName: Map<string, number> = new Map();//名前,point
  public tipMapByName: Map<string, number> = new Map();//名前,tip数
  public umaMap: Map<number, number> = new Map();//順位,ウマ Map
  public okaPoint = 0;
  constructor(public dialogRef: MatDialogRef<DialogSeisanResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resultList: MatchResultDto[], setting: MatchSettingDto },
    public utilService: UtilService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * チップ数ありの場合のみの処理
   */
  onSeisanClick(): void {
    if (!this.checkTipTotalIsTrue()) {
      window.alert('チップ数の合計が正しくありません。');
      return;
    }
    this.isFinishTip = true;
    this.setTitle();
    this.setCaluculatedData();
  }

  /**
   * チップ数の合計と入力値の合計があっているかチェック
   * @returns true or false
   */
  checkTipTotalIsTrue(): boolean {
    const tipSum = this.data.setting.tipInitialNumber * this.mahjonNum;//チップ合計数
    let total = 0;
    this.tipMapByName.forEach((v) => {
      total += v;
    });
    return tipSum === total;
  }

  ngOnInit(): void {
    this.setTitle();
    this.mahjonNum = this.utilService.getMajongNumber(this.data.setting.mahjongNumber);
    if (this.mahjonNum === 4) {
      this.setYonmaUma();
      this.okaPoint = this.getYonmaOka();
    } else {
      this.setSanmaUma();
      this.okaPoint = this.getSanmaOka();
    }
    this.setNameMapInit();
    if (!this.data.setting.isTip) {
      this.setCaluculatedData();
    }
  }

  setTitle() {
    if (this.data.setting.isTip && !this.isFinishTip) {
      this.title = 'チップ数入力';
    } else {
      this.title = '精算結果';
    }
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
   * @returns オカのポイントを返す(三麻)
   */
  getSanmaOka(): number {
    return this.data.setting.oka - 35000 === 0 ? 0 : (this.data.setting.oka - 35000) / 1000 * 3;
  }

  /**
   * @returns オカのポイントを返す(四麻)
   */
  getYonmaOka(): number {
    return this.data.setting.oka - 25000 === 0 ? 0 : (this.data.setting.oka - 25000) / 1000 * 4;
  }

  //初期値セット、名前と0ポイント
  setNameMapInit() {
    for (let i = 1; i <= this.mahjonNum; i++) {
      const name = this.utilService.getNameFromIndex(i, this.data.setting);
      this.seisanMapByName.set(name, 0);
      this.displayNameList.push(name);
      if (this.data.setting.isTip) {
        this.tipMapByName.set(name, 0);
      }
    }
  }

  setCaluculatedData() {
    //半荘ごとに精算していく
    for (let i = 0; i < this.data.resultList.length; i++) {
      const hanchan = this.data.resultList[i];//半荘データ
      this.hanchanSort(hanchan);//順位でソート
      let yakitoriPoint = 0;//一着が総取り
      let firstPersonName = '';//一着の名前
      //一人ずつ一着から計算
      for (let i = 1; i <= hanchan.pointList.length; i++) {
        let totalPoint = 0;//半荘でのポイント合計
        const pointOfPerson = hanchan.pointList[i - 1];
        const name = this.utilService.getNameFromIndex(pointOfPerson.nameIndex, this.data.setting);
        if (i === 1) {
          firstPersonName = name;
        }
        totalPoint += this.getUmaByRank(i);//ウマ加算
        //焼き鳥
        if (pointOfPerson.isYakitori) {
          yakitoriPoint += this.data.setting.yakitoriPoint;
          totalPoint -= this.data.setting.yakitoriPoint;
        }
        if (this.data.setting.isTobishou) {
          totalPoint += this.getTobishouByPerson(pointOfPerson); //飛び賞加減
        }
        totalPoint += this.getSotenPointByPerson(pointOfPerson);//素点計算
        this.setTotalPointByPerson(name, totalPoint);
      }
      //一着にオカと焼き鳥加算
      this.setOkaAndYakitoriForFirst(firstPersonName, this.okaPoint, yakitoriPoint);
    }
    //チップ数換算
    if (this.data.setting.isTip) {
      this.setTipPoint();
    }
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

  hanchanSort(hanchan: MatchResultDto) {
    //順位で半荘データを並び替え(半荘ごと)
    hanchan.pointList.sort((a, b) => {
      return (a.point > b.point) ? -1 : 1;  //オブジェクトの降順ソート
    });
  }

  /**
   * 順位ごとのウマを返す
   * @param i 順位のindex
   */
  getUmaByRank(i: number): number {
    const uma = this.umaMap.get(i);
    if (uma !== undefined) {
      return uma;
    }
    return 0;
  }

  /**
   * 飛び賞の加減をレスポンス
   * @param pointOfPerson
   */
  getTobishouByPerson(pointOfPerson: PointOfPerson): number {
    //飛んでいる場合減点
    if (this.data.setting.isTobishou && pointOfPerson.point <= 0) {
      return this.data.setting.tobishouPoint - this.data.setting.tobishouPoint * 2;//マイナス
    }
    //飛ばした場合加点
    if (this.data.setting.isTobishou && pointOfPerson.isTobishou) {
      return this.data.setting.tobishouPoint;//プラス
    }
    return 0;
  }

  /**
   * 素点計算後返却
   * @param pointOfPerson
   */
  getSotenPointByPerson(pointOfPerson: PointOfPerson): number {
    return pointOfPerson.point - this.data.setting.oka === 0 ? 0 : (pointOfPerson.point - this.data.setting.oka) / 1000;
  }

  /**
   * 既存の個人ごとMapに半荘データ加算
   * @param name 該当の名前
   * @param totalPoint 半荘での合計獲得ポイント
   */
  setTotalPointByPerson(name: string, totalPoint: number): void {
    const point = this.getPointByPerson(name);
    this.seisanMapByName.set(name, point + totalPoint);
  }

  /**
   * 既存の個人ごとMapからポイント取得(なければ0を返す)
   * @param name 該当の名前
   */
  getPointByPerson(name: string): number {
    const point = this.seisanMapByName.get(name);//既存データ
    if (point) {
      return point;
    }
    return 0;
  }

  /**
   * 一着にオカと焼き鳥加算
   * @param name 一着の名前
   * @param okaPoint オカの加点
   * @param yakirotiPoint 焼き鳥の加点
   */
  setOkaAndYakitoriForFirst(name: string, okaPoint: number, yakirotiPoint: number): void {
    let point = this.getPointByPerson(name);
    point += okaPoint;
    point += yakirotiPoint;
    this.seisanMapByName.set(name, point);
    console.log(this.seisanMapByName);
  }

  /**
   * チップ数をポイントに加算
   */
  setTipPoint() {
    this.seisanMapByName.forEach((v, k) => {
      let tipNumber = this.tipMapByName.get(k);
      if (!tipNumber) { tipNumber = 0; }
      const diffInitial = tipNumber - this.data.setting.tipInitialNumber;//初期枚数との差分
      const tipPoint = diffInitial * this.data.setting.tipRate;//一枚あたりのポイント換算
      console.log(tipPoint);
      this.seisanMapByName.set(k, v + tipPoint);
    });
  }
}
