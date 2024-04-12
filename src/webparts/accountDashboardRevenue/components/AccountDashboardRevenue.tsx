import * as React from 'react';
import type { IAccountDashboardRevenueProps } from './IAccountDashboardRevenueProps';
import { DefaultButton, PrimaryButton, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption, IButtonStyles, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import '../../common.css';
import { Calendar } from 'primereact/calendar';
import Barchart from '../../../components/Barchart';

export interface IAccountDashboardRevenueState {
  showPopup: boolean;
  value: any
}

export default class AccountDashboardRevenue extends React.Component<IAccountDashboardRevenueProps, IAccountDashboardRevenueState, {}> {
  
  constructor(props: IAccountDashboardRevenueProps) {
    super(props);
    
    this.state = {
      showPopup: false,
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);

  }
  handleChange(event: any) {
    this.setState({value: event.target.value});
  }
  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx" + sourceParam;
  };
  
  public render(): React.ReactElement<IAccountDashboardRevenueProps> {

    const showPopup = this.state.showPopup;

    const chartPoints = [
      {
        name:'Jan 23',
        series:[
          {
            key: 'series1',
            data: 10000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 15000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Feb 23',
        series:[
          {
            key: 'series1',
            data: 10000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 16000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Mar 23',
        series:[
          {
            key: 'series1',
            data: 15000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 17000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Apr 23',
        series:[
          {
            key: 'series1',
            data: 17000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 18000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'May 23',
        series:[
          {
            key: 'series1',
            data: 18000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 19000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Jun 23',
        series:[
          {
            key: 'series1',
            data: 38000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 20000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Jul 23',
        series:[
          {
            key: 'series1',
            data: 19000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 21000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Aug 23',
        series:[
          {
            key: 'series1',
            data: 21000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 22000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Sep 23',
        series:[
          {
            key: 'series1',
            data: 22000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 23000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Oct 23',
        series:[
          {
            key: 'series1',
            data: 23000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 24000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      },
      {
        name:'Nov 23',
        series:[
          {
            key: 'series1',
            data: 20000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            },
          },
          {
            key: 'series2',
            data: 25000,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }
          },
          {
            key: 'series3',
            data: 0,
            color: '#0959F5',
            legend: 'Forecast',
          }
        ]
      },
      {
        name:'Dec 23',
        series:[
          {
            key: 'series1',
            data: 19000,
            color: '#01B818',
            legend: 'Actual',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series2',
            data: 0,
            color: '#F1B44C',
            legend: 'Target',
            onClick: () => {
              window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ActualRevenue.aspx";
            }},
          {
            key: 'series3',
            data: 27000,
            color: '#0959F5',
            legend: 'Forecast'}
        ]
      } 
    ];

    const dropDownoptions: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
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

    const siteoptions: IChoiceGroupOption[] = [
      { key: 'offshore', text: 'Offshore' },
      { key: 'onsite', text: 'Onsite' },
      { key: 'both', text: 'Both' },
    ];   

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
          <a onClick={this.navigateToPreviousPage}>ACCOUNT DASHBOARD</a>
          </li>
          <li>REVENUE</li>
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
                    placeholder='Select Account'
                    options={dropDownoptions}
                    styles={dropdownStyles}
                    className='droupdown'
                  /> 
                  <div className='ms-filter'> 
                    <label htmlFor="calender">Date Range</label>
                    <Calendar id="calender" placeholder='01/01/2023 - 31/01/2024' value={this.state.value} onChange={this.handleChange} selectionMode="range" readOnlyInput />
                  </div> 
                  <ChoiceGroup defaultSelectedKey="offshore" options={siteoptions} label="Site" />
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
      <div className='i-chart-card' style={{ width : "100%" }} >
          <Barchart data={chartPoints} hideLegend={false} />
      </div>

      
      </>
    );
  }
}

