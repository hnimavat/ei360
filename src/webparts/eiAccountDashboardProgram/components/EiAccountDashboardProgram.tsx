import * as React from 'react';
import styles from './EiAccountDashboardProgram.module.scss';
import type { IEiAccountDashboardProgramProps } from './IEiAccountDashboardProgramProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, Link, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption, IButtonStyles } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';

export interface IEiAccountDashboardProgramState {
  showPopup: boolean;
  value: any
}
export default class EiAccountsTilesDetails extends React.Component<IEiAccountDashboardProgramProps, IEiAccountDashboardProgramState, {}> {
  
  constructor(props: IEiAccountDashboardProgramProps) {
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
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" + sourceParam;
  };


  public render(): React.ReactElement<IEiAccountDashboardProgramProps> {

    const showPopup = this.state.showPopup;
      
    const accountDetailData = [
      {
        status:'',
        accountName:'JCI',
        programs:'521 PES Client Innovation-Linux-Porting',
        EngagementType:'Project Based',
        BillingType:'FP',
        SOWStart:'10-Jan-23',
        SOWEnd:'30-Sep-24',
        AttentionRequired:'No',
        TeamOffshore:'2',
        TeamOnsite:'0',
        TechStack:'Angular, React JS',
        ClientPOC: 'Yogesh Deokar'
      },
      {
        status:'',
        accountName:'JCI',
        programs:'521 PES Client Innovation-Linux-Porting',
        EngagementType:'Project Based',
        BillingType:'FP',
        SOWStart:'10-Jan-23',
        SOWEnd:'30-Sep-24',
        AttentionRequired:'No',
        TeamOffshore:'2',
        TeamOnsite:'0',
        TechStack:'Angular, React JS',
        ClientPOC: 'Yogesh Deokar'
    },
    { 
      status:'',
      accountName:'JCI',
      programs:'521 PES Client Innovation-Linux-Porting',
      EngagementType:'Project Based',
      BillingType:'FP',
      SOWStart:'10-Jan-23',
      SOWEnd:'30-Sep-24',
      AttentionRequired:'No',
      TeamOffshore:'2',
      TeamOnsite:'0',
      TechStack:'Angular, React JS',
      ClientPOC: 'Yogesh Deokar'
    },
    {
      status:'',
      accountName:'JCI',
      programs:'521 PES Client Innovation-Linux-Porting',
      EngagementType:'Project Based',
      BillingType:'FP',
      SOWStart:'10-Jan-23',
      SOWEnd:'30-Sep-24',
      AttentionRequired:'No',
      TeamOffshore:'2',
      TeamOnsite:'0',
      TechStack:'Angular, React JS',
      ClientPOC: 'Yogesh Deokar'
    },
    {
      status:'',
      accountName:'JCI',
      programs:'521 PES Client Innovation-Linux-Porting',
      EngagementType:'Project Based',
      BillingType:'FP',
      SOWStart:'10-Jan-23',
      SOWEnd:'30-Sep-24',
      AttentionRequired:'No',
      TeamOffshore:'2',
      TeamOnsite:'0',
      TechStack:'Angular, React JS',
      ClientPOC: 'Yogesh Deokar'
    },
    {
      status:'',
      accountName:'JCI',
      programs:'521 PES Client Innovation-Linux-Porting',
      EngagementType:'Project Based',
      BillingType:'FP',
      SOWStart:'10-Jan-23',
      SOWEnd:'30-Sep-24',
      AttentionRequired:'No',
      TeamOffshore:'2',
      TeamOnsite:'0',
      TechStack:'Angular, React JS',
      ClientPOC: 'Yogesh Deokar'
    },
    {
      status:'',
      accountName:'JCI',
      programs:'521 PES Client Innovation-Linux-Porting',
      EngagementType:'Project Based',
      BillingType:'FP',
      SOWStart:'10-Jan-23',
      SOWEnd:'30-Sep-24',
      AttentionRequired:'No',
      TeamOffshore:'2',
      TeamOnsite:'0',
      TechStack:'Angular, React JS',
      ClientPOC: 'Yogesh Deokar'
    }
    ];

    const accountNameBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" className='p-Link columnWrap190'>JCI</Link>
          </React.Fragment>
        );
    };

    const programBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx'  className='p-Link columnWrap190'>521 PES Client Innovation-Linux-Porting</Link>
          </React.Fragment>
        );
    };

    const teamoffshoreBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ResourcingProjectsProgramsHeadcounts.aspx" className='p-Link'>13</Link>
          </React.Fragment>
        );
    };
    
    const statusBodyTemplate = () => {
      return (
          <React.Fragment>
              <FontIcon aria-label="status" iconName="StatusCircleInner" className={styles.statusCircleYellow}/>
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

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
          <a onClick={this.navigateToPreviousPage}>account dashboard</a>
          </li>
          <li>Programs/projects</li> 
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
            <Column field="status" header="Status" filter style={{ minWidth: '90px' }} align='center' body={statusBodyTemplate}></Column>
            <Column field="accountName" header="Account Name" filter style={{ minWidth: '205px' }} body={accountNameBodyTemplate}></Column>
            <Column field="programs" header="Programs/Projects" filter style={{ minWidth: '200px' }} body={programBodyTemplate}></Column>
            <Column field="EngagementType" header="Engagement Type" filter style={{ minWidth: '215px' }} ></Column>
            <Column field="BillingType" header="Billing Type" filter style={{ minWidth: '135px' }}></Column>
            <Column field="SOWStart" header="SOW Start Date" filter style={{ minWidth: '150px' }}></Column>
            <Column field="SOWEnd" header="SOW End Date" filter style={{ minWidth: '150px' }}></Column>
            <Column field="AttentionRequired" header="Attention Required" filter style={{ minWidth: '170px' }} ></Column>
            <Column field="TeamOffshore" header="Team Offshore" filter style={{ minWidth: '140px' }} align={'right'} body={teamoffshoreBodyTemplate}></Column>
            <Column field="TeamOnsite" header="Team Onsite" filter style={{ minWidth: '130px' }} align={'right'} body={teamoffshoreBodyTemplate}></Column>
            <Column field="TechStack" header="Tech Stack" filter style={{ minWidth: '160px' }}></Column>
            <Column field="ClientPOC" header="Client POC" filter style={{ minWidth: '190px' }}></Column>
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
