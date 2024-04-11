import * as React from "react";
import type { IEiAccountDashboardCompetitorsProps } from "./IEiAccountDashboardCompetitorsProps";
import styles from "./EiAccountDashboardCompetitors.module.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/primereact.css";
import "./datatableDesign.css";
import { Text, Stack, Image, Link } from "@fluentui/react";
import EiAccountService from "../../../services/EiAccountService";
import { ICompetitors } from "../../../model/ICompetitors";
import { KeyAccountName } from "../../../services/siteconfig";

export interface ComponentStates {
  competitors: ICompetitors[];
  companyName: string;
}

export default class EiAccountDashboardCompetitors extends React.Component<
  IEiAccountDashboardCompetitorsProps,
  ComponentStates,
  {}
> {
  private eiAccountService: EiAccountService;

  constructor(props: IEiAccountDashboardCompetitorsProps) {
    super(props);
    this.state = {
      competitors: [],
      companyName: '',
    };

    this.eiAccountService = new EiAccountService();
  }

  public async componentDidMount(): Promise<void> {
    console.log("componentDidMount Competitors");
    const data = sessionStorage.getItem(KeyAccountName);
    console.log("Data Competitors 2:: ", data);
    await this.getCompetitorsByAccName(this.props.event.tryGetValue());
  }

  public async componentWillReceiveProps(
    nextProps: IEiAccountDashboardCompetitorsProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            console.log("Competitors overview Data");
            // console.log(
            //   "Competitors Data Print2::",
            //   this.props.event.tryGetValue()
            // );
            await this.getCompetitorsByAccName(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  public async getCompetitorsByAccName(accountName: string): Promise<void> {
    if (!accountName) {
      console.error("Account name is undefined or empty.");
      return;
    }

    const modifiedAccountName = accountName.replace(/"/g, "'");
    const competitors: ICompetitors[] = await this.eiAccountService.getListDataWithFilter('Competitors', `Account_Name eq ${modifiedAccountName}`);
    console.log('Competitors :: ', competitors);

    this.setState({
      competitors: competitors,
      companyName: accountName.replace(/"/g, ""),
    });
  }

  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" +
  //     sourceParam;
  // };
  public render(): React.ReactElement<IEiAccountDashboardCompetitorsProps> {
    const expandImage = require("../../eiAccountDashboardUpdates/assets/ArrowsOut-f.png");

    const location = window.location.href.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    let imgsrc = null;

    if (location != `${siteUrl}/SitePages/Compe.aspx`) {
      imgsrc = { expandImage };
    }
    const rowsPerPage = 5;

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
            <li>Competitors</li>
          </ul>
        )}

        <section className={styles.financialWrapper}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            className={styles.accountSectionTitle}
          >
            {!urlParams.has("accountid") &&
            this.state.competitors.length > 0 ? (
              <>
                <Text className="tableTitle">Competitors</Text>

                <Link
                  href={`${siteUrl}/SitePages/Compe.aspx?accountid=${this.props.event.tryGetValue()}&source=${
                    window.location.href.split("?")[0]
                  }`}
                >
                  {imgsrc && <Image src={expandImage} />}
                </Link>
              </>
            ) : null}
          </Stack>
          {this.state.competitors.length > 0 ? (
            <DataTable
              value={this.state.competitors}
              scrollable
              paginator={this.state.competitors.length > rowsPerPage}
              rows={rowsPerPage}
            >
              <Column
                field="Category"
                header="Engagement Area"
                filter
                style={{ minWidth: "204px" }}
              ></Column>
              <Column
                field="Name"
                header="Name"
                filter
                style={{ minWidth: "135px" }}
              ></Column>
              <Column
                field="TeamSize"
                header="Team Size"
                filter
                style={{ minWidth: "120px" }}
                align={"right"}
              ></Column>
            </DataTable>
          ) : (
            <Text className="tableTitle">No Data</Text>
          )}
        </section>
      </>
    );
  }
}
