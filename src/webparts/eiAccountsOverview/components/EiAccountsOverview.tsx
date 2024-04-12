import * as React from "react";
import styles from "./EiAccountsOverview.module.scss";
import type { IEiAccountsOverviewProps } from "./IEiAccountsOverviewProps";
import "../../common.css";
import {
  Text,
  DefaultButton,
  PrimaryButton,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react";
import { IAccountDetails } from "../../../model/IAccountDetails";
//import { KeyAccountName } from "../../../services/siteconfig";
import EiAccountService from "../../../services/EiAccountService";
import { ISharedService } from "../../../services/SharedService"; // Import the shared service interface
//import { uniqBy } from "lodash";
import { groupBy } from "@microsoft/sp-lodash-subset";
// import { IDivisions } from "../../../model/IDivisions";

// Component's States Interface
export interface ComponentStates {
  readMore: boolean;
  accountName?: string | null;
  accountDetails: IAccountDetails;
  accountsOptions: IDropdownOption[];
}

const data = require("../../../SampleData/projectData.json");

export default class EiAccountsOverview extends React.Component<
  IEiAccountsOverviewProps,
  ComponentStates,
  {}
> {
  private eiAccountService: EiAccountService;
  sharedService: ISharedService;
  //private sharedService: ISharedService;

  constructor(props: IEiAccountsOverviewProps) {
    super(props);
    this.state = {
      readMore: true,
      accountName: "",
      accountDetails: {
        ID: 0,
        AccountName: "",
        IndustryType: "",
        Acquisitions: "",
        ParentCompany: "",
        SubsidiaryCompany: "",
        AccountDescription: "",
        Account_Name:''
      },
      accountsOptions:[]
    };

    this.eiAccountService = new EiAccountService();
    this.sharedService = this.props.sharedService;
  }

  readMoreStyle = {};

  public async componentDidMount(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const compName = urlParams.get("accountName");
    console.log("compName::", compName);

    const groupByAccount = groupBy(data.data, "clientName"); // call the API for getting the data of account and project
    const accountOption = Object.keys(groupByAccount)
      .slice(0, 25)
      .map((x) => {
        return { key: x, text: x, data: groupByAccount[x] };
      });

    this.setState({
      accountsOptions: accountOption,
    });

    if (urlParams.has("accountName")) {
      this.setState({ accountName: compName });
    } else {
      this.setState({ accountName: accountOption.length > 0 ? accountOption[0].key : ''});
    }

    if (!compName && accountOption.length > 0) {
      // Triggering handleAccountChange with the key of the first option
      this.handleAccountChange(accountOption[0].key);
    }

    // if (urlParams.has("accountName")) {
    //   this.setState({ accountName: compName });
    // } else {
    //   this.setState({ accountName: accountOption.length > 0 ? accountOption[0].key : '' });
    // }

    // let accounts = uniqBy(data.data, "clientName"); //call API for Dynamic Data, currently we are using json file
    // this.setState({
    //   accountsOptions: accounts.map((e:any)=> {return {key: e.clientName, text: e.clientName}})
    // })

    //sessionStorage.setItem(KeyAccountName, JSON.stringify(2));
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    // Check if the accountDetails state has changed
    if (prevState.accountName !== this.state.accountName) {
      // Perform actions here
      //console.log('accountDetails state has been updated:', this.state.accountDetails);
      this.getselectedaccountInfo(this.state.accountName || "");
    }
  }

  // Event handler for updating state when a TextField value changes
  handleAccountChange = (value: any) => {
    //this.setState({accountName: value});
    console.log("Selected Option::", value);
    this.getselectedaccountInfo(value);
  };

  public async getselectedaccountInfo(
    accountname: string | undefined
  ): Promise<void> {
    if (accountname != null) {
      this.setState({ accountName: accountname });
      //console.log(accountname);

      const accountdetails: IAccountDetails = await this.eiAccountService.getAccountDetails(accountname);
      console.log(accountdetails);

      

      if (accountdetails) {
        // sessionStorage.setItem(
        //   KeyAccountName,
        //   JSON.stringify(accountdetails.ID)
        // );
        let eventData = {
          accountName: accountname,
          accountId: JSON.stringify(accountdetails.Account_Name),
        };
        this.props.onEventSelected(eventData);
        this.setState({ accountDetails: accountdetails });
        console.log("Account details found:", this.state.accountDetails);
      } else {
        this.setState({
          accountDetails: {
            ID: 0,
            AccountName: "-",
            IndustryType: "-",
            Acquisitions: "-",
            ParentCompany: "-",
            SubsidiaryCompany: "-",
            AccountDescription: "-",
            Account_Name:'-'
          },
        });

        let eventData = {
          accountId: JSON.stringify(accountname),
        };
        this.props.onEventSelected(eventData);
        console.log("No account details found.");
      }
    }
  }

  doSomething = (e: any) => {
    e.preventDefault();
    this.setState((prevState) => ({
      readMore: !prevState.readMore,
    }));
  };

  public render(): React.ReactElement<IEiAccountsOverviewProps> {
    // const options: IDropdownOption[] = [
    //   { key: "JCI", text: "JCI" },
    //   { key: "Collins Aerospace", text: "Collins Aerospace" },
    //   { key: "Dover Digital", text: "Dover Digital" },
    //   { key: "Comcast", text: "Comcast" },
    // ];

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 210, fontFamily: "Poppins" },
      title: {
        height: 40,
        borderColor: "#D7DADE",
        color: "#495057",
        fontFamily: "Poppins",
        fontSize: 13,
        lineHeight: 37,
      },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: "#E7F3FF", minHeight: 26 },
      dropdownItems: { padding: "7px 0" },
      dropdownItem: { minHeight: 26 },
    };

    return (
      <section className="accountOverviewSection">
        <div className="blockTitleWrap">
          <div className="titleWrap">
            <Text className={styles.pageTitle}>Account Overview</Text>
          </div>
          <div className="rightbar">
            <span>
              <DefaultButton
                text="View Report"
                className="btn-outline"
              ></DefaultButton>
            </span>
            <span>
              <PrimaryButton
                text="Edit Account"
                className="btn-primary"
                href={`https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Edit_Account.aspx?accountName=${
                  this.state.accountName
                }&source=${window.location.href.split("?")[0]}`}
              ></PrimaryButton>
            </span>
            <span>
              <Dropdown
                selectedKey={this.state.accountName}
                options={this.state.accountsOptions}
                styles={dropdownStyles}
                className="droupdown"
                onChange={(event, value) =>
                  this.handleAccountChange(value?.key)
                }
              />
            </span>
          </div>
        </div>

        <div className="i-card">
          <div className="accountOverview_cardbody">
            <ul>
              <li>
                <div className="i-form-group-view">
                  <div className="i-view-label">Industry Type</div>
                  <div className="i-view-value">
                    {this.state.accountDetails.IndustryType}
                  </div>
                </div>
              </li>
              <li>
                <div className="i-form-group-view">
                  <div className="i-view-label">Acquisitions</div>
                  <div className="i-view-value">
                    {this.state.accountDetails.Acquisitions !== null
                      ? this.state.accountDetails.Acquisitions
                      : "-"}
                  </div>
                </div>
              </li>
              <li>
                <div className="i-form-group-view">
                  <div className="i-view-label">Parent Company</div>
                  <div className="i-view-value">
                    {this.state.accountDetails.ParentCompany !== null
                      ? this.state.accountDetails.ParentCompany
                      : "-"}
                  </div>
                </div>
              </li>
              <li>
                <div className="i-form-group-view">
                  <div className="i-view-label">Subsidiary Company</div>
                  <div className="i-view-value">
                    {this.state.accountDetails.SubsidiaryCompany !== null
                      ? this.state.accountDetails.SubsidiaryCompany
                      : "-"}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="i-form-group-view">
            <div className="i-view-label">Account Description</div>
            <div className="i-view-desc">
              <p>
                <span
                  className={
                    this.state.readMore == false ? "readMore" : "readless"
                  }
                >
                  {this.state.accountDetails.AccountDescription !== null
                    ? this.state.accountDetails.AccountDescription
                    : "-"}
                </span>
                {this.state.accountDetails.AccountDescription?.length > 500 && (
                  <a
                  href="javascript:void(0)"
                  onClick={this.doSomething}
                  className="i-link-readmore"
                  title="Read Less"
                >
                  {this.state.readMore == false ? " Read Less" : "Read More"}
                </a>
                )} 
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
