import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpdPage } from './rgpd.page';

describe('RgpdPage', () => {
  let component: RgpdPage;
  let fixture: ComponentFixture<RgpdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
