import * as React from "react";
import type { ColumnDef, VisibilityState, RowSelectionState } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  getSelectColumn,
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
import { Search, X, Plus, Truck, Package, DownloadCloud, MoreHorizontal, Check, ArrowRightFromLine, Circle, RotateCcw, CalendarIcon, Filter, Settings2, ChevronDown, File } from "lucide-react";
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
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

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

// Sample data
const orders: Order[] = [
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
    nr: "1-0",
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
    nr: "2-0",
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
];

// Additional rows for table 1 only
const table1AdditionalRows: Order[] = [
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
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    versendet: "bg-lime-600 text-background",
    erstellt: "bg-sidebar-accent-foreground text-background",
    ausstehend: "border border-border text-foreground bg-transparent",
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
        <span
          className={`inline-flex items-center justify-center rounded-full w-4 h-4 ${styles[status]}`}
        >
          <span className="text-[10px] font-medium">!</span>
        </span>
        <span className="font-normal text-sm">{labels[status]}</span>
      </span>
    );
  }

  if (status === "ausstehend") {
    return <span className="font-normal">—</span>;
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
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Define columns function that takes activeTab
const getColumns = (activeTab: string): ColumnDef<Order>[] => [
  getSelectColumn<Order>(activeTab),
  {
    id: "empty2",
    header: () => "",
    size: 48,
    enableHiding: false,
    meta: {
      className: "!p-0",
    },
    cell: ({ row }) => {
      const type = row.original.type;
      // Show Truck icon in 2nd table (when activeTab is "versand"), Package icon in 1st table
      if (activeTab === "versand") {
        return (
          <div className="flex items-center justify-center h-full w-full">
            {type === "Bestellung" ? <Truck className="size-4" /> : ""}
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center h-full w-full">
          {type === "Bestellung" ? <Package className="size-4" /> : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "nr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nr" />
    ),
    cell: ({ row }) => (
      <span>{row.getValue("nr")}</span>
    ),
  },
  {
    accessorKey: "bestellnummer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={activeTab === "versand" ? "Versand-\nnummer" : "Bestell-\nnummer"} />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return (
        <span>{row.getValue("bestellnummer")}</span>
      );
    },
  },
  {
    accessorKey: "importdatum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Import-\ndatum" />
    ),
    cell: ({ row }) => formatDate(row.getValue("importdatum")),
  },
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
  },
  {
    accessorKey: "info",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Info" />
    ),
  },
  {
    accessorKey: "kundeAdresse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kunde/\nLieferadresse" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return (
        <span className="text-sm max-w-[200px] truncate block" title={row.getValue("kundeAdresse")}>
          {row.getValue("kundeAdresse")}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-Mail" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("email")}</span>
    ),
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
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return (
        <span className="text-center block">{row.getValue("artikelanzahl")}</span>
      );
    },
  },
  {
    accessorKey: "versandNetto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand\nNetto" />
    ),
    cell: ({ row }) => (
      <span className="text-right block">{formatEUR(row.getValue("versandNetto"))}</span>
    ),
  },
  {
    accessorKey: "versandBrutto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand\nBrutto" />
    ),
    cell: ({ row }) => (
      <span className="text-right block">{formatEUR(row.getValue("versandBrutto"))}</span>
    ),
  },
  {
    accessorKey: "gesamtNetto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gesamt\nNetto" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return (
        <span className="text-right block">{formatEUR(row.getValue("gesamtNetto"))}</span>
      );
    },
  },
  {
    accessorKey: "mwstSatz",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MwSt.\nSatz" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return (
        <span className="text-center block">{row.getValue("mwstSatz")}%</span>
      );
    },
  },
  {
    accessorKey: "gesamtBrutto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gesamt\nBrutto" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return (
        <span className="text-right block">{formatEUR(row.getValue("gesamtBrutto"))}</span>
      );
    },
  },
  {
    accessorKey: "bezahltAm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bezahlt\nam" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "Versandvorgang") return "";
      return formatDate(row.getValue("bezahltAm"));
    },
  },
  {
    accessorKey: "versandland",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\nland" />
    ),
    cell: ({ row }) => (
      <span>{row.getValue("versandland")}</span>
    ),
  },
  {
    accessorKey: "versanddienstleister",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\ndienstleister" />
    ),
  },
  {
    accessorKey: "versandverpackung",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\nverpackung" />
    ),
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
  {
    accessorKey: "statusVersanddokumente",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versand-\ndokumente" />
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("statusVersanddokumente")} />
    ),
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "w-[50px] px-4",
    },
  },
  {
    id: "floating-col-3",
    header: () => (
      <div className="flex items-center justify-center h-full min-h-[44px]">
        <Truck className="size-4" />
      </div>
    ),
    cell: () => (
      <div className="flex items-center justify-center h-full">
        <Check className="size-4" />
      </div>
    ),
    size: 50,
    minSize: 50,
    maxSize: 50,
    meta: {
      className: "sticky right-0 bg-background z-10 border-l border-border !p-0 w-[50px]",
    },
    enableHiding: false,
  },
];

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
  empty2: "Icon",
};

