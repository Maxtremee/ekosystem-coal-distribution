import { Flowbite } from "flowbite-react";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <Flowbite
      theme={{
        theme: {
          toggleSwitch: {
            toggle: {
              checked: {
                color: {
                  success: "bg-[#44b91b] border-[#44b91b]",
                },
              },
            },
          },
          spinner: {
            color: {
              success: "fill-[#44b91b]",
            },
          },
          button: {
            color: {
              success:
                "text-white bg-[#44b91b] border border-transparent hover:bg-[#349d13] focus:ring-4 focus:ring-[#dbfacd] disabled:hover:bg-[#44b91b]",
            },
          },
        },
      }}
    >
      {children}
    </Flowbite>
  );
}
