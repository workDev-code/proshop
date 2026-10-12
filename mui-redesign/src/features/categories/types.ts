/** Category domain types — mirror backend/models/categoryModel.js */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  image: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
