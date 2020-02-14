import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgencePage } from './urgence.page';

describe('UrgencePage', () => {
  let component: UrgencePage;
  let fixture: ComponentFixture<UrgencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
