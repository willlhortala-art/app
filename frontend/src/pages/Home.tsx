import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Hammer,
  ImageIcon,
  LifeBuoy,
  Loader2,
  Package,
  ShieldCheck,
  Truck,
  Wrench,
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

// --- Types ---
type TruckModel = {
  id: string;
  name: string;
  category: "foodtruck" | "remorque" | "container";
  badge: string;
  startingPrice: number;
  deliveryWeeks: number;
  description: string;
  specs: {
    length: string;
    weight: string;
    power: string;
    permis: string;
  };
  features: string[];
  popular?: boolean;
};

type Option = {
  id: string;
  name: string;
  category: "cuisson" | "froid" | "hygiene" | "energie" | "design";
  price: number;
  description: string;
};

// --- Mock Data ---
const TRUCK_MODELS: TruckModel[] = [
  {
    id: "ft-pro-master",
    name: "Foodtruck Master Pro 3.7m",
    category: "foodtruck",
    badge: "Best-seller Restauration",
    startingPrice: 38500,
    deliveryWeeks: 6,
    description: "Le châssis idéal pour une activité quotidienne à fort volume. Ergonomie optimale pour 2 à 3 personnes.",
    popular: true,
    specs: {
      length: "3.70 m",
      weight: "3 500 kg (PTAC)",
      power: "Monophasé 230V / Triphasé 400V",
      permis: "Permis B",
    },
    features: [
      "Plancher bas ergonomique",
      "Grand volet latéral assisté par vérins",
      "Isolation panneau sandwich 30mm norme ISO",
      "Éclairage LED architectural haute restitution",
    ],
  },
  {
    id: "remorque-gourmet",
    name: "Remorque Gourmet Compact 3.0m",
    category: "remorque",
    badge: "Investissement optimisé",
    startingPrice: 22900,
    deliveryWeeks: 4,
    description: "Légère, très maniable et rapide à installer sur tous les événements, marchés et emplacements éphémères.",
    specs: {
      length: "3.00 m",
      weight: "1 300 kg (PTAC)",
      power: "Monophasé 230V 32A",
      permis: "Permis B (selon véhicule tracteur) ou BE",
    },
    features: [
      "Châssis galvanisé à chaud anticorrosion",
      "4 béquilles de stabilisation renforcées",
      "Comptoir de service inox brossé AISI 304",
      "Facilité de tractage et d'entretien",
    ],
  },
  {
    id: "container-street",
    name: "Container Street Stand 20ft",
    category: "container",
    badge: "Design Urbain / Fixe",
    startingPrice: 31000,
    deliveryWeeks: 8,
    description: "Inspiré de l'architecture industrielle. Parfait pour les food courts, terrasses fixes et guinguettes modernes.",
    specs: {
      length: "6.00 m (20 pieds)",
      weight: "2 400 kg à vide",
      power: "Triphasé 400V 63A",
      permis: "Transport sur camion plateau",
    },
    features: [
      "Structure acier Corten ultra-résistante",
      "Ouverture panoramique à commande hydraulique",
      "Habillage bois ou métal personnalisable",
      "Sécurité antivol maximale à la fermeture",
    ],
  },
];

