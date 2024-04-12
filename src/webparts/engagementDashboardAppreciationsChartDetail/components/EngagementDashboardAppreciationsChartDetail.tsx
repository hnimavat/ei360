import * as React from 'react';
import styles from './EngagementDashboardAppreciationsChartDetail.module.scss';
import type { IEngagementDashboardAppreciationsChartDetailProps } from './IEngagementDashboardAppreciationsChartDetailProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption, IButtonStyles, Link } from '@fluentui/react';
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
export default class EiAccountsTilesDetails extends React.Component<IEngagementDashboardAppreciationsChartDetailProps, IEiAccountDashboardProgramState, {}> {
  
  constructor(props: IEngagementDashboardAppreciationsChartDetailProps) {
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


  public render(): React.ReactElement<IEngagementDashboardAppreciationsChartDetailProps> {

    const showPopup = this.state.showPopup;
      
    const accountDetailData = [
      {
        status:'',
        EmployeeName:'Aakash Brahmbhatt',        
        EmployeeCode: '157493',
        ProjectName: '521 PES Client Innovation-',
        BU: 'Digital',
        Date: '03/01/2023',
        AppreciatedBy: 'Sachin Singla',
        AppreciationName: 'Sachin Singla'
      
      },
      {
        status:'',
        EmployeeName:'Aakash Brahmbhatt',        
        EmployeeCode: '157493',
        ProjectName: '521 PES Client Innovation-',
        BU: 'Digital',
        Date: '03/01/2023',
        AppreciatedBy: 'Sachin Singla',
        AppreciationName: 'Sachin Singla'
    },
    { 
      status:'',
        EmployeeName:'Aakash Brahmbhatt',        
        EmployeeCode: '157493',
        ProjectName: '521 PES Client Innovation-',
        BU: 'Digital',
        Date: '03/01/2023',
        AppreciatedBy: 'Sachin Singla',
        AppreciationName: 'Sachin Singla'
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

    const projectsOptions: IDropdownOption[] = [
      { key: 'all', text: 'All' },
      { key: '521_Metasys_UI-Digital', text: '521_Metasys_UI-Digital' },
      { key: '521-OBAC-Digital', text: '521-OBAC-Digital' },
      { key: '521-OBBAS-Digital', text: '521-OBBAS-Digital' },
    ];

    const buOptions: IDropdownOption[] = [
      { key: 'digital', text: 'Digital' },
      { key: 'Embedded', text: 'Embedded' },
      { key: 'Hardware', text: 'Hardware' },
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

    const programBodyTemplate = () => {
      return (
          <React.Fragment>
              <Link href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx' className='p-Link columnWrap180'>Tools Development</Link>
          </React.Fragment>
        );
    };


    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
            <a href='javascript:void(0)' onClick={this.navigateToPreviousPage}>engagement dashboard</a>
          </li>
          <li ><a href='https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Appreciations.aspx'>jci-appreciations</a>
          </li> 
          <li>jan 23</li> 
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
                        defaultSelectedKey="JCI"
                        options={options}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='BU'
                        placeholder='Select BU'
                        defaultSelectedKey="digital"
                        options={buOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='Programs/Projects'
                        placeholder='Select Programs/Projects'
                        defaultSelectedKey="all"
                        options={projectsOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <div className='ms-filter'> 
                        <label htmlFor="calender">Select Month</label>
                        <Calendar id="calender" placeholder='Jan 2023' view='month' dateFormat='mm/yy' value={this.state.value} onChange={this.handleChange} readOnlyInput />
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
            <Column field="EmployeeCode" header="Employee Code" filter style={{ minWidth: '170px' }} align={'right'}></Column>
            <Column field="EmployeeName" header="Employee Name" filter style={{ minWidth: '215px' }}  ></Column>
            <Column field="ProjectName" header="Project Name" filter style={{ minWidth: '180px' }} body={programBodyTemplate}></Column>
            <Column field="BU" header="BU" filter style={{ minWidth: '135px' }}></Column>
            <Column field="Date" header="Date" filter style={{ minWidth: '145px' }}></Column>
            <Column field="AppreciatedBy" header="Appreciated By" filter style={{ minWidth: '190px' }}></Column>
            <Column field="AppreciationName" header="Appreciation Name" filter style={{ minWidth: '190px' }}></Column>
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
