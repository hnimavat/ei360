import * as React from 'react';
import styles from './EngagementDashboardPrograms.module.scss';
import type { IEngagementDashboardProgramsProps } from './IEngagementDashboardProgramsProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, Link, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption, IButtonStyles } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';


export interface IEiAccountDashboardProgramState {
  showPopup: boolean;
  value: any;
  accountName: string;
}
export default class EiAccountsTilesDetails extends React.Component<IEngagementDashboardProgramsProps, IEiAccountDashboardProgramState, {}> {
  
  constructor(props: IEngagementDashboardProgramsProps) {
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
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" + sourceParam;
  };


  public render(): React.ReactElement<IEngagementDashboardProgramsProps> {

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
        ClientPOC: 'Yogesh Deokar',
        Details: 'Lorem Is The Printing...'
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
        ClientPOC: 'Yogesh Deokar',
        Details: 'Lorem Is The Printing...'
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
      ClientPOC: 'Yogesh Deokar',
      Details: 'Lorem Is The Printing...'
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
      ClientPOC: 'Yogesh Deokar',
      Details: 'Lorem Is The Printing...'
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
      ClientPOC: 'Yogesh Deokar',
      Details: 'Lorem Is The Printing...'
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
      ClientPOC: 'Yogesh Deokar',
      Details: 'Lorem Is The Printing...'
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
      ClientPOC: 'Yogesh Deokar',
      Details: 'Lorem Is The Printing...'
    }
    ];

    // const accountNameBodyTemplate = () => {
    //   return (
    //       <React.Fragment>
    //           <Link className='p-Link columnWrap190'>JCI</Link>
    //       </React.Fragment>
    //     );
    // };


    const programBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx' className='p-Link columnWrap190'>521 PES Client Innovation-Linux-Porting</Link>
          </React.Fragment>
        );
    };

    const teamoffshoreBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ResourcingProjectsProgramsHeadcounts.aspx' className='p-Link'>13</Link>
          </React.Fragment>
        );
    };
    
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

    let urlParams = new URLSearchParams(window.location.search);
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    console.log("programs tile", this.state.accountName);

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
            <Link href={`${splitUrl}?accountName=${this.state.accountName}`}>
              ENGAGEMENT DASHBOARD
            </Link>
          </li>
          <li>{this.state.accountName} - Programs</li> 
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
                        label='Programs/Projects'
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
          <Column field="Checkbox"  selectionMode="multiple" style={{ minWidth: '10px' }} className={styles.Checkbox} />
            <Column field="programs" header="Programs/Projects" filter style={{ minWidth: '200px' }} body={programBodyTemplate}></Column>
            <Column field="EngagementType" header="Engagement Type" filter style={{ minWidth: '215px' }} ></Column>
            <Column field="BillingType" header="Billing Type" filter style={{ minWidth: '135px' }}></Column>
            <Column field="TeamOffshore" header="Team Onsite " filter style={{ minWidth: '140px' }} align={'right'} body={teamoffshoreBodyTemplate}></Column>
            <Column field="TeamOnsite" header="Team Offshore" filter style={{ minWidth: '145px' }} align={'right'} body={teamoffshoreBodyTemplate}></Column>
            <Column field="TechStack" header="Tech Stack" filter style={{ minWidth: '160px' }}></Column>
            <Column field="ClientPOC" header="Client POC" filter style={{ minWidth: '190px' }}></Column>
            <Column field="Details" header="Details" filter style={{ minWidth: '190px' }}></Column>
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
