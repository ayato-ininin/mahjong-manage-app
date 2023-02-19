
export class PointOfPerson {
  nameIndex: number;
  point: number;
  isYakitori: boolean;

  constructor(nameIndex: number, mahjongNumber: number) {
    this.nameIndex = nameIndex;
    if (mahjongNumber === 3) {
      this.point = 35000;
    } else {
      this.point = 25000;
    }
    this.isYakitori = false;
  }
}
