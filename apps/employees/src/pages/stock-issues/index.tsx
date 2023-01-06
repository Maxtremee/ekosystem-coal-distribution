import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import StockIssuesList from "../../modules/StockIssuesList";

function StockIssuesPage() {
  return <StockIssuesList />;
}

export default withPageAuthRequired(StockIssuesPage);
