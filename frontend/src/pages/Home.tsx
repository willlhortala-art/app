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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock data — prototype sans backend                                */
/* ------------------------------------------------------------------ */

const VEHICLES = [
  { id: "foodtruck", label: "Food truck", note: "Porteur aménagé", base: 62000, weeks: 14, icon: Truck },
  { id: "remorque", label: "Remorque", note: "Tractable 750kg+", base: 38000, weeks: 9, icon: Package },
  { id: "container", label: "Container", note: "Kiosque fixe 10-20'", base: 52000, weeks: 12, icon: Hammer },
] as const;

const SECTORS = [
  { id: "burger", label: "Burger / Frites", coef: 1, extraWeeks: 0 },
  { id: "pizza", label: "Pizza", coef: 1.16, extraWeeks: 2 },
  { id: "creperie", label: "Crêperie", coef: 1.05, extraWeeks: 1 },
  { id: "snacking", label: "Snacking", coef: 0.92, extraWeeks: 0 },
] as const;

const POWERS = [
  { id: "mono", label: "Monophasé", note: "16-32 A · 3,5 à 7 kW", price: 0, weeks: 0 },
  { id: "tri", label: "Triphasé", note: "32 A · jusqu'à 22 kW", price: 4800, weeks: 2 },
] as const;

type VehicleId = (typeof VEHICLES)[number]["id"];
type SectorId = (typeof SECTORS)[number]["id"];
type PowerId = (typeof POWERS)[number]["id"];
type TabId = "projet" | "atelier" | "coffre";

const OPTIONS = [
  { id: "inox", label: "Plan de travail inox complet", price: 3400 },
  { id: "froid", label: "Groupe froid renforcé", price: 2600 },
  { id: "auvent", label: "Auvent hydraulique + éclairage", price: 1900 },
  { id: "covering", label: "Covering sur-mesure", price: 2200 },
] as const;

const STEPS = [
  { id: "plans", label: "Validation des plans", detail: "Plans 3D signés le 12/01", status: "done", date: "12 janv." },
  { id: "tolerie", label: "Tôlerie & structure", detail: "Découpe laser + soudure châssis", status: "done", date: "28 janv." },
  { id: "elec", label: "Électricité / Gaz", detail: "Tableau triphasé, rampe gaz NF", status: "current", date: "En cours" },
  { id: "equip", label: "Pose des équipements", detail: "Friteuses, plancha, froid négatif", status: "todo", date: "Prévu 24 mars" },
  { id: "vasp", label: "Homologation VASP", detail: "Passage DREAL + procès-verbal", status: "todo", date: "Prévu 11 avril" },
  { id: "livre", label: "Livraison", detail: "Remise des clés à l'atelier", status: "todo", date: "Prévu 25 avril" },
] as const;

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?crop=entropy&cs=srgb&fm=jpg&w=800&q=80", caption: "Châssis en peinture" },
  { src: "https://images.unsplash.com/photo-1620589125156-fd5028c5e05b?crop=entropy&cs=srgb&fm=jpg&w=800&q=80", caption: "Comptoir de service" },
  { src: "https://images.pexels.com/photos/5920659/pexels-photo-5920659.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Auvent monté" },
  { src: "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?crop=entropy&cs=srgb&fm=jpg&w=800&q=80", caption: "Cuisine équipée" },
  { src: "https://images.unsplash.com/photo-1570441262582-a2d4b9a916a5?crop=entropy&cs=srgb&fm=jpg&w=800&q=80", caption: "Essai en extérieur" },
  { src: "https://images.pexels.com/photos/5920681/pexels-photo-5920681.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Contrôle qualité" },
];

const DOCUMENTS = [
  { id: "gaz", name: "Notice Gaz & rampe NF", meta: "PDF · 1,2 Mo · 04/02/2026", kind: "Sécurité" },
  { id: "vasp", name: "Certificat VASP (provisoire)", meta: "PDF · 480 Ko · 18/02/2026", kind: "Homologation" },
  { id: "facture", name: "Facture acompte n°2026-0412", meta: "PDF · 210 Ko · 22/01/2026", kind: "Comptabilité" },
  { id: "elec", name: "Schéma électrique triphasé", meta: "PDF · 860 Ko · 11/02/2026", kind: "Technique" },
  { id: "garantie", name: "Conditions de garantie 24 mois", meta: "PDF · 320 Ko · 12/01/2026", kind: "Contrat" },
];

