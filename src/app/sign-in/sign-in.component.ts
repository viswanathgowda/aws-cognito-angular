import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  loginForm: FormGroup;
  pwdView: boolean = false;
  constructor(
    private fb: FormBuilder,
    private cognitoService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.signIn(this.loginForm.value.email, this.loginForm.value.password);
    }
  }

  signIn(email: string, password: string) {
    this.cognitoService.signIn(email, password).subscribe(
      (result) => {
        this.toast.toastMssg.next({ mssg: 'signIn successfull', show: true });
        this.cognitoService.authStatusChanged.next(true);
        this.router.navigate(['/home']); //customize navigation
        this.loginForm.reset();
      },
      (error) => {
        this.toast.toastMssg.next({ mssg: error.message, show: true });
        this.cognitoService.authStatusChanged.next(false);
      }
    );
  }
}