const OPTIONS: Option[] = [
  { id: "opt-fryer", name: "Friteuse double 2x16L Inox Gaz/Élec", category: "cuisson", price: 2450, description: "Haut rendement avec zone froide et robinet de vidange." },
  { id: "opt-snack", name: "Plaque à snacker Inox 80cm chromée", category: "cuisson", price: 1890, description: "Saisie parfaite des viandes et burgers, nettoyage ultra-rapide." },
  { id: "opt-fridge-table", name: "Table réfrigérée 3 portes inox", category: "froid", price: 2800, description: "Capacité 410L, froid ventilé +2°C/+8°C, plan de travail inox." },
  { id: "opt-display", name: "Vitrine réfrigérée de présentation 1.2m", category: "froid", price: 1650, description: "Mise en valeur des boissons, desserts et produits frais." },
  { id: "opt-solar", name: "Pack Autonomie Solaire + Batterie Lithium 5kWh", category: "energie", price: 4200, description: "Alimente éclairage, caisse et frigos sans bruit ni groupe électrogène." },
  { id: "opt-generator", name: "Groupe électrogène insonorisé 7kW Inverter", category: "energie", price: 2100, description: "Démarrage électrique à distance, courant propre pour l'électronique." },
  { id: "opt-covering", name: "Total Covering Graphique Personnalisé", category: "design", price: 2900, description: "Impression HD vinyle coulé pelliculé anti-UV + création maquette 3D." },
  { id: "opt-hygiene", name: "Pack Hygiène & Plonge Inox CE", category: "hygiene", price: 1150, description: "Lave-mains commande au genou, chauffe-eau automatique, distributeurs." },
];

