import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EngagementDashboardDropdownWebPartStrings';
import EngagementDashboardDropdown from './components/EngagementDashboardDropdown';
import { IEngagementDashboardDropdownProps } from './components/IEngagementDashboardDropdownProps';
import { getWebPartSP } from '../../services/pnpjsConfig';
import { SharedService } from '../../services/SharedService'; // Import the SharedService class
//import { DynamicProperty } from '@microsoft/sp-component-base';
//Imports For Dynamic Data 
import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';




export interface IEngagementDashboardDropdownWebPartProps {
  description: string;
}

export default class EngagementDashboardDropdownWebPart extends BaseClientSideWebPart<IEngagementDashboardDropdownWebPartProps>implements IDynamicDataCallables {

 private _selectedEvent: any;

 private _eventSelected = (event: any): void => {
   // store the currently selected event in the class variable. Required
   // so that connected component will be able to retrieve its value
   this._selectedEvent = event;
   // notify subscribers that the selected event has changed
   this.context.dynamicDataSourceManager.notifyPropertyChanged('event');
 }



/**
* Return the current value of the specified dynamic data set
* @param propertyId ID of the dynamic data set to retrieve the value for
*/

  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      { id: 'event', title: 'Event' }
    ];
  }

/**
 * Return the current value of the specified dynamic data set
 * @param propertyId ID of the dynamic data set to retrieve the value for
 */
  public getPropertyValue(propertyId: string): any {
    switch (propertyId) {
      case 'event':
        return this._selectedEvent;
    }
    throw new Error('Bad property id');
  }
  
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {

     // Use the service scope from the web part's context
const sharedService = new SharedService(this.context.serviceScope);
//const needsConfiguration_UserSelection: boolean = !this.properties.eventUserSelection.tryGetSource();
    const element: React.ReactElement<IEngagementDashboardDropdownProps> = React.createElement(
      EngagementDashboardDropdown,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        sharedService: sharedService,
        onEventSelected: this._eventSelected
       
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    getWebPartSP(this.context);
    this.context.dynamicDataSourceManager.initializeSource(this);
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
