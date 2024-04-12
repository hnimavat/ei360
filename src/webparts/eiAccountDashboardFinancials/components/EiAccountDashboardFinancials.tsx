import * as React from "react";
import { IEiAccountDashboardFinancialsProps } from "./IEiAccountDashboardFinancialsProps";
import "../../common.css";
import styles from "./EiAccountDashboardFinancials.module.scss";
import {
  IVerticalBarChartDataPoint,
  VerticalBarChart,
} from "@fluentui/react-charting";
import {
  Dropdown,
  Link,
  Stack,
  Image,
  Text,
  IDropdownStyles,
  IDropdownOption,
} from "@fluentui/react";
import EiAccountService from "../../../services/EiAccountService";
import { IFinancials } from "../../../model/IFinancials";
//import { KeyAccountName } from "../../../services/siteconfig";
//import { ISharedService } from '../../../services/SharedService';  // Import the shared service interface

export interface ComponentStates {
  financials: IFinancials[];
  companyName: string;
}

interface IVerticalBarChartState {
  isChecked: boolean;
  useSingleColor: boolean;
  selectedkeyfinancial: any;
  selectedQuarterlyKey: any;
  chartData: any;
  quaterlyOptions: Array<any>;
}

export default class VerticalBarChartStyledExample extends React.Component<
  IEiAccountDashboardFinancialsProps,
  IVerticalBarChartState & ComponentStates
