import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, tap } from 'rxjs';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { User } from './user.model';

/**
 * the below secret IDs should needs to maintain in environment.ts and enviroment.prod.ts,
 * change the IDs with your cognito pool
 */
const POOL_DATA = {
  UserPoolId: 'us-east-1_t00DbCutE',
  ClientId: 'i8n4bsbo8kmh46ip9nodb9jav',
};

const userPool = new CognitoUserPool(POOL_DATA);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatusChanged = new BehaviorSubject<boolean>(false); //user auth or login status

  constructor() {
    this.initAuth();
  }

  signUp(username: string, email: string, password: string, name: string) {
    const user: User = {
      name: name,
      username: username,
      email: email,
      password: password,
    };

    const emailAttribute = {
      Name: 'email',
      Value: user.email,
    };

    const attrList: CognitoUserAttribute[] = [];
    const validationList: CognitoUserAttribute[] = [];

    attrList.push(new CognitoUserAttribute(emailAttribute));
    const resultSubject = new Subject<any>();

    userPool.signUp(
      user.username,
      user.password,
      attrList,
      validationList,
      function (err, result: any) {
        if (err) {
          resultSubject.error(err);
        }
        resultSubject.next('verification code sent');
      }
    );
    return resultSubject.asObservable();
  }

  confirmUser(username: string, code: string) {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    const resultSubject = new Subject<any>();
    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        resultSubject.error(err);
      } else {
        resultSubject.next(result);
        resultSubject.complete();
      }
    });
    return resultSubject.asObservable();
  }

  signIn(username: string, password: string) {
    const authData = {
      Username: username,
      Password: password,
    };

    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cogUser = new CognitoUser(userData);
    const resultSubject = new Subject<any>();

    cogUser.authenticateUser(authDetails, {
      onSuccess(result: CognitoUserSession) {
        resultSubject.next('Password changed successfully');
        resultSubject.complete();
      },
      onFailure(err) {
        resultSubject.error(err);
      },
    });
    return resultSubject.asObservable();
  }

  getAuthenticatedUser() {
    return userPool.getCurrentUser();
  }

  logout() {
    this.getAuthenticatedUser()?.signOut();
    this.authStatusChanged.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();

    if (!user) {
      return of(false);
    }

    return new Observable<boolean>((observer) => {
      user.getSession((err: any, session: any) => {
        if (err) {
          observer.next(false);
        } else {
          observer.next(session.isValid());
        }
        observer.complete();
      });
    });
  }

  initAuth() {
    this.isAuthenticated()
      .pipe(
        tap((auth) => {
          this.authStatusChanged.next(auth);
        })
      )
      .subscribe();
  }

  changePassword(oldPassword: string, newPassword: string) {
    const cognitoUser = this.getAuthenticatedUser(); // Get the current authenticated user
    const resultSubject = new Subject<object>();

    if (cognitoUser) {
      const authenticationData = {
        Username: cognitoUser.getUsername(),
        Password: oldPassword,
      };

      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      );

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          cognitoUser.changePassword(
            oldPassword,
            newPassword,
            (err, result) => {
              if (err) {
                console.error('Change password error:', err);
                resultSubject.error({
                  mssg: 'Change password error',
                  status: false,
                });
              } else {
                resultSubject.next({
                  mssg: 'Password changed successfully',
                  status: true,
                });
              }
            }
          );
        },
        onFailure: (err) => {
          console.error('Authentication error:', err);
          resultSubject.error({ mssg: 'Change password error', status: false });
        },
      });
    } else {
      console.error('User not authenticated');
      resultSubject.error({ mssg: 'Change password error', status: false });
    }
    return resultSubject.asObservable();
  }

  sendVerificationCode(username: string) {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    const resultSubject = new Subject<boolean>();

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        resultSubject.next(data);
        resultSubject.complete();
      },
      onFailure: (err) => {
        resultSubject.error(err);
      },
    });
    return resultSubject.asObservable();
  }

  changePasswordWithVerification(
    username: string,
    verificationCode: string,
    newPassword: string
  ) {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    const resultSubject = new Subject<any>();

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        resultSubject.next('Password changed successfully');
        resultSubject.complete();
      },
      onFailure: (err) => {
        resultSubject.error(err);
      },
    });
    return resultSubject.asObservable();
  }
}
