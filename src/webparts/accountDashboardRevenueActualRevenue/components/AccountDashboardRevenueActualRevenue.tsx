import * as React from 'react';
import type { IAccountDashboardRevenueActualRevenueProps } from './IAccountDashboardRevenueActualRevenueProps';
import { DefaultButton, Text, Dropdown, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, PrimaryButton, Stack } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import Piechart from '../../../components/Piechart';
import { revenueBU, branchRevenue, revenueOnsiteOffshore } from '../../engagementDashboardResourcing/components/ApiData';

export interface AccountDashboardRevenueActualRevenueState {
  showPopup: boolean;
  value: any
}
export default class AccountDashboardRevenueActualRevenue extends React.Component<IAccountDashboardRevenueActualRevenueProps, AccountDashboardRevenueActualRevenueState, {}> {
  
  constructor(props: IAccountDashboardRevenueActualRevenueProps) {
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
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx" + sourceParam;
  };
  public render(): React.ReactElement<IAccountDashboardRevenueActualRevenueProps> {

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
    
    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
          <a onClick={this.navigateToPreviousPage}>Account Dashboard</a>
          </li>
          <li>
          <a href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Revenue($).aspx">JCI - REVENUE</a>
          </li>
          <li>Nov 23 - Actual Revenue</li>
        </ul>
      </div>
      <section>
        <div className='i-header i-mb-20'>
          <div className='buttonWrapper'>
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
                        <label htmlFor="calender">Month</label>
                        <Calendar id="calender" placeholder='Nov' view='month' dateFormat="mm/yy" value={this.state.value} onChange={this.handleChange} readOnlyInput />
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
      </section> 
      <div className='i-row'>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Actual Revenue - BU</div>
              </div>
              <div className='i-card-body'>
              <Piechart data={revenueBU} />
              </div> 
            </div>
          </div>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Actual Revenue - Onsite vs Offshore</div>
              </div>
              <div className='i-card-body'>
              <Piechart data={revenueOnsiteOffshore} />
              </div>
            </div>
          </div>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Actual Revenue - Branch Wise</div>
              </div>
              <div className='i-card-body'>
                  <Piechart data={branchRevenue} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
