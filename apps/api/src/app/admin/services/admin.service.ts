import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { app } from 'firebase-admin';
import { Admin } from '../interfaces/admin.interface';

@Injectable()
export class AdminService {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: app.App,
    private readonly jwtService: JwtService,
  ) {
    this.#db = firebaseApp.firestore();
    this.#collection = this.#db.collection('admins');
  }

  /**
   * Register a new admin (or update name for an existing one).
   *
   * Stores only networkId, name and role in the "admins" collection.
   */
  async register(networkId: string, name: string): Promise<Admin> {
    const snapshot = await this.#collection
      .where('networkId', '==', networkId)
      .limit(1)
      .get();

    // If admin exists, update the name and return
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({ name });
      const data = doc.data() as Omit<Admin, 'id'>;
      return { id: doc.id, ...data, name };
    }

    // Otherwise, create a new admin with default "admin" role
    const adminData: Omit<Admin, 'id'> = {
      networkId,
      name,
      role: 'admin',
    };

    const docRef = await this.#collection.add(adminData);
    const created = await docRef.get();
    const createdData = created.data() as Omit<Admin, 'id'>;

    return {
      id: created.id,
      ...createdData,
    };
  }

  /**
   * Simple sample login.
   *
   * - Accepts networkId and a fixed password "admin@123"
   * - Does NOT store password in the database
   * - Requires the admin to be pre-registered
   */
  async login(
    networkId: string,
    password: string,
  ): Promise<{ admin: Admin; token: string }> {
    // Fixed password check – replace with SSO in the future
    if (password !== 'admin@123') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Find existing admin by networkId
    const snapshot = await this.#collection
      .where('networkId', '==', networkId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new NotFoundException('Admin not registered');
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Omit<Admin, 'id'>;
    const admin: Admin = { id: doc.id, ...data };

    const payload = {
      sub: admin.id,
      networkId: admin.networkId,
      name: admin.name,
      role: admin.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return { admin, token };
  }
}

