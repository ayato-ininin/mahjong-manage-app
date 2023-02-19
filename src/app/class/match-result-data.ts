
export class PointOfPerson {
  nameIndex: number;
  point: number;
  isYakitori: boolean;//焼き鳥だったか
  isTobishou: boolean;//誰かを飛ばしたか

  constructor(nameIndex: number, mahjongNumber: number) {
    this.nameIndex = nameIndex;
    if (mahjongNumber === 3) {
      this.point = 35000;
    } else {
      this.point = 25000;
    }
    this.isYakitori = false;
    this.isTobishou = false;
  }
}
