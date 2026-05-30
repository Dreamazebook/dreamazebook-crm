export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  code?: number;
  data?: T;
}

export interface UserResponse {
  user: {
    id: string;
    name?: string;
    email: string;
    user_type?: string;
    has_set_password?: boolean;
  };
  token?: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: Array<Permission>;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  birthday: string | null;
  gender: string | null;
  email_verified_at: string | null;
  status: number;
  user_type: string;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
  roles: Array<Role>;
  permissions: Permission[];
}

// 购物车相关的类型定义
export interface CartAddRequest {
  // 兼容后端：现在 preview_id 等于 batch_id，这里放宽为 string | number
  preview_id: number | string;
  old_preview_id?: number | string; // 新增：用于标记该 cart item 基于哪个旧 preview
  quantity: number;
  cover_style?: string;
  customization_data?: {
    attributes?: {
      giftbox?: string;
      delivery_notes?: string;
      gift_message?: string;
      replace?: boolean;
      [key: string]: any;
    }
  };
}

export interface CartAddResponse {
  cart_item_id: number;
  message: string;
  id: number;
}

// 预览页面相关的类型定义
export interface PreviewPage {
  page_id: number;
  page_number: number;
  has_question: boolean;
  has_choice: boolean;
  choice_type: number;
  image_url: string;
  content: string | null;
  question: string | null;
  choice_options: string | null;
  has_face_swap: boolean;
  character_sequence: number[];
}

export interface PreviewCharacter {
  full_name: string;
  language: string;
  gender: number;
  skincolor: number;
  photo: string;
}

export interface FaceSwapBatch {
  batch_id: string;
  total_pages: number;
  status: string;
  queue_position: number;
  estimated_wait_time: number;
  queue_type: string;
  total_queue_length?: number;
}

export interface PreviewResponse {
  preview_data: PreviewPage[];
  characters: number[];
  face_swap_info: {
    batch_id: string;
    total_tasks: number;
    face_swap_pages: {
      page_id: number;
      variant_id: number;
      character_sequence: number[];
    }[];
    status: 'processing' | 'completed' | 'failed';
  };
  preview_id: number;
  total_pages: number;
  face_swap_pages_count: number;
}

export interface PreviewRequest {
  given_name: string;
  dedication: string;
  gender: number;
  skincolor: number;
  photo: string;
}

export interface OrderPreviewItem {
  item_id: number;
  picbook: {
    id: number;
    name: string;
    description: number;
  };
  character_info: {
    full_name: string;
    language: string;
    gender: number;
    skincolor: number;
  };
  personalization: {
    recipient_name: string;
    message: string;
    cover_type: string;
    binding_type: string;
    gift_box: boolean;
  };
  face_images: string;
  pages: Array<{
    page_number: number;
    page_id: number;
    image_url: string;
    result_image_url: string;
    is_face_swap: number;
    text: string;
    character_positions: any[];
  }>;
  processing_info: {
    status: string;
    progress: number;
    face_swap_batch: {
      status: string;
      batch_id: string;
      total_pages: number;
    };
    has_generated_book: boolean;
  };
  generated_file: any;
}

export interface OrderPreviewResponse {
  order_info: {
    id: number;
    order_number: string;
    status: string;
    status_text: string;
    created_at: string;
    confirmed_at: string | null;
    total: number | null;
  };
  user_info: {
    id: number;
    name: string;
    email: string;
  };
  items: Array<OrderPreviewItem>;
  summary: {
    total_items: number;
    items_with_generated_files: number;
    all_files_generated: boolean;
    can_generate_pdf: boolean;
    can_preview: boolean;
  };
}