/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import type { ColumnDef, VisibilityState, RowSelectionState } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, X, Plus, Truck, CreditCard, Package, PackageOpen, PackageCheck, MoreHorizontal, Check, Circle, RotateCcw, RefreshCw, CalendarIcon, Filter, Settings2, ChevronDown, ToyBrick, Settings, HelpCircle, Merge, Menu, LayoutDashboard, ClipboardList, QrCode, Mail, ListChecks, AlertTriangle, CloudDownload, Printer, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/easybill-logo.svg";
import logoPlus from "@/assets/easybill-logo+.svg";
import logoDHL from "@/assets/logos/logo-dhl.svg";
import logoDPD from "@/assets/logos/logo-dpd.svg";
import logoUPS from "@/assets/logos/logo-ups.svg";
import illuSendung1 from "@/assets/Illus/illu-sendung-erstellen-1.png";
import illuSendung2 from "@/assets/Illus/illu-sendung-erstellen-2.png";
import illuSendung3 from "@/assets/Illus/illu-sendung-erstellen-3.png";
import illuSendung4 from "@/assets/Illus/illu-sendung-erstellen-4.png";
import illuTipps1 from "@/assets/Illus/illu-tipps-1.png";
import illuTipps2 from "@/assets/Illus/illu-tipps-2.png";
import illuTipps3 from "@/assets/Illus/illu-tipps-3.png";
import illuTipps4 from "@/assets/Illus/illu-tipps-4.png";
import illuTipps5 from "@/assets/Illus/illu-tipps-5.png";
import statusTrue from "@/assets/svgs/status-true.svg";
import statusTrueTop from "@/assets/svgs/status-true-top.svg";
import statusTrueBottom from "@/assets/svgs/status-true-bottom.svg";
import statusFalse from "@/assets/svgs/status-false.svg";
import statusFalseTop from "@/assets/svgs/status-false-top.svg";
import statusFalseBottom from "@/assets/svgs/status-false-bottom.svg";
import statusGap from "@/assets/svgs/status-gap.svg";
import _statusActive from "@/assets/svgs/status-active.svg";
import statusActiveZahlung from "@/assets/svgs/status-active-zahlung.svg";
import statusActiveRechnung from "@/assets/svgs/status-active-rechnung.svg";
import statusActiveSendung from "@/assets/svgs/status-active-sendung.svg";
import statusActiveVersandprofil from "@/assets/svgs/status-active-versandprofil.svg";
import statusActiveVersandlabel from "@/assets/svgs/status-active-versandlabel.svg";
import statusActiveVersand from "@/assets/svgs/status-active-versand.svg";
import bestellungenCSV from "@/assets/tables/bestellungen.csv?raw";
import sendungenCSV from "@/assets/tables/sendungen.csv?raw";
import checklistenCSV from "@/assets/tables/checklisten.csv?raw";
import { parseCSV, parseChecklistCSV } from "@/lib/csvParser";

// Define the data type
type Order = {
  nr: number | string;
  kaufdatum: string;
  bestellnummer: string;
  sendungsnummer?: string;
  info: string;
  kundeAdresse: string;
  email: string;
  telefonnummer: string;
  artikelanzahl: number;
  gesamtNetto: number;
  mwstSatz: number;
  gesamtBrutto: number;
  bezahltAm: string | null;
  statusRechnungsversand: "versendet" | "ausstehend" | "fehler";
  versandland: string;
  versanddienstleister: string;
  versandverpackung: string;
  versandprofil?: string;
  versandtGemeldet: string | null;
  statusVersanddokumente: "erstellt" | "ausstehend" | "fehler";
  versanddatum: string | null;
  trackingnummer?: string;
  versandBrutto: number;
  versandNetto: number;
  importdatum: string;
  importquelle: string;
  rechnungVersendetDatum?: string | null;
  sendungErstelltDatum?: string | null;
  versandprofilHinzugefuegtDatum?: string | null;
  type: string;
};

// Article type
type Article = {
  artikel: string;
  anzahl: number;
  preisNetto: number;
  preisBrutto: number;
};

// Example article names
const exampleArticles = [
  "Produkt Alpha",
  "Produkt Beta",
  "Produkt Gamma",
  "Produkt Delta",
  "Produkt Epsilon",
  "Produkt Zeta",
  "Produkt Eta",
  "Produkt Theta",
  "Produkt Iota",
  "Produkt Kappa",
  "Produkt Lambda",
  "Produkt Mu",
  "Produkt Nu",
  "Produkt Xi",
  "Produkt Omicron",
  "Produkt Pi",
  "Produkt Rho",
  "Produkt Sigma",
  "Produkt Tau",
  "Produkt Upsilon",
  "Produkt Phi",
  "Produkt Chi",
  "Produkt Psi",
  "Produkt Omega",
];

// Simple seeded random function for consistent results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate example articles for an order
function generateArticles(order: Order): Article[] {
  const articles: Article[] = [];
  const avgNettoPerArticle = order.gesamtNetto / order.artikelanzahl;
  // Convert nr to number for seed calculation (handle string values like "1-0")
  const nrValue = typeof order.nr === 'string' ? parseInt(order.nr.split('-')[0]) || 0 : order.nr;
  const seed = nrValue * 1000 + order.artikelanzahl; // Use order number for consistency
  
  // Generate prices for all articles except the last one
  let remainingNetto = order.gesamtNetto;
  
  for (let i = 0; i < order.artikelanzahl; i++) {
    let nettoPrice: number;
    
    if (i === order.artikelanzahl - 1) {
      // Last article gets the remaining amount to ensure exact total
      nettoPrice = remainingNetto;
    } else {
      // Create varied prices but keep total close to gesamtNetto
      const variation = (seededRandom(seed + i) - 0.5) * 0.3; // ±15% variation
      nettoPrice = avgNettoPerArticle * (1 + variation);
      nettoPrice = Math.round(nettoPrice * 100) / 100;
      remainingNetto -= nettoPrice;
    }
    
    const bruttoPrice = Math.round(nettoPrice * (1 + order.mwstSatz / 100) * 100) / 100;
    
    // Use order number to determine which articles to show for consistency
    const articleIndex = (seed + i) % exampleArticles.length;
    
    // Generate quantity (1-5) based on seed for consistency
    const anzahl = Math.floor(seededRandom(seed + i + 1000) * 5) + 1;
    
    articles.push({
      artikel: exampleArticles[articleIndex],
      anzahl: anzahl,
      preisNetto: nettoPrice,
      preisBrutto: bruttoPrice,
    });
  }
  
  return articles;
}

