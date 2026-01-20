import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn(
        // Layout
        "w-full caption-bottom border-separate border-spacing-0 align-middle",
        // Typography
        "text-[0.92rem] leading-relaxed font-anek-tamil text-foreground",
        // Visual
        "bg-background rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        // Focus ring for keyboard navigation
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      // Subtle bottom divider for the header area
      "[&_tr]:border-b [&_tr]:border-border/80",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      // Remove trailing hard borders; rows handle their own separation
      "[&_tr:last-child]:border-b-0",
      className,
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border/70 bg-muted/40 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      // Subtle row separator
      "border-b border-border/40",
      // Default background tuned to app palette (light: subtle; dark: subtle)
      "bg-background",
      // Improve UX with clear hover and selected states
      "transition-colors",
      "hover:bg-accent/40",
      "data-[state=selected]:bg-primary/5 data-[state=selected]:border-primary/60",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      // Spacing and layout
      "h-11 px-4 first:rounded-tl-xl last:rounded-tr-xl",
      "text-left align-middle",
      // Typography consistent with app
      "text-[0.78rem] font-semibold tracking-[0.04em] uppercase",
      // Color aligned with muted-foreground and accent border
      "text-muted-foreground/90",
      // Subtle backdrop
      "bg-secondary/70",
      // Dense numeric layout support
      "tabular-nums",
      // No extra padding when containing checkbox
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      // Comfortable, consistent padding
      "px-4 py-3 align-middle",
      // Better readability for long Tamil/English mixed text
      "text-[0.9rem] leading-relaxed text-foreground/95 font-anek-tamil",
      // Numeric readability
      "tabular-nums",
      // Respect checkbox layout when present
      "[&:has([role=checkbox])]:pr-0",
      // Focus outline support when cell is interactive
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-3 text-xs text-muted-foreground/90 text-left",
      "leading-snug",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
