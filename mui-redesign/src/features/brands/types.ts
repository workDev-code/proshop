/** Brand domain types — mirror backend/models/brandModel.js */
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandPayload {
  name: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>;
