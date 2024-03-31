import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastMssg = new BehaviorSubject<Object>({ mssg: '', show: false });
}
