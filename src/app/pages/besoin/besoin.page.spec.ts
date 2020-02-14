import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinPage } from './besoin.page';

describe('BesoinPage', () => {
  let component: BesoinPage;
  let fixture: ComponentFixture<BesoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
