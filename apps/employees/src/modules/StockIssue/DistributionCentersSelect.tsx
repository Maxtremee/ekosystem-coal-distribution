import { Label, Select, SelectProps } from "flowbite-react";
import { forwardRef, Ref } from "react";
import { trpc } from "../../utils/trpc";

export const DistributionCentersSelect = forwardRef(
  (
    props: Omit<SelectProps, "id" | "placeholder" | "disabled">,
    ref: Ref<HTMLSelectElement> | undefined,
  ) => {
    const {
      data: centers,
      isLoading: isLoadingCenters,
      isError: centersError,
    } = trpc.distributionCenters.getIdsAndNames.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

    return (
      <div>
        <Label htmlFor="search">Wydane przez</Label>
        <Select
          ref={ref}
          {...props}
          id="distributionCenterId"
          placeholder="Wybierz skup węgla"
          disabled={isLoadingCenters || centersError || centers?.length < 1}
        >
          <option value={""}>-</option>
          {centers?.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      </div>
    );
  },
);

DistributionCentersSelect.displayName = "DistributionCentersSelect";

export default DistributionCentersSelect;
