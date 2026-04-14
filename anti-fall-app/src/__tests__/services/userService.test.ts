import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersByRole,
  saveUserProfile,
  updateUser,
  updateUserRole,
} from '../../services/userService';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'collection-ref'),
  deleteDoc: jest.fn(),
  doc: jest.fn((_db, _col, id) => `doc-${id}`),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(() => 'query-ref'),
  serverTimestamp: jest.fn(() => 'server-ts'),
  setDoc: jest.fn(),
  where: jest.fn(() => 'where-role'),
}));

jest.mock('../../lib/firebase', () => ({
  db: {},
}));

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets all users', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => ({ uid: '1', fullName: 'User 1' }) }],
    });

    await expect(getAllUsers()).resolves.toEqual([{ uid: '1', fullName: 'User 1' }]);
    expect(collection).toHaveBeenCalled();
  });

  it('gets users by role', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => ({ uid: '2', role: 'admin' }) }],
    });

    const result = await getUsersByRole('admin');

    expect(where).toHaveBeenCalledWith('role', '==', 'admin');
    expect(query).toHaveBeenCalled();
    expect(result).toEqual([{ uid: '2', role: 'admin' }]);
  });

  it('gets one user by id', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: '3', fullName: 'Dewi' }),
    });

    await expect(getUserById('3')).resolves.toEqual({ uid: '3', fullName: 'Dewi' });
  });

  it('saves and updates user records', async () => {
    await saveUserProfile('5', { fullName: 'Budi' });
    await updateUserRole('5', 'admin');
    await addUser({ uid: '5', fullName: 'Budi', email: 'a@test.com', role: 'customer' });
    await updateUser('5', { phone: '08123' });

    expect(setDoc).toHaveBeenCalledWith('doc-5', expect.objectContaining({ uid: '5', fullName: 'Budi' }), { merge: true });
    expect(setDoc).toHaveBeenCalledWith('doc-5', expect.objectContaining({ uid: '5', role: 'admin' }), { merge: true });
    expect(setDoc).toHaveBeenCalledWith('doc-5', expect.objectContaining({ createdAt: 'server-ts' }));
    expect(setDoc).toHaveBeenCalledWith('doc-5', expect.objectContaining({ uid: '5', phone: '08123' }), { merge: true });
  });

  it('deletes user by id', async () => {
    await deleteUser('9');
    expect(deleteDoc).toHaveBeenCalledWith('doc-9');
  });
});
