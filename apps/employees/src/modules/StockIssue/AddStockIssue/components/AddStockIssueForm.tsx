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
import { InputError, CoalTypes } from "@ekosystem/ui";

import frontendStockIssueSchema, {
  BaseStockIssueSchemaType,
} from "../../../../schemas/stockIssueSchema";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import { XMarkIcon } from "@heroicons/react/24/solid";
import DistributionCentersSelect from "../../DistributionCentersSelect";
import dayjs from "dayjs";

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
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<BaseStockIssueSchemaType>({
    mode: "onChange",
    resolver: zodResolver(frontendStockIssueSchema),
    defaultValues: {
      items: [{ amount: 0, type: "ekogroszek" }],
      distributionCenterId: "",
      //@ts-ignore
      createdAt: dayjs(invoice?.createdAt).format("YYYY-MM-DDTHH:mm"),
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
    (invoice?.coalLeftToIssue || 0) -
    itemsWatch?.reduce((acc, { amount }) => acc + Number(amount), 0);

  const onSubmit = (data: BaseStockIssueSchemaType) =>
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
      <div>
        <Label htmlFor="createdAt">Data wydania</Label>
        <TextInput
          {...register("createdAt")}
          id="createdAt"
          placeholder="Data wydania"
          type="datetime-local"
        />
      </div>
      <DistributionCentersSelect {...register("distributionCenterId")} />
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <div>
            <Label htmlFor={`items.${index}.type` as const}>Rodzaj węgla</Label>
            <Select
              {...register(`items.${index}.type` as const)}
              className="w-full md:w-60"
              placeholder="Wybierz rodzaj węgla"
            >
              {CoalTypes.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
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
        Dodaj wydanie
      </Button>
    </form>
  );
}
