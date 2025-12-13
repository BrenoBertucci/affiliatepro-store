import { createClient } from '@supabase/supabase-js';
import { Product, SiteSettingsRow, AnalyticsData } from '../types';
import { Database } from '../supabase.types';

// Try to get env vars from multiple sources
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || import.meta.env.VITE_NEXT_SUPABASE_URL || process.env.VITE_NEXT_SUPABASE_URL) as string;
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) as string;

// Debug: Log what we're getting from env
console.log('🔍 Debug ENV:', {
  URL_Length: SUPABASE_URL ? SUPABASE_URL.length : 0,
  KEY_Length: SUPABASE_KEY ? SUPABASE_KEY.length : 0,
});

// Check if Supabase credentials are configured
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase não está configurado. O aplicativo não funcionará corretamente sem conexão com o banco de dados.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return (data || []) as Product[];
  },

  getById: async (id: string): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }

    return data as Product;
  },

  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'view_count' | 'review_count' | 'rating' | 'user_id'>): Promise<Product> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const newProduct = {
      ...product,
      user_id: user.id,
      rating: 0,
      review_count: 0,
      click_count: 0,
      view_count: 0,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return data as Product;
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }

    return data as Product;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};

export const SettingsService = {
  getSettings: async (): Promise<SiteSettingsRow | null> => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
        console.error('Error fetching site settings:', error);
      }
      return null;
    }

    return data;
  },

  updateSettings: async (settings: Partial<SiteSettingsRow>): Promise<SiteSettingsRow> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario não autenticado');

    // Check if settings exist
    const current = await SettingsService.getSettings();

    let result;
    if (current) {
      // Update
      const { data, error } = await supabase
        .from('site_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', current.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Create
      const { data, error } = await supabase
        .from('site_settings')
        .insert({ ...settings, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return result;
  }
};

export const AnalyticsService = {
  trackView: async (productId: string) => {
    // 1. Increment view_count on products table
    const { error } = await supabase.rpc('increment_view_count', { row_id: productId });

    // If RPC fails (e.g. function not defined), fall back to simple update (less concurrent-safe but works)
    if (error) {
      const { data } = await supabase.from('products').select('view_count').eq('id', productId).single();
      if (data) {
        await supabase
          .from('products')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', productId);
      }
    }
  },

  trackClick: async (productId: string) => {
    // 1. Increment click_count on products table
    // Try RPC first
    const { error: rpcError } = await supabase.rpc('increment_click_count', { row_id: productId });

    if (rpcError) {
      const { data } = await supabase.from('products').select('click_count').eq('id', productId).single();
      if (data) {
        await supabase.from('products').update({ click_count: (data.click_count || 0) + 1 }).eq('id', productId);
      }
    }

    // 2. Insert into clicks table
    // We try to get client IP from specialized apis in frontend, but here we might just insert basic info
    // For a client-side only app, real IP tracking usually requires Edge Functions.
    // We will just insert the record.
    await supabase.from('clicks').insert({
      product_id: productId,
      clicked_at: new Date().toISOString()
    });
  }
};