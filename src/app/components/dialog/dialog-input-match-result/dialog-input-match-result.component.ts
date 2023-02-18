import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PointOfPerson } from '../../../class/match-result-data';

@Component({
  selector: 'app-dialog-input-match-result',
  templateUrl: './dialog-input-match-result.component.html',
  styleUrls: ['./dialog-input-match-result.component.scss']
})
export class DialogInputMatchResultComponent {
  public title = '';
  constructor(public dialogRef: MatDialogRef<DialogInputMatchResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resultList: { name: string; pointOfPerson: PointOfPerson }[], status: string }) {
    if (data.status === 'add') {
      this.title = '点棒入力';
    } else {
      this.title = '点棒修正';
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
