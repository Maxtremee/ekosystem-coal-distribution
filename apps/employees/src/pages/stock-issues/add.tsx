import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Card } from "flowbite-react";
import AddStockIssue from "../../modules/StockIssue/AddStockIssue";

function AddStockIssuePage() {
  return (
    <Card>
      <AddStockIssue />
    </Card>
  );
}

export default withPageAuthRequired(AddStockIssuePage);
