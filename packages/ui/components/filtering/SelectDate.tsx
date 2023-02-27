import { Label, TextInput } from "flowbite-react";
import { UseFilteringReturn } from "../../hooks/useFiltering";

export function SelectDate({
  registerAfter,
  registerBefore,
}: {
  registerBefore?: ReturnType<UseFilteringReturn["register"]>;
  registerAfter?: ReturnType<UseFilteringReturn["register"]>;
}) {
  const after = registerAfter && (
    <div>
      <Label htmlFor="after">Po</Label>
      <TextInput
        id="after"
        className="w-full md:w-32"
        type="date"
        max={registerBefore?.value}
        {...registerAfter}
      />
    </div>
  );
  const before = registerBefore && (
    <div>
      <Label htmlFor="before">Przed</Label>
      <TextInput
        id="before"
        className="w-full md:w-32"
        type="date"
        min={registerAfter?.value}
        {...registerBefore}
      />
    </div>
  );
  return (
    <>
      {after}
      {before}
    </>
  );
}
