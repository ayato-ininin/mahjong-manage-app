import { PointOfPerson } from './match-result-data';

export class MatchResultDto {
  docId: string;
  roomId: number;
  pointList: PointOfPerson[];
  createTimeStamp?: string;//サーバから取得時のみ
  updateTimeStamp?: string;//サーバから取得時のみ

  constructor() {
    this.docId = '';
    this.roomId = 0;
    this.pointList = [];
  }
}
