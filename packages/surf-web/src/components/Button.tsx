import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex w-full items-center gap-x-2 rounded-md text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4 py-2",
      },
      active: {
        default: "",
        info: "bg-primary/90 text-primary-foreground hover:bg-primary hover:text-background",
        success: "bg-green-500 text-white hover:bg-green-600 hover:text-white",
        failure: "bg-red-500 text-white hover:bg-red-600 hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  variant,
  size,
  children,
  className,
  active,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, active, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
