/* eslint-disable @typescript-eslint/no-explicit-any */
// Order type definition (matching ShippingPage)
type Order = {
  nr: number | string;
  shop?: string;
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

/**
 * Parses CSV string into Order array
 * Handles quoted fields, empty values, and type conversions
 */
export function parseCSV(csvText: string): Order[] {
  if (!csvText || csvText.trim().length === 0) {
    console.warn("CSV text is empty");
    return [];
  }
  
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    console.warn("CSV has less than 2 lines (header + data)");
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log("CSV Headers:", headers);
  
  // Map header names to Order property names
  const headerMap: Record<string, keyof Order> = {
    'Nr': 'nr',
    'Shop': 'shop',
    'Kaufdatum': 'kaufdatum',
    'Bestellnummer': 'bestellnummer',
    'Info': 'info',
    'Kunde Adresse': 'kundeAdresse',
    'Email': 'email',
    'Telefonnummer': 'telefonnummer',
    'Artikelanzahl': 'artikelanzahl',
    'Gesamt Netto': 'gesamtNetto',
    'MwSt Satz': 'mwstSatz',
    'Gesamt Brutto': 'gesamtBrutto',
    'Bezahlt Am': 'bezahltAm',
    'Status Rechnungsversand': 'statusRechnungsversand',
    'Versandland': 'versandland',
    'Versanddienstleister': 'versanddienstleister',
    'Versandverpackung': 'versandverpackung',
    'Versandprofil': 'versandprofil',
    'Versandt Gemeldet': 'versandtGemeldet',
    'Status Versanddokumente': 'statusVersanddokumente',
    'Versanddatum': 'versanddatum',
    'Versand Brutto': 'versandBrutto',
    'Versand Netto': 'versandNetto',
    'Importdatum': 'importdatum',
    'Importquelle': 'importquelle',
    'Type': 'type',
  };

  // Parse data rows
  const orders: Order[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const order: Partial<Order> = {};
    
    headers.forEach((header, index) => {
      const propertyName = headerMap[header];
      if (propertyName && values[index] !== undefined) {
        const value = values[index].trim();
        
        // Handle empty values
        if (value === '') {
          if (propertyName === 'bezahltAm' || propertyName === 'versandtGemeldet' || propertyName === 'versanddatum') {
            (order as any)[propertyName] = null;
          } else if (propertyName === 'versandprofil') {
            (order as any)[propertyName] = undefined;
          } else {
            (order as any)[propertyName] = '';
          }
        } else {
          // Type conversions
          switch (propertyName) {
            case 'nr': {
              // Try to parse as number, otherwise keep as string
              const nrValue = parseInt(value);
              (order as any)[propertyName] = isNaN(nrValue) ? value : nrValue;
              break;
            }
            case 'artikelanzahl':
            case 'mwstSatz':
              (order as any)[propertyName] = parseInt(value) || 0;
              break;
            case 'gesamtNetto':
            case 'gesamtBrutto':
            case 'versandBrutto':
            case 'versandNetto':
              (order as any)[propertyName] = parseFloat(value) || 0;
              break;
            case 'statusRechnungsversand':
              (order as any)[propertyName] = value as 'versendet' | 'ausstehend' | 'fehler';
              break;
            case 'statusVersanddokumente':
              (order as any)[propertyName] = value as 'erstellt' | 'ausstehend' | 'fehler';
              break;
            case 'bezahltAm':
            case 'versandtGemeldet':
            case 'versanddatum':
              (order as any)[propertyName] = value || null;
              break;
            case 'versandprofil':
              (order as any)[propertyName] = value || undefined;
              break;
            case 'type':
              // Set default type if not present
              (order as any)[propertyName] = value || 'Bestellung';
              break;
            default:
              (order as any)[propertyName] = value;
          }
        }
      }
    });

    // Ensure all required fields have default values
    const completeOrder: Order = {
      nr: order.nr ?? '',
      shop: order.shop,
      kaufdatum: order.kaufdatum ?? '',
      bestellnummer: order.bestellnummer ?? '',
      info: order.info ?? '',
      kundeAdresse: order.kundeAdresse ?? '',
      email: order.email ?? '',
      telefonnummer: order.telefonnummer ?? '',
      artikelanzahl: order.artikelanzahl ?? 0,
      gesamtNetto: order.gesamtNetto ?? 0,
      mwstSatz: order.mwstSatz ?? 0,
      gesamtBrutto: order.gesamtBrutto ?? 0,
      bezahltAm: order.bezahltAm ?? null,
      statusRechnungsversand: order.statusRechnungsversand ?? 'ausstehend',
      versandland: order.versandland ?? '',
      versanddienstleister: order.versanddienstleister ?? '',
      versandverpackung: order.versandverpackung ?? '',
      versandprofil: order.versandprofil,
      versandtGemeldet: order.versandtGemeldet ?? null,
      statusVersanddokumente: order.statusVersanddokumente ?? 'ausstehend',
      versanddatum: order.versanddatum ?? null,
      versandBrutto: order.versandBrutto ?? 0,
      versandNetto: order.versandNetto ?? 0,
      importdatum: order.importdatum ?? '',
      importquelle: order.importquelle ?? '',
      type: order.type ?? '', // Will be set by the caller based on which CSV is being parsed
    };

    orders.push(completeOrder);
  }

  console.log(`Parsed ${orders.length} orders from CSV`);
  if (orders.length > 0) {
    console.log("First order sample:", orders[0]);
  }
  return orders;
}

/**
 * Parses CSV headers from CSV text
 */
export function parseCSVHeaders(csvText: string): string[] {
  if (!csvText || csvText.trim().length === 0) {
    return [];
  }
  
  const lines = csvText.trim().split('\n');
  if (lines.length < 1) {
    return [];
  }

  return parseCSVLine(lines[0]);
}

/**
 * Parses a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current);
  
  return result;
}

/**
 * Checklist data type for floating columns
 */
export type ChecklistData = {
  nr: number;
  rechnungVersendet: boolean;
  sendungErstellt: boolean;
  versandprofilHinzugefuegt: boolean;
  picklisteErstellt: boolean;
  packlisteErstellt: boolean;
  paketlisteGedruckt: boolean;
  versendet: boolean;
  fehler: boolean;
};

/**
 * Parses checklist CSV into a map of row number to checklist data
 */
export function parseChecklistCSV(csvText: string): Map<number, ChecklistData> {
  const checklistMap = new Map<number, ChecklistData>();
  
  if (!csvText || csvText.trim().length === 0) {
    console.warn("Checklist CSV text is empty");
    return checklistMap;
  }
  
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    console.warn("Checklist CSV has less than 2 lines (header + data)");
    return checklistMap;
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log("Checklist CSV Headers (raw):", headers);
  console.log("Checklist CSV Headers (trimmed):", headers.map(h => h.trim()));
  
  // Create a flexible header map that handles variations
  const createHeaderMap = (header: string): keyof ChecklistData | null => {
    const normalized = header.trim().toLowerCase();
    if (normalized === 'nr') return 'nr';
    if (normalized.includes('rechnung') && normalized.includes('versendet')) return 'rechnungVersendet';
    if (normalized.includes('sendung') && normalized.includes('erstellt')) return 'sendungErstellt';
    if (normalized.includes('versandprofil') && (normalized.includes('hinzu') || normalized.includes('gef'))) return 'versandprofilHinzugefuegt';
    if (normalized.includes('pickliste') && normalized.includes('erstellt')) return 'picklisteErstellt';
    if (normalized.includes('packliste') && normalized.includes('erstellt')) return 'packlisteErstellt';
    if (normalized.includes('paketliste') && normalized.includes('gedruckt')) return 'paketlisteGedruckt';
    if (normalized === 'versendet') return 'versendet';
    if (normalized === 'fehler') return 'fehler';
    return null;
  };

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const checklist: Partial<ChecklistData> = {};
    
    headers.forEach((header, index) => {
      const propertyName = createHeaderMap(header);
      if (propertyName && values[index] !== undefined) {
        const value = values[index].trim().toUpperCase();
        
        if (propertyName === 'nr') {
          const nrValue = parseInt(value);
          if (!isNaN(nrValue)) {
            (checklist as any)[propertyName] = nrValue;
          }
        } else {
          // Convert TRUE/FALSE to boolean
          (checklist as any)[propertyName] = value === 'TRUE';
        }
      } else if (!propertyName && header.trim() !== '') {
        // Debug: log unmapped headers
        console.warn(`Unmapped header: "${header}" (trimmed: "${header.trim()}")`);
      }
    });

    if (checklist.nr !== undefined) {
      const checklistEntry: ChecklistData = {
        nr: checklist.nr,
        rechnungVersendet: checklist.rechnungVersendet ?? false,
        sendungErstellt: checklist.sendungErstellt ?? false,
        versandprofilHinzugefuegt: checklist.versandprofilHinzugefuegt ?? false,
        picklisteErstellt: checklist.picklisteErstellt ?? false,
        packlisteErstellt: checklist.packlisteErstellt ?? false,
        paketlisteGedruckt: checklist.paketlisteGedruckt ?? false,
        versendet: checklist.versendet ?? false,
        fehler: checklist.fehler ?? false,
      };
      checklistMap.set(checklist.nr, checklistEntry);
      if (checklist.nr <= 3) {
        console.log(`Parsed checklist for row ${checklist.nr}:`, checklistEntry);
      }
    } else {
      console.warn(`Row ${i} has no valid nr field, values:`, values);
    }
  }

  console.log(`Parsed ${checklistMap.size} checklist entries from CSV`);
  return checklistMap;
}

