import * as React from 'react';
//import styles from './EngagementDashboardCssRatingsTrend.module.scss';
import type { IEngagementDashboardCssRatingsTrendProps } from './IEngagementDashboardCssRatingsTrendProps';
import BarchartwithLine from '../../../components/BarchartwithLine';
import { data } from './apiData';
import { Text, DefaultButton, Dropdown, FontIcon, PrimaryButton, Stack, IDropdownOption, IDropdownStyles, IButtonStyles, Link } from '@fluentui/react';
import '../../common.css';

export interface IEngagementDashboardCssRatingsTrendState {
  showPopup: boolean;
  accountName: string;
}

export default class EngagementDashboardCssRatingsTrend extends React.Component<IEngagementDashboardCssRatingsTrendProps, IEngagementDashboardCssRatingsTrendState, {}> {
  constructor(props: IEngagementDashboardCssRatingsTrendProps) {
    super(props);
    
    this.state = {
      showPopup: false,
      accountName: '',
    };
  }

  public async componentDidMount(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for revenue :: ', accountName)

    this.setState({ accountName : accountName })
  }

  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" + sourceParam;
  };

  public render(): React.ReactElement<IEngagementDashboardCssRatingsTrendProps> {
    
    const showPopup = this.state.showPopup;

    const dropDownoptions: IDropdownOption[] = [
      { key: 'JCI', text: 'JCI' },
      { key: 'Collins Aerospace', text: 'Collins Aerospace' },
      { key: 'Dover Digital', text: 'Dover Digital' },
      { key: 'Comcast', text: 'Comcast' }
    ];

    const buOptions: IDropdownOption[] = [
      { key: 'digital', text: 'Digital' },
      { key: 'Embedded', text: 'Embedded' },
      { key: 'Hardware', text: 'Hardware' },
    ];
    const projectsOptions: IDropdownOption[] = [
      { key: 'all', text: 'All' },
      { key: '521_Metasys_UI-Digital', text: '521_Metasys_UI-Digital' },
      { key: '521-OBAC-Digital', text: '521-OBAC-Digital' },
      { key: '521-OBBAS-Digital', text: '521-OBBAS-Digital' },
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
          <li>{this.state.accountName} - CSS Ratings Trend</li>
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
                      <Dropdown
                        label='BU'
                        defaultSelectedKey="digital"
                        options={buOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
                      <Dropdown
                        label='Programs/Projects'
                        defaultSelectedKey="all"
                        options={projectsOptions}
                        styles={dropdownStyles}
                        className='droupdown'
                      />
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
          <BarchartwithLine data={data} />
      </div>
      </>
    );
  }
}
