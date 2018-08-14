import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTilesComponent } from './slider-tiles.component';

describe('SliderTilesComponent', () => {
  let component: SliderTilesComponent;
  let fixture: ComponentFixture<SliderTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
