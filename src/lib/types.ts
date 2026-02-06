export type Game = {
  id: string;
  slug: string;
  title: string;
  platform: 'PC' | 'PS' | 'Xbox';
  shortDescription: string;
  description: string;
  price: number;
  imageUrl: string;
  bannerUrl: string;
  tags: string[];
  rating?: number;
  systemRequirements?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  }
};

export type CartItem = {
  id: string;
  game: Game;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  items: {
    gameId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Delivered';
  createdAt: number;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  username?: string | null;
  phoneNumber?: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
};

export type PaymentConfig = {
  qrCodeUrl: string;
};
