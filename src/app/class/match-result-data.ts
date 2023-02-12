
export class PointOfPerson {
  nameIndex: number;
  point: number;
  isYakitori: boolean;
  createTimeStamp?: string;//サーバから取得時のみ
  updateTimeStamp?: string;//サーバから取得時のみ

  constructor(nameIndex: number) {
    this.nameIndex = nameIndex;
    this.point = 25000;
    this.isYakitori = false;
  }
}
