import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEiExecutiveSummaryProps {
  riskListName: string;
  escalationListName: string;
  context: WebPartContext;
}
