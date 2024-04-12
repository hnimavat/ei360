import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";
import "../../common.css";
import { Stack, Image, Text, Link } from "@fluentui/react";
import styles from "./EiAccountDashboardCustomerStakeholders.module.scss";
import type { IEiAccountDashboardCustomerStakeholdersProps } from "./IEiAccountDashboardCustomerStakeholdersProps";
import { KeyAccountName } from "../../../services/siteconfig";
import EiAccountService from "../../../services/EiAccountService";
import { ICustomersStackholders } from "../../../model/ICustomersStackholders";

const Container = styled.div`
  display: inline-block;
  border-radius: 10px;
  width: 100%;
  overflow: scroll;
`;

const UserBox = styled.div`
  border: 2px solid #34c38f;
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff2f7;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const UserName = styled.div`
  font-family: "Poppins";
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  color: #343a40;
`;

const UserRole = styled.div`
  font-family: "Poppins";
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  color: #343a40;
  text-wrap: nowrap;
  width: 125px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ToolTip = styled.div``;
const Name = styled.div``;
const Designation = styled.div``;
const BusinessUnit = styled.div``;
const RelationwithEIC = styled.div``;
const Status = styled.div``;

interface ComponentStates {
  customerstackholders: ICustomersStackholders[];
  companyName: string;
}

export default class EiAccountDashboardCustomerStakeholders extends React.Component<
  IEiAccountDashboardCustomerStakeholdersProps,
  ComponentStates,
  {}
