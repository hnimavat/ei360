import { DynamicProperty } from "@microsoft/sp-component-base";
import { ISharedService } from "../../../services/SharedService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IEiAccountDashboardCompetitorsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  event: DynamicProperty<any>;
  userDisplayName: string;
  sharedService: ISharedService;
  needsConfiguration: boolean;
  context: WebPartContext;
}
