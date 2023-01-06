import { withAuth } from "../../hoc/withAuth";
import StockIssuesList from "../../modules/StockIssuesList";

function StockIssuesPage() {
  return <StockIssuesList />;
}

export default withAuth(StockIssuesPage);
