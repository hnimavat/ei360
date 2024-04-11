import * as React from 'react';
//import styles from './EiExecutiveSummary.module.scss';
import type { IEiExecutiveSummaryProps } from './IEiExecutiveSummaryProps';
import '../../common.css';
import { TabView, TabPanel } from 'primereact/tabview';
import { DonutChart, GaugeChart, IChartDataPoint, IChartProps, IGaugeChartStyles, ILegendsProps } from '@fluentui/react-charting';
import { ChoiceGroup, Dropdown, IChoiceGroupOption, IDropdownStyles, ISearchBoxStyles, IToggleStyles, Link, SearchBox, Toggle } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { accountsRevenue } from './apiData';
import { EDServices } from '../../../services/EDServices';
import { cloneDeep, groupBy, uniqBy } from 'lodash';
import { sortBy } from 'lodash';

const data = require("../../../SampleData/projectData.json");
const sampleJsonData = require("../assets/sampleJsonData.json");

export interface IFilters {
  lSearch: string;
  lSort: string;
  rSearch: string;
  rSort: string;
}

export interface EiExecutiveSummaryState {
  parentWidth: number;
  selectedAccount: string;
  filterData: any;
  //created By Ashish
  switchEnable: boolean;
  risksData: any;
  risksChartData: any;
  escalationData: any;
  escalationsChartData: any;
  accounts: any;
  selectedAccounts: Array<string>;
  selectedView: string;
  filters: IFilters;
  activeTabIndex: number;
  selectedYear: string;
}

export default class EiExecutiveSummary extends React.Component<IEiExecutiveSummaryProps, EiExecutiveSummaryState, {}> {
  private parentRef: React.RefObject<HTMLDivElement>;
  spServices: EDServices;

  constructor(props: IEiExecutiveSummaryProps) {
    super(props);
    this.parentRef = React.createRef();
    this.spServices = new EDServices(props.context);
    this.state = {
      parentWidth: 0,
      selectedAccount: 'account',
      filterData: [],
      switchEnable: false,
      // created By Ashish
      risksData: [],
      risksChartData: [],
      escalationData: [],
      escalationsChartData: [],
      accounts: [],
      selectedAccounts: [],
      selectedView: "AccountName",
      filters: this.getEmptyFilterValue(),
      activeTabIndex: 0,
      selectedYear: "2024"
    };
    this.handleToggleChange = this.handleToggleChange.bind(this);

    this.screenInit();
  }
  componentDidMount() {
    this.setState({
      parentWidth: this.parentRef.current?.offsetWidth || 0,
    });
    const filteredItems = accountsRevenue.filter((item: any) => item.type === this.state.selectedAccount);
    this.setState({ filterData: filteredItems });
  }

  //get Risks and Escalation Data
  private async screenInit() {
    let firstDayOfYear: string = (new Date(Number(this.state.selectedYear), 0, 1)).toISOString();
    let endDayOfYear: string = (new Date(Number(this.state.selectedYear), 11, 31)).toISOString();
    firstDayOfYear = `${firstDayOfYear.substring(0, firstDayOfYear.indexOf('T'))}T00:00:00Z`;
    endDayOfYear = `${endDayOfYear.substring(0, endDayOfYear.indexOf('T'))}T23:59:59Z`;

    //getting Risks Data
    const riskData = await this.spServices.getListDataWithFilter(this.props.riskListName, `datetime'${endDayOfYear}' ge CreatedDate and datetime'${firstDayOfYear}' le CreatedDate`);
    const riskDataStatusChoices = await this.spServices.getFieldsByListName(this.props.riskListName, "Status");
    const riskStatusOptions = riskDataStatusChoices.Choices.map((x: any) => { return { key: x, text: x } });

    //getting Escalations Data
    const escalationData = await this.spServices.getListDataWithFilter(this.props.escalationListName, `datetime'${endDayOfYear}' ge EscalationDate and datetime'${firstDayOfYear}' le EscalationDate`);
    const escalationStatusChoices = await this.spServices.getFieldsByListName(this.props.escalationListName, "Status");
    const escalationStatusOptions = escalationStatusChoices.Choices.map((x: any) => { return { key: x, text: x } });

    console.log(escalationData);
    //accounts
    let accounts = uniqBy(data.data, "clientName");
    this.setState({
      risksData: riskData,
      risksChartData: riskData.length > 0 && this.riskStatusChartData(riskData, riskStatusOptions),
      escalationData: escalationData,
      escalationsChartData: escalationData.length > 0 && this.escalationStatusChartDate(escalationData, escalationStatusOptions),
      accounts: accounts
    });
  }

