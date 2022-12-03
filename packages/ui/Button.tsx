import * as React from "react";
import { Button as FlowbiteButton } from "flowbite-react";

export const Button = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) => {
  return <FlowbiteButton {...rest}>{children}</FlowbiteButton>;
};
