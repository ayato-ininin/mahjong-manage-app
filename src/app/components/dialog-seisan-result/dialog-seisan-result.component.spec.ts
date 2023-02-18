import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSeisanResultComponent } from './dialog-seisan-result.component';

describe('DialogSeisanResultComponent', () => {
  let component: DialogSeisanResultComponent;
  let fixture: ComponentFixture<DialogSeisanResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSeisanResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSeisanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
