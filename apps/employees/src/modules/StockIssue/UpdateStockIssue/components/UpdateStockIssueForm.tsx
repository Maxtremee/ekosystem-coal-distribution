import { useRouter } from "next/router";
import {
  Button,
  Label,
  Select,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "@ekosystem/ui";

import Decimal from "decimal.js";
import frontendStockIssueSchema, {
  BaseStockIssueSchemaType,
} from "../../../../schemas/stockIssueSchema";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import { ChangeEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function UpdateStockIssueForm({
  stockIssue,
  invoice,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getDetails"];
  invoice: RouterOutputs["stockIssues"]["checkInvoice"] | undefined;
}) {
  const router = useRouter();
  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.stockIssues.update.useMutation();

  const {
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<BaseStockIssueSchemaType>({
    mode: "onChange",
    resolver: zodResolver(frontendStockIssueSchema),
    defaultValues: {
      distributionCenterId: stockIssue?.distributionCenterId || undefined,
      additionalInformation: stockIssue?.additionalInformation || undefined,
      items: stockIssue?.items.map(({ amount, type }) => ({
        type,
        amount: new Decimal(amount).toNumber(),
      })),
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
  const coalLeftToIssue =
    (invoice?.coalLeftToIssue || 0) +
    stockIssue.coalIssued -
    itemsWatch.reduce((acc, { amount }) => acc + Number(amount), 0);
  const itemsMaxCoal = itemsWatch.map(
    ({ amount }) => coalLeftToIssue + Number(amount),
  );

  const {
    data: centers,
    isLoading: isLoadingCenters,
    isError: centersError,
  } = trpc.distributionCenters.getIdsAndNames.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const onSubmit = (data: BaseStockIssueSchemaType) =>
    mutate(
      { ...data, invoiceId: invoice?.id as string, id: stockIssue.id },
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
      <div>
        <Label htmlFor="search">Wydane przez</Label>
        <Select
          {...register("distributionCenterId")}
          id="distributionCenterId"
          placeholder="Wybierz skup węgla"
          disabled={isLoadingCenters || centersError || centers?.length < 1}
        >
          {centers?.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <div>
            <Label htmlFor={`items.${index}.type` as const}>Rodzaj węgla</Label>
            <Select
              {...register(`items.${index}.type` as const)}
              className="w-full md:w-60"
              placeholder="Wybierz rodzaj węgla"
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
              max={itemsMaxCoal[index]}
              helperText={`Pozostało do wydania: ${coalLeftToIssue} kg`}
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
      <div className="w-full">
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
        Aktualizuj wydanie
      </Button>
    </form>
  );
}
