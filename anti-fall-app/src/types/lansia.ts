export interface Lansia {
  id: string;
  customerId: string;
  nama: string;
  usia: number;
  jenisKelamin: 'Perempuan' | 'Laki-laki';
  alamat: string;
  noHp: string;
  kondisiKesehatan: string;
  deviceId: string;
  status: 'Aktif' | 'Nonaktif';
  catatan: string;
  emergencyContactId?: string;
  createdAt?: unknown;
}

export type LansiaFormData = Omit<Lansia, 'id'>;
