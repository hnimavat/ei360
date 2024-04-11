import { DynamicProperty } from "@microsoft/sp-component-base";
import { ISharedService } from "../../../services/SharedService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IEiAccountDashboardCustomerStakeholdersProps {
  event: DynamicProperty<any>;
  needsConfiguration: any;
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  sharedService: ISharedService;
  userDisplayName: string;
  context:WebPartContext;
}
