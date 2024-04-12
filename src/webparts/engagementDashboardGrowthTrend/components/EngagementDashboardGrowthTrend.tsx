import * as React from 'react';
//import styles from './EngagementDashboardGrowthTrend.module.scss';
import type { IEngagementDashboardGrowthTrendProps } from './IEngagementDashboardGrowthTrendProps';
import { Text, DefaultButton, Dropdown, FontIcon, PrimaryButton, Stack, IDropdownOption, IDropdownStyles, IButtonStyles, ChoiceGroup, IChoiceGroupOption, Link } from '@fluentui/react';
import '../../common.css';
import BarchartwithLine from '../../../components/BarchartwithLine';
import { revenue, team } from './apiData';
import { Calendar } from 'primereact/calendar';

export interface IEngagementDashboardGrowthTrendState {
  showPopup: boolean;
  value: any;
  accountName: string;
}
export default class EngagementDashboardGrowthTrend extends React.Component<IEngagementDashboardGrowthTrendProps, IEngagementDashboardGrowthTrendState, {}> {
  constructor(props: IEngagementDashboardGrowthTrendProps) {
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

  public render(): React.ReactElement<IEngagementDashboardGrowthTrendProps> {
    const showPopup = this.state.showPopup;

    const siteoptions: IChoiceGroupOption[] = [
      { key: 'offshore', text: 'Offshore' },
      { key: 'onsite', text: 'Onsite' },
      { key: 'both', text: 'Both' },
    ];
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

    let urlParams = new URLSearchParams(window.location.search);
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    console.log("revenue leakage tile", this.state.accountName);

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
            <Link href={`${splitUrl}?accountName=${this.state.accountName}`}>
              ENGAGEMENT DASHBOARD
            </Link>
          </li>
          <li>{this.state.accountName} - Growth Trend</li>
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
                        defaultSelectedKey="JCI"
                        options={dropDownoptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <div className='ms-filter'> 
                        <label htmlFor="calender">Date Range</label>
                        <Calendar id="calender" placeholder='01/01/2023 - 31/01/2024' value={this.state.value} onChange={this.handleChange} selectionMode="range" readOnlyInput />
                      </div> 
                      <ChoiceGroup defaultSelectedKey="offshore" options={siteoptions} label="Site" />
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
      <div className='i-chart-card' style={{ width: '100%' }}>
        <div className="i-card-title i-mb-20">Revenue</div>
        <BarchartwithLine data={revenue} />
      </div>
      <div className='i-chart-card' style={{ width: '100%' }}>
        <div className="i-card-title i-mb-20">Team</div>
        <BarchartwithLine data={team} />
      </div>
      </>
    );
  }
}
