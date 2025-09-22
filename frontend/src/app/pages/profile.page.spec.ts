import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfilePage } from './profile.page';
import { AuthService } from '../services/auth.service';
import { TestMaterialModule } from '../test-material.module';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        TestMaterialModule,
        ProfilePage, // Import as standalone component
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            profile: () => ({ subscribe: () => {} }),
            updateProfile: () => ({ subscribe: () => {} }),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
