import * as React from "react";
import styles from "./EngagementDashboardDropdown.module.scss";
import type { IEngagementDashboardDropdownProps } from "./IEngagementDashboardDropdownProps";
import {
  Text,
  Dropdown,
  // IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react";
import "../../common.css";
//import EiAccountService from "../../../services/EiAccountService";
import { ISharedService } from "../../../services/SharedService";
//import { IAccountDetails } from "../../../model/IAccountDetails";
//import { KeyAccountName } from "../../../services/siteconfig";
import { groupBy } from "@microsoft/sp-lodash-subset";
const data = require("./projectData.json");

export interface ComponentStates {
  accountName?: string | null;
  accountDetails: string;
  accountsOptions: Array<any>;
}

export default class EngagementDashboardDropdown extends React.Component<
  IEngagementDashboardDropdownProps,
  ComponentStates,
  {}
> {
  // private eiAccountService: EiAccountService;
  sharedService: ISharedService;

  constructor(props: IEngagementDashboardDropdownProps) {
    super(props);
    this.state = {
      accountName: "",
      accountsOptions: [],
      accountDetails: ""
    };

    // this.eiAccountService = new EiAccountService();
    this.sharedService = this.props.sharedService;
  }

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

  handleAccountChange = (value: any) => {
    //this.setState({accountName: value});
    console.log("Selected Option engagement::", value);
    this.getselectedaccountInfo(value);
  };

  public async getselectedaccountInfo(
    accountname: string | undefined
  ): Promise<void> {
    if (accountname != null) {
      this.setState({ accountName: accountname?.toString() });
      //console.log(accountname);

      // const accountdetails: IAccountDetails =
      //   await this.eiAccountService.getAccountDetails(accountname);
      // //console.log(accountdetails);

      if (accountname) {
        // sessionStorage.setItem(
        //   KeyAccountName,
        //   JSON.stringify(accountdetails.ID)
        // );
        let eventData = {
          accountName: accountname,
          // accountId: JSON.stringify(accountdetails.ID),
        };
        this.props.onEventSelected(eventData);
        this.setState({ accountDetails: accountname });
        console.log("Account details found:", this.state.accountDetails);
      } else {
        this.setState({
          accountDetails: "",
        });
        console.log("No account details found.");
      }
    }
  }

  public render(): React.ReactElement<IEngagementDashboardDropdownProps> {

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
      <section className="accountOverviewSection i-mt-20">
        <div className="blockTitleWrap">
          <div className="titleWrap">
            <Text className={styles.pageTitle}>Engagement Dashboard</Text>
          </div>
          <div className="rightbar">
            <span>
              <Dropdown
                placeholder="Select Account"
                selectedKey={!this.state.accountName ? this.state.accountsOptions[0]?.key : this.state.accountName}
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
      </section>
    );
  }
}
