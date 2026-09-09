import { useState } from 'react';

// --- DONNÉES CATALOGUE SOURCÉES DE BEAU COMME UN CAMION ---
const VEHICLES = [
  { id: 'burger', name: 'Camion Food Truck Burger', category: 'Camions', weight: 2800, maxPayload: 700, basePrice: 67920 },
  { id: 'type-h-glacier', name: 'Camion Food Truck Type H Glacier', category: 'Camions', weight: 2900, maxPayload: 600, basePrice: 82630 },
  { id: 'creperie', name: 'Camion Food Truck Crêperie', category: 'Camions', weight: 2750, maxPayload: 750, basePrice: 69590 },
  { id: 'traiteur', name: 'Camion Food Truck Traiteur', category: 'Camions', weight: 2800, maxPayload: 700, basePrice: 69100 },
  { id: 'empanadas', name: 'Camion Food Truck Empanadas', category: 'Camions', weight: 2700, maxPayload: 800, basePrice: 66214 },
  { id: 'pates', name: 'Camion Food Truck Pâtes', category: 'Camions', weight: 2750, maxPayload: 750, basePrice: 65800 },
  { id: 'asiatique', name: 'Camion Food Truck Asiatique', category: 'Camions', weight: 2800, maxPayload: 700, basePrice: 66570 },
  { id: 'vitrine-3m', name: 'Camion Tournées Vitrine 3,00m', category: 'Camions', weight: 2600, maxPayload: 900, basePrice: 60600 },
  { id: 'sandwicherie', name: 'Camion Food Truck Sandwicherie', category: 'Camions', weight: 2700, maxPayload: 800, basePrice: 69590 },
  { id: 'kebab', name: 'Camion Food Truck Kebab', category: 'Camions', weight: 2850, maxPayload: 650, basePrice: 66700 },
  { id: 'type-h-snack', name: 'Camion Food Truck Type H Snack', category: 'Camions', weight: 2950, maxPayload: 550, basePrice: 84050 },
];

const EQUIPMENTS = [
  { id: 'friteuse-elec', name: 'Friteuse Électrique 2x8L', weight: 45, powerWatts: 6000, price: 1200 },
  { id: 'friteuse-gaz', name: 'Friteuse Gaz 2x10L', weight: 55, powerWatts: 200, price: 1800 },
  { id: 'frigo-3p', name: 'Tour Réfrigérée 3 Portes', weight: 120, powerWatts: 450, price: 2400 },
  { id: 'plancha-gaz', name: 'Plancha / Grill Gaz Inox', weight: 35, powerWatts: 0, price: 950 },
  { id: 'hotte-ext', name: "Hotte d'Extraction Pro", weight: 40, powerWatts: 600, price: 1500 },
  { id: 'kit-eau', name: 'Point d’eau lave-main hygiène (Réservoirs + Pompe)', weight: 25, powerWatts: 150, price: 650 },
];

export default function Home() {
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES[0].id);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(['kit-eau']);
  const [usesGas, setUsesGas] = useState(true);
  const [consentRGPD, setConsentRGPD] = useState(false);

  const selectedVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];

  const toggleEquipment = (id: string) => {
    setSelectedEquipments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const currentEquipments = EQUIPMENTS.filter(e => selectedEquipments.includes(e.id));
  
  let equipmentWeight = currentEquipments.reduce((sum, item) => sum + item.weight, 0);
  let totalWatts = currentEquipments.reduce((sum, item) => sum + item.powerWatts, 0);
  let equipmentPrice = currentEquipments.reduce((sum, item) => sum + item.price, 0);

  if (usesGas) {
    equipmentWeight += 60;
  }

  const remainingPayload = selectedVehicle.maxPayload - equipmentWeight;
  const totalPrice = selectedVehicle.basePrice + equipmentPrice + (usesGas ? 850 : 0);
  const isOverweight = remainingPayload < 100;
  const requiresTriphase = totalWatts > 7000;
  const hasWaterPoint = selectedEquipments.includes('kit-eau');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f4f5f7' }}>
      
      {/* SIDEBAR GAUCHE */}
      <aside style={{ width: '300px', backgroundColor: '#1e293b', color: '#fff', padding: '24px 16px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', color: '#38bdf8' }}>
          🚚 Beau Comme Un Camion
        </h2>
        
        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
          GAMME DE CAMIONS (PRIX FR)
        </label>
        
        <select 
          value={selectedVehicleId} 
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '24px' }}
        >
          {VEHICLES.map(v => (
            <option key={v.id} value={v.id}>{v.name} ({v.basePrice.toLocaleString()} € HT)</option>
          ))}
        </select>

        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>Cellule standard :</strong> ~4,20 m x 2,10 m</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>Capacité max :</strong> 2 personnes</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>Prix base :</strong> {selectedVehicle.basePrice.toLocaleString()} € HT</p>
          <p style={{ margin: 0 }}><strong>Homologation :</strong> VASP requis</p>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <main style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
        <div>
          
          {/* CALCULS EN DIRECT */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PRIX TOTAL ESTIMÉ HT</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                {totalPrice.toLocaleString()} €
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>CHARGE UTILE RESTANTE</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: isOverweight ? '#dc2626' : '#16a34a', marginTop: '4px' }}>
                {remainingPayload} kg
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PUISSANCE ÉLECTRIQUE</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: requiresTriphase ? '#d97706' : '#2563eb', marginTop: '4px' }}>
                {(totalWatts / 1000).toFixed(1)} kW
              </div>
            </div>

          </section>

          {/* ALERTES ET RÈGLES SANITAIRES / CONFORMITÉ VASP */}
          {!hasWaterPoint && (
            <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#991b1b' }}>
              <strong>⚠️ Non-conformité sanitaire :</strong> Un point d'eau autonome avec lave-main est obligatoire pour respecter les normes d'hygiène et l'homologation VASP.
            </div>
          )}

          {isOverweight && (
            <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#991b1b' }}>
              <strong>⚠️ Alerte PTAC :</strong> Surcharge de charge utile ({remainingPayload} kg).
            </div>
          )}

          {requiresTriphase && !isOverweight && (
            <div style={{ backgroundColor: '#fffbe6', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#92400e' }}>
              <strong>⚡ Puissance :</strong> Supérieure à 7 kW. Groupe électrogène puissant ou prise Triphasée (400V) requis.
            </div>
          )}

          {/* MATÉRIEL */}
          <section style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1e293b' }}>
              Équipements & Normes d'Aménagement
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {EQUIPMENTS.map(item => (
                <label key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: selectedEquipments.includes(item.id) ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: selectedEquipments.includes(item.id) ? '#eff6ff' : '#fff',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={selectedEquipments.includes(item.id)}
                    onChange={() => toggleEquipment(item.id)}
                    style={{ marginRight: '12px', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.weight} kg | {item.powerWatts} W | +{item.price} € HT</div>
                  </div>
                </label>
              ))}
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              <input 
                type="checkbox" 
                checked={usesGas} 
                onChange={(e) => setUsesGas(e.target.checked)}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              Installation & Coffre Gaz étanche homologué VASP (+60 kg | +850 € HT)
            </label>
          </section>

        </div>

        {/* RGPD */}
        <footer style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={consentRGPD}
              onChange={(e) => setConsentRGPD(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            J'accepte le traitement des données de qualification conformément aux normes RGPD.
          </label>
        </footer>

      </main>

    </div>
  );
}
