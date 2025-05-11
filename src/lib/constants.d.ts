export const BODY_TYPES: readonly ["Straight", "Pear", "Apple", "Hourglass", "Athletic", "Plus", "Petite", "Tall"];
export const STYLE_OPTIONS: readonly ["Casual", "Boho", "Streetwear", "Minimal", "Ethnic", "Fusion", "Haute-Couture", "Designer"];
export const SHOPPING_BEHAVIOUR: readonly ["Rarely", "Monthly", "Weekly", "Impulse"];
export const COUNTRIES: readonly ["India", "USA", "UK", "Canada", "Australia", "Other"];

export type BodyType = typeof BODY_TYPES[number];
export type StyleOption = typeof STYLE_OPTIONS[number];
export type ShoppingBehaviour = typeof SHOPPING_BEHAVIOUR[number];
export type Country = typeof COUNTRIES[number]; 