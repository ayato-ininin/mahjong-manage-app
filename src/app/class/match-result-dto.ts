import { PointOfPerson } from './match-result-data';

export class MatchResultDto {
  roomId: number;
  pointList: PointOfPerson[];

  constructor() {
    this.roomId = 0;
    this.pointList = [];
  }
}
