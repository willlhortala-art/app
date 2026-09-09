// Données et limites réglementaires pour le calcul de faisabilité
export const REGULATORY_LIMITS = {
  maxPermitBWeight: 3500,     // PTAC max Permis B (kg)
  monoPhaseMaxWatts: 7000,    // Seuil max réel Monophasé 32A (230V * 32A = 7360W)
  gasPackFixedWeight: 60,     // Caisson + 2 bouteilles Propane (kg)
  safetyPayloadMargin: 100    // Marge de sécurité minimale pour le stock (kg)
};

export const TRUCK_MODELS = [
  { id: "master-b", name: "Plancher Cabine (Permis B)", weightAtEmpty: 2700, maxPayload: 800 },
  { id: "remorque-l", name: "Remorque Lourde (Double Essieu)", weightAtEmpty: 1600, maxPayload: 1900 }
];

export const KITCHEN_EQUIPMENT = [
  { id: "friteuse-elec", name: "Friteuse Électrique 2x8L", weight: 45, powerWatts: 6000, energy: "electricity" },
  { id: "friteuse-gaz", name: "Friteuse Gaz 2x10L", weight: 55, powerWatts: 200, energy: "gas" },
  { id: "frigo-3p", name: "Tour Réfrigérée 3 portes", weight: 120, powerWatts: 450, energy: "electricity" },
  { id: "plancha-gaz", name: "Plancha Gaz", weight: 35, powerWatts: 0, energy: "gas" },
  { id: "hotte-ext", name: "Hotte Pro d'Extraction", weight: 40, powerWatts: 600, energy: "electricity" }
];
