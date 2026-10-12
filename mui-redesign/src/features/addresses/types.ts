/** Address domain types — mirror backend/models/addressModel.js */
export interface Address {
  _id: string;
  user: string;
  label: string;
  fullName: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  label?: string;
  fullName: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;
