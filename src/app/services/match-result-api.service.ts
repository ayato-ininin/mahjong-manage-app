import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MatchResultDto } from '../class/match-result-dto';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MatchResultApiService {
  constructor(
    private http: HttpClient,
    private apiHandlerService: ApiHandlerService
  ) {}

  getApiMatchResult(roomId: number): Observable<any> {
    return this.http.get<MatchResultDto>(this.apiHandlerService.host + '/v1/api/matchResult/' + roomId , this.apiHandlerService.httpOptions)
      .pipe(
        timeout(2500), // タイムアウト処理
        // retry(3), // リトライ処理
        catchError(err => this.apiHandlerService.handleError(err)));
  }

  /** POST: add the database */
  postApiMatchResult(matchResult: MatchResultDto): Observable<any> {
    return this.http.post<MatchResultDto>(this.apiHandlerService.host + '/v1/api/matchResult', matchResult, this.apiHandlerService.httpOptions)
      .pipe(
        timeout(2500), // タイムアウト処理
        // retry(3), // リトライ処理
        catchError(err => this.apiHandlerService.handleError(err)));
  }

  /** Put: update the database */
  updateApiMatchResult(matchResult: MatchResultDto): Observable<any> {
    return this.http.put<MatchResultDto>(this.apiHandlerService.host + '/v1/api/matchResult', matchResult, this.apiHandlerService.httpOptions)
      .pipe(
        timeout(2500), // タイムアウト処理
        // retry(3), // リトライ処理
        catchError(err => this.apiHandlerService.handleError(err)));
  }
}
