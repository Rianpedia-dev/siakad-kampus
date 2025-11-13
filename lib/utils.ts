import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sql } from 'drizzle-orm';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fungsi untuk menggantikan drizzle-orm's inArray dalam lingkungan client
export function inArray(field: any, values: number[]) {
  if (values.length === 0) {
    return sql`1=0`; // kondisi yang selalu salah
  }
  return sql`${field} = ANY(ARRAY[${sql.join(values, sql`, `)}])`;
}