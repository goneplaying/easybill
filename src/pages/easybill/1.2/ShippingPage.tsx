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
import { Search, X, Plus, Truck, CreditCard, Package, PackageOpen, PackageCheck, MoreHorizontal, Check, Circle, RotateCcw, RefreshCw, CalendarIcon, Filter, Settings2, ChevronDown, File, ToyBrick, Settings, HelpCircle, Merge, Menu, LayoutDashboard, ClipboardList, QrCode, Mail, ListChecks, AlertTriangle, CloudDownload, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { Link } from "react-router-dom";
import logo from "@/assets/easybill-logo.svg";
import logoPlus from "@/assets/easybill-logo+.svg";
import logoDHL from "@/assets/logos/logo-dhl.svg";
import logoDPD from "@/assets/logos/logo-dpd.svg";
import logoUPS from "@/assets/logos/logo-ups.svg";
import bestellungenCSV from "@/assets/tables/bestellungen.csv?raw";
import sendungenCSV from "@/assets/tables/sendungen.csv?raw";
import checklistenCSV from "@/assets/tables/checklisten.csv?raw";
import { parseCSV, parseChecklistCSV } from "@/lib/csvParser";

// Define the data type
type Order = {
  nr: number | string;
  kaufdatum: string;
  bestellnummer: string;
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
  type: string;
};

// Article type
type Article = {
  artikel: string;
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
    
    articles.push({
      artikel: exampleArticles[articleIndex],
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
  onChecklistChange?: (rowNr: number, field: keyof import("@/lib/csvParser").ChecklistData, value: boolean) => void
): ColumnDef<Order>[] => {
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
      
      // If checked or marked, show icon (no checkbox, no click handler)
      if (isSelected || isMarked) {
        return (
          <div className="flex items-center justify-center">
            {icon}
          </div>
        );
      }
      
      // If unchecked, show icon with click handler
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
        <DataTableColumnHeader column={column} title={activeTab === "versand" ? "Versand-\nnummer" : "Bestell-\nnummer"} />
      ),
      cell: ({ row }) => {
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
      size: 120,
      minSize: 120,
      maxSize: 120,
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
    size: 120,
    minSize: 120,
    maxSize: 120,
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
    size: 200,
    minSize: 200,
    maxSize: 200,
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
        <Mail className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.rechnungVersendet ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'rechnungVersendet', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[300px] z-[11] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-7-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Package className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.sendungErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'sendungErstellt', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[250px] z-[12] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-8-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Settings2 className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.versandprofilHinzugefuegt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'versandprofilHinzugefuegt', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[200px] z-[13] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-6-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <ClipboardList className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.picklisteErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'picklisteErstellt', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[150px] z-[14] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-4-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <ListChecks className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.packlisteErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'packlisteErstellt', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[100px] z-[15] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-5-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <QrCode className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.paketlisteErstellt ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'paketlisteErstellt', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[50px] z-[16] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-3-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <Truck className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const rowNr = typeof row.original.nr === 'number' ? row.original.nr : parseInt(String(row.original.nr)) || null;
      const checklistData = rowNr !== null ? checklistMap.get(rowNr) : null;
      const isChecked = checklistData?.versendet ?? false;
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              if (rowNr !== null && onChecklistChange) {
                onChecklistChange(rowNr, 'versendet', checked === true);
              }
            }}
          />
        </div>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-[50px] z-[16] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background",
    },
    enableHiding: true,
  },
  {
    id: `floating-col-2-${tableId}`,
    header: () => (
      <div className="flex items-center justify-center h-full w-full min-h-[44px]">
        <AlertTriangle className="size-4" />
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
      className: "sticky right-0 z-[17] !border !border-border !p-0 !w-[50px] min-w-[50px] max-w-[50px] bg-background will-change-[transform]",
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
  "floating-col-5-rechnung": "Paketlabel erstellt",
  "floating-col-6-rechnung": "Pickliste erstellt",
  "floating-col-7-rechnung": "Sendung erstellt",
  "floating-col-8-rechnung": "Versandprofil hinzugefügt",
  "floating-col-9-rechnung": "Rechnung versendet",
};

// Column labels for filter and visibility dropdowns - Table 2 (Sendungen)
const columnLabels2: Record<string, string> = {
  nr: "Nr",
  kaufdatum: "Kaufdatum",
  bestellnummer: "Versandnummer",
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
  "floating-col-5-versand": "Paketlabel erstellt",
  "floating-col-6-versand": "Pickliste erstellt",
  "floating-col-7-versand": "Sendung erstellt",
  "floating-col-8-versand": "Versandprofil hinzugefügt",
  "floating-col-9-versand": "Rechnung versendet",
};

function ShippingPage() {
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
  const [refreshIconRotation, setRefreshIconRotation] = React.useState(0);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);
  const [sheetWidth, setSheetWidth] = React.useState(1255);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [isUnderSm, setIsUnderSm] = React.useState(false);
  const [responsiveSheetWidth, setResponsiveSheetWidth] = React.useState(1255);

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
  const [isChecked4, setIsChecked4] = React.useState(false);
  const [isChecked7, setIsChecked7] = React.useState(false);
  const [isChecked8, setIsChecked8] = React.useState(false); // Keine Pickliste
  const [isChecked10, setIsChecked10] = React.useState(false); // Keine Packliste
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
  const [activeTab, setActiveTab] = React.useState<string>("rechnung"); // State for active tab
  const [showNoSelectionAlert, setShowNoSelectionAlert] = React.useState(false);
  const [showAddressMatchAlert, setShowAddressMatchAlert] = React.useState(false);
  const [addressMatchStep, setAddressMatchStep] = React.useState(0); // 0 = Initial, 1 = Adressdaten, 2 = Versandprofile, 3 = Sendungen erstellt
  const [showSingleRowSendungModal, setShowSingleRowSendungModal] = React.useState(false);
  const [singleRowSendungStep, setSingleRowSendungStep] = React.useState(0); // 0 = initial, 1 = versandprofil, 2 = success
  const [showRechnungErneutVersendenModal, setShowRechnungErneutVersendenModal] = React.useState(false);
  const [showFunktionenBestellungenCommand, setShowFunktionenBestellungenCommand] = React.useState(false);
  const [showFunktionenSendungenCommand, setShowFunktionenSendungenCommand] = React.useState(false);

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
  const [rowSelection1, setRowSelection1] = React.useState<RowSelectionState>({}); // Separate row selection for table 1
  const [rowSelection2, setRowSelection2] = React.useState<RowSelectionState>({}); // Separate row selection for table 2
  const [markedRows1, setMarkedRows1] = React.useState<Set<string | number>>(new Set()); // Mark state for table 1 (using order.nr as key)
  const [markedRows2, setMarkedRows2] = React.useState<Set<string | number>>(new Set()); // Mark state for table 2 (using order.nr as key)
  const [visibleRows1, setVisibleRows1] = React.useState<Order[]>([]); // Actually visible rows in table 1 (after global filter)
  const [visibleRows2, setVisibleRows2] = React.useState<Order[]>([]); // Actually visible rows in table 2 (after global filter)
  const [fehlerRowNr] = React.useState<number | null>(null); // Row number that should show Fehler icon (default: null - no icons visible, only temporary icons are used)
  const [temporaryVisibleIcons, setTemporaryVisibleIcons] = React.useState<Map<string, number>>(new Map()); // Map of icon IDs to expiration timestamps
  const [lastMarkedIndex1, setLastMarkedIndex1] = React.useState<number | null>(null); // Last marked index for Shift+click range
  const [lastMarkedIndex2, setLastMarkedIndex2] = React.useState<number | null>(null); // Last marked index for Shift+click range

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
    setSelectedOrder(row);
    setIsSheetOpen(true);
  };

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
      setVersandColumnVisibility((prev) => ({
        ...prev,
        "floating-col-2-versand": true,
      }));
    }
  }, [isChecked4]);

  // Count rows with Importdatum 09.12.2025 (stored as "2025-12-09" or displayed as "09.12.2025")
  const importdatumCount = React.useMemo(() => {
    return ordersState1.filter(
      (order) => order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025"
    ).length;
  }, [ordersState1]);

  // Count rows where "Rechnung versendet" icon is hidden (checklistData?.rechnungVersendet is false or undefined)
  const rechnungVersendetHiddenCount = React.useMemo(() => {
    return ordersState1.filter((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return false;
      const checklistData = checklistMap.get(rowNr);
      const showIcon = checklistData?.rechnungVersendet ?? false;
      return !showIcon; // Count rows where icon is hidden
    }).length;
  }, [ordersState1, checklistMap]);

  // Count rows where "Sendung erstellt" icon is hidden AND "Bezahlt am" has a date
  const versanddokumenteCount = React.useMemo(() => {
    return ordersState1.filter((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr === null) return false;
      const checklistData = checklistMap.get(rowNr);
      const showIcon = checklistData?.sendungErstellt ?? false;
      const iconHidden = !showIcon;
      const bezahltAmHasDate = order.bezahltAm && order.bezahltAm !== null && order.bezahltAm !== "";
      return iconHidden && bezahltAmHasDate;
    }).length;
  }, [ordersState1, checklistMap]);

  // Count rows where "Fehler" icon is visible (based on checklistData.fehler)
  const fehlerCount = React.useMemo(() => {
    let count = 0;
    
    // Count rows in table 1 (Bestellungen) where Fehler icon is visible
    ordersState1.forEach((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr !== null) {
        const checklistData = checklistMap.get(rowNr);
        const hasError = checklistData?.fehler ?? false;
        if (hasError) {
          count++;
        }
      }
    });
    
    // Count rows in table 2 (Sendungen) where Fehler icon is visible
    ordersState2.forEach((order) => {
      const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
      if (rowNr !== null) {
        const checklistData = checklistMap.get(rowNr);
        const hasError = checklistData?.fehler ?? false;
        if (hasError) {
          count++;
        }
      }
    });
    
    return count;
  }, [ordersState1, ordersState2, checklistMap]);

  // Count rows in Sendungen table where "Versendet" icon is hidden (importdatum = "2025-12-09" or "09.12.2025")
  const nichtVersendetCount = React.useMemo(() => {
    return ordersState2.filter(
      (order) =>
        order.type === "Versandvorgang" &&
        (order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025")
    ).length;
  }, [ordersState2]);

  // Count rows in Sendungen table where "Pickliste erstellt" icon is hidden (importdatum = "2025-12-09" or "09.12.2025")
  const keinePicklisteCount = React.useMemo(() => {
    return ordersState2.filter(
      (order) =>
        order.type === "Versandvorgang" &&
        (order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025")
    ).length;
  }, [ordersState2]);

  // Count rows in Sendungen table where "Packliste erstellt" icon is hidden (importdatum = "2025-12-09" or "09.12.2025")
  const keinePacklisteCount = React.useMemo(() => {
    return ordersState2.filter(
      (order) =>
        order.type === "Versandvorgang" &&
        (order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025")
    ).length;
  }, [ordersState2]);

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
        count: fehlerCount,
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
    ],
    [importdatumCount, rechnungVersendetHiddenCount, versanddokumenteCount, fehlerCount, nichtVersendetCount, keinePicklisteCount, keinePacklisteCount, isChecked, isChecked2, isChecked3, isChecked4, isChecked7, isChecked8, isChecked10]
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

    // Return a new array reference to ensure React detects changes
    return result;
  }, [ordersState1, importquelle, kaufdatum, importdatum, isChecked, isChecked2, isChecked3, isChecked4, isChecked5, isChecked9, isChecked6, isChecked11, checklistMap]);

  // Filter data for table 2 (only base orders)
  const filteredData2 = React.useMemo(() => {
    let result = ordersState2;

    // Apply filter for "Nicht versendet" checkbox (rows in Sendungen table where "Versendet" icon is hidden - importdatum = "2025-12-09" or "09.12.2025")
    if (isChecked7) {
      result = result.filter(
        (order) =>
          order.type === "Versandvorgang" &&
          (order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025")
      );
    }

    // Apply filter for "Keine Pickliste" checkbox (rows in Sendungen table where "Pickliste erstellt" icon is hidden - importdatum = "2025-12-09" or "09.12.2025")
    if (isChecked8) {
      result = result.filter(
        (order) =>
          order.type === "Versandvorgang" &&
          (order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025")
      );
    }

    // Apply filter for "Keine Packliste" checkbox (rows in Sendungen table where "Packliste erstellt" icon is hidden - importdatum = "2025-12-09" or "09.12.2025")
    if (isChecked10) {
      result = result.filter(
        (order) =>
          order.type === "Versandvorgang" &&
          (order.importdatum === "2025-12-09" || order.importdatum === "09.12.2025")
      );
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

    // Note: Filters for "Rechnungen nicht versendet" and "Bestellungen bezahlt, nicht gesendet"
    // are intentionally NOT applied to the Sendungen table - they only apply to Bestellungen table

    // Filter IN Versandvorgang rows (this is for the Sendungen table)
    result = result.filter((order) => order.type === "Versandvorgang");

    // Sort by nr (ascending)
    result.sort((a, b) => {
      const aNr = typeof a.nr === "number" ? a.nr : parseInt(String(a.nr)) || 0;
      const bNr = typeof b.nr === "number" ? b.nr : parseInt(String(b.nr)) || 0;
      return aNr - bNr;
    });

    // Return a new array reference to ensure React detects changes
    return result;
  }, [ordersState2, importquelle, kaufdatum, importdatum, isChecked, isChecked4, isChecked7, isChecked8, isChecked10, checklistMap]);

  // filteredOrders for sheet navigation - uses active table's data
  // Must be declared here after filteredData1 and filteredData2 are defined
  const filteredOrders = React.useMemo(() => {
    return activeTab === "versand" ? filteredData2 : filteredData1;
  }, [activeTab, filteredData1, filteredData2]);


  // Sheet navigation helpers - must be declared after filteredOrders
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
  }, [isSheetOpen, showArrows, currentIndex, filteredOrders]); // Added dependencies directly to be safe, though handlePrev/Next close over them.

  // Handle Enter key to open sheet with first marked/selected row
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Enter key when sheet is closed and not in an input/textarea/button
      if (e.key !== "Enter") return;
      if (isSheetOpen) return;
      
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

      // Open sheet with first row if found
      if (firstRow) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Set both states together to avoid timing issues
        setSelectedOrder(firstRow);
        setIsSheetOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true); // Use capture phase to catch early
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isSheetOpen, activeTab, markedRows1, markedRows2, rowSelection1, rowSelection2, filteredData1, filteredData2]);

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
    // Sort filteredData1 the same way the table does (by nr descending)
    // Helper function to extract numeric value from nr (handles both number and string like "14-0")
    const getNrValue = (nr: number | string): number => {
      if (typeof nr === 'number') return nr;
      const numPart = nr.split('-')[0];
      return parseInt(numPart, 10) || 0;
    };
    const sortedData1 = [...filteredData1].sort((a, b) => {
      const aNr = getNrValue(a.nr);
      const bNr = getNrValue(b.nr);
      return bNr - aNr; // Descending order
    });
    const currentIndex = rowIndex; // Use visual row index from sorted table
    
    if (event.shiftKey && lastMarkedIndex1 !== null) {
      // Shift+click: mark or unmark all rows between lastMarkedIndex and currentIndex
      const start = Math.min(lastMarkedIndex1, currentIndex);
      const end = Math.max(lastMarkedIndex1, currentIndex);
      const newMarked = new Set(markedRows1);
      
      // Check if the clicked row is marked - if so, unmark the range; otherwise mark it
      const isCurrentRowMarked = markedRows1.has(rowNr);
      
      for (let i = start; i <= end; i++) {
        if (isCurrentRowMarked) {
          // Unmark all rows in the range
          newMarked.delete(sortedData1[i].nr);
        } else {
          // Mark all rows in the range
          newMarked.add(sortedData1[i].nr);
        }
      }
      
      setMarkedRows1(newMarked);
      setLastMarkedIndex1(currentIndex);
    } else {
      // Single click: toggle mark state
      const newMarked = new Set(markedRows1);
      if (newMarked.has(rowNr)) {
        newMarked.delete(rowNr);
      } else {
        newMarked.add(rowNr);
      }
      setMarkedRows1(newMarked);
      setLastMarkedIndex1(currentIndex);
    }
  }, [filteredData1, markedRows1, lastMarkedIndex1]);

  // Handle row marking for table 2
  const handleRowMark2 = React.useCallback((row: Order, event: React.MouseEvent, rowIndex: number) => {
    const rowNr = row.nr;
    // Sort filteredData2 the same way the table does (by nr descending)
    // Helper function to extract numeric value from nr (handles both number and string like "14-0")
    const getNrValue = (nr: number | string): number => {
      if (typeof nr === 'number') return nr;
      const numPart = nr.split('-')[0];
      return parseInt(numPart, 10) || 0;
    };
    const sortedData2 = [...filteredData2].sort((a, b) => {
      const aNr = getNrValue(a.nr);
      const bNr = getNrValue(b.nr);
      return bNr - aNr; // Descending order
    });
    const currentIndex = rowIndex; // Use visual row index from sorted table
    
    if (event.shiftKey && lastMarkedIndex2 !== null) {
      // Shift+click: mark or unmark all rows between lastMarkedIndex and currentIndex
      const start = Math.min(lastMarkedIndex2, currentIndex);
      const end = Math.max(lastMarkedIndex2, currentIndex);
      const newMarked = new Set(markedRows2);
      
      // Check if the clicked row is marked - if so, unmark the range; otherwise mark it
      const isCurrentRowMarked = markedRows2.has(rowNr);
      
      for (let i = start; i <= end; i++) {
        if (isCurrentRowMarked) {
          // Unmark all rows in the range
          newMarked.delete(sortedData2[i].nr);
        } else {
          // Mark all rows in the range
          newMarked.add(sortedData2[i].nr);
        }
      }
      
      setMarkedRows2(newMarked);
      setLastMarkedIndex2(currentIndex);
    } else {
      // Single click: toggle mark state
      const newMarked = new Set(markedRows2);
      if (newMarked.has(rowNr)) {
        newMarked.delete(rowNr);
      } else {
        newMarked.add(rowNr);
      }
      setMarkedRows2(newMarked);
      setLastMarkedIndex2(currentIndex);
    }
  }, [filteredData2, markedRows2, lastMarkedIndex2]);

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
          setLastMarkedIndex1(null);
        }
        if (markedRows2.size > 0) {
          setMarkedRows2(new Set());
          setLastMarkedIndex2(null);
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

  // Toggle selection of just the current active row (selectedOrder)
  const handleToggleCurrentRow = React.useCallback(() => {
    if (!selectedOrder) return;
    
    // Determine which table's data to use based on activeTab
    const currentFilteredData = activeTab === "versand" ? filteredData2 : filteredData1;
    const currentRowSelection = activeTab === "versand" ? rowSelection2 : rowSelection1;
    const setCurrentRowSelection = activeTab === "versand" ? setRowSelection2 : setRowSelection1;
    
    // Find the index of selectedOrder in currentFilteredData
    const currentIndex = currentFilteredData.findIndex((o) => o.nr === selectedOrder.nr);
    if (currentIndex === -1) return;
    
    const rowIndex = currentIndex.toString();
    const isCurrentlySelected = currentRowSelection[rowIndex] === true;
    
    if (isCurrentlySelected) {
      // Deselect current row
      const newSelection = { ...currentRowSelection };
      delete newSelection[rowIndex];
      setCurrentRowSelection(newSelection);
    } else {
      // Select current row
      setCurrentRowSelection({
        ...currentRowSelection,
        [rowIndex]: true,
      });
    }
  }, [selectedOrder, activeTab, filteredData1, filteredData2, rowSelection1, rowSelection2]);

  // Check if the current row is selected
  const isCurrentRowSelected = React.useMemo(() => {
    if (!selectedOrder) return false;
    const currentFilteredData = activeTab === "versand" ? filteredData2 : filteredData1;
    const currentRowSelection = activeTab === "versand" ? rowSelection2 : rowSelection1;
    const currentIndex = currentFilteredData.findIndex((o) => o.nr === selectedOrder.nr);
    if (currentIndex === -1) return false;
    return currentRowSelection[currentIndex.toString()] === true;
  }, [selectedOrder, activeTab, filteredData1, filteredData2, rowSelection1, rowSelection2]);

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
    <div className="min-h-screen bg-background mb-[80px]">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Menu - horizontal on small screens, vertical on large screens */}
          <div className="w-[calc(100%-40px)] lg:w-[56px] h-auto lg:h-[calc(100vh-40px)] mt-5 lg:mt-0 lg:sticky lg:top-5 pl-4 pr-1 py-1 lg:pl-2 lg:pr-2 lg:py-4 bg-primary mx-5 lg:ml-5 lg:mr-2 rounded-[12px] flex-shrink-0 flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-2 lg:gap-4 mb-2 lg:mb-0" data-name="Menu">
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
              <Link to="/1.2/dashboard" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <LayoutDashboard className="size-5 text-white" />
              </Link>
              <Link to="/1.2/shipping" className="flex items-center justify-center w-full aspect-square rounded-md bg-white transition-colors">
                <Truck className="size-5 text-foreground" />
              </Link>
              <Link to="/1.2/tools" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <ToyBrick className="size-5 text-white" />
              </Link>
              <Link to="/1.2/settings" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <Settings className="size-5 text-white" />
              </Link>
              <div className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <HelpCircle className="size-5 text-white" />
              </div>
            </div>
            {/* Version number at bottom */}
            <div className="hidden lg:flex mt-auto text-xs text-white/60">
              v1.6
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
            <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2", "item-3", "item-4"]} className="w-full">
              <AccordionItem value="item-0" className="border-b border-border">
                <AccordionTrigger 
                  className="py-6 text-[20px] font-bold text-foreground hover:no-underline"
                  indicator={
                    (isChecked || isChecked2 || isChecked3 || isChecked4) ? (
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
                          return ["new-orders-checkbox-5", "new-orders-checkbox-6", "new-orders-checkbox-7"].includes(item.id);
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
                      Spezialfilter hinzufügen
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
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
                            "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
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
                  <TabsList>
                    <TabsTrigger value="rechnung">
                      <CreditCard className="size-4 sm:hidden" />
                      <span className="hidden sm:inline">Bestellungen</span>
                    </TabsTrigger>
                    <TabsTrigger value="versand">
                      <Package className="size-4 sm:hidden" />
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
                    })}
                    data={filteredData1}
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
                      })}
                      data={filteredData2}
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          name="BestellungSheet"
          side="right"
          className="overflow-y-auto p-6 lg:p-10 !max-w-full lg:!max-w-none"
          style={isSmallScreen ? { width: '100%', maxWidth: '100%' } : { width: `${responsiveSheetWidth}px`, maxWidth: `${responsiveSheetWidth}px` }}
          onPrevClick={showArrows ? handlePrevClick : undefined}
          onNextClick={showArrows ? handleNextClick : undefined}
          isPrevDisabled={currentIndex <= 0}
          isNextDisabled={currentIndex >= filteredOrders.length - 1}
          onToggleSelectAll={handleToggleCurrentRow}
          allRowsSelected={isCurrentRowSelected}
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
          <div className={`text-sm text-muted-foreground mb-1 ${isUnderSm ? 'mt-12' : 'mt-4'}`}>Bestellung</div>
          <SheetTitle className={`font-bold tracking-tight text-foreground mb-3 mt-4`}>
            #{selectedOrder?.bestellnummer}
          </SheetTitle>
          <div className="flex items-center gap-2 mt-4 mb-4">
            <Button 
              variant="default" 
              className="px-3"
              onClick={() => {
                if (selectedOrder) {
                  // Ensure all changes are saved (they're already saved when fields change, but ensure consistency)
                  const orderIndex1 = ordersState1.findIndex(o => o.nr === selectedOrder.nr);
                  if (orderIndex1 !== -1) {
                    setOrdersState1(prev => prev.map((o, idx) => idx === orderIndex1 ? selectedOrder : o));
                  }
                  const orderIndex2 = ordersState2.findIndex(o => o.nr === selectedOrder.nr);
                  if (orderIndex2 !== -1) {
                    setOrdersState2(prev => prev.map((o, idx) => idx === orderIndex2 ? selectedOrder : o));
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
                }
              }}
            >
              Speichern
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !px-2 !py-2">
                  <File className="size-4" />
                  {((sheetWidth ?? 1255) >= 640 && !isUnderSm) && <span>Rechnung</span>}
                  <ChevronDown className="size-4 opacity-50 hidden sm:inline-block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-actionbar text-actionbar-foreground border-actionbar-foreground/10">
                <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground text-sm font-medium">
                  <Mail className="size-4 text-white" />
                  {markedRowsCount > 1 ? "Rechnungen per E-Mail versenden" : "Rechnung per E-Mail versenden"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground text-sm font-medium">
                  <CloudDownload className="size-4 text-white" />
                  {markedRowsCount > 1 ? "Rechnungen downloaden" : "Rechnung downloaden"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {false && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !px-2 !py-2">
                  <Settings2 className="size-4" />
                  {((sheetWidth ?? 1255) >= 640 && !isUnderSm) && <span>Versandprofil</span>}
                  <ChevronDown className="size-4 opacity-50 hidden sm:inline-block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-actionbar text-actionbar-foreground border-actionbar-foreground/10">
                <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
                  Aus Bestellung Versandrofil erstellen
                </DropdownMenuItem>
                <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
                  Zum Versandprofil hinzufügen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2">
              <Package className="size-4" />
              {((sheetWidth ?? 1255) >= 640 && !isUnderSm) && <span>Sendung erstellen</span>}
            </Button>
            <Button variant="outline" className="h-9 w-9 bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 shadow-sm p-2 lg:p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
          {selectedOrder && (() => {
            // Helper: check if we should use wide layout (sheet width >= 640 AND window width >= 640)
            const useWideLayout = (sheetWidth ?? 1255) >= 640 && !isUnderSm;
            return (
            <div className={`mt-5 ${(sheetWidth >= 1024 && !isUnderSm) ? 'grid grid-cols-[1fr_auto_1fr] gap-[32px]' : 'space-y-6'}`}>
              {/* Left Column: Status, Kundendaten, Versand */}
              <div className={useWideLayout ? 'flex flex-col h-full' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className={`w-full ${useWideLayout ? 'flex-1 flex flex-col' : ''}`}>
                <AccordionItem value="item-1" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Status
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 min-h-[120px]">
                    {selectedOrder && (() => {
                      const width = sheetWidth ?? 1255;
                      const isTwoCols = !useWideLayout || (width >= 1024 && width < 1280);
                      return (
                      <div className={`grid ${isTwoCols ? 'grid-cols-2' : 'grid-cols-3'} gap-x-6 gap-y-5`}>
                        <div className="flex flex-col h-full">
                          <label className="text-sm font-medium text-foreground">Kaufdatum</label>
                          <p className="mt-1 text-sm min-h-[20px] flex items-center">{formatDate(selectedOrder.kaufdatum)}</p>
                        </div>
                        <div className="flex flex-col h-full">
                          <label className="text-sm font-medium text-foreground">Bezahlt am</label>
                          <p className="mt-1 text-sm min-h-[20px] flex items-center">{formatDate(selectedOrder.bezahltAm)}</p>
                        </div>
                        <div className="flex flex-col h-full">
                              <label className="text-sm font-medium text-foreground">Rechnung</label>
                          <p className="mt-1 text-sm min-h-[20px] flex items-center">
                                {selectedOrder.statusRechnungsversand === "versendet" ? (
                                  <span className="inline-flex items-center gap-2">
                                <Check className="size-4" />
                                    <span className="font-normal text-sm">Versendet</span>
                                  </span>
                                ) : selectedOrder.statusRechnungsversand === "ausstehend" ? <span className="font-normal">-</span> : 
                                 selectedOrder.statusRechnungsversand === "fehler" ? (
                                  <span className="inline-flex items-center gap-2">
                                    <AlertTriangle className="size-4 text-destructive" />
                                    <span className="font-normal text-sm">Fehler</span>
                                  </span>
                                ) : 
                                 selectedOrder.statusRechnungsversand}
                              </p>
                            </div>
                        <div className="flex flex-col h-full">
                          <label className="text-sm font-medium text-foreground">Versand gemeldet</label>
                          <p className="mt-1 text-sm min-h-[20px] flex items-center">{formatDate(selectedOrder.versandtGemeldet)}</p>
                        </div>
                        <div className="flex flex-col h-full">
                          <label className="text-sm font-medium text-foreground">Versanddatum</label>
                          <p className="mt-1 text-sm min-h-[20px] flex items-center">{formatDate(selectedOrder.versanddatum)}</p>
                        </div>
                        <div className="flex flex-col h-full">
                              <label className="text-sm font-medium text-foreground">Versanddokumente</label>
                          <p className="mt-1 text-sm min-h-[20px] flex items-center">
                                {selectedOrder.statusVersanddokumente === "erstellt" ? (
                                  <span className="inline-flex items-center gap-2">
                                <Check className="size-4" />
                                    <span className="font-normal text-sm">Erstellt</span>
                                  </span>
                                ) : selectedOrder.statusVersanddokumente === "ausstehend" ? <span className="font-normal">-</span> : 
                                 selectedOrder.statusVersanddokumente === "fehler" ? (
                                  <span className="inline-flex items-center gap-2">
                                    <AlertTriangle className="size-4 text-destructive" />
                                    <span className="font-normal text-sm">Fehler</span>
                                  </span>
                                ) : 
                                 selectedOrder.statusVersanddokumente}
                              </p>
                            </div>
                          </div>
                      );
                    })()}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className={`border-b border-border ${useWideLayout ? 'flex-1 flex flex-col' : ''}`}>
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Kundendaten
                  </AccordionTrigger>
                  <AccordionContent className={`mb-4 ${useWideLayout ? 'flex-1 flex flex-col' : ''}`}>
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
                <AccordionItem value="item-3" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Versand
                  </AccordionTrigger>
                  <AccordionContent className="mb-4">
                    {selectedOrder && (
                      <>
                        <div className="mb-5">
                          <label className="text-sm font-medium text-foreground">Versandprofil</label>
                          <Select 
                            value={selectedOrder.versandprofil || ""}
                            onValueChange={(value) => {
                              const updatedOrder = { ...selectedOrder, versandprofil: value };
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
                            value={selectedOrder.versanddienstleister}
                            onValueChange={(value) => {
                              const updatedOrder = { ...selectedOrder, versanddienstleister: value };
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
                            value={selectedOrder.versandverpackung}
                            onValueChange={(value) => {
                              const updatedOrder = { ...selectedOrder, versandverpackung: value };
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
                </Accordion>
              </div>
              {/* Divider */}
              {sheetWidth >= 1024 && (
                <div className="w-px bg-border" />
              )}
              {/* Right Column: Bestellung */}
              <div className={sheetWidth >= 1024 ? '' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-4"]} className="w-full">
                <AccordionItem value="item-4" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Bestellung
                  </AccordionTrigger>
                  <AccordionContent className="mb-4">
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
                                <TableHead className="w-1/3">Artikel</TableHead>
                                <TableHead className="text-right">MwSt. Satz</TableHead>
                                <TableHead className="text-right">Preis Netto</TableHead>
                                <TableHead className="text-right">Preis Brutto</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {articles.map((article, index) => (
                                <TableRow key={index}>
                                  <TableCell>{article.artikel}</TableCell>
                                  <TableCell className="text-right">{selectedOrder.mwstSatz}%</TableCell>
                                  <TableCell className="text-right">{formatEUR(article.preisNetto)}</TableCell>
                                  <TableCell className="text-right">{formatEUR(article.preisBrutto)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell>Versand</TableCell>
                                <TableCell className="text-right">{selectedOrder.mwstSatz}%</TableCell>
                                <TableCell className="text-right">{formatEUR(selectedOrder.versandNetto)}</TableCell>
                                <TableCell className="text-right">{formatEUR(selectedOrder.versandBrutto)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-foreground">Gesamt</TableCell>
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
                  (isChecked || isChecked2 || isChecked3 || isChecked4) ? (
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
                        return ["new-orders-checkbox-5", "new-orders-checkbox-6", "new-orders-checkbox-7"].includes(item.id);
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
      <div className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-actionbar p-1 rounded-[11px] shadow-lg transition-all duration-300">
        <Button onClick={handleToggleMarkAll} className="w-[98px]">
          {hasMarkedRows ? "Abwählen" : "Auswählen"}
        </Button>
        {activeTab === "rechnung" && (
          <Button 
            variant="outline" 
            className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
            onClick={() => setShowFunktionenBestellungenCommand(true)}
          >
            Funktion ausführen
          </Button>
        )}
        {activeTab === "versand" && (
          <Button 
            variant="outline" 
            className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 !pl-2 !pr-3 !py-2"
            onClick={() => setShowFunktionenSendungenCommand(true)}
          >
            Funktion ausführen
          </Button>
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
            <AlertDialogDescription className="!text-foreground">
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

      {/* Alert Dialog for address matching with carousel */}
      <AlertDialog 
        open={showAddressMatchAlert} 
        onOpenChange={(open) => {
          setShowAddressMatchAlert(open);
          if (!open) {
            setAddressMatchStep(0);
          }
        }}
      >
        <AlertDialogContent className="max-w-[512px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xs font-normal text-muted-foreground font-sans">Sendungen erstellen</AlertDialogTitle>
          </AlertDialogHeader>
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${addressMatchStep * 100}%)` }}
            >
              {/* Step 0: Initial */}
              {React.useMemo(() => {
                const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                const rowsWithoutSendung = markedVisibleRows.filter((order) => {
                  const rowNr = typeof order.nr === 'number' ? order.nr : parseInt(String(order.nr)) || null;
                  if (rowNr === null) return false;
                  const checklistData = checklistMap.get(rowNr);
                  const showIcon = checklistData?.sendungErstellt ?? false;
                  return !showIcon;
                });
                const count = rowsWithoutSendung.length;
                
                return (
                  <div className="min-w-full">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        In den ausgewählten Bestellungen wurden {count} ohne erstellte Sendung gefunden
                      </h3>
                      <p className="text-sm">
                        Sollen Sendungen für diese Bestellungen erstellt werden?
                      </p>
                    </div>
                  </div>
                );
              }, [visibleRows1, markedRows1, checklistMap])}
              
              {/* Step 1: Adressdaten */}
              <div className="min-w-full">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Bestellungen verbinden</h3>
                  <p className="text-sm">
                    Es wurden Bestellungen mit gleichen Kunden-/Lieferdaten gefunden. Sollen sie zu einer Sendung zusammengefasst werden?
                  </p>
                </div>
              </div>
              
              {/* Step 2: Versandprofile */}
              <div className="min-w-full">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Versandprofil(e) hinzufügen</h3>
                  <p className="text-sm">
                    Für einige Bestellungen sind passende Versandprofile verfügbar. Möchten Sie sie hinzufügen?
                  </p>
                </div>
              </div>
              
              {/* Step 3: Sendungen erstellt */}
              <div className="min-w-full">
                <div>
                  <h3 className="text-lg font-semibold mb-3">4 neue Sendungen wurden erstellt</h3>
                  <p className="text-sm">
                    Möchten Sie sie jetzt anzeigen?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="!flex-row !justify-between sm:!justify-between items-center mt-6">
            {addressMatchStep === 0 ? (
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
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setAddressMatchStep(1); // Move to address matching step
                  }}
                >
                  Ja
                </Button>
              </>
            ) : addressMatchStep === 1 ? (
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
                      setAddressMatchStep(2); // Move to next step
                    }}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Nein
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setAddressMatchStep(2); // Move to next step
                    }}
                  >
                    Ja
                  </Button>
                </div>
              </>
            ) : addressMatchStep === 2 ? (
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
                    Nein
                  </Button>
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
                  >
                    Ja
                  </Button>
                </div>
              </>
            ) : (
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
                      setShowAddressMatchAlert(false);
                      setAddressMatchStep(0);
                      // Handle: Don't show sendungen
                      // TODO: Implement actual logic
                    }}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Nein
                  </AlertDialogAction>
                  <AlertDialogAction 
                    onClick={() => {
                      // Get the currently selected rows from Bestellungen
                      const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                      
                      if (markedVisibleRows.length > 0) {
                        // Collect all unique kundeAdresse values from selected rows
                        const kundeAdressen = new Set(markedVisibleRows.map(row => row.kundeAdresse || ""));
                        
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
                          // Also update matching Sendungen rows - show "Versandprofil hinzugefügt" for rows with DE in Versandland
                          matchingRows.forEach(row => {
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
                            const hasDE = row.versandland?.toUpperCase().includes('DE');
                            newMap.set(rowNr, {
                              ...existing,
                              versandprofilHinzugefuegt: hasDE ? true : existing.versandprofilHinzugefuegt,
                            });
                          });
                          return newMap;
                        });
                        
                        // Update Versandprofil, Versanddienstleister, Versandverpackung for matching rows in Sendungen table with DE in Versandland
                        setOrdersState2(prev => prev.map(order => {
                          if (kundeAdressen.has(order.kundeAdresse || "") && order.versandland?.toUpperCase().includes('DE')) {
                            return {
                              ...order,
                              versandprofil: 'DHL National',
                              versanddienstleister: 'DHL',
                              versandverpackung: 'Karton L',
                            };
                          }
                          return order;
                        }));
                      }
                      
                      setShowAddressMatchAlert(false);
                      setAddressMatchStep(0);
                    }}
                  >
                    Ja
                  </AlertDialogAction>
                </div>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for single row sendung creation */}
      <AlertDialog 
        open={showSingleRowSendungModal} 
        onOpenChange={(open) => {
          setShowSingleRowSendungModal(open);
          if (!open) {
            setSingleRowSendungStep(0);
          }
        }}
      >
        <AlertDialogContent className="max-w-[512px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xs font-normal text-muted-foreground font-sans">Sendung erstellen</AlertDialogTitle>
          </AlertDialogHeader>
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${singleRowSendungStep * 100}%)` }}
            >
              {/* Step 1: Initial */}
              <div className="min-w-full">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Möchten Sie eine Sendung für diese Bestellung erstellen?</h3>
                </div>
              </div>
              
              {/* Step 2: Versandprofil */}
              <div className="min-w-full">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Kein passendes Versandprofil gefunden</h3>
                  <p className="text-sm">
                    Sendung wird ohne Versandprofil gespeichert. Sie können im Anschluss ein Versandprofil erstellen.
                  </p>
                </div>
              </div>
              
              {/* Step 3: Success */}
              <div className="min-w-full">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sendung wurde erstellt</h3>
                  <p className="text-sm">
                    Möchten Sie sie jetzt anzeigen?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="!flex-row !justify-between sm:!justify-between items-center mt-6">
            {singleRowSendungStep === 0 ? (
              <>
                <AlertDialogAction 
                  onClick={() => {
                    setShowSingleRowSendungModal(false);
                    setSingleRowSendungStep(0);
                  }}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Abbrechen
                </AlertDialogAction>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setSingleRowSendungStep(1); // Move to versandprofil step
                    
                    // Show check symbols in "Sendung erstellt" for selected rows
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
                  }}
                >
                  Ja
                </Button>
              </>
            ) : singleRowSendungStep === 1 ? (
              <>
                <AlertDialogAction 
                  onClick={() => {
                    setShowSingleRowSendungModal(false);
                    setSingleRowSendungStep(0);
                  }}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Abbrechen
                </AlertDialogAction>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setSingleRowSendungStep(2); // Move to success step
                    // TODO: Implement logic
                  }}
                >
                  OK, weiter
                </Button>
              </>
            ) : (
              <>
                <AlertDialogAction 
                  onClick={() => {
                    setShowSingleRowSendungModal(false);
                    setSingleRowSendungStep(0);
                  }}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Schließen
                </AlertDialogAction>
                <div className="flex gap-2 ml-auto">
                  <AlertDialogAction 
                    onClick={() => {
                      setShowSingleRowSendungModal(false);
                      setSingleRowSendungStep(0);
                      // Handle: Don't show sendung
                      // TODO: Implement actual logic
                    }}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Versandprofil erstellen
                  </AlertDialogAction>
                  <AlertDialogAction 
                    onClick={() => {
                      // Get the currently selected row from Bestellungen
                      const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                      
                      if (markedVisibleRows.length === 1) {
                        const selectedRow = markedVisibleRows[0];
                        const kundeAdresse = selectedRow.kundeAdresse || "";
                        
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
                      }
                      
                      setShowSingleRowSendungModal(false);
                      setSingleRowSendungStep(0);
                    }}
                  >
                    Ja
                  </AlertDialogAction>
                </div>
              </>
            )}
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
                  
                  const count = markedVisibleRows.length;
                  
                  // Show "Rechnung versendet" icons temporarily for all visible rows except the last one
                  // Show "Fehler" icon temporarily for the last row (only in Bestellungen table)
                  if (markedVisibleRows.length > 0 && activeTab === "rechnung") {
                    // Show "Rechnung versendet" icons for all rows except the last one
                    const rowsExceptLast = markedVisibleRows.slice(0, -1);
                    rowsExceptLast.forEach(row => {
                      const rowNr = typeof row.nr === 'number' ? row.nr : parseInt(String(row.nr)) || null;
                      if (rowNr !== null) {
                        // Set to expire in 1 year (effectively until browser reload)
                        showIconTemporarily(`rechnung-versendet-${rowNr}`, 365 * 24 * 60 * 60 * 1000);
                      }
                    });
                    
                    // Show "Fehler" icon for the last row in Bestellungen table
                    const lastRow = markedVisibleRows[markedVisibleRows.length - 1];
                    const lastRowNr = typeof lastRow.nr === 'number' ? lastRow.nr : parseInt(String(lastRow.nr)) || null;
                    if (lastRowNr !== null) {
                      // Set to expire in 1 year (effectively until browser reload)
                      showIconTemporarily(`fehler-${lastRowNr}`, 365 * 24 * 60 * 60 * 1000);
                    }
                  }
                  toast.success(
                    `${count} Rechnungen wurden erfolgreich versendet`,
                    {
                      duration: 3000,
                    }
                  );
                  // Show error toast after success toast only if more than 3 rows were selected
                  if (count > 3) {
                    setTimeout(() => {
                      toast.error(
                        <div>
                          <div className="font-medium">1 Versandfehler</div>
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
                    }, 3000);
                  }
                });
              }}
            >
              <Mail className="size-4" />
              {markedRowsCount > 1 ? "Rechnungen per E-Mail versenden" : "Rechnung per E-Mail versenden"}
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
                  // Get marked rows (this button is only shown when activeTab === "rechnung")
                  const markedVisibleRows = visibleRows1.filter(row => markedRows1.has(row.nr));
                  
                  // Show different modal based on number of selected rows
                  if (markedVisibleRows.length === 1) {
                    // Single row - show single row modal
                    setShowSingleRowSendungModal(true);
                    setSingleRowSendungStep(0);
                  } else {
                    // Multiple rows - show address matching modal
                    setShowAddressMatchAlert(true);
                    setAddressMatchStep(0);
                  }
                });
              }}
            >
              <Package className="size-4" />
              {markedRowsCount > 1 ? "Sendungen erstellen" : "Sendung erstellen"}
            </CommandItem>
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
                  // Handle Paketlabel erstellen
                });
              }}
            >
              <QrCode className="size-4" />
              Paketlabel erstellen
            </CommandItem>
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

      <Toaster />
    </div>
  );
}

export default ShippingPage;
