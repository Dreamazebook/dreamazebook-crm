export interface CouponListItem {
  id: number;
  code: string;
  status: 'active' | 'inactive';
  created_for: string;
  campaign_name: string;
  orders: number;
  revenue: number;
  aov: number;
  discount_given: number;
  used_count: number;
  first_used_at: string | null;
  last_used_at: string | null;
}

export interface CouponPerformance {
  orders: number;
  revenue: number;
  aov: number;
  discount_given: number;
}

export interface RecentOrder {
  order_id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  revenue_amount: number;
  discount_amount: number;
  paid_at: string;
}

export interface CouponDetail {
  id: number;
  code: string;
  status: 'active' | 'inactive';
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency_code: string;
  campaign_name: string;
  created_for: string;
  description: string;
  valid_from: string | null;
  valid_until: string | null;
  max_uses: number | null;
  used_count: number;
  per_user_limit: number | null;
  min_subtotal_amount: number | null;
  max_discount_amount: number | null;
  allow_stack_with_promotions: boolean;
  first_used_at: string | null;
  last_used_at: string | null;
  metadata: Record<string, any> | null;
  performance: CouponPerformance;
  recent_orders: RecentOrder[];
}

export interface CouponFormData {
  code: string;
  campaign_name: string;
  created_for: string;
  description: string;
  status: 'active' | 'inactive';
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency_code: string;
  valid_from: string;
  valid_until: string;
  max_uses: number | null;
  per_user_limit: number | null;
  min_subtotal_amount: number | null;
  max_discount_amount: number | null;
  allow_stack_with_promotions: boolean;
  metadata: Record<string, any> | null;
}

export interface CouponsListResponse {
  success: boolean;
  data: CouponListItem[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
