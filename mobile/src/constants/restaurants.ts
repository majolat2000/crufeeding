/**
 * Available Restaurants — single cafeteria for the feeding platform.
 */
export type Restaurant = { id: string; name: string; icon: string; ETA?: string };

export const RESTAURANTS: Restaurant[] = [
  { id: "1", name: "The Cafeteria", icon: "🍽️" },
];
