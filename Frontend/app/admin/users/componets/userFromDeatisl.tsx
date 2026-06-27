import { useForm } from "react-hook-form";

/** Section heading with a horizontal rule */
export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex items-center gap-3 pt-4 mb-4">
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
        {title}
      </p>
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}

/**
 * Grid wrapper — 1 col on mobile, 2 on sm, 4 on lg.
 * Wrap any group of fields in this.
 */
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

/** Spans 2 of the 4 columns on desktop */
export function Half({ children }: { children: React.ReactNode }) {
  return <div className="lg:col-span-2">{children}</div>;
}
