import type { OsOption, ProcessorOption, MemoryOption, GraphicsOption, StorageOption } from './system-requirements';

export type Game = {
  slug: string;
  title: string;
  platform: 'PC' | 'PS' | 'Xbox';
  description: string;
  price: number;
  imageUrl: string;
  bannerUrl: string;
  tags: string[];
  rating?: number;
  systemRequirements?: {
    os: OsOption;
    processor: ProcessorOption;
    memory: MemoryOption;
    graphics: GraphicsOption;
    storage: StorageOption;
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
