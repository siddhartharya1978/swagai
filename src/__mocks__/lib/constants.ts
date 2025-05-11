export const BODY_TYPES = ['athletic', 'slim', 'curvy', 'average'];
export const COUNTRIES = ['US', 'CA', 'GB', 'IN'];
export const STYLE_OPTIONS = ['casual', 'minimalist', 'formal', 'sporty'];
export const SHOPPING_BEHAVIOUR = ['online', 'in-store', 'both'];
export type BodyType = typeof BODY_TYPES[number];
export type Country = typeof COUNTRIES[number];
export type StyleOption = typeof STYLE_OPTIONS[number];
export type ShoppingBehaviour = typeof SHOPPING_BEHAVIOUR[number]; 