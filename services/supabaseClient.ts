import { createClient } from '@supabase/supabase-js';
import { Product, SiteSettingsRow, AnalyticsData, FilterState } from '../types';
import { Database } from '../supabase.types';

// Try to get env vars from multiple sources
// Try to get env vars from multiple sources
const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_NEXT_SUPABASE_URL ||
  process.env.VITE_NEXT_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL
) as string;

const SUPABASE_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_NEXT_SUPABASE_ANON_KEY ||
  process.env.VITE_NEXT_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) as string;

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

// Export supabase as nullable if not configured to prevent crash
export const supabase = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_KEY)
  : null as any;

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    if (!supabase) return [];

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

  // Optimization: Server-side filtering to reduce data transfer
  getFiltered: async (filters: FilterState, sortOption: string): Promise<Product[]> => {
    if (!supabase) return [];

    let query = supabase
      .from('products')
      .select('*');

    // Category
    if (filters.category && filters.category !== 'Todos') {
      query = query.eq('category', filters.category);
    }

    // Price
    if (filters.minPrice > 0) {
      query = query.gte('price', filters.minPrice);
    }

    query = query.lte('price', filters.maxPrice);

    // Search
    if (filters.search) {
      const searchTerm = filters.search.trim().replace(/,/g, ' '); // Supabase .or() uses comma as separator
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
    }

    // Sort
    switch (sortOption) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('name', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('name', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered products:', error);
      return [];
    }

    return (data || []) as Product[];
  },

  // Optimization: Fetch only featured products with a limit to avoid loading the entire product database
  // and filtering on the client side. This significantly reduces payload size and processing time.
  getFeatured: async (limit = 3): Promise<Product[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return (data || []) as Product[];
  },

  getById: async (id: string): Promise<Product | undefined> => {
    if (!supabase) return undefined;

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
    if (!supabase) throw new Error('Supabase não configurado');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Only include fields that exist in the database
    const newProduct: Record<string, any> = {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      affiliate_platform: product.affiliate_platform,
      image_url: product.image_url,
      affiliate_link: product.affiliate_link,
      user_id: user.id,
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
    if (!supabase) throw new Error('Supabase não configurado');

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
    if (!supabase) throw new Error('Supabase não configurado');

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
    if (!supabase) return null;

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
    if (!supabase) throw new Error('Supabase não configurado');

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
    if (!supabase) return;

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
    if (!supabase) return;

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