//class-variance-authority only has type.d.ts file. And vite does not allow reading .d.ts file
//In HhlmFieldTitle: import { ClassValue } from 'class-variance-authority/dist/types';

declare module "class-variance-authority/dist/types" {
  import type * as CLSX from "clsx";
  
  export type ClassPropKey = "class" | "className";
  export type ClassValue = CLSX.ClassValue;
  export type ClassProp = {
    class: ClassValue;
    className?: never;
  } | {
    class?: never;
    className: ClassValue;
  } | {
    class?: never;
    className?: never;
  };
  export type OmitUndefined<T> = T extends undefined ? never : T;
  export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;
}
