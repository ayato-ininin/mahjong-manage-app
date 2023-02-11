import { PointOfMatch } from './match-result-data';

export class MatchResultDto {
  roomId: number;
  matchIndex: number;
  resultList: PointOfMatch[];

  constructor() {
    this.roomId = 0;
    this.matchIndex = 0;
    this.resultList = [];
  }
}
