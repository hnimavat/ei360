import * as React from "react";
import styles from "./EiAccountDashboardDivisions.module.scss";
import "../../common.css";
import type { IEiAccountDashboardDivisionsProps } from "./IEiAccountDashboardDivisionsProps";
import { Text, Stack, Image, Link } from "@fluentui/react";
import EiAccountService from "../../../services/EiAccountService";
import { IDivisions } from "../../../model/IDivisions";
import { KeyAccountName } from "../../../services/siteconfig";
// import { IAccountDetails } from "../../../model/IAccountDetails";

export interface ComponentStates {
  divisions: IDivisions[];
  companyName: string;
}

export default class EiAccountDashboardDivisions extends React.Component<
  IEiAccountDashboardDivisionsProps,
  ComponentStates
> {
  private eiAccountService: EiAccountService;

  constructor(props: IEiAccountDashboardDivisionsProps) {
    super(props);
    this.state = {
      divisions: [],
      companyName: "",
    };

    this.eiAccountService = new EiAccountService();
  }

  public async componentDidMount(): Promise<void> {
    // Subscribe to the shared service on component mount
    // this.props.sharedService.subscribe(this.handleAccountChange);

    console.log("componentDidMount Division");
    // console.log("Data Division1 6nd:: ", this.props.event);
    const data = sessionStorage.getItem(KeyAccountName);
    console.log("Data Division1 6nd:: ", data,this.props.event.tryGetValue());
    await this.getDivisionsByAccName(this.props.event.tryGetValue());
    // await this.getAcountDetails(this.props.event.tryGetValue());
  }

  public async componentWillReceiveProps(
    nextProps: IEiAccountDashboardDivisionsProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            console.log("Division componentWillReceiveProps");
            // console.log(
            //   "Division Data componentWillReceiveProps::",
            //   this.props.event.tryGetValue()
            // );
            await this.getDivisionsByAccName(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  // Update the Divisions when the selected account changes
  // private handleAccountChange = (selectedOption: string) => {
  //   const AccountNameId = parseInt(selectedOption, 10); // Convert the selected option to the appropriate type
  //   console.log("Division handleAccountChange::", AccountNameId);
  //   this.getDivisions(AccountNameId);
  // };

  // public async getAcountDetails(AccountNameId: number): Promise<void> {
  //   // Use your SharePoint service or API to account data
  //   try {
  //     const accountdetails: IAccountDetails =
  //       await this.eiAccountService.getAccountDetailsById(AccountNameId); // Update this line with your SharePoint API call
  //     // alert("hii getDivisions");
  //     console.log("divisions2 accountdetails::", accountdetails);
  //     // this.setState({ divisions });
  //   } catch (error) {
  //     console.error("Error fetching divisions:", error);
  //   }
  // }

  public async getDivisionsByAccName(accountName: string): Promise<void> {
    if (!accountName) {
      console.error("Account name is undefined or empty.");
      return;
    }

    const modifiedAccountName = accountName.replace(/"/g, "'");
    const divisions: IDivisions[] = await this.eiAccountService.getListDataWithFilter('Divisions', `Account_Name eq ${modifiedAccountName}`);
    console.log('Devisions :: ', divisions);
    // this.setState({
    //   companyName: divisions[0]?.AccountName?.AccountName || "",
    // });
    this.setState({ 
      divisions: divisions,
      companyName: accountName.replace(/"/g, "")
    });
  }

  

  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" +
  //     sourceParam;
  // };

  public render(): React.ReactElement<IEiAccountDashboardDivisionsProps> {
    const { divisions } = this.state;
    const expandImage = require("../../eiAccountDashboardUpdates/assets/ArrowsOut-f.png");

    const location = window.location.href.split("?")[0];
    let urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];

    // let sUrl = "";
    console.log("urlParams divisions::", divisions, this.state.companyName);
    // if (urlParams.has("source")) {
    //   console.log("if url::", window.location.href);
    //   urlParams = new URLSearchParams(window.location.search);
    // } else {
    //   console.log(
    //     "else url::",
    //     window.location.origin + window.location.pathname
    //   );
    //   urlParams = new URLSearchParams(window.location.origin + window.location.pathname);
    // }
    // let imgsrc = null;[]

    if (location != `${siteUrl}/SitePages/Divisions.aspx`) {
      // imgsrc = { expandImage };
    }
    return (
      <section>
        {urlParams.has("source") && (
          <ul className="breadcrumb">
            <li>
              {/* <a onClick={this.navigateToPreviousPage}>account dashboard</a> */}
              <Link href={`${splitUrl}?accountName=${this.state.companyName}`}>
                account dashboard
              </Link>
            </li>
            <li>Divisions</li>
          </ul>
        )}
        <div className={styles.divisionWrapper}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            className={styles.accountSectionTitle}
          >
            {!urlParams.has("accountid") && divisions.length > 0 ? (
              <>
                <Text className="tableTitle">Divisions</Text>
                <Link
                  href={`${siteUrl}/SitePages/Divisions.aspx?accountid=${this.props.event.tryGetValue()}&source=${
                    window.location.href.split("?")[0]
                  }`}
                >
                  <Image src={expandImage} />
                </Link>
              </>
            ) : null}
          </Stack>
          {divisions.length > 0 ? (
            <ul className={`formWrap ${urlParams.has("source") ? '' : styles.divisionHeight}`}>
              {divisions.map((item, index) => (
                <li key={index}>
                  <span className={styles.list}>{item.Division}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Text className="tableTitle">No Data</Text>
          )}
        </div>
      </section>
    );
  }
}
