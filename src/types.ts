
export interface Variant {
  size: string;
  price: number;
  paymentLink?: string;
}

export interface Product {
  id: string;
  name: string;
  price?: number;
  description: string;
  category: string;
  themes?: string[];
  image: string;
  rating?: number;
  variants?: Variant[];
  variantLabel?: string;
  materials?: string[];
  rush_price?: number;
  paymentLink?: string;
  fulfillment?: 'ships' | 'pickup' | 'local' | 'both';
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: Variant;
}

export type View = 'home' | 'products' | 'cart' | 'details' | 'quote' | 'success' | 'admin' | 'login' | 'corporate';

export interface CategoryConfig {
  name: string;
  image?: string;
}

export interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    welcomeTitle: string;
    backgroundImages: string[];
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  aboutMe: {
    title: string;
    name: string;
    experience: string;
    bio: string[];
    image: string;
    slogan: string;
  };
  missionVision: {
    missionTitle: string;
    missionDesc: string;
    missionIcon: string;
    visionTitle: string;
    visionDesc: string;
    visionIcon: string;
  };
  bestSellers: {
    title: string;
    subtitle: string;
    btnText: string;
  };
  footer: {
    slogan: string;
    copyright: string;
  };
  categories: CategoryConfig[];
  occasions: string[];
  corporateGallery: string[];
  logo?: string;
  stripeLink?: string;
  paypalEmail?: string;
}

export interface QuoteFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventName: string;
  eventDate: string;
  address: string;
  serviceType: string;
  needsDesign: boolean;
  deliveryMethod: 'pickup' | 'delivery' | 'ups';
  inspirationFiles: string[];
  comments: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