// Column labels for filter and visibility dropdowns - Table 2 (Versandvorgänge)
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
  empty2: "Icon",
};

function OrdersPage() {
  // Separate data sources for each table
  const [ordersState1, setOrdersState1] = React.useState<Order[]>([...orders, ...table1AdditionalRows]);
  const [ordersState2, setOrdersState2] = React.useState<Order[]>(orders);
  const [ordersState] = React.useState<Order[]>(orders); // Keep for compatibility with filters
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);
  const [sheetWidth, setSheetWidth] = React.useState(1330);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [isChecked2, setIsChecked2] = React.useState(false);
  const [isChecked3, setIsChecked3] = React.useState(false);
  const [isChecked4, setIsChecked4] = React.useState(false);
  // Separate state for Versandprofile accordion
  const [isChecked9, setIsChecked9] = React.useState(false); // Ohne Versandprofil
  const [isChecked5, setIsChecked5] = React.useState(false);
  const [isChecked6, setIsChecked6] = React.useState(false);
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
  const [versanddienstleister, setVersanddienstleister] = React.useState<string>("");
  const [versandverpackung, setVersandverpackung] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<string>("rechnung"); // State for active tab

  // Get unique versandland values from orders data
  const versandlandOptions = React.useMemo(() => {
    const uniqueLands = Array.from(new Set(ordersState.map(order => order.versandland))).sort();
    return uniqueLands;
  }, [ordersState]);

  // Get unique versanddienstleister values from orders data
  const versanddienstleisterOptions = React.useMemo(() => {
    const uniqueDienstleister = Array.from(new Set(ordersState.map(order => order.versanddienstleister))).sort();
    return uniqueDienstleister;
  }, [ordersState]);

  // Get unique versandverpackung values from orders data
  const versandverpackungOptions = React.useMemo(() => {
    const uniqueVerpackungen = Array.from(new Set(ordersState.map(order => order.versandverpackung))).sort();
    return uniqueVerpackungen;
  }, [ordersState]);
  const [rowSelection1, setRowSelection1] = React.useState<RowSelectionState>({}); // Separate row selection for table 1
  const [rowSelection2, setRowSelection2] = React.useState<RowSelectionState>({}); // Separate row selection for table 2
  const [rechnungColumnVisibility, setRechnungColumnVisibility] = React.useState<VisibilityState>({
    select: true,
    empty2: true,
    type: false,
    kaufdatum: true,
    bestellnummer: true,
    kundeAdresse: true,
    artikelanzahl: true,
    gesamtNetto: true,
    mwstSatz: true,
    gesamtBrutto: true,
    bezahltAm: true,
    nr: false,
    importdatum: false,
    importquelle: false,
    info: false,
    email: false,
    telefonnummer: false,
    versandNetto: false,
    versandBrutto: false,
    versandland: false,
    versanddienstleister: false,
    versandverpackung: false,
    versandtGemeldet: false,
    statusVersanddokumente: false,
    versanddatum: false,
  });
  const [versandColumnVisibility, setVersandColumnVisibility] = React.useState<VisibilityState>({
    select: true,
    empty2: true,
    type: false,
    kaufdatum: true,
    kundeAdresse: true,
    artikelanzahl: true,
    versandland: true,
    versanddienstleister: true,
    versandverpackung: true,
    versandtGemeldet: true,
    statusVersanddokumente: true,
    versanddatum: true,
    nr: false,
    bestellnummer: true,
    importdatum: false,
    importquelle: false,
    info: false,
    email: false,
    telefonnummer: false,
    versandNetto: false,
    versandBrutto: false,
    gesamtNetto: false,
    mwstSatz: false,
    gesamtBrutto: false,
    bezahltAm: false,
  });

  const handleRowClick = (row: Order) => {
    setSelectedOrder(row);
    setIsSheetOpen(true);
  };

  const handleFilteredDataChange1 = React.useCallback((_data: Order[]) => {
    // Separate handler for table 1 - can be empty or handle separately
  }, []);
  const handleFilteredDataChange2 = React.useCallback((_data: Order[]) => {
    // Separate handler for table 2 - can be empty or handle separately
  }, []);

  // Count rows with Importdatum 10.12.2025 (stored as "2025-12-10")
  const importdatumCount = React.useMemo(() => {
    return ordersState.filter((order) => order.importdatum === "2025-12-10").length;
  }, []);

  // Count rows with Rechnung status "Ausstehend" or "Fehler"
  const ausstehendCount = React.useMemo(() => {
    return ordersState.filter(
      (order) =>
        order.statusRechnungsversand === "ausstehend" ||
        order.statusRechnungsversand === "fehler"
    ).length;
  }, []);

  // Count rows with Versanddokumente status "Ausstehend" or "Fehler"
  const versanddokumenteCount = React.useMemo(() => {
    return ordersState.filter(
      (order) =>
        order.statusVersanddokumente === "ausstehend" ||
        order.statusVersanddokumente === "fehler"
    ).length;
  }, []);

  // Count rows where Rechnung or Versanddokumente is "fehler"
  const fehlerCount = React.useMemo(() => {
    return ordersState.filter(
      (order) =>
        order.statusRechnungsversand === "fehler" ||
        order.statusVersanddokumente === "fehler"
    ).length;
  }, []);

  // Filter items configuration
  const filterItems = React.useMemo(
    () => [
      {
        id: "new-orders-checkbox",
        count: importdatumCount,
        label: "Zuletzt importiert",
        checked: isChecked,
        onCheckedChange: (checked: boolean) => setIsChecked(checked),
      },
      {
        id: "new-orders-checkbox-2",
        count: ausstehendCount,
        label: "Rechnungen nicht versendet",
        checked: isChecked2,
        onCheckedChange: (checked: boolean) => setIsChecked2(checked),
      },
      {
        id: "new-orders-checkbox-3",
        count: versanddokumenteCount,
        label: "Nicht versendet",
        checked: isChecked3,
        onCheckedChange: (checked: boolean) => setIsChecked3(checked),
      },
      {
        id: "new-orders-checkbox-4",
        count: fehlerCount,
        label: "Fehler",
        checked: isChecked4,
        onCheckedChange: (checked: boolean) => setIsChecked4(checked),
      },
    ],
    [importdatumCount, ausstehendCount, versanddokumenteCount, fehlerCount, isChecked, isChecked2, isChecked3, isChecked4]
  );

  // Separate filter items for Versandprofile accordion
  const filterItems2 = React.useMemo(
    () => [
      {
        id: "versandprofile-checkbox-0",
        count: 0,
        label: "Ohne Versandprofil",
        checked: isChecked9,
        onCheckedChange: (checked: boolean) => setIsChecked9(checked),
      },
      {
        id: "versandprofile-checkbox-1",
        count: importdatumCount,
        label: "DHL National",
        checked: isChecked5,
        onCheckedChange: (checked: boolean) => setIsChecked5(checked),
      },
      {
        id: "versandprofile-checkbox-2",
        count: ausstehendCount,
        label: "DPD International",
        checked: isChecked6,
        onCheckedChange: (checked: boolean) => setIsChecked6(checked),
      },
    ],
    [importdatumCount, ausstehendCount, isChecked9, isChecked5, isChecked6]
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

    // Apply filter for "Zuletzt importiert" checkbox (importdatum = "2025-12-10")
    if (isChecked) {
      result = result.filter((order) => order.importdatum === "2025-12-10");
    }

    // Apply filter for "Rechnungen nicht versendet" checkbox (statusRechnungsversand = "ausstehend" OR "fehler")
    if (isChecked2) {
      result = result.filter(
        (order) =>
          order.statusRechnungsversand === "ausstehend" ||
          order.statusRechnungsversand === "fehler"
      );
    }

    // Apply filter for "Fehlende Versanddokumente" checkbox (statusVersanddokumente = "ausstehend" OR "fehler")
    if (isChecked3) {
      result = result.filter(
        (order) =>
          order.statusVersanddokumente === "ausstehend" ||
          order.statusVersanddokumente === "fehler"
      );
    }

    // Apply filter for "Fehler" checkbox (statusRechnungsversand = "fehler" OR statusVersanddokumente = "fehler")
    if (isChecked4) {
      result = result.filter(
        (order) =>
          order.statusRechnungsversand === "fehler" ||
          order.statusVersanddokumente === "fehler"
      );
    }

    // Filter out Versandvorgang rows
    result = result.filter((order) => order.type !== "Versandvorgang");

    // Return a new array reference to ensure React detects changes
    return result;
  }, [ordersState1, importquelle, kaufdatum, importdatum, isChecked, isChecked2, isChecked3, isChecked4]);

  // Filter data for table 2 (only base orders)
  const filteredData2 = React.useMemo(() => {
    let result = ordersState2;

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

    // Apply filter for "Zuletzt importiert" checkbox (importdatum = "2025-12-10")
    if (isChecked) {
      result = result.filter((order) => order.importdatum === "2025-12-10");
    }

    // Apply filter for "Rechnungen nicht versendet" checkbox (statusRechnungsversand = "ausstehend" OR "fehler")
    if (isChecked2) {
      result = result.filter(
        (order) =>
          order.statusRechnungsversand === "ausstehend" ||
          order.statusRechnungsversand === "fehler"
      );
    }

    // Apply filter for "Fehlende Versanddokumente" checkbox (statusVersanddokumente = "ausstehend" OR "fehler")
    if (isChecked3) {
      result = result.filter(
        (order) =>
          order.statusVersanddokumente === "ausstehend" ||
          order.statusVersanddokumente === "fehler"
      );
    }

    // Apply filter for "Fehler" checkbox (statusRechnungsversand = "fehler" OR statusVersanddokumente = "fehler")
    if (isChecked4) {
      result = result.filter(
        (order) =>
          order.statusRechnungsversand === "fehler" ||
          order.statusVersanddokumente === "fehler"
      );
    }

    // Filter out Versandvorgang rows
    result = result.filter((order) => order.type !== "Versandvorgang");

    // Return a new array reference to ensure React detects changes
    return result;
  }, [ordersState2, importquelle, kaufdatum, importdatum, isChecked, isChecked2, isChecked3, isChecked4]);

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

  // Handle sheet resizing
  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      // Constrain width between 300px and 90% of viewport
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.9;
      setSheetWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
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

  // Toggle select/deselect all visible rows for table 1
  const handleToggleSelectAll1 = React.useCallback(() => {
    const selectedCount = Object.keys(rowSelection1).length;
    const visibleRowCount = filteredData1.length;
    
    if (selectedCount === visibleRowCount && visibleRowCount > 0) {
      // Deselect all
      setRowSelection1({});
    } else {
      // Select all visible rows - use row index from filteredData1
      const newSelection: RowSelectionState = {};
      filteredData1.forEach((_, index) => {
        newSelection[index.toString()] = true;
      });
      setRowSelection1(newSelection);
    }
  }, [rowSelection1, filteredData1]);

  // Toggle select/deselect all visible rows for table 2
  const handleToggleSelectAll2 = React.useCallback(() => {
    const selectedCount = Object.keys(rowSelection2).length;
    const visibleRowCount = filteredData2.length;
    
    if (selectedCount === visibleRowCount && visibleRowCount > 0) {
      // Deselect all
      setRowSelection2({});
    } else {
      // Select all visible rows - use row index from filteredData2
      const newSelection: RowSelectionState = {};
      filteredData2.forEach((_, index) => {
        newSelection[index.toString()] = true;
      });
      setRowSelection2(newSelection);
    }
  }, [rowSelection2, filteredData2]);

  // handleToggleSelectAll - uses active table's data
  const handleToggleSelectAll = React.useCallback(() => {
    if (activeTab === "versand") {
      handleToggleSelectAll2();
    } else {
      handleToggleSelectAll1();
    }
  }, [activeTab, handleToggleSelectAll1, handleToggleSelectAll2]);

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

  // Check if all visible rows are selected
  const allRowsSelected = React.useMemo(() => {
    const currentRowSelection = activeTab === "versand" ? rowSelection2 : rowSelection1;
    const currentFilteredData = activeTab === "versand" ? filteredData2 : filteredData1;
    const selectedCount = Object.keys(currentRowSelection).length;
    return selectedCount > 0 && selectedCount === currentFilteredData.length;
  }, [activeTab, rowSelection1, rowSelection2, filteredData1, filteredData2]);

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
    setVersanddienstleister("");
    setVersandverpackung("");
    setGlobalFilter("");
  }, []);

  return (
    <div className="min-h-screen bg-background mb-[80px]">
      <div className="mx-auto">
        <div className="flex items-stretch">
          {/* Left part - 300px width */}
          <div className="hidden lg:block w-[300px] flex-shrink-0 py-[40px] px-[24px] border-r border-border" data-name="FilterDiv">
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
                    {filterItems.map((item) => (
                      <div
                        key={item.id}
                          className={cn(
                            "group relative flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:bg-accent focus-visible:text-accent-foreground"
                          )}
                        onClick={() => item.onCheckedChange(!item.checked)}
                      >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-bold leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
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
                          className="text-sm font-normal leading-[1.2] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words"
                        >
                          {item.label}
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
                    (isChecked9 || isChecked5 || isChecked6) ? (
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
                            "group relative flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:bg-accent focus-visible:text-accent-foreground"
                          )}
                        onClick={() => item.onCheckedChange(!item.checked)}
                      >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-bold leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
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
                          className="text-sm font-normal leading-[1.2] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words"
                        >
                          {item.label}
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
          <div className="flex-1 min-w-0 px-8 py-10 flex flex-col gap-[28px]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-bold tracking-tight text-foreground">
                  Versand
                </h1>
                <div className="flex items-center gap-3">
                  <TabsList>
                    <TabsTrigger value="rechnung">Bestellungen</TabsTrigger>
                    <TabsTrigger value="versand">Versandvorgänge</TabsTrigger>
                  </TabsList>
                  <Button 
                    variant="outline" 
                    className="h-9 w-9 shadow-sm lg:hidden"
                    onClick={() => setIsFilterSheetOpen(true)}
                  >
                    <Filter className="size-4" />
                  </Button>
                </div>
              </div>

            <div className="bg-background">
              <TabsContent value="rechnung">
                  <DataTable
                    columns={getColumns(activeTab)}
                    data={filteredData1}
                    enableGlobalFilter={true}
                    globalFilter={globalFilter1}
                    onGlobalFilterChange={setGlobalFilter1}
                    searchPlaceholder="Suchen..."
                    columnLabels={columnLabels1}
                    columnVisibility={rechnungColumnVisibility}
                    onColumnVisibilityChange={setRechnungColumnVisibility}
                    onRowClick={handleRowClick}
                    onFilteredDataChange={handleFilteredDataChange1}
                    isRowSelected={(row) => isSheetOpen && selectedOrder?.nr === row.nr}
                    rowSelection={rowSelection1}
                    onRowSelectionChange={setRowSelection1}
                    enableRowDrag={true}
                    onRowReorder={handleRowReorder1}
                    toolbarLeft={
                      <>
                        <Button className="h-9 w-9 shadow-sm">
                          <Plus className="size-4" />
                        </Button>
                        <Label className="text-sm font-medium">Bestellungen importieren</Label>
                      </>
                    }
                  />
                </TabsContent>
                <TabsContent value="versand">
                  <DataTable
                    columns={getColumns(activeTab)}
                    data={filteredData2}
                    enableGlobalFilter={true}
                    globalFilter={globalFilter2}
                    onGlobalFilterChange={setGlobalFilter2}
                    searchPlaceholder="Suchen..."
                    columnLabels={columnLabels2}
                    columnVisibility={versandColumnVisibility}
                    onColumnVisibilityChange={setVersandColumnVisibility}
                    onRowClick={handleRowClick}
                    onFilteredDataChange={handleFilteredDataChange2}
                    isRowSelected={(row) => isSheetOpen && selectedOrder?.nr === row.nr}
                    rowSelection={rowSelection2}
                    onRowSelectionChange={setRowSelection2}
                    enableRowDrag={true}
                    onRowReorder={handleRowReorder2}
                    toolbarLeft={
                      <>
                        <Button className="h-9 w-9 shadow-sm">
                          <Plus className="size-4" />
                        </Button>
                        <Label className="text-sm font-medium">Bestellungen importieren</Label>
                      </>
                    }
                  />
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
          className="overflow-y-auto p-10"
          style={{ width: `${sheetWidth}px`, maxWidth: `${sheetWidth}px` }}
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
          <div className="text-sm text-muted-foreground mb-1">Bestellung</div>
          <SheetTitle className="font-bold tracking-tight text-foreground mb-3">
            #{selectedOrder?.bestellnummer}
          </SheetTitle>
          <div className="flex items-center gap-2 mt-6 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
                  <File className="size-4" />
                  {(sheetWidth ?? 1330) >= 640 && <span>Rechnung</span>}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-actionbar text-actionbar-foreground border-actionbar-foreground/10">
                <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
                  Per E-Mail versenden
                </DropdownMenuItem>
                <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
                  Downloaden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
                  <Settings2 className="size-4" />
                  {(sheetWidth ?? 1330) >= 640 && <span>Versandprofil</span>}
                  <ChevronDown className="size-4" />
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
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
              <Truck className="size-4" />
              {(sheetWidth ?? 1330) >= 640 && <span>Versenden</span>}
            </Button>
            <Button variant="outline" className="h-9 w-9 p-0 bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 shadow-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
          {selectedOrder && (
            <div className={`${sheetWidth >= 1024 ? 'grid grid-cols-[1fr_auto_1fr] gap-[32px]' : 'space-y-6'}`}>
              {/* Left Column: Status, Kundendaten, Versand */}
              <div className={(sheetWidth ?? 1330) >= 640 ? 'flex flex-col h-full' : 'w-full'}>
                <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className={`w-full ${(sheetWidth ?? 1330) >= 640 ? 'flex-1 flex flex-col' : ''}`}>
                  <AccordionItem value="item-1" className="border-b border-border">
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Status
                  </AccordionTrigger>
                  <AccordionContent className="mb-4 min-h-[120px]">
                    {selectedOrder && (() => {
                      const width = sheetWidth ?? 1330;
                      const isTwoCols = width < 640 || (width >= 1024 && width < 1280);
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
                            ) : selectedOrder.statusRechnungsversand === "ausstehend" ? <span className="font-normal">—</span> : 
                             selectedOrder.statusRechnungsversand === "fehler" ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-destructive text-background">
                                  <span className="text-[10px] font-medium">!</span>
                                </span>
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
                            ) : selectedOrder.statusVersanddokumente === "ausstehend" ? <span className="font-normal">—</span> : 
                             selectedOrder.statusVersanddokumente === "fehler" ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-destructive text-background">
                                  <span className="text-[10px] font-medium">!</span>
                                </span>
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
                <AccordionItem value="item-2" className={`border-b border-border ${(sheetWidth ?? 1330) >= 640 ? 'flex-1 flex flex-col' : ''}`}>
                  <AccordionTrigger className="py-6 text-[20px] font-bold text-foreground hover:no-underline">
                    Kundendaten
                  </AccordionTrigger>
                  <AccordionContent className={`mb-4 ${(sheetWidth ?? 1330) >= 640 ? 'flex-1 flex flex-col' : ''}`}>
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
                        <div className={`grid ${sheetWidth < 640 ? 'grid-cols-1' : 'grid-cols-2'} gap-x-[28px] gap-y-5 items-stretch ${(sheetWidth ?? 1330) >= 640 ? 'h-full' : ''}`}>
                            <div className={`flex flex-col ${(sheetWidth ?? 1330) >= 640 ? 'h-full' : ''}`}>
                              <label className="text-sm font-medium text-foreground">Kunde/Lieferadresse</label>
                              <textarea
                                className={`mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none ${sheetWidth < 640 ? 'h-24' : (sheetWidth ?? 1330) >= 640 ? 'flex-1' : 'min-h-[80px]'}`}
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
                              <SelectItem value="dhl-national">DHL National</SelectItem>
                              <SelectItem value="dpd-international">DPD International</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={`grid ${sheetWidth < 640 ? 'grid-cols-1' : 'grid-cols-2'} gap-x-[28px] gap-y-5`}>
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
                              <div className="border border-border rounded-[12px] overflow-hidden">
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
          )}
        </SheetContent>
      </Sheet>

      {/* FilterSheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent
          name="FilterSheet"
          side="left"
          className="w-full sm:max-w-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !px-6 !pt-10 opacity-100"
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
                  {filterItems.map((item) => (
                    <div
                      key={item.id}
                        className={cn(
                          "group relative flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground"
                        )}
                      onClick={() => item.onCheckedChange(!item.checked)}
                    >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-bold leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
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
                          className="text-sm font-normal leading-[1.2] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words"
                        >
                          {item.label}
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
                            "group relative flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px]",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:bg-accent focus-visible:text-accent-foreground"
                          )}
                        onClick={() => item.onCheckedChange(!item.checked)}
                      >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-between">
                          <div className="text-[20px] font-bold leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
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
                          className="text-sm font-normal leading-[1.2] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words"
                        >
                          {item.label}
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
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-actionbar p-1 rounded-[11px] shadow-lg">
        <Button onClick={handleToggleSelectAll} className="w-[110px]">
          {allRowsSelected ? "Abwählen" : "Auswählen"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
              <File className="size-4" />
              <span className="max-[1180px]:hidden">Rechnung</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-actionbar text-actionbar-foreground border-actionbar-foreground/10">
            <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
              Per E-Mail versenden
            </DropdownMenuItem>
            <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
              Downloaden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
              <Settings2 className="size-4" />
              <span className="max-[1180px]:hidden">Versandprofil</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-actionbar text-actionbar-foreground border-actionbar-foreground/10">
            <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
              Aus Auwahl Versandprofil erstellen
            </DropdownMenuItem>
            <DropdownMenuItem className="text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground focus:bg-actionbar-hover focus:text-actionbar-foreground">
              Zum Versandprofil hinzufügen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
          <Truck className="size-4" />
          <span className="max-[1180px]:hidden">Versenden</span>
        </Button>
        {activeTab !== "rechnung" && (
          <>
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
              <Package className="size-4" />
              <span className="max-[1180px]:hidden">Versandverpackung</span>
            </Button>
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
              <DownloadCloud className="size-4" />
              <span className="max-[1180px]:hidden">Versanddokumente</span>
            </Button>
            <Button variant="outline" className="bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10">
              <ArrowRightFromLine className="size-4" />
              <span className="max-[1180px]:hidden">Export</span>
            </Button>
          </>
        )}
        <Button variant="outline" className="h-9 w-9 p-0 bg-actionbar text-actionbar-foreground [&_svg]:text-actionbar-foreground hover:bg-actionbar-hover hover:text-actionbar-foreground hover:[&_svg]:text-actionbar-foreground border-actionbar-foreground/10 shadow-sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default OrdersPage;
