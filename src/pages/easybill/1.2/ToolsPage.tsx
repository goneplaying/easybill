import * as React from "react";
import { Link } from "react-router-dom";
import { Truck, ToyBrick, Settings, HelpCircle, Menu, LayoutDashboard } from "lucide-react";
import logo from "@/assets/easybill-logo.svg";
import logoPlus from "@/assets/easybill-logo+.svg";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchAirtableData } from "@/lib/airtable";
import { testAirtableConnection } from "@/lib/testAirtable";

// Airtable API configuration
// IMPORTANT: For production builds, API keys should NOT be embedded in client-side code
// The API key should only be used in development or via a secure backend proxy
const isProduction = import.meta.env.PROD;

// Only use API key in development - in production, it should be handled via backend
const AIRTABLE_API_KEY = isProduction ? "" : (import.meta.env.VITE_AIRTABLE_API_KEY || "");
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || "Table 1";
// View ID is optional - if not found, we'll fetch all records from the table
const AIRTABLE_VIEW_ID = import.meta.env.VITE_AIRTABLE_VIEW_ID || "shrZnuF0zypmAzDwZ";

// Type for Airtable records (dynamic based on fields)
type AirtableRecord = {
  id: string;
  [key: string]: any;
};

export default function ToolsPage() {
  const [data, setData] = React.useState<AirtableRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});

  // Fetch data from Airtable on component mount
  React.useEffect(() => {
    async function loadData() {
      // In production, API keys should not be exposed in client-side code
      if (isProduction) {
        setError("Airtable integration is not available in production builds for security reasons. API keys should not be embedded in client-side code. Please use a backend proxy or configure the integration differently.");
        setLoading(false);
        return;
      }

      if (!AIRTABLE_API_KEY) {
        setError("Airtable API key is not configured. Please set VITE_AIRTABLE_API_KEY in your .env file for development.");
        setLoading(false);
        return;
      }

      // Debug: Log configuration (without exposing full key)
      console.log("Airtable Config:", {
        hasApiKey: !!AIRTABLE_API_KEY,
        apiKeyPrefix: AIRTABLE_API_KEY.substring(0, 7) + "...",
        apiKeyLength: AIRTABLE_API_KEY.length,
        tableName: AIRTABLE_TABLE_NAME,
        viewId: AIRTABLE_VIEW_ID,
        baseId: "appe8E88rjO5PPZwy",
      });

      // First, test the connection
      const testResult = await testAirtableConnection(
        AIRTABLE_API_KEY,
        "appe8E88rjO5PPZwy",
        AIRTABLE_TABLE_NAME
      );

      if (!testResult.success) {
        setError(`Connection test failed: ${testResult.error}\n\nPlease check:\n1. Your API key is valid (starts with 'pat')\n2. The token has access to base appe8E88rjO5PPZwy\n3. The token has 'data.records:read' scope\n4. The table name "${AIRTABLE_TABLE_NAME}" is correct\n5. You've restarted the dev server after updating .env`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const records = await fetchAirtableData(AIRTABLE_API_KEY, AIRTABLE_TABLE_NAME, AIRTABLE_VIEW_ID);
        setData(records);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data from Airtable");
        console.error("Error loading Airtable data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Dynamically create columns based on the first record's fields
  const columns = React.useMemo<ColumnDef<AirtableRecord>[]>(() => {
    if (data.length === 0) return [];

    // Get all unique field names from the data
    const fieldNames = new Set<string>();
    data.forEach((record) => {
      Object.keys(record).forEach((key) => {
        if (key !== "id") {
          fieldNames.add(key);
        }
      });
    });

    // Create columns for each field
    const cols: ColumnDef<AirtableRecord>[] = [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.getValue("id")}</span>
        ),
        size: 100,
      },
    ];

    // Add a column for each field
    Array.from(fieldNames).forEach((fieldName) => {
      cols.push({
        accessorKey: fieldName,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={fieldName} />
        ),
        cell: ({ row }) => {
          const value = row.getValue(fieldName);
          // Handle different value types
          if (value === null || value === undefined) {
            return <span className="text-muted-foreground">–</span>;
          }
          if (typeof value === "object" && !Array.isArray(value)) {
            return <span>{JSON.stringify(value)}</span>;
          }
          if (Array.isArray(value)) {
            return <span>{value.join(", ")}</span>;
          }
          return <span>{String(value)}</span>;
        },
      });
    });

    return cols;
  }, [data]);

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
              <Link to="/1.1/dashboard" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <LayoutDashboard className="size-5 text-white" />
              </Link>
              <Link to="/1.1/shipping" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <Truck className="size-5 text-white" />
              </Link>
              <Link to="/1.1/tools" className="flex items-center justify-center w-full aspect-square rounded-md bg-white transition-colors">
                <ToyBrick className="size-5 text-foreground" />
              </Link>
              <Link to="/1.1/settings" className="flex items-center justify-center w-full aspect-square rounded-md hover:bg-white/15 transition-colors">
                <Settings className="size-5 text-white" />
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
              Tools
            </h1>

            {/* Airtable Data Table */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading data from Airtable...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-destructive font-medium">Error loading data</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>To fix this:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Get your API key from <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">Airtable Tokens</a></li>
                    <li>Open the <code className="bg-muted px-1 rounded">.env</code> file in the project root</li>
                    <li>Replace <code className="bg-muted px-1 rounded">your_api_key_here</code> with your actual API key</li>
                    <li>Update <code className="bg-muted px-1 rounded">VITE_AIRTABLE_TABLE_NAME</code> with your table name (e.g., "Table 1")</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>
            )}

            {!loading && !error && data.length > 0 && (
              <DataTable
                columns={columns}
                data={data}
                enableGlobalFilter={true}
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                searchPlaceholder="Suchen..."
                columnLabels={{}}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
                tableName="AirtableTable"
              />
            )}

            {!loading && !error && data.length === 0 && (
              <div className="rounded-lg border border-border p-8 text-center">
                <p className="text-muted-foreground">No data found in Airtable.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

