import { useRouter } from "next/router";
import {
  Button,
  Label,
  Select,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "@ekosystem/ui";

import Decimal from "decimal.js";
import frontendStockIssueSchema, {
  FrontendStockIssueSchemaType,
} from "../../../../schemas/stockIssueSchema";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import { useMemo } from "react";

export default function UpdateStockIssueForm({
  stockIssue,
  invoice,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getDetails"];
  invoice: RouterOutputs["stockIssues"]["checkInvoice"] | undefined;
}) {
  const router = useRouter();
  const {
    watch,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FrontendStockIssueSchemaType>({
    mode: "onChange",
    resolver: zodResolver(frontendStockIssueSchema),
    defaultValues: {
      distributionCenterId: stockIssue?.distributionCenterId || undefined,
      additionalInformation: stockIssue?.additionalInformation || undefined,
      ecoPeaCoalIssued: stockIssue?.ecoPeaCoalIssued
        ? new Decimal(stockIssue.ecoPeaCoalIssued).toNumber()
        : undefined,
      nutCoalIssued: stockIssue?.nutCoalIssued
        ? new Decimal(stockIssue.nutCoalIssued).toNumber()
        : undefined,
    },
  });

  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.stockIssues.update.useMutation();

  const {
    data: centers,
    isLoading: isLoadingCenters,
    isError: centersError,
  } = trpc.distributionCenters.getIdsAndNames.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const onSubmit = (data: FrontendStockIssueSchemaType) =>
    mutate(
      { ...data, invoiceId: invoice?.id as string, id: stockIssue.id },
      {
        onSuccess: (res) => {
          router.replace(`/stock-issues/${res.id}`);
        },
      },
    );

  const coalLeftWithoutThisStockIssue = useMemo(
    () =>
      (invoice?.coalLeftToIssue || 0) +
      new Decimal(stockIssue?.nutCoalIssued || 0).toNumber() +
      new Decimal(stockIssue?.ecoPeaCoalIssued || 0).toNumber(),
    [],
  );

  const nutCoalWatch = watch("nutCoalIssued") || 0;
  const ecoPeaCoalWatch = watch("ecoPeaCoalIssued") || 0;
  const nutCoalLeft = coalLeftWithoutThisStockIssue - ecoPeaCoalWatch;
  const ecoPeaCoalLeft = coalLeftWithoutThisStockIssue - nutCoalWatch;

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
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Label htmlFor="ecoPeaCoalIssued">Ilość węgla - groszek [Kg]</Label>
          <TextInput
            {...register("ecoPeaCoalIssued", {
              max: ecoPeaCoalLeft,
            })}
            id="ecoPeaCoalIssued"
            placeholder="Ilość węgla"
            type="number"
            helperText={`Maksymalnie do wydania: ${ecoPeaCoalLeft} kg`}
            max={ecoPeaCoalLeft}
            min={0}
          />
          <InputError error={errors?.ecoPeaCoalIssued?.message} />
        </div>
        <div className="w-full">
          <Label htmlFor="nutCoalIssued">Ilość węgla - orzech [Kg]</Label>
          <TextInput
            {...register("nutCoalIssued", {
              max: nutCoalLeft,
            })}
            id="nutCoalIssued"
            placeholder="Ilość węgla"
            type="number"
            helperText={`Maksymalnie do wydania: ${nutCoalLeft} kg`}
            max={nutCoalLeft}
            min={0}
          />
          <InputError error={errors?.nutCoalIssued?.message} />
        </div>
      </div>
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
