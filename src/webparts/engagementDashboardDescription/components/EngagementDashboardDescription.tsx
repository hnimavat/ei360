import * as React from "react";
import type { IEngagementDashboardDescriptionProps } from "./IEngagementDashboardDescriptionProps";
import {
  Image,
  Link,
  DefaultButton,
  Dropdown,
  IDropdownStyles
} from "@fluentui/react";
import "../../common.css";
import { KeyAccountName } from "../../../services/siteconfig";
import { IDescription } from "../../../model/IDescription";
import EiAccountService from "../../../services/EiAccountService";
import styles from "./EngagementDashboardDescription.module.scss";
import { IAccountDetails } from "../../../model/IAccountDetails";
import { groupBy } from "@microsoft/sp-lodash-subset";
// import styles from "./EngagementDashboardDescription.module.scss";
const data = require("../../../SampleData/projectData.json");
export interface ComponentStates {
  description: IDescription[];
  companyName: string;
  isChecked: boolean;
  useSingleColor: boolean;
  accountName?: string | null;
  accountDetails: IAccountDetails;
  accountsOptions: Array<any>;
}
export default class EngagementDashboardDescription extends React.Component<
  IEngagementDashboardDescriptionProps,
  ComponentStates,
  {}
> {
  private eiAccountService: EiAccountService;
  constructor(props: IEngagementDashboardDescriptionProps) {
    super(props);
    this.state = {
      isChecked: true,
      useSingleColor: true,
      description: [],
      companyName: "",
      accountName: "",
      accountDetails: {
        ID: 0,
        AccountName: "",
        IndustryType: "",
        Acquisitions: "",
        ParentCompany: "",
        SubsidiaryCompany: "",
        AccountDescription: "",
        Account_Name: ''
      },
      accountsOptions: []
    };
    this.eiAccountService = new EiAccountService();
  }

  public async componentDidMount(): Promise<void> {
    // Subscribe to the shared service on component mount
    // this.props.sharedService.subscribe(this.handleAccountChange);
    const urlParams = new URLSearchParams(window.location.search);
    //const compName = urlParams.get("accountName");
    // console.log("compName::", compName);

    // if (urlParams.has("accountName")) {
    //   this.setState({ accountName: compName });
    // } else {
    //   this.setState({ accountName: "JCI" });
    // }

    console.log("componentDidMount Description");
    // console.log("Data Description 6nd:: ", this.props.event);

    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for description :: ', accountName)

    this.setState({ accountName: accountName });

    const groupByAccount = groupBy(data.data, "clientName"); // call the API for getting the data of account and project
    const accountOption = Object.keys(groupByAccount)
      .slice(0, 25)
      .map((x) => {
        return { key: x, text: x, data: groupByAccount[x] };
      });
    this.setState({
      accountsOptions: accountOption,
    });

    if(accountName) {
      await this.getDescription(accountName);
    } else {
      await this.getDescription(this.props.event.tryGetValue());
    }
    // await this.getAcountDetails(this.props.event.tryGetValue());
  }

  public async componentWillReceiveProps(
    nextProps: IEngagementDashboardDescriptionProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            console.log("Description overview Data");
            console.log(
              "Description Data Print2::",
              this.props.event.tryGetValue()
            );
            console.log('this.props.event.tryGetValue() :: ', this.props.event.tryGetValue())
            console.log('nextProps.event.tryGetValue() :: ', nextProps.event.tryGetValue())
            await this.getDescription(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }


  public async getDescription(AccountName: string): Promise<void> {
    try {
      console.log('AccountName :: ', AccountName)
      const description: IDescription[] =
        await this.eiAccountService.getEngagementDescriptionName(AccountName); // Update this line with your SharePoint API call

      console.log(
        "description AttachmentFiles::",
        description[0]?.AttachmentFiles,
        description
      );

      this.setState({
        description,
        companyName: description[0]?.Account_Name?.Account_Name || "",
        //accountName: description[0]?.AccountName?.AccountName || "",
      });
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  }

  handleAccountChange = (value: any) => {
    //this.setState({accountName: value});
    console.log("Selected Option2::", value);
    this.getselectedaccountInfo(value);
  };

  public async getselectedaccountInfo(
    accountname: string | undefined
  ): Promise<void> {
    if (accountname != null) {
      this.setState({ accountName: accountname?.toString() });
      //console.log(accountname);

      const accountdetails: IAccountDetails =
        await this.eiAccountService.getAccountDetails(accountname);
      //console.log(accountdetails);

      if (accountdetails) {
        sessionStorage.setItem(
          KeyAccountName,
          JSON.stringify(accountdetails.ID)
        );
        let eventData = {
          accountName: accountname,
          accountId: JSON.stringify(accountdetails.ID),
        };
        console.log("Event Data2::", eventData, accountdetails);
        this.setState({ accountDetails: accountdetails });
        // alert("alert:" + this.state.accountDetails.ID);
        this.getDescription(accountdetails.AccountName);

        this.props.onEventSelected(eventData);
        // this.setState({ accountDetails: accountdetails });

        console.log("Account details found2:", this.state.accountDetails);
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
            Account_Name: '-'
          },
        });
        console.log("No account details found.");
      }
    }
  }

  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" +
  //     sourceParam;
  // };

  public render(): React.ReactElement<IEngagementDashboardDescriptionProps> {
    const { description } = this.state;
    console.log("render description", description);

    const expandImage = require("../../eiAccountDashboardUpdates/assets/ArrowsOut-f.png");

    const location = window.location.href.split("?")[0];
    let urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    // const SourceUrl = urlParams.get("source");
    // const splitUrl = SourceUrl?.split("?")[0];

    console.log(
      "urlParams AttachmentFiles::",
      this.state.companyName,
      this.state.accountName
    );

    // let imgsrc = null;

    if (
      location != `${siteUrl}/SitePages/engagementDashboardDescription.aspx`
    ) {
      // imgsrc = { expandImage };
    }


    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: "Poppins" },
      title: {
        height: 40,
        borderColor: "#D7DADE",
        color: "#495057",
        fontFamily: "Poppins",
        fontSize: 13,
        lineHeight: 37,
      },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: "#E7F3FF" },
    };

    return (
      <section>
        {urlParams.has("source") && urlParams.has("accountName") ? (
          <div className="d-flex justify-between align-items-center">
            <ul className="breadcrumb">
              <li>
                {/* <a onClick={this.navigateToPreviousPage}>engagement dashboard</a> */}
                <Link
                  href={`${siteUrl}/SitePages/Engagement_Dashboard.aspx?accountName=${this.state.accountName}`}
                >
                  engagement dashboard
                </Link>
              </li>
              <li>engagement description</li>
            </ul>
            <div className="d-flex i-gap-10">
              <DefaultButton
                className="btn-primary"
                text="Edit"
                href={`${siteUrl}/SitePages/DescriptionEdit.aspx?accountName=${this.state.accountName
                  }&source=${window.location.href.split("?")[0]}`}
              />
              <div className={styles.dropdownWidth}>
                <Dropdown
                  selectedKey={this.state.accountName}
                  options={this.state.accountsOptions}
                  styles={dropdownStyles}
                  className="droupdown"
                  onChange={(event, value) =>
                    this.handleAccountChange(value?.key)
                  }
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="i-card engagementDescription mt-0">

          <div className="i-card-header">
            <div className="i-card-title">Engagement Description</div>
            {!urlParams.has("source") && this.state.description.length > 0 ? (
              <Link
                href={`${siteUrl}/SitePages/engagementDashboardDescription.aspx?accountName=${this.props.event.tryGetValue()}&source=${window.location.href.split("?")[0]
                  }`}
              > 
                <Image src={expandImage} />
              </Link>
            ) : null}
          </div>

          <div className="i-card-body">
            <div className={`inner_wrap ${urlParams.has("source") ? '' : styles.descriptionHeight}`} >
              <ul className="dotted_listing">
                {description.map((item, index) => (
                  <li key={index}>
                    <span
                      dangerouslySetInnerHTML={{ __html: item.Description }}
                    />
                  </li>
                ))}
              </ul>
              {description[0]?.AttachmentFiles.map((item, i) => {
                console.log(
                  "item",
                  "https://aixtor.sharepoint.com/" + item.ServerRelativeUrl
                );
                return (
                  <Image
                    key={i}
                    src={`https://aixtor.sharepoint.com/${item.ServerRelativeUrl}`}
                  ></Image>
                );
              })}

              {/* <Image src={img1}></Image>
                <Image src={img2}></Image> */}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
