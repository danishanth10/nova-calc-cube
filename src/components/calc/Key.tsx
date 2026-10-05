import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KeyVariant = "num" | "fn" | "op" | "eq" | "clr";

type Props = {
  label: ReactNode;
  ariaLabel?: string | undefined;
  variant?: KeyVariant | undefined;
  onPress: () => void;
  className?: string | undefined;
};

export const Key = memo(function Key({ label, ariaLabel, variant = "num", onPress, className }: Props) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      onClick={onPress}
      className={cn("key", variant !== "num" && `key-${variant}`, className)}
    >
      {label}
    </button>
  );
});
