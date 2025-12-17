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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  CheckCheck,
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
  DropdownMenuItem,
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
  onRowDoubleClick?: (row: TData) => void;
  onRowMark?: (row: TData, event: React.MouseEvent, rowIndex: number) => void;
  onFilteredDataChange?: (data: TData[]) => void;
  isRowSelected?: (row: TData) => boolean;
  isRowMarked?: (row: TData) => boolean;
  getMarkedRows?: () => TData[];
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  onRowDelete?: (rows: TData[]) => void;
  tabs?: React.ReactNode;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  onRowReorder?: (fromIndex: number, toIndex: number) => void;
  toolbarLeft?: React.ReactNode;
  toolbarAfterChecklist?: React.ReactNode;
  enableRowDrag?: boolean;
  tableName?: string;
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
  onRowDoubleClick,
  onRowMark,
  onFilteredDataChange,
  isRowSelected,
  isRowMarked,
  getMarkedRows,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
  onRowDelete,
  tabs,
  onRowContextMenu,
  toolbarLeft,
  toolbarAfterChecklist,
  onRowReorder,
  enableRowDrag = false,
  tableName,
}: DataTableProps<TData, TValue>) {
  // Track last click to prevent marking on double-click
  const lastClickRef = React.useRef<{ row: TData | null; time: number }>({ row: null, time: 0 });
  const markTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Custom global filter function that searches across all columns including formatted values
  // Create a closure with access to columns for searching formatted values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalFilterFn = React.useCallback((row: any, _columnId: string, filterValue: any) => {
    if (!filterValue) return true;
    
    const searchValue = String(filterValue).toLowerCase().trim();
    if (!searchValue) return true;
    
    const rowData = row.original;
    
    // Helper function to recursively search through values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchInValue = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      
      // Handle arrays
      if (Array.isArray(value)) {
        return value.some(item => searchInValue(item));
      }
      
      // Handle objects
      if (typeof value === 'object') {
        return Object.values(value).some(item => searchInValue(item));
      }
      
      // Convert to string and search
      return String(value).toLowerCase().includes(searchValue);
    };
    
    // Search through all properties in the row data recursively
    // This will search through all values including nested objects and arrays
    return Object.values(rowData).some(value => searchInValue(value));
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
    enableRowSelection: true,
    enableMultiRowSelection: true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getFilteredRowModel().rows, onFilteredDataChange]);


  // Get active filters count
  const activeFiltersCount = columnFilters.length;

  return (
    <div className="w-full space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Custom left toolbar items */}
        {toolbarLeft && <div className="flex items-center gap-3">{toolbarLeft}</div>}
        
        {/* Search - show only if searchKey is provided (hide global filter input in toolbar) */}
        {searchKey && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ??
                    ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchKey)
                  ?.setFilterValue(event.target.value)
              }
              className="pl-9 pr-9"
            />
            {(table.getColumn(searchKey)?.getFilterValue() as string)?.length > 0 && (
              <button
                onClick={() =>
                  table.getColumn(searchKey)?.setFilterValue("")
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
              <span className="hidden sm:inline">Spalten</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
            <DropdownMenuLabel>Spalten anzeigen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .filter((column) => {
                const label = columnLabels[column.id] || column.id;
                // Hide these specific column options
                const hiddenLabels = [
                  "Fehler",
                  "Versendet",
                  "Paketlabel gedruckt",
                  "Packliste erstellt",
                  "Pickliste erstellt",
                  "Versandvorgang erstellt",
                  "Versandprofil hinzugefügt",
                  "Rechnung versendet",
                ];
                return !hiddenLabels.includes(label);
              })
              .map((column) => {
                const label = columnLabels[column.id] || column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Floating Columns Visibility Dropdown (Checklisten) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <CheckCheck className="size-4" />
              <span className="hidden sm:inline">Checklisten</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Checklisten anzeigen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => {
                const columnId = column.id || "";
                return (
                  columnId.startsWith("floating-col-") &&
                  column.getCanHide()
                );
              })
              .map((column) => {
                const label = columnLabels[column.id] || column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                // Hide all floating columns (checklisten)
                const floatingColumns = table.getAllColumns()
                  .filter((column) => {
                    const columnId = column.id || "";
                    return columnId.startsWith("floating-col-") && column.getCanHide();
                  });
                
                // Update visibility state for all floating columns
                const newVisibility: VisibilityState = { ...columnVisibility };
                floatingColumns.forEach((column) => {
                  const columnId = column.id || "";
                  newVisibility[columnId] = false;
                  column.toggleVisibility(false);
                });
                
                // Update external state if controlled
                setColumnVisibility(newVisibility);
              }}
            >
              Alle Checklisten ausblenden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Custom toolbar items after Checkliste */}
        {toolbarAfterChecklist && <div className="lg:hidden">{toolbarAfterChecklist}</div>}

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
      <div className="rounded-lg border border-border overflow-hidden" tabIndex={-1} onFocus={(e) => e.currentTarget.blur()} data-name={tableName}>
        <div className="overflow-x-auto">
          <Table style={{ position: 'relative' }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => {
                // Calculate positions for visible floating columns
                // Keep them in the same order as they appear in the headers array (table order)
                const floatingCols = headerGroup.headers.filter(h => h.column.id?.startsWith("floating-col-"));
                const visibleFloatingCols = floatingCols.filter(h => h.column.getIsVisible());
                // Use the order from the headers array (which matches table order)
                // Reverse the positions so first in array = leftmost (highest right value), last = rightmost (right-0)
                const floatingColPositions = new Map<string, number>();
                const totalVisible = visibleFloatingCols.length;
                visibleFloatingCols.forEach((header, index) => {
                  if (header.column.id) {
                    // Reverse: first column gets highest right value (leftmost), last gets 0 (rightmost)
                    floatingColPositions.set(header.column.id, (totalVisible - 1 - index) * 50);
                  }
                });

                return (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/40 hover:bg-muted/40"
                >
                  {headerGroup.headers.map((header) => {
                    const isFloatingCol = header.column.id?.startsWith("floating-col-");
                    const baseClassName = header.column.columnDef.meta?.className || "";
                    // For floating columns, calculate dynamic right position based on visible columns
                    let adjustedClassName = baseClassName;
                    if (isFloatingCol && header.column.id) {
                      const rightOffset = floatingColPositions.get(header.column.id);
                      if (rightOffset !== undefined && rightOffset >= 0) {
                        // Replace the right position with calculated position
                        const rightValue = rightOffset === 0 ? "right-0" : `right-[${rightOffset}px]`;
                        adjustedClassName = baseClassName.replace(/right-\[?\d+px\]?|right-\d+|right-0/g, rightValue);
                      }
                    }
                    const columnSize = header.column.getSize();
                    const isNrColumn = header.column.id === "nr";
                    const isSelectColumn = header.column.id === "select";
                    const hasFixedSize = isSelectColumn || isFloatingCol || header.column.columnDef.size !== undefined;
                    return (
                    <TableHead 
                      key={header.id} 
                      style={hasFixedSize ? { width: columnSize, minWidth: columnSize, maxWidth: columnSize } : undefined}
                      className={cn(
                        "font-semibold", 
                        adjustedClassName,
                        isFloatingCol && "bg-[#FBFBFB]",
                        isFloatingCol && "!text-center !align-middle",
                        isFloatingCol && "!pointer-events-auto"
                      )}
                      data-name={isNrColumn ? "BestellungenTable" : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                    );
                  })}
                </TableRow>
                );
              })}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, rowIndex) => {
                  const isSelected = isRowSelected ? isRowSelected(row.original) : false;
                  
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
                      "transition-colors group",
                      enableRowDrag && "cursor-move",
                      (onRowClick || onRowMark) && "cursor-pointer hover:bg-muted/50",
                      // Marked rows (only if not selected)
                      !isSelected && isRowMarked?.(row.original) && "!bg-primary/5 hover:!bg-primary/10",
                      // Selected rows (takes priority over marked)
                      isSelected && "!bg-primary/5 hover:!bg-primary/10",
                      draggedRowIndex === rowIndex && "opacity-50",
                      dragOverRowIndex === rowIndex && draggedRowIndex !== rowIndex && "border-t-2 border-t-primary"
                    )}
                    onMouseDown={(e: React.MouseEvent<HTMLTableRowElement>) => {
                      // Prevent text selection when Shift key is pressed
                      if (e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
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
                      // Handle mark state with Shift+click for range selection
                      if (onRowMark && e.shiftKey) {
                        try {
                          onRowMark(row.original, e, rowIndex)
                        } catch (error) {
                          console.error('Error in onRowMark:', error)
                        }
                        return
                      }
                      // Handle mark state with regular click (single click marks, double click opens sheet)
                      // Delay marking to detect if double-click is coming
                      if (onRowMark && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                        // Clear any pending mark timeout
                        if (markTimeoutRef.current) {
                          clearTimeout(markTimeoutRef.current);
                        }
                        
                        const now = Date.now();
                        const isDoubleClick = 
                          lastClickRef.current.row === row.original &&
                          now - lastClickRef.current.time < 300; // 300ms double-click window
                        
                        if (isDoubleClick) {
                          // Double-click detected, don't mark
                          lastClickRef.current = { row: null, time: 0 };
                          return;
                        }
                        
                        // Store click info
                        lastClickRef.current = { row: row.original, time: now };
                        
                        // Delay marking to allow double-click detection
                        markTimeoutRef.current = setTimeout(() => {
                          try {
                            onRowMark(row.original, e, rowIndex)
                          } catch (error) {
                            console.error('Error in onRowMark:', error)
                          }
                          markTimeoutRef.current = null;
                        }, 200); // 200ms delay
                        
                        // Don't call onRowClick here - use double-click to open sheet
                        return
                      }
                      // Only call onRowClick if no mark handler (for backward compatibility)
                      if (!onRowMark) {
                      onRowClick?.(row.original)
                      }
                    }}
                    onDoubleClick={(e) => {
                      // Don't open sheet if clicking on checkbox or its container
                      const target = e.target as HTMLElement
                      if (
                        target.closest('[data-slot="checkbox"]') ||
                        target.closest('button[type="button"]') ||
                        target.tagName === 'BUTTON'
                      ) {
                        return
                      }
                      // Cancel any pending mark from single click
                      if (markTimeoutRef.current) {
                        clearTimeout(markTimeoutRef.current);
                        markTimeoutRef.current = null;
                      }
                      lastClickRef.current = { row: null, time: 0 };
                      onRowDoubleClick?.(row.original)
                    }}
                        onContextMenu={(e) => {
                          if (onRowContextMenu) {
                            onRowContextMenu(row.original, e)
                          }
                        }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isFloatingCol = cell.column.id?.startsWith("floating-col-");
                      const isMarked = isRowMarked?.(row.original) || false;
                      const isChecked = row.getIsSelected() || isSelected;
                      // Calculate positions for visible floating columns in this row
                      // Keep them in the same order as they appear in the cells array (table order)
                      const rowFloatingCols = row.getVisibleCells().filter(c => c.column.id?.startsWith("floating-col-"));
                      const visibleRowFloatingCols = rowFloatingCols.filter(c => c.column.getIsVisible());
                      // Use the order from the cells array (which matches table order)
                      // Reverse the positions so first in array = leftmost (highest right value), last = rightmost (right-0)
                      const rowFloatingColPositions = new Map<string, number>();
                      const totalVisibleRow = visibleRowFloatingCols.length;
                      visibleRowFloatingCols.forEach((c, index) => {
                        if (c.column.id) {
                          // Reverse: first column gets highest right value (leftmost), last gets 0 (rightmost)
                          rowFloatingColPositions.set(c.column.id, (totalVisibleRow - 1 - index) * 50);
                        }
                      });

                      const baseClassName = cell.column.columnDef.meta?.className || "";
                      // For floating columns, calculate dynamic right position based on visible columns
                      let adjustedClassName = baseClassName;
                      if (isFloatingCol && cell.column.id) {
                        const rightOffset = rowFloatingColPositions.get(cell.column.id);
                        if (rightOffset !== undefined && rightOffset >= 0) {
                          // Replace the right position with calculated position
                          const rightValue = rightOffset === 0 ? "right-0" : `right-[${rightOffset}px]`;
                          adjustedClassName = baseClassName.replace(/right-\[?\d+px\]?|right-\d+|right-0/g, rightValue);
                        }
                      }

                      // For floating columns: white by default, #F9F9F9 on hover, #F5F5F5 when checked (priority), #F4F6FF when marked, #E8EDFF when marked and hovered
                      // For regular cells, use transparent so row background shows through
                      const cellColumnSize = cell.column.getSize();
                      const isSelectColumn = cell.column.id === "select";
                      const hasFixedSize = isSelectColumn || isFloatingCol || cell.column.columnDef.size !== undefined;
                      return (
                      <TableCell 
                        key={cell.id}
                        style={hasFixedSize ? { width: cellColumnSize, minWidth: cellColumnSize, maxWidth: cellColumnSize } : undefined}
                        className={cn(
                          adjustedClassName,
                          isFloatingCol 
                            ? isChecked
                              ? "bg-[#F5F5F5] group-hover:bg-[#F5F5F5]"
                              : isMarked 
                              ? "bg-[#F4F6FF] group-hover:bg-[#E8EDFF]" 
                              : "bg-white group-hover:bg-[#F9F9F9]"
                            : "bg-transparent"
                        )}
                        onMouseDown={(e: React.MouseEvent<HTMLTableCellElement>) => {
                          // Prevent text selection when Shift key is pressed
                          if (e.shiftKey) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                      );
                    })}
                  </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => {
                        // Always open the clicked row, even if multiple are marked
                        // Try onRowDoubleClick first (for sheet), fallback to onRowClick
                        if (onRowDoubleClick) {
                          onRowDoubleClick(row.original);
                        } else {
                          onRowClick?.(row.original);
                        }
                      }}>
                        Öffnen
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => {
                        const markedRows = getMarkedRows?.() || [];
                        if (markedRows.length > 1) {
                          // Get all table rows that match marked rows
                          const rowsToToggle = table.getRowModel().rows.filter(r => markedRows.includes(r.original));
                          if (rowsToToggle.length > 0) {
                            // Check if all are selected - if so, deselect all; otherwise select all
                            const allSelected = rowsToToggle.every(r => r.getIsSelected());
                            
                            // Update rowSelection state directly
                            setRowSelection((prev) => {
                              const newSelection = { ...prev };
                              rowsToToggle.forEach(tableRow => {
                                const rowIndex = tableRow.index.toString();
                                if (allSelected) {
                                  delete newSelection[rowIndex];
                                } else {
                                  newSelection[rowIndex] = true;
                                }
                              });
                              return newSelection;
                            });
                          }
                        } else {
                          row.toggleSelected();
                        }
                      }}>
                        {row.getIsSelected() ? "Abwählen" : "Auswählen"}{getMarkedRows?.() && getMarkedRows().length > 1 ? ` (${getMarkedRows().length})` : ''}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          const markedRows = getMarkedRows?.() || [];
                          if (markedRows.length > 1) {
                            onRowDelete?.(markedRows);
                          } else {
                            onRowDelete?.([row.original]);
                          }
                        }}
                      >
                        Löschen{getMarkedRows?.() && getMarkedRows().length > 1 ? ` (${getMarkedRows().length})` : ''}
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line react-refresh/only-export-components
export { DataTable, DataTableColumnHeader, getSelectColumn };
