export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          image_key: string | null;
          name: string;
          slug: string;
          sort: number;
          tagline: string | null;
        };
        Insert: {
          id?: string;
          image_key?: string | null;
          name: string;
          slug: string;
          sort?: number;
          tagline?: string | null;
        };
        Update: {
          id?: string;
          image_key?: string | null;
          name?: string;
          slug?: string;
          sort?: number;
          tagline?: string | null;
        };
        Relationships: [];
      };
      delivery_zones: {
        Row: {
          distance_km: number;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          distance_km: number;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          distance_km?: number;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      order_events: {
        Row: {
          created_at: string;
          id: string;
          note: string | null;
          order_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          note?: string | null;
          order_id: string;
          status: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          note?: string | null;
          order_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          line_total: number;
          name: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          line_total: number;
          name: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: string;
          line_total?: number;
          name?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          address: Json | null;
          created_at: string;
          customer_name: string;
          delivery_fee: number;
          delivery_partner: string | null;
          delivery_partner_phone: string | null;
          distance_km: number | null;
          eta_minutes: number | null;
          fulfillment: string;
          id: string;
          notes: string | null;
          order_number: string;
          payment_method: string;
          payment_ref: string | null;
          payment_status: string;
          phone: string;
          status: string;
          subtotal: number;
          tax: number;
          total: number;
          tracking_token: string;
          updated_at: string;
          zone_name: string | null;
        };
        Insert: {
          address?: Json | null;
          created_at?: string;
          customer_name: string;
          delivery_fee?: number;
          delivery_partner?: string | null;
          delivery_partner_phone?: string | null;
          distance_km?: number | null;
          eta_minutes?: number | null;
          fulfillment: string;
          id?: string;
          notes?: string | null;
          order_number: string;
          payment_method: string;
          payment_ref?: string | null;
          payment_status?: string;
          phone: string;
          status?: string;
          subtotal: number;
          tax?: number;
          total: number;
          tracking_token?: string;
          updated_at?: string;
          zone_name?: string | null;
        };
        Update: {
          address?: Json | null;
          created_at?: string;
          customer_name?: string;
          delivery_fee?: number;
          delivery_partner?: string | null;
          delivery_partner_phone?: string | null;
          distance_km?: number | null;
          eta_minutes?: number | null;
          fulfillment?: string;
          id?: string;
          notes?: string | null;
          order_number?: string;
          payment_method?: string;
          payment_ref?: string | null;
          payment_status?: string;
          phone?: string;
          status?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          tracking_token?: string;
          updated_at?: string;
          zone_name?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category_id: string;
          created_at: string;
          description: string | null;
          id: string;
          image_key: string | null;
          is_available: boolean;
          is_bestseller: boolean;
          is_veg: boolean;
          name: string;
          price: number;
          sort: number;
          subgroup: string | null;
          unit: string | null;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_key?: string | null;
          is_available?: boolean;
          is_bestseller?: boolean;
          is_veg?: boolean;
          name: string;
          price: number;
          sort?: number;
          subgroup?: string | null;
          unit?: string | null;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_key?: string | null;
          is_available?: boolean;
          is_bestseller?: boolean;
          is_veg?: boolean;
          name?: string;
          price?: number;
          sort?: number;
          subgroup?: string | null;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          address: string;
          cafe_name: string;
          delivery_minutes: number;
          delivery_slabs: Json;
          free_delivery_threshold: number;
          id: number;
          instagram_url: string | null;
          is_open: boolean;
          max_radius_km: number;
          min_order_value: number;
          opening_hours: string;
          phone_primary: string;
          phone_secondary: string | null;
          prep_minutes: number;
          tax_percent: number;
        };
        Insert: {
          address?: string;
          cafe_name?: string;
          delivery_minutes?: number;
          delivery_slabs?: Json;
          free_delivery_threshold?: number;
          id?: number;
          instagram_url?: string | null;
          is_open?: boolean;
          max_radius_km?: number;
          min_order_value?: number;
          opening_hours?: string;
          phone_primary?: string;
          phone_secondary?: string | null;
          prep_minutes?: number;
          tax_percent?: number;
        };
        Update: {
          address?: string;
          cafe_name?: string;
          delivery_minutes?: number;
          delivery_slabs?: Json;
          free_delivery_threshold?: number;
          id?: number;
          instagram_url?: string | null;
          is_open?: boolean;
          max_radius_km?: number;
          min_order_value?: number;
          opening_hours?: string;
          phone_primary?: string;
          phone_secondary?: string | null;
          prep_minutes?: number;
          tax_percent?: number;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "staff";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const;
