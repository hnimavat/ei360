import * as React from 'react';
import styles from './EngagementDashboardBusinvolved.module.scss';
import type { IEngagementDashboardBusinvolvedProps } from './IEngagementDashboardBusinvolvedProps';
import { DefaultButton, Link, Text, Dropdown, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, ISearchBoxStyles, PrimaryButton, SearchBox, Stack } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../common.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';


export interface IEngagementDashboardBusinvolvedState {
  showPopup: boolean;
  value: any
  accountName: string;
}
export default class EngagementDashboardBusinvolved extends React.Component<IEngagementDashboardBusinvolvedProps, IEngagementDashboardBusinvolvedState, {}> {
  constructor(props: IEngagementDashboardBusinvolvedProps) {
    super(props);
    
    this.state = {
      showPopup: false,
      value: '',
      accountName:'',
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
  public render(): React.ReactElement<IEngagementDashboardBusinvolvedProps> {

    const showPopup = this.state.showPopup;

    const options: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
    ];

    const projectProgramOptions: IDropdownOption[] = [
      { key: '521 PES Client Innovation-Linux-Porting', text: '521 PES Client Innovation-Linux-Porting' },
      { key: '521_Metasys_UI-Digital', text: '521_Metasys_UI-Digital' },
      { key: '521_ToolsDevelopment_Digital', text: '521_ToolsDevelopment_Digital' },
      { key: '521-Metasys-Modernization-Digital', text: '521-Metasys-Modernization-Digital' }
    ];
    const LocationOptions: IDropdownOption[] = [
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

    const digitalBodyTemplate = (ref : boolean) => {
      if(ref){
        return (
          <React.Fragment>
              <FontIcon aria-label="edit" iconName="CheckMark" className={styles.checkMark}/>
          </React.Fragment>
        );
      }else{
          return "";
      }
     
    };

    const projectsBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx' className='p-Link'>521-Metasys-Modernization-Linux Porting-Digital</Link>
          </React.Fragment>
        );
    };


    const accountDetailData = [
      {
        ProgramsProjects:'521 PES Client Innovation-Linux-Porting',
        digital: digitalBodyTemplate(true),
        embedded: digitalBodyTemplate(false),
        hardware: digitalBodyTemplate(false),
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
      },
      {
        ProgramsProjects:'521_Metasys_UI-Digital',
        digital: digitalBodyTemplate(true),
        embedded: digitalBodyTemplate(false),
        hardware: digitalBodyTemplate(false),
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    },
    {
      ProgramsProjects:'521_ToolsDevelopment_Digital',
      digital: digitalBodyTemplate(false),
      embedded: digitalBodyTemplate(true),
      hardware: digitalBodyTemplate(true),
      Aerospace: '',
      Automotive: '',
      intelligentAutomation: '',
    },
    {
        ProgramsProjects:'521-Metasys-Modernization-Digital',
        digital: digitalBodyTemplate(false),
        embedded: digitalBodyTemplate(true),
        hardware: digitalBodyTemplate(true),
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    },
    {
        ProgramsProjects:'521-Metasys-Modernization-Linux Porting-Digital',
        digital: digitalBodyTemplate(false),
        embedded: digitalBodyTemplate(true),
        hardware: digitalBodyTemplate(true),
        Aerospace: '',
        Automotive: '',
        intelligentAutomation: '',
    }
    ];

    let urlParams = new URLSearchParams(window.location.search);
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    console.log("busInvolved tile", this.state.accountName);

   
    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
            <Link href={`${splitUrl}?accountName=${this.state.accountName}`}>
                ENGAGEMENT DASHBOARD
            </Link>
          </li>
          <li>{this.state.accountName} - BUs Involved</li> 
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
                          defaultSelectedKey="JCI"
                          options={options}
                          styles={dropdownStyles}
                          className='droupdown'
                        />
                        <Dropdown
                          label='Program/Projects'
                          placeholder='Select Program/Projects'
                          options={projectProgramOptions}
                          styles={dropdownStyles}
                          className='droupdown'
                        /> 
                        <Dropdown
                          label='Locations'
                          placeholder='Select Locations'
                          options={LocationOptions}
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
            <Column field="ProgramsProjects" header="Programs/Projects" filter body={projectsBodyTemplate} style={{ minWidth: '600px'}} ></Column>
            <Column field="digital" header="Digital" filter  style={{ minWidth: '90px' }} ></Column>
            <Column field="embedded" header="Embedded" filter  style={{ minWidth: '110px' }}></Column>
            <Column field="hardware" header="Hardware" filter  style={{ minWidth: '100px' }}></Column>
            <Column field="Aerospace" header="Aerospace" filter style={{ minWidth: '110px'}} ></Column>
            <Column field="Automotive" header="Automotive" filter style={{ minWidth: '110px' }} ></Column>
            <Column field="intelligentAutomation" header="Intelligent Automation" filter style={{ minWidth: '190px' }}></Column>
          </DataTable>
          </div>
        </div>
      </>
    );
  }
}
