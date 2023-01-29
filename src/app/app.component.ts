import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // サイドバー関連
  public sideBarOpened = false; // true で開いている状態。

  /**
 * サイドバーをクローズ。
 * Backdrop をクリックして閉じた場合に明示的にステータスを変更する必要あり。
 */
  onSideBarClose = () => {
    this.sideBarOpened = false;
  };

  /**
   * ヘッダのメニュアイコンをクリックした際に、サイドバーを開閉する。
   */
  onMenuClickFromChild = () => {
    this.sideBarOpened = !this.sideBarOpened;
  };
}
