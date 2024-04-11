import { DynamicProperty } from "@microsoft/sp-component-base";
import { ISharedService } from "../../../services/SharedService";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEiAccountDashboardFinancialsProps {
  
  width: string;
  height: string;
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  sharedService: ISharedService;
  event: DynamicProperty<any>;
  needsConfiguration: boolean;
  context:WebPartContext;
}
