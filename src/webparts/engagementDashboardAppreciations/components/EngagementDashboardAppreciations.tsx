import * as React from 'react';
//import styles from './EngagementDashboardAppreciations.module.scss';
import type { IEngagementDashboardAppreciationsProps } from './IEngagementDashboardAppreciationsProps';
import '../../common.css';
import { DefaultButton, Link, Text, Dropdown, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, Stack, PrimaryButton } from '@fluentui/react';
import Barchart from '../../../components/Barchart';
import { Calendar } from 'primereact/calendar';

export interface IEngagementDashboardAppreciationsState {
  showPopup: boolean;
  value: any;
  accountName: string;
}
export default class EngagementDashboardAppreciations extends React.Component<IEngagementDashboardAppreciationsProps, IEngagementDashboardAppreciationsState, {}> {
  
  constructor(props: IEngagementDashboardAppreciationsProps) {
    super(props);
    
    this.state = {
      showPopup: false,
      value: '',
      accountName: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for revenue :: ', accountName)

    this.setState({ accountName : accountName })
  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  } 
  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx?menu=Engagement%20Dashboard" + sourceParam;
  };
  public render(): React.ReactElement<IEngagementDashboardAppreciationsProps> {

    const showPopup = this.state.showPopup;

    const dropDownoptions: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
    ];

    const buOptions: IDropdownOption[] = [
      { key: 'digital', text: 'Digital' },
      { key: 'Embedded', text: 'Embedded' },
      { key: 'Hardware', text: 'Hardware' },
    ];
    const projectsOptions: IDropdownOption[] = [
      { key: 'all', text: 'All' },
      { key: '521_Metasys_UI-Digital', text: '521_Metasys_UI-Digital' },
      { key: '521-OBAC-Digital', text: '521-OBAC-Digital' },
      { key: '521-OBBAS-Digital', text: '521-OBBAS-Digital' },
    ];

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: {height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37},
      caretDownWrapper: {lineHeight: 37},
      dropdownItemSelected: {background: '#E7F3FF'}
    };

    const modalButton: Partial<IButtonStyles> = {
      root: {margin: '20px 0 0'}
    }

    const resourceHeadcount = [
      {
        name: 'Jan 23',
        series: [
          {            
            data: 15, 
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
          }
        ],
      },
      {
        name: 'Feb 23',
        series: [
          {
            
            data: 9,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Mar 23',
        series: [
          {
            
            data: 10,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Apr 23',
        series: [
          {
            
            data: 47,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'May 23',
        series: [
          {
            
            data: 60,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Jun 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
          }
        ],
      },
      {
        name: 'Jul 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Aug 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Sep 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Oct 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Nov 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
          }
        ],
      },
      {
        name: 'Dec 23',
        series: [
          {
            
            data: 15,
            color: "#34C38F",           
            barWidth: "20",
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/AppreciationsChartDetail.aspx";
            }
            
    
          }
        ],
      },
    ];

    let urlParams = new URLSearchParams(window.location.search);
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    console.log("opportunities tile", this.state.accountName);
     
    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
            <Link href={`${splitUrl}?accountName=${this.state.accountName}`}>
              ENGAGEMENT DASHBOARD
            </Link>
          </li>
          <li>{this.state.accountName} - Appreciations</li>
        </ul>
      </div>
      <section>
        <div className='i-header i-mb-20'>
          <div className='buttonWrapper'>
            <span className='popupFilterContainer'>
            <DefaultButton text="Filter" className='btn-outline' onClick={() => this.setState({ showPopup: true })}></DefaultButton>
              { showPopup && (
                  <div role="document" className='popupFilterWrap'>
                    <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className='modalPopupHeader'>
                      <Text className='modalPopupTitle'>Filters</Text>
                      <FontIcon aria-label="Compass" iconName="Cancel" className='popupCancelicon' onClick={() => this.setState({ showPopup: false })}/>
                    </Stack>
                    <div className='modalContent'>
                    <Stack className='formChildGap'>
                      <Dropdown
                        label='Account'
                        defaultSelectedKey="JCI"
                        options={dropDownoptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='BU'
                        defaultSelectedKey="digital"
                        options={buOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='Programs/Projects'
                        defaultSelectedKey="all"
                        options={projectsOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <div className='ms-filter'> 
                        <label htmlFor="calender">Date Range</label>
                        <Calendar id="calender" placeholder='01/01/2023 - 31/01/2024' value={this.state.value} onChange={this.handleChange} selectionMode="range" readOnlyInput />
                      </div>
                    </Stack>
                    <Stack horizontal horizontalAlign='end' className='filterButtonWrap'>
                      <DefaultButton className='btn-ghost-gray' styles={modalButton} text="Reset" ></DefaultButton>
                      <DefaultButton className='btn-ghost' styles={modalButton} text="Apply" onClick={() => this.setState({ showPopup: false })}></DefaultButton>
                    </Stack>
                    </div>
                  </div>
                )}
            </span>
            <span>
              <PrimaryButton text="Download" className='btn-primary'></PrimaryButton>
            </span>
          </div>
        </div>
      </section> 
      <div className='i-chart-card' >
        <Barchart data={resourceHeadcount} hideLegend={true}  />
      </div>
      </>
    );
  }
}
