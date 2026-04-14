import Swal from 'sweetalert2';
import { showErrorAlert, showSuccessAlert } from '../../lib/alerts';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('alerts helpers', () => {
  it('shows success alert with expected payload', () => {
    showSuccessAlert('Berhasil', 'Data tersimpan');

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data tersimpan',
        confirmButtonColor: '#2563eb',
      })
    );
  });

  it('shows error alert with expected payload', () => {
    showErrorAlert('Gagal', 'Terjadi masalah');

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi masalah',
        confirmButtonColor: '#2563eb',
      })
    );
  });
});
