export interface Lansia {
  id: string;
  customerId: string;
  nama: string;
  usia: number;
  jenisKelamin: 'Perempuan' | 'Laki-laki';
  alamat: string;
  noHp: string;
  kondisiKesehatan: string;
  deviceSerial: string;
  deviceId: string;
  status: 'Aktif' | 'Nonaktif';
  catatan: string;
  emergencyId?: string;
  createdAt?: any;
}

export type LansiaFormData = Omit<Lansia, 'id'>;
