import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  errorMessage = '';

  // POST login.
  onSubmit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.auth.saveSession(res);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas';
      },
    });
  }
}
