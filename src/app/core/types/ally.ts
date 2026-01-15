export interface BenefitDto {
  id: number;
  name: string;
  description: string;
  image: string;
  dateStart?: Date;
  dateEnd?: Date;
  isActive: boolean;
}

export interface AllyCategory {
  id: number;
  name: string;
}

export interface Ally {
  id: number;
  name: string;
  photo: string;
  description: string;
  isActive: boolean;
  categories?: AllyCategory[];
  benefits?: BenefitDto[];
  createdAt: Date;
  updatedAt: Date;
}
