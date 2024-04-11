import * as React from 'react';


// Imported Components Here.
import Barchart from '../../../components/Barchart';
import Donutchart from '../../../components/Donutchart';

// import styles from './EngagementDashboardResourcing.module.scss';
import type { IEngagementDashboardResourcingProps } from './IEngagementDashboardResourcingProps';
import { Link } from '@fluentui/react';
import '../../common.css';



export interface DonutChartDataState {
  dynamicData: IChartDataPoint[];
  LeadvsEngineedynamicData: IChartDataPoint[];
  BUdynamicData: IChartDataPoint[];
  hideLabels: boolean;
  showLabelsInPercent: boolean;
  innerRadius: number;
  statusKey: number;
  statusMessage: string;
  showPopup: boolean;
  value: any;
  accountName: string;
}

import { resourceHeadcount, programList, OnsiteOffshore, donutChartData, LeadvsEngineerdonutChartData, BUdonutChartData } from './ApiData';
import { DefaultButton, Dropdown, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, ISearchBoxStyles, PrimaryButton, SearchBox, Stack, Text } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import { IChartDataPoint } from '@fluentui/react-charting';



export default class EngagementDashboardResourcing extends React.Component<IEngagementDashboardResourcingProps, DonutChartDataState, {}> {

  constructor(props: IEngagementDashboardResourcingProps) {
    super(props);
    this.state = {
      dynamicData: donutChartData,
      LeadvsEngineedynamicData: LeadvsEngineerdonutChartData,
      BUdynamicData: BUdonutChartData,
      hideLabels: true,
      showLabelsInPercent: false,
      innerRadius: 35,
      statusKey: 0,
      statusMessage: '',
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
    window.location.href = 'Engagement_Dashboard.aspx' + '?accountName=' + this.state.accountName;
  };

  public render(): React.ReactElement<IEngagementDashboardResourcingProps> {

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    const showPopup = this.state.showPopup;

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

    const rateCradImage = require('../assets/rate_card.png')

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
            <Link onClick={this.navigateToPreviousPage}>
                  ENGAGEMENT DASHBOARD
            </Link>
          </li>
          <li>{this.state.accountName} - Resourcing</li>
        </ul>
      </div>
      <section className='JCI_resourcing' >
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
            <div className="card_border_skyblue">
              <div className="header_card">
                <div className="title">Average Industry Experience (Years)</div>
              </div>
              <div className="body_card">
                <div className="title_value">3.5</div>
              </div>
            </div>
          </div>
          <div className='i-col-4 i-mb-20'>
            <div className="card_border_skyblue">
              <div className="header_card">
                <div className="title">Average Experience in Account (Years)</div>
              </div>
              <div className="body_card">
                <div className="title_value">2</div>
              </div>
            </div>
          </div>
          <div className='i-col-4 i-mb-20'>
            <a href={`ResourcingRateCard.aspx?accountName=${this.state.accountName}`} className="card_border_skyblue">
              <div className="header_card">
                <div className="title">Rate Card</div>
              </div>
              <div className="body_card">
                <div className="title_value">
                  <img src={rateCradImage}/>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className='i-row'>
          <div className='i-col-12'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Resource Headcount - Billed vs Shadow</div>
              </div>
              <div className='i-card-body '>
                <Barchart data={resourceHeadcount} hideLegend={false} />
              </div>
            </div>
          </div>
        </div>

        <div className='i-row'>
          <div className='i-col-12'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Resource Headcount - Onsite vs Offshore</div>
              </div>
              <div className='i-card-body'>
                <Barchart data={OnsiteOffshore} hideLegend={false} />
              </div>
            </div>
          </div>
        </div>

        <div className='i-row'>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header mb-0'>
                <div className='i-card-title'>Resource Headcount - Branch</div>
              </div>
              <div className='i-card-body'>
                <Donutchart data={donutChartData} />
              </div>
            </div>
          </div>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header mb-0'>
                <div className='i-card-title'>Resource Headcount - Lead vs Engineer</div>
              </div>
              <div className='i-card-body'>
                <Donutchart data={LeadvsEngineerdonutChartData} />
              </div>
            </div>
          </div>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header mb-0'>
                <div className='i-card-title'>Resource Headcount - BU </div>
              </div>
              <div className='i-card-body'>
                <Donutchart data={BUdonutChartData} />
              </div>
            </div>
          </div>
        </div>

        <div className="i-row">
          <div className='i-col-12'>
            <div className='i-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Resource Headcounts - Projects/Programs</div>
              </div>
              <div className='i-card-body'>
                <ul className='program_list'>
                  {
                    programList.map((item, index) => {
                      return (
                        <li> 
                          <a className='program_card' href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ResourcingProjectsProgramsHeadcounts.aspx">
                            <div className='card-header'>{item.title}</div>
                            <div className='card-body'>
                              <div className='offshor_box'>  
                                <label className='label'><span>Offshore</span></label>
                                <div className='label_value'>{item.offshore}</div>
                              </div>
                              <div className='onsite_box'>
                                <label className='label'><span>Onsite</span></label>
                                <div className='label_value'>{item.onsite}</div>
                              </div>
                            </div>
                          </a>
                        </li>
                      )
                    })
                  }

                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
    );
  }
}
