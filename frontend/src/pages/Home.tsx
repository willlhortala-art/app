import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Gauge,
  LifeBuoy,
  Loader2,
  Truck,
  AlertTriangle,
  PhoneCall,
  Flame,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Types & Données Métier ---
export interface ActivityProfile {
  id: string;
  name: string;
  defaultAlert: 'vert' | 'orange' | 'rouge';
  pitch: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  type: 'camion' | 'remorque' | 'kiosque';
  description: string;
  basePrice: number;
  emptyWeightKg: number;
  ptacKg: number;
  lengthMeters: number;
  licenseRequired: 'Permis B' | 'Permis BE' | 'N/A';
  defaultPowerSupply: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'cuisson' | 'froid' | 'hygiene' | 'energie' | 'amenagement';
  energyType: 'electric' | 'gas' | 'none';
  powerWatts: number;
  weightKg: number;
  price: number;
  description: string;
}

const ACTIVITIES: ActivityProfile[] = [
  { id: 'burger', name: 'Burger / Snacking Standard', defaultAlert: 'vert', pitch: 'Snacking classique, privilégier le gaz pour la plancha.' },
  { id: 'pizza-bois', name: 'Pizza Four à Bois', defaultAlert: 'vert', pitch: 'Autonomie totale au bois, électricité restreinte au froid et à l\'éclairage.' },
  { id: 'pizza-elec', name: 'Pizza Four Électrique', defaultAlert: 'rouge', pitch: 'Attention : puissance importante, triphasé obligatoire sur site.' },
  { id: 'patisserie', name: 'Pâtisserie / Labo Ambulant', defaultAlert: 'rouge', pitch: 'Véhicule lourd, équipements professionnels nécessitant le bureau d\'études.' },
  { id: 'bar-jus', name: 'Bar à jus / Glaces / Boissons', defaultAlert: 'orange', pitch: 'Attention au cumul des moteurs de froid en continu par forte chaleur.' },
  { id: 'marche', name: 'Marché / Boucher / Fromager', defaultAlert: 'orange', pitch: 'Froid commercial intensif, sécuriser l\'alimentation sur les stands.' },
];

const VEHICLES: VehicleModel[] = [
  {
    id: 'remorque-standard',
    name: 'Remorque Food Truck (3m à 5.20m)',
    type: 'remorque',
    description: 'Format polyvalent pour snacking, pâtes, asiatique, traiteur.',
    basePrice: 27000,
    emptyWeightKg: 1050,
    ptacKg: 1600,
    lengthMeters: 3.6,
    licenseRequired: 'Permis B',
    defaultPowerSupply: 'Mono 230 V standard',
  },
  {
    id: 'remorque-vide',
    name: 'Remorque Food Truck Vide',
    type: 'remorque',
    description: 'Base électrique nue, équipements définis entièrement par le client.',
    basePrice: 21000,
    emptyWeightKg: 800,
    ptacKg: 1500,
    lengthMeters: 3.5,
    licenseRequired: 'Permis B',
    defaultPowerSupply: 'Indéterminé',
  },
  {
    id: 'remorque-pizza-elec',
    name: 'Remorque Pizza Four Électrique',
    type: 'remorque',
    description: 'Équipée d\'une table froide, saladette et four électrique double.',
    basePrice: 32000,
    emptyWeightKg: 1200,
    ptacKg: 1800,
    lengthMeters: 4.0,
    licenseRequired: 'Permis BE',
    defaultPowerSupply: 'Triphasé obligatoire',
  },
  {
    id: 'camion-burger',
    name: 'Camion Food Truck Burger / Traiteur',
    type: 'camion',
    description: 'Porteur robuste, cuisson gaz ou options électriques.',
    basePrice: 48000,
    emptyWeightKg: 2600,
    ptacKg: 3500,
    lengthMeters: 3.7,
    licenseRequired: 'Permis B',
    defaultPowerSupply: 'Mono 230 V standard',
  }
];

const EQUIPMENTS: Equipment[] = [
  {
    id: 'fryer-gas-2x16',
    name: 'Friteuse double 2x16L Gaz Inox',
    category: 'cuisson',
    energyType: 'gas',
    powerWatts: 0,
    weightKg: 65,
    price: 2450,
    description: 'Rendement élevé 30kg/h, fonctionnement au gaz.',
  },
  {
    id: 'fryer-elec-2x12',
    name: 'Friteuse double 2x12L Électrique',
    category: 'cuisson',
    energyType: 'electric',
    powerWatts: 12000,
    weightKg: 45,
    price: 1980,
    description: 'Forte puissance électrique (nécessite 32A ou triphasé).',
  },
  {
    id: 'fridge-table-3p',
    name: 'Table Réfrigérée Inox 3 Portes',
    category: 'froid',
    energyType: 'electric',
    powerWatts: 350,
    weightKg: 125,
    price: 2800,
    description: 'Froid professionnel ventilé 410L.',
  },
  {
    id: 'pack-hygiene-vasp',
    name: 'Pack Lave-mains Autonome Commande Au Genou',
    category: 'hygiene',
    energyType: 'electric',
    powerWatts: 1500,
    weightKg: 25,
    price: 1150,
    description: 'Obligatoire norme VASP/HACCP.',
  },
  {
    id: 'coffret-triphase-32a',
    name: 'Coffret Électrique Triphasé 32A',
    category: 'energie',
    energyType: 'electric',
    powerWatts: 0,
    weightKg: 12,
    price: 1450,
    description: 'Tableau divisionnaire NF C 15-100.',
  }
];

