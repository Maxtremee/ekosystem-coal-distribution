import { useRouter } from "next/router";
import {
  Button,
  Label,
  Spinner,
  Textarea,
  TextInput,
  Select,
} from "flowbite-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "@ekosystem/ui";
import { RouterOutputs, trpc } from "../../../utils/trpc";
import baseAddStockIssueSchema, {
  BaseAddStockIssueSchemaType,
} from "../../../schemas/addStockIssueSchema";
import { ChangeEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function AddStockIssueForm({
  invoice,
}: {
  invoice: RouterOutputs["stockIssues"]["checkInvoice"] | undefined;
}) {
  const router = useRouter();
  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.stockIssues.add.useMutation();

  const {
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<BaseAddStockIssueSchemaType>({
    mode: "onChange",
    resolver: zodResolver(baseAddStockIssueSchema),
    defaultValues: {
      items: [{ amount: 0, type: "ekogroszek" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
    rules: {
      minLength: 1,
    },
  });

  const itemsWatch = watch("items");
  const coalLeft =
    (invoice?.coalLeftToIssue || 0) -
    itemsWatch.reduce((acc, { amount }) => acc + Number(amount), 0);

  const onSubmit = (data: BaseAddStockIssueSchemaType) =>
    mutate(
      { ...data, invoiceId: invoice?.id as string },
      {
        onSuccess: (res) => {
          router.replace(`/stock-issues/${res.id}`);
        },
      },
    );

  return (
    <form
      className={`flex w-full flex-col gap-4 transition-opacity ${
        !invoice?.id && "pointer-events-none opacity-50"
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <div>
            <Label htmlFor={`items.${index}.type` as const}>Rodzaj węgla</Label>
            <Select
              id={`items.${index}.type` as const}
              className="w-full md:w-60"
              placeholder="Wybierz rodzaj węgla"
              value={field.type}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setValue(`items.${index}.type`, event.currentTarget.value)
              }
            >
              <option value="ekogroszek">Ekogroszek</option>
              <option value="orzech">Orzech</option>
              <option value="inny">Inny</option>
            </Select>
          </div>
          <div>
            <Label htmlFor={`items.${index}.amount` as const}>Ilość [kg]</Label>
            <TextInput
              {...register(`items.${index}.amount` as const)}
              id={`items.${index}.amount`}
              placeholder="Ilość węgla"
              type="number"
              min={0}
              helperText={`Pozostało do wydania: ${coalLeft} kg`}
            />
          </div>
          <Button
            color="failure"
            className="mt-6"
            onClick={() => remove(index)}
          >
            <XMarkIcon height={20} />
          </Button>
        </div>
      ))}
      <Button
        className="w-32"
        onClick={() => append({ amount: 0, type: "ekogroszek" })}
      >
        Dodaj towar
      </Button>
      <div>
        <Label htmlFor="additionalInformation">
          Dodatkowe informacje (opcjonalnie)
        </Label>
        <Textarea
          {...register("additionalInformation")}
          id="additionalInformation"
          placeholder="Dodatkowe informacje"
          rows={3}
        />
        <InputError error={errors?.additionalInformation?.message} />
      </div>
      <InputError error={mutationError?.message} />
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Akceptuj
      </Button>
    </form>
  );
}
