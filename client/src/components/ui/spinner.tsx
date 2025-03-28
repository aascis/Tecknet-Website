import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block rounded-full border-2 border-solid border-current border-r-transparent animate-spin text-primary",
  {
    variants: {
      size: {
        default: "h-4 w-4 border-2",
        sm: "h-3 w-3 border-2",
        lg: "h-6 w-6 border-2",
        xl: "h-8 w-8 border-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ className, size }: SpinnerProps) {
  return (
    <div className={cn(spinnerVariants({ size }), className)} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
