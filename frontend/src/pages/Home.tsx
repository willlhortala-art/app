import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Gauge,
  LifeBuoy,
  Loader2,
  Truck,
  AlertTriangle,
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

// --- Catalogue Intégré & Matrice de Qualification ---
export interface VehicleModel {
  id: string;
  name: string;
  type: 'camion' | 'remorque' | 'kiosque';
  category: 'Standard' | 'Vintage' | 'Sur-mesure';
  description: string;
  basePrice: number;
  emptyWeightKg: number;
  ptacKg: number;
  lengthMeters: number;
  widthMeters: number;
  licenseRequired: 'Permis B' | 'Permis BE' | 'N/A';
  defaultPowerSupply: 'Mono 230 V standard' | 'Mono 230 V ou prise 32 A' | 'Triphasé obligatoire' | '32 A ou triphasé' | 'Indéterminé';
  alertLevel: 'vert' | 'orange' | 'rouge';
  alertMessage: string;
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

const VEHICLES: VehicleModel[] = [
  {
    id: 'remorque-standard',
    name: 'Remorque Food Truck (3m à 5.20m)',
    type: 'remorque',
    category: 'Standard',
    description: 'Format polyvalent pour snacking, pâtes, asiatique, empanadas, cassoulet ou traiteur.',
    basePrice: 27000,
    emptyWeightKg: 1050,
    ptacKg: 1600,
    lengthMeters: 3.6,
    widthMeters: 2.1,
    licenseRequired: 'Permis B',
    defaultPowerSupply: 'Mono 230 V standard',
    alertLevel: 'vert',
    alertMessage: 'Vert si cuisson gaz. Orange si plancha, friteuse ou four électriques ajoutés[cite: 1].',
  },
  {
    id: 'remorque-vide',
    name: 'Remorque Food Truck Vide',
    type: 'remorque',
    category: 'Sur-mesure',
    description: 'Base électrique nue, équipements définis entièrement par le client.',
    basePrice: 21000,
    emptyWeightKg: 800,
    ptacKg: 1500,
    lengthMeters: 3.5,
    widthMeters: 2.0,
    licenseRequired: 'Permis B',
    defaultPowerSupply: 'Indéterminé',
    alertLevel: 'rouge',
    alertMessage: 'Rouge : aucun engagement sans liste précise des appareils[cite: 1].',
  },
  {
    id: 'remorque-pizza-elec',
    name: 'Remorque Pizza Four Électrique',
    type: 'remorque',
    category: 'Standard',
    description: 'Équipée d\'une table froide, saladette et four électrique double chambre.',
    basePrice: 32000,
    emptyWeightKg: 1200,
    ptacKg: 1800,
    lengthMeters: 4.0,
    widthMeters: 2.1,
    licenseRequired: 'Permis BE',
    defaultPowerSupply: 'Triphasé obligatoire',
    alertLevel: 'rouge',
    alertMessage: 'Rouge : ne pas signer sans confirmation de l\'emplacement en triphasé[cite: 1].',
  },
  {
    id: 'remorque-labo',
    name: 'Remorque Labo 5.20m / Pâtisserie',
    type: 'remorque',
    category: 'Standard',
    description: 'Table et armoire froides, hotte, vitrine, four UNOX Bakerlux.',
    basePrice: 35000,
    emptyWeightKg: 1500,
    ptacKg: 2500,
    lengthMeters: 5.2,
    widthMeters: 2.2,
    licenseRequired: 'Permis BE',
    defaultPowerSupply: '32 A ou triphasé',
    alertLevel: 'rouge',
    alertMessage: 'Rouge : bureau d\'études obligatoire avant devis signé[cite: 1].',
  },
  {
    id: 'camion-burger',
    name: 'Camion Food Truck Burger / Traiteur',
    type: 'camion',
    category: 'Standard',
    description: 'Froid, hotte, vitrines, plans inox; cuisson gaz ou options électriques.',
    basePrice: 48000,
    emptyWeightKg: 2600,
    ptacKg: 3500,
    lengthMeters: 3.7,
    widthMeters: 2.2,
    licenseRequired: 'Permis B',
    defaultPowerSupply: 'Mono 230 V standard',
    alertLevel: 'vert',
    alertMessage: 'Vert en configuration gaz ; attention si équipements électriques puissants[cite: 1].',
  },
  {
    id: 'camion-pressing',
    name: 'Camion Pressing / Pro Spécifique',
    type: 'camion',
    category: 'Sur-mesure',
    description: 'Eau, repassage, emballeuse; machines industrielles selon projet.',
    basePrice: 52000,
    emptyWeightKg: 2800,
    ptacKg: 3500,
    lengthMeters: 4.0,
    widthMeters: 2.2,
    licenseRequired: 'Permis B',
    defaultPowerSupply: '32 A ou triphasé',
    alertLevel: 'rouge',
    alertMessage: 'Rouge : puissance des machines à connaître avant chiffrage[cite: 1].',
  },
  {
    id: 'kiosque-restaurant',
    name: 'Kiosque / Container Restaurant 20 pieds',
    type: 'kiosque',
    category: 'Standard',
    description: 'Froid, hotte, plans inox, cuisine sur mesure gaz ou électrique.',
    basePrice: 39000,
    emptyWeightKg: 2200,
    ptacKg: 3500,
    lengthMeters: 6.0,
    widthMeters: 2.4,
    licenseRequired: 'N/A',
    defaultPowerSupply: 'Mono 230 V standard',
    alertLevel: 'orange',
    alertMessage: 'Orange : fixer la carte et les appareils avant engagement[cite: 1].',
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
    description: 'Rendement élevé 30kg/h, robinets de vidange frontal.',
  },
  {
    id: 'fryer-elec-2x12',
    name: 'Friteuse double 2x12L Électrique (Triphasé/32A)',
    category: 'cuisson',
    energyType: 'electric',
    powerWatts: 12000,
    weightKg: 45,
    price: 1980,
    description: 'Chauffe ultra-rapide. Fait basculer l\'alerte en Orange/Rouge.',
  },
  {
    id: 'plancha-chrome-gas',
    name: 'Plaque à snacker Chrome Gaz 80cm',
    category: 'cuisson',
    energyType: 'gas',
    powerWatts: 0,
    weightKg: 55,
    price: 1890,
    description: 'Plaque miroir 12mm sans transfert de goût.',
  },
  {
    id: 'four-pizza-elec',
    name: 'Four à Pizza Professionnel Électrique Double',
    category: 'cuisson',
    energyType: 'electric',
    powerWatts: 9500,
    weightKg: 130,
    price: 3800,
    description: 'Nécessite une alimentation en triphasé ou 32A.',
  },
  {
    id: 'fridge-table-3p',
    name: 'Table Réfrigérée Inox 3 Portes (+2°C/+8°C)',
    category: 'froid',
    energyType: 'electric',
    powerWatts: 350,
    weightKg: 125,
    price: 2800,
    description: 'Capacité 410L avec plan de travail inox brossé.',
  },
  {
    id: 'pack-hygiene-vasp',
    name: 'Pack Lave-mains Autonome Commande Au Genou',
    category: 'hygiene',
    energyType: 'electric',
    powerWatts: 1500,
    weightKg: 25,
    price: 1150,
    description: 'Obligatoire VASP/HACCP.',
  },
  {
    id: 'covering-total',
    name: 'Total Covering Graphique & Personnalisation Maquette 3D',
    category: 'amenagement',
    energyType: 'none',
    powerWatts: 0,
    weightKg: 10,
    price: 2900,
    description: 'Impression HD vinyle coulé anti-UV.',
  }
];

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel>(VEHICLES[0]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([
    "fridge-table-3p",
    "pack-hygiene-vasp",
  ]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalPrice = useMemo(() => {
    const optionsSum = selectedEquipmentIds.reduce((sum: number, eqId: string) => {
      const eq = EQUIPMENTS.find((e) => e.id === eqId);
      return sum + (eq ? eq.price : 0);
    }, 0);
    return selectedVehicle.basePrice + optionsSum;
  }, [selectedVehicle, selectedEquipmentIds]);

  const totalWeightKg = useMemo(() => {
    const equipmentsWeight = selectedEquipmentIds.reduce((sum: number, id: string) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.weightKg : 0);
    }, 0);
    const reservesWeight = 150;
    return selectedVehicle.emptyWeightKg + equipmentsWeight + reservesWeight;
  }, [selectedVehicle, selectedEquipmentIds]);

