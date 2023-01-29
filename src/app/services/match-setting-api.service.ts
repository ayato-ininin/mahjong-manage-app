import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MatchSetting } from '../interfaces/match-setting-dto';

@Injectable({
  providedIn: 'root'
})
export class MatchSettingApiService {
  private host = ''

  // またコメントにあるとおり、 `Authorization` を設定できるように `httpOptions` としてオブジェクトでラップしている
  // 参考
  // https://angular.jp/guide/http#%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B
  /**
   * Http クライアントを実行する際のヘッダオプション
   * @private
   * @type {*}
   * @memberof HttpClientService
   * @description
   * 認証トークンを使用するために `httpOptions` としてオブジェクトを用意した。
   */
  private httpOptions: any = {
    // ヘッダ情報
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    //
    // レスポンスにヘッダ情報を入れるための設定
    // https://angular.io/guide/http#reading-the-full-response
    //
    observe: 'response',  // ⇐ これを追加
    //
    // DELETE 実行時に `body` が必要になるケースがあるのでプロパティとして用意しておく
    // ( ここで用意しなくても追加できるけど... )
    body: null
  };

  constructor(private http: HttpClient) {
    if (location.host == 'localhost:4200') {
      this.host = 'http://localhost:4200/app';
    } else {
      this.host = 'https://mahjong-linebot-avsxliwbsa-uc.a.run.app'
    }
  }

  /**
   *
   * エラーレスポンス表示
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      window.alert('ステータス:' + error.status + '(' + error.statusText + ')' + '\r\n' + 'An error occurred:' + error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      window.alert('ステータス:' + error.status + '\r\n' + error.statusText + ' : ' + error.error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /** POST: add a new hero to the database */
  postApiMatchSetting(matchSettting: MatchSetting): Observable<any> {
    return this.http.post<MatchSetting>(this.host + '/v1/api/matchSetting', matchSettting, this.httpOptions)
      .pipe(
        timeout(2500), // タイムアウト処理
        // retry(3), // リトライ処理
        catchError(err => this.handleError(err)));
  }
}
