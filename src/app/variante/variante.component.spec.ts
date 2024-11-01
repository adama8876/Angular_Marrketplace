import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarianteComponent } from './variante.component';

describe('VarianteComponent', () => {
  let component: VarianteComponent;
  let fixture: ComponentFixture<VarianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
