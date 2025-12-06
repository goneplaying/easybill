import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

// Extend ColumnMeta to include className
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Columns3,
  X,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  columnLabels?: Record<string, string>;
  initialColumnVisibility?: VisibilityState;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  enableGlobalFilter?: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  onRowClick?: (row: TData) => void;
  onFilteredDataChange?: (data: TData[]) => void;
  isRowSelected?: (row: TData) => boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  tabs?: React.ReactNode;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  onRowReorder?: (fromIndex: number, toIndex: number) => void;
  toolbarLeft?: React.ReactNode;
  enableRowDrag?: boolean;
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Suchen...",
  columnLabels = {},
  initialColumnVisibility = {},
  columnVisibility: externalColumnVisibility,
  onColumnVisibilityChange: externalOnColumnVisibilityChange,
  enableGlobalFilter = false,
  globalFilter: externalGlobalFilter,
  onGlobalFilterChange: externalOnGlobalFilterChange,
  onRowClick,
  onFilteredDataChange,
  isRowSelected,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
  tabs,
  onRowContextMenu,
  toolbarLeft,
  onRowReorder,
  enableRowDrag = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "nr",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility);
  
  // Use external column visibility if provided, otherwise use internal state
  const columnVisibility = externalColumnVisibility !== undefined 
    ? externalColumnVisibility 
    : internalColumnVisibility;
  
  const setColumnVisibility = React.useCallback((updaterOrValue: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
    const newVisibility = typeof updaterOrValue === 'function' 
      ? updaterOrValue(columnVisibility) 
      : updaterOrValue;
    
    if (externalOnColumnVisibilityChange) {
      externalOnColumnVisibilityChange(newVisibility);
    } else {
      setInternalColumnVisibility(newVisibility);
    }
  }, [externalOnColumnVisibilityChange, columnVisibility]);
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("");
  const [draggedRowIndex, setDraggedRowIndex] = React.useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = React.useState<number | null>(null);
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, rowIndex: number) => {
    if (!enableRowDrag) return;
    setDraggedRowIndex(rowIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", rowIndex.toString());
    // Add a slight delay to allow the drag image to be set
    setTimeout(() => {
      if (e.dataTransfer) {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, rowIndex: number) => {
    if (!enableRowDrag || draggedRowIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverRowIndex(rowIndex);
  };

  const handleDragLeave = () => {
    setDragOverRowIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!enableRowDrag || draggedRowIndex === null) return;
    e.preventDefault();
    
    if (draggedRowIndex !== dropIndex && onRowReorder) {
      onRowReorder(draggedRowIndex, dropIndex);
    }
    
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
  };
  
  // Use external global filter if provided, otherwise use internal state
  const globalFilter = externalGlobalFilter !== undefined ? externalGlobalFilter : internalGlobalFilter;
  const setGlobalFilter = externalOnGlobalFilterChange || setInternalGlobalFilter;

  // Use external row selection if provided, otherwise use internal state
  const rowSelection = externalRowSelection !== undefined ? externalRowSelection : internalRowSelection;
  const setRowSelection: OnChangeFn<RowSelectionState> = React.useCallback((updaterOrValue) => {
    if (externalOnRowSelectionChange) {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
      externalOnRowSelectionChange(newValue);
    } else {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(internalRowSelection) : updaterOrValue;
      setInternalRowSelection(newValue);
    }
  }, [externalOnRowSelectionChange, rowSelection, internalRowSelection]);

  // Custom global filter function that searches across all columns including importdatum, telefonnummer, and email
  const globalFilterFn = React.useCallback((row: any, _columnId: string, filterValue: any) => {
    if (!filterValue) return true;
    
    const searchValue = String(filterValue).toLowerCase();
    const rowData = row.original;
    
    // Search across all string/number fields in the row (including importdatum, telefonnummer, and email)
    return Object.values(rowData).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchValue);
    });
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: enableGlobalFilter ? globalFilterFn : undefined,
    initialState: {
      pagination: {
        pageSize: 50,
      },
      sorting: [
        {
          id: "nr",
          desc: true,
        },
      ],
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Notify parent of filtered data changes
  React.useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(table.getFilteredRowModel().rows.map((row) => row.original));
    }
  }, [table.getFilteredRowModel().rows, onFilteredDataChange]);

  // Debug logging
  console.log("DataTable render:", { searchKey, globalFilter });

  // Get active filters count
  const activeFiltersCount = columnFilters.length;

  return (
    <div className="w-full space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Custom left toolbar items */}
        {toolbarLeft && <div className="flex items-center gap-3">{toolbarLeft}</div>}
        
        {/* Search - only show if not controlled externally */}
        {(searchKey || (enableGlobalFilter && externalGlobalFilter === undefined)) && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                searchKey
                  ? ((table.getColumn(searchKey)?.getFilterValue() as string) ??
                    "")
                  : (globalFilter ?? "")
              }
              onChange={(event) =>
                searchKey
                  ? table
                      .getColumn(searchKey)
                      ?.setFilterValue(event.target.value)
                  : setGlobalFilter(event.target.value)
              }
              className="pl-9 pr-9"
            />
            {(searchKey
              ? (table.getColumn(searchKey)?.getFilterValue() as string)?.length > 0
              : (globalFilter as string)?.length > 0) && (
              <button
                onClick={() =>
                  searchKey
                    ? table.getColumn(searchKey)?.setFilterValue("")
                    : setGlobalFilter("")
                }
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                type="button"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        {tabs && <div>{tabs}</div>}

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 ml-auto">
              <Columns3 className="size-4" />
              Spalten
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
            <DropdownMenuLabel>Spalten anzeigen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const label = columnLabels[column.id] || column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {columnFilters.map((filter) => {
              const label = columnLabels[filter.id] || filter.id;
              return (
                <span
                  key={filter.id}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {label}: {String(filter.value)}
                  <button
                    onClick={() => {
                      table.getColumn(filter.id)?.setFilterValue("");
                    }}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Selected count - pushed to the right - REMOVED */}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/40 hover:bg-muted/40"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className={cn("font-semibold", header.column.columnDef.meta?.className)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, rowIndex) => {
                  const isSelected = isRowSelected ? isRowSelected(row.original) : false;
                  const rowType = (row.original as any)?.type;
                  const isVersandvorgang = rowType === "Versandvorgang";
                  
                  return (
                  <ContextMenu key={row.id}>
                    <ContextMenuTrigger asChild>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    draggable={enableRowDrag}
                    onDragStart={(e) => handleDragStart(e, rowIndex)}
                    onDragOver={(e) => handleDragOver(e, rowIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, rowIndex)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "transition-colors",
                      enableRowDrag && "cursor-move",
                      isVersandvorgang && "bg-muted/40 hover:bg-muted/40",
                      !isVersandvorgang && onRowClick && "cursor-pointer hover:bg-muted/50",
                      isSelected && "!bg-primary/10 hover:!bg-primary/15",
                      draggedRowIndex === rowIndex && "opacity-50",
                      dragOverRowIndex === rowIndex && draggedRowIndex !== rowIndex && "border-t-2 border-t-primary"
                    )}
                    onClick={(e) => {
                      // Don't open sheet if clicking on checkbox or its container
                      const target = e.target as HTMLElement
                      if (
                        target.closest('[data-slot="checkbox"]') ||
                        target.closest('button[type="button"]') ||
                        target.tagName === 'BUTTON'
                      ) {
                        return
                      }
                      onRowClick?.(row.original)
                    }}
                        onContextMenu={(e) => {
                          if (onRowContextMenu) {
                            onRowContextMenu(row.original, e)
                          }
                        }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => onRowClick?.(row.original)}>
                        Öffnen
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => row.toggleSelected()}>
                        {row.getIsSelected() ? "Abwählen" : "Auswählen"}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="text-destructive">
                        Löschen
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Keine Ergebnisse gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">Zeilen pro Seite</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Seite {table.getState().pagination.pageIndex + 1} von{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to render title with line breaks (supports both \n and \\n)
function renderTitle(title: string) {
  // Handle both actual newlines and escaped \n in strings
  const lines = title.split(/\\n|\n/);
  if (lines.length === 1) return title;
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

// Header component for sortable columns
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: import("@tanstack/react-table").Column<TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("text-sm leading-tight min-h-[44px] flex items-center", className)}>
        {renderTitle(title)}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-auto min-h-[44px] !px-3 py-1 data-[state=open]:bg-accent whitespace-normal text-left flex items-center",
        className
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="text-sm leading-tight">{renderTitle(title)}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-1 size-3.5 shrink-0" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-1 size-3.5 shrink-0" />
      ) : (
        <div className="ml-1 size-3.5 shrink-0" />
      )}
    </Button>
  );
}

// Checkbox column helper
function getSelectColumn<TData>(activeTab?: string): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="min-h-[44px] flex items-center pr-2.5">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => {
      const rowType = (row.original as any)?.type;
      const shouldHide = activeTab === "rechnung" && rowType === "Versandvorgang";
      
      if (shouldHide) {
        return <div className="pr-2.5" />;
      }
      
      return (
        <div onClick={(e) => e.stopPropagation()} className="pr-2.5">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
}

export { DataTable, DataTableColumnHeader, getSelectColumn };
