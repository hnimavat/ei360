import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISharedService } from "../../../services/SharedService";
import { DynamicProperty } from "@microsoft/sp-component-base";

export interface IEiAccountDashboardDivisionsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  event: DynamicProperty<any>;
  sharedService: ISharedService;
  needsConfiguration: boolean;
  context: WebPartContext;
}