  // Ensure the chart updates when the window is resized
  handleResize = () => {
    this.setState({
      parentWidth: this.parentRef.current?.offsetWidth || 0,
    });
  };

  componentDidUpdate(prevProps: Readonly<IEiExecutiveSummaryProps>, prevState: Readonly<EiExecutiveSummaryState>, snapshot?: {} | undefined): void {
    window.addEventListener("resize", this.handleResize);
    if (prevState.selectedView !== this.state.selectedView || prevState.activeTabIndex !== this.state.activeTabIndex) {
      this.setState({
        selectedAccounts: [],
        filters: this.getEmptyFilterValue()
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  private getEmptyFilterValue(): IFilters {
    return {
      lSearch: "",
      lSort: "nameAssending",
      rSearch: "",
      rSort: "nameAssending"
    }
  }

  private handleCategoryChange(viewBy: any) {
    this.setState({
      selectedView: viewBy
    })
  }

  handleToggleChange(event: any, checked: any) {
    this.setState({ switchEnable: checked });
  }

  private riskStatusChartData(riskData: any, statusOptions: any) {
    const groupByStatus = riskData && groupBy(riskData, "Status");
    const riskStatus = statusOptions && statusOptions.map((x: any) => {
      return { legend: x.key, data: groupByStatus[x.key] ? groupByStatus[x.key]?.length : 0, color: this.getColorForRiskStatus(x.key) }
    });
    return riskStatus;
  }

  //for getting color for risk data
  private getColorForRiskStatus(key: any) {
    switch (key) {
      case "High":
        return "#2EB034"
      case "Medium":
        return "#F57D0E"
      case "Low":
        return "#DB4537"
    }
  }

  private escalationStatusChartDate(escalationData: any, statusOptions: any) {
    const groupByStatus = escalationData && groupBy(escalationData, "Status");
    const escalationstatus = statusOptions && statusOptions.map((x: any) => {
      return { legend: x.key, data: groupByStatus[x.key] ? groupByStatus[x.key]?.length : 0, color: this.getColorForEscalationStatus(x.key) }
    });
    return escalationstatus;
  }

  private getColorForEscalationStatus(key: any) {
    switch (key) {
      case "Open":
        return "#2EB034"
      case "Closed":
        return "#F57D0E"
      case "In Progress":
        return "#DB4537"
      case "Resolved":
        return "#B2C2DA"
    }
  }

  private getSortedData(data: any, sortKey: string): Array<any> {
    switch (sortKey) {
      case "nameAssending":
        return sortBy(data, "name")
      case "nameDescending":
        return sortBy(data, "name").reverse()
      case "valueAssending":
        return sortBy(data, "value")
      case "valueDescending":
        return sortBy(data, "value").reverse()
      default:
        return data
    }
  }

  private getLeftBoxData(tabData: any, columnName: string) {
    const riskData = cloneDeep(tabData);
    const { lSearch, lSort } = this.state.filters;
    const groupByData = groupBy(riskData, columnName);
    let data = Object.keys(groupByData).map((item: any) => {
      return { name: item, value: groupByData[item].length }
    })
    if (lSearch) {
      data = data.filter((x) => x.name.toLowerCase().includes(lSearch.toLocaleLowerCase()))
    }
    if (lSort) {
      data = this.getSortedData(data, lSort);
    }
    return data;
  }

  private getRightBoxData(tabData: any, selectedView: string) {
    const accounts = this.state.selectedAccounts;
    const { rSearch, rSort } = this.state.filters;
    const filterByAccount = cloneDeep(tabData).filter((x: any) => accounts.includes(x[selectedView]));
    const groupByBU = groupBy(filterByAccount, selectedView === "AccountName" ? "BU" : "AccountName");
    let data = Object.keys(groupByBU).map((item: any) => {
      return { name: item, value: groupByBU[item].length }
    })
    if (rSearch) {
      data = data.filter((x) => x.name.toLowerCase().includes(rSearch.toLocaleLowerCase()))
    }
    if (rSort) {
      data = this.getSortedData(data, rSort);
    }
    return data;
  }

  private handleToggleAccount(accountName: string) {
    const value = this.toggleValueInArray(this.state.selectedAccounts, accountName);
    this.setState({
      selectedAccounts: value,
      switchEnable: value.length > 0
    }, () => console.log(this.state.selectedAccounts));
  }

  private toggleValueInArray(array: any, value: string) {
    if (array.includes(value)) {
      return array.filter((item: string) => item !== value);
    } else {
      return [...array, value];
    }
  }

  private handleFilterChange(filterName: string, value: any) {
    this.setState({
      filters: {
        ...this.state.filters,
        [filterName]: value
      }
    })
  }

  private linkRedirect(pageLink: string, accountName: string) {
    window.open(pageLink + "?accountName=" + accountName + "&source=" + window.location.href, "_self")
  }

  public render(): React.ReactElement<IEiExecutiveSummaryProps> {
    const { switchEnable, selectedView, risksData,
      filters, escalationData, activeTabIndex, selectedAccounts, selectedYear } = this.state;
    const legendStyles: Partial<ILegendsProps> = {
      styles: {
        rect: {
          display: 'none'
        },
        text: {
          fontFamily: 'Poppins',
          fontSize: '13px',
          lineHeight: '19.5px',
          color: '#2A3042',
          fontWeight: '500'
        },
        root: {
          margin: 0,
        },
        legend: { padding: '0 8px' }
      }
    }

    const gaugeChart: Partial<IGaugeChartStyles> = {
      root: { height: 'auto' },
      chartValue: {
        fontFamily: 'Poppins',
        fontSize: 15,
        fontWeight: 600,
        lineHeight: 25,
      }
    }
    const opportunitiesChartData: IChartDataPoint[] = [
      { legend: 'Active', data: 35, color: '#B2C2DA' },
      { legend: 'Proactive', data: 12, color: '#004E8C' },
    ];
    const opportunitiesData: IChartProps = {
      chartData: opportunitiesChartData,
    };

    const escalationsData: IChartProps = {
      chartData: this.state.escalationsChartData,
    };
    const donutLlegendStyles: Partial<ILegendsProps> = {
      styles: {
        rect: {
          width: 13,
          height: 3.2
        },
        text: {
          fontFamily: 'Poppins',
          fontSize: '13px',
          lineHeight: '19.5px',
          color: '#2A3042',
          fontWeight: '500'
        },
        root: {
          flexDirection: 'column'
        },
        legend: {
          paddingBottom: 0
        }
      },
      centerLegends: true,
      allowFocusOnLegends: true,
      enabledWrapLines: true
    }

    const options: IChoiceGroupOption[] = [
      { key: 'AccountName', text: 'Accounts' },
      { key: 'BU', text: 'BUs' },
    ];

    const toggleStyles: Partial<IToggleStyles> = {
      pill: {
        width: 36,
        border: '1px solid #D7DADE',
        background: '#F8F8FB'
      },
      thumb: {
        width: 14,
        height: 14,
        backgroundColor: '#74788D'
      }
    }
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 207, fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF', minHeight: 26, margin: '2px 0' },
      dropdownItems: { padding: '7px 0' },
      dropdownItem: { minHeight: 26 }
    };
    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    const renderTabData = (tabData: any, tabHeading: string, pageLink:string) => {
      return <div className='i-row'>
        <div className='i-col-7'>
          <div className='summaryTab_card'>
            <span className='card_tag'>{this.state.selectedYear}</span>
            <ChoiceGroup options={options}
              label="View By" selectedKey={this.state.selectedView}
              className='custom-radio'
              onChange={(ev, option) => this.handleCategoryChange(option?.key)} />
            <div className='d-flex justify-between align-items-center i-mb-13'>
              <div className='tableTitle'>{tabHeading + " in " + (this.state.selectedView === 'AccountName' ? "Accounts" : "BUs")}</div>
              <div className='d-flex align-items-center i-gap-5'>
                <div className='tableHeader'>Show TAM Accounts</div>
                <Toggle
                  className='switch mb-0'
                  styles={toggleStyles}
                />
              </div>
            </div>
            <div className='d-flex justify-between align-items-center flex-wrap i-rgap-10 i-mb-13'>
              <div>
                <SearchBox placeholder="Search"
                  value={filters.lSearch}
                  styles={searchBoxStyles}
                  onChange={(ev, value) => this.handleFilterChange("lSearch", value)}
                  className='searchBar' />
              </div>
              <div className='d-flex i-gap-10'>
                <Dropdown
                  options={[
                    { key: 'nameAssending', text: 'Sort By: Name-Assending' },
                    { key: 'nameDescending', text: 'Sort By: Name-Descending' },
                    { key: 'valueAssending', text: 'Sort By: Value-Assending' },
                    { key: 'valueDescending', text: 'Sort By: Value-Descending' }
                  ]}
                  selectedKey={filters.lSort}
                  onChange={(ev, options) => this.handleFilterChange("lSort", options?.key)}
                  styles={dropdownStyles}
                  className='droupdown'
                />
              </div>
            </div>
            <div className='summary_smallCard_wrap'>
              <div className='i-row'>
                {this.getLeftBoxData(tabData, selectedView).map((item: any) => {
                  return (
                    <div className='i-col-4 i-mb-13'>
                      <div className='summary_smallCard'>
                        <div className='account_detail'>
                          <div className='account_name'>{item.name}</div>
                          <div className='account_value'>{item.value}</div>
                        </div>
                        <div className='account_control'>
                          <Toggle
                            className='switch i-mb-13'
                            styles={toggleStyles}
                            checked={selectedAccounts.includes(item.name)}
                            onChange={(e, va) => this.handleToggleAccount(item.name)}
                          />
                          {selectedView === 'AccountName'
                            && <Link onClick={() => this.linkRedirect(pageLink, item.name)}>
                              <FontAwesomeIcon icon={faLink} className='account_link'></FontAwesomeIcon>
                            </Link>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='i-col-5'>
          <div className='summaryTab_card'>
            <div className='tableTitle i-mb-13'>{tabHeading + " in " + (!(this.state.selectedView === 'AccountName') ? "Accounts" : "BUs")}</div>
            <div className='d-flex justify-between align-items-center flex-wrap i-rgap-10 i-mb-20'>
              <div>
                <SearchBox
                  placeholder="Search"
                  value={filters.rSearch}
                  styles={searchBoxStyles}
                  onChange={(ev, value) => this.handleFilterChange("rSearch", value)}
                  className='searchBar' />
              </div>
              <div className='d-flex i-gap-10'>
                <Dropdown
                  options={[
                    { key: 'nameAssending', text: 'Sort By: Name-Assending' },
                    { key: 'nameDescending', text: 'Sort By: Name-Descending' },
                    { key: 'valueAssending', text: 'Value-Assending' },
                    { key: 'valueDescending', text: 'Value-Descending' }
                  ]}
                  selectedKey={filters.rSort}
                  onChange={(ev, options) => this.handleFilterChange("rSort", options?.key)}
                  styles={dropdownStyles}
                  className='droupdown'
                />
              </div>
            </div>
            {!switchEnable ? (
              <div className='i-row messageWrap'>
                <div className='empty_account_msg'>Select one or more Accounts from left side to view the revenue in BUs</div>
              </div>
            ) : (
              <div className='summary_smallCard_wrap'>
                <div className='i-row'>
                  {this.getRightBoxData(tabData, selectedView).map((item) => {
                    return <div className='i-col-4 i-mb-13'>
                      <div className='summary_smallCard_withoutLink'>
                        <div className='account_detail'>
                          <div className='account_name'>{item.name}</div>
                          <div className='account_value'>{item.value}</div>
                        </div>
                        {!(this.state.selectedView === 'AccountName') && <div className='account_control'>
                          <Link onClick={() => this.linkRedirect(pageLink, item.name)}>
                            <FontAwesomeIcon icon={faLink} className='account_link'></FontAwesomeIcon>
                          </Link>
                        </div>}
                      </div>
                    </div>
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    }

    return (
      <>
        <section>
          <div className='executiveHeader pageTitle i-mt-20 i-mb-13'>
            <span>
              Executive Summary
            </span>
            <div>
              <Dropdown
                options={[
                  { key: '2021', text: '2021' },
                  { key: '2022', text: '2022' },
                  { key: '2023', text: '2023' },
                  { key: '2024', text: '2024' }
                ]}
                selectedKey={selectedYear}
                onChange={(ev, options) => {
                  this.setState({
                    selectedYear: (options?.key as string)
                  }, () => this.screenInit())
                }}
                styles={dropdownStyles}
                className='droupdown'
              />
            </div>
          </div>
          <div className='i-row'>
            <div className='i-col-3 i-mb-25'>
              <div className='summary_card'>
                <span className='card_tag'>{this.state.selectedYear}</span>
                <div className='summary_header'>
                  <div className='header_title'>Revenue Target($)</div>
                  <div className='header_value'></div>
                </div>
                <div className='summary_body'>
                  <GaugeChart
                    width={this.state.parentWidth}
                    height={175}
                    segments={[
                      { size: 1650000, color: '#004E8C', legend: 'Target' },
                      { size: 1320000, color: '#B2C2DA', legend: 'Achieved' },
                    ]}
                    chartValue={1320000}
                    hideMinMax={true}
                    legendProps={legendStyles}
                    hideTooltip={true}
                    styles={gaugeChart}
                  />
                  <div className='gaugeLegendValue'>
                    <ul>
                      <li>16.5M</li>
                      <li>13.2M</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='i-col-3 i-mb-25'>
              <div className='summary_card'>
                <span className='card_tag'>{this.state.selectedYear}</span>
                <div className='summary_header'>
                  <div className='header_title'>Opportunities</div>
                  <div className='header_value'></div>
                </div>
                <div className='summary_body'>
                  <DonutChart
                    data={opportunitiesData}
                    innerRadius={45}
                    width={137}
                    height={200}
                    styles={{
                      root: {
                        flexDirection: 'row',
                        gap: 10
                      }
                    }}
                    legendProps={donutLlegendStyles}
                  />
                  <div className='legendValue'>
                    <ul>
                      <li>35</li>
                      <li>12</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Risks Chart */}
            <div className='i-col-3 i-mb-25'>
              <div className='summary_card'>
                <span className='card_tag'>{this.state.selectedYear}</span>
                <div className='summary_header'>
                  <div className='header_title'>Risks</div>
                  <div className='header_value'>{risksData.length}</div>
                </div>
                <div className='summary_body'>
                  <DonutChart
                    data={{
                      chartData: this.state.risksChartData,
                    }}
                    innerRadius={45}
                    width={137}
                    height={200}
                    styles={{
                      root: {
                        flexDirection: 'row',
                        gap: 10
                      }
                    }}
                    legendProps={donutLlegendStyles}
                    valueInsideDonut={'Severity'}
                  />
                  <div className='legendValue'>
                    <ul>
                      {this.state.risksChartData && this.state.risksChartData.map((r: any) => {
                        return <li>{r.data}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Escalations Chart */}
            <div className='i-col-3 i-mb-25'>
              <div className='summary_card'>
                <span className='card_tag'>{this.state.selectedYear}</span>
                <div className='summary_header'>
                  <div className='header_title'>Escalations</div>
                  <div className='header_value'>{this.state.escalationData.length}</div>
                </div>
                <div className='summary_body'>
                  <DonutChart
                    data={escalationsData}
                    innerRadius={45}
                    width={137}
                    height={200}
                    styles={{
                      root: {
                        flexDirection: 'row',
                        gap: 10
                      }
                    }}
                    legendProps={donutLlegendStyles}
                    valueInsideDonut={'Severity'}
                  />
                  <div className='legendValue'>
                    <ul>
                      {this.state.escalationsChartData && this.state.escalationsChartData.map((r: any) => {
                        return <li>{r.data}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='Engagement_Summary_Wrap'>
            <div className="horizontal_tab full_tab">
              <TabView activeIndex={activeTabIndex}
                onTabChange={(tab) => this.setState({ activeTabIndex: tab.index })} >
                <TabPanel header="Revenue">
                  {renderTabData(sampleJsonData, "Revenue($)","https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Risks.aspx")}
                </TabPanel>
                <TabPanel header="Active Opportunities">
                  {renderTabData(sampleJsonData, "Revenue($)","https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Risks.aspx")}
                </TabPanel>
                <TabPanel header="Proactive Opportunities">
                  {renderTabData(sampleJsonData, "Revenue($)","https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Risks.aspx")}
                </TabPanel>
                {/* RiskData Tab */}
                <TabPanel header="Risks">
                  {renderTabData(risksData, "Risks","https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Risks.aspx")}
                </TabPanel>
                {/* Escalation Data Tab */}
                <TabPanel header="Escalations">
                  {renderTabData(escalationData, "Escalations","https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Escalations.aspx")}
                </TabPanel>
              </TabView>
            </div>
          </div>
        </section>
      </>
    );
  }
}