import { BaseCard } from '@/components/BusinessCardEditModal';

export interface BusinessCard extends BaseCard {
  organization: { organizationname: string } | null;
  region: { regionname: string } | null;
  category: { categoryname: string } | null;
  representative: { representativename: string } | null;
} 