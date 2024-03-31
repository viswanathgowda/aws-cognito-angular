import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  cognitoSrv = inject(AuthService);
  route = inject(Router);
  toast = inject(ToastService);

  userState!: boolean;

  signOut() {
    this.cognitoSrv.logout();
    this.cognitoSrv.authStatusChanged.subscribe((res) => {
      if (res === false) {
        this.toast.toastMssg.next({ mssg: 'Logout Successfull', show: true });
      }
    });
    this.route.navigate(['']);
  }

  ngOnInit() {
    this.cognitoSrv.authStatusChanged.subscribe((userState) => {
      this.userState = userState;
    });
  }
}
