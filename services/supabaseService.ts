// Supabase Service for handling database operations
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Product Operations
export interface Product {
  id: string;
  name: string;
  brand: string;
  ingredients: string;
  barcode: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(
        `name.ilike.%${query}%,brand.ilike.%${query}%,ingredients.ilike.%${query}%`,
      )
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function getProductByBarcode(
  barcode: string,
): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    return null;
  }
}

export async function saveProduct(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
}
