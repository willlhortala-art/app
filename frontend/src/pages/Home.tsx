import { useState } from 'react';

// --- CATALOGUE COMPLET BEAU COMME UN CAMION (PANEL GLOBAL) ---
interface VehicleModel {
  id: string;
  name: string;
  category: 'Camions' | 'Remorques' | 'Conteneurs';
  weight: number;
  maxPayload: number;
  basePrice: number;
  description: string;
  dimensions: string;
}

const VEHICLES: VehicleModel[] = [
  // Camions
  { id: 'burger', name: 'Camion Food Truck Burger', category: 'Camions', weight: 2800, maxPayload: 700, basePrice: 67920, description: 'Aménagement lourd avec poste de cuisson renforcé.', dimensions: '4,20m x 2,10m' },
  { id: 'type-h-glacier', name: 'Camion Food Truck Type H Glacier', category: 'Camions', weight: 2900, maxPayload: 600, basePrice: 82630, description: 'Look rétro Vintage type Citroën H, idéal glaces et évènementiel.', dimensions: '4,00m x 2,10m' },
  { id: 'creperie', name: 'Camion Food Truck Crêperie', category: 'Camions', weight: 2750, maxPayload: 750, basePrice: 69590, description: 'Optimisé pour le flux rapide, double crêpière et vitrines.', dimensions: '4,20m x 2,10m' },
  { id: 'traiteur', name: 'Camion Food Truck Traiteur', category: 'Camions', weight: 2800, maxPayload: 700, basePrice: 69100, description: 'Espace de préparation large, capacité de froid étendue.', dimensions: '4,50m x 2,10m' },
  { id: 'empanadas', name: 'Camion Food Truck Empanadas', category: 'Camions', weight: 2700, maxPayload: 800, basePrice: 66214, description: 'Comptoir de maintien au chaud et vitrine d exposition.', dimensions: '4,00m x 2,10m' },
  { id: 'pates', name: 'Camion Food Truck Pâtes', category: 'Camions', weight: 2750, maxPayload: 750, basePrice: 65800, description: 'Poste cuiseurs à pâtes rapide et rangement compartimenté.', dimensions: '4,20m x 2,10m' },
  { id: 'asiatique', name: 'Camion Food Truck Asiatique', category: 'Camions', weight: 2800, maxPayload: 700, basePrice: 66570, description: 'Installation woks sur puissance gaz spécifique.', dimensions: '4,20m x 2,10m' },
  { id: 'vitrine-3m', name: 'Camion Tournées Vitrine 3,00m', category: 'Camions', weight: 2600, maxPayload: 900, basePrice: 60600, description: 'Châssis compact pour tournées quotidiennes et marchés.', dimensions: '3,00m x 2,10m' },
  { id: 'sandwicherie', name: 'Camion Food Truck Sandwicherie', category: 'Camions', weight: 2700, maxPayload: 800, basePrice: 69590, description: 'Ligne de préparation froide et vitrines réfrigérées.', dimensions: '4,20m x 2,10m' },
  { id: 'kebab', name: 'Camion Food Truck Kebab', category: 'Camions', weight: 2850, maxPayload: 650, basePrice: 66700, description: 'Broches kebab, extraction renforcée et planchas.', dimensions: '4,20m x 2,10m' },
  { id: 'type-h-snack', name: 'Camion Food Truck Type H Snack', category: 'Camions', weight: 2950, maxPayload: 550, basePrice: 84050, description: 'Finition Rétro haut de gamme tout équipement.', dimensions: '4,20m x 2,10m' },

  // Remorques
  { id: 'remorque-rotisserie', name: 'Remorque Rôtisserie Pro', category: 'Remorques', weight: 1400, maxPayload: 1600, basePrice: 32500, description: 'Châssis double essieu pour rôtisseries lourdes à gaz.', dimensions: '4,00m x 2,00m' },
  { id: 'remorque-snack-350', name: 'Remorque Snack & Pizza 3,5m', category: 'Remorques', weight: 1100, maxPayload: 1400, basePrice: 28900, description: 'Format léger et maniable pour petites emplacements.', dimensions: '3,50m x 2,00m' },
  { id: 'remorque-event', name: 'Remorque Évènementielle Panorama', category: 'Remorques', weight: 1250, maxPayload: 1250, basePrice: 34100, description: 'Ouverture bilatérale pour bar mobile ou distribution.', dimensions: '4,50m x 2,10m' },

  // Conteneurs
  { id: 'conteneur-10ft', name: 'Kiosque Conteneur 10 Pieds', category: 'Conteneurs', weight: 1800, maxPayload: 2200, basePrice: 24500, description: 'Module fixe court terme / long terme pour terrasses.', dimensions: '3,00m x 2,44m' },
  { id: 'conteneur-20ft', name: 'Food Store Conteneur 20 Pieds', category: 'Conteneurs', weight: 3100, maxPayload: 3900, basePrice: 38900, description: 'Cuisine complète fixe sur conteneur maritime aménagé VASP.', dimensions: '6,00m x 2,44m' }
];