const EQUIPMENTS = [
  "Groupe froid",
  "Friteuse",
  "Plancha / Grill",
  "Rampe gaz",
  "Tableau électrique",
  "Auvent / Carrosserie",
];

const EUR = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/* ------------------------------------------------------------------ */
/*  Génération de PDF factice côté client                            */
/* ------------------------------------------------------------------ */

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buildPdfBlob(title: string, lines: string[]): Blob {
  const esc = (s: string) =>
    stripAccents(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

  const content = [
    `BT /F1 18 Tf 56 770 Td (${esc(title)}) Tj ET`,
    `BT /F1 9 Tf 56 748 Td (Beau comme un camion - Savoir-faire francais - Document de demonstration) Tj ET`,
    ...lines.map((l, i) => `BT /F1 11 Tf 56 ${710 - i * 22} Td (${esc(l)}) Tj ET`),
  ].join("\n");

  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const startxref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function downloadPdf(title: string, lines: string[], filename: string) {
  const url = URL.createObjectURL(buildPdfBlob(title, lines));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ------------------------------------------------------------------ */
/*  Composants de présentation                                        */
/* ------------------------------------------------------------------ */

function TricolorBadge({ testId }: { testId: string }) {
  return (
    <span
      data-testid={testId}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1.5 pr-3 text-[11px] font-semibold tracking-wide text-slate-100 backdrop-blur"
    >
      <span className="flex h-4 w-6 overflow-hidden rounded-[3px] shadow-sm">
        <span className="h-full w-1/3 bg-[#1D4ED8]" />
        <span className="h-full w-1/3 bg-white" />
        <span className="h-full w-1/3 bg-[#EF4444]" />
      </span>
      Made in France
    </span>
  );
}

function ChipGroup<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
  testId,
  columns = 2,
}: {
  label: string;
  hint?: string;
  options: readonly { id: T; label: string; note?: string }[];
  value: T;
  onChange: (id: T) => void;
  testId: string;
  columns?: number;
}) {
  return (
    <div className="space-y-2.5" data-testid={testId}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-slate-900">{label}</p>
        {hint ? <span className="text-[11px] text-slate-500">{hint}</span> : null}
      </div>
      <div className={cn("grid gap-2", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              data-testid={`${testId}-option-${opt.id}`}
              aria-pressed={active}
              onClick={() => onChange(opt.id)}
              className={cn(
                "group relative rounded-xl border px-3 py-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98]",
                active
                  ? "border-amber-500 bg-amber-50 shadow-[0_0_0_3px_rgba(245,158,11,0.18)]"
                  : "border-slate-200 bg-white hover:border-slate-400",
              )}
            >
              <span className="block text-sm font-semibold leading-tight text-slate-900">{opt.label}</span>
              {opt.note ? <span className="mt-0.5 block text-[11px] leading-tight text-slate-500">{opt.note}</span> : null}
              {active ? (
                <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-amber-600 animate-[rivet_0.5s_ease-out]" strokeWidth={3} />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-amber-400">{icon}</span>
          <h2 className="font-heading text-[15px] font-bold tracking-tight text-slate-900">{title}</h2>
        </div>
        {action}
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page principale                                                  */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [tab, setTab] = useState<TabId>("projet");

  // Onglet 1 — configurateur
  const [vehicle, setVehicle] = useState<VehicleId>("foodtruck");
  const [sector, setSector] = useState<SectorId>("burger");
  const [power, setPower] = useState<PowerId>("mono");
  const [options, setOptions] = useState<string[]>(["inox"]);
  const [company, setCompany] = useState("");
  const [study, setStudy] = useState<null | { ref: string; when: string }>(null);

  // Onglet 3 — SAV
  const [savOpen, setSavOpen] = useState(false);
  const [equipment, setEquipment] = useState(EQUIPMENTS[0]);
  const [issue, setIssue] = useState("");
  const [tickets, setTickets] = useState<{ id: string; equipment: string; issue: string }[]>([]);

  const estimate = useMemo(() => {
    const v = VEHICLES.find((x) => x.id === vehicle)!;
    const s = SECTORS.find((x) => x.id === sector)!;
    const p = POWERS.find((x) => x.id === power)!;
    const optTotal = OPTIONS.filter((o) => options.includes(o.id)).reduce((sum, o) => sum + o.price, 0);
    const mid = Math.round((v.base * s.coef + p.price + optTotal) / 100) * 100;
    const weeks = v.weeks + s.extraWeeks + p.weeks + (options.length > 2 ? 1 : 0);
    return {
      low: Math.round((mid * 0.93) / 500) * 500,
      high: Math.round((mid * 1.08) / 500) * 500,
      mid,
      weeks,
      optTotal,
      vehicleLabel: v.label,
      sectorLabel: s.label,
      powerLabel: p.label,
    };
  }, [vehicle, sector, power, options]);

  const progress = useMemo(() => {
    const done = STEPS.filter((s) => s.status === "done").length;
    const current = STEPS.some((s) => s.status === "current") ? 0.5 : 0;
    return Math.round(((done + current) / STEPS.length) * 100);
  }, []);

  const toggleOption = (id: string) =>
    setOptions((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submitStudy = () => {
    const ref = `BCC-${Math.floor(1000 + Math.random() * 9000)}`;
    setStudy({ ref, when: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long" }) });
    toast.success("Demande d'étude envoyée", {
      description: `Référence ${ref} — notre bureau d'études vous rappelle sous 48 h.`,
    });
  };

  const submitTicket = () => {
    if (issue.trim().length < 5) {
      toast.error("Merci de décrire la panne en quelques mots.");
      return;
    }
    const id = `SAV-${Math.floor(100 + Math.random() * 900)}`;
    setTickets((prev) => [{ id, equipment, issue: issue.trim() }, ...prev]);
    setIssue("");
    setSavOpen(false);
    toast.success("Panne signalée", { description: `Ticket ${id} · ${equipment} — prise en charge sous 24 h ouvrées.` });
  };

  const tabs: { id: TabId; label: string; icon: typeof Truck }[] = [
    { id: "projet", label: "Mon Projet", icon: Gauge },
    { id: "atelier", label: "Suivi Atelier", icon: Wrench },
    { id: "coffre", label: "Coffre & SAV", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-dvh bg-[#111827] text-slate-100" data-testid="app-root">
      <Toaster position="top-center" richColors />

      {/* ---------------- Header ---------------- */}
      <header
        className="sticky top-0 z-30 border-b border-white/10 bg-[#0B1120]/95 backdrop-blur"
        data-testid="app-header"
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-[#1E1E1E] shadow-[0_6px_18px_-6px_rgba(245,158,11,0.9)]">
              <Truck className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-[15px] font-extrabold uppercase tracking-tight" data-testid="brand-name">
                Beau comme un camion
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400/90">Espace pro · B2B</p>
            </div>
          </div>
          <TricolorBadge testId="header-made-in-france-badge" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-32 pt-5" data-testid="tab-panel">
        {/* ================= ONGLET 1 ================= */}
        {tab === "projet" ? (
          <div className="space-y-4 animate-[slide-up_0.38s_cubic-bezier(0.22,1,0.36,1)]" data-testid="tab-content-projet">
            <div className="pb-1">
              <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight" data-testid="page-title-projet">
                Configurateur express
              </h1>
              <p className="mt-1 max-w-md text-sm text-slate-400">
                Trois questions pour obtenir une fourchette de prix et un délai d'atelier indicatifs.
              </p>
            </div>

            <Panel title="Votre configuration" icon={<Truck className="h-4 w-4" />}>
              <div className="space-y-5">
                <ChipGroup
                  testId="config-vehicle"
                  label="Type de véhicule"
                  options={VEHICLES}
                  value={vehicle}
                  onChange={setVehicle}
                />
                <ChipGroup
                  testId="config-sector"
                  label="Secteur d'activité"
                  options={SECTORS}
                  value={sector}
                  onChange={setSector}
                />
                <ChipGroup
                  testId="config-power"
                  label="Besoins électriques"
                  hint="Puissance estimée"
                  options={POWERS}
                  value={power}
                  onChange={setPower}
                />

                <div className="space-y-2.5" data-testid="config-options">
                  <p className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-slate-900">Options atelier</p>
                  <div className="grid gap-2">
                    {OPTIONS.map((o) => {
                      const active = options.includes(o.id);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          data-testid={`config-option-${o.id}`}
                          aria-pressed={active}
                          onClick={() => toggleOption(o.id)}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200",
                            active ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-white hover:border-slate-400",
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors duration-200",
                                active ? "border-amber-500 bg-amber-500" : "border-slate-300 bg-white",
                              )}
                            >
                              {active ? <Check className="h-3 w-3 text-white" strokeWidth={3.5} /> : null}
                            </span>
                            <span className="text-sm font-medium text-slate-800">{o.label}</span>
                          </span>
                          <span className="text-xs font-semibold tabular-nums text-slate-500">+{EUR.format(o.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Panel>

            {/* Estimation */}
            <section
              className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1B2437] to-[#0B1120] p-5 shadow-[0_22px_50px_-28px_rgba(245,158,11,0.7)]"
              data-testid="estimate-card"
            >
              <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">Estimation indicative</p>
              <p className="mt-2 font-heading text-3xl font-extrabold tabular-nums tracking-tight" data-testid="estimate-price">
                {EUR.format(estimate.low)} <span className="text-slate-500">–</span> {EUR.format(estimate.high)}
              </p>
              <p className="mt-1 text-xs text-slate-400">HT, hors véhicule d'occasion fourni par le client.</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
                    <CalendarClock className="h-3.5 w-3.5" /> Délai atelier
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold tabular-nums" data-testid="estimate-delay">
                    {estimate.weeks} semaines
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
                    <Zap className="h-3.5 w-3.5" /> Électricité
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold" data-testid="estimate-power">
                    {estimate.powerLabel}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5" data-testid="estimate-recap">
                <Badge className="bg-white/10 text-slate-100">{estimate.vehicleLabel}</Badge>
                <Badge className="bg-white/10 text-slate-100">{estimate.sectorLabel}</Badge>
                <Badge className="bg-white/10 text-slate-100">
                  {options.length} option{options.length > 1 ? "s" : ""} · +{EUR.format(estimate.optTotal)}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="company" className="text-xs text-slate-300">
                  Votre enseigne (optionnel)
                </Label>
                <Input
                  id="company"
                  data-testid="company-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex. Le Camion Doré"
                  className="border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <Button
                size="lg"
                data-testid="request-study-button"
                onClick={submitStudy}
                className="mt-4 w-full bg-amber-500 font-heading text-base font-bold text-[#1E1E1E] transition-transform duration-200 hover:bg-amber-400 active:scale-[0.98]"
              >
                Demander une étude détaillée
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>

              <div className="mt-4 flex justify-center">
                <TricolorBadge testId="product-made-in-france-badge" />
              </div>
            </section>

            {study ? (
              <div
                className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 animate-[slide-up_0.38s_ease-out]"
                data-testid="study-confirmation"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-200">Demande {study.ref} enregistrée le {study.when}</p>
                  <p className="mt-1 text-slate-300">
                    {company ? `${company} — ` : ""}
                    {estimate.vehicleLabel} · {estimate.sectorLabel} · {estimate.powerLabel} · {estimate.weeks} semaines.
                    Un chiffrage ferme vous sera adressé sous 48 h.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ================= ONGLET 2 ================= */}
        {tab === "atelier" ? (
          <div className="space-y-4 animate-[slide-up_0.38s_cubic-bezier(0.22,1,0.36,1)]" data-testid="tab-content-atelier">
            <div className="pb-1">
              <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight" data-testid="page-title-atelier">
                Suivi atelier
              </h1>
              <p className="mt-1 text-sm text-slate-400">Camion Burger — Client #4092 · Atelier de Nantes</p>
            </div>

            <section
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1B2437] to-[#0B1120] p-5"
              data-testid="progress-card"
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">Avancement global</p>
                  <p className="mt-1 font-heading text-4xl font-extrabold tabular-nums" data-testid="progress-value">
                    {progress}%
                  </p>
                </div>
                <Badge className="bg-amber-500 text-[#1E1E1E]" data-testid="progress-stage-badge">
                  Étape 3/6
                </Badge>
              </div>
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10" data-testid="progress-bar">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-[width] duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">Livraison prévisionnelle : 25 avril 2026</p>
            </section>

            <Panel title="Étapes de fabrication" icon={<Hammer className="h-4 w-4" />}>
              <ol className="relative space-y-0" data-testid="timeline">
                {STEPS.map((step, i) => {
                  const done = step.status === "done";
                  const current = step.status === "current";
                  return (
                    <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0" data-testid={`timeline-step-${step.id}`}>
                      {i < STEPS.length - 1 ? (
                        <span
                          className={cn(
                            "absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-0.5",
                            done ? "bg-amber-500" : "bg-slate-200",
                          )}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                          done && "border-amber-500 bg-amber-500 text-white",
                          current && "border-amber-500 bg-white text-amber-600",
                          !done && !current && "border-slate-200 bg-white text-slate-400",
                        )}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                        ) : current ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={3} />
                        ) : (
                          <span className="text-[11px] font-bold tabular-nums">{i + 1}</span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p
                            className={cn(
                              "font-heading text-sm font-bold",
                              current ? "text-amber-600" : "text-slate-900",
                            )}
                          >
                            {step.label}
                          </p>
                          <span className="text-[11px] font-medium text-slate-500">{step.date}</span>
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{step.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Panel>

            <Panel
              title="Galerie d'avancement"
              icon={<ImageIcon className="h-4 w-4" />}
              action={<span className="text-[11px] text-slate-500">{GALLERY.length} photos</span>}
            >
              <div className="grid grid-cols-2 gap-2.5" data-testid="workshop-gallery">
                {GALLERY.map((photo, i) => (
                  <figure
                    key={photo.src}
                    className="group overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5"
                    data-testid={`gallery-photo-${i}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      loading="lazy"
                      className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <figcaption className="px-2 py-1.5 text-[11px] font-medium text-slate-600">{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </Panel>
          </div>
        ) : null}

        {/* ================= ONGLET 3 ================= */}
        {tab === "coffre" ? (
          <div className="space-y-4 animate-[slide-up_0.38s_cubic-bezier(0.22,1,0.36,1)]" data-testid="tab-content-coffre">
            <div className="pb-1">
              <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight" data-testid="page-title-coffre">
                Coffre-fort &amp; SAV
              </h1>
              <p className="mt-1 text-sm text-slate-400">Tous vos documents d'exploitation, disponibles hors ligne.</p>
            </div>

            <Panel title="Mes documents" icon={<FileText className="h-4 w-4" />}>
              <ul className="divide-y divide-slate-100" data-testid="documents-list">
                {DOCUMENTS.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{doc.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {doc.kind} · {doc.meta}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      data-testid={`download-doc-${doc.id}`}
                      onClick={() => {
                        downloadPdf(
                          doc.name,
                          [
                            `Catégorie : ${doc.kind}`,
                            `Référence dossier : Client #4092 - Camion Burger`,
                            `Émis le : ${doc.meta}`,
                            "",
                            "Ce document est un exemple de démonstration généré",
                            "par l'application Beau comme un camion.",
                          ],
                          `${doc.id}-bcc-4092.pdf`,
                        );
                        toast.success("Document téléchargé", { description: doc.name });
                      }}
                      className="shrink-0 transition-transform duration-200 active:scale-95"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Télécharger {doc.name}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Service après-vente" icon={<LifeBuoy className="h-4 w-4" />}>
              <p className="text-sm leading-relaxed text-slate-600">
                Une panne sur un équipement ? Signalez-la : un technicien vous rappelle sous 24 h ouvrées. Garantie
                atelier 24 mois pièces et main-d'œuvre.
              </p>

              <div className="mt-4">
                <Dialog open={savOpen} onOpenChange={setSavOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" data-testid="report-issue-button" className="w-full bg-slate-900 text-amber-400 hover:bg-slate-800">
                      Signaler une panne ou un incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white text-slate-900">
                    <DialogHeader>
                      <DialogTitle>Déclarer un incident SAV</DialogTitle>
                      <DialogDescription>
                        Renseignez l'équipement concerné et décrivez brièvement le dysfonctionnement constaté.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="equipment">Équipement concerné</Label>
                        <select
                          id="equipment"
                          value={equipment}
                          onChange={(e) => setEquipment(e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          {EQUIPMENTS.map((eq) => (
                            <option key={eq} value={eq}>
                              {eq}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="issue">Description de la panne</Label>
                        <Textarea
                          id="issue"
                          value={issue}
                          onChange={(e) => setIssue(e.target.value)}
                          placeholder="Ex : Le groupe froid reste bloqué à +8°C depuis ce matin..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSavOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={submitTicket} className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                        Envoyer le ticket
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {tickets.length > 0 ? (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tickets en cours</p>
                  <ul className="space-y-2">
                    {tickets.map((t) => (
                      <li key={t.id} className="rounded-lg bg-slate-50 p-3 text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>{t.id} · {t.equipment}</span>
                          <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600">
                            Prise en charge
                          </Badge>
                        </div>
                        <p className="mt-1 text-slate-600">{t.issue}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Panel>
          </div>
        ) : null}
      </main>

      {/* ---------------- Navigation inférieure / Onglets ---------------- */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0B1120]/95 backdrop-blur"
        data-testid="bottom-navigation"
      >
        <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                data-testid={`tab-button-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors",
                  active ? "text-amber-400 font-semibold" : "text-slate-400 hover:text-slate-200",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px]">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

```
