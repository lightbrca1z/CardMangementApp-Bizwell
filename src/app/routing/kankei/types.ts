export interface BusinessCard {
  businesscardid: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
  organization?: { organizationname: string } | null;
  region?: { regionname: string } | null;
  category?: { categoryname: string } | null;
  representative?: { representativename: string } | null;
} 