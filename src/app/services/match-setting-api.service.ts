import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MatchSettingDto } from '../class/match-setting-dto';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MatchSettingApiService {
  constructor(
    private http: HttpClient,
    private apiHandlerService: ApiHandlerService
  ) {}

  getApiMatchSetting(roomId: number): Observable<any> {
    return this.http.get<MatchSettingDto>(this.apiHandlerService.host + '/v1/api/matchSetting/' + roomId , this.apiHandlerService.httpOptions)
      .pipe(
        timeout(2500), // タイムアウト処理
        // retry(3), // リトライ処理
        catchError(err => this.apiHandlerService.handleError(err)));
  }

  /** POST: add a new hero to the database */
  postApiMatchSetting(matchSettting: MatchSettingDto): Observable<any> {
    return this.http.post<MatchSettingDto>(this.apiHandlerService.host + '/v1/api/matchSetting', matchSettting, this.apiHandlerService.httpOptions)
      .pipe(
        timeout(2500), // タイムアウト処理
        // retry(3), // リトライ処理
        catchError(err => this.apiHandlerService.handleError(err)));
  }
}
