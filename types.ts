import { Database } from './supabase.types';

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type UserRow = Database['public']['Tables']['users']['Row'];
export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

export interface Product extends Omit<ProductRow, 'affiliate_platform'> {
  // Frontend/Computed properties
  currency?: string;
  rating?: number;
  review_count?: number;

  // Mapped/Enforced properties
  affiliate_platform: 'Amazon' | 'Hotmart' | 'Mercado Livre' | 'Outro' | string | null;

  // Backwards compatibility aliases (optional, but might need to refactor code instead)
  // platform? : string; // We will refactor 'platform' usage to 'affiliate_platform'
  // clicks?: number; // We will refactor 'clicks' usage to 'click_count'
}

export interface User extends UserRow {
  role?: 'admin' | 'user';
}

export interface AnalyticsData {
  date: string;
  clicks: number;
  views: number;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  search: string;
}