
export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface Watch {
  id: string;
  name: string;
  brand_id: string;
  brand_name: string;
  price: number;
  description: string;
  images: string[];
  specifications: {
    case: string;
    movement: string;
    waterResistance: string;
    strap: string;
  };
  stock: number;
  category: 'Classic' | 'Sport' | 'Aviator' | 'Dive';
  featured?: boolean;
  created_at?: string;
}

export interface CartItem {
  watch: Watch;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  customer: {
    name: string;
    email: string;
    address: string;
  };
  user_id?: string;
}

export enum AppRoute {
  Home = '/',
  Shop = '/shop',
  Product = '/product/:id',
  Cart = '/cart',
  Checkout = '/checkout',
  Confirmation = '/confirmation',
  AdminDashboard = '/admin',
  AdminProducts = '/admin/products',
  AdminOrders = '/admin/orders'
}
