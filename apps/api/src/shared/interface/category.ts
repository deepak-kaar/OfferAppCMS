import { FirestoreId, FireStoreDate, CreatedBy } from './vendor';

export interface Category {
  _id: FirestoreId;
  __v: number;
  name: string;
  name_ar: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
  createdBy: CreatedBy;
  updatedBy?: CreatedBy;
  createdAt: FireStoreDate;
  updatedAt: FireStoreDate;
}
