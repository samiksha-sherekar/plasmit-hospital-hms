import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function isSearchLike(type: string | undefined, placeholder?: string, ariaLabel?: string) {
  const text = `${placeholder ?? ""} ${ariaLabel ?? ""}`.toLowerCase();
  return type === "search" || text.includes("search");
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, value, onChange, placeholder, "aria-label": ariaLabel, ...props }, ref) => {
  const searchLike = isSearchLike(type, placeholder, typeof ariaLabel === "string" ? ariaLabel : undefined);
  const [draftValue, setDraftValue] = React.useState(typeof value === "string" || typeof value === "number" ? String(value) : "");

  React.useEffect(() => {
    if (!searchLike) return;
    setDraftValue(typeof value === "string" || typeof value === "number" ? String(value) : "");
  }, [searchLike, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!searchLike) {
      onChange?.(event);
      return;
    }

    const nextValue = event.target.value;
    setDraftValue(nextValue);
    if (nextValue.length === 0 || nextValue.length >= 3) {
      onChange?.(event);
      return;
    }

    onChange?.({ ...event, target: { ...event.target, value: "" }, currentTarget: { ...event.currentTarget, value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <input
      type={type}
      className={cn(
        "flex h-[var(--density-control-height)] w-full rounded-lg border border-input bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/75 focus:border-ring focus:ring-2 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      value={searchLike ? draftValue : value}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