  const totalPowerKw = useMemo(() => {
    const watts = selectedEquipmentIds.reduce((sum: number, id: string) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.powerWatts : 0);
    }, 0);
    return watts / 1000;
  }, [selectedEquipmentIds]);

  const dynamicQualification = useMemo(() => {
    const hasElectricCooking = selectedEquipmentIds.some(id => {
      const eq = EQUIPMENTS.find(e => e.id === id);
      return eq?.category === 'cuisson' && eq?.energyType === 'electric';
    });

    const isVehicleEmpty = selectedVehicle.id === 'remorque-vide';
    const isHeavyElectric = totalPowerKw > 7.4 || selectedVehicle.defaultPowerSupply.includes('Triphasé');

    if (isVehicleEmpty) {
      return { level: 'rouge', badgeClass: 'bg-red-500 text-white', label: 'ROUGE : Aucun engagement sans liste précise[cite: 1]' };
    }
    if (isHeavyElectric || selectedVehicle.alertLevel === 'rouge') {
      return { level: 'rouge', badgeClass: 'bg-red-500 text-white', label: 'ROUGE : Bureau d\'études / Triphasé obligatoire[cite: 1]' };
    }
    if (hasElectricCooking || totalPowerKw > 3.5 || selectedVehicle.alertLevel === 'orange') {
      return { level: 'orange', badgeClass: 'bg-amber-500 text-slate-950', label: 'ORANGE : Appareil électrique / Prévoir 32A[cite: 1]' };
    }
    return { level: 'vert', badgeClass: 'bg-emerald-500 text-white', label: 'VERT : Standard gaz / Froid & éclairage 230V[cite: 1]' };
  }, [selectedVehicle, selectedEquipmentIds, totalPowerKw]);

  const isOverweight = totalWeightKg > selectedVehicle.ptacKg;

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
      toast.success("Demande d'étude enregistrée !", {
        description: `Merci ${clientName || "cher client"}. Qualification commerciale validée (${dynamicQualification.label}).`,
      });
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setProjectNotes("");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <Toaster position="top-center" />

      <header className="bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium mb-6">
            <Truck className="w-4 h-4" />
            Matrice de Qualification Commerciale • Beau Comme Un Camion
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Concevez et qualifiez votre unité mobile
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Vérification automatique des règles de préqualification, du PTAC et des bilans de puissance[cite: 1].
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Modèle de véhicule & Grille de qualification
                </CardTitle>
                <CardDescription>
                  Sélectionnez le gabarit de référence issu de la matrice officielle[cite: 1].
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VEHICLES.map((vehicle: VehicleModel) => {
                  const isSelected = selectedVehicle.id === vehicle.id;
                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/5 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={isSelected ? "default" : "secondary"} className="text-[10px]">
                            {vehicle.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs font-semibold text-slate-500">{vehicle.lengthMeters}m</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{vehicle.name}</h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{vehicle.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">À partir de</span>
                          <span className="font-extrabold text-slate-900 text-lg">
                            {vehicle.basePrice.toLocaleString("fr-FR")} € HT
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Contrôle & Alerte Commerciale Dynamique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Statut de Qualification :</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${dynamicQualification.badgeClass}`}>
                    {dynamicQualification.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Règle appliquée : {selectedVehicle.alertMessage}[cite: 1]
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className={`p-3 rounded-lg border ${isOverweight ? "bg-red-950/50 border-red-500" : "bg-slate-800/60 border-slate-700/50"}`}>
                    <span className="text-slate-400 block mb-1 flex items-center justify-between">
                      <span>Poids Chargé</span>
                      {isOverweight && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    </span>
                    <span className={`font-bold text-base ${isOverweight ? "text-red-400" : "text-slate-100"}`}>
                      {totalWeightKg} kg / {selectedVehicle.ptacKg} kg max
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Puissance Électrique</span>
                    <span className="font-bold text-base text-slate-100">{totalPowerKw.toFixed(1)} kW</span>
                    <p className="text-[10px] mt-1 text-amber-300 font-medium">{selectedVehicle.defaultPowerSupply}</p>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Permis Requis</span>
                    <span className="font-bold text-base text-slate-100">{selectedVehicle.licenseRequired}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Équipements & Options
                </CardTitle>
                <CardDescription>
                  Chaque ajout modifie le bilan de puissance et l'alerte de qualification[cite: 1].
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cuisson" className="w-full">
                  <TabsList className="grid grid-cols-3 sm:grid-cols-5 mb-6">
                    <TabsTrigger value="cuisson">Cuisson</TabsTrigger>
                    <TabsTrigger value="froid">Froid Pro</TabsTrigger>
                    <TabsTrigger value="energie">Énergie/Gaz</TabsTrigger>
                    <TabsTrigger value="hygiene">Hygiène</TabsTrigger>
                    <TabsTrigger value="amenagement">Design</TabsTrigger>
                  </TabsList>

                  {(["cuisson", "froid", "energie", "hygiene", "amenagement"] as const).map((cat) => (
                    <TabsContent key={cat} value={cat} className="space-y-3">
                      {EQUIPMENTS.filter((o) => o.category === cat).map((eq) => {
                        const isChecked = selectedEquipmentIds.includes(eq.id);
                        return (
                          <div
                            key={eq.id}
                            onClick={() => toggleEquipment(eq.id)}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? "border-amber-500 bg-amber-500/5 shadow-sm"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3 pr-4">
                              <div
                                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                                  isChecked ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300"
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 text-sm">{eq.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{eq.description}</p>
                                <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400 font-medium">
                                  <span>Poids : +{eq.weightKg} kg</span>
                                  {eq.powerWatts > 0 && <span className="text-blue-600">Élec : {eq.powerWatts}W</span>}
                                  {eq.energyType === 'gas' && <span className="text-amber-600">Énergie : Gaz</span>}
                                </div>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                              +{eq.price.toLocaleString("fr-FR")} €
                            </span>
                          </div>
                        );
                      })}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <Card className="shadow-lg border-amber-500/30 overflow-hidden">
                <div className="bg-slate-900 text-white p-6">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider block mb-1">
                    Récapitulatif & Chiffrage
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black">{totalPrice.toLocaleString("fr-FR")} €</span>
                    <span className="text-xs text-slate-400">HT</span>
                  </div>
                </div>

                <CardContent className="p-6 bg-white space-y-4">
                  <div className="pt-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger >
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 text-base shadow-md">
                          Valider la qualification & Devis
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Validation Technique</DialogTitle>
                          <DialogDescription>
                            Statut de qualification retenu : <span className="font-bold text-slate-900">{dynamicQualification.label}</span>[cite: 1].
                          </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSendDevis} className="space-y-4 mt-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                              id="name"
                              required
                              placeholder="ex: Jean Dupont"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                required
                                placeholder="jean@exemple.fr"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="phone">Téléphone *</Label>
                              <Input
                                id="phone"
                                type="tel"
                                required
                                placeholder="06 12 34 56 78"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="notes">Question réflexe (Prise emplacement / Puissance)</Label>
                            <Textarea
                              id="notes"
                              rows={3}
                              placeholder="230V standard, 32A ou triphasé garanti sur l'emplacement ?"
                              value={projectNotes}
                              onChange={(e) => setProjectNotes(e.target.value)}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enregistrement...
                              </>
                            ) : (
                              "Confirmer et Transmettre"
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-100 border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Règle de rendez-vous</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Vérifiez systématiquement la prise disponible sur l'emplacement avant tout engagement[cite: 1].</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
