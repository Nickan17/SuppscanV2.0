import { Supplement } from '@/types/supplement';

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export class OpenFoodFactsService {
  static async searchProducts(query: string): Promise<Supplement[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page_size=20`,
      );
      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products.map((product: any) => ({
        code: product.code,
        product_name: product.product_name,
        brands: product.brands,
        ingredients_text: product.ingredients_text,
        image_url: product.image_url,
        categories: product.categories,
        nutriscore_grade: product.nutriscore_grade,
        nova_group: product.nova_group,
        ecoscore_grade: product.ecoscore_grade,
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  static async getProductByBarcode(
    barcode: string,
  ): Promise<Supplement | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 0) {
        return null; // Product not found
      }

      return {
        code: data.code,
        product_name: data.product?.product_name,
        brands: data.product?.brands,
        ingredients_text: data.product?.ingredients_text,
        image_url: data.product?.image_url,
        categories: data.product?.categories,
        nutriscore_grade: data.product?.nutriscore_grade,
        nova_group: data.product?.nova_group,
        ecoscore_grade: data.product?.ecoscore_grade,
      };
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw error;
    }
  }
}
