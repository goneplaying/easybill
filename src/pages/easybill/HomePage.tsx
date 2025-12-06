import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Import Manger 2.0
        </h1>
        <p className="text-muted-foreground w-[640px]">
        Willkommen auf der Demo-Seite des Import Managers 2.0. Diese Seite dient ausschließlich der Veranschaulichung und dem Testen von Funktionen. Sie befindet sich noch in der Entwicklung, daher stehen derzeit nicht alle Features zur Verfügung. 
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/orders">
            <Button>Demo v2</Button>
        </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

