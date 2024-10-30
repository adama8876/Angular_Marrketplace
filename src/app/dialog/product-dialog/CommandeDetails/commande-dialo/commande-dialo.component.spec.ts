import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeDialoComponent } from './commande-dialo.component';

describe('CommandeDialoComponent', () => {
  let component: CommandeDialoComponent;
  let fixture: ComponentFixture<CommandeDialoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeDialoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeDialoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
