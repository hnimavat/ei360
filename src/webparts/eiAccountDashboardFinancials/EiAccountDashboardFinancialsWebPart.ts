import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDynamicField,
  PropertyPaneDynamicFieldSet
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, IWebPartPropertiesMetadata, WebPartContext } from '@microsoft/sp-webpart-base';
import { DynamicProperty, IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EiAccountDashboardFinancialsWebPartStrings';
import EiAccountDashboardFinancials from './components/EiAccountDashboardFinancials';
import { IEiAccountDashboardFinancialsProps } from './components/IEiAccountDashboardFinancialsProps';
import { getWebPartSP } from '../../services/pnpjsConfig';
//import { ServiceScope } from '@microsoft/sp-core-library';
import { SharedService } from '../../services/SharedService'; // Import the SharedService class
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';





export interface IEiAccountDashboardFinancialsWebPartProps {
  description: string;
  width: string; // Example: '300px'
  height: string; // Example: '200px'
  event: DynamicProperty<any>;
  context: WebPartContext;
}

export default class EiAccountDashboardFinancialsWebPart extends BaseClientSideWebPart<IEiAccountDashboardFinancialsWebPartProps> implements IDynamicDataCallables {
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [

    ];
  }
  /**
* Return the current value of the specified dynamic data set
* @param propertyId ID of the dynamic data set to retrieve the value for
*/
  public getPropertyValue(propertyId: string): any {
    // switch (propertyId) {
    //   case 'renderedAssets':
    //     return this._selectedEvent;
    //     case 'personalizeData':
    //       return this._selectedPersonalizeEvent;
    // }
    console.log(propertyId);
    //throw new Error('Bad property id');
  }
  //Methods To Configure This Webpart As Source Webpart to Search Box Webpart - END


  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const needsConfiguration: boolean = !this.properties.event.tryGetSource();
    // Use the service scope from the web part's context
    const sharedService = new SharedService(this.context.serviceScope);
    console.log("this.properties.event financne", this.properties.event);
    const element: React.ReactElement<IEiAccountDashboardFinancialsProps> = React.createElement(
      EiAccountDashboardFinancials,
      {
        event: this.properties.event,
        description: this.properties.description,
        width: this.properties.width,
        height: this.properties.height,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        sharedService: sharedService,
        needsConfiguration: needsConfiguration,
        context: this.context
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


  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      'event': {
        dynamicPropertyType: 'object'
      }
    };
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


  protected get disableReactivePropertyChanges(): boolean {
    return true;
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
                PropertyPaneDynamicFieldSet({
                  label: 'Select event source',
                  fields: [
                    PropertyPaneDynamicField('event', {
                      label: 'Event source'
                    })
                  ]
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('height', {
                  label: strings.HeightFieldLabel
                }),
                PropertyPaneTextField('width', {
                  label: strings.WidthFieldLabel
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
