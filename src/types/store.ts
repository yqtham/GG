export type ProductCategory = 'Phones' | 'Earbuds' | 'Laptops' | 'Bottles';

export type CustomerSegment = 'Runners' | 'Gym' | 'Students' | 'Office' | 'Kids';

export type SeriesType = 'Custom Studio' | 'Designer Series';

export type PatternType = 'Smooth Matte' | 'Grip Ribbed' | 'Carbon Weave' | 'Topo Contour';

export type ProtectionTier = 'Impact' | 'Bounce' | 'Ultra Bounce';

export type TextLayout = 'Bottom' | 'Diagonal' | 'Spine' | 'Center';

export type TextFont = 'Mono' | 'Display' | 'Serif';

export type GraphicStamp = 'None' | 'Bolt' | 'Checker' | 'Sunburst' | 'Stars' | 'Wave';

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  isDark: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  deviceModel: string;
  protectionTier: ProtectionTier;
  segments: CustomerSegment[];
  series: SeriesType;
  designerName?: string;
  price: number;
  baseColorId: string;
  accentColorId: string;
  pattern: PatternType;
  stamp?: GraphicStamp;
  tagline: string;
  specs: string[];
  inStock: boolean;
}

export interface CartItem {
  cartKey: string;
  productId: string;
  name: string;
  category: ProductCategory;
  deviceModel: string;
  protectionTier: ProtectionTier;
  unitPrice: number;
  quantity: number;
  shellColorId: string;
  accentColorId: string;
  pattern: PatternType;
  stamp: GraphicStamp;
  engraving: string;
  textLayout: TextLayout;
  textFont: TextFont;
  seriesLabel: string;
}

export interface PopupEvent {
  id: string;
  title: string;
  venue: string;
  dateLabel: string;
  hours: string;
  channelNote: string;
}

export interface OrderReceipt {
  orderId: string;
  warrantyCode: string;
  customerName: string;
  email: string;
  address: string;
  paymentMethod: 'Card' | 'Cash on Delivery';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}
