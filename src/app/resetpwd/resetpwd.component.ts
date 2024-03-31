import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css'],
})
export class ResetpwdComponent {
  route = inject(ActivatedRoute);

  pwdResetForm: FormGroup;
  forgotPwdForm: FormGroup;
  forgotPwd!: boolean;
  verifnCode: boolean = false;
  oldPwdView: boolean = false;
  newPwdView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cognitoService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.pwdResetForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
    this.forgotPwdForm = this.fb.group({
      username: ['', Validators.required],
      code: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.verifnCode = false;
    this.route.queryParams.subscribe((params) => {
      this.forgotPwd = params['forgotpwd'] === 'true';
    });
  }

  onSubmit() {
    if (this.pwdResetForm.valid) {
      this.cognitoService
        .changePassword(
          this.pwdResetForm.value.oldPassword,
          this.pwdResetForm.value.newPassword
        )
        .subscribe(
          (result) => {
            this.toast.toastMssg.next({
              mssg: 'Password updated successfully',
              show: true,
            });
            this.router.navigate(['/home']); //customize the navigation
          },
          (error) => {
            this.toast.toastMssg.next({ mssg: error.message, show: true });
          }
        );
    }
  }

  onForgotPwd() {
    if (this.forgotPwdForm.valid) {
      const username = this.forgotPwdForm.value.username;
      const verificationCode = this.forgotPwdForm.value.code;
      const newPassword = this.forgotPwdForm.value.newPassword;
      this.cognitoService
        .changePasswordWithVerification(username, verificationCode, newPassword)
        .subscribe(
          (result) => {
            this.toast.toastMssg.next({ mssg: result, show: true });
            this.router.navigate(['']); //signIn
          },
          (error) => {
            this.toast.toastMssg.next({ mssg: error.message, show: true });
          }
        );
    }
  }

  onSendVerificationCode() {
    const username = this.forgotPwdForm.value.username;
    this.cognitoService.sendVerificationCode(username).subscribe(
      (result) => {
        result
          ? ((this.verifnCode = true),
            this.toast.toastMssg.next({
              mssg: 'Verification code sent successfully',
              show: true,
            }))
          : (this.verifnCode = false);
      },
      (error) => {
        this.toast.toastMssg.next({ mssg: error.message, show: true });
      }
    );
  }
}
