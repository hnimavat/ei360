import { ISharedService } from "../../../services/SharedService";
//import { DynamicProperty } from "@microsoft/sp-component-base";

export interface IEiAccountsOverviewProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  sharedService: ISharedService;
 
  /**
   * Determines if the web part has been connected to a dynamic data source or
   * not
   */
  //needsConfiguration_UserSelection: boolean;
    /**
   * Event handler for selecting an event in the list
   */
    onEventSelected: (event: any) => void;
}
