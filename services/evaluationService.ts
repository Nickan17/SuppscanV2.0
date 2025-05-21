import { supabase, handleSupabaseError } from '@/lib/supabase';
import { EvaluationResult } from './openRouter';

export interface EvaluationLog {
  id?: string;
  created_at?: string;
  updated_at: string;
  product_id: string;
  product_name: string | null;
  brand: string | null;
  result: EvaluationResult;
}

export class EvaluationService {
  static async logEvaluation(params: {
    productId: string;
    productName: string;
    brand: string;
    result: EvaluationResult;
  }): Promise<EvaluationLog> {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .upsert(
          {
            product_id: params.productId,
            product_name: params.productName,
            brand: params.brand,
            result: params.result,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'product_id',
            ignoreDuplicates: false,
          },
        )
        .select()
        .single();

      if (error) throw error;

      return data as EvaluationLog;
    } catch (error) {
      console.error('Error logging evaluation:', error);
      throw handleSupabaseError(error);
    }
  }

  static async getEvaluation(productId: string): Promise<EvaluationLog | null> {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return data as EvaluationLog;
    } catch (error) {
      console.error('Error getting evaluation:', error);
      throw handleSupabaseError(error);
    }
  }

  static async getRecentEvaluations(limit = 10): Promise<EvaluationLog[]> {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as EvaluationLog[];
    } catch (error) {
      console.error('Error getting recent evaluations:', error);
      throw handleSupabaseError(error);
    }
  }
}
