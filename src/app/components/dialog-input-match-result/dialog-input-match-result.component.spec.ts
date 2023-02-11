import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInputMatchResultComponent } from './dialog-input-match-result.component';

describe('DialogInputMatchResultComponent', () => {
  let component: DialogInputMatchResultComponent;
  let fixture: ComponentFixture<DialogInputMatchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInputMatchResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogInputMatchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
