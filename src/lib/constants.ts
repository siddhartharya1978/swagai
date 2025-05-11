export const BODY_TYPES = [
  'Apple',
  'Pear',
  'Hourglass',
  'Athletic/Rectangle',
  'Petite',
  'Plus Size',
  'Tall',
  'Straight'
];

export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil',
  'Canada', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
  'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia',
  'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'UAE', 'United Kingdom', 'United States', 'Vietnam'
];

export const STYLE_OPTIONS = [
  'Casual',
  'Minimalist',
  'Formal',
  'Sporty',
  'Bohemian',
  'Streetwear',
  'Vintage',
  'Classic',
  'Preppy',
  'Glamorous',
  'Edgy',
  'Romantic',
  'Ethnic',
  'Indo-Western Fusion',
  'Business Casual',
  'Athleisure',
  'Elegant',
  'Retro'
];

export const SHOPPING_BEHAVIOUR = ['Online', 'In-Store', 'Both'];

export const SHOPPING_FREQUENCY = ['Weekly', 'Monthly', 'Occasionally', 'Rarely'];

export type BodyType = typeof BODY_TYPES[number];
export type Country = typeof COUNTRIES[number];
export type StyleOption = typeof STYLE_OPTIONS[number];
export type ShoppingBehaviour = typeof SHOPPING_BEHAVIOUR[number];
export type ShoppingFrequency = typeof SHOPPING_FREQUENCY[number]; 