export default function Home() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityProfile>(ACTIVITIES[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel>(VEHICLES[0]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>(["fridge-table-3p", "pack-hygiene-vasp"]);
  const [hasElectricCertainty, setHasElectricCertainty] = useState<boolean>(true);
  
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalPrice = useMemo(() => {
    const optionsSum = selectedEquipmentIds.reduce((sum, id) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.price : 0);
    }, 0);
    return selectedVehicle.basePrice + optionsSum;
  }, [selectedVehicle, selectedEquipmentIds]);

  const totalWeightKg = useMemo(() => {
    const equipmentsWeight = selectedEquipmentIds.reduce((sum, id) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.weightKg : 0);
    }, 0);
    return selectedVehicle.emptyWeightKg + equipmentsWeight + 150; // marge réserves
  }, [selectedVehicle, selectedEquipmentIds]);

  const totalPowerKw = useMemo(() => {
    const watts = selectedEquipmentIds.reduce((sum, id) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.powerWatts : 0);
    }, 0);
    return watts / 1000;
  }, [selectedEquipmentIds]);

  const isOverweight = totalWeightKg > selectedVehicle.ptacKg;

  // --- ÉTAPE 4 : BILAN DE QUALIFICATION DYNAMIQUE (VERDICT) ---
  const dynamicQualification = useMemo(() => {
    const isVehicleEmpty = selectedVehicle.id === 'remorque-vide';
    const isHeavyElectric = totalPowerKw > 7.4 || selectedActivity.defaultAlert === 'rouge' || !hasElectricCertainty;

    if (isVehicleEmpty || isHeavyElectric) {
      return {
        level: 'rouge',
        badgeClass: 'bg-red-500 text-white',
        label: 'ROUGE : Triphasé obligatoire ou véhicule vide / Passage obligatoire par le bureau d\'études avant signature.'
      };
    }
    if (totalPowerKw > 3.5 || selectedActivity.defaultAlert === 'orange') {
      return {
        level: 'orange',
        badgeClass: 'bg-amber-500 text-slate-950',
        label: 'ORANGE : Appareil électrique puissant / Prévoir une prise 32A ou vérifier le cumul.'
      };
    }
    return {
      level: 'vert',
      badgeClass: 'bg-emerald-500 text-white',
      label: 'VERT : Standard gaz / Froid & éclairage 230V simple. Validable de suite.'
    };
  }, [selectedVehicle, selectedActivity, totalPowerKw, hasElectricCertainty]);

  const toggleEquipment = (id: string) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendDevis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      toast.success("Étude enregistrée avec succès !");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <Toaster position="top-center" />

      <header className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium mb-4">
            <Truck className="w-4 h-4" />
            Module de Qualification Commerciale • Guide BCC
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-4xl mx-auto">
            Tunnel de Qualification Client
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">

            {/* ÉTAPE 1 : LE PROJET & L'ACTIVITÉ (LE "POURQUOI") */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Le Projet & l'Activité (Le "Pourquoi")
                </CardTitle>
                <CardDescription>Sélectionnez le métier pour pré-orienter le niveau de risque.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTIVITIES.map((act) => {
                    const isSelected = selectedActivity.id === act.id;
                    return (
                      <div
                        key={act.id}
                        onClick={() => setSelectedActivity(act)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected ? "border-amber-500 bg-amber-500/5" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-slate-900">{act.name}</span>
                            <div className={`w-3 h-3 rounded-full ${act.defaultAlert === 'vert' ? 'bg-emerald-500' : act.defaultAlert === 'orange' ? 'bg-amber-500' : 'bg-red-500'}`} />
                          </div>
                          <p className="text-[11px] text-slate-500">{act.pitch}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ÉTAPE 2 : LE GABARIT & LE VÉHICULE (LE "CONTENANT") */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Gabarit & Véhicule (Le "Contenant")
                </CardTitle>
                <CardDescription>Vérification du poids à vide, PTAC max et du permis requis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {VEHICLES.map((veh) => {
                    const isSelected = selectedVehicle.id === veh.id;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => setSelectedVehicle(veh)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected ? "border-amber-500 bg-amber-500/5" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between mb-2">
                            <Badge variant="secondary" className="text-[10px]">{veh.type.toUpperCase()}</Badge>
                            <span className="text-xs font-semibold text-slate-600">{veh.licenseRequired}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{veh.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{veh.description}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-slate-500">PTAC : {veh.ptacKg} kg</span>
                          <span className="font-bold text-slate-900">{veh.basePrice.toLocaleString()} € HT</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Indicateurs visuels poids & permis */}
                <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${isOverweight ? "bg-red-50 border-red-300 text-red-800" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                  <span className="font-medium flex items-center gap-2">
                    {isOverweight && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    Poids total estimé : {totalWeightKg} kg (PTAC max : {selectedVehicle.ptacKg} kg)
                  </span>
                  <span className="font-bold">{selectedVehicle.licenseRequired}</span>
                </div>
              </CardContent>
            </Card>

            {/* ÉTAPE 3 : BILAN D'ÉNERGIE & DES FLUX (CŒUR TECHNIQUE) */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Bilan d'Énergie & des Flux
                </CardTitle>
                <CardDescription>Séparation Cuisson/Froid/Hygiène et question bloquante sur l'emplacement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Bloc 1 : Équipements & Watts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuisson / Froid / Hygiène (Watts & Énergie)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EQUIPMENTS.map((eq) => {
                      const isChecked = selectedEquipmentIds.includes(eq.id);
                      return (
                        <div
                          key={eq.id}
                          onClick={() => toggleEquipment(eq.id)}
                          className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-all ${
                            isChecked ? "border-amber-500 bg-amber-500/5 font-medium" : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-slate-900">{eq.name}</p>
                            <p className="text-[10px] text-slate-500">
                              {eq.powerWatts > 0 ? <span className="text-blue-600 font-bold">{eq.powerWatts}W</span> : <span className="text-amber-600">Gaz / Autre</span>} • +{eq.weightKg}kg
                            </p>
                          </div>
                          <span className="font-bold">+{eq.price} €</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bloc 2 : Le piège de l'emplacement (Question bloquante) */}
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">Le Piège de l'Emplacement (Question Bloquante)</h4>
                      <p className="text-xs text-red-700 mt-0.5 font-medium">
                        « Avez-vous la certitude d'avoir du Triphasé ou du 32A sur vos emplacements ? »
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      size="sm"
                      variant={hasElectricCertainty ? "default" : "outline"}
                      className={hasElectricCertainty ? "bg-red-600 hover:bg-red-700 text-white text-xs" : "text-xs"}
                      onClick={() => setHasElectricCertainty(true)}
                    >
                      Oui, certitude confirmée
                    </Button>
                    <Button
                      size="sm"
                      variant={!hasElectricCertainty ? "destructive" : "outline"}
                      className={!hasElectricCertainty ? "bg-red-700 text-white text-xs" : "text-xs"}
                      onClick={() => setHasElectricCertainty(false)}
                    >
                      Non / Incertain (Bloque en Rouge)
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* ÉTAPE 4 : BILAN DE QUALIFICATION DYNAMIQUE (LE VERDICT) */}
            <Card className="bg-slate-900 text-white border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Étape 4 : Bilan de Qualification Dynamique (Le Verdict)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-col gap-2">
                  <span className="text-slate-400 font-medium">Verdict du Tunnel :</span>
                  <div className={`p-3 rounded-lg font-bold text-xs ${dynamicQualification.badgeClass}`}>
                    {dynamicQualification.label}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                  <span>Puissance totale : <strong>{totalPowerKw.toFixed(1)} kW</strong></span>
                  <span>Poids total : <strong>{totalWeightKg} kg</strong></span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* COLONNE DE DROITE : RÉCAPITULATIF & VALIDATION */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <Card className="shadow-lg border-amber-500/30 overflow-hidden">
                <div className="bg-slate-900 text-white p-6">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider block mb-1">
                    Récapitulatif Financier
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black">{totalPrice.toLocaleString("fr-FR")} €</span>
                    <span className="text-xs text-slate-400">HT</span>
                  </div>
                </div>

                <CardContent className="p-6 bg-white space-y-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 text-base shadow-md cursor-pointer">
                        Valider l'étude & Transmettre
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Transmission Dossier</DialogTitle>
                        <DialogDescription>
                          Vérification du statut validé : <span className="font-bold text-slate-900">{dynamicQualification.label}</span>
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSendDevis} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                          <Label>Nom du client *</Label>
                          <Input required placeholder="Jean Dupont" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input required type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                          <Input required type="tel" placeholder="Téléphone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Notes d'entretien</Label>
                          <Textarea rows={3} placeholder="Remarques emplacement..." value={projectNotes} onChange={(e) => setProjectNotes(e.target.value)} />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3">
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Envoyer"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
