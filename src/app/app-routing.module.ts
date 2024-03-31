import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [
  { path: 'signin', canActivate: [AuthGuard], component: SignInComponent },
  { path: 'signup', canActivate: [AuthGuard], component: SignUpComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'resetpwd', component: ResetpwdComponent },
  { path: '**', redirectTo: '/signin' },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
