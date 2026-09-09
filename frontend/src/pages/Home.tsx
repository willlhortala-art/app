import React, { useState } from 'react';

// --- DONNÉES CATALOGUE ---
const VEHICLES = [
  { id: 'master-b', name: 'Plancher Cabine (Permis B)', category: 'Camions', weight: 2700, maxPayload: 800, basePrice: 42000 },
  { id: 'camion-pizza', name: 'Camion Pizza Pro', category: 'Camions', weight: 2900, maxPayload: 600, basePrice: 48000 },
  { id: 'remorque-ft', name: 'Remorque Food Truck 3m50', category: 'Remorques', weight: 1200, maxPayload: 1500, basePrice: 22000 },
  { id: 'remorque-l', name: 'Remorque Lourde Double Essieu', category: 'Remorques', weight: 1600, maxPayload: 1900, basePrice: 26000 },
  { id: 'container-20', name: 'Container Food 20 pieds', category: 'Containers', weight: 2200, maxPayload: 2800, basePrice: 31000 },
];

const EQUIPMENTS = [
  { id: 'friteuse-elec', name: 'Friteuse Électrique 2x8L', weight: 45, powerWatts: 6000, price: 1200 },
  { id: 'friteuse-gaz', name: 'Friteuse Gaz 2x10L', weight: 55, powerWatts: 200, price: 1800 },
  { id: 'frigo-3p', name: 'Tour Réfrigérée 3 Portes', weight: 120, powerWatts: 450, price: 2400 },
  { id: 'plancha-gaz', name: 'Plancha Gaz Inox', weight: 35, powerWatts: 0, price: 950 },
  { id: "hotte-ext", name: "Hotte d'Extraction Pro", weight: 40, powerWatts: 600, price: 1500 },
];

export default function Home() {
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES[0].id);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [usesGas, setUsesGas] = useState(false);
  const [consentRGPD, setConsentRGPD] = useState(false);

  const selectedVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];

  const toggleEquipment = (id: string) => {
    setSelectedEquipments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- CALCULS EN TEMPS RÉEL ---
  const currentEquipments = EQUIPMENTS.filter(e => selectedEquipments.includes(e.id));
  
  let equipmentWeight = currentEquipments.reduce((sum, item) => sum + item.weight, 0);
  let totalWatts = currentEquipments.reduce((sum, item) => sum + item.powerWatts, 0);
  let equipmentPrice = currentEquipments.reduce((sum, item) => sum + item.price, 0);

  if (usesGas) {
    equipmentWeight += 60; // Caisson + 2 bouteilles
  }

  const remainingPayload = selectedVehicle.maxPayload - equipmentWeight;
  const totalPrice = selectedVehicle.basePrice + equipmentPrice;
  const isOverweight = remainingPayload < 100; // Marge 100kg
  const requiresTriphase = totalWatts > 7000;  // Seuil 7kW

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f4f5f7' }}>
      
      {/* 📍 BANDE DÉROULANTE / SIDEBAR GAUCHE : SÉLECTION VÉHICULE */}
      <aside style={{ width: '280px', backgroundColor: '#1e293b', color: '#fff', padding: '24px 16px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', color: '#38bdf8' }}>
          🚚 Beau Comme Un Camion
        </h2>
        
        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
          SÉLECTIONNER UN VÉHICULE
        </label>
        
        <select 
          value={selectedVehicleId} 
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '24px' }}
        >
          <optgroup label="Camions">
            {VEHICLES.filter(v => v.category === 'Camions').map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </optgroup>
          <optgroup label="Remorques">
            {VEHICLES.filter(v => v.category === 'Remorques').map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </optgroup>
          <optgroup label="Containers">
            {VEHICLES.filter(v => v.category === 'Containers').map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </optgroup>
        </select>

        {/* Dynamic Details Sidebar */}
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>Prix de base :</strong> {selectedVehicle.basePrice.toLocaleString()} € HT</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>Charge Utile Max :</strong> {selectedVehicle.maxPayload} kg</p>
          <p style={{ margin: 0 }}><strong>Catégorie :</strong> {selectedVehicle.category}</p>
        </div>
      </aside>

      {/* 📍 ZONE PRINCIPALE DROITE */}
      <main style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifySpace: 'between', overflowY: 'auto' }}>
        <div>
          
          {/* 📍 HAUT DE PAGE : DASHBOARD INDICATEURS DE CALCUL EN DIRECT */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PRIX TOTAL HT</span>
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

          {/* ALERTES ERGONOMIQUES */}
          {isOverweight && (
            <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#991b1b' }}>
              <strong>⚠️ Alerte Surcharge PTAC :</strong> La charge utile restante est insuffisante ({remainingPayload} kg). Basculez vers des équipements gaz ou un châssis remorque.
            </div>
          )}

          {requiresTriphase && !isOverweight && (
            <div style={{ backgroundColor: '#fffbe6', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#92400e' }}>
              <strong>⚡ Alerte Électricité :</strong> Puissance supérieure à 7 kW. Alimentation Triphasée (400V) requise pour le client.
            </div>
          )}

          {/* 📍 MILIEU DE PAGE : CHOIX DU MATÉRIEL CHR */}
          <section style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1e293b' }}>
              Équipements & Aménagements Cuisine
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
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.weight} kg | {item.powerWatts} W | +{item.price} €</div>
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
              Pack Coffre Gaz Étanche (+60 kg | +850 € HT)
            </label>
          </section>

        </div>

        {/* 📍 BAS DE PAGE : RGPD ET CONFORMITÉ */}
        <footer style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={consentRGPD}
              onChange={(e) => setConsentRGPD(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            J'accepte le traitement des données de qualification conformément à la politique de confidentialité de l'entreprise.
          </label>
        </footer>

      </main>

    </div>
  );
}
