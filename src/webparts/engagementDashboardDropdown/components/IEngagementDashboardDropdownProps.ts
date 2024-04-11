import { ISharedService } from "../../../services/SharedService";

export interface IEngagementDashboardDropdownProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  sharedService: ISharedService;

  onEventSelected: (event: any) => void;
}
