import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaraudePage } from './maraude.page';

describe('MaraudePage', () => {
  let component: MaraudePage;
  let fixture: ComponentFixture<MaraudePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaraudePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaraudePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
