import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function VersionsPage() {
  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <div className="w-full md:w-[60%] space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Versions
          </h1>
          <p className="text-muted-foreground">
            Wählen Sie eine Version aus, um fortzufahren
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full space-y-4">
            {/* Version 1.2 */}
            <Card className="flex flex-row w-full items-center">
              <CardHeader className="flex-1">
                <CardTitle>1.4</CardTitle>
                <CardDescription>
                  Aktuelle Version mit erweiterten Funktionen
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center px-6 py-0">
                <Link to="/1.2/shipping">
                  <Button>Öffnen</Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Version 1.1 */}
            <Card className="flex flex-row w-full items-center">
              <CardHeader className="flex-1">
                <CardTitle>1.1</CardTitle>
                <CardDescription>
                  Erste Version der Versand-Seite mit grundlegenden Funktionen
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center px-6 py-0">
                <Link to="/1.1/shipping">
                  <Button>Öffnen</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VersionsPage;

