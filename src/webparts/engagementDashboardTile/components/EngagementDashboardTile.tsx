import * as React from "react";
import type { IEngagementDashboardTileProps } from "./IEngagementDashboardTileProps";
import { Image, Link } from "@fluentui/react";
import "../../common.css";
import { KeyAccountName } from "../../../services/siteconfig";

export interface ComponentStates {
  companyName: string;
}

export default class EngagementDashboardTile extends React.Component<
  IEngagementDashboardTileProps,
  ComponentStates,
  {}
> {
  // private eiAccountService: EiAccountService;
  constructor(props: IEngagementDashboardTileProps) {
    super(props);
    this.state = {
      companyName: "JCI",
    };
  }

  public async componentDidMount(): Promise<void> {
    // Subscribe to the shared service on component mount
    this.props.sharedService.subscribe(this.handleAccountChange);

    console.log("componentDidMount Tile");
    console.log("Data Tile 6nd:: ", this.props.event);
    const data = sessionStorage.getItem(KeyAccountName);
    console.log(
      "Data Tile 7nd:: ",
      data,
      " / ",
      this.props.event.tryGetValue()
    );
  }
  public async componentWillReceiveProps(
    nextProps: IEngagementDashboardTileProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            console.log("Tile overview Data");
            console.log("Tile Data Print2::", this.props.event.tryGetValue());
            // await this.getDescription(nextProps.event.tryGetValue());
            console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  private handleAccountChange = (selectedOption: string) => {
    const AccountNameId = parseInt(selectedOption, 10); // Convert the selected option to the appropriate type
    console.log("engagement tile", AccountNameId);
  };

  public render(): React.ReactElement<IEngagementDashboardTileProps> {
    const CardListing = [
      {
        id: "1",
        name: "Revenue ($)",
        value: "6M",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardRevenue.aspx",
      },
      {
        id: "2",
        name: "BUs Involved",
        value: "5",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/BUsInvolved.aspx",
      },
      {
        id: "3",
        name: "Age (Years)",
        value: "12",
        valueImg: "",
        duration: "",
        image: "",
        url: "",
      },
      {
        id: "4",
        name: "Resourcing",
        value: "37",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardResourcing.aspx",
      },
      {
        id: "5",
        name: "Opportunities",
        value: "6",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Opportunities.aspx",
      },
      {
        id: "5",
        name: "Appreciations ",
        value: "2",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Appreciations.aspx",
      },
      {
        id: "5",
        name: "Escalations",
        value: "5",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Escalations.aspx",
      },
      {
        id: "5",
        name: "Risks",
        value: "5",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Risks.aspx",
      },
      {
        id: "5",
        name: "Programs",
        value: "6",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementDashboardPrograms.aspx",
      },
      {
        id: "5",
        name: "Revenue Leakage",
        value: "4%",
        valueImg: "",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/RevenueLeakage.aspx",
      },
      {
        id: "5",
        name: "Engagement KPIs",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/EngagementKPIs.aspx",
      },
      {
        id: "5",
        name: "Growth Trend",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/GrowthTrend.aspx",
      },
      {
        id: "5",
        name: "CSS Ratings Trend",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/CSSRatingsTrend.aspx",
      },
      {
        id: "5",
        name: "Best Practices",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/BestPractices.aspx",
      },
      {
        id: "5",
        name: "Value Addition",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/ValueAddition.aspx",
      },
      {
        id: "5",
        name: "Strategic Growth Plan",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/StrategicGrowthPlan.aspx",
      },
      {
        id: "5",
        name: "Documents",
        value: "",
        valueImg: require("../assets/checkListImage.png"),
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Documents.aspx",
      },
    ];

    return (
      <section className={`cardSection`}>
        <div className="i-row">
          {CardListing.map((item, index) => {
            return (
              <div key={item.id} className="i-col-2 i-mb-20">
                <Link
                  className="card_border_skyblue"
                  href={`${
                    item.url
                  }?accountName=${this.props.event.tryGetValue()}&source=${
                    window.location.href.split("?")[0]
                  }`}
                >
                  {item.duration && (
                    <span className="card_tag">{item.duration}</span>
                  )}
                  <div className="header_card">
                    <div className="title">{item.name}</div>
                  </div>
                  <div className="body_card">
                    <div className="title_value">
                      {!item.value && item.valueImg ? (
                        <Image src={item.valueImg}></Image>
                      ) : (
                        item.value
                      )}
                    </div>
                    {item.image && (
                      <div className="title_value_chart">
                        <Image src={item.image}></Image>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}
