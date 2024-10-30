import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutmodifiersouscatComponent } from './ajoutmodifiersouscat.component';

describe('AjoutmodifiersouscatComponent', () => {
  let component: AjoutmodifiersouscatComponent;
  let fixture: ComponentFixture<AjoutmodifiersouscatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutmodifiersouscatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutmodifiersouscatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
