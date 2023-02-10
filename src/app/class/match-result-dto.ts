import { MatchResultData } from '../interface/match-result-data';

export class MatchResultDto {
  roomId: number;
  matchIndex: number;
  resultList: MatchResultData[];

  constructor() {
    this.roomId = 0;
    this.matchIndex = 0;
    this.resultList = [];
  }
}
