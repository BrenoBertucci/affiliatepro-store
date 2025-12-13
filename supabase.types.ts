export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clicks: {
        Row: {
          id: string
          product_id: string
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          country_code: string | null
          clicked_at: string
        }
        Insert: {
          id?: string
          product_id: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          country_code?: string | null
          clicked_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          country_code?: string | null
          clicked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clicks_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          affiliate_link: string
          affiliate_platform: string | null
          is_active: boolean | null
          is_featured: boolean | null
          category: string | null
          tags: string | null
          slug: string | null
          meta_description: string | null
          view_count: number | null
          click_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          affiliate_link: string
          affiliate_platform?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          category?: string | null
          tags?: string | null
          slug?: string | null
          meta_description?: string | null
          view_count?: number | null
          click_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          affiliate_link?: string
          affiliate_platform?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          category?: string | null
          tags?: string | null
          slug?: string | null
          meta_description?: string | null
          view_count?: number | null
          click_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          author_name: string
          author_email: string | null
          rating: number | null
          comment: string | null
          is_approved: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          author_name: string
          author_email?: string | null
          rating?: number | null
          comment?: string | null
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          author_name?: string
          author_email?: string | null
          rating?: number | null
          comment?: string | null
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          id: string
          user_id: string
          site_name: string | null
          site_description: string | null
          site_url: string | null
          twitter_url: string | null
          instagram_url: string | null
          youtube_url: string | null
          tiktok_url: string | null
          email_contact: string | null
          whatsapp_number: string | null
          primary_color: string | null
          secondary_color: string | null
          logo_url: string | null
          favicon_url: string | null
          google_analytics_id: string | null
          google_adsense_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          site_name?: string | null
          site_description?: string | null
          site_url?: string | null
          twitter_url?: string | null
          instagram_url?: string | null
          youtube_url?: string | null
          tiktok_url?: string | null
          email_contact?: string | null
          whatsapp_number?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          google_adsense_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          site_name?: string | null
          site_description?: string | null
          site_url?: string | null
          twitter_url?: string | null
          instagram_url?: string | null
          youtube_url?: string | null
          tiktok_url?: string | null
          email_contact?: string | null
          whatsapp_number?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          google_adsense_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          bio: string | null
          profile_image_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          bio?: string | null
          profile_image_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          bio?: string | null
          profile_image_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: {
          row_id: string
        }
        Returns: void
      }
      increment_click_count: {
        Args: {
          row_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
