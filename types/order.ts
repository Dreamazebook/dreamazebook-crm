import { Address } from "@/types/address";
import { CartItem } from "./cart";

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${month} ${day}, ${year} at ${hour12}:${minutes} ${ampm}`;
}

export type ShippingOptions = ShippingOption[] | { options: ShippingOption[] };

export const getShippingOptions = (shipping_options?: ShippingOptions): ShippingOption[] => {
  if (!shipping_options) return [];
  return Array.isArray(shipping_options) ? shipping_options : shipping_options.options || [];
};

export interface OrderDetail {
  id: number;
  user_id: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  can_generate_pdf: boolean;
  order_number: string;
  total_amount: number;
  currency_code: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  payment_id: string | null;
  billing_address: Address;
  shipping_method: string;
  shipped_at?: string | null;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  discount_details?: {
    rate: number;
    type: string;
    applied_at: string;
    percentage: number;
    description: string;
    normal_books_count?: number;
    non_package_original_total?: number;
  };
  coupon_code: string;
  notes: string;
  stripe_payment_intent_id: string;
  stripe_client_secret: string;
  stripe_payment_intent_data?: {
    amount: number,
    status: string,
    currency: string,
    updated_at: string
  },
  stripe_receipt_url?: string;
  shipping_address: Address;
  paid_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  delivered_at?: string;
  items: CartItem[];
  shipping_options: ShippingOptions;
  logistics_data?: LogisticsData;
  pdf_urls?: string[];
  permissions: {
    can_cancel: boolean;
    can_update_address: boolean;
    can_update_address_except_country: boolean;
    can_pay: boolean;
  };
}

export interface LogisticsData {
  ref_no: string;
  sender: AddressInfo;
  duty_type: string;
  is_insure: string;
  parcel_list: Parcel[];
  return_info: ReturnInfo;
  business_type: string;
  label_barcode: string;
  recipient_info: AddressInfo;
  "4px_tracking_no": string;
  oda_result_sign: string;
  deliver_type_info: DeliverTypeInfo;
  ds_consignment_no: string;
  logistics_channel_no: string;
  logistics_service_info: LogisticsServiceInfo;
  deliver_to_recipient_info: DeliverToRecipientInfo;
  print_pdf?: {
    files: Array<{
      id: number;
      name: string;
      url: string;
      size: number;
      type: string;
    }>;
    status: string;
    completed_at: string;
  };
}

export interface AddressInfo {
  city: string;
  phone: string;
  state: string;
  street: string;
  country: string;
  district: string;
  last_name: string;
  post_code: string;
  first_name: string;
  email?: string;
  company?: string;
  house_number?: string;
}

export interface Parcel {
  weight: number;
  currency: string;
  parcel_value: number;
  product_list: Product[];
  include_battery: string;
  declare_product_info: DeclareProductInfo[];
}

export interface Product {
  qty: number;
  currency: string;
  sku_code: string;
  product_name: string;
  product_unit_price: number;
  product_description: string;
  standard_product_barcode: string;
}

export interface DeclareProductInfo {
  sales_url: string;
  brand_export: string;
  brand_import: string;
  currency_export: string;
  currency_import: string;
  package_remarks: string;
  unit_declare_product: string;
  declare_product_name_cn: string;
  declare_product_name_en: string;
  declare_product_code_qty: number;
  declare_unit_price_export: number;
  declare_unit_price_import: number;
}

export interface ReturnInfo {
  is_return_on_oversea: string;
  is_return_on_domestic: string;
}

export interface DeliverTypeInfo {
  deliver_type: string;
}

export interface LogisticsServiceInfo {
  logistics_product_code: string;
}

export interface DeliverToRecipientInfo {
  deliver_type: string;
}

export const EMPTY_CART_ITEM = {
  id: 0,
  name: "",
  format: "",
  box: "",
  image: "",
  price: 0,
  quantity: 0,
  total_price: 0,
  picbook_name: "",
  picbook_cover: "",
  message: "",
  status: "",
  created_at: "",
  updated_at: "",
};

export interface ResultImage {
  base_image_path: string;
  final_image_url: string;
  face_swap_mask_url: string;
  item_id: number;
  page_code: string;
  can_refresh?: boolean;
  is_refreshing?: boolean;
}

export interface ShippingErrors {
  email?: string;
  first_name?: string;
  last_name?: string;
  house_number?: string;
  address?: string;
  city?: string;
  post_code?: string;
  country?: string;
  state?: string;
  phone?: string;
}

export interface BillingErrors {
  billingEmail?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
}

export type PaymentOption = "card" | "paypal" | null;

export interface ShippingOption {
  charge_weight?: string;
  code: string;
  cost: number;
  currency?: string;
  description?: string;
  estimated_days?: string;
  free_shipping_amount?: number;
  is_free?: boolean;
  is_free_shipping_baseline?: boolean;
  is_selected?: boolean;
  is_trackable?: boolean | string;
  name?: string;
  original_cost?: string;
  original_currency?: string;
  payable_cost: number;
  raw_data?: Record<string, unknown> | any;
  remarks?: string;
  type?: string;
}

export interface Pickbook {
  default_name: string;
  default_cover: string;
  pricesymbol: string;
  price: number;
  currencycode: string;
  total_pages: number;
  preview_pages_count: number;
  rating: number;
  has_choices: boolean;
  has_question: boolean;
  supported_languages: string[];
  supported_genders: string[];
  supported_skincolors: string[];
  character_count: number;
  tags: string[];
  status: string;
  is_saleable: boolean;
  choices_type: string;
}

export const statusLabelMap: { [key: string]: string } = {
  all: "allOrder",
  unpaid: "unpaid",
  paid: "paid",
  pending: "unpaid",
  processing: "digitalProduction",
  ai_processing: "digitalProduction",
  ai_completed: "digitalProduction",
  confirmed: "printProduction",
  pdf_confirmed: "printProduction",
  shipping: "inTransit",
  logistics_confirmed: "inTransit",
  logistics_shipped: "inTransit",
  delivered: "delivered",
  completed: "delivered",
  logistics_delivered: "delivered",
  cancelled: "closed",
  refunded: "closed",
  closed: "closed",
};

export const getBooksCountFromOrder = (orderDetail: OrderDetail) => {
  if (orderDetail?.discount_details) {
    return orderDetail?.discount_details.normal_books_count;
  }
  return orderDetail?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
}