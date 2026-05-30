export interface LogisticsOrder {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: string;
  currency_code: string;
  created_at: string;
  updated_at: string;
  logistics_request_no: string | null;
  logistics_status: string | null;
  tracking_number: string | null;
  can_create_logistics: boolean;
  has_logistics: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  shipping_address: {
    id?: number;
    city: string;
    type?: number;
    email: string;
    phone: string;
    state: string;
    phone2: string | null;
    street: string;
    company: string | null;
    country: string;
    user_id?: number;
    district: string | null;
    last_name: string;
    post_code: string;
    created_at?: string;
    first_name: string;
    is_default?: boolean;
    updated_at?: string;
    second_name: string | null;
    house_number: string | null;
  };
  completed_items_count: number;
  total_items_count: number;
  print_data?: {
    print_pdf: {
      files: Array<{
        url: string;
        path: string;
        spu_id: number;
        item_id: number;
      }>;
      status: string;
      completed_at: string;
    };
  };
  pickup_collect_no?: string;
  pickup_reserve_time?: string;
}

export type LogisticsOrderList = LogisticsOrder[];