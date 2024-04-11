import { DynamicProperty } from "@microsoft/sp-component-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEngagementDashboardMeetingProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  event: DynamicProperty<any>;
  meetingListName: string;
  needsConfiguration: boolean;
}
