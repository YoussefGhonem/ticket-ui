import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { sweetAlertOptions } from "@shared/default-values/notification-sweetalert-options";
import { result } from 'lodash';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  error(title: string, message: string) {
    let html = `
    <lord-icon src="https://cdn.lordicon.com/tdrtiskw.json" trigger="loop" colors="primary:#f06548,secondary:#f7b84b" style="width:120px;height:120px"></lord-icon>
    <div class="mt-4 pt-2 fs-15 ">
      <h4>${title}</h4>
      <p class="text-muted mx-4 mb-0">${message}</p>
    </div>
    `;

    swal.fire({
      ...sweetAlertOptions,
      html: html,
    });

  }

  info(title: string, message: string) {
    let html = `
    <div style="text-align: left;">
      <p style="font-weight: 400;color: #299cdb; margin-bottom: 1px;">${title}</p>
      <p style="width: 100%;">${message}</p>
    </div>`;

    swal.fire({
      ...sweetAlertOptions,
      html: html,
      icon: 'info',
    });

  }

  success(title: string, message: string) {
    // document.querySelector("button.confirm").focus();

    let html = `
    <lord-icon src="https://cdn.lordicon.com/lupuorrc.json" trigger="loop" colors="primary:#0ab39c,secondary:#405189" style="width:120px;height:120px"></lord-icon>
    <div class="mt-4 pt-2 fs-15">
        <h4 style ="color: #2d2e2f;">${title}</h4>
        <p class="text-muted mx-4 mb-0">${message}</p>
    </div>`;

    swal.fire({
      ...sweetAlertOptions,
      html: html,
    })

  }

}
