import { Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  toastSrv = inject(ToastService);
  toast: any;

  ngOnInit() {
    this.toastSrv.toastMssg.subscribe((res) => {
      this.toast = res;
    });
  }

  closeToast() {
    this.toast.show = false;
  }
}