// Sample data - now loaded from CSV files
// @ts-expect-error - Sample data kept for reference, not used in production
const _orders: Order[] = [
  {
    nr: 1,
    kaufdatum: "2025-11-01",
    bestellnummer: "7293846150",
    info: "Eilauftrag",
    kundeAdresse: "Max Müller, Hauptstr. 12, 10115 Berlin",
    email: "max.mueller@example.com",
    telefonnummer: "+49 30 12345678",
    artikelanzahl: 3,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: "2025-11-02",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-11-02",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-03",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-11-01",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: "14-0",
    kaufdatum: "2025-11-02",
    bestellnummer: "1847293651",
    info: "",
    kundeAdresse: "Anna Schmidt, Berliner Str. 45, 20095 Hamburg",
    email: "anna.schmidt@example.com",
    telefonnummer: "+49 40 23456789",
    artikelanzahl: 1,
    gesamtNetto: 42.02,
    mwstSatz: 19,
    gesamtBrutto: 50.00,
    bezahltAm: "2025-11-02",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-11-03",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-04",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-11-02",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: 2,
    kaufdatum: "2025-11-05",
    bestellnummer: "3958274612",
    info: "Geschenkverpackung",
    kundeAdresse: "Peter Weber, Marktplatz 8, 80331 München",
    email: "peter.weber@example.com",
    telefonnummer: "+49 89 34567890",
    artikelanzahl: 5,
    gesamtNetto: 210.08,
    mwstSatz: 19,
    gesamtBrutto: 250.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-11-05",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 3,
    kaufdatum: "2025-11-08",
    bestellnummer: "8472936150",
    info: "",
    kundeAdresse: "Sophie Fischer, Rheinstr. 22, 50667 Köln",
    email: "sophie.fischer@example.com",
    telefonnummer: "+49 221 45678901",
    artikelanzahl: 2,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-11-09",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-11-09",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-10",
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-11-08",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: "16-0",
    kaufdatum: "2025-11-10",
    bestellnummer: "6193847251",
    info: "Retourenfall",
    kundeAdresse: "Thomas Bauer, Schillerstr. 15, 60313 Frankfurt",
    email: "thomas.bauer@example.com",
    telefonnummer: "+49 69 56789012",
    artikelanzahl: 4,
    gesamtNetto: 336.13,
    mwstSatz: 19,
    gesamtBrutto: 400.00,
    bezahltAm: "2025-11-10",
    statusRechnungsversand: "fehler",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "UPS",
    versandverpackung: "Karton XL",
    versandtGemeldet: null,
    statusVersanddokumente: "fehler",
    versanddatum: null,
    versandBrutto: 8.99,
    versandNetto: 7.55,
    importdatum: "2025-11-10",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  // September Sendungen
  {
    nr: "23-0",
    kaufdatum: "2025-09-03",
    bestellnummer: "8475629384",
    info: "Eilauftrag",
    kundeAdresse: "Robert Koch, Königsallee 12, 40212 Düsseldorf",
    email: "robert.koch@example.com",
    telefonnummer: "+49 211 67890123",
    artikelanzahl: 5,
    gesamtNetto: 210.08,
    mwstSatz: 19,
    gesamtBrutto: 250.00,
    bezahltAm: "2025-09-03",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: "2025-09-04",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-05",
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-09-03",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "24-0",
    kaufdatum: "2025-09-09",
    bestellnummer: "9562938475",
    info: "",
    kundeAdresse: "Laura Meyer, Schillerstr. 8, 70173 Stuttgart",
    email: "laura.meyer@example.com",
    telefonnummer: "+49 711 23456789",
    artikelanzahl: 1,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: "2025-09-09",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-09-10",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-11",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-09-09",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "25-0",
    kaufdatum: "2025-09-15",
    bestellnummer: "1629384756",
    info: "Retourenfall",
    kundeAdresse: "Markus Fischer, Hauptstr. 33, 20095 Hamburg",
    email: "markus.fischer@example.com",
    telefonnummer: "+49 40 34567890",
    artikelanzahl: 3,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: "2025-09-15",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-09-16",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-17",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-09-15",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "26-0",
    kaufdatum: "2025-09-21",
    bestellnummer: "2738475629",
    info: "",
    kundeAdresse: "Stephanie Wolf, Bahnhofstr. 56, 80331 München",
    email: "stephanie.wolf@example.com",
    telefonnummer: "+49 89 45678901",
    artikelanzahl: 4,
    gesamtNetto: 252.10,
    mwstSatz: 19,
    gesamtBrutto: 300.00,
    bezahltAm: "2025-09-21",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton XL",
    versandtGemeldet: "2025-09-22",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-23",
    versandBrutto: 7.99,
    versandNetto: 6.71,
    importdatum: "2025-09-21",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "27-0",
    kaufdatum: "2025-09-27",
    bestellnummer: "3847562938",
    info: "Express",
    kundeAdresse: "Christian Bauer, Rheinstr. 89, 50667 Köln",
    email: "christian.bauer@example.com",
    telefonnummer: "+49 221 56789012",
    artikelanzahl: 2,
    gesamtNetto: 105.04,
    mwstSatz: 19,
    gesamtBrutto: 125.00,
    bezahltAm: "2025-09-27",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "UPS",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-09-28",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-29",
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-09-27",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  // October Sendungen
  {
    nr: "29-0",
    kaufdatum: "2025-10-08",
    bestellnummer: "5629384756",
    info: "Geschenkverpackung",
    kundeAdresse: "Alexander Klein, Zeil 12, 40212 Düsseldorf",
    email: "alexander.klein@example.com",
    telefonnummer: "+49 211 78901234",
    artikelanzahl: 5,
    gesamtNetto: 294.12,
    mwstSatz: 19,
    gesamtBrutto: 350.00,
    bezahltAm: "2025-10-08",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: "2025-10-09",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-10",
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-10-08",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "30-0",
    kaufdatum: "2025-10-14",
    bestellnummer: "6293847562",
    info: "",
    kundeAdresse: "Sabine Hoffmann, Schillerstr. 45, 70173 Stuttgart",
    email: "sabine.hoffmann@example.com",
    telefonnummer: "+49 711 34567890",
    artikelanzahl: 3,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: "2025-10-14",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-10-15",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-16",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-10-14",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "31-0",
    kaufdatum: "2025-10-20",
    bestellnummer: "7384756293",
    info: "Eilauftrag",
    kundeAdresse: "Thomas Becker, Hauptstr. 78, 20095 Hamburg",
    email: "thomas.becker@example.com",
    telefonnummer: "+49 40 45678901",
    artikelanzahl: 4,
    gesamtNetto: 252.10,
    mwstSatz: 19,
    gesamtBrutto: 300.00,
    bezahltAm: "2025-10-20",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton XL",
    versandtGemeldet: "2025-10-21",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-22",
    versandBrutto: 7.99,
    versandNetto: 6.71,
    importdatum: "2025-10-20",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "32-0",
    kaufdatum: "2025-10-26",
    bestellnummer: "8475629384",
    info: "",
    kundeAdresse: "Petra Schulz, Bahnhofstr. 67, 80331 München",
    email: "petra.schulz@example.com",
    telefonnummer: "+49 89 56789012",
    artikelanzahl: 2,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-10-26",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "UPS",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-10-27",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-28",
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-10-26",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  // Additional Sendungen entries
  {
    nr: "38-0",
    kaufdatum: "2025-10-31",
    bestellnummer: "6283746592",
    info: "Express",
    kundeAdresse: "Lisa Hoffmann, Hauptstr. 56, 70173 Stuttgart",
    email: "lisa.hoffmann@example.com",
    telefonnummer: "+49 711 66666666",
    artikelanzahl: 1,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: "2025-10-31",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-11-01",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-02",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-10-31",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "40-0",
    kaufdatum: "2025-11-12",
    bestellnummer: "8475928374",
    info: "Retourenfall",
    kundeAdresse: "Sandra Becker, Schillerstr. 67, 20095 Hamburg",
    email: "sandra.becker@example.com",
    telefonnummer: "+49 40 88888888",
    artikelanzahl: 3,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: "2025-11-12",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-11-13",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-14",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-11-12",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "41-0",
    kaufdatum: "2025-11-18",
    bestellnummer: "9562837465",
    info: "",
    kundeAdresse: "Thomas Klein, Maximilianstr. 45, 80539 München",
    email: "thomas.klein@example.com",
    telefonnummer: "+49 89 99999999",
    artikelanzahl: 2,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-11-18",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-11-19",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-20",
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-11-18",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "43-0",
    kaufdatum: "2025-12-01",
    bestellnummer: "2738495061",
    info: "",
    kundeAdresse: "Michael Schulz, Bahnhofstr. 34, 60313 Frankfurt",
    email: "michael.schulz@example.com",
    telefonnummer: "+49 69 20202020",
    artikelanzahl: 1,
    gesamtNetto: 42.02,
    mwstSatz: 19,
    gesamtBrutto: 50.00,
    bezahltAm: "2025-12-01",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-12-02",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-12-03",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-12-01",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "44-0",
    kaufdatum: "2025-12-05",
    bestellnummer: "3849506172",
    info: "Geschenkverpackung",
    kundeAdresse: "Anna Fischer, Hohe Str. 12, 20095 Hamburg",
    email: "anna.fischer@example.com",
    telefonnummer: "+49 40 30303030",
    artikelanzahl: 3,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: "2025-12-05",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: "2025-12-06",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-12-07",
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-12-05",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
  {
    nr: "45-0",
    kaufdatum: "2025-12-10",
    bestellnummer: "4950617283",
    info: "Eilauftrag",
    kundeAdresse: "Peter Weber, Marienplatz 23, 80331 München",
    email: "peter.weber@example.com",
    telefonnummer: "+49 89 40404040",
    artikelanzahl: 5,
    gesamtNetto: 210.08,
    mwstSatz: 19,
    gesamtBrutto: 250.00,
    bezahltAm: "2025-12-10",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton XL",
    versandtGemeldet: "2025-12-11",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-12-12",
    versandBrutto: 7.99,
    versandNetto: 6.71,
    importdatum: "2025-12-10",
    importquelle: "Amazon API",
    type: "Versandvorgang",
  },
];

// Additional rows for table 1 only
// @ts-expect-error - Sample data kept for reference, not used in production
const _table1AdditionalRows: Order[] = [
  {
    nr: 4,
    kaufdatum: "2025-11-12",
    bestellnummer: "2938475612",
    info: "Express",
    kundeAdresse: "Lisa Wagner, Königsallee 33, 40212 Düsseldorf",
    email: "lisa.wagner@example.com",
    telefonnummer: "+49 211 67890123",
    artikelanzahl: 2,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: "2025-11-13",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-11-13",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-11-14",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-11-12",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 5,
    kaufdatum: "2025-11-15",
    bestellnummer: "7482936150",
    info: "",
    kundeAdresse: "Michael Koch, Hauptbahnhofstr. 5, 70173 Stuttgart",
    email: "michael.koch@example.com",
    telefonnummer: "+49 711 78901234",
    artikelanzahl: 4,
    gesamtNetto: 252.10,
    mwstSatz: 19,
    gesamtBrutto: 300.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton L",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-11-15",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  // August rows (3 rows)
  {
    nr: 6,
    kaufdatum: "2025-08-15",
    bestellnummer: "8472936151",
    info: "",
    kundeAdresse: "Sarah Klein, Musterstr. 10, 10115 Berlin",
    email: "sarah.klein@example.com",
    telefonnummer: "+49 30 11111111",
    artikelanzahl: 2,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: "2025-08-16",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-08-16",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-08-17",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-08-15",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 7,
    kaufdatum: "2025-08-20",
    bestellnummer: "2938475613",
    info: "Express",
    kundeAdresse: "Thomas Müller, Hauptstr. 5, 20095 Hamburg",
    email: "thomas.mueller@example.com",
    telefonnummer: "+49 40 22222222",
    artikelanzahl: 3,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-08-21",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton L",
    versandtGemeldet: "2025-08-21",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-08-22",
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-08-20",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 8,
    kaufdatum: "2025-08-25",
    bestellnummer: "7482936151",
    info: "",
    kundeAdresse: "Julia Schmidt, Marktplatz 12, 80331 München",
    email: "julia.schmidt@example.com",
    telefonnummer: "+49 89 33333333",
    artikelanzahl: 1,
    gesamtNetto: 42.02,
    mwstSatz: 19,
    gesamtBrutto: 50.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-08-25",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  // September rows (6 rows)
  {
    nr: 9,
    kaufdatum: "2025-09-01",
    bestellnummer: "6193847252",
    info: "",
    kundeAdresse: "Markus Weber, Rheinstr. 8, 50667 Köln",
    email: "markus.weber@example.com",
    telefonnummer: "+49 221 44444444",
    artikelanzahl: 4,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: "2025-09-02",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-09-02",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-03",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-09-01",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 10,
    kaufdatum: "2025-09-05",
    bestellnummer: "2938475614",
    info: "Geschenkverpackung",
    kundeAdresse: "Nicole Fischer, Schillerstr. 20, 60313 Frankfurt",
    email: "nicole.fischer@example.com",
    telefonnummer: "+49 69 55555555",
    artikelanzahl: 2,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: "2025-09-06",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-09-06",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-07",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-09-05",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 11,
    kaufdatum: "2025-09-10",
    bestellnummer: "8472936152",
    info: "",
    kundeAdresse: "Daniel Bauer, Königsallee 15, 40212 Düsseldorf",
    email: "daniel.bauer@example.com",
    telefonnummer: "+49 211 66666666",
    artikelanzahl: 5,
    gesamtNetto: 210.08,
    mwstSatz: 19,
    gesamtBrutto: 250.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-09-10",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 12,
    kaufdatum: "2025-09-15",
    bestellnummer: "1847293652",
    info: "Eilauftrag",
    kundeAdresse: "Stephanie Wagner, Hauptbahnhofstr. 8, 70173 Stuttgart",
    email: "stephanie.wagner@example.com",
    telefonnummer: "+49 711 77777777",
    artikelanzahl: 3,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-09-16",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "UPS",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-09-16",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-17",
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-09-15",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 13,
    kaufdatum: "2025-09-20",
    bestellnummer: "3958274613",
    info: "",
    kundeAdresse: "Andreas Koch, Berliner Str. 30, 20095 Hamburg",
    email: "andreas.koch@example.com",
    telefonnummer: "+49 40 88888888",
    artikelanzahl: 1,
    gesamtNetto: 42.02,
    mwstSatz: 19,
    gesamtBrutto: 50.00,
    bezahltAm: "2025-09-21",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-09-21",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-09-22",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-09-20",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 14,
    kaufdatum: "2025-09-25",
    bestellnummer: "7293846151",
    info: "",
    kundeAdresse: "Christina Meyer, Marktplatz 3, 80331 München",
    email: "christina.meyer@example.com",
    telefonnummer: "+49 89 99999999",
    artikelanzahl: 4,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-09-25",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  // October rows (4 rows)
  {
    nr: 15,
    kaufdatum: "2025-10-01",
    bestellnummer: "2938475615",
    info: "",
    kundeAdresse: "Martin Schulz, Hauptstr. 25, 10115 Berlin",
    email: "martin.schulz@example.com",
    telefonnummer: "+49 30 10101010",
    artikelanzahl: 2,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: "2025-10-02",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-10-02",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-03",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-10-01",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 16,
    kaufdatum: "2025-10-05",
    bestellnummer: "7482936152",
    info: "Express",
    kundeAdresse: "Laura Hoffmann, Rheinstr. 18, 50667 Köln",
    email: "laura.hoffmann@example.com",
    telefonnummer: "+49 221 20202020",
    artikelanzahl: 3,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-10-06",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-10-06",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-07",
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-10-05",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 17,
    kaufdatum: "2025-10-10",
    bestellnummer: "6193847253",
    info: "",
    kundeAdresse: "Sebastian Richter, Schillerstr. 25, 60313 Frankfurt",
    email: "sebastian.richter@example.com",
    telefonnummer: "+49 69 30303030",
    artikelanzahl: 5,
    gesamtNetto: 210.08,
    mwstSatz: 19,
    gesamtBrutto: 250.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-10-10",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 18,
    kaufdatum: "2025-10-15",
    bestellnummer: "8472936153",
    info: "",
    kundeAdresse: "Melanie Zimmermann, Königsallee 22, 40212 Düsseldorf",
    email: "melanie.zimmermann@example.com",
    telefonnummer: "+49 211 40404040",
    artikelanzahl: 1,
    gesamtNetto: 42.02,
    mwstSatz: 19,
    gesamtBrutto: 50.00,
    bezahltAm: "2025-10-16",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-10-16",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-10-17",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-10-15",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  // December rows (5 rows) - Importdatum 09.12.2025
  {
    nr: 19,
    kaufdatum: "2025-12-05",
    bestellnummer: "1928374651",
    info: "",
    kundeAdresse: "Alexander Becker, Hauptstr. 45, 10115 Berlin",
    email: "alexander.becker@example.com",
    telefonnummer: "+49 30 11112222",
    artikelanzahl: 3,
    gesamtNetto: 126.05,
    mwstSatz: 19,
    gesamtBrutto: 150.00,
    bezahltAm: "2025-12-06",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton M",
    versandtGemeldet: "2025-12-06",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-12-07",
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-12-09",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 20,
    kaufdatum: "2025-12-06",
    bestellnummer: "2938475620",
    info: "Express",
    kundeAdresse: "Sabrina Wagner, Mönckebergstr. 25, 20095 Hamburg",
    email: "sabrina.wagner@example.com",
    telefonnummer: "+49 40 22223333",
    artikelanzahl: 2,
    gesamtNetto: 84.03,
    mwstSatz: 19,
    gesamtBrutto: 100.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "DPD",
    versandverpackung: "Karton M",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 5.99,
    versandNetto: 5.03,
    importdatum: "2025-12-09",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 21,
    kaufdatum: "2025-12-07",
    bestellnummer: "3847562931",
    info: "Geschenkverpackung",
    kundeAdresse: "Felix Hoffmann, Marienplatz 15, 80331 München",
    email: "felix.hoffmann@example.com",
    telefonnummer: "+49 89 33334444",
    artikelanzahl: 5,
    gesamtNetto: 210.08,
    mwstSatz: 19,
    gesamtBrutto: 250.00,
    bezahltAm: "2025-12-08",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "DHL National",
    versanddienstleister: "DHL",
    versandverpackung: "Karton L",
    versandtGemeldet: "2025-12-08",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-12-09",
    versandBrutto: 6.99,
    versandNetto: 5.87,
    importdatum: "2025-12-09",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 22,
    kaufdatum: "2025-12-08",
    bestellnummer: "4756293842",
    info: "",
    kundeAdresse: "Nina Schneider, Schadowstr. 30, 40212 Düsseldorf",
    email: "nina.schneider@example.com",
    telefonnummer: "+49 211 44445555",
    artikelanzahl: 1,
    gesamtNetto: 42.02,
    mwstSatz: 19,
    gesamtBrutto: 50.00,
    bezahltAm: "2025-12-09",
    statusRechnungsversand: "versendet",
    versandland: "DE",
    versandprofil: "–",
    versanddienstleister: "Hermes",
    versandverpackung: "Karton S",
    versandtGemeldet: "2025-12-09",
    statusVersanddokumente: "erstellt",
    versanddatum: "2025-12-10",
    versandBrutto: 4.99,
    versandNetto: 4.19,
    importdatum: "2025-12-09",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
  {
    nr: 23,
    kaufdatum: "2025-12-09",
    bestellnummer: "5629384753",
    info: "Eilauftrag",
    kundeAdresse: "Oliver Fischer, Zeil 55, 60313 Frankfurt",
    email: "oliver.fischer@example.com",
    telefonnummer: "+49 69 55556666",
    artikelanzahl: 4,
    gesamtNetto: 168.07,
    mwstSatz: 19,
    gesamtBrutto: 200.00,
    bezahltAm: null,
    statusRechnungsversand: "ausstehend",
    versandland: "DE",
    versandprofil: "DPD International",
    versanddienstleister: "UPS",
    versandverpackung: "Karton M",
    versandtGemeldet: null,
    statusVersanddokumente: "ausstehend",
    versanddatum: null,
    versandBrutto: 5.49,
    versandNetto: 4.61,
    importdatum: "2025-12-09",
    importquelle: "Amazon API",
    type: "Bestellung",
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    versendet: "bg-lime-600 text-background",
    erstellt: "bg-sidebar-accent-foreground text-background",
    ausstehend: "!border !border-border text-foreground bg-transparent",
    fehler: "bg-destructive text-background",
  };

  const labels: Record<string, string> = {
    versendet: "Versendet",
    erstellt: "Erstellt",
    ausstehend: "Ausstehend",
    fehler: "Fehler",
  };

  if (status === "versendet") {
    return (
      <span className="inline-flex items-center gap-2">
        <Check className="size-4" />
        <span className="font-normal text-sm">{labels[status]}</span>
      </span>
    );
  }

  if (status === "erstellt") {
    return (
      <span className="inline-flex items-center gap-2">
        <Check className="size-4" />
        <span className="font-normal text-sm">{labels[status]}</span>
      </span>
    );
  }

  if (status === "fehler") {
    return (
      <span className="inline-flex items-center gap-2">
        <AlertTriangle className="size-4 text-destructive" />
        <span className="font-normal text-sm">{labels[status]}</span>
      </span>
    );
  }

  if (status === "ausstehend") {
    return <span className="font-normal">–</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

// Format currency in EUR
function formatEUR(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Format date in German format (dd.mm.yyyy)
function formatDate(dateStr: string | null) {
  if (!dateStr) return "–";
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Define columns function that takes activeTab and options
const getColumns = (
  activeTab: string,
  versandverpackungOptions: string[],
  onVerpackungChange: (row: Order, newValue: string) => void,
  versandprofilOptions: string[],
  onProfilChange: (row: Order, newValue: string) => void,
  versanddienstleisterOptions: string[],
  onDienstleisterChange: (row: Order, newValue: string) => void,
  tableId: string = "default",
  isRowMarked?: (row: Order) => boolean,
  _fehlerRowNr?: number | null,
  _totalRowCount?: number,
  _temporaryVisibleIcons?: Map<string, number>,
  checklistMap: Map<number, import("@/lib/csvParser").ChecklistData> = new Map(),
  onChecklistChange?: (rowNr: number, field: keyof import("@/lib/csvParser").ChecklistData, value: boolean) => void,
  animatedButton?: { rowNr: number; field: string; tableId: string; timestamp: number } | null
): ColumnDef<Order>[] => {
  // Get tooltip text for floating column
  const getFloatingColTooltip = (colId: string): string => {
    const columnLabels = tableId === "rechnung" ? columnLabels1 : columnLabels2;
    return columnLabels[colId] || "";
  };

  // Custom select column that shows icons when unchecked
  const customSelectColumn: ColumnDef<Order> = {
    id: "select",
    size: 48,
    minSize: 48,
    maxSize: 48,
    meta: {
      className: "!p-0 !px-0 !py-0 !text-center !align-middle",
    },
    header: () => (
      <div className="min-h-[44px] flex items-center justify-center">
      </div>
    ),
    cell: ({ row }) => {
      const rowType = (row.original as any)?.type;
      const shouldHide = activeTab === "rechnung" && rowType === "Versandvorgang";
      
      if (shouldHide) {
        return <div />;
      }
      
      const isSelected = row.getIsSelected();
      const isMarked = isRowMarked ? isRowMarked(row.original) : false;
      const isChecked = isSelected || isMarked;
      
      // If checked or marked, show checkbox
      if (isChecked) {
        return (
          <div className="flex items-center justify-center">
            <Checkbox 
              checked={true} 
              onCheckedChange={(checked) => {
                row.toggleSelected(checked === true);
              }}
            />
          </div>
        );
      }
      
      // If unchecked, show icon with click handler
      // Determine icon to show (Package or CreditCard based on tab and type)
      const type = row.original.type;
      let icon = null;
      if (activeTab === "versand") {
        // In Sendungen table, check "Versendet" status first
        const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
        const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
        const versendet = checklistData?.versendet ?? false;
        
        // If Versendet is TRUE, always show PackageCheck
        if (versendet) {
          icon = <PackageCheck className="size-4" />;
        } else {
          // Otherwise, check "Paketlabel erstellt" status
          const paketlabelErstellt = checklistData?.paketlisteErstellt ?? false;
          // Show PackageOpen when unchecked/false, Package when checked/true
          icon = paketlabelErstellt ? <Package className="size-4" /> : <PackageOpen className="size-4" />;
        }
      } else {
        icon = type === "Bestellung" ? <CreditCard className="size-4" /> : null;
      }
      
      return (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            row.toggleSelected(true);
          }} 
          className="flex items-center justify-center cursor-pointer"
        >
          {icon}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  };

  const baseColumns: ColumnDef<Order>[] = [
    customSelectColumn,
    {
      accessorKey: "nr",
      size: 100,
      minSize: 100,
      maxSize: 100,
      meta: {
        className: "!p-0 !px-0 !py-0 !text-center !align-middle",
      },
      header: ({ column }) => (
        <div className="flex items-center justify-center h-full w-full min-h-[44px]">
          <DataTableColumnHeader column={column} title="Nr" />
        </div>
      ),
      cell: ({ row }) => {
        // Show the original nr value for all tables
        return (
          <div className="flex items-center justify-center h-full w-full">
            <span>{row.getValue("nr")}</span>
          </div>
        );
      },
      // Custom sorting function - sort by nr for all tables
      sortingFn: (rowA: any, rowB: any) => {
        const a = rowA.original?.nr;
        const b = rowB.original?.nr;
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }
        if (typeof a === "string" && typeof b === "string") {
          // Try to parse as numbers for comparison
          const aNum = parseInt(a);
          const bNum = parseInt(b);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
          }
          return a.localeCompare(b);
        }
        // Handle mixed types
        const aNum = typeof a === "number" ? a : parseInt(String(a)) || 0;
        const bNum = typeof b === "number" ? b : parseInt(String(b)) || 0;
        return aNum - bNum;
      },
    },
    {
      accessorKey: "bestellnummer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={activeTab === "versand" ? "Sendungs-\nnummer" : "Bestell-\nnummer"} />
      ),
      cell: ({ row }) => {
        if (activeTab === "versand") {
          const sendungsnummer = row.original.sendungsnummer;
          return (
            <span>{sendungsnummer || row.getValue("bestellnummer")}</span>
          );
        }
        return (
          <span>{row.getValue("bestellnummer")}</span>
        );
      },
    },
  ];

  // Only add importdatum column if not in versand tab
  if (activeTab !== "versand") {
    baseColumns.push({
      accessorKey: "importdatum",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Import-\ndatum" />
      ),
      cell: ({ row }) => formatDate(row.getValue("importdatum")),
    });
  }

  const additionalColumns: ColumnDef<Order>[] = [];

  // Only add importquelle and kaufdatum columns if not in versand tab
  if (activeTab !== "versand") {
    additionalColumns.push(
      {
        accessorKey: "importquelle",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Import-\nquelle" />
        ),
        cell: ({ row }) => (
          <span>{row.getValue("importquelle")}</span>
        ),
      },
      {
        accessorKey: "kaufdatum",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kauf-\ndatum" />
        ),
        cell: ({ row }) => {
          const type = row.original.type;
          return type === "Versandvorgang" ? "" : formatDate(row.getValue("kaufdatum"));
        },
        size: 120,
        minSize: 120,
        maxSize: 120,
      }
    );
  }

  // Only add statusVersanddokumente column if not in versand tab
  const versanddokumenteColumn: ColumnDef<Order>[] = [];
  if (activeTab !== "versand") {
    versanddokumenteColumn.push({
      accessorKey: "statusVersanddokumente",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Versand-\ndokumente" />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("statusVersanddokumente")} />
      ),
      meta: {
        className: "px-4",
      },
    });
  }

  const restColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "kundeAdresse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kunde/\nLieferadresse" />
    ),
    cell: ({ row }) => {
      return (
      <span className="text-sm max-w-[200px] truncate block" title={row.getValue("kundeAdresse")}>
        {row.getValue("kundeAdresse")}
      </span>
      );
    },
    size: 260,
    minSize: 260,
    maxSize: 260,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-Mail" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("email")}</span>
    ),
    size: 260,
    minSize: 260,
    maxSize: 260,
  },
  {
    accessorKey: "telefonnummer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefon-\nnummer" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("telefonnummer")}</span>
    ),
  },
  {
    accessorKey: "artikelanzahl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Artikel-\nanzahl" />
    ),
    cell: ({ row }) => {
      return (
      <span className="text-center block">{row.getValue("artikelanzahl")}</span>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  ...(activeTab === "versand" ? [
    {
      accessorKey: "versandNetto",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Versand\nNetto" />
      ),
      cell: ({ row }: { row: any }) => (
        <span className="text-right block">{formatEUR(row.getValue("versandNetto"))}</span>
      ),
      size: 90,
      minSize: 90,
      maxSize: 90,
    },
    {
      accessorKey: "versandBrutto",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Versand\nBrutto" />
      ),
      cell: ({ row }: { row: any }) => (
        <span className="text-right block">{formatEUR(row.getValue("versandBrutto"))}</span>
      ),
      size: 90,
      minSize: 90,
      maxSize: 90,
    },
  ] : []),
  // Only add gesamtNetto and mwstSatz columns if not in versand tab
  ...(activeTab !== "versand" ? [
    {
      accessorKey: "gesamtNetto",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Gesamt\nNetto" />
      ),
      cell: ({ row }: { row: any }) => {
        const type = row.original.type;
        if (type === "Versandvorgang") return "";
        return (
        <span className="text-right block">{formatEUR(row.getValue("gesamtNetto"))}</span>
        );
      },
    },
    {
      accessorKey: "mwstSatz",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="MwSt.\nSatz" />
      ),
      cell: ({ row }: { row: any }) => {
        const type = row.original.type;
        if (type === "Versandvorgang") return "";
        return (
        <span className="text-center block">{row.getValue("mwstSatz")}%</span>
        );
      },
    },
  ] : []),
  // Only add gesamtBrutto column if not in versand tab
  ...(activeTab !== "versand" ? [
    {
      accessorKey: "gesamtBrutto",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Gesamt\nBrutto" />
      ),
      cell: ({ row }: { row: any }) => {
        const type = row.original.type;
        if (type === "Versandvorgang") return "";
        return (
        <span className="text-right block">{formatEUR(row.getValue("gesamtBrutto"))}</span>
        );
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
  ] : []),
  // Only add bezahltAm column if not in versand tab
  ...(activeTab !== "versand" ? [
    {
      accessorKey: "bezahltAm",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Bezahlt\nam" />
      ),
      cell: ({ row }: { row: any }) => {
        const type = row.original.type;
        if (type === "Versandvorgang") return "";
        return formatDate(row.getValue("bezahltAm"));
      },
      size: 140,
      minSize: 140,
      maxSize: 140,
    },
  ] : []),
  {
    accessorKey: "versandland",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\nland" />
    ),
    cell: ({ row }) => (
      <span>{row.getValue("versandland")}</span>
    ),
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "info",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Info" />
    ),
    size: 180,
    minSize: 180,
    maxSize: 180,
  },
  {
    accessorKey: "versandprofil",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versandprofil" />
    ),
    cell: ({ row }) => {
      const profil = row.getValue("versandprofil") as string;
      return (
        <div className="flex items-center gap-1">
          <span>{profil || "-"}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto w-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
              {versandprofilOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProfilChange(row.original, option);
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: activeTab === "versand" ? 160 : 200,
    minSize: activeTab === "versand" ? 160 : 200,
    maxSize: activeTab === "versand" ? 160 : 200,
  },
  {
    accessorKey: "versanddienstleister",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\ndienstleister" />
    ),
    cell: ({ row }) => {
      const dienstleister = row.getValue("versanddienstleister") as string;
      return (
        <div className="flex items-center gap-1">
          <span>{dienstleister}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto w-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
              {versanddienstleisterOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDienstleisterChange(row.original, option);
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "versandverpackung",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\nverpackung" />
    ),
    cell: ({ row }) => {
      const verpackung = row.getValue("versandverpackung") as string;
      return (
        <div className="flex items-center gap-1">
          <span>{verpackung}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto w-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
              {versandverpackungOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerpackungChange(row.original, option);
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "versandtGemeldet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versandt\ngemeldet" />
    ),
    cell: ({ row }) => formatDate(row.getValue("versandtGemeldet")),
  },
  {
    accessorKey: "versanddatum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\ndatum" />
    ),
    cell: ({ row }) => formatDate(row.getValue("versanddatum")),
  },
  ...(activeTab === "versand" ? [
    {
      accessorKey: "trackingnummer",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Tracking-\nnummer" />
      ),
      cell: ({ row }: { row: any }) => (
        <span className="text-sm">{row.getValue("trackingnummer") || ""}</span>
      ),
      size: 150,
      minSize: 150,
      maxSize: 150,
    },
  ] : []),
  ];

  // Floating columns - ordered from leftmost to rightmost in DOM so they appear right to left visually
  // Order in array: leftmost (right-[300px]) to rightmost (right-0)
  const floatingColumns: ColumnDef<Order>[] = [
  {
    id: `floating-col-9-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Mail className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-9-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.rechnungVersendet ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'rechnungVersendet', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-rechnungVersendet-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'rechnungVersendet' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'rechnungVersendet' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[300px] z-[11] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-7-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Package className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-7-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.sendungErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'sendungErstellt', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-sendungErstellt-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'sendungErstellt' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'sendungErstellt' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[250px] z-[12] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-8-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Settings2 className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-8-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.versandprofilHinzugefuegt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'versandprofilHinzugefuegt', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-versandprofilHinzugefuegt-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'versandprofilHinzugefuegt' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'versandprofilHinzugefuegt' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[200px] z-[13] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-5-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <QrCode className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-5-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.paketlisteErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'paketlisteErstellt', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-paketlisteErstellt-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'paketlisteErstellt' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'paketlisteErstellt' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[150px] z-[14] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-6-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ClipboardList className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-6-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.picklisteErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'picklisteErstellt', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-picklisteErstellt-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'picklisteErstellt' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'picklisteErstellt' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[100px] z-[15] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-4-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ListChecks className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-4-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.packlisteErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'packlisteErstellt', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-packlisteErstellt-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'packlisteErstellt' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'packlisteErstellt' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[50px] z-[16] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-3-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Truck className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-3-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.versendet ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="link"
            className="h-8 w-8 p-0 hover:border hover:border-border rounded-md"
            onClick={() => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'versendet', !isChecked);
              }
            }}
          >
            <Check key={`${rowNr}-versendet-${isChecked}-${animatedButton?.rowNr === rowNr && animatedButton?.field === 'versendet' && animatedButton?.tableId === tableId ? animatedButton.timestamp : ''}`} className={`size-4 transition-all duration-200 ${isChecked ? 'text-foreground hover:text-muted-foreground/50' : 'opacity-0 hover:opacity-100 hover:text-muted-foreground/50'} ${animatedButton?.rowNr === rowNr && animatedButton?.field === 'versendet' && animatedButton?.tableId === tableId ? 'animate-scale-up' : ''}`} />
          </Button>
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[50px] z-[16] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-2-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <AlertTriangle className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {getFloatingColTooltip(`floating-col-2-${tableId}`)}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const hasError = checklistData?.fehler ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          {hasError && (
            <AlertTriangle className="size-4 text-destructive" />
          )}
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-0 z-[17] !border-l !border-t-0 !border-b-0 !border-r-0 !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background will-change-[transform]",
    },
    enableHiding: true,
  },
  ];

  return [
    ...baseColumns,
    ...additionalColumns,
    ...restColumns,
    ...floatingColumns,
  ];
};

// Column labels for filter and visibility dropdowns - Table 1 (Bestellungen)
const columnLabels1: Record<string, string> = {
  nr: "Nr",
  kaufdatum: "Kaufdatum",
  bestellnummer: "Bestellnummer",
  info: "Info",
  kundeAdresse: "Kunde/Lieferadresse",
  email: "E-Mail",
  telefonnummer: "Telefonnummer",
  artikelanzahl: "Artikelanzahl",
  gesamtNetto: "Gesamt Netto",
  mwstSatz: "MwSt. Satz",
  gesamtBrutto: "Gesamt Brutto",
  bezahltAm: "Bezahlt am",
  versandland: "Versandland",
  versandprofil: "Versandprofil",
  versanddienstleister: "Versanddienstleister",
  versandverpackung: "Versandverpackung",
  versandtGemeldet: "Versandt gemeldet",
  statusVersanddokumente: "Versanddokumente",
  versanddatum: "Versanddatum",
  versandBrutto: "Versand Brutto",
  versandNetto: "Versand Netto",
  importdatum: "Importdatum",
  importquelle: "Importquelle",
  type: "Type",
  "floating-col-2-rechnung": "Fehler",
  "floating-col-3-rechnung": "Versendet",
  "floating-col-4-rechnung": "Packliste erstellt",
  "floating-col-5-rechnung": "Versandlabel erstellt",
  "floating-col-6-rechnung": "Pickliste erstellt",
  "floating-col-7-rechnung": "Sendung erstellt",
  "floating-col-8-rechnung": "Versandprofil hinzugefügt",
  "floating-col-9-rechnung": "Rechnung versendet",
};

// Column labels for filter and visibility dropdowns - Table 2 (Sendungen)
const columnLabels2: Record<string, string> = {
  nr: "Nr",
  kaufdatum: "Kaufdatum",
  bestellnummer: "Sendungsnummer",
  info: "Info",
  kundeAdresse: "Kunde/Lieferadresse",
  email: "E-Mail",
  telefonnummer: "Telefonnummer",
  artikelanzahl: "Artikelanzahl",
  gesamtNetto: "Gesamt Netto",
  mwstSatz: "MwSt. Satz",
  gesamtBrutto: "Gesamt Brutto",
  bezahltAm: "Bezahlt am",
  versandland: "Versandland",
  versandprofil: "Versandprofil",
  versanddienstleister: "Versanddienstleister",
  versandverpackung: "Versandverpackung",
  versandtGemeldet: "Versandt gemeldet",
  statusVersanddokumente: "Versanddokumente",
  versanddatum: "Versanddatum",
  trackingnummer: "Trackingnummer",
  versandBrutto: "Versand Brutto",
  versandNetto: "Versand Netto",
  importdatum: "Importdatum",
  importquelle: "Importquelle",
  type: "Type",
  "floating-col-2-versand": "Fehler",
  "floating-col-3-versand": "Versendet",
  "floating-col-4-versand": "Packliste erstellt",
  "floating-col-5-versand": "Versandlabel erstellt",
  "floating-col-6-versand": "Pickliste erstellt",
  "floating-col-7-versand": "Sendung erstellt",
  "floating-col-8-versand": "Versandprofil hinzugefügt",
  "floating-col-9-versand": "Rechnung versendet",
};

function ShippingPage() {
  const location = useLocation();
  const isShippingActive = location.pathname.includes("/a/shipping") && !location.pathname.includes("/a/shippingprofiles");
  const isShippingProfilesActive = location.pathname.includes("/a/shippingprofiles");

  // Load data from CSV files
  const loadCSVData = React.useCallback(() => {
    try {
      // Parse Bestellungen CSV
      const bestellungenData = parseCSV(bestellungenCSV).map(order => ({
        ...order,
        type: order.type || "Bestellung"
      }));
      
      // Parse Sendungen CSV
      const sendungenData = parseCSV(sendungenCSV).map(order => ({
        ...order,
        type: order.type || "Versandvorgang"
      }));
      
      // Parse Checklisten CSV
      const checklistMap = parseChecklistCSV(checklistenCSV);
      
      return { bestellungenData, sendungenData, checklistMap };
    } catch (error) {
      console.error("Error loading CSV data:", error);
      toast.error("Fehler beim Laden der CSV-Dateien");
      return { bestellungenData: [], sendungenData: [], checklistMap: new Map() };
    }
  }, []);

  // Initialize data from CSV files
  const initialData = React.useMemo(() => loadCSVData(), [loadCSVData]);
  
  // Separate data sources for each table
  const [ordersState1, setOrdersState1] = React.useState<Order[]>(initialData.bestellungenData);
  const [ordersState2, setOrdersState2] = React.useState<Order[]>(initialData.sendungenData);
  const [ordersState] = React.useState<Order[]>(initialData.bestellungenData); // Keep for compatibility with filters
  const [checklistMap, setChecklistMap] = React.useState<Map<number, import("@/lib/csvParser").ChecklistData>>(initialData.checklistMap);
  const [animatedButton, setAnimatedButton] = React.useState<{ rowNr: number; field: string; tableId: string; timestamp: number } | null>(null);
  const [refreshIconRotation, setRefreshIconRotation] = React.useState(0);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedShipment, setSelectedShipment] = React.useState<Order | null>(null);
  const [isSendungSheetOpen, setIsSendungSheetOpen] = React.useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);
  const [sheetWidth, setSheetWidth] = React.useState(1255);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [isUnderSm, setIsUnderSm] = React.useState(false);
  const [responsiveSheetWidth, setResponsiveSheetWidth] = React.useState(1255);

  // Show tips modal shortly after page load
  React.useEffect(() => {
    // Check if user has chosen to not show tips
    const hideTips = localStorage.getItem('hideTips');
    if (hideTips === 'true') {
      return;
    }
    
    // Show modal after a short delay (e.g., 1 second)
    const timer = setTimeout(() => {
      setShowTipsModal(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1024; // lg breakpoint
      setIsSmallScreen(isSmall);
      setIsUnderSm(window.innerWidth < 640); // sm breakpoint
      
      if (isSmall) {
        // On small screens, use full width (100%)
        setResponsiveSheetWidth(window.innerWidth);
      } else {
        // On large screens, apply same constraints as manual resize: min 300px, max 90% of viewport
        const minWidth = 300;
        const maxWidth = window.innerWidth * 0.9;
        // Use the current sheetWidth if it's within constraints, otherwise constrain it
        const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, sheetWidth));
        setResponsiveSheetWidth(constrainedWidth);
        // Also update sheetWidth if it's out of bounds
        if (sheetWidth < minWidth || sheetWidth > maxWidth) {
          setSheetWidth(constrainedWidth);
        }
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sheetWidth]);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [isChecked2, setIsChecked2] = React.useState(false);
  const [isChecked3, setIsChecked3] = React.useState(false);
  const [isChecked4, setIsChecked4] = React.useState(false); // Fehler (Bestellungen)
  const [isChecked12, setIsChecked12] = React.useState(false); // Fehler (Sendungen)
  const [isChecked7, setIsChecked7] = React.useState(false);
  const [isChecked8, setIsChecked8] = React.useState(false); // Keine Pickliste
  const [isChecked10, setIsChecked10] = React.useState(false); // Keine Packliste
  const [isChecked13, setIsChecked13] = React.useState(false); // Kein Versandprofil
  const [isChecked14, setIsChecked14] = React.useState(false); // Kein Versandlabel
  const [visibleKundeAdressenForSendungen, setVisibleKundeAdressenForSendungen] = React.useState<Set<string>>(new Set()); // Track which kundeAdresse values should make Sendungen visible
  const [combineDuplicateAddresses, setCombineDuplicateAddresses] = React.useState<boolean | null>(null); // null = not set, true = combine (show one), false = separate (show both)
  // Separate state for Versandprofile accordion
  const [isChecked9, setIsChecked9] = React.useState(false); // Ohne Versandprofil
  const [isChecked5, setIsChecked5] = React.useState(false);
  const [isChecked6, setIsChecked6] = React.useState(false);
  const [isChecked11, setIsChecked11] = React.useState(false); // UPS USA
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [globalFilter1, setGlobalFilter1] = React.useState(""); // Separate filter for table 1
  const [globalFilter2, setGlobalFilter2] = React.useState(""); // Separate filter for table 2
  const [importquelle, setImportquelle] = React.useState<string>(""); // State for Importquelle
  const [zeilennummern, setZeilennummern] = React.useState("");
  const [kaufdatum, setKaufdatum] = React.useState<DateRange | undefined>(undefined);
  const [importdatum, setImportdatum] = React.useState<DateRange | undefined>(undefined);
  const [steuerland, setSteuerland] = React.useState("");
  const [versanddatum, setVersanddatum] = React.useState<DateRange | undefined>(undefined);
  const [versandland, setVersandland] = React.useState<string>("");
  const [versandzielland, setVersandzielland] = React.useState<string>("");
  const [versandprofil, setVersandprofil] = React.useState<string>("");
  const [versanddienstleister, setVersanddienstleister] = React.useState<string>("");
  const [versandverpackung, setVersandverpackung] = React.useState<string>("");
  // Store history selection per tab
  const [selectedHistoryByTab, setSelectedHistoryByTab] = React.useState<{ rechnung: string; versand: string }>({
    rechnung: "",
    versand: ""
  });
  const [activeTab, setActiveTab] = React.useState<string>("rechnung"); // State for active tab
  
  // Get current history selection based on active tab
  const selectedHistory = selectedHistoryByTab[activeTab as "rechnung" | "versand"] || "";
  // For Select component display, use undefined when empty to show placeholder
  // Only pass value if it's a non-empty string
  const selectedHistoryForDisplay = selectedHistory && selectedHistory.trim() !== "" ? selectedHistory : undefined;
  const [showNoSelectionAlert, setShowNoSelectionAlert] = React.useState(false);
  const [showAddressMatchAlert, setShowAddressMatchAlert] = React.useState(false);
  const [showTipsModal, setShowTipsModal] = React.useState(false);
  const [dontShowTipsAgain, setDontShowTipsAgain] = React.useState(false);
  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);
  
  // Tips content array
  const tips = [
    {
      topline: "Tagestipp",
      headline: "Details per Doppelclick anzeigen",
      bodyText: "Details lassen sich per Doppelklick oder mit der Eingabetaste öffnen und schließen."
    },
    {
      topline: "Tagestipp",
      headline: "Mehrfachauswahl",
      bodyText: "Halten Sie die Shift-Taste (Umschalttaste) gedrückt, um einen zusammenhängenden Bereich von Zeilen zu markieren."
    },
    {
      topline: "Tagestipp",
      headline: "Pfeiltasten verwenden",
      bodyText: "Verwenden Sie die linke und rechte Pfeiltaste, um zwischen den Detailansichten der sichtbaren Einträge zu wechseln."
    },
    {
      topline: "Tagestipp",
      headline: "Status bearbeiten",
      bodyText: "Der Status kann in den Checklisten pro Eintrag manuell angepasst werden."
    },
    {
      topline: "Tagestipp",
      headline: "Sortierung verwenden",
      bodyText: "Durch Klicken auf einen Spaltenheader wird die Sortierung der Einträge geändert."
    }
  ];
  const [addressMatchStep, setAddressMatchStep] = React.useState(-1); // -1 = Progress, 0 = Initial, 1 = Adressdaten, 2 = Versandprofile, 3 = Sendungen erstellt
  const [progressValue, setProgressValue] = React.useState(0);
  const [showSingleRowSendungModal, setShowSingleRowSendungModal] = React.useState(false);
  const [singleRowSendungStep, setSingleRowSendungStep] = React.useState(-1); // -1 = Progress, 0 = Initial, 1 = Adressdaten, 2 = Versandprofile, 3 = Sendung erstellt
  const [singleRowProgressValue, setSingleRowProgressValue] = React.useState(0);
  const [showRechnungErneutVersendenModal, setShowRechnungErneutVersendenModal] = React.useState(false);
  const [showFunktionenBestellungenCommand, setShowFunktionenBestellungenCommand] = React.useState(false);
  const [showFunktionenSendungenCommand, setShowFunktionenSendungenCommand] = React.useState(false);
  const [showNoSendungenModal, setShowNoSendungenModal] = React.useState(false);
  const [noSendungenModalIsSingle, setNoSendungenModalIsSingle] = React.useState(true);
  const [showNoBestellungenModal, setShowNoBestellungenModal] = React.useState(false);
  const [noBestellungenModalIsSingle, setNoBestellungenModalIsSingle] = React.useState(true);

  // Get unique versandland values from orders data
  const versandlandOptions = React.useMemo(() => {
    const uniqueLands = Array.from(new Set(ordersState.map(order => order.versandland))).sort();
    return uniqueLands;
  }, [ordersState]);

  // Get unique versandprofil values from orders data
  const versandprofilOptions = React.useMemo(() => {
    // Use Versandprofile names: DHL National, DPD Europa, UPS USA
    return ["DHL National", "DPD Europa", "UPS USA"];
  }, []);

  // Versanddienstleister options: DHL, DPD, UPS
  const versanddienstleisterOptions = React.useMemo(() => {
    return ["DHL", "DPD", "UPS"];
  }, []);

  // Get unique versandverpackung values from orders data
  const versandverpackungOptions = React.useMemo(() => {
    const uniqueVerpackungen = Array.from(new Set(ordersState.map(order => order.versandverpackung))).sort();
    return uniqueVerpackungen;
  }, [ordersState]);

  // Helper function to parse CSV line
  const parseCSVLine = React.useCallback((line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }, []);

  // Helper function to convert various date formats to dd.mm.yyyy format
  const convertToDDMMYYYY = React.useCallback((dateStr: string): string => {
    if (!dateStr || !dateStr.trim()) return dateStr;
    
    const trimmed = dateStr.trim();
    
    // Handle YYYY-MM-DD format (e.g., 2025-12-21)
    const yyyyParts = trimmed.split('-');
    if (yyyyParts.length === 3 && yyyyParts[0].length === 4) {
      const year = yyyyParts[0];
      const month = yyyyParts[1].padStart(2, '0');
      const day = yyyyParts[2].padStart(2, '0');
      return `${day}.${month}.${year}`;
    }
    
    // Handle M/D/YY format (e.g., 12/21/25)
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = (2000 + parseInt(parts[2])).toString();
      return `${day}.${month}.${year}`;
    }
    
    // If already in dd.mm.yyyy format, return as-is
    const ddmmParts = trimmed.split('.');
    if (ddmmParts.length === 3 && ddmmParts[0].length === 2 && ddmmParts[1].length === 2 && ddmmParts[2].length === 4) {
      return trimmed;
    }
    
    return dateStr; // Return original if format doesn't match
  }, []);

  // Helper function to convert various date formats to timestamp for sorting
  const parseDate = React.useCallback((dateStr: string): number => {
    if (!dateStr || !dateStr.trim()) return 0;
    
    const trimmed = dateStr.trim();
    
    // Handle YYYY-MM-DD format (e.g., 2025-12-21)
    const yyyyParts = trimmed.split('-');
    if (yyyyParts.length === 3 && yyyyParts[0].length === 4) {
      const year = parseInt(yyyyParts[0]);
      const month = parseInt(yyyyParts[1]);
      const day = parseInt(yyyyParts[2]);
      return new Date(year, month - 1, day).getTime();
    }
    
    // Handle M/D/YY format (e.g., 12/21/25)
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = 2000 + parseInt(parts[2]);
      return new Date(year, month - 1, day).getTime();
    }
    
    // Handle dd.mm.yyyy format (e.g., 21.12.2025)
    const ddmmParts = trimmed.split('.');
    if (ddmmParts.length === 3 && ddmmParts[2].length === 4) {
      const day = parseInt(ddmmParts[0]);
      const month = parseInt(ddmmParts[1]);
      const year = parseInt(ddmmParts[2]);
      return new Date(year, month - 1, day).getTime();
    }
    
    return 0;
  }, []);

  // Extract history items from CSV data
  const historyItems = React.useMemo(() => {
    const items: Array<{ date: string; formattedDate: string; action: string; type: 'bestellung' | 'sendung'; column: string }> = [];
    
    // Parse bestellungen CSV
    const bestellungenLines = bestellungenCSV.trim().split('\n');
    if (bestellungenLines.length > 1) {
      const bestellungenHeaders = parseCSVLine(bestellungenLines[0]);
      const rechnungIndex = bestellungenHeaders.findIndex(h => h.trim() === 'Rechnung versendet');
      const sendungIndex = bestellungenHeaders.findIndex(h => h.trim() === 'Sendung erstellt');
      const versandprofilIndex = bestellungenHeaders.findIndex(h => h.trim() === 'Versandprofil hinzugefugt');
      
      for (let i = 1; i < bestellungenLines.length; i++) {
        const values = parseCSVLine(bestellungenLines[i]);
        if (rechnungIndex >= 0 && values[rechnungIndex]?.trim()) {
          const date = values[rechnungIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Rechnung versendet', type: 'bestellung', column: 'rechnungVersendetDatum' });
        }
        if (sendungIndex >= 0 && values[sendungIndex]?.trim()) {
          const date = values[sendungIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Sendung erstellt', type: 'bestellung', column: 'sendungErstelltDatum' });
        }
        if (versandprofilIndex >= 0 && values[versandprofilIndex]?.trim()) {
          const date = values[versandprofilIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Versandprofil hinzugefügt', type: 'bestellung', column: 'versandprofilHinzugefuegtDatum' });
        }
      }
    }
    
    // Parse sendungen CSV
    const sendungenLines = sendungenCSV.trim().split('\n');
    if (sendungenLines.length > 1) {
      const sendungenHeaders = parseCSVLine(sendungenLines[0]);
      const versandtGemeldetIndex = sendungenHeaders.findIndex(h => h.trim() === 'Versandt Gemeldet');
      const versanddatumIndex = sendungenHeaders.findIndex(h => h.trim() === 'Versanddatum');
      const picklisteIndex = sendungenHeaders.findIndex(h => h.trim() === 'Pickliste erstellt');
      const packlisteIndex = sendungenHeaders.findIndex(h => h.trim() === 'Packliste erstellt');
      const versandprofilHinzugefuegtIndex = sendungenHeaders.findIndex((h) => {
        const trimmed = h.trim();
        return trimmed === 'Versandprofil hinzugefügt' || trimmed === 'Versandprofil hinzugefugt';
      });
      
      for (let i = 1; i < sendungenLines.length; i++) {
        const values = parseCSVLine(sendungenLines[i]);
        if (versandtGemeldetIndex >= 0 && values[versandtGemeldetIndex]?.trim()) {
          const date = values[versandtGemeldetIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Versandlabel erstellt', type: 'sendung', column: 'versandtGemeldet' });
        }
        if (picklisteIndex >= 0 && values[picklisteIndex]?.trim()) {
          const date = values[picklisteIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Pickliste erstellt', type: 'sendung', column: 'picklisteErstellt' });
        }
        if (packlisteIndex >= 0 && values[packlisteIndex]?.trim()) {
          const date = values[packlisteIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Packliste erstellt', type: 'sendung', column: 'packlisteErstellt' });
        }
        if (versandprofilHinzugefuegtIndex >= 0 && values[versandprofilHinzugefuegtIndex]?.trim()) {
          const date = values[versandprofilHinzugefuegtIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Versandprofil hinzugefügt', type: 'sendung', column: 'versandprofilHinzugefuegt' });
        }
        if (versanddatumIndex >= 0 && values[versanddatumIndex]?.trim()) {
          const date = values[versanddatumIndex].trim();
          items.push({ date, formattedDate: convertToDDMMYYYY(date), action: 'Versendet', type: 'sendung', column: 'versanddatum' });
        }
      }
    }
    
    // Sort by date (descending - newest first)
    items.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    
    // Remove duplicates and format (using formattedDate for deduplication)
    const uniqueItems = Array.from(new Map(items.map(item => [`${item.formattedDate}-${item.action}`, item])).values());
    
    return uniqueItems.map(item => ({
      value: `${item.date}|${item.column}|${item.type}`, // Store original date for matching (use | separator to avoid conflicts with date format)
      label: item.formattedDate, // Display formatted date (without action)
      date: item.date, // Original date for matching
      formattedDate: item.formattedDate, // Formatted date for display
      action: item.action,
      column: item.column,
      type: item.type
    }));
  }, [parseCSVLine, convertToDDMMYYYY, parseDate]);

  // Create maps to store dates from CSV for columns not in Order type
  const sendungenDateMaps = React.useMemo(() => {
    const picklisteMap = new Map<number, string>();
    const packlisteMap = new Map<number, string>();
    const versandprofilHinzugefuegtMap = new Map<number, string>();
    
    const sendungenLines = sendungenCSV.trim().split('\n');
    if (sendungenLines.length > 1) {
      const headers = parseCSVLine(sendungenLines[0]);
      const nrIndex = headers.findIndex(h => h.trim() === 'Nr');
      const picklisteIndex = headers.findIndex(h => h.trim() === 'Pickliste erstellt');
      const packlisteIndex = headers.findIndex(h => h.trim() === 'Packliste erstellt');
      const versandprofilHinzugefuegtIndex = headers.findIndex((h) => {
        const trimmed = h.trim();
        return trimmed === 'Versandprofil hinzugefügt' || trimmed === 'Versandprofil hinzugefugt';
      });
      
      for (let i = 1; i < sendungenLines.length; i++) {
        const values = parseCSVLine(sendungenLines[i]);
        const nr = nrIndex >= 0 ? parseInt(values[nrIndex]?.trim() || '0') : null;
        if (nr) {
          if (picklisteIndex >= 0 && values[picklisteIndex]?.trim()) {
            picklisteMap.set(nr, values[picklisteIndex].trim());
          }
          if (packlisteIndex >= 0 && values[packlisteIndex]?.trim()) {
            packlisteMap.set(nr, values[packlisteIndex].trim());
          }
          if (versandprofilHinzugefuegtIndex >= 0 && values[versandprofilHinzugefuegtIndex]?.trim()) {
            versandprofilHinzugefuegtMap.set(nr, values[versandprofilHinzugefuegtIndex].trim());
          }
        }
      }
    }
    
    return { picklisteMap, packlisteMap, versandprofilHinzugefuegtMap };
  }, [parseCSVLine]);

  // Validate and restore history selection when tab changes
  React.useEffect(() => {
    const savedSelection = selectedHistoryByTab[activeTab as "rechnung" | "versand"] || "";
    
    // If no selection or "Alle", keep it
    if (!savedSelection || savedSelection === "Alle") {
      return;
    }

    // Check if the saved selection is still available (not hidden)
    const isAvailable = historyItems.some((item) => {
      // Check if item matches saved selection
      if (item.value !== savedSelection) return false;
      
      // Check if item is visible for current tab
      if (activeTab === "rechnung") {
        const hiddenActions = [
          "Versandprofil hinzugefügt",
          "Versandlabel erstellt",
          "Packliste erstellt",
          "Pickliste erstellt",
          "Versendet"
        ];
        return !hiddenActions.includes(item.action);
      } else if (activeTab === "versand") {
        const hiddenActions = [
          "Rechnung versendet",
          "Sendung erstellt"
        ];
        return !hiddenActions.includes(item.action);
      }
      return true;
    });

    // If saved selection is not available, reset it to empty string
    if (!isAvailable) {
      setSelectedHistoryByTab(prev => ({
        ...prev,
        [activeTab]: ""
      }));
    }
  }, [activeTab, historyItems, selectedHistoryByTab]);

  const [rowSelection1, setRowSelection1] = React.useState<RowSelectionState>({}); // Separate row selection for table 1
  const [rowSelection2, setRowSelection2] = React.useState<RowSelectionState>({}); // Separate row selection for table 2
  
  // Stable getRowId function to ensure row IDs are consistent across renders and sorting
  const getRowId = React.useCallback((row: Order) => String(row.nr), []);
  const [markedRows1, setMarkedRows1] = React.useState<Set<string | number>>(new Set()); // Mark state for table 1 (using order.nr as key)
  const [markedRows2, setMarkedRows2] = React.useState<Set<string | number>>(new Set()); // Mark state for table 2 (using order.nr as key)
  const [visibleRows1, setVisibleRows1] = React.useState<Order[]>([]); // Actually visible rows in table 1 (after global filter)
  const [visibleRows2, setVisibleRows2] = React.useState<Order[]>([]); // Actually visible rows in table 2 (after global filter)
  const [fehlerRowNr] = React.useState<number | null>(null); // Row number that should show Fehler icon (default: null - no icons visible, only temporary icons are used)
  const [temporaryVisibleIcons, setTemporaryVisibleIcons] = React.useState<Map<string, number>>(new Map()); // Map of icon IDs to expiration timestamps
  const [lastMarkedRowId1, setLastMarkedRowId1] = React.useState<string | number | null>(null); // Last marked row ID (nr) for Shift+click range
  const [lastMarkedRowId2, setLastMarkedRowId2] = React.useState<string | number | null>(null); // Last marked row ID (nr) for Shift+click range

  // Helper function to temporarily show an icon
  // Usage: showIconTemporarily('fehler-23', 5000) to show Fehler icon for row 23 for 5 seconds
  // This function is available for use - call it with iconId (e.g., 'fehler-{rowNr}') and duration in ms
  const showIconTemporarily = React.useCallback((iconId: string, duration: number = 3000) => {
    const expirationTime = Date.now() + duration;
    setTemporaryVisibleIcons(prev => {
      const newMap = new Map(prev);
      newMap.set(iconId, expirationTime);
      return newMap;
    });
    // Auto-cleanup after duration
    setTimeout(() => {
      setTemporaryVisibleIcons(prev => {
        const newMap = new Map(prev);
        newMap.delete(iconId);
        return newMap;
      });
    }, duration);
  }, []);

  // Expose function for use - you can call showIconTemporarily('fehler-{rowNr}', duration) anywhere
  // Example: showIconTemporarily('fehler-23', 5000) shows Fehler icon for row 23 for 5 seconds
  // Store reference to avoid unused variable warning
  React.useRef(showIconTemporarily);

  // Cleanup expired temporary icons
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTemporaryVisibleIcons(prev => {
        const newMap = new Map(prev);
        let changed = false;
        for (const [iconId, expirationTime] of newMap.entries()) {
          if (expirationTime <= now) {
            newMap.delete(iconId);
            changed = true;
          }
        }
        return changed ? newMap : prev;
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);
  const dataTableRef1 = React.useRef<HTMLDivElement>(null);
  const dataTableRef2 = React.useRef<HTMLDivElement>(null);
  const [rechnungColumnVisibility, setRechnungColumnVisibility] = React.useState<VisibilityState>({
    select: true,
    type: false,
    kaufdatum: true,
    bestellnummer: true,
    kundeAdresse: true,
    artikelanzahl: true,
    gesamtNetto: false,
    mwstSatz: false,
    gesamtBrutto: true,
    bezahltAm: true,
    nr: false,
    importdatum: false,
    importquelle: false,
    info: true,
    email: true,
    telefonnummer: false,
    versandNetto: false,
    versandBrutto: false,
    versandland: false,
    versandprofil: false,
    versanddienstleister: false,
    versandverpackung: false,
    versandtGemeldet: false,
    statusVersanddokumente: false,
    versanddatum: false,
    // Floating columns: show 9, 7 (right-[300px], right-[200px]) - hide 8 (Versandprofil hinzugefügt)
    "floating-col-9-rechnung": true,
    "floating-col-8-rechnung": false,
    "floating-col-7-rechnung": true,
    "floating-col-6-rechnung": false,
    "floating-col-5-rechnung": false,
    "floating-col-4-rechnung": false,
    "floating-col-3-rechnung": false,
    "floating-col-2-rechnung": false,
  });
  const [versandColumnVisibility, setVersandColumnVisibility] = React.useState<VisibilityState>({
    select: true,
    type: false,
    kaufdatum: true,
    kundeAdresse: true,
    artikelanzahl: true,
    versandland: true,
    versandprofil: true,
    versanddienstleister: true,
    versandverpackung: true,
    versandtGemeldet: true,
    statusVersanddokumente: true,
    versanddatum: true,
    trackingnummer: true,
    nr: false,
    bestellnummer: true,
    importdatum: false,
    importquelle: false,
    // Floating columns: show 5, 3, 8 (right-[50px], right-[50px], right-[150px])
    "floating-col-4-versand": false,
    "floating-col-5-versand": true,
    "floating-col-3-versand": true,
    "floating-col-6-versand": false,
    "floating-col-7-versand": false,
    "floating-col-8-versand": true,
    "floating-col-9-versand": false,
    "floating-col-2-versand": false,
    info: true,
    email: false,
    telefonnummer: false,
    versandNetto: false,
    versandBrutto: false,
    gesamtNetto: false,
    mwstSatz: false,
    gesamtBrutto: false,
    bezahltAm: false,
  });

  const handleRowDoubleClick = (row: Order) => {
    if (activeTab === "versand") {
      setSelectedShipment(row);
      setIsSendungSheetOpen(true);
    } else {
      setSelectedOrder(row);
      setIsSheetOpen(true);
    }
  };

  // Function to show related shipments (Sendungen) for marked Bestellungen rows
  const handleShowRelatedShipments = React.useCallback((clickedRow?: Order) => {
    // Get marked rows from Bestellungen table
    let markedBestellungenRows = visibleRows1.filter(row => markedRows1.has(row.nr));
    
    // If no rows marked but a row was clicked in context menu, use that row
    if (markedBestellungenRows.length === 0 && clickedRow) {
      markedBestellungenRows = [clickedRow];
    }
    
    // If still no rows, do nothing
    if (markedBestellungenRows.length === 0) {
      return;
    }
    
    const isSingleRow = markedBestellungenRows.length === 1;
    
    // Get bestellnummer values from marked rows
    const bestellnummern = new Set(markedBestellungenRows.map(row => row.bestellnummer));
    
    // Find matching Sendungen rows by bestellnummer (including hidden ones to check if they exist)
    const matchingSendungenRows = ordersState2.filter(order => 
      bestellnummern.has(order.bestellnummer)
    );
    
    // Filter out hidden rows (19, 20, 21, 22, 23) unless they're in visibleKundeAdressenForSendungen
    const visibleMatchingSendungenRows = matchingSendungenRows.filter(order => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return true;
      
      // Check if row is hidden
      if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23) {
        if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
          return false; // Skip hidden rows
        }
      }
      return true;
    });
    
    // If no matching visible Sendungen rows found, show modal
    if (visibleMatchingSendungenRows.length === 0) {
      setNoSendungenModalIsSingle(isSingleRow);
      setShowNoSendungenModal(true);
      return;
    }
    
    // Switch to Sendungen tab
    setActiveTab("versand");
    
    // Unmark all Sendungen rows
    setMarkedRows2(new Set());
    setRowSelection2({});
    
    // Mark the matching rows
    const newMarkedRows2 = new Set<string | number>();
    visibleMatchingSendungenRows.forEach(order => {
      newMarkedRows2.add(order.nr);
    });
    
    setMarkedRows2(newMarkedRows2);
  }, [visibleRows1, markedRows1, ordersState2, visibleKundeAdressenForSendungen]);

  // Function to show related orders (Bestellungen) for marked Sendungen rows
  const handleShowRelatedBestellungen = React.useCallback((clickedRow?: Order) => {
    // Get marked rows from Sendungen table
    let markedSendungenRows = visibleRows2.filter(row => markedRows2.has(row.nr));
    
    // If no rows marked but a row was clicked in context menu, use that row
    if (markedSendungenRows.length === 0 && clickedRow) {
      markedSendungenRows = [clickedRow];
    }
    
    // If still no rows, do nothing
    if (markedSendungenRows.length === 0) {
      return;
    }
    
    const isSingleRow = markedSendungenRows.length === 1;
    
    // Get bestellnummer values from marked rows
    const bestellnummern = new Set(markedSendungenRows.map(row => row.bestellnummer));
    
    // Find matching Bestellungen rows by bestellnummer
    const matchingBestellungenRows = ordersState1.filter(order => 
      bestellnummern.has(order.bestellnummer) && order.type !== "Versandvorgang"
    );
    
    // If no matching Bestellungen rows found, show modal
    if (matchingBestellungenRows.length === 0) {
      setNoBestellungenModalIsSingle(isSingleRow);
      setShowNoBestellungenModal(true);
      return;
    }
    
    // Switch to Bestellungen tab
    setActiveTab("rechnung");
    
    // Unmark all Bestellungen rows
    setMarkedRows1(new Set());
    setRowSelection1({});
    
    // Mark the matching rows
    const newMarkedRows1 = new Set<string | number>();
    matchingBestellungenRows.forEach(order => {
      newMarkedRows1.add(order.nr);
    });
    
    setMarkedRows1(newMarkedRows1);
  }, [visibleRows2, markedRows2, ordersState1]);

  // Function to open bestellungsheet from sendungsheet button click
  const handleOpenBestellungFromSendung = React.useCallback((bestellnummer: string) => {
    if (!bestellnummer) return;
    
    // Find matching Bestellungen row by bestellnummer
    const matchingOrder = ordersState1.find(order => 
      order.bestellnummer === bestellnummer && order.type !== "Versandvorgang"
    );
    
    if (!matchingOrder) {
      // If no matching order found, show modal
      setNoBestellungenModalIsSingle(true);
      setShowNoBestellungenModal(true);
      return;
    }
    
    // Close sendungsheet
    setIsSendungSheetOpen(false);
    
    // Switch to Bestellungen tab
    setActiveTab("rechnung");
    
    // Open bestellungsheet with the matching order
    setSelectedOrder(matchingOrder);
    setIsSheetOpen(true);
  }, [ordersState1]);

  // Function to open sendungsheet from bestellungsheet button click
  const handleOpenSendungFromBestellung = React.useCallback((bestellnummer?: string, sendungsnummer?: string) => {
    // Find matching Sendungen row by bestellnummer or sendungsnummer
    const matchingSendung = ordersState2.find(order => 
      (bestellnummer && order.bestellnummer === bestellnummer) || 
      (sendungsnummer && order.sendungsnummer === sendungsnummer)
    );
    
    if (!matchingSendung) {
      // If no matching sendung found, do nothing or show a message
      return;
    }
    
    // Close bestellungsheet
    setIsSheetOpen(false);
    
    // Switch to Sendungen tab
    setActiveTab("versand");
    
    // Open sendungsheet with the matching sendung
    setSelectedShipment(matchingSendung);
    setIsSendungSheetOpen(true);
  }, [ordersState2]);

  const handleFilteredDataChange1 = React.useCallback((data: Order[]) => {
    // Store actually visible rows (after global filter is applied)
    setVisibleRows1(data);
  }, []);
  const handleFilteredDataChange2 = React.useCallback((data: Order[]) => {
    // Store actually visible rows (after global filter is applied)
    setVisibleRows2(data);
  }, []);

  // Automatically show "Fehler" column when checkbox is checked
  React.useEffect(() => {
    if (isChecked4) {
      setRechnungColumnVisibility((prev) => ({
        ...prev,
        "floating-col-2-rechnung": true,
      }));
    }
    if (isChecked12) {
      setVersandColumnVisibility((prev) => ({
        ...prev,
        "floating-col-2-versand": true,
      }));
    }
  }, [isChecked4, isChecked12]);

  // Handle progress animation and auto-advance for single row sendung modal
  React.useEffect(() => {
    if (!showSingleRowSendungModal) {
      return;
    }

    if (singleRowSendungStep === -1) {
      // Animate progress from 0 to 100 over 3 seconds
      const startTime = Date.now();
      const duration = 3000; // 3 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        
        setSingleRowProgressValue(progress);
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          // Auto-advance to next step after progress completes
          // Check if the single marked row has "Sendung erstellt" -> true
          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
          const hasSendungErstellt = markedVisibleRows.length === 1 && markedVisibleRows.some(row => {
            const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
            const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
            return checklistData?.sendungErstellt === true;
          });
          
          // Determine next step: skip step 0 if no sendungErstellt, go directly to step 2 (no step 1 for single row)
          if (hasSendungErstellt) {
            setSingleRowSendungStep(0); // Go to step 0
          } else {
            setSingleRowSendungStep(2); // Skip step 0 and 1, go to step 2
          }
          setSingleRowProgressValue(0);
        }
      }, 16); // ~60fps

      return () => {
        clearInterval(progressInterval);
      };
    }
  }, [showSingleRowSendungModal, singleRowSendungStep, visibleRows1, markedRows1, checklistMap]);

  // Handle progress animation and auto-advance for address match modal
  React.useEffect(() => {
    if (!showAddressMatchAlert) {
      return;
    }

    if (addressMatchStep === -1) {
      // Animate progress from 0 to 100 over 3 seconds
      const startTime = Date.now();
      const duration = 3000; // 3 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        
        setProgressValue(progress);
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          // Auto-advance to next step after progress completes
          // Check if any marked rows have "Sendung erstellt" -> true
          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
          const hasSendungErstellt = markedVisibleRows.some(row => {
            const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
            const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
            return checklistData?.sendungErstellt === true;
          });
          
          // Check if there are duplicate kundeAdresse values
          const kundeAdressen = markedVisibleRows.map(row => row.kundeAdresse || "").filter(addr => addr !== "");
          const kundeAdressenSet = new Set(kundeAdressen);
          const hasDuplicateAddresses = kundeAdressen.length > kundeAdressenSet.size;
          
          // Determine next step: skip step 0 if no sendungErstellt, skip step 1 if no duplicate addresses
          if (hasSendungErstellt) {
            setAddressMatchStep(0); // Go to step 0
          } else if (hasDuplicateAddresses) {
            setAddressMatchStep(1); // Skip step 0, go to step 1
          } else {
            setAddressMatchStep(2); // Skip step 0 and 1, go to step 2
          }
          setProgressValue(0);
        }
      }, 16); // ~60fps

      return () => {
        clearInterval(progressInterval);
      };
    }
  }, [showAddressMatchAlert, addressMatchStep, visibleRows1, markedRows1, checklistMap]);

  // Count rows with Importdatum 09.12.2025 (stored as "2025-12-09" or displayed as "09.12.2025")
  const importdatumCount = React.useMemo(() => {
    return ordersState1.filter(
      (order) => order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025"
    ).length;
  }, [ordersState1]);

  // Count rows where "Rechnung versendet" icon is hidden (checklistData?.rechnungVersendet is false or undefined)
  // Exclude hidden row 24
  const rechnungVersendetHiddenCount = React.useMemo(() => {
    return ordersState1.filter((order) => {
      // Exclude Versandvorgang rows (as filteredData1 does)
      if (order.type === "Versandvorgang") return false;
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return false;
      // Exclude hidden row 24
      if (rowNr === 24) return false;
      const checklistData = checklistMap.get(rowNr);
      const showIcon = checklistData?.rechnungVersendet ?? false;
      return !showIcon; // Count rows where icon is hidden
    }).length;
  }, [ordersState1, checklistMap]);

  // Count rows where "Sendung erstellt" icon is hidden AND "Bezahlt am" has a date
  // Exclude hidden row 24
  const versanddokumenteCount = React.useMemo(() => {
    return ordersState1.filter((order) => {
      // Exclude Versandvorgang rows (as filteredData1 does)
      if (order.type === "Versandvorgang") return false;
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return false;
      // Exclude hidden row 24
      if (rowNr === 24) return false;
      const checklistData = checklistMap.get(rowNr);
      const showIcon = checklistData?.sendungErstellt ?? false;
      const iconHidden = !showIcon;
      const bezahltAmHasDate = order.bezahltAm && order.bezahltAm !== null && order.bezahltAm !== "";
      return iconHidden && bezahltAmHasDate;
    }).length;
  }, [ordersState1, checklistMap]);

  // Count rows where "Fehler" icon is visible for Bestellungen table
  // Exclude hidden row 24
  const fehlerCountBestellungen = React.useMemo(() => {
    let count = 0;
    
    // Count rows in table 1 (Bestellungen) where Fehler icon is visible
    // Exclude Versandvorgang rows (as filteredData1 does)
    ordersState1.forEach((order) => {
      // Skip Versandvorgang rows (they're filtered out in filteredData1)
      if (order.type === "Versandvorgang") return;
      
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr !== null) {
        // Exclude hidden row 24
        if (rowNr === 24) return;
        const checklistData = checklistMap.get(rowNr);
        const hasError = checklistData?.fehler ?? false;
        if (hasError) {
          count++;
        }
      }
    });
    
    return count;
  }, [ordersState1, checklistMap]);

  // Count rows where "Fehler" icon is visible for Sendungen table
  const fehlerCountSendungen = React.useMemo(() => {
    let count = 0;
    
    // Count rows in table 2 (Sendungen) where Fehler icon is visible
    // Include Versandvorgang rows (as filteredData2 does)
    // Exclude hidden rows (19, 20, 21, 22, 23, 24) unless they're in visibleKundeAdressenForSendungen
    ordersState2.forEach((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return;
      
      // Check if row is hidden
      if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23 || rowNr === 24) {
        if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
          return; // Skip hidden rows
        }
      }
      
      const checklistData = checklistMap.get(rowNr);
      const hasError = checklistData?.fehler ?? false;
      if (hasError) {
        count++;
      }
    });
    
    return count;
  }, [ordersState2, checklistMap, visibleKundeAdressenForSendungen]);

  // Count rows in Sendungen table where "Versendet" checkbox is false in checklistMap
  const nichtVersendetCount = React.useMemo(() => {
    let count = 0;
    ordersState2.forEach((order) => {
      if (order.type === "Versandvorgang") {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return;
        
        // Check if row is hidden
        if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23 || rowNr === 24) {
          if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
            return; // Skip hidden rows
          }
        }
        
        const checklistData = checklistMap.get(rowNr);
        const isVersendet = checklistData?.versendet ?? false;
        if (!isVersendet) {
          count++;
        }
      }
    });
    return count;
  }, [ordersState2, checklistMap, visibleKundeAdressenForSendungen]);

  // Count rows in Sendungen table where "Pickliste erstellt" checkbox is false in checklistMap
  const keinePicklisteCount = React.useMemo(() => {
    let count = 0;
    ordersState2.forEach((order) => {
      if (order.type === "Versandvorgang") {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return;
        
        // Check if row is hidden
        if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23 || rowNr === 24) {
          if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
            return; // Skip hidden rows
          }
        }
        
        const checklistData = checklistMap.get(rowNr);
        const hasPickliste = checklistData?.picklisteErstellt ?? false;
        if (!hasPickliste) {
          count++;
        }
      }
    });
    return count;
  }, [ordersState2, checklistMap, visibleKundeAdressenForSendungen]);

  // Count rows in Sendungen table where "Packliste erstellt" checkbox is false in checklistMap
  const keinePacklisteCount = React.useMemo(() => {
    let count = 0;
    ordersState2.forEach((order) => {
      if (order.type === "Versandvorgang") {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return;
        
        // Check if row is hidden
        if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23 || rowNr === 24) {
          if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
            return; // Skip hidden rows
          }
        }
        
        const checklistData = checklistMap.get(rowNr);
        const hasPackliste = checklistData?.packlisteErstellt ?? false;
        if (!hasPackliste) {
          count++;
        }
      }
    });
    return count;
  }, [ordersState2, checklistMap, visibleKundeAdressenForSendungen]);

  // Count rows in Sendungen table where "Versandprofil hinzugefügt" checkbox is false in checklistMap
  const keinVersandprofilCount = React.useMemo(() => {
    let count = 0;
    ordersState2.forEach((order) => {
      if (order.type === "Versandvorgang") {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return;
        
        // Check if row is hidden
        if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23 || rowNr === 24) {
          if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
            return; // Skip hidden rows
          }
        }
        
        const checklistData = checklistMap.get(rowNr);
        const hasVersandprofil = checklistData?.versandprofilHinzugefuegt ?? false;
        if (!hasVersandprofil) {
          count++;
        }
      }
    });
    return count;
  }, [ordersState2, checklistMap, visibleKundeAdressenForSendungen]);

  // Count rows in Sendungen table where Versandlabel (paketlisteErstellt) is false
  const keinVersandlabelCount = React.useMemo(() => {
    let count = 0;
    ordersState2.forEach((order) => {
      if (order.type === "Versandvorgang") {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return;
        
        // Check if row is hidden
        if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23 || rowNr === 24) {
          if (visibleKundeAdressenForSendungen.size === 0 || !visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
            return; // Skip hidden rows
          }
        }
        
        const checklistData = checklistMap.get(rowNr);
        const hasVersandlabel = checklistData?.paketlisteErstellt ?? false;
        if (!hasVersandlabel) {
          count++;
        }
      }
    });
    return count;
  }, [ordersState2, checklistMap, visibleKundeAdressenForSendungen]);

  // Count rows in Bestellungen table where Versandprofil is "DHL National"
  const dhlNationalCount = React.useMemo(() => {
    return ordersState1.filter(
      (order) => order.type === "Bestellung" && order.versandprofil === "DHL National"
    ).length;
  }, [ordersState1]);

  // Count marked rows for the active tab
  const markedRowsCount = React.useMemo(() => {
    const currentMarkedRows = activeTab === "versand" ? markedRows2 : markedRows1;
    const currentVisibleRows = activeTab === "versand" ? visibleRows2 : visibleRows1;
    return currentVisibleRows.filter(row => currentMarkedRows.has(row.nr)).length;
  }, [activeTab, markedRows1, markedRows2, visibleRows1, visibleRows2]);

  // Count rows in Bestellungen table where Versandprofil is "DPD Europa" (formerly "DPD International")
  const dpdInternationalCount = React.useMemo(() => {
    return ordersState1.filter(
      (order) => order.type === "Bestellung" && (order.versandprofil === "DPD International" || order.versandprofil === "DPD Europa")
    ).length;
  }, [ordersState1]);

  // Count rows in Bestellungen table where Versandprofil is "UPS USA"
  const upsUSACount = React.useMemo(() => {
    return ordersState1.filter(
      (order) => order.type === "Bestellung" && order.versandprofil === "UPS USA"
    ).length;
  }, [ordersState1]);

  // Filter items configuration
  const filterItems = React.useMemo(
    () => [
      {
        id: "new-orders-checkbox-13",
        count: keinVersandprofilCount,
        label: "Kein Versandprofil",
        checked: isChecked13,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked13(checked);
        },
      },
      {
        id: "new-orders-checkbox-14",
        count: keinVersandlabelCount,
        label: "Kein Versandlabel",
        checked: isChecked14,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked14(checked);
        },
      },
      {
        id: "new-orders-checkbox-2",
        count: rechnungVersendetHiddenCount,
        label: "Rechnungen nicht versendet",
        checked: isChecked2,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked2(checked);
        },
      },
      {
        id: "new-orders-checkbox-3",
        count: versanddokumenteCount,
        label: "Bestellungen bezahlt, nicht gesendet",
        checked: isChecked3,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked3(checked);
        },
      },
      {
        id: "new-orders-checkbox-4",
        count: fehlerCountBestellungen,
        label: "Fehler",
        checked: isChecked4,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked4(checked);
        },
      },
      {
        id: "new-orders-checkbox-6",
        count: keinePicklisteCount,
        label: "Keine Pickliste",
        checked: isChecked8,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked8(checked);
        },
      },
      {
        id: "new-orders-checkbox-7",
        count: keinePacklisteCount,
        label: "Keine Packliste",
        checked: isChecked10,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked10(checked);
        },
      },
      {
        id: "new-orders-checkbox-5",
        count: nichtVersendetCount,
        label: "Nicht versendet",
        checked: isChecked7,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked7(checked);
        },
      },
      {
        id: "new-orders-checkbox-12",
        count: fehlerCountSendungen,
        label: "Fehler",
        checked: isChecked12,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked12(checked);
        },
      },
    ],
    [importdatumCount, rechnungVersendetHiddenCount, versanddokumenteCount, fehlerCountBestellungen, fehlerCountSendungen, nichtVersendetCount, keinePicklisteCount, keinePacklisteCount, keinVersandprofilCount, keinVersandlabelCount, isChecked, isChecked2, isChecked3, isChecked4, isChecked7, isChecked8, isChecked10, isChecked12, isChecked13, isChecked14]
  );

  // Separate filter items for Versandprofile accordion
  const filterItems2 = React.useMemo(
    () => [
      {
        id: "versandprofile-checkbox-1",
        count: dhlNationalCount,
        label: "DHL National",
        checked: isChecked5,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked5(checked);
        },
      },
      {
        id: "versandprofile-checkbox-2",
        count: dpdInternationalCount,
        label: "DPD Europa",
        checked: isChecked6,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked6(checked);
        },
      },
      {
        id: "versandprofile-checkbox-3",
        count: upsUSACount,
        label: "UPS USA",
        checked: isChecked11,
        onCheckedChange: (checked: boolean) => {
          // Deselect all rows first
          setMarkedRows1(new Set());
          setMarkedRows2(new Set());
          setRowSelection1({});
          setRowSelection2({});
          // Then change checkbox state
          setIsChecked11(checked);
        },
      },
    ],
    [dhlNationalCount, dpdInternationalCount, upsUSACount, isChecked5, isChecked6, isChecked11]
  );

  // Filter data for table 1 (includes additional rows)
  const filteredData1 = React.useMemo(() => {
    let result = ordersState1;

    // Hide row with nr 24 by default
    result = result.filter((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return true;
      return rowNr !== 24;
    });

    // Apply filter for Importquelle dropdown
    if (importquelle && importquelle !== "Alle") {
      result = result.filter((order) => order.importquelle === importquelle);
    }

    // Apply filter for Kaufdatum
    if (kaufdatum?.from) {
      const fromDate = format(kaufdatum.from, "yyyy-MM-dd");
      const toDate = kaufdatum.to ? format(kaufdatum.to, "yyyy-MM-dd") : fromDate;
      result = result.filter((order) => {
        const orderDate = order.kaufdatum;
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Apply filter for Importdatum
    if (importdatum?.from) {
      const fromDate = format(importdatum.from, "yyyy-MM-dd");
      const toDate = importdatum.to ? format(importdatum.to, "yyyy-MM-dd") : fromDate;
      result = result.filter((order) => {
        const orderDate = order.importdatum;
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Apply filter for "Zuletzt importiert" checkbox (importdatum = "2025-12-09" or "09.12.2025")
    if (isChecked) {
      result = result.filter(
        (order) => order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025"
      );
    }

    // Apply filter for "Rechnungen nicht versendet" checkbox (rows where "Rechnung versendet" icon is hidden)
    if (isChecked2) {
      result = result.filter((order) => {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const showIcon = checklistData?.rechnungVersendet ?? false;
        return !showIcon; // Show only rows where icon is hidden
      });
    }

    // Apply filter for "Bestellungen bezahlt, nicht gesendet" checkbox (rows where "Sendung erstellt" icon is hidden AND "Bezahlt am" has a date)
    if (isChecked3) {
      result = result.filter((order) => {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const showIcon = checklistData?.sendungErstellt ?? false;
        const iconHidden = !showIcon;
        const bezahltAmHasDate = order.bezahltAm && order.bezahltAm !== null && order.bezahltAm !== "";
        return iconHidden && bezahltAmHasDate;
      });
    }

    // Apply filter for "Fehler" checkbox (rows where "Fehler" icon is visible based on checklistData.fehler)
    if (isChecked4) {
      result = result.filter((order) => {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        
        const checklistData = checklistMap.get(rowNr);
        const hasError = checklistData?.fehler ?? false;
        return hasError;
      });
    }

    // Apply filter for "Nicht versendet" checkbox - this filter is for Sendungen table only
    // (filteredData2 handles this filter)

    // Apply filter for "Ohne Versandprofil" checkbox (versandprofil is "-" or "-" or empty)
    if (isChecked9) {
      result = result.filter(
        (order) => order.versandprofil === "-" || order.versandprofil === "-" || !order.versandprofil
      );
    }

    // Apply filter for "DHL National" checkbox (versandprofil is "DHL National")
    if (isChecked5) {
      result = result.filter(
        (order) => order.versandprofil === "DHL National"
      );
    }

    // Apply filter for "DPD Europa" checkbox (versandprofil is "DPD Europa" or "DPD International")
    if (isChecked6) {
      result = result.filter(
        (order) => order.versandprofil === "DPD Europa" || order.versandprofil === "DPD International"
      );
    }

    // Apply filter for "UPS USA" checkbox (versandprofil is "UPS USA")
    if (isChecked11) {
      result = result.filter(
        (order) => order.versandprofil === "UPS USA"
      );
    }

    // Filter out Versandvorgang rows
    result = result.filter((order) => order.type !== "Versandvorgang");

    // Apply filter for history selection
    if (selectedHistory && selectedHistory !== 'Alle') {
      const parts = selectedHistory.split('|');
      if (parts.length === 3) {
        const [date, column, type] = parts;
        const trimmedDate = date?.trim() || '';
        if (type === 'bestellung' && trimmedDate) {
          result = result.filter((order) => {
            if (column === 'rechnungVersendetDatum') {
              const orderDate = (order.rechnungVersendetDatum || '').trim();
              return orderDate === trimmedDate && orderDate !== '';
            } else if (column === 'sendungErstelltDatum') {
              const orderDate = (order.sendungErstelltDatum || '').trim();
              return orderDate === trimmedDate && orderDate !== '';
            } else if (column === 'versandprofilHinzugefuegtDatum') {
              const orderDate = (order.versandprofilHinzugefuegtDatum || '').trim();
              return orderDate === trimmedDate && orderDate !== '';
            }
            return false;
          });
        }
      }
    }

    // Return a new array reference to ensure React detects changes
    return result;
  }, [ordersState1, importquelle, kaufdatum, importdatum, isChecked, isChecked2, isChecked3, isChecked4, isChecked5, isChecked6, isChecked9, isChecked11, checklistMap, selectedHistory]);

  // Filter data for table 2 (only base orders)
  const filteredData2 = React.useMemo(() => {
    let result = ordersState2;

    // Hide row 24 always
    result = result.filter((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return true;
      if (rowNr === 24) return false;
      return true;
    });

    // Hide rows with numbers 19, 20, 21, 22, 23 at start (unless they match visible kundeAdresse values)
    result = result.filter((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return true;
      
      // Always hide rows 19, 20, 21, 22, 23 initially
      if (rowNr === 19 || rowNr === 20 || rowNr === 21 || rowNr === 22 || rowNr === 23) {
        // Show them if their kundeAdresse matches a visible kundeAdresse
        if (visibleKundeAdressenForSendungen.size > 0 && visibleKundeAdressenForSendungen.has(order.kundeAdresse || "")) {
          return true;
        }
        return false;
      }
      return true;
    });

    // Apply filter for "Kein Versandprofil" checkbox (rows where versandprofilHinzugefuegt is false in checklistMap)
    if (isChecked13) {
      result = result.filter((order) => {
        if (order.type !== "Versandvorgang") return false;
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const hasVersandprofil = checklistData?.versandprofilHinzugefuegt ?? false;
        return !hasVersandprofil;
      });
    }

    // Apply filter for "Kein Versandlabel" checkbox (rows where paketlisteErstellt is false)
    if (isChecked14) {
      result = result.filter((order) => {
        if (order.type !== "Versandvorgang") return false;
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const hasVersandlabel = checklistData?.paketlisteErstellt ?? false;
        return !hasVersandlabel;
      });
    }

    // Apply filter for "Nicht versendet" checkbox (rows where versendet is false in checklistMap)
    if (isChecked7) {
      result = result.filter((order) => {
        if (order.type !== "Versandvorgang") return false;
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const isVersendet = checklistData?.versendet ?? false;
        return !isVersendet;
      });
    }

    // Apply filter for "Keine Pickliste" checkbox (rows where picklisteErstellt is false in checklistMap)
    if (isChecked8) {
      result = result.filter((order) => {
        if (order.type !== "Versandvorgang") return false;
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const hasPickliste = checklistData?.picklisteErstellt ?? false;
        return !hasPickliste;
      });
    }

    // Apply filter for "Keine Packliste" checkbox (rows where packlisteErstellt is false in checklistMap)
    if (isChecked10) {
      result = result.filter((order) => {
        if (order.type !== "Versandvorgang") return false;
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        const checklistData = checklistMap.get(rowNr);
        const hasPackliste = checklistData?.packlisteErstellt ?? false;
        return !hasPackliste;
      });
    }

    // Apply filter for Importquelle dropdown
    if (importquelle && importquelle !== "Alle") {
      result = result.filter((order) => order.importquelle === importquelle);
    }

    // Apply filter for Kaufdatum
    if (kaufdatum?.from) {
      const fromDate = format(kaufdatum.from, "yyyy-MM-dd");
      const toDate = kaufdatum.to ? format(kaufdatum.to, "yyyy-MM-dd") : fromDate;
      result = result.filter((order) => {
        const orderDate = order.kaufdatum;
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Apply filter for Importdatum
    if (importdatum?.from) {
      const fromDate = format(importdatum.from, "yyyy-MM-dd");
      const toDate = importdatum.to ? format(importdatum.to, "yyyy-MM-dd") : fromDate;
      result = result.filter((order) => {
        const orderDate = order.importdatum;
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Apply filter for "Zuletzt importiert" checkbox (importdatum = "2025-12-09" or "09.12.2025")
    if (isChecked) {
      result = result.filter(
        (order) => order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025"
      );
    }

    // Apply filter for "Fehler" checkbox (Sendungen) - rows where "Fehler" icon is visible based on checklistData.fehler
    if (isChecked12) {
      result = result.filter((order) => {
        const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
        if (rowNr === null) return false;
        
        const checklistData = checklistMap.get(rowNr);
        const hasError = checklistData?.fehler ?? false;
        return hasError;
      });
    }

    // Apply filter for "DHL National" checkbox (versandprofil is "DHL National")
    if (isChecked5) {
      result = result.filter(
        (order) => order.versandprofil === "DHL National"
      );
    }

    // Apply filter for "DPD Europa" checkbox (versandprofil is "DPD Europa" or "DPD International")
    if (isChecked6) {
      result = result.filter(
        (order) => order.versandprofil === "DPD Europa" || order.versandprofil === "DPD International"
      );
    }

    // Apply filter for "UPS USA" checkbox (versandprofil is "UPS USA")
    if (isChecked11) {
      result = result.filter(
        (order) => order.versandprofil === "UPS USA"
      );
    }

    // Note: Filters for "Rechnungen nicht versendet" and "Bestellungen bezahlt, nicht gesendet"
    // are intentionally NOT applied to the Sendungen table - they only apply to Bestellungen table

    // Filter IN Versandvorgang rows (this is for the Sendungen table)
    result = result.filter((order) => order.type === "Versandvorgang");

    // Apply duplicate address filtering based on user choice
    if (combineDuplicateAddresses === true) {
      // Show only one row per duplicate address (keep first occurrence based on nr)
      const seenAddresses = new Set<string>();
      result = result.filter((order) => {
        const addr = order.kundeAdresse || "";
        if (seenAddresses.has(addr)) {
          return false; // Hide duplicates
        }
        seenAddresses.add(addr);
        return true; // Show first occurrence
      });
    } else if (combineDuplicateAddresses === false) {
      // Show all rows (both/all duplicates) - no filtering needed, all are already shown
      // This is the default behavior, so we don't need to do anything
    }
    // If combineDuplicateAddresses is null, don't apply duplicate filtering

    // Apply filter for history selection
    if (selectedHistory && selectedHistory !== 'Alle') {
      const parts = selectedHistory.split('|');
      if (parts.length === 3) {
        const [date, column, type] = parts;
        if (type === 'sendung') {
          result = result.filter((order) => {
            const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
            if (rowNr === null) return false;
            
            if (column === 'versandtGemeldet') {
              return order.versandtGemeldet === date;
            } else if (column === 'versanddatum') {
              return order.versanddatum === date;
            } else if (column === 'picklisteErstellt') {
              return sendungenDateMaps.picklisteMap.get(rowNr) === date;
            } else if (column === 'packlisteErstellt') {
              return sendungenDateMaps.packlisteMap.get(rowNr) === date;
            } else if (column === 'versandprofilHinzugefuegt') {
              return sendungenDateMaps.versandprofilHinzugefuegtMap.get(rowNr) === date;
            }
            return false;
          });
        }
      }
    }

    // Sort by nr (ascending)
    result.sort((a, b) => {
      const aNr = typeof a.nr === "number" ? a.nr : parseInt(String(a.nr)) || 0;
      const bNr = typeof b.nr === "number" ? b.nr : parseInt(String(b.nr)) || 0;
      return aNr - bNr;
    });

    // Return a new array reference to ensure React detects changes
    return result;
  }, [ordersState2, importquelle, kaufdatum, importdatum, isChecked, isChecked5, isChecked6, isChecked7, isChecked8, isChecked10, isChecked11, isChecked12, isChecked13, isChecked14, checklistMap, visibleKundeAdressenForSendungen, combineDuplicateAddresses, selectedHistory, sendungenDateMaps]);

  // filteredOrders for BestellungSheet navigation - uses Bestellungen table data
  // Must be declared here after filteredData1 and filteredData2 are defined
  const filteredOrders = React.useMemo(() => {
    return filteredData1;
  }, [filteredData1]);

  // filteredShipments for SendungSheet navigation - uses Sendungen table data
  const filteredShipments = React.useMemo(() => {
    return filteredData2;
  }, [filteredData2]);


  // BestellungSheet navigation helpers - must be declared after filteredOrders
  const currentIndex = selectedOrder ? filteredOrders.findIndex((o) => o.nr === selectedOrder.nr) : -1;
  const showArrows = filteredOrders.length > 1;

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setSelectedOrder(filteredOrders[currentIndex - 1]);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < filteredOrders.length - 1) {
      setSelectedOrder(filteredOrders[currentIndex + 1]);
    }
  };

  // SendungSheet navigation helpers - must be declared after filteredShipments
  const currentShipmentIndex = selectedShipment ? filteredShipments.findIndex((o) => o.nr === selectedShipment.nr) : -1;
  const showShipmentArrows = filteredShipments.length > 1;

  const handlePrevClickShipment = () => {
    if (currentShipmentIndex > 0) {
      setSelectedShipment(filteredShipments[currentShipmentIndex - 1]);
    }
  };

  const handleNextClickShipment = () => {
    if (currentShipmentIndex < filteredShipments.length - 1) {
      setSelectedShipment(filteredShipments[currentShipmentIndex + 1]);
    }
  };

  // Keyboard navigation for BestellungSheet
  React.useEffect(() => {
    if (!isSheetOpen || !showArrows) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevClick();
      } else if (e.key === "ArrowRight") {
        handleNextClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSheetOpen, showArrows, currentIndex, filteredOrders]);

  // Keyboard navigation for SendungSheet
  React.useEffect(() => {
    if (!isSendungSheetOpen || !showShipmentArrows) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevClickShipment();
      } else if (e.key === "ArrowRight") {
        handleNextClickShipment();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSendungSheetOpen, showShipmentArrows, currentShipmentIndex, filteredShipments]);

  // Handle Enter key to open sheet with first marked/selected row
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Enter key when sheets are closed and not in an input/textarea/button
      if (e.key !== "Enter") return;
      if (isSheetOpen || isSendungSheetOpen) return;
      
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLButtonElement ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      // Get active table's data
      const activeMarkedRows = activeTab === "rechnung" ? markedRows1 : markedRows2;
      const activeRowSelection = activeTab === "rechnung" ? rowSelection1 : rowSelection2;
      const activeFilteredData = activeTab === "rechnung" ? filteredData1 : filteredData2;

      // Find first marked row (markedRows uses order.nr as key)
      let firstRow: Order | null = null;
      if (activeMarkedRows.size > 0) {
        const firstMarkedNr = Array.from(activeMarkedRows)[0];
        firstRow = activeFilteredData.find(order => order.nr === firstMarkedNr) || null;
      }

      // If no marked row, find first selected row (rowSelection uses row index as key)
      if (!firstRow && Object.keys(activeRowSelection).length > 0) {
        const selectedIndices = Object.keys(activeRowSelection)
          .map(Number)
          .filter(idx => activeRowSelection[idx] === true)
          .sort((a, b) => a - b);
        if (selectedIndices.length > 0) {
          const firstSelectedIndex = selectedIndices[0];
          firstRow = activeFilteredData[firstSelectedIndex] || null;
        }
      }

      // Open appropriate sheet with first row if found
      if (firstRow) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Set both states together to avoid timing issues
        if (activeTab === "versand") {
          setSelectedShipment(firstRow);
          setIsSendungSheetOpen(true);
        } else {
          setSelectedOrder(firstRow);
          setIsSheetOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true); // Use capture phase to catch early
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isSheetOpen, isSendungSheetOpen, activeTab, markedRows1, markedRows2, rowSelection1, rowSelection2, filteredData1, filteredData2]);

  // Handle sheet resizing
  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      // Constrain width between 300px and 90% of viewport
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.9;
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setSheetWidth(constrainedWidth);
      setResponsiveSheetWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Separate row reorder handlers for each table
  const handleRowReorder1 = React.useCallback((fromIndex: number, toIndex: number) => {
    // Get the actual items from filteredData1
    const fromItem = filteredData1[fromIndex];
    const toItem = filteredData1[toIndex];
    
    if (!fromItem || !toItem) return;
    
    // Find indices in ordersState1
    const fromStateIndex = ordersState1.findIndex(o => o.nr === fromItem.nr);
    const toStateIndex = ordersState1.findIndex(o => o.nr === toItem.nr);
    
    if (fromStateIndex === -1 || toStateIndex === -1) return;
    
    setOrdersState1((prevOrders) => {
      const newOrders = [...prevOrders];
      const [movedItem] = newOrders.splice(fromStateIndex, 1);
      newOrders.splice(toStateIndex, 0, movedItem);
      return newOrders;
    });
  }, [filteredData1, ordersState1]);
  
  const handleRowReorder2 = React.useCallback((fromIndex: number, toIndex: number) => {
    // Get the actual items from filteredData2
    const fromItem = filteredData2[fromIndex];
    const toItem = filteredData2[toIndex];
    
    if (!fromItem || !toItem) return;
    
    // Find indices in ordersState2
    const fromStateIndex = ordersState2.findIndex(o => o.nr === fromItem.nr);
    const toStateIndex = ordersState2.findIndex(o => o.nr === toItem.nr);
    
    if (fromStateIndex === -1 || toStateIndex === -1) return;
    
    setOrdersState2((prevOrders) => {
      const newOrders = [...prevOrders];
      const [movedItem] = newOrders.splice(fromStateIndex, 1);
      newOrders.splice(toStateIndex, 0, movedItem);
      return newOrders;
    });
  }, [filteredData2, ordersState2]);

  // Handle row marking for table 1
  const handleRowMark1 = React.useCallback((row: Order, event: React.MouseEvent, rowIndex: number) => {
    const rowNr = row.nr;
    // rowIndex is already the correct index in the sorted table rows
    const currentIndex = rowIndex;
    
    if (event.shiftKey && lastMarkedRowId1 !== null) {
      // Shift+click: mark or unmark all rows between lastMarkedRowId and currentIndex
      // Find the last marked row's index in the current sorted table
      // Use visibleRows1 which contains the sorted and filtered rows
      const sortedRows = visibleRows1.length > 0 ? visibleRows1 : filteredData1;
      const lastMarkedIndex = sortedRows.findIndex(r => r.nr === lastMarkedRowId1);
      
      // If we found the last marked row, use range selection
      if (lastMarkedIndex !== -1) {
        const start = Math.min(lastMarkedIndex, currentIndex);
        const end = Math.max(lastMarkedIndex, currentIndex);
        const newMarked = new Set(markedRows1);
        
        // Check if the clicked row is marked - if so, unmark the range; otherwise mark it
        const isCurrentRowMarked = markedRows1.has(rowNr);
        
        // Use the sorted/filtered data order (which matches table.getRowModel().rows)
        // Use visibleRows1 which contains the sorted and filtered rows
        const sortedRows = visibleRows1.length > 0 ? visibleRows1 : filteredData1;
        for (let i = start; i <= end; i++) {
          if (i >= 0 && i < sortedRows.length) {
            if (isCurrentRowMarked) {
              // Unmark all rows in the range
              newMarked.delete(sortedRows[i].nr);
            } else {
              // Mark all rows in the range
              newMarked.add(sortedRows[i].nr);
            }
          }
        }
        
        setMarkedRows1(newMarked);
        setLastMarkedRowId1(rowNr);
      } else {
        // Last marked row not found in current data, just toggle current row
        const newMarked = new Set(markedRows1);
        if (newMarked.has(rowNr)) {
          newMarked.delete(rowNr);
        } else {
          newMarked.add(rowNr);
        }
        setMarkedRows1(newMarked);
        setLastMarkedRowId1(rowNr);
      }
    } else {
      // Single click: toggle mark state
      const newMarked = new Set(markedRows1);
      if (newMarked.has(rowNr)) {
        newMarked.delete(rowNr);
      } else {
        newMarked.add(rowNr);
      }
      setMarkedRows1(newMarked);
      setLastMarkedRowId1(rowNr);
    }
  }, [filteredData1, visibleRows1, markedRows1, lastMarkedRowId1]);

  // Handle row marking for table 2
  const handleRowMark2 = React.useCallback((row: Order, event: React.MouseEvent, rowIndex: number) => {
    const rowNr = row.nr;
    // rowIndex is already the correct index in the sorted table rows
    const currentIndex = rowIndex;
    
    if (event.shiftKey && lastMarkedRowId2 !== null) {
      // Shift+click: mark or unmark all rows between lastMarkedRowId and currentIndex
      // Find the last marked row's index in the current sorted table
      // Use visibleRows2 which contains the sorted and filtered rows
      const sortedRows = visibleRows2.length > 0 ? visibleRows2 : filteredData2;
      const lastMarkedIndex = sortedRows.findIndex(r => r.nr === lastMarkedRowId2);
      
      // If we found the last marked row, use range selection
      if (lastMarkedIndex !== -1) {
        const start = Math.min(lastMarkedIndex, currentIndex);
        const end = Math.max(lastMarkedIndex, currentIndex);
        const newMarked = new Set(markedRows2);
        
        // Check if the clicked row is marked - if so, unmark the range; otherwise mark it
        const isCurrentRowMarked = markedRows2.has(rowNr);
        
        // Use the sorted/filtered data order (which matches table.getRowModel().rows)
        // Use visibleRows2 which contains the sorted and filtered rows
        const sortedRows = visibleRows2.length > 0 ? visibleRows2 : filteredData2;
        for (let i = start; i <= end; i++) {
          if (i >= 0 && i < sortedRows.length) {
            if (isCurrentRowMarked) {
              // Unmark all rows in the range
              newMarked.delete(sortedRows[i].nr);
            } else {
              // Mark all rows in the range
              newMarked.add(sortedRows[i].nr);
            }
          }
        }
        
        setMarkedRows2(newMarked);
        setLastMarkedRowId2(rowNr);
      } else {
        // Last marked row not found in current data, just toggle current row
        const newMarked = new Set(markedRows2);
        if (newMarked.has(rowNr)) {
          newMarked.delete(rowNr);
        } else {
          newMarked.add(rowNr);
        }
        setMarkedRows2(newMarked);
        setLastMarkedRowId2(rowNr);
      }
    } else {
      // Single click: toggle mark state
      const newMarked = new Set(markedRows2);
      if (newMarked.has(rowNr)) {
        newMarked.delete(rowNr);
      } else {
        newMarked.add(rowNr);
      }
      setMarkedRows2(newMarked);
      setLastMarkedRowId2(rowNr);
    }
  }, [filteredData2, visibleRows2, markedRows2, lastMarkedRowId2]);

  // Handle delete for table 1
  const handleDelete1 = React.useCallback((rows: Order[]) => {
    setOrdersState1((prevOrders) => {
      const rowsToDelete = new Set(rows.map(r => r.nr));
      return prevOrders.filter(order => !rowsToDelete.has(order.nr));
    });
    // Clear marked rows that were deleted
    setMarkedRows1((prevMarked) => {
      const newMarked = new Set(prevMarked);
      rows.forEach(row => newMarked.delete(row.nr));
      return newMarked;
    });
  }, []);

  // Handle delete for table 2
  const handleDelete2 = React.useCallback((rows: Order[]) => {
    setOrdersState2((prevOrders) => {
      const rowsToDelete = new Set(rows.map(r => r.nr));
      return prevOrders.filter(order => !rowsToDelete.has(order.nr));
    });
    // Clear marked rows that were deleted
    setMarkedRows2((prevMarked) => {
      const newMarked = new Set(prevMarked);
      rows.forEach(row => newMarked.delete(row.nr));
      return newMarked;
    });
  }, []);

  // Handle click outside DataTable to unmark all rows
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both DataTable containers
      const isOutsideTable1 = dataTableRef1.current && !dataTableRef1.current.contains(target);
      const isOutsideTable2 = dataTableRef2.current && !dataTableRef2.current.contains(target);
      
      // If click is outside both tables and there are marked rows, clear them
      if (isOutsideTable1 && isOutsideTable2) {
        if (markedRows1.size > 0) {
          setMarkedRows1(new Set());
          setLastMarkedRowId1(null);
        }
        if (markedRows2.size > 0) {
          setMarkedRows2(new Set());
          setLastMarkedRowId2(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [markedRows1.size, markedRows2.size]);

  // Handle versandverpackung change
  const handleVerpackungChange = React.useCallback((row: Order, newValue: string) => {
    const updatedOrder = { ...row, versandverpackung: newValue };
    
    // Update in ordersState1
    setOrdersState1((prev) =>
      prev.map((order) => (order.nr === row.nr ? updatedOrder : order))
    );
    
    // Update in ordersState2
    setOrdersState2((prev) =>
      prev.map((order) => (order.nr === row.nr ? updatedOrder : order))
    );
    
    // Update selectedOrder if it's the same row
    if (selectedOrder?.nr === row.nr) {
      setSelectedOrder(updatedOrder);
    }
  }, [selectedOrder]);

  // Handle versandprofil change
  const handleProfilChange = React.useCallback((row: Order, newValue: string) => {
    // Determine versanddienstleister based on versandprofil
    let versanddienstleister = row.versanddienstleister; // Keep existing value by default
    
    if (newValue === "DHL National") {
      versanddienstleister = "DHL";
    } else if (newValue === "DPD Europa") {
      versanddienstleister = "DPD";
    } else if (newValue === "UPS USA") {
      versanddienstleister = "UPS";
    }
    
    const updatedOrder = { 
      ...row, 
      versandprofil: newValue,
      versanddienstleister: versanddienstleister
    };
    
    // Update in ordersState1
    setOrdersState1((prev) =>
      prev.map((order) => (order.nr === row.nr ? updatedOrder : order))
    );
    
    // Update in ordersState2
    setOrdersState2((prev) =>
      prev.map((order) => (order.nr === row.nr ? updatedOrder : order))
    );
    
    // Update selectedOrder if it's the same row
    if (selectedOrder?.nr === row.nr) {
      setSelectedOrder(updatedOrder);
    }
    
    // Update checklistMap: set versandprofilHinzugefuegt to TRUE
    const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
    if (rowNr !== null && (newValue === "DHL National" || newValue === "DPD Europa" || newValue === "UPS USA")) {
      setChecklistMap(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(rowNr) || {
          nr: rowNr,
          rechnungVersendet: false,
          sendungErstellt: false,
          versandprofilHinzugefuegt: false,
          picklisteErstellt: false,
          packlisteErstellt: false,
          paketlisteErstellt: false,
          versendet: false,
          fehler: false,
        };
        newMap.set(rowNr, { ...existing, versandprofilHinzugefuegt: true });
        return newMap;
      });
    }
  }, [selectedOrder]);

  // Handle versanddienstleister change
  const handleDienstleisterChange = React.useCallback((row: Order, newValue: string) => {
    const updatedOrder = { ...row, versanddienstleister: newValue };
    
    // Update in ordersState1
    setOrdersState1((prev) =>
      prev.map((order) => (order.nr === row.nr ? updatedOrder : order))
    );
    
    // Update in ordersState2
    setOrdersState2((prev) =>
      prev.map((order) => (order.nr === row.nr ? updatedOrder : order))
    );
    
    // Update selectedOrder if it's the same row
    if (selectedOrder?.nr === row.nr) {
      setSelectedOrder(updatedOrder);
    }
  }, [selectedOrder]);


  // Toggle mark/unmark all visible rows for table 1
  const handleToggleMarkAll1 = React.useCallback(() => {
    // Check if there are any marked rows
    const hasAnyMarked = markedRows1.size > 0;
    
    if (hasAnyMarked) {
      // Unmark all marked rows (not just visible ones)
      setMarkedRows1(new Set());
    } else {
      // Mark all visible rows
      const visibleRowCount = visibleRows1.length;
      if (visibleRowCount > 0) {
        const newMarked = new Set(markedRows1);
        visibleRows1.forEach(row => {
          newMarked.add(row.nr);
        });
        setMarkedRows1(newMarked);
      }
    }
  }, [visibleRows1, markedRows1]);

  // Toggle mark/unmark all visible rows for table 2
  const handleToggleMarkAll2 = React.useCallback(() => {
    // Check if there are any marked rows
    const hasAnyMarked = markedRows2.size > 0;
    
    if (hasAnyMarked) {
      // Unmark all marked rows (not just visible ones)
      setMarkedRows2(new Set());
    } else {
      // Mark all visible rows
      const visibleRowCount = visibleRows2.length;
      if (visibleRowCount > 0) {
        const newMarked = new Set(markedRows2);
        visibleRows2.forEach(row => {
          newMarked.add(row.nr);
        });
        setMarkedRows2(newMarked);
      }
    }
  }, [visibleRows2, markedRows2]);

  // handleToggleMarkAll - uses active table's data (changed from selection to marking)
  const handleToggleMarkAll = React.useCallback(() => {
    if (activeTab === "versand") {
      handleToggleMarkAll2();
    } else {
      handleToggleMarkAll1();
    }
  }, [activeTab, handleToggleMarkAll1, handleToggleMarkAll2]);


  // Toggle mark state of the current active row (selectedOrder)
  const handleToggleCurrentRowMark = React.useCallback(() => {
    if (!selectedOrder) return;
    
    const rowNr = selectedOrder.nr;
    const currentMarkedRows = activeTab === "versand" ? markedRows2 : markedRows1;
    const setCurrentMarkedRows = activeTab === "versand" ? setMarkedRows2 : setMarkedRows1;
    
    const newMarked = new Set(currentMarkedRows);
    if (newMarked.has(rowNr)) {
      newMarked.delete(rowNr);
    } else {
      newMarked.add(rowNr);
    }
    setCurrentMarkedRows(newMarked);
  }, [selectedOrder, activeTab, markedRows1, markedRows2]);

  // Check if the current row is marked
  const isCurrentRowMarked = React.useMemo(() => {
    if (!selectedOrder) return false;
    const currentMarkedRows = activeTab === "versand" ? markedRows2 : markedRows1;
    return currentMarkedRows.has(selectedOrder.nr);
  }, [selectedOrder, activeTab, markedRows1, markedRows2]);

  // Handle toggle mark for SendungSheet
  const handleToggleCurrentShipmentMark = React.useCallback(() => {
    if (!selectedShipment) return;
    
    const rowNr = selectedShipment.nr;
    const newMarked = new Set(markedRows2);
    if (newMarked.has(rowNr)) {
      newMarked.delete(rowNr);
    } else {
      newMarked.add(rowNr);
    }
    setMarkedRows2(newMarked);
  }, [selectedShipment, markedRows2]);

  // Check if the current shipment row is marked
  const isCurrentShipmentMarked = React.useMemo(() => {
    if (!selectedShipment) return false;
    return markedRows2.has(selectedShipment.nr);
  }, [selectedShipment, markedRows2]);

  // Check if any rows are marked
  const hasMarkedRows = React.useMemo(() => {
    const currentMarkedRows = activeTab === "versand" ? markedRows2 : markedRows1;
    return currentMarkedRows.size > 0;
  }, [activeTab, markedRows1, markedRows2]);

  // Function to check if action can proceed (has marked rows)
  const checkSelectionBeforeAction = React.useCallback((callback: () => void) => {
    if (!hasMarkedRows) {
      setShowNoSelectionAlert(true);
      return;
    }
    callback();
  }, [hasMarkedRows]);

  // Reset all filters
  const handleResetAllFilters = React.useCallback(() => {
    setIsChecked(false);
    setIsChecked2(false);
    setIsChecked3(false);
    setIsChecked4(false);
    setIsChecked9(false);
    setIsChecked5(false);
    setIsChecked6(false);
    setZeilennummern("");
    setKaufdatum(undefined);
    setImportdatum(undefined);
    setImportquelle("");
    setSteuerland("");
    setVersanddatum(undefined);
    setVersandland("");
    setVersandzielland("");
    setVersandprofil("");
    setVersanddienstleister("");
    setVersandverpackung("");
    setGlobalFilter("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Menu - horizontal on small screens, vertical on large screens */}
          <div className="w-[calc(100%-40px)] lg:w-[56px] h-auto lg:h-[calc(100vh-40px)] mt-5 lg:mt-[20px] lg:sticky lg:top-[20px] pl-4 pr-1 py-1 lg:pl-2 lg:pr-2 lg:py-4 bg-primary mx-5 lg:ml-5 lg:mr-2 rounded-[12px] flex-shrink-0 flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-2 lg:gap-4 mb-2 lg:mb-0" data-name="Menu">
            <Link to="/versions" className="w-fit lg:w-full flex items-center justify-center">
              <img src={logoPlus} alt="Logo" className="w-[90px] h-auto lg:hidden brightness-0 invert" />
              <img src={logo} alt="Logo" className="hidden lg:block w-[90%] h-auto brightness-0 invert" />
            </Link>
            {/* Burger menu button for small screens */}
            <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md bg-transparent hover:bg-white/15 transition-colors">
              <Menu className="size-5 text-white" />
            </button>
            {/* Original buttons for large screens */}
            <div className="hidden lg:flex flex-col gap-0.5 w-full mt-4">
              <Link to="/a/dashboard" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <LayoutDashboard className="size-5 text-white" />
              </Link>
              <div className="bg-white rounded-md p-0.5 flex flex-col gap-0">
                <Link to="/a/shipping" className="flex items-center justify-center w-full aspect-square rounded-md transition-colors">
                  <Truck className={`size-5 ${isShippingActive ? "text-gray-700" : "text-blue-500"}`} />
                </Link>
                <Link to="/a/shippingprofiles" className="flex items-center justify-center w-full aspect-square rounded-md transition-colors">
                  <Settings2 className={`size-5 ${isShippingProfilesActive ? "text-gray-700" : "text-blue-500"}`} />
                </Link>
              </div>
              <Link to="/a/tools" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <ToyBrick className="size-5 text-white" />
              </Link>
              <Link to="/a/settings" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <Settings className="size-5 text-white" />
              </Link>
              <div className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <HelpCircle className="size-5 text-white" />
              </div>
            </div>
            {/* Version number at bottom */}
            <div className="hidden lg:block mt-auto pt-4">
              <div className="text-white/70 text-xs text-center font-medium">
                v1.13
              </div>
            </div>
          </div>
          {/* Left part - 300px width */}
          <div className="hidden lg:block w-[300px] flex-shrink-0 py-[40px] px-[24px] border-r border-border" data-name="FilterDiv">
            {/* Search input at first place */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                value={activeTab === "rechnung" ? globalFilter1 : globalFilter2}
                onChange={(e) => {
                  if (activeTab === "rechnung") {
                    setGlobalFilter1(e.target.value);
                  } else {
                    setGlobalFilter2(e.target.value);
                  }
                }}
                className="pl-9 pr-9 bg-muted/40"
              />
              {((activeTab === "rechnung" ? globalFilter1 : globalFilter2).length > 0) && (
                <button
                  onClick={() => {
                    if (activeTab === "rechnung") {
                      setGlobalFilter1("");
                    } else {
                      setGlobalFilter2("");
                    }
                  }}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  type="button"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Accordion type="multiple" defaultValue={["item-0", "item-4"]} className="w-full">
              <AccordionItem value="item-0" className="border-b border-border">
                <AccordionTrigger 
                  className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                  indicator={
                    (isChecked || isChecked2 || isChecked3 || isChecked4 || isChecked12) ? (
                      <Circle className="h-2 w-2 shrink-0 text-primary fill-primary" />
                    ) : undefined
                  }
                >
                  Spezialfilter
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-3 items-stretch">
                    {filterItems
                      .filter((item) => {
                        // When Bestellungen tab is active (rechnung), show only these items
                        if (activeTab === "rechnung") {
                          return ["new-orders-checkbox-2", "new-orders-checkbox-3", "new-orders-checkbox-4"].includes(item.id);
                        }
                        // When Sendungen tab is active, show only these items
                        if (activeTab === "versand") {
                          return ["new-orders-checkbox-13", "new-orders-checkbox-14", "new-orders-checkbox-5", "new-orders-checkbox-6", "new-orders-checkbox-7", "new-orders-checkbox-12"].includes(item.id);
                        }
                        return true;
                      })
                      .map((item) => (
                      <div
                        key={item.id}
                          className={cn(
                            "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] bg-background shadow-xs",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:bg-accent focus-visible:text-accent-foreground"
                          )}
                        onClick={() => item.onCheckedChange(!item.checked)}
                      >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                            {item.count}
                          </div>
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={(checked) => {
                              item.onCheckedChange(checked === true);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <Label
                          htmlFor={item.id}
                          className={cn(
                            "text-[0.8rem] leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words antialiased",
                            item.checked ? "font-medium" : "font-normal"
                          )}
                        >
                          {item.label === "Kein Versandvorgang" ? (
                            <>
                              Kein Versand-
                              <br />
                              vorgang erstellt
                            </>
                          ) : (
                            item.label
                          )}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-5">
                  <Button variant="link" className="p-0 h-auto text-sm font-normal mb-2">
                    <Plus className="size-4" />
                    Spezialfilter hinzufügen
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            {/* Versandprofile accordion - shown only when Sendungen tab is active */}
            {activeTab === "versand" && (
              <AccordionItem value="item-4" className="border-b border-border">
                <AccordionTrigger 
                  className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                  indicator={
                    (isChecked9 || isChecked5 || isChecked6 || isChecked11) ? (
                      <Circle className="h-2 w-2 shrink-0 text-primary fill-primary" />
                    ) : undefined
                  }
                >
                  Versandprofile
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-3 items-stretch">
                    {filterItems2.map((item) => (
                      <div
                        key={item.id}
                          className={cn(
                            "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] bg-background shadow-xs",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:bg-accent focus-visible:text-accent-foreground"
                          )}
                        onClick={() => item.onCheckedChange(!item.checked)}
                      >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          {item.label === "DHL National" ? (
                            <img 
                              src={logoDHL} 
                              alt="DHL" 
                              className="h-8 w-auto"
                            />
                          ) : item.label === "DPD Europa" ? (
                            <img 
                              src={logoDPD} 
                              alt="DPD" 
                              className="h-8 w-auto"
                            />
                          ) : item.label === "UPS USA" ? (
                            <img 
                              src={logoUPS} 
                              alt="UPS" 
                              className="h-8 w-auto"
                            />
                          ) : (
                            <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                              {item.count}
                            </div>
                          )}
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={(checked) => {
                              item.onCheckedChange(checked === true);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <Label
                          htmlFor={item.id}
                          className={cn(
                            "text-[0.8rem] leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words antialiased",
                            item.checked ? "font-medium" : "font-normal"
                          )}
                        >
                          {item.label === "Kein Versandvorgang" ? (
                            <>
                              Kein Versand-
                              <br />
                              vorgang erstellt
                            </>
                          ) : (
                            item.label
                          )}
                        </Label>
                      </div>
                    </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-5">
                    <Link to="/a/shippingprofiles">
                      <Button variant="link" className="p-0 h-auto text-sm font-normal mb-2">
                        Bearbeiten
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
              <AccordionItem value="item-1" className="border-b border-border">
                <AccordionTrigger 
                  className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                  indicator={
                    (zeilennummern || kaufdatum || importdatum || importquelle) ? (
                      <Circle className="h-2 w-2 shrink-0 text-primary fill-primary" />
                    ) : undefined
                  }
                >
                  Allgemeine Filter
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 px-1 mt-2 mb-5">
                    <div className="space-y-2">
                      <Label htmlFor="zeilennummern" className="text-sm font-medium">
                        Zeilennummern
                      </Label>
                      <Input
                        id="zeilennummern"
                        type="text"
                        className="w-full"
                        value={zeilennummern}
                        onChange={(e) => setZeilennummern(e.target.value)}
                        placeholder="z.B. 1-5, 8, 20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kaufdatum-field" className="text-sm font-medium">
                        Kaufdatum
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="kaufdatum-field"
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal",
                              !kaufdatum && "text-muted-foreground"
                            )}
                          >
                            {kaufdatum?.from ? (
                              kaufdatum.to ? (
                                <>
                                  {format(kaufdatum.from, "dd.MM.yyyy")} -{" "}
                                  {format(kaufdatum.to, "dd.MM.yyyy")}
                                </>
                              ) : (
                                format(kaufdatum.from, "dd.MM.yyyy")
                              )
                            ) : (
                              <span>Zeitraum wählen</span>
                            )}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            numberOfMonths={2}
                            selected={kaufdatum}
                            onSelect={setKaufdatum}
                            locale={de}
                            weekStartsOn={0}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="importdatum-field" className="text-sm font-medium">
                        Importdatum
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="importdatum-field"
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal",
                              !importdatum && "text-muted-foreground"
                            )}
                          >
                            {importdatum?.from ? (
                              importdatum.to ? (
                                <>
                                  {format(importdatum.from, "dd.MM.yyyy")} -{" "}
                                  {format(importdatum.to, "dd.MM.yyyy")}
                                </>
                              ) : (
                                format(importdatum.from, "dd.MM.yyyy")
                              )
                            ) : (
                              <span>Zeitraum wählen</span>
                            )}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            numberOfMonths={2}
                            selected={importdatum}
                            onSelect={setImportdatum}
                            locale={de}
                            weekStartsOn={0}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="importquelle" className="text-sm font-medium">
                        Importquelle
                      </Label>
                      <Select value={importquelle} onValueChange={setImportquelle}>
                        <SelectTrigger id="importquelle" className="w-full">
                          <SelectValue placeholder="Importquelle auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alle">Alle</SelectItem>
                          <SelectItem value="Amazon API">Amazon API</SelectItem>
                          <SelectItem value="Shopify">Shopify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-border">
                <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                  Rechnung
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 px-1 mt-2 mb-5">
                    <div className="space-y-2">
                      <Label htmlFor="steuerland" className="text-sm font-medium">
                        Steuerland
                      </Label>
                      <Select value={steuerland} onValueChange={setSteuerland}>
                        <SelectTrigger id="steuerland" className="w-full">
                          <SelectValue placeholder="Land auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {versandlandOptions.map((land) => (
                            <SelectItem key={land} value={land}>
                              {land}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            {/* Versand accordion - shown only when Sendungen tab is active */}
            {activeTab === "versand" && (
              <AccordionItem value="item-3" className="border-b border-border">
                <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                  Versand
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 px-1 mt-2 mb-5">
                    <div className="space-y-2">
                      <Label htmlFor="versanddatum" className="text-sm font-medium">
                        Versanddatum
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="versanddatum"
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal",
                              !versanddatum && "text-muted-foreground"
                            )}
                          >
                            {versanddatum?.from ? (
                              versanddatum.to ? (
                                <>
                                  {format(versanddatum.from, "dd.MM.yyyy")} -{" "}
                                  {format(versanddatum.to, "dd.MM.yyyy")}
                                </>
                              ) : (
                                format(versanddatum.from, "dd.MM.yyyy")
                              )
                            ) : (
                              <span>Zeitraum wählen</span>
                            )}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            numberOfMonths={2}
                            selected={versanddatum}
                            onSelect={setVersanddatum}
                            locale={de}
                            weekStartsOn={0}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="versandland" className="text-sm font-medium">
                        Versandland
                      </Label>
                      <Select value={versandland} onValueChange={setVersandland}>
                        <SelectTrigger id="versandland" className="w-full">
                          <SelectValue placeholder="Land auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {versandlandOptions.map((land) => (
                            <SelectItem key={land} value={land}>
                              {land}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="versandzielland" className="text-sm font-medium">
                        Versandzielland
                      </Label>
                      <Select value={versandzielland} onValueChange={setVersandzielland}>
                        <SelectTrigger id="versandzielland" className="w-full">
                          <SelectValue placeholder="Land auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {versandlandOptions.map((land) => (
                            <SelectItem key={land} value={land}>
                              {land}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Versandprofil field - shown only when Sendungen tab is active */}
                    {activeTab === "versand" && (
                    <div className="space-y-2">
                      <Label htmlFor="versandprofil" className="text-sm font-medium">
                        Versandprofil
                      </Label>
                      <Select value={versandprofil} onValueChange={setVersandprofil}>
                        <SelectTrigger id="versandprofil" className="w-full">
                          <SelectValue placeholder="Profil auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {versandprofilOptions.map((profil) => (
                            <SelectItem key={profil} value={profil || ""}>
                              {profil}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="versanddienstleister" className="text-sm font-medium">
                        Versanddienstleister
                      </Label>
                      <Select value={versanddienstleister} onValueChange={setVersanddienstleister}>
                        <SelectTrigger id="versanddienstleister" className="w-full">
                          <SelectValue placeholder="Dienstleister auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {versanddienstleisterOptions.map((dienstleister) => (
                            <SelectItem key={dienstleister} value={dienstleister}>
                              {dienstleister}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="versandverpackung" className="text-sm font-medium">
                        Versandverpackung
                      </Label>
                      <Select value={versandverpackung} onValueChange={setVersandverpackung}>
                        <SelectTrigger id="versandverpackung" className="w-full">
                          <SelectValue placeholder="Verpackung auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {versandverpackungOptions.map((verpackung) => (
                            <SelectItem key={verpackung} value={verpackung}>
                              {verpackung}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            {/* Historie accordion */}
            <AccordionItem value="item-5" className="border-b border-border">
              <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                Historie
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-1 mt-2 mb-5">
                  <div className="space-y-2">
                    <Select 
                      key={`historie-${activeTab}-${selectedHistoryForDisplay ? 'controlled' : 'uncontrolled'}`}
                      {...(selectedHistoryForDisplay ? { value: selectedHistoryForDisplay } : {})}
                      onValueChange={(value) => {
                        setSelectedHistoryByTab(prev => ({
                          ...prev,
                          [activeTab]: value || ""
                        }));
                      }}
                    >
                      <SelectTrigger id="historie" className="w-full [&>span]:!truncate [&>span]:!block [&>span]:!max-w-full">
                        <SelectValue placeholder="Ereignis auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alle" className="!pl-3 pr-3 [&>span:first-child]:hidden" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                          Alle Ereignisse anzeigen
                        </SelectItem>
                        <SelectSeparator />
                        {historyItems
                          .filter((item) => {
                            // When Bestellungen tab is active, hide sendung-specific actions
                            if (activeTab === "rechnung") {
                              const hiddenActions = [
                                "Versandprofil hinzugefügt",
                                "Versandlabel erstellt",
                                "Packliste erstellt",
                                "Pickliste erstellt",
                                "Versendet"
                              ];
                              return !hiddenActions.includes(item.action);
                            }
                            // When Sendungen tab is active, hide bestellung-specific actions
                            if (activeTab === "versand") {
                              const hiddenActions = [
                                "Rechnung versendet",
                                "Sendung erstellt"
                              ];
                              return !hiddenActions.includes(item.action);
                            }
                            // Show all items by default
                            return true;
                          })
                          .map((item) => (
                            <SelectItem key={item.value} value={item.value} className="pl-3 pr-3 [&>span:first-child]:hidden" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                              <span className="flex items-center">
                                <span className="shrink-0">{item.formattedDate}</span>
                                <span className="text-muted-foreground ml-3"> {item.action}</span>
                              </span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetAllFilters}
              className="h-9 w-full mt-8 bg-[#fbfbfb]"
            >
              <RotateCcw className="size-4" />
              Alle Filter zurücksetzen
            </Button>
          </div>

          {/* Right part - flexible width */}
          <div className="flex-1 min-w-0 px-6 py-5 lg:px-8 lg:py-10 flex flex-col gap-[28px]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h1>
                  Versand
              </h1>
              <div className="flex items-center gap-3">
                  {/* Label for screens under sm */}
                  <span className="text-sm font-medium sm:hidden">
                    {activeTab === "rechnung" ? "Bestellungen" : "Sendungen"}
                  </span>
                  <TabsList className="p-0 border shadow-xs bg-primary text-primary-foreground">
                    <TabsTrigger value="rechnung" className="h-9 w-9 px-0 sm:w-auto sm:px-3 data-[state=active]:bg-primary-foreground data-[state=active]:text-foreground">
                      <CreditCard className="size-4 sm:mr-2" />
                      <span className="hidden sm:inline">Bestellungen</span>
                    </TabsTrigger>
                    <TabsTrigger value="versand" className="h-9 w-9 px-0 sm:w-auto sm:px-3 data-[state=active]:bg-primary-foreground data-[state=active]:text-foreground">
                      <Package className="size-4 sm:mr-2" />
                      <span className="hidden sm:inline">Sendungen</span>
                    </TabsTrigger>
                  </TabsList>
              </div>
            </div>

            <div className="bg-background">
                <TabsContent value="rechnung">
                <div ref={dataTableRef1}>
                  <DataTable
                    columns={getColumns(activeTab, versandverpackungOptions, handleVerpackungChange, versandprofilOptions, handleProfilChange, versanddienstleisterOptions, handleDienstleisterChange, "rechnung", (row) => markedRows1.has(row.nr), fehlerRowNr, filteredData1.length, temporaryVisibleIcons, checklistMap, (rowNr, field, value) => {
                      setAnimatedButton({ rowNr, field: String(field), tableId: "rechnung", timestamp: Date.now() });
                      setTimeout(() => setAnimatedButton(null), 300);
                      setChecklistMap(prev => {
                        const newMap = new Map(prev);
                        const existing = newMap.get(rowNr) || {
                          nr: rowNr,
                          rechnungVersendet: false,
                          sendungErstellt: false,
                          versandprofilHinzugefuegt: false,
                          picklisteErstellt: false,
                          packlisteErstellt: false,
                          paketlisteErstellt: false,
                          versendet: false,
                          fehler: false,
                        };
                        newMap.set(rowNr, { ...existing, [field]: value });
                        return newMap;
                      });
                    }, animatedButton)}
                    data={filteredData1}
                    getRowId={(row) => String(row.nr)}
                    enableGlobalFilter={true}
                    globalFilter={globalFilter1}
                    onGlobalFilterChange={setGlobalFilter1}
                    searchPlaceholder="Suchen..."
                    columnLabels={columnLabels1}
                    columnVisibility={rechnungColumnVisibility}
                    onColumnVisibilityChange={setRechnungColumnVisibility}
                    onRowDoubleClick={handleRowDoubleClick}
                    onRowMark={handleRowMark1}
                    onFilteredDataChange={handleFilteredDataChange1}
                    isRowSelected={(row) => isSheetOpen && selectedOrder?.nr === row.nr}
                    isRowMarked={(row) => markedRows1.has(row.nr)}
                    getMarkedRows={() => filteredData1.filter(row => markedRows1.has(row.nr))}
                    onRowDelete={handleDelete1}
                    rowSelection={rowSelection1}
                    tableName="BestellungenTable"
                    onRowSelectionChange={setRowSelection1}
                    enableRowDrag={true}
                    onRowReorder={handleRowReorder1}
                    onShowRelatedShipments={handleShowRelatedShipments}
                    toolbarLeft={
                      <>
                        <Button 
                          className="h-9 w-9 shadow-sm"
                          onClick={() => {
                            setRefreshIconRotation(prev => prev + 180);
                            const { bestellungenData, sendungenData, checklistMap: newChecklistMap } = loadCSVData();
                            setOrdersState1(bestellungenData);
                            setOrdersState2(sendungenData);
                            setChecklistMap(newChecklistMap);
                            toast.success("Daten wurden erfolgreich geladen");
                          }}
                        >
                          <RefreshCw 
                            className="size-4 transition-transform duration-500" 
                            style={{ transform: `rotate(${refreshIconRotation}deg)` }}
                          />
                        </Button>
                        <Label className="text-sm font-medium flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-0.5">
                          <span>Daten</span>
                          <span className="sm:ml-0.5">aktualisieren</span>
                        </Label>
                      </>
                    }
                    toolbarAfterChecklist={
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-9 w-9 sm:w-auto lg:w-9"
                        onClick={() => setIsFilterSheetOpen(true)}
                      >
                        <Filter className="size-4" />
                        <span className="hidden sm:inline lg:hidden">Filter</span>
                      </Button>
                    }
                  />
                </div>
                </TabsContent>
                <TabsContent value="versand">
                  <div ref={dataTableRef2}>
                    <DataTable
                      columns={getColumns(activeTab, versandverpackungOptions, handleVerpackungChange, versandprofilOptions, handleProfilChange, versanddienstleisterOptions, handleDienstleisterChange, "versand", (row) => markedRows2.has(row.nr), fehlerRowNr, filteredData2.length, temporaryVisibleIcons, checklistMap, (rowNr, field, value) => {
                        setAnimatedButton({ rowNr, field: String(field), tableId: "versand", timestamp: Date.now() });
                        setTimeout(() => setAnimatedButton(null), 300);
                        setChecklistMap(prev => {
                          const newMap = new Map(prev);
                          const existing = newMap.get(rowNr) || {
                            nr: rowNr,
                            rechnungVersendet: false,
                            sendungErstellt: false,
                            versandprofilHinzugefuegt: false,
                            picklisteErstellt: false,
                            packlisteErstellt: false,
                            paketlisteErstellt: false,
                            versendet: false,
                            fehler: false,
                          };
                          newMap.set(rowNr, { ...existing, [field]: value });
                          return newMap;
                        });
                      }, animatedButton)}
                      data={filteredData2}
                      getRowId={getRowId}
                    enableGlobalFilter={true}
                    globalFilter={globalFilter2}
                    onGlobalFilterChange={setGlobalFilter2}
                    searchPlaceholder="Suchen..."
                    columnLabels={columnLabels2}
                    columnVisibility={versandColumnVisibility}
                    onColumnVisibilityChange={setVersandColumnVisibility}
                    onRowDoubleClick={handleRowDoubleClick}
                    onRowMark={handleRowMark2}
                    onFilteredDataChange={handleFilteredDataChange2}
                    isRowSelected={(row) => isSheetOpen && selectedOrder?.nr === row.nr}
                    isRowMarked={(row) => markedRows2.has(row.nr)}
                    getMarkedRows={() => filteredData2.filter(row => markedRows2.has(row.nr))}
                    onRowDelete={handleDelete2}
                    rowSelection={rowSelection2}
                    onRowSelectionChange={setRowSelection2}
                    enableRowDrag={true}
                    onRowReorder={handleRowReorder2}
                    tableName="VersandvorgaengeTable"
                    onShowRelatedShipments={handleShowRelatedBestellungen}
                    relatedItemsLabel={{ singular: "Dazugehörige Bestellung anzeigen", plural: "Dazugehörige Bestellungen anzeigen" }}
                    toolbarLeft={
                      <>
                        <Button 
                          className="h-9 w-9 shadow-sm"
                          onClick={() => {
                            setRefreshIconRotation(prev => prev + 180);
                            const { bestellungenData, sendungenData, checklistMap: newChecklistMap } = loadCSVData();
                            setOrdersState1(bestellungenData);
                            setOrdersState2(sendungenData);
                            setChecklistMap(newChecklistMap);
                            toast.success("Daten wurden erfolgreich geladen");
                          }}
                        >
                          <RefreshCw 
                            className="size-4 transition-transform duration-500" 
                            style={{ transform: `rotate(${refreshIconRotation}deg)` }}
                          />
                        </Button>
                        <Label className="text-sm font-medium flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-0.5">
                          <span>Daten</span>
                          <span className="sm:ml-0.5">aktualisieren</span>
                        </Label>
                      </>
                    }
                    toolbarAfterChecklist={
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-9 w-9 sm:w-auto lg:w-9"
                        onClick={() => setIsFilterSheetOpen(true)}
                      >
                        <Filter className="size-4" />
                        <span className="hidden sm:inline lg:hidden">Filter</span>
                      </Button>
                    }
                  />
                  </div>
                </TabsContent>
            </div>
              </Tabs>
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
      }}>
        <SheetContent
          name="BestellungSheet"
          side="right"
          className="overflow-y-auto p-6 lg:p-10 pb-[90px] !max-w-full lg:!max-w-none"
          style={isSmallScreen ? { width: '100%', maxWidth: '100%' } : { width: `${responsiveSheetWidth}px`, maxWidth: `${responsiveSheetWidth}px` }}
          onPrevClick={showArrows ? handlePrevClick : undefined}
          onNextClick={showArrows ? handleNextClick : undefined}
          isPrevDisabled={currentIndex <= 0}
          isNextDisabled={currentIndex >= filteredOrders.length - 1}
          onToggleSelectAll={handleToggleCurrentRowMark}
          allRowsSelected={isCurrentRowMarked}
          aria-label="bestellung"
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors z-50"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          />
          <div className={`flex items-center gap-2 mb-1 ${isUnderSm ? 'mt-12' : 'mt-4'}`}>
            <CreditCard className="size-4" />
            <span className="text-sm">Bestellung</span>
          </div>
          <SheetTitle className={`font-bold tracking-tight text-foreground mb-2 mt-4`}>
            #{selectedOrder?.bestellnummer}
          </SheetTitle>
          {selectedOrder && (() => {
            // Helper: check if we should use wide layout (sheet width >= 640 AND window width >= 640)
            const useWideLayout = (sheetWidth ?? 1255) >= 640 && !isUnderSm;
            return (
            <div className={`mt-3 pb-[90px] ${(sheetWidth >= 1024 && !isUnderSm) ? 'grid grid-cols-[1fr_auto_1fr] gap-[32px] items-start' : 'space-y-6'}`}>
              {/* Left Column: Status, Kundendaten, Versand */}
              <div className={useWideLayout ? 'flex flex-col' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full">
                <AccordionItem value="item-1" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Status
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-0 mb-4 min-h-[120px] px-1">
                    {selectedOrder && (() => {
                      const rowNr = typeof selectedOrder.nr === 'number' ? selectedOrder.nr : parseInt(String(selectedOrder.nr)) || null;
                      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
                      
                      // Get today's date in YYYY-MM-DD format (only for temporary/created data)
                      const getTodayDate = () => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      };
                      
                      // Helper function to get date value: CSV data has priority, use today's date only if checklist is true but no CSV date exists
                      const getFloatingColDate = (checklistValue: boolean | undefined, csvDate: string | null | undefined) => {
                        if (!checklistValue) return null;
                        // If CSV has a date, use it (has priority)
                        if (csvDate && csvDate.trim() !== '') return csvDate;
                        // Otherwise, use today's date (temporary/created data)
                        return getTodayDate();
                      };
                      
                      // Helper component for status items
                      const StatusItem = ({ 
                        value, 
                        label, 
                        isFirst, 
                        isLast,
                        labelFalse,
                        labelActive: _labelActive,
                        labelTrue,
                        hasPreviousTrue: _hasPreviousTrue,
                        hasActiveBefore: _hasActiveBefore,
                        activeIcon: _activeIcon
                      }: { 
                        value: string | null | undefined, 
                        label: string,
                        isFirst?: boolean,
                        isLast?: boolean,
                        labelFalse?: string,
                        labelActive?: string,
                        labelTrue?: string,
                        hasPreviousTrue?: boolean,
                        hasActiveBefore?: boolean,
                        activeIcon?: string
                      }) => {
                        const hasValue = value && value.trim() !== '';
                        const isTrue = hasValue;
                        
                        // Determine which SVG to use based on state and position
                        let statusIcon = statusFalse;
                        if (isTrue) {
                          statusIcon = isFirst ? statusTrueTop : (isLast ? statusTrueBottom : statusTrue);
                        } else {
                          statusIcon = isFirst ? statusFalseTop : (isLast ? statusFalseBottom : statusFalse);
                        }
                        
                        // Determine label based on state (only true/false, no active)
                        let displayLabel = label;
                        if (isTrue && labelTrue) {
                          displayLabel = labelTrue;
                        } else if (!isTrue && labelFalse) {
                          displayLabel = labelFalse;
                        }
                        
                        return (
                          <div className="flex items-center justify-between gap-[12px] h-[40px]">
                            <div className="flex items-center gap-[10px]">
                              <img 
                                src={statusIcon} 
                                alt={isTrue ? "Status true" : "Status false"}
                                className="w-auto h-auto flex-shrink-0"
                              />
                              <span className={`text-sm font-normal ${isTrue ? 'text-foreground' : 'text-muted-foreground'}`}>{displayLabel}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{value ? formatDate(value) : ''}</span>
                          </div>
                        );
                      };
                      
                      // Helper to check if item has a value
                      const hasValueHelper = (val: string | null | undefined): boolean => !!(val && val.trim() !== '');
                      
                      // Determine states for all items to check for previous true items
                      const kaufdatumTrue = hasValueHelper(selectedOrder.kaufdatum);
                      const bezahltAmTrue = hasValueHelper(selectedOrder.bezahltAm);
                      const rechnungVersendetValue = getFloatingColDate(checklistData?.rechnungVersendet, selectedOrder.rechnungVersendetDatum);
                      const rechnungVersendetTrue = hasValueHelper(rechnungVersendetValue);
                      const sendungErstelltValue = getFloatingColDate(checklistData?.sendungErstellt, selectedOrder.sendungErstelltDatum);
                      const sendungErstelltTrue = hasValueHelper(sendungErstelltValue);
                      
                      // Check which items have previous true items (next item after TRUE should be ACTIVE)
                      // For bezahltAm: previous is kaufdatum
                      const bezahltAmHasPrevTrue = kaufdatumTrue;
                      // For rechnungVersendet: previous is bezahltAm
                      const rechnungVersendetHasPrevTrue = bezahltAmTrue;
                      // For sendungErstellt: previous is rechnungVersendet
                      const sendungErstelltHasPrevTrue = rechnungVersendetTrue;
                      
                      // Check which items come after an active item (for muted color)
                      const bezahltAmIsActive = bezahltAmHasPrevTrue && !bezahltAmTrue;
                      const rechnungVersendetIsActive = rechnungVersendetHasPrevTrue && !rechnungVersendetTrue;
                      
                      // Items after active items should use muted color
                      const rechnungVersendetHasActiveBefore = bezahltAmIsActive;
                      const sendungErstelltHasActiveBefore = bezahltAmIsActive || rechnungVersendetIsActive;
                      
                      return (
                        <div className="flex flex-col gap-0">
                          <StatusItem 
                            value={selectedOrder.kaufdatum} 
                            label="Gekauft"
                            isFirst={true}
                            labelFalse="Kauf"
                            labelActive="Kaufen"
                            labelTrue="Gekauft"
                          />
                          <StatusItem 
                            value={selectedOrder.bezahltAm} 
                            label="Bezahlt"
                            activeIcon={statusActiveZahlung}
                            labelFalse="Zahlung"
                            labelActive="Zahlung prüfen"
                            labelTrue="Bezahlt"
                          />
                          <StatusItem 
                            value={rechnungVersendetValue} 
                            label="Rechnung versendet"
                            hasPreviousTrue={rechnungVersendetHasPrevTrue}
                            hasActiveBefore={rechnungVersendetHasActiveBefore}
                            activeIcon={statusActiveRechnung}
                            labelFalse="Rechnung"
                            labelActive="Rechnung versenden"
                            labelTrue="Rechnung versendet"
                          />
                          <div>
                            <StatusItem 
                              value={sendungErstelltValue} 
                              label="Sendung erstellt"
                              isLast={true}
                              hasPreviousTrue={sendungErstelltHasPrevTrue}
                              hasActiveBefore={sendungErstelltHasActiveBefore}
                              activeIcon={statusActiveSendung}
                              labelFalse="Sendung"
                              labelActive="Sendung erstellen"
                              labelTrue="Sendung erstellt"
                            />
                            {sendungErstelltTrue && (
                              <div className="pl-[42px] flex items-center justify-between gap-[10px] h-[56px]">
                                <div className="flex items-center gap-[10px]">
                                  <div className="flex items-center justify-center gap-3">
                                    {(() => {
                                      // Find corresponding sendung row by bestellnummer or sendungsnummer
                                      const correspondingSendung = ordersState2.find(order => 
                                        order.bestellnummer === selectedOrder?.bestellnummer || 
                                        order.sendungsnummer === selectedOrder?.sendungsnummer
                                      );
                                      
                                      // Determine icon based on sendung status (same logic as sendungen table)
                                      let sendungIcon = <PackageOpen className="size-4" />;
                                      if (correspondingSendung) {
                                        const sendungRowNr = typeof correspondingSendung.nr === 'number' ? correspondingSendung.nr : parseInt(String(correspondingSendung.nr)) || null;
                                        const sendungChecklistData = sendungRowNr !== null ? checklistMap.get(sendungRowNr) : null;
                                        const versendet = sendungChecklistData?.versendet ?? false;
                                        const paketlabelErstellt = sendungChecklistData?.paketlisteErstellt ?? false;
                                        
                                        if (versendet) {
                                          sendungIcon = <PackageCheck className="size-4" />;
                                        } else if (paketlabelErstellt) {
                                          sendungIcon = <Package className="size-4" />;
                                        }
                                      }
                                      
                                      return (
                                        <Button
                                          name="listItemDetails"
                                          variant="outline"
                                          size="lg"
                                          className="h-10 w-10 ml-0"
                                          onClick={() => handleOpenSendungFromBestellung(selectedOrder?.bestellnummer, selectedOrder?.sendungsnummer)}
                                        >
                                          {sendungIcon}
                                        </Button>
                                      );
                                    })()}
                                    <div className="flex flex-col gap-1">
                                      <div className="text-xs text-muted-foreground">Sendungsnummer</div>
                                      <div className="text-sm">{selectedOrder?.sendungsnummer || '-'}</div>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="link"
                                  className="p-0 px-0 has-[>svg]:px-0 h-auto text-sm font-normal ml-auto"
                                >
                                  <Plus className="size-4" />
                                  Sendung hinzufügen
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Kundendaten
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 px-1">
                    {selectedOrder && (() => {
                      // Replace commas with newlines, then add Deutschland
                      const formattedAddress = selectedOrder.kundeAdresse
                        .split(',')
                        .map((part) => part.trim())
                        .filter((part) => part.length > 0)
                        .join('\n') + '\nDeutschland';
                      
                      const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const newValue = e.target.value;
                        // Remove "Deutschland" if present, then convert newlines back to commas
                        const addressWithoutCountry = newValue.replace(/\nDeutschland\s*$/, '').trim();
                        const addressWithCommas = addressWithoutCountry.split('\n').join(', ');
                        const updatedOrder = { ...selectedOrder, kundeAdresse: addressWithCommas };
                        setSelectedOrder(updatedOrder);
                        // Update orders arrays (update both tables if order exists)
                        const orderIndex1 = ordersState1.findIndex(o => o.nr === selectedOrder.nr);
                        if (orderIndex1 !== -1) {
                          setOrdersState1(prev => prev.map((o, idx) => idx === orderIndex1 ? updatedOrder : o));
                        }
                        const orderIndex2 = ordersState2.findIndex(o => o.nr === selectedOrder.nr);
                        if (orderIndex2 !== -1) {
                          setOrdersState2(prev => prev.map((o, idx) => idx === orderIndex2 ? updatedOrder : o));
                        }
                      };

                      const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedOrder = { ...selectedOrder, email: e.target.value };
                        setSelectedOrder(updatedOrder);
                        // Update orders arrays (update both tables if order exists)
                        const orderIndex1 = ordersState1.findIndex(o => o.nr === selectedOrder.nr);
                        if (orderIndex1 !== -1) {
                          setOrdersState1(prev => prev.map((o, idx) => idx === orderIndex1 ? updatedOrder : o));
                        }
                        const orderIndex2 = ordersState2.findIndex(o => o.nr === selectedOrder.nr);
                        if (orderIndex2 !== -1) {
                          setOrdersState2(prev => prev.map((o, idx) => idx === orderIndex2 ? updatedOrder : o));
                        }
                      };

                      const handleTelefonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedOrder = { ...selectedOrder, telefonnummer: e.target.value };
                        setSelectedOrder(updatedOrder);
                        // Update orders arrays (update both tables if order exists)
                        const orderIndex1 = ordersState1.findIndex(o => o.nr === selectedOrder.nr);
                        if (orderIndex1 !== -1) {
                          setOrdersState1(prev => prev.map((o, idx) => idx === orderIndex1 ? updatedOrder : o));
                        }
                        const orderIndex2 = ordersState2.findIndex(o => o.nr === selectedOrder.nr);
                        if (orderIndex2 !== -1) {
                          setOrdersState2(prev => prev.map((o, idx) => idx === orderIndex2 ? updatedOrder : o));
                        }
                      };
                      
                      return (
                        <div className={`grid ${!useWideLayout ? 'grid-cols-1' : 'grid-cols-2'} gap-x-[28px] gap-y-5 items-stretch ${useWideLayout ? 'h-full' : ''}`}>
                            <div className={`flex flex-col ${useWideLayout ? 'h-full' : ''}`}>
                              <label className="text-sm font-medium text-foreground">Kunde/Lieferadresse</label>
                              <textarea
                                className={`mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none ${!useWideLayout ? 'h-24' : useWideLayout ? 'flex-1' : 'min-h-[80px]'}`}
                                value={formattedAddress}
                                onChange={handleAddressChange}
                              />
                            </div>
                          <div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-foreground">E-Mail</label>
                              <Input
                                type="email"
                                value={selectedOrder.email}
                                onChange={handleEmailChange}
                              />
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              <label className="text-sm font-medium text-foreground">Telefonnummer</label>
                              <Input
                                type="tel"
                                value={selectedOrder.telefonnummer}
                                onChange={handleTelefonChange}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </AccordionContent>
                </AccordionItem>
                </Accordion>
              </div>
              {/* Divider */}
              {(sheetWidth >= 1024 && !isUnderSm) && (
                <div className="w-px bg-border self-stretch" />
              )}
              {/* Right Column: Bestellung */}
              <div className={sheetWidth >= 1024 ? '' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-4"]} className="w-full">
                <AccordionItem value="item-4" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Bestellung
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 px-1">
                    {selectedOrder && (
                      <>
                        <div className="grid grid-cols-2 gap-[32px] mb-[32px]">
                          <div>
                            <label className="text-sm font-medium text-foreground">Bestellnummer</label>
                            <p className="mt-1 text-sm">{selectedOrder.bestellnummer}</p>
                          </div>
                          {selectedOrder.info && selectedOrder.info.trim() !== "" && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Info</label>
                              <p className="mt-1 text-sm">{selectedOrder.info}</p>
                            </div>
                          )}
                        </div>
                        {(() => {
                          const articles = generateArticles(selectedOrder);
                          return (
                            <div className="!border !border-border rounded-[12px] overflow-hidden">
                              <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/3 font-semibold leading-tight whitespace-normal py-3">Artikel</TableHead>
                                <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Anzahl</TableHead>
                                <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">MwSt. Satz</TableHead>
                                <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Preis Netto</TableHead>
                                <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Preis Brutto</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {articles.map((article, index) => (
                                <TableRow key={index}>
                                  <TableCell>{article.artikel}</TableCell>
                                  <TableCell className="text-right">{article.anzahl}</TableCell>
                                  <TableCell className="text-right">{selectedOrder.mwstSatz}%</TableCell>
                                  <TableCell className="text-right">{formatEUR(article.preisNetto)}</TableCell>
                                  <TableCell className="text-right">{formatEUR(article.preisBrutto)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell>Versand</TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right">{selectedOrder.mwstSatz}%</TableCell>
                                <TableCell className="text-right">{formatEUR(selectedOrder.versandNetto)}</TableCell>
                                <TableCell className="text-right">{formatEUR(selectedOrder.versandBrutto)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-foreground">Gesamt</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right font-medium text-foreground">{formatEUR(selectedOrder.gesamtNetto)}</TableCell>
                                <TableCell className="text-right font-medium text-foreground">{formatEUR(selectedOrder.gesamtBrutto)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        );
                      })()}
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              </div>
            </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* SendungSheet */}
      <Sheet open={isSendungSheetOpen} onOpenChange={(open) => {
        setIsSendungSheetOpen(open);
      }}>
        <SheetContent
          name="SendungSheet"
          side="right"
          className="overflow-y-auto p-6 lg:p-10 pb-[90px] !max-w-full lg:!max-w-none"
          style={isSmallScreen ? { width: '100%', maxWidth: '100%' } : { width: `${responsiveSheetWidth}px`, maxWidth: `${responsiveSheetWidth}px` }}
          onPrevClick={showShipmentArrows ? handlePrevClickShipment : undefined}
          onNextClick={showShipmentArrows ? handleNextClickShipment : undefined}
          isPrevDisabled={currentShipmentIndex <= 0}
          isNextDisabled={currentShipmentIndex >= filteredShipments.length - 1}
          onToggleSelectAll={handleToggleCurrentShipmentMark}
          allRowsSelected={isCurrentShipmentMarked}
          aria-label="sendung"
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors z-50"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          />
          {selectedShipment && (() => {
            // Determine icon based on state (same logic as floating columns)
            const rowNr = typeof selectedShipment.nr === 'number' ? selectedShipment.nr : parseInt(String(selectedShipment.nr)) || null;
            const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
            const versendet = checklistData?.versendet ?? false;
            const paketlabelErstellt = checklistData?.paketlisteErstellt ?? false;
            
            let icon = <PackageOpen className="size-4" />;
            if (versendet) {
              icon = <PackageCheck className="size-4" />;
            } else if (paketlabelErstellt) {
              icon = <Package className="size-4" />;
            }
            
            return (
              <>
                <div className={`flex items-center gap-2 mb-1 ${isUnderSm ? 'mt-12' : 'mt-4'}`}>
                  {icon}
                  <span className="text-sm">Sendung</span>
                </div>
                <SheetTitle className={`font-bold tracking-tight text-foreground mb-2 mt-4`}>
                  #{selectedShipment?.sendungsnummer || selectedShipment?.bestellnummer}
                </SheetTitle>
              </>
            );
          })()}
          {selectedShipment && (() => {
            // Helper: check if we should use wide layout (sheet width >= 640 AND window width >= 640)
            const useWideLayout = (sheetWidth ?? 1255) >= 640 && !isUnderSm;
            return (
            <div className={`mt-3 pb-[90px] ${(sheetWidth >= 1024 && !isUnderSm) ? 'grid grid-cols-[1fr_auto_1fr] gap-[32px] items-start' : 'space-y-6'}`}>
              {/* Left Column: Status, Kundendaten, Versand */}
              <div className={useWideLayout ? 'flex flex-col' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full">
                <AccordionItem value="item-1" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Status
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-0 mb-4 min-h-[120px] px-1">
                    {selectedShipment && (() => {
                      const rowNr = typeof selectedShipment.nr === 'number' ? selectedShipment.nr : parseInt(String(selectedShipment.nr)) || null;
                      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
                      
                      // Get today's date in YYYY-MM-DD format (only for temporary/created data)
                      const getTodayDate = () => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      };
                      
                      // Helper function to get date value: CSV data has priority, use today's date only if checklist is true but no CSV date exists
                      const getFloatingColDate = (checklistValue: boolean | undefined, csvDate: string | null | undefined) => {
                        if (!checklistValue) return null;
                        // If CSV has a date, use it (has priority)
                        if (csvDate && csvDate.trim() !== '') return csvDate;
                        // Otherwise, use today's date (temporary/created data)
                        return getTodayDate();
                      };
                      
                      // Helper component for status items
                      const StatusItem = ({ 
                        value, 
                        label, 
                        isFirst, 
                        isLast,
                        labelFalse,
                        labelActive: _labelActive,
                        labelTrue,
                        hasPreviousTrue: _hasPreviousTrue,
                        hasActiveBefore: _hasActiveBefore,
                        activeIcon: _activeIcon,
                        showDate = true
                      }: { 
                        value: string | null | undefined, 
                        label: string,
                        isFirst?: boolean,
                        isLast?: boolean,
                        labelFalse?: string,
                        labelActive?: string,
                        labelTrue?: string,
                        hasPreviousTrue?: boolean,
                        hasActiveBefore?: boolean,
                        activeIcon?: string,
                        showDate?: boolean
                      }) => {
                        const hasValue = value && value.trim() !== '';
                        const isTrue = hasValue;
                        
                        // Determine which SVG to use based on state and position
                        let statusIcon = statusFalse;
                        if (isTrue) {
                          statusIcon = isFirst ? statusTrueTop : (isLast ? statusTrueBottom : statusTrue);
                        } else {
                          statusIcon = isFirst ? statusFalseTop : (isLast ? statusFalseBottom : statusFalse);
                        }
                        
                        // Determine label based on state (only true/false, no active)
                        let displayLabel = label;
                        if (isTrue && labelTrue) {
                          displayLabel = labelTrue;
                        } else if (!isTrue && labelFalse) {
                          displayLabel = labelFalse;
                        }
                        
                        return (
                          <div className="flex items-center justify-between gap-[12px] h-[40px]">
                            <div className="flex items-center gap-[10px]">
                              <img 
                                src={statusIcon} 
                                alt={isTrue ? "Status true" : "Status false"}
                                className="w-auto h-auto flex-shrink-0"
                              />
                              <span className={`text-sm font-normal ${isTrue ? 'text-foreground' : 'text-muted-foreground'}`}>{displayLabel}</span>
                            </div>
                            {showDate && <span className="text-sm text-muted-foreground">{value ? formatDate(value) : ''}</span>}
                          </div>
                        );
                      };
                      
                      // Helper to check if item has a value
                      const hasValueHelper = (val: string | null | undefined): boolean => !!(val && val.trim() !== '');
                      
                      // Determine states for all items to check for previous true items
                      const kaufdatumTrue = hasValueHelper(selectedShipment.kaufdatum);
                      const bezahltAmTrue = hasValueHelper(selectedShipment.bezahltAm);
                      const rechnungVersendetValue = getFloatingColDate(checklistData?.rechnungVersendet, selectedShipment.rechnungVersendetDatum);
                      const rechnungVersendetTrue = hasValueHelper(rechnungVersendetValue);
                      const sendungErstelltValue = getFloatingColDate(checklistData?.sendungErstellt, selectedShipment.sendungErstelltDatum);
                      const sendungErstelltTrue = hasValueHelper(sendungErstelltValue);
                      const versandprofilHinzugefuegtValue = getFloatingColDate(checklistData?.versandprofilHinzugefuegt, selectedShipment.versandprofilHinzugefuegtDatum);
                      const versandprofilHinzugefuegtTrue = hasValueHelper(versandprofilHinzugefuegtValue);
                      const paketlisteErstelltValue = getFloatingColDate(checklistData?.paketlisteErstellt, selectedShipment.versandtGemeldet);
                      const paketlisteErstelltTrue = hasValueHelper(paketlisteErstelltValue);
                      const versendetValue = getFloatingColDate(checklistData?.versendet, selectedShipment.versanddatum);
                      const versendetTrue = hasValueHelper(versendetValue);
                      
                      // Check which items have previous true items (next item after TRUE should be ACTIVE)
                      // For bezahltAm: previous is kaufdatum
                      const bezahltAmHasPrevTrue = kaufdatumTrue;
                      // For rechnungVersendet: previous is bezahltAm
                      const rechnungVersendetHasPrevTrue = bezahltAmTrue;
                      // For sendungErstellt: previous is rechnungVersendet
                      const sendungErstelltHasPrevTrue = rechnungVersendetTrue;
                      // For versandprofilHinzugefuegt: previous is sendungErstellt
                      const versandprofilHinzugefuegtHasPrevTrue = sendungErstelltTrue;
                      // For paketlisteErstellt: previous is versandprofilHinzugefuegt
                      const paketlisteErstelltHasPrevTrue = versandprofilHinzugefuegtTrue;
                      // For versendet: previous is paketlisteErstellt
                      const versendetHasPrevTrue = paketlisteErstelltTrue;
                      
                      // Check which items come after an active item (for muted color)
                      const bezahltAmIsActive = bezahltAmHasPrevTrue && !bezahltAmTrue;
                      const rechnungVersendetIsActive = rechnungVersendetHasPrevTrue && !rechnungVersendetTrue;
                      const sendungErstelltIsActive = sendungErstelltHasPrevTrue && !sendungErstelltTrue;
                      const versandprofilHinzugefuegtIsActive = versandprofilHinzugefuegtHasPrevTrue && !versandprofilHinzugefuegtTrue;
                      const paketlisteErstelltIsActive = paketlisteErstelltHasPrevTrue && !paketlisteErstelltTrue;
                      
                      // Items after active items should use muted color
                      const sendungErstelltHasActiveBefore = bezahltAmIsActive || rechnungVersendetIsActive;
                      const versandprofilHinzugefuegtHasActiveBefore = bezahltAmIsActive || rechnungVersendetIsActive || sendungErstelltIsActive;
                      const paketlisteErstelltHasActiveBefore = bezahltAmIsActive || rechnungVersendetIsActive || sendungErstelltIsActive || versandprofilHinzugefuegtIsActive;
                      const versendetHasActiveBefore = bezahltAmIsActive || rechnungVersendetIsActive || sendungErstelltIsActive || versandprofilHinzugefuegtIsActive || paketlisteErstelltIsActive;
                      
                      // Split bestellnummer by comma if it contains multiple values
                      const bestellnummern = selectedShipment?.bestellnummer 
                        ? selectedShipment.bestellnummer.split(',').map(bn => bn.trim()).filter(bn => bn)
                        : [];
                      const hasMultipleBestellnummern = bestellnummern.length > 1;
                      const firstBestellnummer = bestellnummern[0] || selectedShipment?.bestellnummer || '';
                      const secondBestellnummer = bestellnummern[1] || '';
                      
                      return (
                        <div className="flex flex-col gap-0">
                          <div>
                            <StatusItem 
                              value={sendungErstelltValue} 
                              label="Sendung erstellt für"
                              isFirst={true}
                              hasPreviousTrue={sendungErstelltHasPrevTrue}
                              hasActiveBefore={sendungErstelltHasActiveBefore}
                              activeIcon={statusActiveSendung}
                              labelFalse="Sendung"
                              labelActive="Sendung erstellen"
                              labelTrue="Sendung erstellt für"
                            />
                            <div className="pl-0 flex items-center justify-between gap-[10px] h-[56px]">
                              <div className="flex items-center gap-[10px]">
                                <img src={statusGap} alt="Status gap" className="w-auto h-auto flex-shrink-0" />
                                <div className="flex items-center justify-center gap-3">
                                  <Button
                                    name="listItemDetails"
                                    variant="outline"
                                    size="lg"
                                    className="h-10 w-10 ml-0"
                                    onClick={() => handleOpenBestellungFromSendung(firstBestellnummer)}
                                  >
                                    <CreditCard className="size-4" />
                                  </Button>
                                  <div className="flex flex-col gap-1">
                                    <div className="text-xs text-muted-foreground">Bestellnummer</div>
                                    <div className="text-sm">{firstBestellnummer}</div>
                                  </div>
                                </div>
                              </div>
                              {!hasMultipleBestellnummern && !versendetTrue && (
                                <Button
                                  variant="link"
                                  className="p-0 px-0 has-[>svg]:px-0 h-auto text-sm font-normal ml-auto"
                                >
                                  <Plus className="size-4" />
                                  Bestellung hinzufügen
                                </Button>
                              )}
                            </div>
                            {hasMultipleBestellnummern && (
                              <div className="pl-0 flex items-center justify-between gap-[10px] h-[56px]">
                                <div className="flex items-center gap-[10px]">
                                  <img src={statusGap} alt="Status gap" className="w-auto h-auto flex-shrink-0" />
                                  <div className="flex items-center justify-center gap-3">
                                    <Button
                                      name="listItemDetails"
                                      variant="outline"
                                      size="lg"
                                      className="h-10 w-10 ml-0"
                                      onClick={() => handleOpenBestellungFromSendung(secondBestellnummer)}
                                    >
                                      <CreditCard className="size-4" />
                                    </Button>
                                    <div className="flex flex-col gap-1">
                                      <div className="text-xs text-muted-foreground">Bestellnummer</div>
                                      <div className="text-sm">{secondBestellnummer}</div>
                                    </div>
                                  </div>
                                </div>
                                {!versendetTrue && (
                                  <Button
                                    variant="link"
                                    className="p-0 px-0 has-[>svg]:px-0 h-auto text-sm font-normal ml-auto"
                                  >
                                    <Plus className="size-4" />
                                    Bestellung hinzufügen
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                          <StatusItem 
                            value={versandprofilHinzugefuegtValue} 
                            label="Versandprofil hinzugefügt"
                            hasPreviousTrue={versandprofilHinzugefuegtHasPrevTrue}
                            hasActiveBefore={versandprofilHinzugefuegtHasActiveBefore}
                            activeIcon={statusActiveVersandprofil}
                            labelFalse="Versandprofil"
                            labelActive="Versandprofil hinzufügen"
                            labelTrue="Versandprofil hinzugefügt"
                          />
                          <StatusItem 
                            value={paketlisteErstelltValue} 
                            label="Versandlabel erstellt"
                            hasPreviousTrue={paketlisteErstelltHasPrevTrue}
                            hasActiveBefore={paketlisteErstelltHasActiveBefore}
                            activeIcon={statusActiveVersandlabel}
                            labelFalse="Versandlabel"
                            labelActive="Versandlabel erstellen"
                            labelTrue="Versandlabel erstellt"
                          />
                          <StatusItem 
                            value={versendetValue} 
                            label="Versendet"
                            isLast={true}
                            hasPreviousTrue={versendetHasPrevTrue}
                            hasActiveBefore={versendetHasActiveBefore}
                            activeIcon={statusActiveVersand}
                            labelFalse="Versand"
                            labelActive="Versenden"
                            labelTrue="Versendet"
                          />
                        </div>
                      );
                    })()}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Versand
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 px-1">
                    {selectedShipment && (
                      <>
                        <div className="mb-5">
                          <label className="text-sm font-medium text-foreground">Versandprofil</label>
                          <Select 
                            value={selectedShipment.versandprofil || ""}
                            onValueChange={(value) => {
                              const updatedShipment = { ...selectedShipment, versandprofil: value };
                              setSelectedShipment(updatedShipment);
                              // Update sendungen table only
                              const shipmentIndex = ordersState2.findIndex(o => o.nr === selectedShipment.nr);
                              if (shipmentIndex !== -1) {
                                setOrdersState2(prev => prev.map((o, idx) => idx === shipmentIndex ? updatedShipment : o));
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Versandprofil auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {versandprofilOptions.map((profil) => (
                                <SelectItem key={profil} value={profil}>
                                  {profil}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={`grid ${!useWideLayout ? 'grid-cols-1' : 'grid-cols-2'} gap-x-[28px] gap-y-5`}>
                        <div>
                          <label className="text-sm font-medium text-foreground">Versanddienstleister</label>
                          <Select 
                            value={selectedShipment.versanddienstleister}
                            onValueChange={(value) => {
                              const updatedShipment = { ...selectedShipment, versanddienstleister: value };
                              setSelectedShipment(updatedShipment);
                              // Update sendungen table only
                              const shipmentIndex = ordersState2.findIndex(o => o.nr === selectedShipment.nr);
                              if (shipmentIndex !== -1) {
                                setOrdersState2(prev => prev.map((o, idx) => idx === shipmentIndex ? updatedShipment : o));
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Versanddienstleister auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DHL">DHL</SelectItem>
                              <SelectItem value="Hermes">Hermes</SelectItem>
                              <SelectItem value="DPD">DPD</SelectItem>
                              <SelectItem value="UPS">UPS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Versandverpackung</label>
                          <Select 
                            value={selectedShipment.versandverpackung}
                            onValueChange={(value) => {
                              const updatedShipment = { ...selectedShipment, versandverpackung: value };
                              setSelectedShipment(updatedShipment);
                              // Update sendungen table only
                              const shipmentIndex = ordersState2.findIndex(o => o.nr === selectedShipment.nr);
                              if (shipmentIndex !== -1) {
                                setOrdersState2(prev => prev.map((o, idx) => idx === shipmentIndex ? updatedShipment : o));
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Versandverpackung auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Karton S">Karton S</SelectItem>
                              <SelectItem value="Karton M">Karton M</SelectItem>
                              <SelectItem value="Karton L">Karton L</SelectItem>
                              <SelectItem value="Karton XL">Karton XL</SelectItem>
                              <SelectItem value="Spezialkarton">Spezialkarton</SelectItem>
                              <SelectItem value="Palette">Palette</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Kundendaten
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 px-1">
                    {selectedShipment && (() => {
                      // Replace commas with newlines, then add Deutschland
                      const formattedAddress = selectedShipment.kundeAdresse
                        .split(',')
                        .map((part) => part.trim())
                        .filter((part) => part.length > 0)
                        .join('\n') + '\nDeutschland';
                      
                      const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const newValue = e.target.value;
                        // Remove "Deutschland" if present, then convert newlines back to commas
                        const addressWithoutCountry = newValue.replace(/\nDeutschland\s*$/, '').trim();
                        const addressWithCommas = addressWithoutCountry.split('\n').join(', ');
                        const updatedShipment = { ...selectedShipment, kundeAdresse: addressWithCommas };
                        setSelectedShipment(updatedShipment);
                        // Update sendungen table only
                        const shipmentIndex = ordersState2.findIndex(o => o.nr === selectedShipment.nr);
                        if (shipmentIndex !== -1) {
                          setOrdersState2(prev => prev.map((o, idx) => idx === shipmentIndex ? updatedShipment : o));
                        }
                      };

                      const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedShipment = { ...selectedShipment, email: e.target.value };
                        setSelectedShipment(updatedShipment);
                        // Update sendungen table only
                        const shipmentIndex = ordersState2.findIndex(o => o.nr === selectedShipment.nr);
                        if (shipmentIndex !== -1) {
                          setOrdersState2(prev => prev.map((o, idx) => idx === shipmentIndex ? updatedShipment : o));
                        }
                      };

                      const handleTelefonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedShipment = { ...selectedShipment, telefonnummer: e.target.value };
                        setSelectedShipment(updatedShipment);
                        // Update sendungen table only
                        const shipmentIndex = ordersState2.findIndex(o => o.nr === selectedShipment.nr);
                        if (shipmentIndex !== -1) {
                          setOrdersState2(prev => prev.map((o, idx) => idx === shipmentIndex ? updatedShipment : o));
                        }
                      };
                      
                      return (
                        <div className={`grid ${!useWideLayout ? 'grid-cols-1' : 'grid-cols-2'} gap-x-[28px] gap-y-5 items-stretch ${useWideLayout ? 'h-full' : ''}`}>
                            <div className={`flex flex-col ${useWideLayout ? 'h-full' : ''}`}>
                              <label className="text-sm font-medium text-foreground">Kunde/Lieferadresse</label>
                              <textarea
                                className={`mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none ${!useWideLayout ? 'h-24' : useWideLayout ? 'flex-1' : 'min-h-[80px]'}`}
                                value={formattedAddress}
                                onChange={handleAddressChange}
                              />
                            </div>
                          <div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-foreground">E-Mail</label>
                              <Input
                                type="email"
                                value={selectedShipment.email}
                                onChange={handleEmailChange}
                              />
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              <label className="text-sm font-medium text-foreground">Telefonnummer</label>
                              <Input
                                type="tel"
                                value={selectedShipment.telefonnummer}
                                onChange={handleTelefonChange}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </AccordionContent>
                </AccordionItem>
                </Accordion>
              </div>
              {/* Divider */}
              {(sheetWidth >= 1024 && !isUnderSm) && (
                <div className="w-px bg-border self-stretch" />
              )}
              {/* Right Column: Sendung */}
              <div className={sheetWidth >= 1024 ? '' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-4"]} className="w-full">
                <AccordionItem value="item-4" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Bestellung
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 px-1">
                    {selectedShipment && (() => {
                      // Split bestellnummer by comma if it contains multiple values
                      const bestellnummern = selectedShipment.bestellnummer 
                        ? selectedShipment.bestellnummer.split(',').map(bn => bn.trim()).filter(bn => bn)
                        : [];
                      const hasMultipleBestellnummern = bestellnummern.length > 1;
                      const firstBestellnummer = bestellnummern[0] || selectedShipment.bestellnummer || '';
                      const secondBestellnummer = bestellnummern[1] || '';
                      
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-[32px] mb-[32px]">
                            <div>
                              <label className="text-sm font-medium text-foreground">Bestellnummer</label>
                              <p className="mt-1 text-sm">{firstBestellnummer}</p>
                            </div>
                            {selectedShipment.info && selectedShipment.info.trim() !== "" && (
                              <div>
                                <label className="text-sm font-medium text-foreground">Info</label>
                                <p className="mt-1 text-sm">{selectedShipment.info}</p>
                              </div>
                            )}
                          </div>
                          {(() => {
                            const articles = generateArticles(selectedShipment);
                            return (
                              <div className="!border !border-border rounded-[12px] overflow-hidden mb-6">
                                <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-1/3 font-semibold leading-tight whitespace-normal py-3">Artikel</TableHead>
                                  <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Anzahl</TableHead>
                                  <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">MwSt. Satz</TableHead>
                                  <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Preis Netto</TableHead>
                                  <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Preis Brutto</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {articles.map((article, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{article.artikel}</TableCell>
                                    <TableCell className="text-right">{article.anzahl}</TableCell>
                                    <TableCell className="text-right">{selectedShipment.mwstSatz}%</TableCell>
                                    <TableCell className="text-right">{formatEUR(article.preisNetto)}</TableCell>
                                    <TableCell className="text-right">{formatEUR(article.preisBrutto)}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell>Versand</TableCell>
                                  <TableCell></TableCell>
                                  <TableCell className="text-right">{selectedShipment.mwstSatz}%</TableCell>
                                  <TableCell className="text-right">{formatEUR(selectedShipment.versandNetto)}</TableCell>
                                  <TableCell className="text-right">{formatEUR(selectedShipment.versandBrutto)}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium text-foreground">Gesamt</TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell className="text-right font-medium text-foreground">{formatEUR(selectedShipment.gesamtNetto)}</TableCell>
                                  <TableCell className="text-right font-medium text-foreground">{formatEUR(selectedShipment.gesamtBrutto)}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          );
                        })()}
                        {hasMultipleBestellnummern && (
                          <>
                            <div className="grid grid-cols-2 gap-[32px] mb-[32px]">
                              <div>
                                <label className="text-sm font-medium text-foreground">Bestellnummer</label>
                                <p className="mt-1 text-sm">{secondBestellnummer}</p>
                              </div>
                              {selectedShipment.info && selectedShipment.info.trim() !== "" && (
                                <div>
                                  <label className="text-sm font-medium text-foreground">Info</label>
                                  <p className="mt-1 text-sm">{selectedShipment.info}</p>
                                </div>
                              )}
                            </div>
                            {(() => {
                              // Create a modified order object with different values for the second bestellnummer
                              const modifiedOrder: Order = {
                                ...selectedShipment,
                                nr: typeof selectedShipment.nr === 'number' ? selectedShipment.nr + 1000 : selectedShipment.nr,
                                artikelanzahl: Math.max(2, selectedShipment.artikelanzahl - 1),
                                gesamtNetto: selectedShipment.gesamtNetto * 0.75,
                                gesamtBrutto: selectedShipment.gesamtBrutto * 0.75,
                                versandNetto: selectedShipment.versandNetto * 0.8,
                                versandBrutto: selectedShipment.versandBrutto * 0.8,
                              };
                              const articles = generateArticles(modifiedOrder);
                              const modifiedGesamtNetto = articles.reduce((sum, a) => sum + a.preisNetto, 0) + modifiedOrder.versandNetto;
                              const modifiedGesamtBrutto = articles.reduce((sum, a) => sum + a.preisBrutto, 0) + modifiedOrder.versandBrutto;
                              
                              return (
                                <div className="!border !border-border rounded-[12px] overflow-hidden">
                                  <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-1/3 font-semibold leading-tight whitespace-normal py-3">Artikel</TableHead>
                                    <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Anzahl</TableHead>
                                    <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">MwSt. Satz</TableHead>
                                    <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Preis Netto</TableHead>
                                    <TableHead className="text-right font-semibold leading-tight whitespace-normal py-3">Preis Brutto</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {articles.map((article, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{article.artikel}</TableCell>
                                      <TableCell className="text-right">{article.anzahl}</TableCell>
                                      <TableCell className="text-right">{modifiedOrder.mwstSatz}%</TableCell>
                                      <TableCell className="text-right">{formatEUR(article.preisNetto)}</TableCell>
                                      <TableCell className="text-right">{formatEUR(article.preisBrutto)}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell>Versand</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-right">{modifiedOrder.mwstSatz}%</TableCell>
                                    <TableCell className="text-right">{formatEUR(modifiedOrder.versandNetto)}</TableCell>
                                    <TableCell className="text-right">{formatEUR(modifiedOrder.versandBrutto)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium text-foreground">Gesamt</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-right font-medium text-foreground">{formatEUR(modifiedGesamtNetto)}</TableCell>
                                    <TableCell className="text-right font-medium text-foreground">{formatEUR(modifiedGesamtBrutto)}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            );
                          })()}
                          </>
                        )}
                        </>
                      );
                    })()}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              </div>
            </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* FilterSheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent
          name="FilterSheet"
          side="left"
          className="w-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !px-6 !pt-10 opacity-100"
          showCloseButton={false}
        >
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 pr-9 bg-[#fbfbfb]"
            />
            {globalFilter.length > 0 && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                type="button"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2", "item-3", "item-4"]} className="w-full">
            <AccordionItem value="item-0" className="border-b border-border">
              <AccordionTrigger 
                className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                indicator={
                  (isChecked || isChecked2 || isChecked3 || isChecked4 || isChecked12) ? (
                    <Circle className="h-2 w-2 shrink-0 text-primary fill-primary" />
                  ) : undefined
                }
              >
                Spezialfilter
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3 items-stretch">
                  {filterItems
                    .filter((item) => {
                      // When Bestellungen tab is active (rechnung), show only these items
                      if (activeTab === "rechnung") {
                        return ["new-orders-checkbox-2", "new-orders-checkbox-3", "new-orders-checkbox-4"].includes(item.id);
                      }
                      // When Sendungen tab is active, show only these items
                      if (activeTab === "versand") {
                        return ["new-orders-checkbox-5", "new-orders-checkbox-6", "new-orders-checkbox-7", "new-orders-checkbox-12"].includes(item.id);
                      }
                      return true;
                    })
                    .map((item) => (
                    <div
                      key={item.id}
                        className={cn(
                          "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground"
                        )}
                      onClick={() => item.onCheckedChange(!item.checked)}
                    >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                            {item.count}
                          </div>
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={(checked) => {
                              item.onCheckedChange(checked === true);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <Label
                          htmlFor={item.id}
                          className="text-[13px] font-light leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words"
                        >
                          {item.label === "Kein Versandvorgang" ? (
                            <>
                              Kein Versand-
                              <br />
                              vorgang erstellt
                            </>
                          ) : (
                            item.label
                          )}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-5">
                  <Button variant="link" className="p-0 h-auto text-sm font-normal mb-2">
                    <Plus className="size-4" />
                    Versandprofil hinzufügen
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-b border-border">
              <AccordionTrigger 
                className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                indicator={
                    (isChecked5 || isChecked6) ? (
                    <Circle className="h-2 w-2 shrink-0 text-primary fill-primary" />
                  ) : undefined
                }
              >
                Versandprofile
              </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-3 items-stretch">
                    {filterItems2.map((item) => (
                    <div
                      key={item.id}
                        className={cn(
                          "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground"
                        )}
                      onClick={() => item.onCheckedChange(!item.checked)}
                    >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                            {item.count}
                          </div>
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={(checked) => {
                              item.onCheckedChange(checked === true);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <Label
                          htmlFor={item.id}
                          className={cn(
                            "text-[0.8rem] leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words antialiased",
                            item.checked ? "font-medium" : "font-normal"
                          )}
                        >
                          {item.label === "Kein Versandvorgang" ? (
                            <>
                              Kein Versand-
                              <br />
                              vorgang erstellt
                            </>
                          ) : (
                            item.label
                          )}
                        </Label>
                      </div>
                    </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-5">
                    <Button variant="link" className="p-0 h-auto text-sm font-normal mb-2">
                      <Plus className="size-4" />
                      Spezialfilter hinzufügen
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1" className="border-b border-border">
              <AccordionTrigger 
                className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                indicator={
                  (zeilennummern || kaufdatum || importdatum || importquelle) ? (
                    <Circle className="h-2 w-2 shrink-0 text-primary fill-primary" />
                  ) : undefined
                }
              >
                Allgemeine Filter
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-1 mt-2 mb-5">
                  <div className="space-y-2">
                    <Label htmlFor="zeilennummern" className="text-sm font-medium">
                      Zeilennummern
                    </Label>
                    <Input
                      id="zeilennummern"
                      type="text"
                      className="w-full"
                      value={zeilennummern}
                      onChange={(e) => setZeilennummern(e.target.value)}
                      placeholder="z.B. 1-5, 8, 20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kaufdatum-field" className="text-sm font-medium">
                      Kaufdatum
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="kaufdatum-field"
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !kaufdatum && "text-muted-foreground"
                          )}
                        >
                          {kaufdatum?.from ? (
                            kaufdatum.to ? (
                              <>
                                {format(kaufdatum.from, "dd.MM.yyyy")} -{" "}
                                {format(kaufdatum.to, "dd.MM.yyyy")}
                              </>
                            ) : (
                              format(kaufdatum.from, "dd.MM.yyyy")
                            )
                          ) : (
                            <span>Zeitraum wählen</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          numberOfMonths={2}
                          selected={kaufdatum}
                          onSelect={setKaufdatum}
                          locale={de}
                          weekStartsOn={0}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importdatum-field" className="text-sm font-medium">
                      Importdatum
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="importdatum-field"
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !importdatum && "text-muted-foreground"
                          )}
                        >
                          {importdatum?.from ? (
                            importdatum.to ? (
                              <>
                                {format(importdatum.from, "dd.MM.yyyy")} -{" "}
                                {format(importdatum.to, "dd.MM.yyyy")}
                              </>
                            ) : (
                              format(importdatum.from, "dd.MM.yyyy")
                            )
                          ) : (
                            <span>Zeitraum wählen</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          numberOfMonths={2}
                          selected={importdatum}
                          onSelect={setImportdatum}
                          locale={de}
                          weekStartsOn={0}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importquelle" className="text-sm font-medium">
                      Importquelle
                    </Label>
                    <Select value={importquelle} onValueChange={setImportquelle}>
                      <SelectTrigger id="importquelle" className="w-full">
                        <SelectValue placeholder="Importquelle auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alle">Alle</SelectItem>
                        <SelectItem value="Amazon API">Amazon API</SelectItem>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetContent>
      </Sheet>

      {/* Floating buttons container */}
      <div 
        className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex gap-1 bg-actionbar p-1 rounded-[11px] shadow-lg transition-all duration-300 pointer-events-auto" 
        data-actionbar
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {!(isSheetOpen && activeTab === "rechnung" && selectedOrder) && (
          <Button onClick={handleToggleMarkAll} className="w-[98px]">
            {hasMarkedRows ? "Abwählen" : "Auswählen"}
          </Button>
        )}
        {activeTab === "rechnung" && !(isSheetOpen && activeTab === "rechnung" && selectedOrder) && (
          <Button 
            variant="outline" 
            className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
            onClick={() => {
              checkSelectionBeforeAction(() => {
                // Get marked rows (this button is only shown when activeTab === "rechnung")
                const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                
                // Show different modal based on number of selected rows
                if (markedVisibleRows.length === 1) {
                  // Single row - show single row modal
                  // Store which kundeAdresse value is marked (to show matching Sendungen later)
                  const kundeAdressen = new Set(markedVisibleRows.map(row => row.kundeAdresse || ""));
                  setVisibleKundeAdressenForSendungen(kundeAdressen);
                  setShowSingleRowSendungModal(true);
                  setSingleRowSendungStep(-1);
                  setSingleRowProgressValue(0);
                } else {
                  // Multiple rows - show address matching modal
                  // Store which kundeAdresse values are marked (to show matching Sendungen later)
                  const kundeAdressen = new Set(markedVisibleRows.map(row => row.kundeAdresse || ""));
                  setVisibleKundeAdressenForSendungen(kundeAdressen);
                  setShowAddressMatchAlert(true);
                  setAddressMatchStep(-1);
                  setProgressValue(0);
                }
              });
            }}
          >
            <Package className="size-4" />
            {markedRowsCount > 1 ? "Sendungen erstellen" : "Sendung erstellen"}
          </Button>
        )}
        {!(isSheetOpen && activeTab === "rechnung" && selectedOrder) && (
          <div className="ml-auto flex gap-1">
            {activeTab === "rechnung" && (
              <Button 
                variant="outline" 
                className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
                onClick={() => setShowFunktionenBestellungenCommand(true)}
              >
                <MoreHorizontal className="size-4" />
                <span className="hidden sm:inline">Weitere Funktionen</span>
              </Button>
            )}
            {activeTab === "versand" && (
            <>
              <Button 
                variant="outline" 
                className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
                onClick={() => {
                  checkSelectionBeforeAction(() => {
                    // Handle Versandlabel erstellen
                  });
                }}
              >
                <QrCode className="size-4" />
                Versandlabel erstellen
              </Button>
              <Button 
                variant="outline" 
                className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
                onClick={() => setShowFunktionenSendungenCommand(true)}
              >
                <MoreHorizontal className="size-4" />
                <span className="hidden sm:inline">Weitere Funktionen</span>
              </Button>
            </>
            )}
          </div>
        )}
        {/* Button copies with B labels - visible only when Bestellung sheet is open */}
        {isSheetOpen && activeTab === "rechnung" && selectedOrder && (
          <>
            <Button 
              variant="default"
              className="w-[98px]"
              onClick={() => {
                if (!selectedOrder) return;
                // Save logic for selectedOrder to ordersState1 and ordersState2
                const orderIndex1 = ordersState1.findIndex(o => o.nr === selectedOrder.nr);
                if (orderIndex1 !== -1) {
                  setOrdersState1(prev => prev.map((o, idx) => idx === orderIndex1 ? selectedOrder : o));
                }
                const orderIndex2 = ordersState2.findIndex(o => o.nr === selectedOrder.nr);
                if (orderIndex2 !== -1) {
                  setOrdersState2(prev => prev.map((o, idx) => idx === orderIndex2 ? selectedOrder : o));
                }
                
                // If email is set, hide the Fehler icon for this row
                const rowNr = typeof selectedOrder.nr === 'number' ? selectedOrder.nr : parseInt(String(selectedOrder.nr)) || null;
                if (rowNr !== null && selectedOrder.email && selectedOrder.email.trim() !== '') {
                  // Count current errors before updating
                  const dataToCheck = activeTab === "rechnung" ? ordersState1 : ordersState2;
                  let currentFehlerCount = 0;
                  let currentRowHasFehler = false;
                  
                  dataToCheck.forEach((order) => {
                    if (activeTab === "rechnung" && order.type === "Versandvorgang") return;
                    const checkRowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
                    if (checkRowNr !== null) {
                      const checklistData = checklistMap.get(checkRowNr);
                      if (checklistData?.fehler === true) {
                        currentFehlerCount++;
                        if (checkRowNr === rowNr) {
                          currentRowHasFehler = true;
                        }
                      }
                    }
                  });
                  
                  // Update checklistMap to hide Fehler icon for this row
                  if (currentRowHasFehler) {
                    setChecklistMap(prev => {
                      const newMap = new Map(prev);
                      const existing = newMap.get(rowNr) || {
                        nr: rowNr,
                        rechnungVersendet: false,
                        sendungErstellt: false,
                        versandprofilHinzugefuegt: false,
                        picklisteErstellt: false,
                        packlisteErstellt: false,
                        paketlisteErstellt: false,
                        versendet: false,
                        fehler: false,
                      };
                      newMap.set(rowNr, {
                        ...existing,
                        fehler: false,
                      });
                      return newMap;
                    });
                    
                    // Hide Fehler column if this was the last error
                    if (currentFehlerCount === 1) {
                      if (activeTab === "rechnung") {
                        setRechnungColumnVisibility((prev) => ({
                          ...prev,
                          "floating-col-2-rechnung": false,
                        }));
                        setIsChecked4(false);
                      } else {
                        setVersandColumnVisibility((prev) => ({
                          ...prev,
                          "floating-col-2-versand": false,
                        }));
                        setIsChecked12(false);
                      }
                    }
                  }
                }
                
                // Close the sheet
                setIsSheetOpen(false);
                
                // Clear all filters to show all filtered rows
                setIsChecked(false);
                setIsChecked2(false);
                setIsChecked3(false);
                setIsChecked4(false);
                setIsChecked5(false);
                setIsChecked6(false);
                setIsChecked7(false);
                setIsChecked8(false);
                setIsChecked9(false);
                setIsChecked10(false);
                setGlobalFilter("");
                setGlobalFilter1("");
                setGlobalFilter2("");
                setImportquelle("");
                setZeilennummern("");
                setKaufdatum(undefined);
                setImportdatum(undefined);
                setSteuerland("");
                setVersanddatum(undefined);
                setVersandland("");
                setVersandzielland("");
                setVersandprofil("");
                setVersanddienstleister("");
                setVersandverpackung("");
              }}
            >
              Speichern
            </Button>
            {activeTab === "rechnung" && isSheetOpen && selectedOrder && (
              <Button 
                variant="outline" 
                className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
                onClick={() => {
                  if (!selectedOrder) return;
                  // Mark the selected order if not already marked - using type assertion to match sheet button logic
                  const currentTab = activeTab as "rechnung" | "versand";
                  if (currentTab === "rechnung" && !markedRows1.has(selectedOrder.nr)) {
                    setMarkedRows1(prev => new Set(prev).add(selectedOrder.nr));
                  } else if (currentTab === "versand" && !markedRows2.has(selectedOrder.nr)) {
                    setMarkedRows2(prev => new Set(prev).add(selectedOrder.nr));
                  }
                  // Trigger single-row sendung modal
                  setShowSingleRowSendungModal(true);
                  setSingleRowSendungStep(-1);
                  setSingleRowProgressValue(0);
                }}
              >
                <Package className="size-4" />
                Sendung erstellen
              </Button>
            )}
            <div className="ml-auto flex gap-1">
              {activeTab === "rechnung" && (
                <Button 
                  variant="outline" 
                  className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
                  onClick={() => setShowFunktionenBestellungenCommand(true)}
                >
                  <MoreHorizontal className="size-4" />
                  <span className="hidden sm:inline">Weitere Funktionen</span>
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Alert Dialog for no selection */}
      <AlertDialog open={showNoSelectionAlert} onOpenChange={setShowNoSelectionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeTab === "rechnung" 
                ? "Es wurden keine Bestellungen ausgewählt" 
                : "Es wurden keine Sendungen ausgewählt"}
            </AlertDialogTitle>
            <AlertDialogDescription className="!text-foreground text-sm font-light leading-[130%]">
              Die Aktionen können nur auf markierte Zeilen angewendet werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNoSelectionAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for no Sendungen found */}
      <AlertDialog open={showNoSendungenModal} onOpenChange={setShowNoSendungenModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {noSendungenModalIsSingle ? "Keine Sendung vorhanden" : "Keine Sendungen vorhanden"}
            </AlertDialogTitle>
            <AlertDialogDescription className="!text-foreground text-sm font-light leading-[130%]">
              {noSendungenModalIsSingle 
                ? "Für diese Bestellung wurde bisher noch keine Sendung erstellt."
                : "Für diese Bestellungen wurden bisher noch keine Sendungen erstellt."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNoSendungenModal(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for no Bestellungen found */}
      <AlertDialog open={showNoBestellungenModal} onOpenChange={setShowNoBestellungenModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {noBestellungenModalIsSingle ? "Keine Bestellung vorhanden" : "Keine Bestellungen vorhanden"}
            </AlertDialogTitle>
            <AlertDialogDescription className="!text-foreground text-sm font-light leading-[130%]">
              {noBestellungenModalIsSingle 
                ? "Für diese Sendung wurde bisher noch keine Bestellung erstellt."
                : "Für diese Sendungen wurden bisher noch keine Bestellungen erstellt."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNoBestellungenModal(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for address matching with carousel */}
      <AlertDialog 
        open={showAddressMatchAlert} 
        onOpenChange={(open) => {
          setShowAddressMatchAlert(open);
          if (!open) {
            setAddressMatchStep(-1);
            setProgressValue(0);
          } else {
            // Reset to progress step when opening
            setAddressMatchStep(-1);
            setProgressValue(0);
          }
        }}
      >
        <AlertDialogContent className="!w-[640px] !h-[380px] !min-w-[640px] !min-h-[380px] !max-w-[640px] !max-h-[380px] !flex !flex-col">
          {(() => {
            // Check if any marked rows have "Sendung erstellt" -> true
            const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
            const hasSendungErstellt = markedVisibleRows.some(row => {
              const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
              const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
              return checklistData?.sendungErstellt === true;
            });
            
            // Check if there are duplicate kundeAdresse values in marked rows
            const kundeAdressen = markedVisibleRows.map(row => row.kundeAdresse || "").filter(addr => addr !== "");
            const kundeAdressenSet = new Set(kundeAdressen);
            const hasDuplicateAddresses = kundeAdressen.length > kundeAdressenSet.size;
            
            // Calculate transform offset - account for Steps 0 and 1 being conditionally rendered
            // Returns the DOM position index (0 = Progress, 1+ = actual steps)
            const getStepOffset = (step: number) => {
              if (step === -1) return 0; // Progress always at offset 0
              
              // Build array of which steps are actually rendered
              const renderedSteps: number[] = [];
              if (hasSendungErstellt) renderedSteps.push(0);
              if (hasDuplicateAddresses) renderedSteps.push(1);
              renderedSteps.push(2); // Step 2 always rendered
              renderedSteps.push(3); // Step 3 always rendered
              
              // Find the index of current step in rendered steps array
              const stepIndex = renderedSteps.indexOf(step);
              
              if (stepIndex === -1) {
                // Step is not rendered, find the next rendered step
                const nextRenderedStep = renderedSteps.find(s => s > step);
                if (nextRenderedStep !== undefined) {
                  return renderedSteps.indexOf(nextRenderedStep) + 1; // +1 for progress step
                }
                // If no next step, go to last step
                return renderedSteps.length; // +1 for progress will be added below
              }
              
              return stepIndex + 1; // +1 because progress is at index 0
            };
            
            return (
              <>
                {/* Carousel Container */}
                <div className="relative overflow-hidden flex-1">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${getStepOffset(addressMatchStep) * 100}%)` }}
                  >
                    {/* Step -1: Progress */}
                    <div className="min-w-full">
                      <div className="p-4 flex flex-col items-center justify-center h-full gap-4 pt-[60px]">
                        <p className="text-sm text-foreground text-center">Ihre Bestellungen werden analysiert</p>
                        <div className="w-full max-w-[500px]">
                          <Progress value={progressValue} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 0: Initial - Only show if any rows have sendungErstellt */}
                    {hasSendungErstellt && (
                      <div className="min-w-full">
                        <div className="p-4 flex gap-8">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-2">Sendungen erstellen</p>
                            <h3 className="text-xl font-bold mb-4">
                              Für einige der ausgewählten Bestellungen wurde bereits eine Sendung erstellt.
                            </h3>
                            <p className="text-sm">
                              Möchten Sie für alle Bestellungen eine neue Sendungen erstellen?
                            </p>
                          </div>
                          <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                            <img 
                              src={illuSendung1} 
                              alt="Sendungen erstellen Illustration 1" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}
              
              {/* Step 1: Adressdaten - Only show if there are duplicate addresses */}
              {hasDuplicateAddresses && (
                <div className="min-w-full">
                  <div className="p-4 flex gap-8">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-2">Sendungen erstellen</p>
                      <h3 className="text-xl font-bold mb-4">Bestellungen verbinden</h3>
                      <p className="text-sm">
                        Es wurden Bestellungen mit gleichen Kunden-/Lieferdaten gefunden. Sollen sie zu einer Sendung zusammengefasst werden?
                      </p>
                    </div>
                    <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                      <img 
                        src={illuSendung2} 
                        alt="Sendungen erstellen Illustration 2" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Versandprofile */}
              {React.useMemo(() => {
                const markedCount = markedRows1.size;
                const availableCount = markedCount > 0 ? Math.floor(Math.random() * (markedCount - 1)) + 1 : 0;
                
                return (
                  <div className="min-w-full">
                    <div className="p-4 flex gap-8">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">Sendungen erstellen</p>
                        <h3 className="text-xl font-bold mb-4">Versandprofil(e) hinzufügen</h3>
                        <p className="text-sm">
                          Für {availableCount} von {markedCount} Bestellungen sind passende Versandprofile verfügbar. Möchten Sie sie hinzufügen?
                        </p>
                      </div>
                      <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                        <img 
                          src={illuSendung3} 
                          alt="Sendungen erstellen Illustration 3" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                );
              }, [markedRows1])}
              
              {/* Step 3: Sendungen erstellt */}
              <div className="min-w-full">
                <div className="p-4 flex gap-8">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">Sendungen erstellen</p>
                    <h3 className="text-xl font-bold mb-4">Fertig!</h3>
                    <p className="text-sm">
                      4 neue Sendungen wurden erstellt. Möchten Sie sie jetzt anzeigen?
                    </p>
                  </div>
                  <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                    <img 
                      src={illuSendung4} 
                      alt="Sendungen erstellen Illustration 4" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
                  </div>
                </div>
              </>
            );
          })()}

          <AlertDialogFooter className="!flex-row !justify-between sm:!justify-between items-center !mt-auto !h-[36px] !p-0">
            {(() => {
              // Check if any marked rows have "Sendung erstellt" -> true
              const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
              const hasSendungErstellt = markedVisibleRows.some(row => {
                const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
                const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
                return checklistData?.sendungErstellt === true;
              });
              
              // Check if there are duplicate kundeAdresse values
              const kundeAdressen = markedVisibleRows.map(row => row.kundeAdresse || "").filter(addr => addr !== "");
              const kundeAdressenSet = new Set(kundeAdressen);
              const hasDuplicateAddresses = kundeAdressen.length > kundeAdressenSet.size;
              
              if (addressMatchStep === -1) {
                // Progress step - no buttons
                return <div />;
              } else if (addressMatchStep === 0 && hasSendungErstellt) {
                return (
                  <>
                    <AlertDialogAction 
                      onClick={() => {
                        setShowAddressMatchAlert(false);
                        setAddressMatchStep(0);
                      }}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Abbrechen
                    </AlertDialogAction>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          // Skip to step 1 if duplicates exist, otherwise skip to step 2
                          setAddressMatchStep(hasDuplicateAddresses ? 1 : 2);
                        }}
                      >
                        Nur für Bestellungen ohne Sendung
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Skip to step 1 if duplicates exist, otherwise skip to step 2
                          setAddressMatchStep(hasDuplicateAddresses ? 1 : 2);
                        }}
                      >
                        Ja, für alle
                      </Button>
                    </div>
                  </>
                );
              } else if (addressMatchStep === 1 && hasDuplicateAddresses) {
                // Step 1 is shown (duplicate addresses exist)
                return (
                  <>
                    <AlertDialogAction 
                      onClick={() => {
                        setShowAddressMatchAlert(false);
                        setAddressMatchStep(0);
                      }}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Abbrechen
                    </AlertDialogAction>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Set state to show all duplicates (separate)
                          setCombineDuplicateAddresses(false);
                          setAddressMatchStep(2); // Move to next step
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Nein, getrennte Sendungen
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Set state to combine duplicates (show only one)
                          setCombineDuplicateAddresses(true);
                          setAddressMatchStep(2); // Move to next step
                        }}
                      >
                        Ja, verbinden
                      </Button>
                    </div>
                  </>
                );
              } else if (addressMatchStep === 2) {
                return (
                  <>
                    <AlertDialogAction 
                      onClick={() => {
                        setShowAddressMatchAlert(false);
                        setAddressMatchStep(0);
                      }}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Abbrechen
                    </AlertDialogAction>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Show check symbols in "Sendung erstellt" for all marked rows
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          setChecklistMap(prev => {
                            const newMap = new Map(prev);
                            markedVisibleRows.forEach(row => {
                              const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                              const existing = newMap.get(rowNr) || {
                                nr: rowNr,
                                rechnungVersendet: false,
                                sendungErstellt: false,
                                versandprofilHinzugefuegt: false,
                                picklisteErstellt: false,
                                packlisteErstellt: false,
                                paketlisteErstellt: false,
                                versendet: false,
                                fehler: false,
                              };
                              newMap.set(rowNr, {
                                ...existing,
                                sendungErstellt: true,
                              });
                            });
                            return newMap;
                          });
                          setAddressMatchStep(3); // Move to next step
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Versandprofile später hinzufügen
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Find all rows in Sendungen where versandland is "DE" to update both ordersState2 and checklistMap
                          const rowsToUpdate = ordersState2.filter(order => 
                            order.type === "Versandvorgang" && order.versandland === "DE"
                          );
                          
                          // Update versandprofil to "DHL National" for all rows in Sendungen where versandland is "DE"
                          setOrdersState2((prevOrders) => {
                            return prevOrders.map((order) => {
                              if (order.type === "Versandvorgang" && order.versandland === "DE") {
                                return {
                                  ...order,
                                  versandprofil: "DHL National",
                                };
                              }
                              return order;
                            });
                          });
                          
                          // Also update checklistMap to set versandprofilHinzugefuegt to true for affected rows
                          setChecklistMap(prevChecklistMap => {
                            const newMap = new Map(prevChecklistMap);
                            rowsToUpdate.forEach(order => {
                              const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || 0;
                              const existing = newMap.get(rowNr) || {
                                nr: rowNr,
                                rechnungVersendet: false,
                                sendungErstellt: false,
                                versandprofilHinzugefuegt: false,
                                picklisteErstellt: false,
                                packlisteErstellt: false,
                                paketlisteErstellt: false,
                                versendet: false,
                                fehler: false,
                              };
                              newMap.set(rowNr, {
                                ...existing,
                                versandprofilHinzugefuegt: true,
                              });
                            });
                            return newMap;
                          });
                          
                          setAddressMatchStep(3); // Move to next step
                        }}
                      >
                        Ja, hinzufügen
                      </Button>
                    </div>
                  </>
                );
              } else {
                // Step 3 or other
                return (
                  <>
                    {addressMatchStep !== 3 && (
                      <Button
                        variant="outline"
                        onClick={() => setAddressMatchStep(2)}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Zurück
                      </Button>
                    )}
                    <div className={`flex gap-3 ${addressMatchStep === 3 ? 'ml-auto' : ''}`}>
                      <AlertDialogAction 
                        onClick={() => {
                          // Get the currently selected rows from Bestellungen (from when button was clicked)
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          
                          if (markedVisibleRows.length > 0) {
                            // Collect all unique kundeAdresse values from selected rows
                            const kundeAdressen = new Set(markedVisibleRows.map(row => row.kundeAdresse || ""));
                            
                            // Make all rows in Sendungen visible which match the Kunde/Lieferadresse values
                            setVisibleKundeAdressenForSendungen(kundeAdressen);
                            
                            // Switch to Sendungen tab
                            setActiveTab("versand");
                          }
                          
                          setShowAddressMatchAlert(false);
                          setAddressMatchStep(0);
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Nein, schließen
                      </AlertDialogAction>
                      <AlertDialogAction 
                        onClick={() => {
                          // Get the currently selected rows from Bestellungen
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          
                          if (markedVisibleRows.length > 0) {
                            // Collect all unique kundeAdresse values from selected rows
                            const kundeAdressen = new Set(markedVisibleRows.map(row => row.kundeAdresse || ""));
                            
                            // Make all rows in Sendungen visible which match the Kunde/Lieferadresse values
                            setVisibleKundeAdressenForSendungen(kundeAdressen);
                            
                            // Find matching rows in Sendungen table by kundeAdresse (use ordersState2 for all data, not just visible)
                            const matchingRows = ordersState2.filter(row => kundeAdressen.has(row.kundeAdresse || ""));
                            
                            // Mark matching rows in Sendungen table
                            if (matchingRows.length > 0) {
                              const newMarkedRows = new Set<string | number>();
                              matchingRows.forEach(row => {
                                newMarkedRows.add(row.nr);
                              });
                              setMarkedRows2(newMarkedRows);
                            }
                            
                            // Switch to Sendungen tab
                            setActiveTab("versand");
                            
                            // Show check symbols in "Sendung erstellt" for selected Bestellungen rows
                            setChecklistMap(prev => {
                              const newMap = new Map(prev);
                              // Update Bestellungen rows
                              markedVisibleRows.forEach(row => {
                                const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                                const existing = newMap.get(rowNr) || {
                                  nr: rowNr,
                                  rechnungVersendet: false,
                                  sendungErstellt: false,
                                  versandprofilHinzugefuegt: false,
                                  picklisteErstellt: false,
                                  packlisteErstellt: false,
                                  paketlisteErstellt: false,
                                  versendet: false,
                                  fehler: false,
                                };
                                newMap.set(rowNr, {
                                  ...existing,
                                  sendungErstellt: true,
                                });
                              });
                              return newMap;
                            });
                          }
                          
                          setShowAddressMatchAlert(false);
                          setAddressMatchStep(0);
                        }}
                      >
                        Ja, anzeigen
                      </AlertDialogAction>
                    </div>
                  </>
                );
              }
            })()}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for single row sendung creation - Independent copy of Sendungen erstellen */}
      <AlertDialog 
        open={showSingleRowSendungModal} 
        onOpenChange={(open) => {
          setShowSingleRowSendungModal(open);
          if (!open) {
            setSingleRowSendungStep(-1);
            setSingleRowProgressValue(0);
          } else {
            // Reset to progress step when opening
            setSingleRowSendungStep(-1);
            setSingleRowProgressValue(0);
          }
        }}
      >
        <AlertDialogContent className="!w-[640px] !h-[380px] !min-w-[640px] !min-h-[380px] !max-w-[640px] !max-h-[380px] !flex !flex-col">
          {(() => {
            // Check if the single marked row has "Sendung erstellt" -> true
            const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
            const hasSendungErstellt = markedVisibleRows.length === 1 && markedVisibleRows.some(row => {
              const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
              const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
              return checklistData?.sendungErstellt === true;
            });
            
            // Calculate transform offset - account for Steps 0 being conditionally rendered
            // Returns the DOM position index (0 = Progress, 1+ = actual steps)
            const getSingleRowStepOffset = (step: number) => {
              if (step === -1) return 0; // Progress always at offset 0
              
              // Build array of which steps are actually rendered
              const renderedSteps: number[] = [];
              if (hasSendungErstellt) renderedSteps.push(0);
              renderedSteps.push(2); // Step 2 always rendered
              renderedSteps.push(3); // Step 3 always rendered
              
              // Find the index of current step in rendered steps array
              const stepIndex = renderedSteps.indexOf(step);
              
              if (stepIndex === -1) {
                // Step is not rendered, find the next rendered step
                const nextRenderedStep = renderedSteps.find(s => s > step);
                if (nextRenderedStep !== undefined) {
                  return renderedSteps.indexOf(nextRenderedStep) + 1; // +1 for progress step
                }
                // If no next step, go to last step
                return renderedSteps.length; // +1 for progress will be added below
              }
              
              return stepIndex + 1; // +1 because progress is at index 0
            };
            
            // Step -1: Progress Card (separate object)
            const singleRowProgressCard = (
              <div className="min-w-full">
                <div className="p-4 flex flex-col items-center justify-center h-full gap-4 pt-[60px]">
                  <p className="text-sm text-foreground text-center">Ihre Bestellung wird analysiert</p>
                  <div className="w-full max-w-[500px]">
                    <Progress value={singleRowProgressValue} className="h-2" />
                  </div>
                </div>
              </div>
            );

            // Step 0: Initial Card (separate object) - Only show if sendung erstellt exists
            const singleRowInitialCard = hasSendungErstellt ? (
              <div className="min-w-full">
                <div className="p-4 flex gap-8">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">Sendung erstellen</p>
                    <h3 className="text-xl font-bold mb-4">
                      Für diese Bestellung wurde bereits eine Sendung erstellt.
                    </h3>
                    <p className="text-sm">
                      Möchten Sie für diese Bestellung eine neue Sendung erstellen?
                    </p>
                  </div>
                  <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                    <img 
                      src={illuSendung1} 
                      alt="Sendung erstellen Illustration 1" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ) : null;

            // Step 2: Versandprofile Card (separate object)
            const singleRowVersandprofileCard = (
              <div className="min-w-full">
                <div className="p-4 flex gap-8">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">Sendung erstellen</p>
                    <h3 className="text-xl font-bold mb-4">Versandprofil hinzufügen</h3>
                    <p className="text-sm">
                      Für diese Bestellung ist ein passendes Versandprofil verfügbar. Möchten Sie es hinzufügen?
                    </p>
                  </div>
                  <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                    <img 
                      src={illuSendung3} 
                      alt="Sendung erstellen Illustration 3" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            );

            // Step 3: Success Card (separate object)
            const singleRowSuccessCard = (
              <div className="min-w-full">
                <div className="p-4 flex gap-8">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">Sendung erstellen</p>
                    <h3 className="text-xl font-bold mb-4">Fertig!</h3>
                    <p className="text-sm">
                      1 neue Sendung wurde erstellt. Möchten Sie sie jetzt anzeigen?
                    </p>
                  </div>
                  <div className="w-[220px] h-[220px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D6F270' }}>
                    <img 
                      src={illuSendung4} 
                      alt="Sendung erstellen Illustration 4" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            );
            
            return (
              <>
                {/* Carousel Container */}
                <div className="relative overflow-hidden flex-1">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${getSingleRowStepOffset(singleRowSendungStep) * 100}%)` }}
                  >
                    {/* Step -1: Progress */}
                    {singleRowProgressCard}
                    
                    {/* Step 0: Initial - Only show if sendung erstellt exists */}
                    {singleRowInitialCard}
                    
                    {/* Step 2: Versandprofile */}
                    {singleRowVersandprofileCard}
                    
                    {/* Step 3: Success */}
                    {singleRowSuccessCard}
                  </div>
                </div>
              </>
            );
          })()}

          <AlertDialogFooter className="!flex-row !justify-between sm:!justify-between items-center !mt-auto !h-[36px] !p-0">
            {(() => {
              // Check if the single marked row has "Sendung erstellt" -> true
              const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
              const hasSendungErstellt = markedVisibleRows.length === 1 && markedVisibleRows.some(row => {
                const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
                const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
                return checklistData?.sendungErstellt === true;
              });
              
              if (singleRowSendungStep === -1) {
                // Progress step - no buttons
                return <div />;
              } else if (singleRowSendungStep === 0 && hasSendungErstellt) {
                return (
                  <>
                    <AlertDialogAction 
                      onClick={() => {
                        setShowSingleRowSendungModal(false);
                        setSingleRowSendungStep(-1);
                      }}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Abbrechen
                    </AlertDialogAction>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          // Get the currently selected row from Bestellungen
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          
                          if (markedVisibleRows.length === 1) {
                            const selectedRow = markedVisibleRows[0];
                            const kundeAdresse = selectedRow.kundeAdresse || "";
                            
                            // Make all rows in Sendungen visible which match the Kunde/Lieferadresse value
                            const kundeAdressen = new Set([kundeAdresse]);
                            setVisibleKundeAdressenForSendungen(kundeAdressen);
                            
                            // Find matching rows in Sendungen table by kundeAdresse (use ordersState2 for all data, not just visible)
                            const matchingRows = ordersState2.filter(row => row.kundeAdresse === kundeAdresse);
                            
                            // Mark matching rows in Sendungen table
                            if (matchingRows.length > 0) {
                              const newMarkedRows = new Set<string | number>();
                              matchingRows.forEach(row => {
                                newMarkedRows.add(row.nr);
                              });
                              setMarkedRows2(newMarkedRows);
                            }
                            
                            // Switch to Sendungen tab
                            setActiveTab("versand");
                            
                            // Show check symbols in "Sendung erstellt" for selected Bestellung row
                            setChecklistMap(prev => {
                              const newMap = new Map(prev);
                              markedVisibleRows.forEach(row => {
                                const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                                const existing = newMap.get(rowNr) || {
                                  nr: rowNr,
                                  rechnungVersendet: false,
                                  sendungErstellt: false,
                                  versandprofilHinzugefuegt: false,
                                  picklisteErstellt: false,
                                  packlisteErstellt: false,
                                  paketlisteErstellt: false,
                                  versendet: false,
                                  fehler: false,
                                };
                                newMap.set(rowNr, {
                                  ...existing,
                                  sendungErstellt: true,
                                });
                              });
                              return newMap;
                            });
                          }
                          
                          // Close the sheet
                          setIsSheetOpen(false);
                          
                          setShowSingleRowSendungModal(false);
                          setSingleRowSendungStep(-1);
                        }}
                      >
                        Nein, Sendung anzeigen
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Skip to step 2
                          setSingleRowSendungStep(2);
                        }}
                      >
                        Ja, neue Sendung
                      </Button>
                    </div>
                  </>
                );
              } else if (singleRowSendungStep === 2) {
                return (
                  <>
                    <AlertDialogAction 
                      onClick={() => {
                        setShowSingleRowSendungModal(false);
                        setSingleRowSendungStep(-1);
                      }}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Abbrechen
                    </AlertDialogAction>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Show check symbols in "Sendung erstellt" for the single marked row
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          setChecklistMap(prev => {
                            const newMap = new Map(prev);
                            markedVisibleRows.forEach(row => {
                              const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                              const existing = newMap.get(rowNr) || {
                                nr: rowNr,
                                rechnungVersendet: false,
                                sendungErstellt: false,
                                versandprofilHinzugefuegt: false,
                                picklisteErstellt: false,
                                packlisteErstellt: false,
                                paketlisteErstellt: false,
                                versendet: false,
                                fehler: false,
                              };
                              newMap.set(rowNr, {
                                ...existing,
                                sendungErstellt: true,
                              });
                            });
                            return newMap;
                          });
                          setSingleRowSendungStep(3); // Move to next step
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Versandprofil später hinzufügen
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Add versandprofil functionality for single row
                          // Show check symbols in "Sendung erstellt" for the single marked row
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          setChecklistMap(prev => {
                            const newMap = new Map(prev);
                            markedVisibleRows.forEach(row => {
                              const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                              const existing = newMap.get(rowNr) || {
                                nr: rowNr,
                                rechnungVersendet: false,
                                sendungErstellt: false,
                                versandprofilHinzugefuegt: false,
                                picklisteErstellt: false,
                                packlisteErstellt: false,
                                paketlisteErstellt: false,
                                versendet: false,
                                fehler: false,
                              };
                              newMap.set(rowNr, {
                                ...existing,
                                sendungErstellt: true,
                                versandprofilHinzugefuegt: true,
                              });
                            });
                            return newMap;
                          });
                          setSingleRowSendungStep(3); // Move to next step
                        }}
                      >
                        Ja, hinzufügen
                      </Button>
                    </div>
                  </>
                );
              } else {
                // Step 3 or other
                return (
                  <>
                    {singleRowSendungStep !== 3 && (
                      <Button
                        variant="outline"
                        onClick={() => setSingleRowSendungStep(2)}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Zurück
                      </Button>
                    )}
                    <div className={`flex gap-3 ${singleRowSendungStep === 3 ? 'ml-auto' : ''}`}>
                      <AlertDialogAction 
                        onClick={() => {
                          // Get the currently selected row from Bestellungen
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          
                          if (markedVisibleRows.length === 1) {
                            const selectedRow = markedVisibleRows[0];
                            const kundeAdresse = selectedRow.kundeAdresse || "";
                            
                            // Make all rows in Sendungen visible which match the Kunde/Lieferadresse value
                            const kundeAdressen = new Set([kundeAdresse]);
                            setVisibleKundeAdressenForSendungen(kundeAdressen);
                            
                            // Switch to Sendungen tab
                            setActiveTab("versand");
                          }
                          
                          setShowSingleRowSendungModal(false);
                          setSingleRowSendungStep(-1);
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Nein, schließen
                      </AlertDialogAction>
                      <AlertDialogAction 
                        onClick={() => {
                          // Get the currently selected row from Bestellungen
                          const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                          
                          if (markedVisibleRows.length === 1) {
                            const selectedRow = markedVisibleRows[0];
                            const kundeAdresse = selectedRow.kundeAdresse || "";
                            
                            // Make all rows in Sendungen visible which match the Kunde/Lieferadresse value
                            const kundeAdressen = new Set([kundeAdresse]);
                            setVisibleKundeAdressenForSendungen(kundeAdressen);
                            
                            // Find matching rows in Sendungen table by kundeAdresse (use ordersState2 for all data, not just visible)
                            const matchingRows = ordersState2.filter(row => row.kundeAdresse === kundeAdresse);
                            
                            // Mark matching rows in Sendungen table
                            if (matchingRows.length > 0) {
                              const newMarkedRows = new Set<string | number>();
                              matchingRows.forEach(row => {
                                newMarkedRows.add(row.nr);
                              });
                              setMarkedRows2(newMarkedRows);
                            }
                            
                            // Switch to Sendungen tab
                            setActiveTab("versand");
                            
                            // Show check symbols in "Sendung erstellt" for selected Bestellung row
                            setChecklistMap(prev => {
                              const newMap = new Map(prev);
                              markedVisibleRows.forEach(row => {
                                const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                                const existing = newMap.get(rowNr) || {
                                  nr: rowNr,
                                  rechnungVersendet: false,
                                  sendungErstellt: false,
                                  versandprofilHinzugefuegt: false,
                                  picklisteErstellt: false,
                                  packlisteErstellt: false,
                                  paketlisteErstellt: false,
                                  versendet: false,
                                  fehler: false,
                                };
                                newMap.set(rowNr, {
                                  ...existing,
                                  sendungErstellt: true,
                                });
                              });
                              return newMap;
                            });
                          }
                          
                          setShowSingleRowSendungModal(false);
                          setSingleRowSendungStep(-1);
                        }}
                      >
                        Ja, anzeigen
                      </AlertDialogAction>
                    </div>
                  </>
                );
              }
            })()}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for confirming resending invoices */}
      <AlertDialog 
        open={showRechnungErneutVersendenModal} 
        onOpenChange={setShowRechnungErneutVersendenModal}
      >
        <AlertDialogContent className="max-w-[512px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Rechnung erneut versenden?</AlertDialogTitle>
            <AlertDialogDescription className="!text-foreground">
              Für einige der markierten Bestellungen wurden bereits Rechnungen an Kunden versendet. Möchten Sie die Rechnungen trotzdem senden?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="!flex-row !justify-between sm:!justify-between items-center">
            <AlertDialogAction 
              onClick={() => {
                setShowRechnungErneutVersendenModal(false);
              }}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Nein, abbrechen
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => {
                // Send invoices to all selected rows
                const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                const count = markedVisibleRows.length;
                
                // Update checklistMap to show "Rechnung versendet" check symbols permanently
                setChecklistMap(prev => {
                  const newMap = new Map(prev);
                  markedVisibleRows.forEach(row => {
                    const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || 0;
                    const existing = newMap.get(rowNr) || {
                      nr: rowNr,
                      rechnungVersendet: false,
                      sendungErstellt: false,
                      versandprofilHinzugefuegt: false,
                      picklisteErstellt: false,
                      packlisteErstellt: false,
                      paketlisteErstellt: false,
                      versendet: false,
                      fehler: false,
                    };
                    newMap.set(rowNr, {
                      ...existing,
                      rechnungVersendet: true,
                    });
                  });
                  return newMap;
                });
                
                toast.success(
                  `${count} Rechnungen wurden erfolgreich versendet`,
                  { duration: 3000 }
                );
                
                setShowRechnungErneutVersendenModal(false);
              }}
            >
              Ja, an alle senden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Funktionen Bestellungen Command Dialog */}
      <CommandDialog
        open={showFunktionenBestellungenCommand}
        onOpenChange={setShowFunktionenBestellungenCommand}
        title="Funktionen Bestellungen"
        description="Wählen Sie eine Funktion aus"
      >
        <CommandInput placeholder="Funktion suchen..." />
        <CommandList>
          <CommandEmpty>Keine Funktion gefunden.</CommandEmpty>
          <CommandGroup heading="Rechnung">
            <CommandItem
              onSelect={() => {
                setShowFunktionenBestellungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Count marked rows that are also visible (we're in rechnung tab)
                  const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));

                  // Check if any selected rows already have "Rechnung versendet" visible
                  const rowsWithRechnungVersendet = markedVisibleRows.filter(row => {
                    const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
                    if (rowNr === null) return false;
                    const checklistData = checklistMap.get(rowNr);
                    return checklistData?.rechnungVersendet === true;
                  });

                  // If there are rows with already sent invoices, show confirmation modal
                  if (rowsWithRechnungVersendet.length > 0) {
                    setShowRechnungErneutVersendenModal(true);
                    return;
                  }

                  // Separate rows with email and without email
                  const rowsWithEmail = markedVisibleRows.filter(row => row.email && row.email.trim() !== '');
                  const rowsWithoutEmail = markedVisibleRows.filter(row => !row.email || row.email.trim() === '');

                  // Only process rows with email
                  const successCount = rowsWithEmail.length;
                  const errorCount = rowsWithoutEmail.length;

                  // Set "Rechnung versendet" to true in checklistMap for rows with email
                  if (rowsWithEmail.length > 0) {
                    setChecklistMap(prev => {
                      const newMap = new Map(prev);
                      rowsWithEmail.forEach(row => {
                        const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
                        if (rowNr !== null) {
                          const existing = newMap.get(rowNr) || {
                            nr: rowNr,
                            rechnungVersendet: false,
                            sendungErstellt: false,
                            versandprofilHinzugefuegt: false,
                            picklisteErstellt: false,
                            packlisteErstellt: false,
                            paketlisteErstellt: false,
                            versendet: false,
                            fehler: false,
                          };
                          newMap.set(rowNr, {
                            ...existing,
                            rechnungVersendet: true,
                          });
                        }
                      });
                      return newMap;
                    });
                  }

                  // Show "Fehler" icon temporarily for rows without email (only in Bestellungen table)
                  if (rowsWithoutEmail.length > 0 && activeTab === "rechnung") {
                    rowsWithoutEmail.forEach(row => {
                      const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
                      if (rowNr !== null) {
                        // Set to expire in 1 year (effectively until browser reload)
                        showIconTemporarily(`fehler-${rowNr}`, 365 * 24 * 60 * 60 * 1000);
                      }
                    });
                  }

                  // Show success toast only if there are rows with email
                  if (successCount > 0) {
                    toast.success(
                      `${successCount} Rechnungen wurden erfolgreich versendet`,
                      {
                        duration: 3000,
                      }
                    );
                  }

                  // Show error toast for rows without email
                  if (errorCount > 0) {
                    setTimeout(() => {
                      toast.error(
                        <div>
                          <div className="font-medium">{errorCount} Versandfehler</div>
                          <div className="text-xs mt-1 font-normal">Prüfen Sie die E-Mail Adresse.</div>
                        </div>,
                        {
                          duration: Infinity,
                          icon: <AlertTriangle className="size-4 text-destructive" />,
                          action: {
                            label: "Anzeigen",
                            onClick: () => {
                              // Switch to rechnung tab if not already
                              if (activeTab !== "rechnung") {
                                setActiveTab("rechnung");
                              }
                              // Activate Fehler filter to show only rows where Fehler icon is visible
                              setIsChecked4(true);
                              // Close the toast
                              toast.dismiss();
                              // Scroll to the first row with Fehler icon after filter is applied
                              setTimeout(() => {
                                const tableElement = document.querySelector('[data-name="BestellungenTable"]');
                                if (tableElement) {
                                  const rows = tableElement.querySelectorAll('tbody tr');
                                  if (rows.length > 0) {
                                    const firstRow = rows[0] as HTMLElement;
                                    firstRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }
                                }
                              }, 200);
                            },
                          },
                        }
                      );
                    }, successCount > 0 ? 3000 : 0);
                  }
                });
              }}
            >
              <Mail className="size-4" />
              {markedRowsCount > 1 ? "Rechnungen versenden" : "Rechnung versenden"}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setShowFunktionenBestellungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle Rechnung downloaden
                });
              }}
            >
              <CloudDownload className="size-4" />
              {markedRowsCount > 1 ? "Rechnungen downloaden" : "Rechnung downloaden"}
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Bestellungen">
            <CommandItem
              onSelect={() => {
                setShowFunktionenBestellungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle löschen
                });
              }}
              className="text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive"
            >
              <Trash2 className="size-4 text-destructive" />
              Löschen
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sendungen">
            <CommandItem
              onSelect={() => {
                setShowFunktionenBestellungenCommand(false);
                handleShowRelatedShipments();
              }}
            >
              <Package className="size-4" />
              {markedRowsCount === 1 ? "Dazugehörige Sendung anzeigen" : "Dazugehörige Sendungen anzeigen"}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Funktionen Sendungen Command Dialog */}
      <CommandDialog
        open={showFunktionenSendungenCommand}
        onOpenChange={setShowFunktionenSendungenCommand}
        title="Funktionen Sendungen"
        description="Wählen Sie eine Funktion aus"
      >
        <CommandInput placeholder="Funktion suchen..." />
        <CommandList>
          <CommandEmpty>Keine Funktion gefunden.</CommandEmpty>
          <CommandGroup heading="Versanddokumente">
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle Pickliste erstellen
                });
              }}
            >
              <ClipboardList className="size-4" />
              Pickliste erstellen
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle Versanddokumente downloaden
                });
              }}
            >
              <CloudDownload className="size-4" />
              Versanddokumente downloaden
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle Versanddokumente drucken
                });
              }}
            >
              <Printer className="size-4" />
              Versanddokumente drucken
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Bestellungen">
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                handleShowRelatedBestellungen();
              }}
            >
              <CreditCard className="size-4" />
              {markedRowsCount === 1 ? "Dazugehörige Bestellung anzeigen" : "Dazugehörige Bestellungen anzeigen"}
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sendungen">
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle Versandprofil hinzufügen
                });
              }}
            >
              <Settings2 className="size-4" />
              Versandprofil hinzufügen
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle Sendungen verbinden
                });
              }}
            >
              <Merge className="size-4 rotate-90" />
              Sendungen verbinden
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setShowFunktionenSendungenCommand(false);
                checkSelectionBeforeAction(() => {
                  // Handle löschen
                });
              }}
              className="text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive"
            >
              <Trash2 className="size-4 text-destructive" />
              Löschen
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Tips Modal */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal} modal={false}>
        <DialogContent 
          className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bottom-auto right-auto w-[calc(100vw-32px)] max-w-[300px] p-0 gap-0 sm:bottom-[120px] sm:right-[80px] sm:top-auto sm:left-auto sm:translate-x-0 sm:translate-y-0 sm:w-[300px] pointer-events-auto"
          showCloseButton={false}
          transparentOverlay={true}
          onInteractOutside={(e) => {
            // Prevent closing when clicking outside
            e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking outside (pointer events)
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing when pressing Escape
            e.preventDefault();
          }}
        >
          <div className="flex flex-col relative">
            {/* Close button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 w-8 h-8 p-0 z-10"
              onClick={() => {
                if (dontShowTipsAgain) {
                  localStorage.setItem('hideTips', 'true');
                }
                setShowTipsModal(false);
                setCurrentTipIndex(0);
              }}
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
            
            {/* Image */}
            <div className="w-[300px] h-[220px] rounded-t-lg flex items-center justify-center overflow-hidden mx-auto" style={{ backgroundColor: '#D6F270' }}>
              <img 
                src={currentTipIndex === 0 ? illuTipps1 : currentTipIndex === 1 ? illuTipps2 : currentTipIndex === 2 ? illuTipps3 : currentTipIndex === 3 ? illuTipps4 : illuTipps5}
                alt={`Tagestipp ${currentTipIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Topline */}
              <p className="text-xs text-muted-foreground mb-2">{tips[currentTipIndex].topline}</p>
              
              {/* Headline */}
              <DialogHeader className="p-0 mb-3">
                <DialogTitle className="text-xl font-bold text-left">
                  {tips[currentTipIndex].headline}
                </DialogTitle>
              </DialogHeader>
              
              {/* Body text */}
              <DialogDescription className="text-sm text-foreground text-left leading-[20px] mb-4">
                {tips[currentTipIndex].bodyText}
              </DialogDescription>
              
              {/* Checkbox with label */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="dont-show-tips" 
                  checked={dontShowTipsAgain}
                  onCheckedChange={(checked) => setDontShowTipsAgain(checked === true)}
                />
                <Label 
                  htmlFor="dont-show-tips" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Tipps nicht mehr anzeigen
                </Label>
              </div>
            </div>
            
            {/* Footer with buttons */}
            <DialogFooter className="p-6 pt-0 !flex-row !justify-between gap-3">
              {currentTipIndex > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Go back to previous tip
                    setCurrentTipIndex(currentTipIndex - 1);
                  }}
                >
                  Zurück
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                onClick={() => {
                  if (dontShowTipsAgain) {
                    localStorage.setItem('hideTips', 'true');
                  }
                  // Move to next tip, or close if it's the last tip
                  if (currentTipIndex < tips.length - 1) {
                    setCurrentTipIndex(currentTipIndex + 1);
                  } else {
                    setShowTipsModal(false);
                    setCurrentTipIndex(0); // Reset to first tip
                  }
                }}
              >
                {currentTipIndex < tips.length - 1 ? "Nächster Tipp" : "Schließen"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

export default ShippingPage;
