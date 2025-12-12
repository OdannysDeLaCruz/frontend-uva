export interface PartnerCategory {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
  subcategories?: PartnerCategory[];
  createdAt: Date;
  updatedAt: Date;
}
