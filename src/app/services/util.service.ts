import { Injectable } from '@angular/core';

import { MatchSettingDto } from '../class/match-setting-dto';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() { }

  /**
   * nameIndexより、対象の登録者名を取得する
   * @param i
   */
  public getNameFromIndex(i: number, matchSetting: MatchSettingDto): string {
    switch (i) {
      case 1:
        return matchSetting.name1;
      case 2:
        return matchSetting.name2;
      case 3:
        return matchSetting.name3;
      case 4:
        return matchSetting.name4 ? matchSetting.name4 : '';
      default:
        return '';
    }
  }

  getMajongNumber(mahjongNumber: string): number {
    if (mahjongNumber === '三麻') {
      return 3;
    }
    return 4;
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
