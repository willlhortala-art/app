import { useState } from 'react';
import { VEHICLES, EQUIPMENTS, type VehicleModel } from './data';

export default function Home() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(VEHICLES[0].id);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(['kit-eau']);
  const [usesGas, setUsesGas] = useState<boolean>(true);
  
  // CALCULATEUR DE PERMIS
  const [towVehiclePtra, setTowVehiclePtra] = useState<number>(3000); // PTAC du véhicule tracteur
  const [consentRGPD, setConsentRGPD] = useState<boolean>(false);

  const selectedVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];
  const currentEquipments = EQUIPMENTS.filter(e => selectedEquipments.includes(e.id));

  // CALCULS DYNAMIQUES
  let totalEquipWeight = currentEquipments.reduce((sum, item) => sum + item.weight, 0) + (usesGas ? 60 : 0);
  let totalWatts = currentEquipments.reduce((sum, item) => sum + item.powerWatts, 0);
  let equipmentPrice = currentEquipments.reduce((sum, item) => sum + item.price, 0);

  const remainingPayload = selectedVehicle.maxPayload - totalEquipWeight;
  const totalPrice = selectedVehicle.basePrice + equipmentPrice + (usesGas ? 850 : 0);
  
  // LOGIQUE DE PERMIS (Masse totale cumulée)
  const totalCumulatedWeight = towVehiclePtra + selectedVehicle.ptac;
  let requiredLicense = 'Permis B';
  if (totalCumulatedWeight > 3500 && totalCumulatedWeight <= 4250) {
    requiredLicense = 'Formation B96 (7h)';
  } else if (totalCumulatedWeight > 4250) {
    requiredLicense = 'Permis BE obligatoire';
  }

  const toggleEquipment = (id: string) => {
    setSelectedEquipments(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', color: '#0f172a' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0284c7' }}>BEAU COMME UN CAMION</div>
        <nav style={{ display: 'flex', gap: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
          <a href="#configurateur" style={{ textDecoration: 'none', color: '#0f172a' }}>Configurateur</a>
          <a href="#permis" style={{ textDecoration: 'none', color: '#0f172a' }}>Simulateur Permis</a>
          <a href="#catalogue" style={{ textDecoration: 'none', color: '#0f172a' }}>Catalogue ({VEHICLES.length})</a>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* CONFIGURATEUR PRINCIPAL */}
        <section id="configurateur" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px' }}>Configurateur Remorque Sur Mesure</h1>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Sélectionnez votre base et vos équipements pour calculer la charge, le tarif et le permis requis.</p>
            
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '8px' }}>Modèle de remorque :</label>
            <select 
              value={selectedVehicleId} 
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #0284c7', fontWeight: 700, marginBottom: '20px' }}
            >
              {VEHICLES.map(v => (
                <option key={v.id} value={v.id}>{v.name} — {v.basePrice.toLocaleString()} € HT ({v.dimensions})</option>
              ))}
            </select>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Équipements CHR à intégrer :</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {EQUIPMENTS.map(eq => (
                <label key={eq.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: selectedEquipments.includes(eq.id) ? '2px solid #0284c7' : '1px solid #cbd5e1', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" checked={selectedEquipments.includes(eq.id)} onChange={() => toggleEquipment(eq.id)} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{eq.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{eq.weight} kg | {eq.powerWatts} W ({eq.energy})</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>+{eq.price} €</span>
                </label>
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', fontWeight: 700, cursor: 'pointer' }}>
              <input type="checkbox" checked={usesGas} onChange={(e) => setUsesGas(e.target.checked)} />
              Coffre Gaz étanche VASP & installation certifiée (+60kg | +850€ HT)
            </label>
          </div>

          {/* RECAPITULATIF TECHNIQUE */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <img src={selectedVehicle.imageUrl} alt={selectedVehicle.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
            
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 12px 0' }}>{selectedVehicle.name}</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>{selectedVehicle.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PRIX TOTAL ESTIMÉ</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284c7' }}>{totalPrice.toLocaleString()} € HT</div>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>CHARGE RESTANTE</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: remainingPayload < 0 ? '#ef4444' : '#16a34a' }}>
                  {remainingPayload} kg
                </div>
              </div>
            </div>

            {remainingPayload < 0 && (
              <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '12px', fontSize: '0.8rem', color: '#991b1b', marginBottom: '16px' }}>
                ⚠️ <strong>Surcharge détectée :</strong> Vous dépassez le PTAC autorisé de {Math.abs(remainingPayload)} kg. Retirez des équipements ou choisissez un modèle double essieu supérieur.
              </div>
            )}

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Type de châssis :</span>
                <strong>{selectedVehicle.axles === 1 ? 'Simple essieu' : 'Double essieu'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Homologation :</span>
                <strong style={{ color: '#16a34a' }}>VASP / RESP MAGASIN</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Puissance requise :</span>
                <strong>{(totalWatts / 1000).toFixed(1)} kW</strong>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULATEUR DE PERMIS DE CONDUIRE */}
        <section id="permis" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Simulateur de Permis de Conduire requis</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Renseignez le PTAC (champ F.2) de la carte grise de votre véhicule tracteur pour vérifier le permis nécessaire avec la remorque sélectionnée ({selectedVehicle.ptac} kg PTAC).
          </p>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PTAC Véhicule Tracteur (kg) :</label>
              <input 
                type="number" 
                value={towVehiclePtra} 
                onChange={(e) => setTowVehiclePtra(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div style={{ flex: 1, backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700 }}>PERMIS NÉCESSAIRE</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0284c7' }}>{requiredLicense}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Poids cumulé total : {totalCumulatedWeight} kg</span>
            </div>
          </div>
        </section>

        {/* CATALOGUE COMPLET (LISTING INTEGRAL) */}
        <section id="catalogue">
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '20px' }}>Catalogue Intégral Remorques ({VEHICLES.length} modèles)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {VEHICLES.map(item => (
              <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {item.metierTarget}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '8px 0 4px 0' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '12px' }}>{item.description}</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>{item.basePrice.toLocaleString()} € HT</div>
                  <button 
                    onClick={() => { setSelectedVehicleId(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #0284c7', backgroundColor: '#fff', color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Configurer ce modèle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEMANDE DE DEVIS FINAL */}
        <section style={{ marginTop: '40px', backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Valider la demande de devis</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', marginBottom: '20px' }}>
            <input type="checkbox" checked={consentRGPD} onChange={(e) => setConsentRGPD(e.target.checked)} />
            J'accepte que l'équipe Beau Comme Un Camion me recontacte avec ma configuration.
          </label>
          <button 
            disabled={!consentRGPD}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: consentRGPD ? '#0284c7' : '#94a3b8', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: consentRGPD ? 'pointer' : 'not-allowed' }}
          >
            Envoyer ma configuration ({totalPrice.toLocaleString()} € HT)
          </button>
        </section>

      </main>
    </div>
  );
}
