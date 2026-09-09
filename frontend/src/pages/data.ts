export interface VehicleModel {
  id: string;
  name: string;
  category: 'Remorques' | 'Camions' | 'Conteneurs';
  weightEmpty: number; // Poids à vide en kg
  ptac: number; // PTAC en kg
  maxPayload: number; // Charge utile
  basePrice: number;
  description: string;
  dimensions: string;
  axles: 1 | 2; // Mono ou double essieu
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
  { id: 'rem-520m-rose', name: 'Remorque Food Truck 5,20m', category: 'Remorques', weightEmpty: 1100, maxPayload: 2500, maxPayloadCalc: 1400, basePrice: 34200, description: 'Volume XXL double essieu pour équipes de 3 à 5 personnes.', dimensions: '5,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Grand Débit' },
  { id: 'rem-snack-360', name: 'Remorque Snack 3,60m', category: 'Remorques', weightEmpty: 730, ptac: 1500, maxPayload: 770, basePrice: 27025, description: 'Configuration snack rapide, friteuse et plancha.', dimensions: '3,60m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Snack' },
  { id: 'rem-asiatique', name: 'Remorque Cuisine Asiatique', category: 'Remorques', weightEmpty: 750, ptac: 1500, maxPayload: 750, basePrice: 27020, description: 'Espace woks gaz haute pression et cuiseurs riz.', dimensions: '3,60m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Wok / Asiat' },
  { id: 'rem-churrasqueira', name: 'Remorque Churrasqueira', category: 'Remorques', weightEmpty: 880, ptac: 1800, maxPayload: 920, basePrice: 29430, description: 'Hotts à extraction renforcée et grillades.', dimensions: '4,00m x 2,00m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Grill / Rotisserie' },
  { id: 'rem-vide', name: 'Remorque Food Truck Vide', category: 'Remorques', weightEmpty: 500, ptac: 1300, maxPayload: 800, basePrice: 11570, description: 'Structure nue sur châssis, prête à être aménagée.', dimensions: '3,00m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Sur mesure' },
  { id: 'rem-labo-520', name: 'Remorque Labo 5,20m', category: 'Remorques', weightEmpty: 1200, ptac: 2500, maxPayload: 1300, basePrice: 41950, description: 'Laboratoire mobile conforme HACCP pour préparation pure.', dimensions: '5,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Laboratoire' },
  { id: 'rem-420m', name: 'Remorque Food Truck 4,20m', category: 'Remorques', weightEmpty: 850, ptac: 2000, maxPayload: 1150, basePrice: 30810, description: 'Double essieu très stable, grand espace intérieur.', dimensions: '4,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Polyvalent' },
  { id: 'rem-creperie-420', name: 'Remorque Crêperie 4,20m', category: 'Remorques', weightEmpty: 850, ptac: 2000, maxPayload: 1150, basePrice: 30810, description: 'Plan de travail encastré pour crêpières et gaufriers.', dimensions: '4,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Crêperie' },
  { id: 'rem-empanadas', name: 'Remorque Empanadas', category: 'Remorques', weightEmpty: 680, ptac: 1300, maxPayload: 620, basePrice: 24880, description: 'Vitrines chauffantes et réchauffage rapide.', dimensions: '3,00m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Snack Chaud' },
  { id: 'rem-cassoulet', name: 'Remorque Food Truck Cassoulet', category: 'Remorques', weightEmpty: 1100, maxPayload: 2500, basePrice: 34200, description: 'Maintien au chaud grande capacité et plats mijotés.', dimensions: '5,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Plats cuisinés' },
  { id: 'rem-bar-fruits', name: 'Remorque Bar à fruits', category: 'Remorques', weightEmpty: 600, ptac: 1300, maxPayload: 700, basePrice: 21190, description: 'Comptoir ouvert, vitrine réfrigérée et presse-agrumes.', dimensions: '3,00m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Jus / Frais' },
  { id: 'rem-caribeenne', name: 'Remorque Cuisine Caribéenne', category: 'Remorques', weightEmpty: 880, ptac: 1800, maxPayload: 920, basePrice: 31860, description: 'Bâche effet kiosque et postes fririture / cuisson.', dimensions: '4,20m x 2,10m', axles: 2, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Exotique' },
  { id: 'rem-patisserie', name: 'Remorque Food Truck Pâtisserie', category: 'Remorques', weightEmpty: 720, ptac: 1400, maxPayload: 680, basePrice: 26990, description: 'Tours réfrigérés positives et vitrine de présentation.', dimensions: '3,50m x 2,00m', axles: 1, imageUrl: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=600', metierTarget: 'Pâtisserie' }
];

export const EQUIPMENTS: Equipment[] = [
  { id: 'kit-eau', name: 'Point d’eau autonome lave-main + réserve 20L', category: 'Hygiène', weight: 20, powerWatts: 100, energy: 'Électrique', price: 650 },
  { id: 'friteuse-gaz-2x10', name: 'Friteuse Gaz 2 x 10 Litres', category: 'Cuisson', weight: 45, powerWatts: 50, energy: 'Gaz', price: 1850 },
  { id: 'friteuse-elec-2x8', name: 'Friteuse Électrique 2 x 8 Litres', category: 'Cuisson', weight: 35, powerWatts: 6000, energy: 'Électrique', price: 1200 },
  { id: 'plancha-gaz-80', name: 'Plancha Gaz Inox 80cm', category: 'Cuisson', weight: 40, powerWatts: 0, energy: 'Gaz', price: 1100 },
  { id: 'creperie-double', name: 'Crêpière double Électrique / Gaz', category: 'Cuisson', weight: 30, powerWatts: 3600, energy: 'Électrique', price: 950 },
  { id: 'tour-frigo-3p', name: 'Tour Réfrigéré Positive 3 Portes Inox', category: 'Froid', weight: 125, powerWatts: 400, energy: 'Électrique', price: 2350 },
  { id: 'vitrine-refrigeree', name: 'Vitrine Réfrigérée à poser 120cm', category: 'Froid', weight: 65, powerWatts: 250, energy: 'Électrique', price: 1450 },
  { id: 'hotte-extraction', name: 'Hotte d’extraction dynamique 1,5m avec variateur', category: 'Extraction', weight: 50, powerWatts: 550, energy: 'Électrique', price: 1790 }
];
