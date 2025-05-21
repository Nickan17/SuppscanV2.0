export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      evaluations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          product_id: string;
          product_name: string | null;
          brand: string | null;
          result: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          product_id: string;
          product_name?: string | null;
          brand?: string | null;
          result: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          product_id?: string;
          product_name?: string | null;
          brand?: string | null;
          result?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
