import * as React from 'react';
// import styles from './EiAccountsTilesDetails.module.scss';
import type { IEiAccountsTilesDetailsProps } from './IEiAccountsTilesDetailsProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, FontIcon, Link, Stack, Dropdown, IDropdownOption, IDropdownStyles, IButtonStyles, Text } from '@fluentui/react';
import '../../common.css';
import styles from './EiAccountsTilesDetails.module.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import { Calendar } from 'primereact/calendar';

export interface IEiAccountsTilesDetailsState {
  showPopup: boolean;
  value: any
}

export default class EiAccountsTilesDetails extends React.Component<IEiAccountsTilesDetailsProps, IEiAccountsTilesDetailsState, {}> {
  
  constructor(props: IEiAccountsTilesDetailsProps) {
    super(props);
    
    this.state = {
      showPopup: false,
      value: ''
    };

  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  }
  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" + sourceParam;
  };

  public render(): React.ReactElement<IEiAccountsTilesDetailsProps> {

    const accountDetailData = [
      {
        clientname:'JCI',
        programs:'13',
        year:'2023',
        revenueTarget:'4,001,000',
        revenueAchieved:'3,151,142',
        teamOffshore: '64',
        teamOnsite: '0',
        digital: '',
        embedded: '',
        hardware: '',
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
      },
      {
        clientname:'Dover Digital',
        programs:'12',
        year:'2023',
        revenueTarget:'4,001,000',
        revenueAchieved:'3,151,142',
        teamOffshore: '4',
        teamOnsite: '2',
        digital: '',
        embedded: '',
        hardware: '',
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    },
    {
      clientname:'Comcast',
        programs:'4',
        year:'2023',
        revenueTarget:'4,001,000',
        revenueAchieved:'3,151,142',
        teamOffshore: '4',
        teamOnsite: '7',
        digital: '',
        embedded: '',
        hardware: '',
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    },
    {
      clientname:'Collins Aerospace',
        programs:'3',
        year:'2023',
        revenueTarget:'4,001,000',
        revenueAchieved:'3,151,142',
        teamOffshore: '1',
        teamOnsite: '4',
        digital: '',
        embedded: '',
        hardware: '',
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    },
    {
      clientname:'JCI',
        programs:'13',
        year:'2023',
        revenueTarget:'4,001,000',
        revenueAchieved:'3,151,142',
        teamOffshore: '64',
        teamOnsite: '0',
        digital: '',
        embedded: '',
        hardware: '',
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    }
    ];

    const digitalBodyTemplate = () => {
      return (
          <React.Fragment>
              <FontIcon aria-label="edit" iconName="CheckMark" className={styles.checkMark}/>
          </React.Fragment>
        );
    };

    const clientNameBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" className='p-Link'>JCI</Link>
          </React.Fragment>
        );
    };

    const projectsBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx" className='p-Link'>13</Link>
          </React.Fragment>
        );
    };

    const TeamBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ResourcingProjectsProgramsHeadcounts.aspx" className='p-Link'>13</Link>
          </React.Fragment>
        );
    };

    const options: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
    ];

    const buOptions: IDropdownOption[] = [
      { key: 'bu', text: 'BU' }
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

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };
    const showPopup = this.state.showPopup;

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
          <a onClick={this.navigateToPreviousPage}>account dashboard</a>
          </li>
          <li>account</li> 
        </ul>
      </div>
      <section className="accountOverviewSection ">
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
                        options={options}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='BU'
                        placeholder="Select BU"
                        options={buOptions}
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
        <div className='datatable-wrapper'> 
          <DataTable value={accountDetailData} scrollable>
            <Column field="Checkbox"  selectionMode="multiple" style={{ minWidth: '10px' }} className={styles.Checkbox} />
            <Column field="clientname" header="Client Name" filter body={clientNameBodyTemplate} style={{ minWidth: '200px', verticalAlign:'middle' }} ></Column>
            <Column field="programs" header="No. of Programs/Projects" filter body={projectsBodyTemplate} style={{ minWidth: '205px' }} align='right'></Column>
            <Column field="year" header="Year" filter style={{ minWidth: '75px' }} align='right'></Column>
            <Column field="revenueTarget" header="Revenue Target($)" filter style={{ minWidth: '165px' }} align='right'></Column>
            <Column field="revenueAchieved" header="Revenue Achieved($) - Nov 23" filter style={{ minWidth: '245px', verticalAlign:'middle' }} align='right'></Column>
            <Column field="teamOffshore" header="Team Offshore" filter body={TeamBodyTemplate} style={{ minWidth: '140px' }} align='right'></Column>
            <Column field="teamOnsite" header="Team Onsite" filter body={TeamBodyTemplate} style={{ minWidth: '125px' }} align='right'></Column>
            <Column field="digital" header="Digital" filter body={digitalBodyTemplate} style={{ minWidth: '88px' }} ></Column>
            <Column field="embedded" header="Embedded" filter body={digitalBodyTemplate} style={{ minWidth: '115px' }} ></Column>
            <Column field="hardware" header="Hardware" filter body={digitalBodyTemplate} style={{ minWidth: '105px' }} ></Column>
            <Column field="Aerospace" header="Aerospace" filter style={{ minWidth: '115px' }} align='right'></Column>
            <Column field="Automotive" header="Automotive" filter style={{ minWidth: '115px' }} align='right'></Column>
            <Column field="intelligentAutomation" header="Intelligent Automation" filter style={{ minWidth: '200px' }} align='right'></Column>
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
