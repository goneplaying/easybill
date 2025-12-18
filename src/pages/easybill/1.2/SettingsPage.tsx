import { Link } from "react-router-dom";
import { Truck, ToyBrick, Settings, HelpCircle, Menu, LayoutDashboard } from "lucide-react";
import logo from "@/assets/easybill-logo.svg";
import logoPlus from "@/assets/easybill-logo+.svg";

export default function SettingsPage() {
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
              <Link to="/1.2/dashboard" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <LayoutDashboard className="size-5 text-white" />
              </Link>
              <Link to="/1.2/shipping" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <Truck className="size-5 text-white" />
              </Link>
              <Link to="/1.2/tools" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <ToyBrick className="size-5 text-white" />
              </Link>
              <Link to="/1.2/settings" className="flex items-center justify-center w-full aspect-square rounded-md bg-white transition-colors">
                <Settings className="size-5 text-foreground" />
              </Link>
              <div className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <HelpCircle className="size-5 text-white" />
              </div>
            </div>
            {/* Version number at bottom */}
            <div className="hidden lg:block mt-auto pt-4">
              <div className="text-white/70 text-xs text-center font-medium">
                v1.2
              </div>
            </div>
          </div>
            {/* Left part - 300px width */}
            <div className="hidden lg:block w-[300px] flex-shrink-0 py-[40px] px-[24px] border-r border-border" data-name="FilterDiv">
          </div>

          {/* Right part - flexible width */}
          <div className="flex-1 min-w-0 px-6 py-5 lg:px-8 lg:py-10 flex flex-col gap-[28px]">
            <h1>
              Settings
            </h1>
          </div>
        </div>
      </div>

    </div>
  );
}

