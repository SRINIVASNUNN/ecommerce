import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from 'src/app/state/Auth/auth.actions';
import { AuthService } from 'src/app/state/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Input()
  changeTemplate!: () => void;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['srinivasnunnavath043@gmail.com', [Validators.required, Validators.email]],
    password: ['Srinivas@155', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    // Automatically submit the form after the component initializes
    setTimeout(() => this.submitForm(), 0); // Using setTimeout to allow the form to fully initialize
  }
  submitForm(): void {
    if (this.loginForm.valid) {
      console.log('login req data', this.loginForm.value);
      // this.store.dispatch(login(this.loginForm.value));
      this.authService.login(this.loginForm.value)
    }
  }
}
