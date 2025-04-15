import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntegratorPage } from './integrator.page';

describe('IntegratorPage', () => {
  let component: IntegratorPage;
  let fixture: ComponentFixture<IntegratorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