> {
  private eiAccountService: EiAccountService;

  constructor(props: IEiAccountDashboardCustomerStakeholdersProps) {
    super(props);
    this.state = {
      customerstackholders: [],
      companyName: '',
    };

    this.eiAccountService = new EiAccountService();
  }

  public async componentDidMount(): Promise<void> {
    console.log("componentDidMount CustomerStakeholders");
    const data = sessionStorage.getItem(KeyAccountName);
    console.log(data);
    await this.getCustomersStackholders(this.props.event.tryGetValue());
  }

  public async componentWillReceiveProps(
    nextProps: IEiAccountDashboardCustomerStakeholdersProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            // console.log(
            //   "CustomerStakeholders Data Print2::",
            //   this.props.event.tryGetValue()
            // );
            await this.getCustomersStackholders(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  public async getCustomersStackholders(AccountName: string): Promise<void> {
    if (!AccountName) {
      console.error("Account name is undefined or empty.");
      return;
    }

    const modifiedAccountName = AccountName.replace(/"/g, "'");
    const customerstackholders: ICustomersStackholders[] =
      await this.eiAccountService.getListDataWithFilter('Customer_Stakeholder', `Account_Name eq ${modifiedAccountName}`);;
    console.log("Customerstackholders :: ", customerstackholders);

    const organizecustomerstackholders =
      this.organizeDataIntoTree(customerstackholders);

    this.setState({
      customerstackholders: organizecustomerstackholders,
      companyName: AccountName.replace(/"/g, ""),
    });
  }

  organizeDataIntoTree = (
    data: ICustomersStackholders[]
  ): ICustomersStackholders[] => {
    const map = new Map<number, ICustomersStackholders>();

    // Create a map where keys are node IDs and values are the node objects
    data.forEach((node) => {
      map.set(node.ID, { ...node, Children: [] });
    });

    // Iterate over the data again to build the tree
    data.forEach((node) => {
      const parentNode = map.get(node.ReportToId || 0); // Use 0 if ReportToId is null
      if (parentNode) {
        parentNode.Children.push(map.get(node.ID)!);
      }
    });

    // Find the root nodes (nodes without a parent)
    const rootNodes: ICustomersStackholders[] = [];
    data.forEach((node) => {
      if (!node.ReportToId) {
        rootNodes.push(map.get(node.ID)!);
      }
    });

    return rootNodes;
  };

  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" +
  //     sourceParam;
  // };

  renderTreeNodes = (data: ICustomersStackholders[]) => {
    //debugger;
    //const profileImageUrl = require('../assets/vijay.png');
    return data.map((user) => (
      <TreeNode
        key={user.ID} // Make sure to use a unique key
        label={
          <UserBox
            className={`${styles.profileWrapper} ${
              (styles as any)[
                user.RelationwithEIC.replace(/ /g, "").toLowerCase()
              ]
            }`}
          >
            {/*<ProfileImage src={profileImageUrl} alt="Profile" /> */}
            <ProfileImage
              src={`https://aixtor.sharepoint.com${
                user.Profile != null
                  ? user.Profile
                  : "/sites/InfoHub360/SiteAssets/Lists/d37a6df1-e19a-4583-86a7-e80d35496408/vijay.png"
              }`}
              alt="Profile"
            />
            {/*<ProfileImage src={stackholder.Photo.serverRelativeUrl} alt="Profile" /> */}

            <UserDetails>
              <UserName>{user.FullName}</UserName>
              <UserRole>{user.Designation}</UserRole>
            </UserDetails>
            <ToolTip className={styles.tooltipWrap}>
              <Name className={styles.name}>{user.FullName}</Name>
              <Designation className={styles.designation}>
                {user.Designation}
              </Designation>
              <BusinessUnit className={styles.name}>
                {user.BusinessUnit}
              </BusinessUnit>
              <RelationwithEIC
                className={`${styles.status} ${
                  (styles as any)[
                    user.RelationwithEIC.replace(/ /g, "").toLowerCase()
                  ]
                }`}
              >
                {user.RelationwithEIC}
              </RelationwithEIC>
              <Status
                className={`${
                  (styles as any)[(user.Status || "").toLowerCase()]
                }`}
              >
                {user.Status}
              </Status>
            </ToolTip>
          </UserBox>
        }
      >
        {(user.Children &&
          user.Children.length > 0 &&
          this.renderTreeNodes(user.Children)) ||
          null}
      </TreeNode>
    ));
  };

  public render(): React.ReactElement<IEiAccountDashboardCustomerStakeholdersProps> {
    const { customerstackholders } = this.state;
    //const profileImageUrl = require('../assets/vijay.png');
    const expandImage = require("../../eiAccountDashboardUpdates/assets/ArrowsOut-f.png");

    const location = window.location.href.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    // console.log(
    //   "customerstackholders render",
    //   customerstackholders,
    //   customerstackholders.length
    // );
    let imgsrc = null;

    if (location !== `${siteUrl}/SitePages/Customer(1).aspx`) {
      imgsrc = { expandImage };
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
            <li>Customer Stakeholders</li>
          </ul>
        )}

        <section className={`${styles.updatesWrapper} ${urlParams.has("source") ? '' : styles.updatesWrapperHeight}`}>
          <Stack 
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            className={styles.accountSectionTitle}
          >
            {!urlParams.has("accountid") && customerstackholders.length > 0 ? (
              <>
                <Text className="tableTitle">Customer Stakeholders</Text>

                <Link
                  href={`${siteUrl}/SitePages/Customer(1).aspx?accountid=${this.props.event.tryGetValue()}&source=${
                    window.location.href.split("?")[0]
                  }`}
                >
                  {imgsrc && <Image src={expandImage} />}
                </Link>
              </>
            ) : null}
          </Stack>
          {customerstackholders.length > 0 ? (
            <Container className={`${styles.treeWrapper} ${urlParams.has("source") ? '' : styles.treeHeight}`}>
              <Tree
                lineWidth={"1px"}
                lineColor={"#495057"}
                lineBorderRadius={"10px"}
                label={
                  <UserBox
                    className={`${styles.profileWrapper} ${
                      (styles as any)[
                          customerstackholders[0]?.RelationwithEIC.replace(/ /g, "").toLowerCase()
                      ]
                    }`}
                  >
                    <ProfileImage
                    src={`https://aixtor.sharepoint.com${
                      customerstackholders.length > 0 &&
                      customerstackholders[0].Profile != null
                        ? customerstackholders[0].Profile
                        : "/sites/InfoHub360/SiteAssets/Lists/d37a6df1-e19a-4583-86a7-e80d35496408/vijay.png"
                    }`}
                    alt="Profile"
                  />
                    {/*<ProfileImage src={profileImageUrl} alt="Profile" />*/}
                    {/* <ProfileImage src={customerstackholders[0]?.Photo.serverRelativeUrl} alt="Profile" />  */}

                    <UserDetails>
                      <UserName>{customerstackholders[0]?.FullName}</UserName>
                      <UserRole>
                        {customerstackholders[0]?.Designation}
                      </UserRole>
                    </UserDetails>
                    <ToolTip
                      className={`${styles.tooltipWrap} ${styles.tooltipRight}`}
                    >
                      <Name className={styles.name}>
                        {customerstackholders[0]?.FullName}
                      </Name>
                      <Designation className={styles.designation}>
                        {customerstackholders[0]?.Designation}
                      </Designation>
                      <BusinessUnit className={styles.name}>
                        {customerstackholders[0]?.BusinessUnit}
                      </BusinessUnit>
                      <RelationwithEIC
                        className={`${styles.status} ${
                          (styles as any)[
                            customerstackholders[0]?.RelationwithEIC.replace(/ /g, "").toLowerCase()
                          ]
                        }`}
                      >
                        {customerstackholders[0]?.RelationwithEIC}
                      </RelationwithEIC>
                      <Status
                        className={`${
                          (styles as any)[
                            customerstackholders[0]?.RelationwithEIC.replace(/ /g, "").toLowerCase()
                          ]
                        }`}
                      >
                        {customerstackholders[0]?.Status}
                      </Status>
                    </ToolTip>
                  </UserBox>
                }
              >
                {(customerstackholders.length > 0 &&
                  customerstackholders[0].Children &&
                  customerstackholders[0].Children.length > 0 &&
                  this.renderTreeNodes(customerstackholders[0].Children)) ||
                  null}
              </Tree>
            </Container>
          ) : (
            <Text className="tableTitle">No Data</Text>
          )}
        </section>
      </>
    );
  }
}
