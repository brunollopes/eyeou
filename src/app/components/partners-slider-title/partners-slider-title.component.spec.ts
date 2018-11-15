import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersSliderTitleComponent } from './partners-slider-title.component';

describe('PartnersSliderTitleComponent', () => {
  let component: PartnersSliderTitleComponent;
  let fixture: ComponentFixture<PartnersSliderTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersSliderTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersSliderTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
