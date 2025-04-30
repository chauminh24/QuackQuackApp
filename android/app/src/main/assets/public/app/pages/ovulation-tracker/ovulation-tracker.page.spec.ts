import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OvulationTrackerPage } from './ovulation-tracker.page';

describe('OvulationTrackerPage', () => {
  let component: OvulationTrackerPage;
  let fixture: ComponentFixture<OvulationTrackerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OvulationTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