> {
  private eiAccountService: EiAccountService;

  constructor(props: IEiAccountDashboardFinancialsProps) {
    super(props);
    this.state = {
      financials: [],
      isChecked: true,
      useSingleColor: true,
      selectedkeyfinancial: "yearly",
      selectedQuarterlyKey:'',
      chartData: [],
      companyName: '',
      quaterlyOptions: []
    };
    this.eiAccountService = new EiAccountService();
  }

  public async componentDidMount(): Promise<void> {
    // Subscribe to the shared service on component mount
    // this.props.sharedService.subscribe(this.handleAccountChange);
    console.log("componentDidMount");

    // console.log(this.props.event.tryGetValue());
    // const data = sessionStorage.getItem(KeyAccountName);
    // console.log(data);

    await this.getFinancials(this.props.event.tryGetValue());
  }

  public async componentWillReceiveProps(
    nextProps: IEiAccountDashboardFinancialsProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            console.log("financial overview Data");
            // console.log("Data Print2::", this.props.event.tryGetValue());
            await this.getFinancials(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  // Update the financials when the selected account changes
  // private handleAccountChange = (selectedOption: string) => {
  //   const AccountNameId = parseInt(selectedOption, 10); // Convert the selected option to the appropriate type
  //   this.getFinancials(AccountNameId);
  // };
  public async getFinancials(AccountName: string): Promise<void> {
    if (!AccountName) {
      console.error("Account name is undefined or empty.");
      return;
    }

    const modifiedAccountName = AccountName.replace(/"/g, "'");
    const financials: IFinancials[] = (await this.eiAccountService.getListDataWithFilter('Financials', `Account_Name eq ${modifiedAccountName}`)).sort((a, b) => a.Year - b.Year);
    console.log('Financials :: ', financials);
  
    const filteredData: IFinancials[] = financials.filter(item => 
      item.Q1Revenue !== null && item.Q1Revenue !== 0 || 
      item.Q2Revenue !== null && item.Q2Revenue !== 0 || 
      item.Q3Revenue !== null && item.Q3Revenue !== 0 || 
      item.Q4Revenue !== null && item.Q4Revenue !== 0
    );
    console.log('filteredData :: ', filteredData)
    // Extract unique years from filtered data
    const uniqueYearsObject: { key: number, text: string }[] = filteredData.map(item => ({ key: item.Year, text: item.Year.toString() }));
    console.log('uniqueYearsObject :: ', uniqueYearsObject)

    this.setState({
      financials: financials,
      companyName: AccountName.replace(/"/g, ""),
      quaterlyOptions : uniqueYearsObject,
      selectedQuarterlyKey: filteredData.length > 0 ? filteredData[0].Year : 0
    })

    this.getChartData("yearly", 0);
  }

  public async getChartData(chartName: string, yearkey: number) {
    const { isChecked } = this.state;

    // Assuming financials is an array of objects with properties Year, Q1Revenue, Q2Revenue, Q3Revenue, Q4Revenue
    //  const numberOfPoints = this.state.financials.length;
    //  const startValue = numberOfPoints;
    //  const endValue = 22000;

    // Calculate the step size based on the range and the number of points
    //  const stepSize = (endValue - startValue) / (numberOfPoints - 1);

    console.log('chartName :: ', chartName);

    let FinancialChartData;
    if (chartName == "yearly") {
      FinancialChartData = this.state.financials.map((financial, index) => {
        const chartDataPoint: IVerticalBarChartDataPoint = {
          x: financial.Year,
          y: financial.Revenue,
        };
        if (isChecked) {
          if (index == 0 || index == this.state.financials.length - 1) {
            chartDataPoint.lineData = { y: financial.Revenue };
          }
        }
        return chartDataPoint;
      });
    }

    if (chartName == "quarterly") {
      // // Find the latest year from the data
      //   const latestYear = this.state.financials.reduce((acc, obj)  => {
      //     return obj.Year > acc ? obj.Year : acc;
      //   }, 0);

      //   // Filter data to get objects corresponding to the latest year
      //   const FinancialYearChartData = this.state.financials.filter(obj => obj.Year === latestYear);
      console.log('selectedQuarterlyKey :: ', this.state.selectedQuarterlyKey);
      let FinancialYearChartData: any = {};
      // let currentYear = 0;
      this.state.financials.forEach((item, index) => {
        if(typeof item.Year === "number"){
          if (item.Year == yearkey) {
            // currentYear = item.Year;
            FinancialYearChartData = item;
          }
        }
      });

      console.log("FinancialYearChartData", FinancialYearChartData);

      if(FinancialYearChartData){
        FinancialChartData = [
          { x: 'Jan', y: FinancialYearChartData.Q1Revenue,  lineData : { y: FinancialYearChartData.Q1Revenue }},
          { x: 'April', y: FinancialYearChartData.Q2Revenue },
          { x: 'July', y: FinancialYearChartData.Q3Revenue },
          { x: 'Oct', y: FinancialYearChartData.Q4Revenue, lineData : { y: FinancialYearChartData.Q4Revenue } },
        ]
      };
      

      // {
      //   const totalRevenue = financial.Q1Revenue;

      //   const chartDataPoint: IVerticalBarChartDataPoint = {
      //     x: financial.Year,
      //     y: totalRevenue,
      //   };
      //   if (isChecked) {
      //       chartDataPoint.lineData = { y: startValue + index * stepSize };
      //   }
      //   return chartDataPoint;
      // }
    }

    this.setState({
      chartData: FinancialChartData,
    });
  }

  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" +
  //     sourceParam;
  // };

  generateChartPoints = () => {
    const { financials } = this.state;

    const barChartPoints: IVerticalBarChartDataPoint[] = financials.map(
      (financial) => {
        const formattedYear = financial.Year.toString().replace(/,/g, "");

        console.log("Original Year:", financial.Year);

        console.log("Formatted Year:", formattedYear);

        const totalRevenue =
          financial.Q1Revenue +
          financial.Q2Revenue +
          financial.Q3Revenue +
          financial.Q4Revenue;
        return { x: formattedYear, y: totalRevenue };
      }
    );

    const startValue = 14000;
    const endValue = 22000;
    const numberOfPoints = barChartPoints.length;

    // Calculate the step size based on the range and the number of points
    const stepSize = (endValue - startValue) / (numberOfPoints - 1);

    const lineChartPoints: IVerticalBarChartDataPoint[] = barChartPoints.map(
      (point, index) => ({
        x: point.x,
        y: startValue + index * stepSize,
        ...(this.state.isChecked && {
          lineData: { y: startValue + index * stepSize },
        }),
      })
    );

    return { barChartPoints, lineChartPoints };
  };

  // public render(): JSX.Element {
  //   const { isChecked, financials } = this.state;

  //   // Assuming financials is an array of objects with properties Year, Q1Revenue, Q2Revenue, Q3Revenue, Q4Revenue
  //   // const points: IVerticalBarChartDataPoint[] = financials.map((financial) => {
  //   //   const totalRevenue = financial.Q1Revenue + financial.Q2Revenue + financial.Q3Revenue + financial.Q4Revenue;
  //   //   return { x: financial.Year.toString(), y: totalRevenue, ...(isChecked && { lineData: { y: totalRevenue + 1000 } }) };
  //   // });

  public render(): JSX.Element {
    // const { financials } = this.state;

    // Assuming financials is an array of objects with properties Year, Q1Revenue, Q2Revenue, Q3Revenue, Q4Revenue
    // const startValue = 14000;
    // const endValue = 22000;
    // const numberOfPoints = financials.length;

    // Calculate the step size based on the range and the number of points
    // const stepSize = (endValue - startValue) / (numberOfPoints - 1);

    // const pointsYearly : IVerticalBarChartDataPoint[] = financials.map((financial, index) => {
    //   const totalRevenue = financial.Q1Revenue + financial.Q2Revenue + financial.Q3Revenue + financial.Q4Revenue;

    // const chartDataPoint: IVerticalBarChartDataPoint = {
    //   x: financial.Year.toString().replace(/,/g, ''),
    //   //x: financial.Year.toString().replace(/,/g, '') as string,
    //   y: totalRevenue,
    // };

    //   if (isChecked) {
    //     chartDataPoint.lineData = { y: startValue + index * stepSize };
    //   }

    //   return chartDataPoint;
    // });

    const handleFinancialGraphDataChange = (
      event: React.FormEvent<HTMLDivElement>,
      options?: IDropdownOption,
      index?: number
    ): void => {
      if (options) {
        console.log('handleFinancialGraphDataChange options :: ', options)
        this.setState({ selectedkeyfinancial: options.key as string });
        this.getChartData(options.key as string, this.state.selectedQuarterlyKey);
      }
    };

    const handleQuarterlyDropdownChange = (
      event: React.FormEvent<HTMLDivElement>,
      options?: IDropdownOption,
      index?: number
    ): void => {
      if (options) {
        console.log('handleQuarterlyDropdownChange options :: ', options)
        this.setState({ selectedQuarterlyKey: options.key });
        this.getChartData(this.state.selectedkeyfinancial, options.key as number);
      }
    };

    // Sample dropdown styles
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 150, fontFamily: "Poppins" },
      title: {
        height: 26,
        borderColor: "#D7DADE",
        color: "#495057",
        fontFamily: "Poppins",
        fontSize: 13,
        lineHeight: 25,
      },
      caretDownWrapper: { lineHeight: 25 },
      dropdownItemSelected: { background: "#E7F3FF", minHeight: 26 },
      dropdownItems: { padding: "10px 0" },
      dropdownItem: { minHeight: 26 },
    };

    const expandImage = require("../../eiAccountDashboardUpdates/assets/ArrowsOut-f.png");

    const location = window.location.href.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    let imgsrc = null;

    let chartDimension = {
      width: "100%",
      height: "100%",
    };

    if (location !== `${siteUrl}/SitePages/Financials.aspx`) {
      imgsrc = { expandImage };
      chartDimension = { width: "100%", height: "220px" };
    }

    return (
      <>
        {urlParams.has("source") && (
          <ul className="breadcrumb">
            <li>
              {/* <a onClick={this.navigateToPreviousPage}>account dashboard</a> */}
              <Link href={`${splitUrl}?accountName=${this.state.companyName}`}>
                account dashboard
              </Link>
            </li>
            <li>Financials</li>
          </ul>
        )}
        <div className={`${styles.financialWrapper} ${urlParams.has("source") ? '' : styles.financialHeight}`}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            className={styles.accountSectionTitle}
          >
            {!urlParams.has("accountid") && this.state.chartData.length > 0 ? (
              <>
                <Text className="tableTitle">Financials</Text>
                <Stack horizontal verticalAlign="center" className="i-gap-5">
                  <Dropdown
                    selectedKey={this.state.selectedQuarterlyKey}
                    placeholder="Select Year"
                    options={this.state.quaterlyOptions}
                    disabled={this.state.selectedkeyfinancial === 'yearly'}
                    styles={dropdownStyles}
                    className="droupdown"
                    onChange={handleQuarterlyDropdownChange}
                  />
                  <Dropdown
                    selectedKey={this.state.selectedkeyfinancial}
                    options={[
                      { key: "yearly", text: "Yearly" },
                      { key: "quarterly", text: "Quarterly" },
                    ]}
                    styles={dropdownStyles}
                    className="droupdown"
                    onChange={handleFinancialGraphDataChange}
                  />
                  <Link
                    href={`${siteUrl}/SitePages/Financials.aspx?accountid=${this.props.event.tryGetValue()}&source=${
                      window.location.href.split("?")[0]
                    }`}
                  >
                    {imgsrc && <Image src={expandImage} />}
                  </Link>
                </Stack>
              </>
            ) : null}
          </Stack>
          <div>
            <div>
              <VerticalBarChart
                chartTitle="Combined Bar and Line Chart"
                data={this.state.chartData}
                barWidth={20}
                useSingleColor={this.state.useSingleColor}
                yAxisTickCount={5}
                colors={["#34C38F", "#74788D"]} // Green for bars, Gray for lines
                hideLegend={true}
                enableReflow={true}
                styles={{
                  root: chartDimension,
                }} 
              />
            </div>
            { this.state.chartData.length === 0 &&
              <Text className="tableTitle">No Data</Text>
            }
          </div>
        </div>
      </>
    );
  }
}
