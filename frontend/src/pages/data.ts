export interface VehicleModel {
  id: string;
  name: string;
  category: 'Remorques' | 'Camions' | 'Conteneurs';
  weightEmpty: number;
  ptac: number;
  maxPayload: number;
  basePrice: number;
  description: string;
  dimensions: string;
  axles: 1 | 2;
  imageUrl: string;
  metierTarget: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Cuisson' | 'Froid' | 'Hygiène' | 'Extraction' | 'Mobilier';
  weight: number;
  powerWatts: number;
  energy: 'Électrique' | 'Gaz' | 'Neutre';
  price: number;
}

export const VEHICLES: VehicleModel[] = [
  { id: 'rem-3m-noire', name: 'Remorque Food Truck 3,00m Noire', category: 'Remorques', weightEmpty: 650, ptac: 1300, maxPayload: 650, basePrice: 24880, description: 'Format compact et ultra maniable, passe partout.', dimensions: '3,00m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Snack / Burger' },
  { id: 'rem-hy-3m-paul', name: 'Remorque Food Truck HY 3,00m Boulangerie', category: 'Remorques', weightEmpty: 750, ptac: 1500, maxPayload: 750, basePrice: 32070, description: 'Style vintage Type H, idéal boulangerie et pâtisserie.', dimensions: '3,00m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Boulangerie' },
  { id: 'rem-hy-420-beige', name: 'Remorque Food Truck HY 4,20m Beige', category: 'Remorques', weightEmpty: 950, ptac: 2000, maxPayload: 1050, basePrice: 39770, description: 'Grand format vintage pour fort débit événementiel.', dimensions: '4,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Événementiel' },
  { id: 'rem-traiteur-bois', name: 'Remorque Cuisine Traiteur Covering Bois', category: 'Remorques', weightEmpty: 850, ptac: 1800, maxPayload: 950, basePrice: 29620, description: 'Finition bois élégante et grand espace de préparation.', dimensions: '4,00m x 2,00m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Traiteur' },
  { id: 'rem-marches', name: 'Remorque de Marchés', category: 'Remorques', weightEmpty: 700, ptac: 1500, maxPayload: 800, basePrice: 25150, description: 'Auvent panoramique et étals optimisés pour les marchés.', dimensions: '3,50m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Vente directe' },
  { id: 'rem-pates', name: 'Remorque Food Truck Pâtes', category: 'Remorques', weightEmpty: 680, ptac: 1300, maxPayload: 620, basePrice: 24880, description: 'Emplacement cuiseurs à pâtes et maintien au chaud.', dimensions: '3,00m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Pasta Bar' },
  { id: 'rem-tacos', name: 'Remorque Tacos Mexicains', category: 'Remorques', weightEmpty: 720, ptac: 1400, maxPayload: 680, basePrice: 26856, description: 'Double plancha et presses à tacos intégrées.', dimensions: '3,60m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Street Food' },
  { id: 'rem-360m-verte', name: 'Remorque Food Truck 3,60m', category: 'Remorques', weightEmpty: 730, ptac: 1500, maxPayload: 770, basePrice: 27025, description: 'Le standard polyvalent pour tout type de restauration.', dimensions: '3,60m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Polyvalent' },
  { id: 'rem-520m-rose', name: 'Remorque Food Truck 5,20m', category: 'Remorques', weightEmpty: 1100, ptac: 2500, maxPayload: 1400, basePrice: 34200, description: 'Volume XXL double essieu pour équipes de 3 à 5 personnes.', dimensions: '5,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Grand Débit' },
  { id: 'rem-snack-360', name: 'Remorque Snack 3,60m', category: 'Remorques', weightEmpty: 730, ptac: 1500, maxPayload: 770, basePrice: 27025, description: 'Configuration snack rapide, friteuse et plancha.', dimensions: '3,60m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Snack' }
];

export const EQUIPMENTS: Equipment[] = [
  { id: 'kit-eau', name: 'Pack Autonomie Eau (Cuves 150L + Chauffe-eau)', category: 'Hygiène', weight: 45, powerWatts: 1200, energy: 'Électrique', price: 1250 },
  { id: 'plancha-pro', name: 'Plancha Gaz Professionnelle 80cm', category: 'Cuisson', weight: 35, powerWatts: 150, energy: 'Gaz', price: 1890 },
  { id: 'friteuse-double', name: 'Friteuse Double Bac Électrique 2x8L', category: 'Cuisson', weight: 20, powerWatts: 6000, energy: 'Électrique', price: 1450 }
];
