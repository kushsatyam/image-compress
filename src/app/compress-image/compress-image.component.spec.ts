import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompressImageComponent } from './compress-image.component';

describe('CompressImageComponent', () => {
  let component: CompressImageComponent;
  let fixture: ComponentFixture<CompressImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompressImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompressImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
