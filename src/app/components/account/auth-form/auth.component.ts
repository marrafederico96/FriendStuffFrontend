import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';
import { LoginDto, RegisterDto } from '../../../dto/authDto';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  public error?: string;
  public loading = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  public isLogin = false;
  public form!: FormGroup;

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    this.isLogin = urlSegments.length > 0 && urlSegments[urlSegments.length - 1].path === 'login';
    this.generateForm();
  }

  showPassword() {
    this.hidePassword.set(!this.hidePassword());
  }
  showConfirmPassword() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  generateForm() {
    if (!this.isLogin) {
      this.form = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      });
    } else {
      this.form = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', Validators.required],
      });
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.loading.set(true);
    this.error = undefined;

    if (!this.isLogin) {
      const formData: RegisterDto = this.form.value;
      this.authService.registerUser(formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/account/login']);
          this.form.reset();
        },
        error: (err) => {
          this.loading.set(false);
          if (err.error?.errors) {
            const validationErrors = err.error.errors;
            let messages: string[] = [];
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                messages = messages.concat(validationErrors[field]);
              }
            }
            this.error = messages.join('\n');
          } else if (err.error?.message) {
            this.error = err.error.message;
          }
        }
      });
    } else {
      const formData: LoginDto = this.form.value;
      this.authService.loginUser(formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
          this.form.reset();
        },
        error: (err) => {
          this.loading.set(false);
          this.error = err.error?.message ?? 'Login Error';
        }
      });
    }
  }
}
