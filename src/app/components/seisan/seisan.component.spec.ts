import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeisanComponent } from './seisan.component';

describe('SeisanComponent', () => {
  let component: SeisanComponent;
  let fixture: ComponentFixture<SeisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeisanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
