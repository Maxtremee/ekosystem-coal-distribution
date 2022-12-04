import { ElementType } from "react";
import { ReactNode } from "react";

export default function Text({
  children,
  className,
  as: Component = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Component
      className={`text-gray-900 dark:text-gray-300${
        className !== undefined ? " " + className : ""
      }`}
    >
      {children}
    </Component>
  );
}
