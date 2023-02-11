import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PointOfPerson } from '../../class/match-result-data';

@Component({
  selector: 'app-dialog-input-match-result',
  templateUrl: './dialog-input-match-result.component.html',
  styleUrls: ['./dialog-input-match-result.component.scss']
})
export class DialogInputMatchResultComponent {
  constructor(public dialogRef: MatDialogRef<DialogInputMatchResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resultList: { name: string; pointOfPerson: PointOfPerson }[] }) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
