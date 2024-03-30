import { twMerge } from "tailwind-merge";
import { cx } from "class-variance-authority";
import type { ClassValue } from "class-variance-authority/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}
