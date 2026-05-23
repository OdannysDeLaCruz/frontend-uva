export interface PartnerCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentId?: number;
  order: number;
  isActive: boolean;
  subcategories?: PartnerCategory[];
  createdAt: Date;
  updatedAt: Date;
}