const EQUIPMENTS = [
  { id: 'friteuse-elec', name: 'Friteuse Électrique 2x8L', weight: 45, powerWatts: 6000, price: 1200 },
  { id: 'friteuse-gaz', name: 'Friteuse Gaz 2x10L', weight: 55, powerWatts: 200, price: 1800 },
  { id: 'frigo-3p', name: 'Tour Réfrigérée 3 Portes', weight: 120, powerWatts: 450, price: 2400 },
  { id: 'plancha-gaz', name: 'Plancha / Grill Gaz Inox', weight: 35, powerWatts: 0, price: 950 },
  { id: 'hotte-ext', name: "Hotte d'Extraction Pro", weight: 40, powerWatts: 600, price: 1500 },
  { id: 'kit-eau', name: 'Point d’eau lave-main hygiène', weight: 25, powerWatts: 150, price: 650 },
];

export default function Home() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(VEHICLES[0].id);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(['kit-eau']);
  const [usesGas, setUsesGas] = useState<boolean>(true);
  const [consentRGPD, setConsentRGPD] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'Tous' | 'Camions' | 'Remorques' | 'Conteneurs'>('Tous');

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

  const filteredCatalog = activeCategory === 'Tous' 
    ? VEHICLES 
    : VEHICLES.filter(v => v.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eef7fc', fontFamily: '"Comfortaa", "Segoe UI", sans-serif', color: '#0f172a' }}>
      
      {/* 📍 NAV BAR */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', sticky: 'top', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#1d4ed8', color: '#fff', padding: '8px 12px', borderRadius: '50%', fontWeight: 'bold', fontSize: '1rem' }}>
            BCUC
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Beau Comme Un Camion
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
          <span>Accueil</span>
          <a href="#catalogue" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>Catalogue Panel</a>
          <a href="#configurateur" style={{ color: '#475569', textDecoration: 'none' }}>Configurateur</a>
        </nav>

        <button style={{ backgroundColor: '#a5f3fc', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 700, color: '#0369a1', cursor: 'pointer' }}>
          Demander un devis
        </button>
      </header>

      {/* 📍 SECTION CONFIGURATEUR */}
      <section id="configurateur" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', color: '#0f172a' }}>
              Beau Comme<br />Un Camion
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '24px' }}>
              Configurateur sur mesure : Validez la faisabilité technique et le tarif de vos concepts mobiles.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#64748b' }}>Sélection directe :</span>
              <select 
                value={selectedVehicleId} 
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '20px', border: '2px solid #0284c7', backgroundColor: '#fff', fontWeight: 700, color: '#0284c7', cursor: 'pointer' }}
              >
                {VEHICLES.map(v => (
                  <option key={v.id} value={v.id}>[{v.category}] {v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* FICHE MÉTROLOGIE DU MODÈLE SELECTIONNÉ */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: 0 }}>
                Spécifications : {selectedVehicle.name}
              </h3>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                {selectedVehicle.category}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Prix de base HT</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{selectedVehicle.basePrice.toLocaleString()} €</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Charge utile max</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{selectedVehicle.maxPayload} kg</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Dimensions cellule</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{selectedVehicle.dimensions}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Conformité</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>Homologation VASP</div>
              </div>
            </div>
          </div>
        </div>

        {/* INDICATEURS TECHNIQUE & PRIX EN DIRECT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>PRIX TOTAL ESTIMÉ HT</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
              {totalPrice.toLocaleString()} €
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>CHARGE UTILE RESTANTE</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: isOverweight ? '#dc2626' : '#16a34a', marginTop: '4px' }}>
              {remainingPayload} kg
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>PUISSANCE ÉLECTRIQUE</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: requiresTriphase ? '#d97706' : '#2563eb', marginTop: '4px' }}>
              {(totalWatts / 1000).toFixed(1)} kW
            </div>
          </div>
        </div>

        {/* ALERTES NORMATIVES */}
        {!hasWaterPoint && (
          <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', color: '#991b1b', fontWeight: 600 }}>
            ⚠️ Non-conformité sanitaire : Point d'eau autonome obligatoire (normes hygiène VASP).
          </div>
        )}

        {isOverweight && (
          <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', color: '#991b1b', fontWeight: 600 }}>
            ⚠️ Alerte PTAC : Surcharge de la charge utile autorisée ({remainingPayload} kg).
          </div>
        )}

        {/* ÉQUIPEMENTS CHR */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '48px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
            Choix des Équipements CHR & Aménagements
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {EQUIPMENTS.map(item => (
              <label key={item.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px', 
                borderRadius: '12px', 
                border: selectedEquipments.includes(item.id) ? '2px solid #0284c7' : '1px solid #e2e8f0',
                backgroundColor: selectedEquipments.includes(item.id) ? '#f0f9ff' : '#fff',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  checked={selectedEquipments.includes(item.id)}
                  onChange={() => toggleEquipment(item.id)}
                  style={{ marginRight: '12px', width: '20px', height: '20px' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{item.weight} kg | {item.powerWatts} W | +{item.price} € HT</div>
                </div>
              </label>
            ))}
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 700, color: '#334155' }}>
            <input 
              type="checkbox" 
              checked={usesGas} 
              onChange={(e) => setUsesGas(e.target.checked)}
              style={{ marginRight: '12px', width: '20px', height: '20px' }}
            />
            Installation & Coffre Gaz étanche homologué VASP (+60 kg | +850 € HT)
          </label>
        </div>

        {/* 📍 NOUVEAU ESPACE : ESPACE PANEL / CATALOGUE COMPLET */}
        <div id="catalogue" style={{ marginTop: '60px', borderTop: '2px dashed #cbd5e1', paddingTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Panel complet des Gammes & Modèles
              </h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>
                Explorez tous nos formats d'aménagements ambulants (Camions, Remorques, Conteneurs).
              </p>
            </div>

            {/* FILTRES PAR CATÉGORIES */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#fff', padding: '6px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              {(['Tous', 'Camions', 'Remorques', 'Conteneurs'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: activeCategory === cat ? '#0284c7' : 'transparent',
                    color: activeCategory === cat ? '#fff' : '#64748b'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRILLE DE CARTE DE MODÈLES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredCatalog.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: selectedVehicleId === item.id ? '2px solid #0284c7' : '1px solid #e2e8f0', 
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                      {item.dimensions}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                    {item.name}
                  </h3>
                  
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', minHeight: '36px' }}>
                    {item.description}
                  </p>

                  <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Charge utile max :</span>
                      <strong style={{ color: '#0f172a' }}>{item.maxPayload} kg</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Prix de départ :</span>
                      <strong style={{ color: '#0284c7' }}>À partir de {item.basePrice.toLocaleString()} € HT</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedVehicleId(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #0284c7',
                    backgroundColor: selectedVehicleId === item.id ? '#e0f2fe' : '#fff',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {selectedVehicleId === item.id ? '✓ Modèle sélectionné' : 'Configurer ce modèle ↑'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER RGPD */}
        <footer style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', marginTop: '40px' }}>
          <input 
            type="checkbox" 
            checked={consentRGPD}
            onChange={(e) => setConsentRGPD(e.target.checked)}
            style={{ marginRight: '12px' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            J'accepte le traitement des données de qualification conformément aux normes RGPD.
          </span>
        </footer>

      </section>

    </div>
  );
}
