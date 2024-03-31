import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const nextRoute = state.url; // Get the URL of the next route

    // If the next route is '/signin' or '/signup', handle it differently
    if (nextRoute === '/signin' || nextRoute === '/signup') {
      return this.authService.isAuthenticated().pipe(
        map((isAuthenticated) => {
          // If authenticated, prevent access to '/signin' and '/signup'
          return !isAuthenticated;
        })
      );
    }

    // For other routes, handle normal authentication logic
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          if (nextRoute === '/signin' || nextRoute === '/signup') {
            return false;
          } else {
            return true; // User is authenticated, allow access to the route
          }
        } else {
          return this.router.createUrlTree(['/signin']); // User is not authenticated, redirect to login page
        }
      })
    );
  }
}
