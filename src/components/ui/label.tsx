import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100 flex items-center gap-1 cursor-pointer select-none",
          className,
        )}
        {...props}
      >
        {children}
        {required && <span className="text-rose-500">*</span>}
      </label>
    );
  },
);

Label.displayName = "Label";
