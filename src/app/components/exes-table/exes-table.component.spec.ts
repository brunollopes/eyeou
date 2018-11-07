import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExesTableComponent } from './exes-table.component';

describe('ExesTableComponent', () => {
  let component: ExesTableComponent;
  let fixture: ComponentFixture<ExesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
