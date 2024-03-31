import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cognito-angular';
  authSrv = inject(AuthService);
  ngOnInit() {
    this.authSrv.initAuth();
  }
}
