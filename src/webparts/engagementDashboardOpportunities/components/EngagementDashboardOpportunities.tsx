import * as React from 'react';
//import styles from './EngagementDashboardOpportunities.module.scss';
import type { IEngagementDashboardOpportunitiesProps } from './IEngagementDashboardOpportunitiesProps';
import '../../common.css';
import { DefaultButton, Link, Dropdown, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, ISearchBoxStyles, PrimaryButton, SearchBox, Stack, Text } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import Piechart from '../../../components/Piechart';
import { buWiseOpportunities, skillList, totalOpportunities, dueOpportunities } from '../../engagementDashboardResourcing/components/ApiData';

export interface EngagementDashboardOpportunitiesState {
  showPopup: boolean;
  value: any;
  accountName: string;
}
export default class EngagementDashboardOpportunities extends React.Component<IEngagementDashboardOpportunitiesProps, EngagementDashboardOpportunitiesState, {}> {
  constructor(props: IEngagementDashboardOpportunitiesProps) {
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
  public render(): React.ReactElement<IEngagementDashboardOpportunitiesProps> {
    
    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };
    const showPopup = this.state.showPopup;

    const dropDownoptions: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
    ];
    const locationOptions: IDropdownOption[] = [
      { key: 'all', text: 'All' }
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
          <li>{this.state.accountName} - Opportunities</li>
        </ul>
      </div>
      <div className='accountOverviewSection'>
          <div className='blockTitleWrap i-mb-20'>
            <div className='titleWrap'>
            <SearchBox placeholder="Search" styles={searchBoxStyles} className='searchBar'/>
            </div>
            <div className='rightbar'>
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
                        <Dropdown
                          label='Location'
                          defaultSelectedKey="all"
                          options={locationOptions}
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
        </div>
        <div className='i-row'>
          <div className='i-col-4 i-mb-20'>
            <a className="card_border_skyblue" href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/OpportunitiesAverageTimeDetail.aspx">
              <div className="header_card">
                <div className="title">Average fulfilment Time</div>
              </div>
              <div className="body_card">
                <div className="title_value">3.5</div>
              </div>
            </a>
          </div>
          <div className='i-col-4 i-mb-20'>
            <a className="card_border_skyblue" href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/OpportunitiesAverageTimeDetail.aspx">
              <div className="header_card">
                <div className="title">Average fulfilment %</div>
              </div>
              <div className="body_card">
                <div className="title_value">50</div>
              </div>
            </a>
          </div>
        </div>
        <div className='i-row'>
          <div className='i-col-4'>
            <a className='i-chart-card' href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/OpportunitiesChartDetail.aspx'>
              <div className='i-card-header'>
                <div className='i-card-title'>Opportunities - Total</div>
              </div> 
              <div className='i-card-body'>
                <Piechart data={totalOpportunities} />
              </div>
            </a>
          </div>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Open Opportunities - Due</div>
              </div>
              <div className='i-card-body'>
                <Piechart data={dueOpportunities} />
              </div>
            </div>
          </div>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Open Opportunities - BU Wise</div>
              </div>
              <div className='i-card-body'>
                <Piechart data={buWiseOpportunities} />
              </div>
            </div>
          </div>
        </div>
        <div className="i-row">
          <div className='i-col-12'>
            <div className='i-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Open Opportunities - Skill Wise</div>
              </div>
              <div className='i-card-body'>
                <ul className='skill_list'>
                  {
                    skillList.map((item, index) => {
                      return (
                        <li> 
                          <div className='program_card'>
                            <div className='card-header'>{item.language}</div>
                            <div className='card-body'>
                              <div className='offshor_box'>
                                <div className='label_value'>{item.rating}</div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })
                  }

                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
