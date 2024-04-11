import { DynamicProperty } from "@microsoft/sp-component-base";
import { ISharedService } from "../../../services/SharedService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IEiAccountDashboardUpdatesProps {
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
