import * as React from 'react';
import styles from './EngagementDashboardResourcingProjectsProgramsHeadcounts.module.scss';
import type { IEngagementDashboardResourcingProjectsProgramsHeadcountsProps } from './IEngagementDashboardResourcingProjectsProgramsHeadcountsProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption, IButtonStyles } from '@fluentui/react';
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
export default class EiAccountsTilesDetails extends React.Component<IEngagementDashboardResourcingProjectsProgramsHeadcountsProps, IEiAccountDashboardProgramState, {}> {
  
  constructor(props: IEngagementDashboardResourcingProjectsProgramsHeadcountsProps) {
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
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" + sourceParam;
  };



  public render(): React.ReactElement<IEngagementDashboardResourcingProjectsProgramsHeadcountsProps> {

    const showPopup = this.state.showPopup;
      
    const accountDetailData = [
      {
        status:'',
        accountName:'A Shaik',        
        Employeecode: '157493',
        BU: 'Digital',
        Designation: 'Senior Engineer (Level 2)',
        Branch: 'Ahmedabad',
        TotalExp:'10.5',
        BillingStatus:'Billed',
        ProjectName:'521_Connect Gateway App Porting',
        ProjectCode: 'OT/U21/521',
        BillingType: 'T & M Projects',
        AllocationUnit:'100',
        PrimarySkill:'Power Shell',
        SecondarySkill: 'Jenkins,.Net Core'
        




      },
      {
        status:'',
        accountName:'A Shaik',        
        Employeecode: '157493',
        BU: 'Digital',
        Designation: 'Senior Engineer (Level 2)',
        Branch: 'Ahmedabad',
        TotalExp:'10.5',
        BillingStatus:'Billed',
        ProjectName:'521_Connect Gateway App Porting',
        ProjectCode: 'OT/U21/521',
        BillingType: 'T & M Projects',
        AllocationUnit:'100',
        PrimarySkill:'Power Shell',
        SecondarySkill: 'Jenkins,.Net Core'
    },
    { 
      status:'',
        accountName:'A Shaik',        
        Employeecode: '157493',
        BU: 'Digital',
        Designation: 'Senior Engineer (Level 2)',
        Branch: 'Ahmedabad',
        TotalExp:'10.5',
        BillingStatus:'Billed',
        ProjectName:'521_Connect Gateway App Porting',
        ProjectCode: 'OT/U21/521',
        BillingType: 'T & M Projects',
        AllocationUnit:'100',
        PrimarySkill:'Power Shell',
        SecondarySkill: 'Jenkins,.Net Core'
    },
    {
      status:'',
        accountName:'A Shaik',        
        Employeecode: '157493',
        BU: 'Digital',
        Designation: 'Senior Engineer (Level 2)',
        Branch: 'Ahmedabad',
        TotalExp:'10.5',
        BillingStatus:'Billed',
        ProjectName:'521_Connect Gateway App Porting',
        ProjectCode: 'OT/U21/521',
        BillingType: 'T & M Projects',
        AllocationUnit:'100',
        PrimarySkill:'Power Shell',
        SecondarySkill: 'Jenkins,.Net Core'
    },
    
    
    ];

    //  const accountNameBodyTemplate = () => {
    //    return (
    //        <React.Fragment>
    //            <Link className='p-Link columnWrap190'>JCI</Link>
    //        </React.Fragment>
    //      );
    //  };


    // const programBodyTemplate = () => {
    //   return (
    //       <React.Fragment>
    //           <Link className='p-Link columnWrap190'>521 PES Client Innovation-Linux-Porting</Link>
    //       </React.Fragment>
    //     );
    // };

    // const teamoffshoreBodyTemplate = () => {
    //   return (
    //       <React.Fragment>
    //           <Link className='p-Link'>13</Link>
    //       </React.Fragment>
    //     );
    // };
    
    // const statusBodyTemplate = () => {
    //   return (
    //       <React.Fragment>
    //           <FontIcon aria-label="status" iconName="StatusCircleInner" className={styles.statusCircleYellow}/>
    //       </React.Fragment>
    //     );
    // };

    // const CheckboxBodyTemplate = () => {
    //   const [isChecked, setIsChecked] = React.useState(false);
    
    //   const handleCheckboxChange = () => {
    //     setIsChecked(!isChecked);
    //   };
    
    //   return (
    //     <React.Fragment>
    //       <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
    //     </React.Fragment>
    //   );
    // };
    
    const options: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
    ];

    const buOptions: IDropdownOption[] = [
      { key: 'All', text: 'All' }
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
          <a href='javascript:void(0)' onClick={this.navigateToPreviousPage}>engagement dashboard</a>
          </li>
          <li >
          <a href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardResourcing.aspx' >JCI - RESOURCING</a>
          </li> 
          <li>521_connect gateway app porting</li> 
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
                        label='Location'
                        placeholder="All"
                        options={buOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='Programs/Projects'
                        placeholder="521_Connect Gateway App Porting"
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
            <Column field="Employeecode" header="Employee Code" filter style={{ minWidth: '200px' }} align={'right'}></Column>
            <Column field="accountName" header="Account Name" filter style={{ minWidth: '215px' }}  ></Column>
            <Column field="BU" header="BU" filter style={{ minWidth: '135px' }}></Column>
            <Column field="Designation" header="Designation" filter style={{ minWidth: '180px' }} ></Column>
            <Column field="Branch" header="Branch" filter style={{ minWidth: '145px' }}></Column>
            <Column field="TotalExp" header="Total Exp.(Years)" filter style={{ minWidth: '180px' }} align={'right'}></Column>
            <Column field="BillingStatus" header="Billing Status" filter style={{ minWidth: '190px' }}></Column>
            <Column field="ProjectName" header="Project Name" filter style={{ minWidth: '250px' }}></Column>
            <Column field="ProjectCode" header="Project Code" filter style={{ minWidth: '190px' }}></Column>
            <Column field="BillingType" header="Billing Type" filter style={{ minWidth: '190px' }}></Column>
            <Column field="AllocationUnit" header="Allocation Unit" filter style={{ minWidth: '190px' }} align={'right'}></Column>
            <Column field="PrimarySkill" header="Primary Skill" filter style={{ minWidth: '190px' }}></Column>
            <Column field="SecondarySkill" header="Secondary Skill" filter style={{ minWidth: '190px' }}></Column>
            
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
