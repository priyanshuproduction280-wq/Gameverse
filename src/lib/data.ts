import type { Game, Order, PaymentConfig } from '@/lib/types';

export const games: Game[] = [
  {
    id: '1',
    slug: 'cybernetic-horizons',
    title: 'Cybernetic Horizons',
    platform: 'PC',
    shortDescription: 'An open-world, action-adventure story set in a dystopian future.',
    description: 'Explore the sprawling metropolis of Neo-Veridia in this thrilling open-world adventure. As a cybernetically enhanced mercenary, you\'ll take on dangerous missions, uncover corporate conspiracies, and decide the fate of a city on the brink of chaos. Featuring a rich narrative, deep customization, and visceral combat.',
    price: 59.99,
    imageUrl: 'https://picsum.photos/seed/1/600/800',
    imageHint: 'futuristic city',
    bannerUrl: 'https://picsum.photos/seed/b1/1600/600',
    bannerHint: 'neon cityscape',
    tags: ['RPG', 'Open World', 'Sci-Fi'],
  },
  {
    id: '2',
    slug: 'elden-ring',
    title: 'Elden Ring',
    platform: 'PC',
    shortDescription: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.',
    price: 69.99,
    imageUrl: 'https://picsum.photos/seed/2/600/800',
    imageHint: 'fantasy warrior',
    bannerUrl: 'https://picsum.photos/seed/b2/1600/600',
    bannerHint: 'epic landscape',
    tags: ['Action RPG', 'Fantasy', 'Souls-like'],
  },
  {
    id: '3',
    slug: 'starfield',
    title: 'Starfield',
    platform: 'PC',
    shortDescription: 'The next generation role-playing game set amongst the stars.',
    description: 'Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4. In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom as you embark on an epic journey to answer humanity’s greatest mystery.',
    price: 69.99,
    imageUrl: 'https://picsum.photos/seed/3/600/800',
    imageHint: 'astronaut space',
    bannerUrl: 'https://picsum.photos/seed/b3/1600/600',
    bannerHint: 'galaxy stars',
    tags: ['RPG', 'Sci-Fi', 'Space'],
  },
  {
    id: '4',
    slug: 'valorant',
    title: 'Valorant',
    platform: 'PC',
    shortDescription: 'A 5v5 character-based tactical shooter where creativity is your greatest weapon.',
    description: 'Blend your style and experience on a global, competitive stage. You have 13 rounds to attack and defend your side using sharp gunplay and tactical abilities. And, with one life per-round, you\'ll need to think faster than your opponent if you want to survive. Take on foes across Competitive and Unranked modes as well as Deathmatch and Spike Rush.',
    price: 0.00,
    imageUrl: 'https://picsum.photos/seed/4/600/800',
    imageHint: 'character shooter',
    bannerUrl: 'https://picsum.photos/seed/b4/1600/600',
    bannerHint: 'abstract shapes',
    tags: ['Tactical Shooter', 'Free to Play', 'Competitive'],
  },
  {
    id: '5',
    slug: 'the-witcher-3',
    title: 'The Witcher 3: Wild Hunt',
    platform: 'PC',
    shortDescription: 'Become a professional monster slayer and embark on an adventure of epic proportions.',
    description: 'You are Geralt of Rivia, mercenary monster slayer. At your disposal is every tool of the trade: razor-sharp swords, lethal mixtures, stealthy crossbows, and powerful combat magic. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.',
    price: 39.99,
    imageUrl: 'https://picsum.photos/seed/5/600/800',
    imageHint: 'fantasy monster',
    bannerUrl: 'https://picsum.photos/seed/b5/1600/600',
    bannerHint: 'medieval castle',
    tags: ['Action RPG', 'Open World', 'Fantasy'],
  },
  {
    id: '6',
    slug: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    platform: 'PC',
    shortDescription: 'The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs.',
    description: 'America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him.',
    price: 49.99,
    imageUrl: 'https://picsum.photos/seed/6/600/800',
    imageHint: 'cowboy sunset',
    bannerUrl: 'https://picsum.photos/seed/b6/1600/600',
    bannerHint: 'western landscape',
    tags: ['Action-Adventure', 'Open World', 'Western'],
  },
];

export const paymentConfig: PaymentConfig = {
  qrCodeUrl: 'https://picsum.photos/seed/qrcode/300/300',
};

export const orders: Order[] = [
    {
        id: 'ord-1',
        userId: 'user-1',
        userEmail: 'user@example.com',
        items: [
            { gameId: '1', title: 'Cybernetic Horizons', price: 59.99, quantity: 1 },
            { gameId: '2', title: 'Elden Ring', price: 69.99, quantity: 1 }
        ],
        totalAmount: 129.98,
        status: 'Delivered',
        createdAt: new Date('2023-10-26T10:00:00Z').getTime(),
    },
    {
        id: 'ord-2',
        userId: 'user-1',
        userEmail: 'user@example.com',
        items: [
            { gameId: '3', title: 'Starfield', price: 69.99, quantity: 1 }
        ],
        totalAmount: 69.99,
        status: 'Pending',
        createdAt: new Date().getTime(),
    },
];

// Mock data fetching functions
export const getGames = async (): Promise<Game[]> => {
  return Promise.resolve(games);
};

export const getGameBySlug = async (slug: string): Promise<Game | undefined> => {
  return Promise.resolve(games.find((g) => g.slug === slug));
};

export const getFeaturedGames = async (count: number = 3): Promise<Game[]> => {
  return Promise.resolve([...games].sort(() => 0.5 - Math.random()).slice(0, count));
};

export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  return Promise.resolve(paymentConfig);
}

export const getOrdersForUser = async (userId: string): Promise<Order[]> => {
  return Promise.resolve(orders.filter(o => o.userId === userId));
}

export const getAllOrders = async (): Promise<Order[]> => {
  return Promise.resolve(orders);
}

export const getAdminEmails = async (): Promise<string[]> => {
  return Promise.resolve(['admin@gamerverse.com']);
}
