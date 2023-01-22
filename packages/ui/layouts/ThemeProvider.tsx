import { Flowbite } from "flowbite-react";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <Flowbite>{children}</Flowbite>;
}
