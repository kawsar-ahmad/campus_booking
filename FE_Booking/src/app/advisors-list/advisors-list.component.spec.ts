import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorsListComponent } from './advisors-list.component';

describe('AdvisorsListComponent', () => {
  let component: AdvisorsListComponent;
  let fixture: ComponentFixture<AdvisorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
