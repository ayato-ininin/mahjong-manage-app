import { PointOfPerson } from './match-result-data';

export class MatchResultDto {
  roomId: number;
  pointList: PointOfPerson[];
  createTimeStamp?: string;//サーバから取得時のみ
  updateTimeStamp?: string;//サーバから取得時のみ

  constructor() {
    this.roomId = 0;
    this.pointList = [];
  }
}
