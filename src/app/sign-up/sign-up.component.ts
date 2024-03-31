import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  confirmForm: FormGroup;
  confirmCode: boolean = false;
  pwdView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cognitoService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.confirmForm = this.fb.group({
      username: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  onSubmit() {
    const username = this.signUpForm.value.username;
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    const name = this.signUpForm.value.name;
    this.cognitoService.signUp(username, email, password, name).subscribe(
      (res) => {
        res
          ? ((this.confirmCode = true),
            this.toast.toastMssg.next({ mssg: res, show: true }))
          : (this.confirmCode = false);
      },
      (error) => {
        this.toast.toastMssg.next({ mssg: error, show: true });
      }
    );
  }

  onConfirmSignUp() {
    if (this.confirmForm.valid) {
      const username = this.confirmForm.value.username;
      const validationCode = this.confirmForm.value.code;
      this.cognitoService.confirmUser(username, validationCode).subscribe(
        (res) => {
          res
            ? (this.router.navigate(['']),
              this.toast.toastMssg.next({ mssg: res, show: true }))
            : ''; //signIn page - custmize the path
        },
        (error) => {
          this.toast.toastMssg.next({ mssg: error, show: true });
        }
      );
    }
  }
}
