import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // メニュークリック
  @Output() menuClickEvent = new EventEmitter<void>();
  constructor() { }

  // メニュークリックを親コンポーネントに通知
  onMenuClick = () => {
    this.menuClickEvent.emit();
  };
}
