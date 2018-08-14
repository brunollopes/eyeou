import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowitWorksComponent } from './howit-works.component';

describe('HowitWorksComponent', () => {
  let component: HowitWorksComponent;
  let fixture: ComponentFixture<HowitWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowitWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowitWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
