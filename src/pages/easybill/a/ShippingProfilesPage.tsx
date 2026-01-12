import * as React from "react";
import { Truck, ToyBrick, Settings, HelpCircle, Menu, LayoutDashboard, Settings2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function ShippingProfilesPage() {
  const location = useLocation();
  const isShippingActive = location.pathname.includes("/a/shipping") && !location.pathname.includes("/a/shippingprofiles");
  const isShippingProfilesActive = location.pathname.includes("/a/shippingprofiles");

  // Filter checkbox states
  const [isChecked5, setIsChecked5] = React.useState(false); // DHL National
  const [isChecked6, setIsChecked6] = React.useState(false); // DPD Europa
  const [isChecked11, setIsChecked11] = React.useState(false); // UPS USA

  // Filter items for Versandprofile
  const filterItems2 = React.useMemo(
    () => [
      {
        id: "versandprofile-checkbox-1",
        count: 0,
        label: "DHL National",
        checked: isChecked5,
        onCheckedChange: (checked: boolean) => {
          setIsChecked5(checked);
        },
      },
      {
        id: "versandprofile-checkbox-2",
        count: 0,
        label: "DPD Europa",
        checked: isChecked6,
        onCheckedChange: (checked: boolean) => {
          setIsChecked6(checked);
        },
      },
      {
        id: "versandprofile-checkbox-3",
        count: 0,
        label: "UPS USA",
        checked: isChecked11,
        onCheckedChange: (checked: boolean) => {
          setIsChecked11(checked);
        },
      },
    ],
    [isChecked5, isChecked6, isChecked11]
  );

  // Additional checkbox states for available shipping service providers
  const [isCheckedAmazon, setIsCheckedAmazon] = React.useState(false);
  const [isCheckedPost, setIsCheckedPost] = React.useState(false);
  const [isCheckedDHLExpress, setIsCheckedDHLExpress] = React.useState(false);
  const [isCheckedFedEx, setIsCheckedFedEx] = React.useState(false);
  const [isCheckedGLS, setIsCheckedGLS] = React.useState(false);
  const [isCheckedHermes, setIsCheckedHermes] = React.useState(false);
  const [isCheckedTNT, setIsCheckedTNT] = React.useState(false);

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
        id: "available-provider-dhl-express",
        label: "DHL Express",
        checked: isCheckedDHLExpress,
        onCheckedChange: (checked: boolean) => {
          setIsCheckedDHLExpress(checked);
        },
        logo: logoDHL,
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
    [isCheckedAmazon, isCheckedPost, isCheckedDHLExpress, isCheckedFedEx, isCheckedGLS, isCheckedHermes, isCheckedTNT]
  );

  // Combined and sorted available providers (from filterItems2 and availableProviders)
  const allAvailableProviders = React.useMemo(() => {
    // Transform filterItems2 items to have logo and displayLabel
    const transformedFilterItems = filterItems2.map((item) => {
      const displayLabel = item.label === "DHL National" ? "DHL" : item.label === "DPD Europa" ? "DPD" : item.label === "UPS USA" ? "UPS" : item.label;
      const logo = item.label === "DHL National" ? logoDHL : item.label === "DPD Europa" ? logoDPD : item.label === "UPS USA" ? logoUPS : undefined;
      return {
        ...item,
        displayLabel,
        logo,
      };
    });

    // Combine and sort alphabetically by display label
    const combined = [
      ...transformedFilterItems,
      ...availableProviders.map((provider) => ({
        ...provider,
        displayLabel: provider.label,
      })),
    ];

    return combined.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, 'de', { sensitivity: 'base' }));
  }, [filterItems2, availableProviders]);

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
                v1.12
              </div>
            </div>
          </div>

          {/* Right part - flexible width */}
          <div className="flex-1 min-w-0 px-6 py-5 lg:px-8 lg:py-10 flex flex-col gap-[28px]">
            <h1>
              Versandprofile
            </h1>
            <div className="flex flex-col gap-8 h-full">
              <div className="w-full flex-1 flex flex-col gap-[28px]">
                <h2>
                  In Verwendung
                </h2>
                <div className="flex gap-3 items-stretch">
                  {filterItems2.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] w-[116px]",
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
                          {item.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex-1 flex flex-col gap-[28px]">
                <h2>
                  Verfügbare Versanddienstleister
                </h2>
                <div className="flex gap-3 items-stretch flex-wrap">
                  {allAvailableProviders.map((item) => (
                    <div
                      key={item.id + (item.id.includes("versandprofile-checkbox") ? "-available" : "")}
                      className={cn(
                        "group relative flex cursor-pointer items-center justify-between rounded-md !border !border-border px-3 py-2.5 text-sm outline-none transition-colors h-[116px] w-[116px]",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:bg-accent focus-visible:text-accent-foreground"
                      )}
                    >
                      <div className="flex flex-col justify-between flex-1 h-full">
                        <div className="flex items-start justify-start">
                          {item.logo ? (
                            <img 
                              src={item.logo} 
                              alt={item.displayLabel} 
                              className="h-8 w-auto"
                            />
                          ) : (
                            <div className="text-[20px] font-medium leading-[1.1] text-foreground group-hover:text-accent-foreground" style={{ fontFamily: "'Ryker', sans-serif" }}>
                              {'count' in item ? item.count : 0}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingProfilesPage;
