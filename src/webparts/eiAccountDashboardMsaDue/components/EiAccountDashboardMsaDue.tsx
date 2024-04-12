import * as React from 'react';
// import styles from './EiAccountsTilesDetails.module.scss';
import type { IEiAccountDashboardMsaDueProps } from './IEiAccountDashboardMsaDueProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, Link, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption, IButtonStyles } from '@fluentui/react';
import '../../common.css';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';

export interface IEiAccountDashboardMsaDueState {
  showPopup: boolean;
  value: any
}

export default class EiAccountsTilesDetails extends React.Component<IEiAccountDashboardMsaDueProps, IEiAccountDashboardMsaDueState, {}> {
  
  constructor(props: IEiAccountDashboardMsaDueProps) {
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


  public render(): React.ReactElement<IEiAccountDashboardMsaDueProps> {

    const showPopup = this.state.showPopup;

    const accountDetailData = [
      {
        duedays:'12',
        AccountName:'JCI',
        ProgramsProjects:'521-OBBAS-DIGITAL',
        SOWNo:'Umbrella',
        SOWStartDate:'10-Jan-23',
        SOWEndDate:'30-Sep-24',
        SOWValue:'129,024.00',
        MSAExpiryDate:'31-Dec-2024',
        Shortfall:'2 Days',
        PONo:'7400023357',
        POValue:'32,256.00',
        POStartDate:'1-Oct-2023',
        POEndDate:'31-Dec-2023',
        PendingPOvalueasontoday:'-',
        OwnerforRenewal:'Darshik Gajjar'
      },
      {
        duedays:'15',
        AccountName:'JCI',
        ProgramsProjects:'521-OBBAS-DIGITAL',
        SOWNo:'Umbrella',
        SOWStartDate:'10-Jan-23',
        SOWEndDate:'30-Sep-24',
        SOWValue:'129,024.00',
        MSAExpiryDate:'31-Dec-2024',
        Shortfall:'2 Days',
        PONo:'7400023357',
        POValue:'32,256.00',
        POStartDate:'1-Oct-2023',
        POEndDate:'31-Dec-2023',
        PendingPOvalueasontoday:'-',
        OwnerforRenewal:'Darshik Gajjar'
    },
    {
      duedays:'21',
        AccountName:'JCI',
        ProgramsProjects:'521-OBBAS-DIGITAL',
        SOWNo:'Umbrella',
        SOWStartDate:'10-Jan-23',
        SOWEndDate:'30-Sep-24',
        SOWValue:'129,024.00',
        MSAExpiryDate:'31-Dec-2024',
        Shortfall:'2 Days',
        PONo:'7400023357',
        POValue:'32,256.00',
        POStartDate:'1-Oct-2023',
        POEndDate:'31-Dec-2023',
        PendingPOvalueasontoday:'-',
        OwnerforRenewal:'Darshik Gajjar'
    },
    {
      duedays:'23',
        AccountName:'JCI',
        ProgramsProjects:'521-OBBAS-DIGITAL',
        SOWNo:'Umbrella',
        SOWStartDate:'10-Jan-23',
        SOWEndDate:'30-Sep-24',
        SOWValue:'129,024.00',
        MSAExpiryDate:'31-Dec-2024',
        Shortfall:'2 Days',
        PONo:'7400023357',
        POValue:'32,256.00',
        POStartDate:'1-Oct-2023',
        POEndDate:'31-Dec-2023',
        PendingPOvalueasontoday:'-',
        OwnerforRenewal:'Darshik Gajjar'
    },
    {
      duedays:'31',
      AccountName:'JCI',
      ProgramsProjects:'521-OBBAS-DIGITAL',
      SOWNo:'Umbrella',
      SOWStartDate:'10-Jan-23',
      SOWEndDate:'30-Sep-24',
      SOWValue:'129,024.00',
      MSAExpiryDate:'31-Dec-2024',
      Shortfall:'2 Days',
      PONo:'7400023357',
      POValue:'32,256.00',
      POStartDate:'1-Oct-2023',
      POEndDate:'31-Dec-2023',
      PendingPOvalueasontoday:'-',
      OwnerforRenewal:'Darshik Gajjar'
    },
    {
      duedays:'34',
      AccountName:'JCI',
      ProgramsProjects:'521-OBBAS-DIGITAL',
      SOWNo:'Umbrella',
      SOWStartDate:'10-Jan-23',
      SOWEndDate:'30-Sep-24',
      SOWValue:'129,024.00',
      MSAExpiryDate:'31-Dec-2024',
      Shortfall:'2 Days',
      PONo:'7400023357',
      POValue:'32,256.00',
      POStartDate:'1-Oct-2023',
      POEndDate:'31-Dec-2023',
      PendingPOvalueasontoday:'-',
      OwnerforRenewal:'Darshik Gajjar'
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
              <Link href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx' className='p-Link columnWrap200'>521 PES Client Innovation-Linux-Porting</Link>
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
          <li>msa/sow/pos due</li> 
        </ul>
      </div>
      <section className="accountOverviewSection ">
        <div className='blockTitleWrap i-mb-20'>
          <div className='titleWrap  d-flex i-gap-10'>
          <SearchBox placeholder="Search" styles={searchBoxStyles} className='searchBar'/>
          </div>
          <div className='rightbar'>
          <span>
            <DefaultButton text="Send Notification" className='btn-outline'></DefaultButton>
          </span>
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
                        defaultSelectedKey='JCI'
                        options={options}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='View By'
                        placeholder='Common'
                        options={options}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='BU' 
                        placeholder="All"
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
          <Column selectionMode="multiple" style={{ minWidth: '50px' }} align='center'></Column>
            <Column field="duedays" header="Due Days" filter style={{ minWidth: '110px' }} align={'right'}></Column>
            <Column field="AccountName" header="Account Name" filter style={{ minWidth: '200px' }} body={accountNameBodyTemplate}></Column>
            <Column field="ProgramsProjects" header="Programs/Projects" filter style={{ minWidth: '215px' }} body={programBodyTemplate}></Column>
            <Column field="SOWNo" header="SOW No." filter style={{ minWidth: '135px' }}></Column>
            <Column field="SOWStartDate" header="SOW Start Date" filter style={{ minWidth: '150px' }} ></Column>
            <Column field="SOWEndDate" header="SOW End Date" filter style={{ minWidth: '150px' }} ></Column>
            <Column field="SOWValue" header="SOW Value($)" filter style={{ minWidth: '170px' }} align='right'></Column>
            <Column field="MSAExpiryDate" header="MSA Expiry Date" filter style={{ minWidth: '150px' }} ></Column>
            <Column field="Shortfall" header="Shortfall" filter style={{ minWidth: '130px' }}></Column>
            <Column field="PONo" header="PO No." filter style={{ minWidth: '160px' }} align='right'></Column>
            <Column field="POValue" header="PO Value($)" filter style={{ minWidth: '190px' }} align='right'></Column>
            <Column field="POStartDate" header="PO Start Date" filter style={{ minWidth: '190px' }}></Column>
            <Column field="POEndDate" header="PO End Date" filter style={{ minWidth: '190px' }} ></Column>
            <Column field="PendingPOvalueasontoday" header="Pending PO value as on today" filter style={{ minWidth: '250px' }}></Column>
            <Column field="OwnerforRenewal" header="Owner for Renewal" filter style={{ minWidth: '250px' }}></Column>
            
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
