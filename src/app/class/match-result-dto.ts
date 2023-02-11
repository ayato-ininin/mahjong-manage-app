import { PointOfPerson } from './match-result-data';

export class MatchResultDto {
  roomId: number;
  matchIndex: number;
  pointList: PointOfPerson[];

  constructor() {
    this.roomId = 0;
    this.matchIndex = 0;
    this.pointList = [];
  }
}
