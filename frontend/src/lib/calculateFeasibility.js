import { TRUCK_MODELS, KITCHEN_EQUIPMENT, REGULATORY_LIMITS } from '../config/truckData';

export function calculateProjectFeasibility(selectedEquipmentIds, truckModelId, usesGas) {
  const model = TRUCK_MODELS.find(m => m.id === truckModelId) || TRUCK_MODELS[0];
  const equipmentList = KITCHEN_EQUIPMENT.filter(item => selectedEquipmentIds.includes(item.id));
  
  // Cumul des poids et des puissances électriques
  let totalEquipmentWeight = equipmentList.reduce((sum, item) => sum + item.weight, 0);
  let totalWatts = equipmentList.reduce((sum, item) => sum + item.powerWatts, 0);

  if (usesGas) {
    totalEquipmentWeight += REGULATORY_LIMITS.gasPackFixedWeight;
  }

  const totalWeight = model.weightAtEmpty + totalEquipmentWeight;
  const remainingPayload = model.maxPayload - totalEquipmentWeight;

  const isOverweight = remainingPayload < REGULATORY_LIMITS.safetyPayloadMargin;
  const requiresTriphase = totalWatts > REGULATORY_LIMITS.monoPhaseMaxWatts;

  let status = "VALIDE";
  let alertMessage = "";

  if (isOverweight) {
    status = "CRITIQUE_POIDS";
    alertMessage = `⚠️ Alerte Surcharge : Charge utile restante de ${remainingPayload} kg (marge requise : ${REGULATORY_LIMITS.safetyPayloadMargin} kg). Risque de dépassement du PTAC de 3,5t. Basculer sur une option Gaz ou Remorque.`;
  } else if (requiresTriphase) {
    status = "ATTENTION_ELEC";
    alertMessage = `⚡ Alerte Puissance : Puissance totale de ${(totalWatts / 1000).toFixed(1)} kW (> 7 kW). Alimentation Triphasée (400V) requise.`;
  }

  return {
    totalWeight,
    remainingPayload,
    totalWatts,
    status,
    alertMessage
  };
}
