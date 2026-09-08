import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  FileText,
  Gauge,
  Hammer,
  LifeBuoy,
  Loader2,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
  AlertTriangle,
  BatteryCharging,
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

// Import du catalogue dynamique
import { VEHICLES, EQUIPMENTS, VehicleModel } from "@/data/catalog";

export default function Home() {
  // State
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

  // --- Calculs Dynamiques (Prix, Poids, Énergie) ---
  const totalPrice = useMemo(() => {
    const optionsSum = selectedEquipmentIds.reduce((sum, eqId) => {
      const eq = EQUIPMENTS.find((e) => e.id === eqId);
      return sum + (eq ? eq.price : 0);
    }, 0);
    return selectedVehicle.basePrice + optionsSum;
  }, [selectedVehicle, selectedEquipmentIds]);

  const totalWeightKg = useMemo(() => {
    const equipmentsWeight = selectedEquipmentIds.reduce((sum, id) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.weightKg : 0);
    }, 0);
    const reservesWeight = 150; // Réserve eau / gaz fixe
    return selectedVehicle.emptyWeightKg + equipmentsWeight + reservesWeight;
  }, [selectedVehicle, selectedEquipmentIds]);

  const totalPowerKw = useMemo(() => {
    const watts = selectedEquipmentIds.reduce((sum, id) => {
      const eq = EQUIPMENTS.find((e) => e.id === id);
      return sum + (eq ? eq.powerWatts : 0);
    }, 0);
    return watts / 1000;
  }, [selectedEquipmentIds]);

  const isOverweight = totalWeightKg > selectedVehicle.ptacKg;
  const electricalRequirement = totalPowerKw > 7.4 ? "Triphasé 400V Requis" : "Monophasé 230V Standard";

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
        description: `Merci ${clientName || "cher client"}. Un conseiller technique Beau Comme Un Camion vous recontactera sous 24h.`,
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

      {/* --- Header / Hero --- */}
      <header className="bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium mb-6">
            <Truck className="w-4 h-4" />
            Configurateur Officiel • Beau Comme Un Camion
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Concevez votre unité mobile professionnelle sur-mesure
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Simulez en temps réel le PTAC, la puissance électrique et le budget de votre futur foodtruck ou remorque.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Normes VASP / DDPP / CE
            </span>
            <span className="flex items-center gap-1.5">
              <Hammer className="w-4 h-4 text-amber-400" />
              Fabrication française artisanale
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400" />
              Étude technique personnalisée
            </span>
          </div>
        </div>
      </header>

      {/* --- Main Configurator Grid --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Model Selection */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Choisissez votre modèle de base
                </CardTitle>
                <CardDescription>
                  Remorques et camions neufs conçus pour une exploitation intensive.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VEHICLES.map((vehicle) => {
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
                            {vehicle.type.toUpperCase()} • {vehicle.category}
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

            {/* Technical Live Dashboard (Weight & Power Checks) */}
            <Card className="bg-slate-900 text-white border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Contrôle Technique Dynamique : {selectedVehicle.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                {/* Weight Box */}
                <div className={`p-3 rounded-lg border ${isOverweight ? "bg-red-950/50 border-red-500" : "bg-slate-800/60 border-slate-700/50"}`}>
                  <span className="text-slate-400 block mb-1 flex items-center justify-between">
                    <span>Poids Chargé Estimé</span>
                    {isOverweight && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-bold text-base ${isOverweight ? "text-red-400" : "text-slate-100"}`}>
                      {totalWeightKg} kg
                    </span>
                    <span className="text-[10px] text-slate-400">/ PTAC {selectedVehicle.ptacKg} kg</span>
                  </div>
                  <p className="text-[10px] mt-1 text-slate-400">
                    {isOverweight ? "⚠️ Surcharge PTAC (Permis BE ou allègement requis)" : `Permis requis : ${selectedVehicle.licenseRequired}`}
                  </p>
                </div>

                {/* Power Box */}
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block mb-1 flex items-center justify-between">
                    <span>Puissance Électrique</span>
                    <BatteryCharging className="w-4 h-4 text-blue-400" />
                  </span>
                  <span className="font-bold text-base text-slate-100">{totalPowerKw.toFixed(1)} kW</span>
                  <p className="text-[10px] mt-1 text-amber-300 font-medium">{electricalRequirement}</p>
                </div>

                {/* Dimensions Box */}
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block mb-1">Dimensions Cellule</span>
                  <span className="font-bold text-base text-slate-100">{selectedVehicle.lengthMeters}m x {selectedVehicle.widthMeters}m</span>
                  <p className="text-[10px] mt-1 text-slate-400">Isolation panneau sandwich ISO</p>
                </div>

              </CardContent>
            </Card>

            {/* Step 2: Equipment & Options */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Équipements professionnels & Aménagements
                </CardTitle>
                <CardDescription>
                  Sélectionnez vos postes de cuisson, froid et options techniques.
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
                                  {eq.powerWatts > 0 && <span>Élec : {eq.powerWatts}W</span>}
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

          {/* Right Column: Summary & Validation (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              
              <Card className="shadow-lg border-amber-500/30 overflow-hidden">
                <div className="bg-slate-900 text-white p-6">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider block mb-1">
                    Estimation Totale
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black">{totalPrice.toLocaleString("fr-FR")} €</span>
                    <span className="text-xs text-slate-400">HT</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Poids total estimé : {totalWeightKg} kg / {selectedVehicle.ptacKg} kg max
                  </p>
                </div>

                <CardContent className="p-6 bg-white space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Votre configuration
                    </h4>
                    
                    <div className="flex justify-between items-start text-xs pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">{selectedVehicle.name}</span>
                        <span className="text-slate-400">Poids à vide : {selectedVehicle.emptyWeightKg} kg</span>
                      </div>
                      <span className="font-semibold text-slate-900">{selectedVehicle.basePrice.toLocaleString("fr-FR")} €</span>
                    </div>

                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedEquipmentIds.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Aucun équipement sélectionné.</p>
                      ) : (
                        selectedEquipmentIds.map((id) => {
                          const eq = EQUIPMENTS.find((e) => e.id === id);
                          if (!eq) return null;
                          return (
                            <div key={eq.id} className="flex justify-between items-center text-xs">
                              <span className="text-slate-600 truncate pr-2">{eq.name}</span>
                              <span className="font-medium text-slate-900 shrink-0">+{eq.price.toLocaleString("fr-FR")} €</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-6 text-base shadow-md cursor-pointer">
                          Recevoir mon Devis Technique
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Finaliser ma demande de devis</DialogTitle>
                          <DialogDescription>
                            Validation de l'étude de poids (PTAC) et transmission du chiffrage détaillé.
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
                            <Label htmlFor="notes">Notes sur le projet</Label>
                            <Textarea
                              id="notes"
                              rows={3}
                              placeholder="Implantation, type de cuisine, contraintes d'emplacement..."
                              value={projectNotes}
                              onChange={(e) => setProjectNotes(e.target.value)}
                            />
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                            <span>Total HT estimé :</span>
                            <span className="font-extrabold text-slate-900 text-sm">{totalPrice.toLocaleString("fr-FR")} €</span>
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 mt-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Transmission...
                              </>
                            ) : (
                              "Envoyer la demande"
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
                    <h5 className="text-xs font-bold text-slate-900">Support Technique Alternance</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Ce configurateur calcule dynamiquement les limites réglementaires VASP de Beau Comme Un Camion.</p>
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
