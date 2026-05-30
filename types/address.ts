export const EMPTY_ADDRESS = {
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  street: "",
  house_number: "",
  city: "",
  post_code: "",
  country: "",
  state: "",
  phone: "",
  is_default: false,
  type: 1,
};

export interface Address {
  [key: string]: string | undefined | boolean | number;
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  house_number?: string;
  city?: string;
  post_code?: string;
  country?: string;
  state?: string;
  phone?: string;
  type: number;
  is_default: boolean;
}

export function formatAddress(address: Address) {
  if (!address) return "";
  return `${address.house_number || ""} ${address.street} \n ${address.city}  ${
    address.post_code
  } \n ${address.country}`;
}
