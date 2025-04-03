// src/lib/utils.ts
import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge" // ← 正しいのはこちら！

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}