export default function Home() {
  // State
  const [selectedModel, setSelectedModel] = useState<TruckModel>(TRUCK_MODELS[0]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([
    "opt-fridge-table",
    "opt-hygiene",
  ]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Computed total
  const totalPrice = useMemo(() => {
    const optionsSum = selectedOptionIds.reduce((sum, optId) => {
      const opt = OPTIONS.find((o) => o.id === optId);
      return sum + (opt ? opt.price : 0);
    }, 0);
    return selectedModel.startingPrice + optionsSum;
  }, [selectedModel, selectedOptionIds]);

  const toggleOption = (id: string) => {
    setSelectedOptionIds((prev) =>
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
        description: `Merci ${clientName || "cher client"}. Un conseiller technique Beau Comme Un Camion vous recontactera sous 24h avec votre devis chiffré.`,
      });
      // Clear contact form
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
            Fabricant Français & Concepteur de Restauration Mobile
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Configurez votre Foodtruck sur-mesure aux normes CE
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Sélectionnez votre base, choisissez vos équipements de cuisine pro et obtenez une estimation financière instantanée.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Homologation VASP / DDPP
            </span>
            <span className="flex items-center gap-1.5">
              <Hammer className="w-4 h-4 text-amber-400" />
              Garantie constructeur 2 ans
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400" />
              Livraison partout en France
            </span>
          </div>
        </div>
      </header>

      {/* --- Main Configurator Grid --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Selection & Customization (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Model Selection */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Choisissez votre véhicule ou structure
                </CardTitle>
                <CardDescription>
                  Nos modules sont entièrement personnalisables et conformes aux normes d'hygiène HACCP.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TRUCK_MODELS.map((model) => {
                  const isSelected = selectedModel.id === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/5 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {model.popular && (
                        <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommandé
                        </span>
                      )}
                      <div>
                        <Badge variant={isSelected ? "default" : "secondary"} className="mb-2 text-[10px]">
                          {model.badge}
                        </Badge>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{model.name}</h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{model.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">À partir de</span>
                          <span className="font-extrabold text-slate-900 text-lg">
                            {model.startingPrice.toLocaleString("fr-FR")} €
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

            {/* Technical Specs of Selected Model */}
            <Card className="bg-slate-900 text-white border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Caractéristiques techniques : {selectedModel.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block mb-1">Longueur cellule</span>
                  <span className="font-bold text-sm text-slate-100">{selectedModel.specs.length}</span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block mb-1">Poids / PTAC</span>
                  <span className="font-bold text-sm text-slate-100">{selectedModel.specs.weight}</span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block mb-1">Alimentation élec</span>
                  <span className="font-bold text-sm text-slate-100">{selectedModel.specs.power}</span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block mb-1">Permis requis</span>
                  <span className="font-bold text-sm text-slate-100">{selectedModel.specs.permis}</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Options & Equipment */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Équipements professionnels & Aménagements
                </CardTitle>
                <CardDescription>
                  Ajoutez les équipements CHR sur-mesure installés et raccordés par nos techniciens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cuisson" className="w-full">
                  <TabsList className="grid grid-cols-3 sm:grid-cols-5 mb-6">
                    <TabsTrigger value="cuisson">Cuisson</TabsTrigger>
                    <TabsTrigger value="froid">Froid Pro</TabsTrigger>
                    <TabsTrigger value="energie">Énergie</TabsTrigger>
                    <TabsTrigger value="design">Design/Habillage</TabsTrigger>
                    <TabsTrigger value="hygiene">Hygiène</TabsTrigger>
                  </TabsList>

                  {(["cuisson", "froid", "energie", "design", "hygiene"] as const).map((cat) => (
                    <TabsContent key={cat} value={cat} className="space-y-3">
                      {OPTIONS.filter((o) => o.category === cat).map((opt) => {
                        const isChecked = selectedOptionIds.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            onClick={() => toggleOption(opt.id)}
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
                                <h4 className="font-semibold text-slate-900 text-sm">{opt.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                              +{opt.price.toLocaleString("fr-FR")} €
                            </span>
                          </div>
                        );
                      })}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Reassurance Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                <Wrench className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">SAV & Pièces en stock</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Assistance technique et pièces détachées disponibles sous 48h.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Accompagnement VASP</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dossier d'homologation DREAL préparé par nos experts certifiés.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                <CalendarClock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Délais Respectés</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Livraison garantie selon le planning validé à la commande.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Action (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              
              <Card className="shadow-lg border-amber-500/30 overflow-hidden">
                <div className="bg-slate-900 text-white p-6">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider block mb-1">
                    Estimation du Projet
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black">{totalPrice.toLocaleString("fr-FR")} €</span>
                    <span className="text-xs text-slate-400">HT</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Financement Leasing / LOA possible dès {(totalPrice * 0.022).toFixed(0)}€/mois
                  </p>
                </div>

                <CardContent className="p-6 bg-white space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Récapitulatif de votre configuration
                    </h4>
                    
                    {/* Selected Model */}
                    <div className="flex justify-between items-start text-xs pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">{selectedModel.name}</span>
                        <span className="text-slate-400">Délai estimé : {selectedModel.deliveryWeeks} semaines</span>
                      </div>
                      <span className="font-semibold text-slate-900">{selectedModel.startingPrice.toLocaleString("fr-FR")} €</span>
                    </div>

                    {/* Selected Options */}
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedOptionIds.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Aucun équipement optionnel sélectionné.</p>
                      ) : (
                        selectedOptionIds.map((optId) => {
                          const opt = OPTIONS.find((o) => o.id === optId);
                          if (!opt) return null;
                          return (
                            <div key={opt.id} className="flex justify-between items-center text-xs">
                              <span className="text-slate-600 truncate pr-2">{opt.name}</span>
                              <span className="font-medium text-slate-900 shrink-0">+{opt.price.toLocaleString("fr-FR")} €</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-6 text-base shadow-md">
                          Recevoir mon Devis Gratuit
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Finaliser ma demande de devis</DialogTitle>
                          <DialogDescription>
                            Recevez le récapitulatif détaillé avec fiches techniques et étude de financement personnalisée.
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
                            <Label htmlFor="notes">Précisions sur votre projet (Optionnel)</Label>
                            <Textarea
                              id="notes"
                              rows={3}
                              placeholder="Emplacement prévu, type de cuisine, date de lancement souhaitée..."
                              value={projectNotes}
                              onChange={(e) => setProjectNotes(e.target.value)}
                            />
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                            <span>Montant estimé HT :</span>
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
                                Envoi en cours...
                              </>
                            ) : (
                              "Valider et recevoir par email"
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <p className="text-[10px] text-center text-slate-400 mt-3">
                      Gratuit et sans engagement. Vos données restent confidentielles.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Contact Card */}
              <Card className="bg-slate-100 border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Besoin d'un conseil technique ?</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Nos experts sont joignables du lundi au vendredi de 8h30 à 18h30.</p>
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
