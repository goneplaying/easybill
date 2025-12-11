import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function Sheet({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/10",
        className
      )}
      {...props}
    />
  )
}

type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  name?: string
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  onPrevClick,
  onNextClick,
  isPrevDisabled,
  isNextDisabled,
  onToggleSelectAll,
  allRowsSelected,
  name,
  ...props
}: SheetContentProps & {
  showCloseButton?: boolean
  onPrevClick?: () => void
  onNextClick?: () => void
  isPrevDisabled?: boolean
  isNextDisabled?: boolean
  onToggleSelectAll?: () => void
  allRowsSelected?: boolean
}) {
  const sideClasses = {
    top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    right: "inset-y-0 right-0 h-full w-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right lg:max-w-sm",
    bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    left: "inset-y-0 left-0 h-full w-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:max-w-sm",
  }

  return (
    <SheetPortal data-slot="sheet-portal">
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-name={name}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          if (e.currentTarget) {
            const closeBtn = (e.currentTarget as HTMLElement).querySelector('[data-slot="sheet-close"]') as HTMLElement
            closeBtn?.focus()
          }
        }}
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-[40px] p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300 focus:outline-none focus-visible:outline-none",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        <div className="absolute top-6 right-6 lg:top-[40px] lg:right-[40px] flex items-center gap-6">
          {onToggleSelectAll && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allRowsSelected || false}
                onCheckedChange={() => onToggleSelectAll()}
                id="sheet-select-checkbox"
              />
              <Label htmlFor="sheet-select-checkbox" className="text-sm font-medium cursor-pointer">
                Auswahl
              </Label>
            </div>
          )}
          <div className="flex items-center gap-3">
            {(onPrevClick || onNextClick) && (
              <div className="flex items-center -space-x-px">
                {onPrevClick && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onPrevClick}
                    disabled={isPrevDisabled}
                    className="rounded-l-md rounded-r-none w-8 h-8 p-0"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                )}
                {onNextClick && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onNextClick}
                    disabled={isNextDisabled}
                    className="rounded-r-md rounded-l-none w-8 h-8 p-0"
                  >
                    <ChevronRight className="size-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                )}
              </div>
            )}
            {showCloseButton && (
              <DialogPrimitive.Close asChild>
                <Button
                  variant="secondary"
                  size="sm"
                data-slot="sheet-close"
                  className="w-8 h-8 p-0"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
                </Button>
              </DialogPrimitive.Close>
            )}
          </div>
        </div>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2 text-left border-t-0", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      asChild
      {...props}
    >
      <h1 className={cn("leading-none mt-2", className)}>
        {children}
      </h1>
    </DialogPrimitive.Title>
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}

