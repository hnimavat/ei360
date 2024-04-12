import * as React from 'react';
//import styles from './EngagementDashboardResourcingRateCard.module.scss';
import type { IEngagementDashboardResourcingRateCardProps } from './IEngagementDashboardResourcingRateCardProps';
import { DefaultButton, Text, Dropdown, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, ISearchBoxStyles, PrimaryButton, SearchBox, Stack } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import styles from './EngagementDashboardResourcingRateCard.module.scss';

export interface IEngagementDashboardResourcingRateCardState {
  showPopup: boolean;
  value: any,
  selectedRoows: string,
  accountName: string,
}
export default class EngagementDashboardResourcingRateCard extends React.Component<IEngagementDashboardResourcingRateCardProps, IEngagementDashboardResourcingRateCardState, {}> {
  constructor(props: IEngagementDashboardResourcingRateCardProps) {
    super(props);
    
    this.state = {
      showPopup: false,
      value: '',
      selectedRoows: '',
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

  onSelectionChange = (e: { value: any; }) => {
    this.setState({ selectedRoows: e.value });
  };
  handleChange(event: any) {
    this.setState({value: event.target.value});
  }  
  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" + sourceParam;
  };
  public render(): React.ReactElement<IEngagementDashboardResourcingRateCardProps> {
    
    const showPopup = this.state.showPopup;
    const accountDetailData = [
      {
        experience:'1-3',
        technology:'Angular',
        currency:'Dollars',
        rate:'15',
      },
      {
        experience:'4-6',
        technology:'Angular',
        currency:'Dollars',
        rate:'20',
      },
      {
        experience:'7-10',
        technology:'Angular',
        currency:'Dollars',
        rate:'25',
      },
      {
        experience:'11-15',
        technology:'Angular',
        currency:'Dollars',
        rate:'35',
      },
      {
        experience:'16 and above',
        technology:'Angular',
        currency:'Dollars',
        rate:'45',
      },
      {
        experience:'1-3',
        technology:'React JS',
        currency:'Dollars',
        rate:'15',
      },
      {
        experience:'4-6',
        technology:'React JS',
        currency:'Dollars',
        rate:'20',
      },
      {
        experience:'7-10',
        technology:'React JS',
        currency:'Dollars',
        rate:'25',
      },
      {
        experience:'11-15',
        technology:'React JS',
        currency:'Dollars',
        rate:'35',
      },
      {
        experience:'16 and above',
        technology:'React JS',
        currency:'Dollars',
        rate:'45',
      },
      {
        experience:'1-3',
        technology:'.Net',
        currency:'Dollars',
        rate:'15',
      },
      {
        experience:'4-6',
        technology:'.Net',
        currency:'Dollars',
        rate:'20',
      },
      {
        experience:'7-10',
        technology:'.Net',
        currency:'Dollars',
        rate:'25',
      },
      {
        experience:'11-15',
        technology:'.Net',
        currency:'Dollars',
        rate:'35',
      },
      {
        experience:'16 and above',
        technology:'.Net',
        currency:'Dollars',
        rate:'45',
      }
    ]
      
      const accountOptions: IDropdownOption[] = [
        { key: 'JCI', text: 'JCI' },
        { key: 'Collins Aerospace', text: 'Collins Aerospace' },
        { key: 'Dover Digital', text: 'Dover Digital' },
        { key: 'Comcast', text: 'Comcast' }
      ];
  
      const locationOptions: IDropdownOption[] = [
        { key: 'all', text: 'All' }
      ];
      const programOptions: IDropdownOption[] = [
        { key: '521_Connect Gateway App Porting', text: '521_Connect Gateway App Porting' }
      ];
      const rateCardOptions: IDropdownOption[] = [
        { key: 'Rate Card 1', text: 'Rate Card 1' }
      ];
  
      const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { fontFamily: 'Poppins' },
        title: {height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37},
        caretDownWrapper: {lineHeight: 37},
        dropdownItemSelected: {background: '#E7F3FF'}
      };
  
      const modalButton: Partial<IButtonStyles> = {
        root: {margin: '20px 0 0'}
      };
      const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    return (
      <>
        <div>
        <ul className='breadcrumb'>
          <li>
          <a onClick={this.navigateToPreviousPage}>Engagement Dashboard</a>
          </li>
          <li>
          <a href={`EngagementDashboardResourcing.aspx?accountName=${this.state.accountName}`}>{this.state.accountName} - Resourcing</a>
          </li>
          <li>{this.state.accountName} - Rate Card</li>
        </ul>
      </div>
      <section className="accountOverviewSection ">
        <div className='blockTitleWrap i-mb-20 align-items-end'>
          <div className='titleWrap'>
          <SearchBox placeholder="Search" styles={searchBoxStyles} className='searchBar'/>
          </div>
          <div className='rightbar align-items-end'>
            <span className={styles.dropdownWidth}>
              <Dropdown
                label='Select Rate Card'
                defaultSelectedKey='Rate Card 1'
                options={rateCardOptions}
                styles={dropdownStyles}
                className='droupdown'
              />
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
                        placeholder='Select Account'
                        defaultSelectedKey="JCI"
                        options={accountOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='Location'
                        placeholder='Select Location'
                        defaultSelectedKey="all"
                        options={locationOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='Programs/Projects'
                        placeholder='Select Programs/Projects'
                        defaultSelectedKey="521_Connect Gateway App Porting"
                        options={programOptions}
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
              <DefaultButton text="Edit" className='btn-outline'></DefaultButton>
            </span>
            <span>
              <PrimaryButton text="Download" className='btn-primary'></PrimaryButton>
            </span>
          </div>
        </div>
        <div className='datatable-wrapper'> 
          <DataTable value={accountDetailData} scrollable selection={this.state.selectedRoows} onSelectionChange={this.onSelectionChange}>
            <Column selectionMode="multiple" style={{ minWidth: '50px' }} ></Column>
            <Column field="experience" header="Experience Band (Years)" filter style={{ minWidth: '260px' }} ></Column>
            <Column field="technology" header="Technology" filter style={{ minWidth: '620px' }}></Column>
            <Column field="currency" header="Currency" filter style={{ minWidth: '250px' }}></Column>
            <Column field="rate" header="Rate/Hour($)" filter style={{ minWidth: '150px' }} align="right"></Column>
          </DataTable>
        </div>
      </section>
      </>
    );
  }
}
