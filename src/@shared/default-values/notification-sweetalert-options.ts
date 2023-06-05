import Swal, { SweetAlertOptions } from "sweetalert2";

export const sweetAlertOptions: SweetAlertOptions = {
  toast: false,
  // iconColor: '#28c76f',
  // animation: true,
  // position: 'top-right',
  icon: null,
  showConfirmButton: true,
  showCloseButton: false,
  showCancelButton: false,
  confirmButtonText: 'Dismiss',
  returnFocus:false,
  focusConfirm: true,
  allowEnterKey: false,
  buttonsStyling: false,
  customClass: {
    confirmButton: 'swal2-confirm btn btn-success w-xs mb-1'
  },
  didOpen(popup) {
    Swal.getConfirmButton().focus();
  }
  // timer: 5000,
  // timerProgressBar: true,
}
