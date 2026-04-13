import Swal from 'sweetalert2';

const baseOptions = {
  confirmButtonColor: '#2563eb',
  customClass: {
    popup: 'swal-popup',
    confirmButton: 'swal-confirm-button',
  },
};

export function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    ...baseOptions,
    icon: 'success',
    title,
    text,
  });
}

export function showErrorAlert(title: string, text?: string) {
  return Swal.fire({
    ...baseOptions,
    icon: 'error',
    title,
    text,
  });
}
