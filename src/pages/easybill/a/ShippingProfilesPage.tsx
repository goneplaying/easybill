import * as React from "react";
import { Truck, ToyBrick, Settings, HelpCircle, Menu, LayoutDashboard, Settings2, ArrowRight, MoreHorizontal, Pencil, Copy, Trash2, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/easybill-logo.svg";
import logoPlus from "@/assets/easybill-logo+.svg";
import logoDHL from "@/assets/logos/logo-dhl.svg";
import logoDPD from "@/assets/logos/logo-dpd.svg";
import logoUPS from "@/assets/logos/logo-ups.svg";
import logoAmazon from "@/assets/logos/logo-amazon.svg";
import logoFedEx from "@/assets/logos/logo-fedex.svg";
import logoGLS from "@/assets/logos/logo-gls.svg";
import logoHermes from "@/assets/logos/logo-hermes.svg";
import logoPost from "@/assets/logos/logo-post.svg";
import logoTNT from "@/assets/logos/logo-tnt.svg";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Versandprofile data from Google Sheets
const VERSANDPROFILE_DATA: Record<string, {
  produkte: string[];
  verpackung: string[];
  zusatzleistungen: string[];
}> = {
  "DHL": {
    produkte: ["DHL Paket", "DHL Paket International", "DHL Europaket", "DHL Kleinpaket", "Warenpost International"],
    verpackung: ["Umschlag", "Karton", "Palette", "Sonderverpackung"],
    zusatzleistungen: ["Premium", "Wunschnachbar", "Wunschort", "Alterssichtprüfung", "Vorspersonline Übergabe", "Empfängerunterschrift", "Keine Nachbarschaftsstellung", "Wunschtag", "Vorabankündigung", "GoGreen", "GoGreen Plus", "Zusatzversicherung", "Sperrgut", "Nachnahme", "Filial-Routing", "pDDP", "Beileger"]
  },
  "DPD": {
    produkte: ["DPD CLASSIC", "DPD Shop2Shop", "Shop-Shipping", "Home Collection", "DPD Expressversand", "DPD 12:00", "DPD Internationaler Versand"],
    verpackung: ["Umschlag", "Karton", "Palette", "Sonderverpackung"],
    zusatzleistungen: ["Predict (E-Mail/SMS Vorabinfo)", "Live-Tracking (Sendungsverfolgung)", "Retourenmanagement", "Höherversicherung", "Nachnahme", "Abteilungszustellung", "Gefahrgut", "ID-Prüfung", "Standardversicherung"]
  },
  "UPS": {
    produkte: ["UPS Standard", "UPS Expedited", "UPS Express Saver", "UPS Express", "UPS Express Plus", "UPS Worldwide Express Freight"],
    verpackung: ["Umschlag", "Karton", "Palette", "Sonderverpackung"],
    zusatzleistungen: ["UPS Electronic Return Label (ERL)", "UPS Access Point (Zustellung an Abholpunkt)", "Hold for Pickup / Hold at Location", "UPS Delivery Intercept", "Delivery Change Requests", "Address Correction", "Saturday Delivery", "Signature Required", "Adult Signature Required", "Declared Value (höhere Haftung)", "Collect on Delivery (Nachnahme)", "UPS Carbon Neutral"]
  },
  "GLS": {
    produkte: ["BusinessParcel (National)", "Domestic Parcel (Privat & Business)", "EuroBusinessParcel (Europa)", "ExpressParcel (National)", "GlobalExpressParcel (International)"],
    verpackung: ["Umschlag", "Karton", "Palette", "Sonderverpackung"],
    zusatzleistungen: ["FlexDeliveryService", "InfoCourierService (SMS-Benachrichtigung)", "Second Delivery Attempt", "Parcel Tracking (Sendungsverfolgung)", "Return/Retoure Services", "CashService (Nachnahme)", "Pick&Ship / Pick&Return", "ADE-Plus / Versandsoftware", "PaketShop / PaketBox Zustellung", "Abstellerlaubnis"]
  },
  "Hermes": {
    produkte: ["Hermes Paket Päckchen", "Hermes Paket S", "Hermes Paket M", "Hermes Paket L", "Hermes Paket XL", "Hermes Paket XXL"],
    verpackung: ["Umschlag", "Karton", "Palette", "Sonderverpackung"],
    zusatzleistungen: ["PaketShop-Zustellung (Shop2Shop)", "Sperrgut-Zuschlag", "WunschAblageort", "WunschPaketShop", "WunschNachbar", "WunschTag", "Sendungsverfolgung", "Abholung im PaketShop"]
  },
  "Deutsche Post": {
    produkte: [],
    verpackung: ["Umschlag", "Karton", "Palette", "Sonderverpackung"],
    zusatzleistungen: []
  }
};

function ShippingProfilesPage() {
  const location = useLocation();
  const isShippingActive = location.pathname.includes("/a/shipping") && !location.pathname.includes("/a/shippingprofiles");
  const isShippingProfilesActive = location.pathname.includes("/a/shippingprofiles");
  const [isVersandprofilSheetOpen, setIsVersandprofilSheetOpen] = React.useState(false);
  const [isAvailableProvidersVisible, setIsAvailableProvidersVisible] = React.useState(false);
  const [isVersandprofilEditSheetOpen, setIsVersandprofilEditSheetOpen] = React.useState(false);
  const [selectedProfile, setSelectedProfile] = React.useState<{
    id: string;
    name: string;
    dienstleister: string;
    produkt?: string;
    verpackung: string;
    zusatzleistungen: string;
    additionalZusatzleistungen?: Array<{ id: string; value: string }>;
  } | null>(null);

  // Get available options based on selected Versanddienstleister
  const getAvailableProdukte = React.useMemo(() => {
    if (!selectedProfile?.dienstleister) return [];
    const providerKey = Object.keys(VERSANDPROFILE_DATA).find(key => 
      selectedProfile.dienstleister.includes(key)
    );
    return providerKey ? VERSANDPROFILE_DATA[providerKey].produkte : [];
  }, [selectedProfile?.dienstleister]);

  const getAvailableVerpackung = React.useMemo(() => {
    if (!selectedProfile?.dienstleister) return ["Umschlag", "Karton", "Palette", "Sonderverpackung"];
    const providerKey = Object.keys(VERSANDPROFILE_DATA).find(key => 
      selectedProfile.dienstleister.includes(key)
    );
    return providerKey ? VERSANDPROFILE_DATA[providerKey].verpackung : ["Umschlag", "Karton", "Palette", "Sonderverpackung"];
  }, [selectedProfile?.dienstleister]);

  const getAvailableZusatzleistungen = React.useMemo(() => {
    if (!selectedProfile?.dienstleister) return [];
    const providerKey = Object.keys(VERSANDPROFILE_DATA).find(key => 
      selectedProfile.dienstleister.includes(key)
    );
    return providerKey ? VERSANDPROFILE_DATA[providerKey].zusatzleistungen : [];
  }, [selectedProfile?.dienstleister]);

  // Filter items for Versandprofile - using state to allow dynamic additions
  const [filterItems2, setFilterItems2] = React.useState<Array<{
    id: string;
    count: number;
    label: string;
    checked: boolean;
    logo?: string;
    isAddButton?: boolean;
    produkt?: string;
    verpackung?: string;
    zusatzleistungen?: string;
    additionalZusatzleistungen?: Array<{ id: string; value: string }>;
  }>>([
    {
      id: "versandprofile-checkbox-1",
      count: 0,
      label: "DHL National",
      checked: false,
      logo: logoDHL,
      produkt: "DHL Paket",
      verpackung: "Karton",
    },
    {
      id: "versandprofile-checkbox-2",
      count: 0,
      label: "DPD Europa",
      checked: false,
      logo: logoDPD,
      produkt: "DPD Internationaler Versand",
      verpackung: "Karton",
    },
    {
      id: "versandprofile-checkbox-3",
      count: 0,
      label: "UPS USA",
      checked: false,
      logo: logoUPS,
      produkt: "UPS Worldwide Express Freight",
      verpackung: "Karton",
    },
    {
      id: "versandprofile-add-button",
      count: 0,
      label: "",
      checked: false,
      logo: undefined,
      isAddButton: true,
    },
  ]);

  // Function to handle duplication - creates a copy with the same logo
  const handleDuplicate = React.useCallback((itemId: string) => {
    setFilterItems2((prevItems) => {
      const itemToDuplicate = prevItems.find((item) => item.id === itemId);
      if (!itemToDuplicate || itemToDuplicate.isAddButton) return prevItems;

      // Remove " Kopie" from the label if it already exists to get the base name
      const baseLabel = itemToDuplicate.label.endsWith(" Kopie") 
        ? itemToDuplicate.label.slice(0, -6) 
        : itemToDuplicate.label;

      // Separate regular items from the add button item
      const regularItems = prevItems.filter((item) => !item.isAddButton);
      const addButtonItem = prevItems.find((item) => item.isAddButton);

      const newId = `versandprofile-checkbox-${Date.now()}`;
      const duplicatedItem = {
        ...itemToDuplicate,
        id: newId,
        label: `${baseLabel} Kopie`,
        checked: false,
        // Keep the logo from the original item
        logo: itemToDuplicate.logo,
        isAddButton: false,
        // Deep copy additionalZusatzleistungen if it exists
        additionalZusatzleistungen: itemToDuplicate.additionalZusatzleistungen
          ? itemToDuplicate.additionalZusatzleistungen.map(az => ({ ...az }))
          : undefined,
      };

      // Add the duplicated item and keep the add button at the end
      return addButtonItem 
        ? [...regularItems, duplicatedItem, addButtonItem]
        : [...regularItems, duplicatedItem];
    });
  }, []);

  // Function to handle deletion
  const handleDelete = React.useCallback((itemId: string) => {
    setFilterItems2((prevItems) => {
      // Don't allow deleting the add button item
      if (prevItems.find((item) => item.id === itemId)?.isAddButton) {
        return prevItems;
      }
      return prevItems.filter((item) => item.id !== itemId);
    });
  }, []);

  // Enhanced filterItems2 with handlers
  const filterItems2WithHandlers = React.useMemo(
    () =>
      filterItems2.map((item) => ({
        ...item,
        onCheckedChange: (checked: boolean) => {
          setFilterItems2((prevItems) =>
            prevItems.map((prevItem) =>
              prevItem.id === item.id ? { ...prevItem, checked } : prevItem
            )
          );
        },
      })),
    [filterItems2]
  );

  // Additional checkbox states for available shipping service providers
  const [isCheckedAmazon, setIsCheckedAmazon] = React.useState(false);
  const [isCheckedPost, setIsCheckedPost] = React.useState(false);
  const [isCheckedDHL, setIsCheckedDHL] = React.useState(false);
  const [isCheckedDHLExpress, setIsCheckedDHLExpress] = React.useState(false);
  const [isCheckedDPD, setIsCheckedDPD] = React.useState(false);
  const [isCheckedUPS, setIsCheckedUPS] = React.useState(false);
  const [isCheckedFedEx, setIsCheckedFedEx] = React.useState(false);
  const [isCheckedGLS, setIsCheckedGLS] = React.useState(false);
  const [isCheckedHermes, setIsCheckedHermes] = React.useState(false);
  const [isCheckedTNT, setIsCheckedTNT] = React.useState(false);

  // Adjustable sheet width states - start with 1/3 of screen width for desktop
  const [sheetWidth, setSheetWidth] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640 ? window.innerWidth / 3 : window.innerWidth;
    }
    return 450; // fallback for SSR
  });
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [responsiveSheetWidth, setResponsiveSheetWidth] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640 ? window.innerWidth / 3 : window.innerWidth;
    }
    return 450; // fallback for SSR
  });
  const [isResizing, setIsResizing] = React.useState(false);

  // Available shipping service providers
  const availableProviders = React.useMemo(
    () => [
      {
        id: "available-provider-amazon",
        label: "Amazon",
        checked: isCheckedAmazon,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedAmazon(checked);
        },
        logo: logoAmazon,
      },
      {
        id: "available-provider-post",
        label: "Deutsche Post",
        checked: isCheckedPost,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedPost(checked);
        },
        logo: logoPost,
      },
      {
        id: "available-provider-dhl",
        label: "DHL",
        checked: isCheckedDHL,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedDHL(checked);
        },
        logo: logoDHL,
      },
      {
        id: "available-provider-dhl-express",
        label: "DHL Express",
        checked: isCheckedDHLExpress,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedDHLExpress(checked);
        },
        logo: logoDHL,
      },
      {
        id: "available-provider-dpd",
        label: "DPD",
        checked: isCheckedDPD,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedDPD(checked);
        },
        logo: logoDPD,
      },
      {
        id: "available-provider-ups",
        label: "UPS",
        checked: isCheckedUPS,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedUPS(checked);
        },
        logo: logoUPS,
      },
      {
        id: "available-provider-fedex",
        label: "FedEx",
        checked: isCheckedFedEx,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedFedEx(checked);
        },
        logo: logoFedEx,
      },
      {
        id: "available-provider-gls",
        label: "GLS",
        checked: isCheckedGLS,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedGLS(checked);
        },
        logo: logoGLS,
      },
      {
        id: "available-provider-hermes",
        label: "Hermes",
        checked: isCheckedHermes,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedHermes(checked);
        },
        logo: logoHermes,
      },
      {
        id: "available-provider-tnt",
        label: "TNT",
        checked: isCheckedTNT,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedTNT(checked);
        },
        logo: logoTNT,
      },
    ],
    [isCheckedAmazon, isCheckedPost, isCheckedDHL, isCheckedDHLExpress, isCheckedDPD, isCheckedUPS, isCheckedFedEx, isCheckedGLS, isCheckedHermes, isCheckedTNT]
  );

  // Combined and sorted available providers (only from availableProviders, not from filterItems2)
  // This ensures that deleting items from "In Verwendung" doesn't affect this section
  const allAvailableProviders = React.useMemo(() => {
    // Only show items from availableProviders, not from filterItems2
    // This keeps the "Verfügbare Versanddienstleister" section independent
    const providers = availableProviders.map((provider) => ({
      ...provider,
      displayLabel: provider.label,
    }));

    return providers.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, 'de', { sensitivity: 'base' }));
  }, [availableProviders]);

  // Keyboard shortcut to toggle available providers section
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only toggle if 'h' key is pressed (case insensitive)
      if (event.key.toLowerCase() === 'h') {
        // Don't toggle if user is typing in an input or textarea
        const activeElement = document.activeElement;
        const isInputField = activeElement && (
          (activeElement instanceof HTMLInputElement && activeElement.type !== 'button' && activeElement.type !== 'submit' && activeElement.type !== 'reset') ||
          activeElement instanceof HTMLTextAreaElement ||
          (activeElement as HTMLElement).isContentEditable
        );
        
        if (!isInputField) {
          event.preventDefault();
          setIsAvailableProvidersVisible((prev) => !prev);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Keyboard shortcuts to close sheets on Enter or ESC
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close sheets on Enter or ESC
      if (event.key === 'Enter' || event.key === 'Escape') {
        // Don't close if user is typing in an input or textarea (except ESC)
        const activeElement = document.activeElement;
        const isInputField = activeElement && (
          (activeElement instanceof HTMLInputElement && activeElement.type !== 'button' && activeElement.type !== 'submit' && activeElement.type !== 'reset') ||
          activeElement instanceof HTMLTextAreaElement ||
          (activeElement as HTMLElement).isContentEditable
        );
        
        // ESC always closes, Enter only closes if not in input field
        if (event.key === 'Escape' || (event.key === 'Enter' && !isInputField)) {
          if (isVersandprofilSheetOpen) {
            setIsVersandprofilSheetOpen(false);
          }
          if (isVersandprofilEditSheetOpen) {
            setIsVersandprofilEditSheetOpen(false);
          }
        }
      }
    };

    // Only add listener if at least one sheet is open
    if (isVersandprofilSheetOpen || isVersandprofilEditSheetOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isVersandprofilSheetOpen, isVersandprofilEditSheetOpen]);

  // Screen size detection for responsive sheet width
  React.useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 640; // sm breakpoint
      setIsSmallScreen(isSmall);
      
      // For mobile (< 640px): use full width
      // For desktop (>= 640px): use current width or 1/3 of screen if resetting
      if (isSmall) {
        setResponsiveSheetWidth(window.innerWidth);
      } else {
        // Calculate responsive sheet width for desktop
        const minWidth = 300;
        const maxWidth = window.innerWidth * 0.9;
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

  return (
    <TooltipProvider delayDuration={1000}>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/a/dashboard" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                      <LayoutDashboard className="size-5 text-white" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Dashboard</p>
                  </TooltipContent>
                </Tooltip>
                <div className="bg-white rounded-md p-0.5 flex flex-col gap-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/a/shipping" className="flex items-center justify-center w-full aspect-square rounded-md transition-colors">
                        <Truck className={`size-5 ${isShippingActive ? "text-gray-700" : ""}`} style={!isShippingActive ? { color: '#1354F9' } : undefined} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Versand</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/a/shippingprofiles" className="flex items-center justify-center w-full aspect-square rounded-md transition-colors">
                        <Settings2 className={`size-5 ${isShippingProfilesActive ? "text-gray-700" : ""}`} style={!isShippingProfilesActive ? { color: '#1354F9' } : undefined} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Versandprofile</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/a/tools" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                      <ToyBrick className="size-5 text-white" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Tools</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/a/settings" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                      <Settings className="size-5 text-white" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Einstellungen</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                      <HelpCircle className="size-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Hilfe</p>
                  </TooltipContent>
                </Tooltip>
            </div>
            {/* Version number at bottom */}
            <div className="hidden lg:block mt-auto pt-4">
              <div className="text-white/70 text-xs text-center font-medium">
                v1.14
              </div>
            </div>
          </div>

          {/* Right part - flexible width */}
          <div className="flex-1 min-w-0 px-6 py-5 lg:pl-8 lg:pr-10 lg:py-10 flex flex-col gap-[28px]">
            <h1>
              Versandprofile
            </h1>
            <div className="flex flex-row gap-[28px] h-full">
              <div className="flex flex-col gap-8 h-full w-[65%]">
                <div className="w-full flex-1 flex flex-col gap-[28px]">
                  <h2>
                    Aktive Profile
                  </h2>
                  <div className="flex gap-3 items-stretch">
                    {filterItems2WithHandlers
                      .filter((item) => {
                        // Hide add button when available providers section is visible
                        if (item.isAddButton && isAvailableProvidersVisible) {
                          return false;
                        }
                        return true;
                      })
                      .map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "group relative flex cursor-pointer items-center justify-between rounded-md !border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] w-[116px]",
                          item.isAddButton ? "border-dashed border-border" : "!border-border",
                          !item.isAddButton && "bg-background shadow-xs",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground"
                        )}
                        onClick={() => {
                          if (item.isAddButton) {
                            setIsVersandprofilSheetOpen(true);
                          } else {
                            // Open edit sheet with profile data
                            setSelectedProfile({
                              id: item.id,
                              name: item.label,
                              dienstleister: item.label.split(' ')[0] || item.label, // Extract provider name
                              produkt: item.produkt || '',
                              verpackung: item.verpackung || '',
                              zusatzleistungen: item.zusatzleistungen || '',
                              additionalZusatzleistungen: item.additionalZusatzleistungen || [],
                            });
                            setIsVersandprofilEditSheetOpen(true);
                          }
                        }}
                      >
                        {item.isAddButton ? (
                          // Render only a "+" icon centered for add button items
                          <div className="flex items-center justify-center w-full h-full">
                            <Plus className="size-5 text-muted-foreground" />
                          </div>
                        ) : (
                          // Normal item rendering
                          <div className="flex flex-col justify-between flex-1 h-full">
                            <div className="flex items-start justify-between">
                              {item.logo ? (
                                <img 
                                  src={item.logo} 
                                  alt={item.label} 
                                  className="h-8 w-auto"
                                />
                              ) : (
                                <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                                  {item.count}
                                </div>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-5 w-5 p-0 min-w-0 text-muted-foreground hover:text-foreground"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Open edit sheet with profile data
                                      setSelectedProfile({
                                        id: item.id,
                                        name: item.label,
                                        dienstleister: item.label.split(' ')[0] || item.label, // Extract provider name
                                        produkt: item.produkt || '',
                                        verpackung: item.verpackung || '',
                                        zusatzleistungen: item.zusatzleistungen || '',
                                        additionalZusatzleistungen: item.additionalZusatzleistungen || [],
                                      });
                                      setIsVersandprofilEditSheetOpen(true);
                                    }}
                                  >
                                    <Pencil className="size-4 mr-2" />
                                    Bearbeiten
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicate(item.id);
                                    }}
                                  >
                                    <Copy className="size-4 mr-2" />
                                    Duplizieren
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(item.id);
                                    }}
                                    variant="destructive"
                                  >
                                    <Trash2 className="size-4 mr-2" />
                                    Löschen
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <Label
                              className={cn(
                                "text-[0.8rem] leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words antialiased",
                                item.checked ? "font-medium" : "font-normal"
                              )}
                            >
                              {item.label}
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {isAvailableProvidersVisible && (
                  <>
                    <Separator orientation="horizontal" />
                    <div className="w-full flex-1 flex flex-col gap-[28px]">
                      <h2>
                        Versanddienstleister hinzufügen
                      </h2>
                    <div className="flex gap-3 items-stretch flex-wrap">
                      {allAvailableProviders.map((item) => (
                      <div
                        key={item.id + (item.id.includes("versandprofile-checkbox") ? "-available" : "")}
                        className={cn(
                          "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] w-[116px] bg-background shadow-xs",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground"
                        )}
                      >
                        <div className="flex flex-col justify-between flex-1 h-full">
                          <div className="flex items-start justify-between">
                            {item.logo ? (
                              <img 
                                src={item.logo} 
                                alt={item.displayLabel} 
                                className="h-8 w-auto"
                              />
                            ) : (
                              <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                                {('count' in item ? (item.count as number) : 0)}
                              </div>
                            )}
                            <Button
                              variant="link"
                              size="sm"
                              className="h-5 w-5 p-0 min-w-0 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle add action
                              }}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                          <Label
                            className={cn(
                              "text-[0.8rem] leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words antialiased",
                              item.checked ? "font-medium" : "font-normal"
                            )}
                          >
                            {item.displayLabel}
                          </Label>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  </>
                )}
              </div>
              <Separator orientation="vertical" />
              <div className="w-[35%]">
                <h2>
                  Was sind Versandprofile?
                </h2>
                <div className="mt-4 space-y-4 text-muted-foreground !text-foreground text-sm font-light leading-[140%]">
                  <p>
                    Versandprofile dienen der Definition der optimalen Versandkonfiguration für Ihre zu versendenden Sendungen.
                    Mit einem Versandprofil legen Sie einmalig fest, wie und mit welchem Versanddienstleister eine Sendung abgewickelt werden soll.
                  </p>
                  <p>
                    Ein Versandprofil enthält folgende Elemente:
                  </p>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 shrink-0 mt-0.5" style={{ color: '#1354F9' }} />
                      <span>den <span className="font-medium">Versanddienstleister</span> (z. B. Paket-, Express- oder Speditionsdienst)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 shrink-0 mt-0.5" style={{ color: '#1354F9' }} />
                      <span>das konkrete <span className="font-medium">Versandprodukt</span> des Dienstleisters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 shrink-0 mt-0.5" style={{ color: '#1354F9' }} />
                      <span>die Art der <span className="font-medium">Verpackung</span>, z. B. Karton, Palette, Umschlag oder Sonderverpackung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 shrink-0 mt-0.5" style={{ color: '#1354F9' }} />
                      <span>optionale <span className="font-medium">Zusatzleistungen</span> wie Versicherung, Nachnahme, Expresszustellung oder Sendungsverfolgung</span>
                    </li>
                  </ul>
                  <p>
                    Das definierte Versandprofil kann anschließend mehrfach verwendet und einzelnen Sendungen oder Bestellungen zugewiesen werden. Dadurch wird der Versandprozess vereinheitlicht, beschleunigt und Fehler bei der Auswahl von Dienstleistern oder Versandoptionen werden reduziert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Versandprofil Hinzufügen Sheet */}
      <Sheet open={isVersandprofilSheetOpen} onOpenChange={setIsVersandprofilSheetOpen}>
        <SheetContent
          name="VersandprofilHinzufugen"
          side="right"
          className="overflow-y-auto p-6 lg:p-10 pb-[90px] !max-w-full lg:!max-w-none"
          style={isSmallScreen ? { width: '100%', maxWidth: '100%' } : { width: `${responsiveSheetWidth}px`, maxWidth: `${responsiveSheetWidth}px` }}
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors z-50"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          />
          <SheetTitle className="font-bold tracking-tight text-foreground mb-2 mt-4">
            Hinzufügen
          </SheetTitle>
          <div className="mt-10">
            <div className="flex gap-3 items-stretch flex-wrap">
              {allAvailableProviders.map((item) => (
                <div
                  key={item.id + (item.id.includes("versandprofile-checkbox") ? "-available" : "")}
                  className={cn(
                    "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] w-[116px] bg-background shadow-xs",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:bg-accent focus-visible:text-accent-foreground"
                  )}
                >
                  <div className="flex flex-col justify-between flex-1 h-full">
                    <div className="flex items-start">
                      {item.logo ? (
                        <img 
                          src={item.logo} 
                          alt={item.displayLabel} 
                          className="h-8 w-auto"
                        />
                      ) : (
                        <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                          {('count' in item ? (item.count as number) : 0)}
                        </div>
                      )}
                    </div>
                    <Label
                      className={cn(
                        "text-[0.8rem] leading-[130%] text-muted-foreground group-hover:text-accent-foreground cursor-pointer break-words antialiased",
                        item.checked ? "font-medium" : "font-normal"
                      )}
                    >
                      {item.displayLabel}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Versandprofil Edit Sheet */}
      <Sheet open={isVersandprofilEditSheetOpen} onOpenChange={(open) => {
        setIsVersandprofilEditSheetOpen(open);
        // Save data when sheet closes
        if (!open && selectedProfile) {
          setFilterItems2((prevItems) =>
            prevItems.map((prevItem) =>
              prevItem.id === selectedProfile.id
                ? { 
                    ...prevItem, 
                    label: selectedProfile.name,
                    produkt: selectedProfile.produkt,
                    verpackung: selectedProfile.verpackung,
                    zusatzleistungen: selectedProfile.zusatzleistungen,
                    additionalZusatzleistungen: selectedProfile.additionalZusatzleistungen || [],
                  }
                : prevItem
            )
          );
          setSelectedProfile(null);
        }
      }}>
        <SheetContent
          name="Versandprofil"
          side="right"
          className="overflow-y-auto p-6 lg:p-10 pb-[90px] !max-w-full lg:!max-w-none"
          style={isSmallScreen ? { width: '100%', maxWidth: '100%' } : { width: `${responsiveSheetWidth}px`, maxWidth: `${responsiveSheetWidth}px` }}
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors z-50"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          />
          <SheetTitle className="font-bold tracking-tight text-foreground mb-2 mt-4">
            Versandprofil
          </SheetTitle>
          <Tabs defaultValue="profil" className="mt-10">
            <TabsList variant="line">
              <TabsTrigger value="profil">Profil</TabsTrigger>
              <TabsTrigger value="einstellungen">Einstellungen</TabsTrigger>
              <TabsTrigger value="anleitung">Anleitung</TabsTrigger>
            </TabsList>
            <TabsContent value="profil" className="mt-10 space-y-6">
            <Field orientation="vertical">
              <FieldLabel>Profilname</FieldLabel>
              <FieldContent>
                <Input
                  value={selectedProfile?.name || ''}
                  onChange={(e) => setSelectedProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Profilname eingeben"
                />
              </FieldContent>
            </Field>

            <Field orientation="vertical">
              <FieldLabel>Versanddienstleister</FieldLabel>
              <FieldContent>
                <div className="text-sm text-muted-foreground">
                  {selectedProfile?.dienstleister || '-'}
                </div>
              </FieldContent>
            </Field>

            <Field orientation="vertical">
              <FieldLabel>Produkt</FieldLabel>
              <FieldContent>
                <Select
                  value={selectedProfile?.produkt || ''}
                  onValueChange={(value) => setSelectedProfile(prev => prev ? { ...prev, produkt: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Produkt auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableProdukte.length > 0 ? (
                      getAvailableProdukte.map((produkt) => (
                        <SelectItem key={produkt} value={produkt}>{produkt}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>Keine Produkte verfügbar</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field orientation="vertical">
              <div className="flex items-center justify-between">
                <FieldLabel>Versandverpackung</FieldLabel>
                <Button
                  variant="link"
                  size={undefined}
                  className="p-0 !px-0 h-auto text-sm font-normal has-[>svg]:!px-0"
                >
                  Bearbeiten
                </Button>
              </div>
              <FieldContent>
                <Select
                  value={selectedProfile?.verpackung || ''}
                  onValueChange={(value) => setSelectedProfile(prev => prev ? { ...prev, verpackung: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verpackung auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableVerpackung.map((verpackung) => (
                      <SelectItem key={verpackung} value={verpackung}>{verpackung}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field orientation="vertical">
              <FieldLabel>Zusatzleistungen</FieldLabel>
              <FieldContent>
                <Select
                  value={selectedProfile?.zusatzleistungen || ''}
                  onValueChange={(value) => setSelectedProfile(prev => prev ? { ...prev, zusatzleistungen: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Zusatzleistung auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableZusatzleistungen.length > 0 ? (
                      getAvailableZusatzleistungen.map((zusatz) => (
                        <SelectItem key={zusatz} value={zusatz}>{zusatz}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>Keine Zusatzleistungen verfügbar</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            {/* Additional Zusatzleistungen dropdowns */}
            {selectedProfile?.additionalZusatzleistungen?.map((item) => (
              <Field key={item.id} orientation="vertical" className="-mt-4">
                <FieldContent>
                  <Select
                    value={item.value || ''}
                    onValueChange={(value) => setSelectedProfile(prev => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        additionalZusatzleistungen: prev.additionalZusatzleistungen?.map(az =>
                          az.id === item.id ? { ...az, value } : az
                        ) || []
                      };
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Zusatzleistung auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableZusatzleistungen.length > 0 ? (
                        getAvailableZusatzleistungen.map((zusatz) => (
                          <SelectItem key={zusatz} value={zusatz}>{zusatz}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>Keine Zusatzleistungen verfügbar</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            ))}

            <div className="flex justify-start mt-5">
              <Button
                variant="link"
                size={undefined}
                className="p-0 !px-0 h-auto text-sm font-normal mb-2 has-[>svg]:!px-0"
                onClick={() => {
                  setSelectedProfile(prev => {
                    if (!prev) return null;
                    const newId = `zusatzleistung-${Date.now()}`;
                    return {
                      ...prev,
                      additionalZusatzleistungen: [
                        ...(prev.additionalZusatzleistungen || []),
                        { id: newId, value: '' }
                      ]
                    };
                  });
                }}
              >
                <Plus className="size-4" />
                Zusatzleistung hinzufügen
              </Button>
            </div>
            </TabsContent>
            <TabsContent value="einstellungen" className="mt-10 space-y-6">
              <div className={`${sheetWidth >= 1024 ? 'grid grid-cols-[1fr_auto_1fr] gap-[32px] items-start' : 'space-y-6'}`}>
                {/* Left Column: Login & Passwort */}
                <div className="space-y-6">
                  <div className="text-sm">
                    Einstellungen gelten für alle Profile, die mit diesem Dienstleister verbunden sind.
                  </div>
                  
                  <div className={`${sheetWidth >= 640 ? 'grid grid-cols-2 gap-4' : 'space-y-6'}`}>
                    <Field orientation="vertical">
                      <FieldLabel>Login</FieldLabel>
                      <FieldContent>
                        <Input 
                          value="user@easybill.de" 
                          disabled 
                          className="bg-muted"
                        />
                      </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                      <FieldLabel>Passwort</FieldLabel>
                      <FieldContent>
                        <Input 
                          value="••••••••••••••••" 
                          disabled 
                          className="bg-muted"
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <Button
                    variant="link"
                    className="p-0 !px-0 h-auto text-sm font-normal mb-2 has-[>svg]:!px-0"
                  >
                    Bearbeiten
                  </Button>
                </div>

                {/* Separator for lg+ screens */}
                {sheetWidth >= 1024 && (
                  <Separator orientation="vertical" className="h-auto self-stretch" />
                )}

                {/* Right Column: Grundeinstellungen */}
                <div className="space-y-6">

              {selectedProfile?.dienstleister?.includes("DHL") && (
                <>
                  <h2 className={sheetWidth >= 1024 ? "" : "mt-8"}>Grundeinstellungen</h2>

                  <Field orientation="vertical">
                    <FieldLabel>Versandland</FieldLabel>
                    <FieldContent>
                      <Input 
                        defaultValue="Deutschland"
                      />
                    </FieldContent>
                  </Field>

                  <Field orientation="vertical">
                    <FieldLabel>Standardgewicht</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input 
                          defaultValue="2,25"
                          className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          kg
                        </span>
                      </div>
                    </FieldContent>
                  </Field>

                  <Field orientation="vertical">
                    <FieldLabel>Maße in cm</FieldLabel>
                    <FieldContent>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="relative">
                          <Input 
                            placeholder="Länge"
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            cm
                          </span>
                        </div>
                        <div className="relative">
                          <Input 
                            placeholder="Breite"
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            cm
                          </span>
                        </div>
                        <div className="relative">
                          <Input 
                            placeholder="Höhe"
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            cm
                          </span>
                        </div>
                      </div>
                    </FieldContent>
                  </Field>
                </>
              )}
              
              {selectedProfile?.dienstleister?.includes("DPD") && (
                <>
                  <h2 className={sheetWidth >= 1024 ? "" : "mt-8"}>Grundeinstellungen</h2>

                  <Field orientation="vertical">
                    <FieldLabel>Verpackungsart</FieldLabel>
                    <FieldContent>
                      <Select defaultValue="normalpaket">
                        <SelectTrigger>
                          <SelectValue placeholder="Verpackungsart auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normalpaket">Normalpaket (NP/NCP)</SelectItem>
                          <SelectItem value="kleinespaket">Kleines Paket (KP/SCP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>

                  <Field orientation="vertical">
                    <FieldLabel>Standardgewicht</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input 
                          defaultValue="2,25"
                          className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          kg
                        </span>
                      </div>
                    </FieldContent>
                  </Field>

                  <Field orientation="vertical">
                    <FieldLabel>Maße in cm</FieldLabel>
                    <FieldContent>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="relative">
                          <Input 
                            placeholder="Länge"
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            cm
                          </span>
                        </div>
                        <div className="relative">
                          <Input 
                            placeholder="Breite"
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            cm
                          </span>
                        </div>
                        <div className="relative">
                          <Input 
                            placeholder="Höhe"
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            cm
                          </span>
                        </div>
                      </div>
                    </FieldContent>
                  </Field>
                </>
              )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="anleitung" className="mt-10 space-y-6">
              <div className="text-sm">
                Anleitung content coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      </div>
    </TooltipProvider>
  );
}

export default ShippingProfilesPage;
