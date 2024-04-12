import * as React from "react";
import type { IEiEditAccountProps } from "./IEiEditAccountProps";
import styles from "./EiEditAccount.module.scss";
import { TabView, TabPanel } from "primereact/tabview";
import {
  Stack,
  Text,
  Image,
  FontIcon,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  mergeStyleSets,
  IStackProps,
  IButtonStyles,
  DefaultButton,
  FocusTrapZone,
  Layer,
  Overlay,
  Popup,
  TextField,
  ITextFieldStyles,
  IStackTokens,
  Separator,
  Link,
  ComboBox,
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react";
import "../../common.css";
import { DataTable } from "primereact/datatable";
import { Calendar } from 'primereact/calendar';
import { Column } from "primereact/column";
import "primereact/resources/primereact.css";
import "../../eiAccountDashboardCompetitors/components/datatableDesign.css";
import { paramaccountname } from "../../../services/siteconfig";
import { IAccountDetails } from "../../../model/IAccountDetails";
import { IDivisions } from "../../../model/IDivisions";
import { IFinancials } from "../../../model/IFinancials";
import { ICompetitors } from "../../../model/ICompetitors";
import EiAccountService from "../../../services/EiAccountService";
import { ICustomersStackholders } from "../../../model/ICustomersStackholders";
import { classNames } from "primereact/utils";
import { Toaster, toast } from "react-hot-toast";

const jsonData = require("../../../SampleData/projectData.json");

const optionsCompetitors: IDropdownOption[] = [
  { key: "fixedcost", text: "Fixed Cost" },
];

const optionsCustomerStakeholders: IDropdownOption[] = [
  { key: "need_to_establish", text: "Need to Establish" },
  { key: "favourable", text: "Favourable" },
  { key: "unfavourable", text: "Unfavourable" },
  { key: "neutral", text: "Neutral" },
];

let optionsReportTo: IDropdownOption[] = [];

const addFinancials: IDropdownOption[] = [
  { key: '2010', text: '2010' },
  { key: '2011', text: '2011' },
  { key: '2012', text: '2012' },
  { key: '2013', text: '2013' },
  { key: '2014', text: '2014' },
  { key: '2015', text: '2015' },
  { key: '2016', text: '2016' },
  { key: '2017', text: '2017' },
  { key: '2018', text: '2018' },
  { key: '2019', text: '2019' },
  { key: '2020', text: '2020' },
  { key: '2021', text: '2021' },
  { key: '2022', text: '2022' },
  { key: '2023', text: '2023' },
  { key: '2024', text: '2024' },
  { key: '2025', text: '2025' },
];
const optionsBU: IDropdownOption[] = [{ key: "digital", text: "Digital" }];

export interface IEiEditAccountState {
  showPopup: boolean;
  viewCompetitorsPopup: boolean;
  accountDetails: IAccountDetails;
  divisions: IDivisions[];
  updatedivision: IDivisions;
  selectedkeydivisions: string;
  financials: IFinancials[];
  updatefinancials: IFinancials;
  selectedkeyfinancial: any;
  competitors: ICompetitors[];
  updatecompetitors: ICompetitors;
  selectedkeycompetitors: string;
  customerstackholders: ICustomersStackholders[];
  updatecustomerstackholders: ICustomersStackholders;
  selectedkeyrelationwitheic: string;
  selectedkeyreportto: string;
  selectedkeybusinessunit: string;
  isTouched: boolean;
  profile: any;
  profileUrl: any;
  profileErrorMsg: any;
  companyName: string;
  projectOptions: any;
  financialDuration: string;
}

export default class EiEditAccount extends React.Component<
  IEiEditAccountProps,
  IEiEditAccountState,
  {}
> {
  private eiAccountService: EiAccountService;

  constructor(props: IEiEditAccountProps) {
    super(props);

    this.state = {
      showPopup: false,
      viewCompetitorsPopup: false,
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
      divisions: [],
      updatedivision: {
        ID: 0,
        Division: "",
        BU: "",
        Programs: "",
        AccountNameId: 0,
        AccountName: undefined,
        Account_Name: '',
        Description: '',
      },
      selectedkeydivisions: "",
      financials: [],
      updatefinancials: {
        ID: 0,
        Year: new Date().getFullYear(),
        Revenue: 0,
        Q1Revenue: 0,
        Q2Revenue: 0,
        Q3Revenue: 0,
        Q4Revenue: 0,
        AccountNameId: 0,
        AccountName: undefined,
        Account_Name: '',
      },
      selectedkeyfinancial: "",
      competitors: [],
      updatecompetitors: {
        ID: 0,
        Category: "",
        Name: "",
        TeamSize: 0,
        BillingType: "",
        EngagementRate: "",
        PrimaryTechnology: "",
        SecondaryTechnology: "",
        AccountNameId: 0,
        EngagementArea: "",
        AccountName: undefined,
        Account_Name: '',
      },
      selectedkeycompetitors: "",
      customerstackholders: [],
      updatecustomerstackholders: {
        ID: 0,
        Photo: "",
        FullName: "",
        Designation: "",
        Email: "",
        LinkedInID: "",
        BusinessUnit: "",
        RelationwithEIC: "",
        Contact: "",
        Project: "",
        ManagerEmail: "",
        AccountNameId: 0,
        ReportToId: "",
        rowData: undefined,
        Children: undefined,
        ProfileImageUrl: "",
        Status: undefined,
        AccountName: undefined,
        Profile: '',
        Account_Name: '',
      },
      selectedkeyrelationwitheic: "",
      selectedkeyreportto: "",
      selectedkeybusinessunit: "",
      isTouched: false,
      profile: null,
      profileUrl: null,
      profileErrorMsg: null,
      companyName: '',
      projectOptions: [],
      financialDuration: "Yearly"
    };

    this.eiAccountService = new EiAccountService();
  }

  // public async componentDidMount(): Promise<void> {
  //   console.log('componentDidMount');
  //   let accountname = await this.getQueryStringParameters();
  //   console.log(accountname);
  //   if(accountname != null){
  //     const accountdetails: IAccountDetails = await this.eiAccountService.getAccountDetails(accountname);
  //     console.log(accountdetails);

  //     if (accountdetails) {
  //       console.log("Account details found:", accountdetails);
  //       this.setState({ accountDetails: accountdetails });
  //       console.log("Account details found:", this.state.accountDetails.AccountName);

  //       await this.getDivisions(this.state.accountDetails.ID);
  //       await this.getFinancials(this.state.accountDetails.ID);
  //       await this.getCompetitors(this.state.accountDetails.ID);
  //       await this.getCustomersStackholders(this.state.accountDetails.ID);

  //     } else {
  //       this.setState({
  //         accountDetails: {
  //             ...this.state.accountDetails,
  //             AccountName: accountname
  //         }
  //       });
  //       console.log("No account details found.");
  //     }
  //   }
  // }
  public async componentDidMount(): Promise<void> {
    console.log("componentDidMount");

    // let accounts = uniqBy(data.data, "clientName");
    this.setState({
      projectOptions: jsonData.data.map((x: any) => { return { key: x.projectName, text: x.projectName, accountName: x.clientName } })
    })

    try {
      let accountname = await this.getQueryStringParameters();
      console.log("QueryStringParameters:", accountname);

      if (accountname !== null) {
        const accountdetails: IAccountDetails =
          await this.eiAccountService.getAccountDetails(accountname);
        console.log("AccountDetails:", accountdetails);

        if (accountdetails) {

          this.setState({
            accountDetails: accountdetails,
            companyName: accountname
          });
          console.log("No account details found.");
          console.log("AccountName:", accountname);

          await this.getDivisionsByAccName(accountname);
          await this.getFinancialsByAccName(accountname);
          await this.getCompetitorsByAccName(accountname);
          await this.getCustomersStackholdersByAccName(accountname);


          // console.log("Account details found:", accountdetails);
          // this.setState({ accountDetails: accountdetails }, () => {
          //   console.log("Updated state:", this.state.accountDetails);
          //   // Now try accessing this.state.accountDetails
          // });

          // console.log("AccountName:", this.state.accountDetails.AccountName);

          // await this.getDivisions(this.state.accountDetails.ID);
          // await this.getFinancials(this.state.accountDetails.ID);
          // await this.getCompetitors(this.state.accountDetails.ID);
          // await this.getCustomersStackholders(this.state.accountDetails.ID);
        } else {
          // this.setState({
          //   accountDetails: {
          //     ...this.state.accountDetails,
          //     AccountName: accountname,
          //   },
          //   companyName: accountname
          // });
          // console.log("No account details found.");
          // console.log("AccountName:", accountname);

          // await this.getDivisionsByAccName(accountname);
          // await this.getFinancialsByAccName(accountname);
          // await this.getCompetitorsByAccName(accountname);
          // await this.getCustomersStackholdersByAccName(accountname);
        }
      }
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  public async getDivisions(AccountNameId: number): Promise<void> {
    const divisions: IDivisions[] = await this.eiAccountService.getDivisions(
      AccountNameId
    );
    console.log(divisions);
    this.setState({
      companyName: divisions[0]?.AccountName?.AccountName || "",
    });
    this.setState({ divisions: divisions });
  }

  public async getDivisionsByAccName(accountName: string): Promise<void> {
    const divisions: IDivisions[] = await this.eiAccountService.getListDataWithFilter('Divisions', `Account_Name eq '${accountName}'`);
    console.log('Devisions :: ', divisions);
    // this.setState({
    //   companyName: divisions[0]?.AccountName?.AccountName || "",
    // });
    this.setState({ divisions: divisions });
  }

  public async getFinancials(AccountNameId: number): Promise<void> {
    const financials: IFinancials[] = await this.eiAccountService.getFinancials(
      AccountNameId
    );
    console.log(financials);
    this.setState({
      companyName: financials[0]?.AccountName?.AccountName || "",
    });
    this.setState({ financials: financials });
  }

  public async getFinancialsByAccName(accountName: string): Promise<void> {
    const financials: IFinancials[] = await (await this.eiAccountService.getListDataWithFilter('Financials', `Account_Name eq '${accountName}'`)).sort((a, b) => a.Year - b.Year);
    console.log('Financials :: ', financials);
    // this.setState({
    //   companyName: financials[0]?.AccountName?.AccountName || "",
    // });
    this.setState({ financials: financials });
  }

  public async getCompetitors(AccountNameId: number): Promise<void> {
    const competitors: ICompetitors[] =
      await this.eiAccountService.getCompetitors(AccountNameId);
    console.log(competitors);
    this.setState({
      companyName: competitors[0]?.AccountName?.AccountName || "",
    });
    this.setState({ competitors: competitors });
  }

  public async getCompetitorsByAccName(accountName: string): Promise<void> {
    const competitors: ICompetitors[] = await this.eiAccountService.getListDataWithFilter('Competitors', `Account_Name eq '${accountName}'`);
    console.log('Competitors :: ', competitors);
    // this.setState({
    //   companyName: competitors[0]?.AccountName?.AccountName || "",
    // });
    this.setState({ competitors: competitors });
  }

  public async getCustomersStackholders(AccountNameId: number): Promise<void> {
    const customerstackholders: ICustomersStackholders[] =
      await this.eiAccountService.getCustomersStackholders(AccountNameId);
    console.log("customerstackholders :: ", customerstackholders);
    this.setState({
      companyName: customerstackholders[0]?.AccountName?.AccountName || "",
    });
    this.setState({ customerstackholders: customerstackholders });

    optionsReportTo = customerstackholders.map((item) => ({
      key: item.ID.toString(),
      text: item.FullName,
    }));
    console.log("optionsReportTo :: ", optionsReportTo);
  }

  public async getCustomersStackholdersByAccName(accountName: string): Promise<void> {
    const customerstackholders: ICustomersStackholders[] =
      await this.eiAccountService.getListDataWithFilter('Customer_Stakeholder', `Account_Name eq '${accountName}'`);;
    console.log("Customerstackholders :: ", customerstackholders);
    // this.setState({
    //   companyName: customerstackholders[0]?.AccountName?.AccountName || "",
    // });
    this.setState({ customerstackholders: customerstackholders });

    optionsReportTo = customerstackholders.map((item) => ({
      key: item.ID.toString(),
      text: item.FullName,
    }));
    console.log("optionsReportTo :: ", optionsReportTo);
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    // Check if the accountDetails state has changed
    if (prevState.accountDetails !== this.state.accountDetails) {
      // Perform actions here
      console.log(
        "accountDetails state has been updated:",
        this.state.accountDetails
      );
    }

    if (prevState.divisions !== this.state.divisions) {
      // Perform actions here
      console.log(
        "accountDetails state has been updated:",
        this.state.accountDetails
      );
    }
  }

  private async getQueryStringParameters(): Promise<string> {
    const params = new URLSearchParams(window.location.search);
    let accountname = params.get(paramaccountname);
    return accountname!;
  }

  // Event handler for updating state when a TextField value changes
  handleAccountDetailsTextFieldChange = (fieldName: any, value: any) => {
    this.setState({
      accountDetails: {
        ...this.state.accountDetails,
        [fieldName]: value,
      },
    });
  };

  // Event handler for updating state when a TextField value changes
  handleDivisionsTextFieldChange = (fieldName: any, value: any, key: any) => {
    if (fieldName == "Programs") {
      const programValue = this.state.updatedivision.Programs;
      const programs = programValue == "" ? value : programValue.split(", ").includes(value) ? programValue.split(", ").filter((x) => x != value).join(", ") : programValue.split(", ").concat(value).join(", ");
      debugger;
      this.setState({
        updatedivision: {
          ...this.state.updatedivision,
          [fieldName]: programs,
        },
      });
    } else {
      this.setState({
        updatedivision: {
          ...this.state.updatedivision,
          [fieldName]: value,
        },
      });
    }

    if (key !== null) {
      this.setState({ selectedkeydivisions: key });
    }

    console.log(this.state.updatedivision);
  };

  private setblankfields() {
    this.setState({
      updatedivision: {
        ID: 0,
        Division: "",
        BU: "",
        Programs: "",
        AccountNameId: 0,
        AccountName: {},
        Account_Name: '',
        Description: '',
      },
    });

    this.setState({
      updatefinancials: {
        ID: 0,
        Year: new Date().getFullYear(),
        Revenue: 0,
        Q1Revenue: 0,
        Q2Revenue: 0,
        Q3Revenue: 0,
        Q4Revenue: 0,
        AccountNameId: 0,
        AccountName: {},
        Account_Name: '',
      },
    });

    this.setState({
      updatecompetitors: {
        ID: 0,
        Category: "",
        Name: "",
        TeamSize: 0,
        BillingType: "",
        EngagementRate: "",
        PrimaryTechnology: "",
        SecondaryTechnology: "",
        AccountNameId: 0,
        EngagementArea: "",
        AccountName: undefined,
        Account_Name: '',
      },
    });

    this.setState({
      updatecustomerstackholders: {
        ID: 0,
        Photo: "",
        FullName: "",
        Designation: "",
        Email: "",
        LinkedInID: "",
        BusinessUnit: "",
        Contact: "",
        Project: "",
        RelationwithEIC: "",
        ManagerEmail: "",
        AccountNameId: 0,
        ReportToId: undefined,
        rowData: undefined,
        Children: undefined,
        ProfileImageUrl: "",
        Status: undefined,
        Profile: '',
        AccountName: {},
        Account_Name: '',
      },
    });

    this.setState({ isTouched: false });

    //this.setState({ showPopup: false });
  }

  private getKeyFromValue(dropdown: IDropdownOption[], value: any) {
    debugger;
    const option = dropdown.find((option) => option.text === value);
    if (option !== undefined) {
      return option.key.toString();
    }
    return "";
  }

  private getKeyFromReportTo(dropdown: IDropdownOption[], value: any) {
    debugger;
    const option = dropdown.find((option) => option.key === value);
    if (option !== undefined) {
      return option.key.toString();
    }
    return "";
  }

  private async saveOrUpdateDivisions(
    updatedivision: IDivisions,
    accountnameid: number,
    accountName: string,
    saveoradd: string
  ): Promise<void> {
    const issaved = this.eiAccountService.saveOrUpdateDivisions(
      updatedivision,
      accountnameid,
      accountName
    );
    if (await issaved) {
      await this.getDivisionsByAccName(accountName);
      if (saveoradd === "save") {
        this.setState({ showPopup: false });
      }

      this.setblankfields();

      if (updatedivision.ID != 0) {
        toast.success("Division details updated successfully.");
      } else {
        toast.success("Division details added successfully.");
      }
    } else {
      console.error("Error saving or updating Division details:");
    }
  }

  private async editDivisions(rowData: any): Promise<void> {
    this.setState({
      updatedivision: {
        ID: rowData.ID,
        Division: rowData.Division,
        BU: '',
        Programs: rowData.Programs,
        AccountNameId: 0,
        AccountName: rowData.AccountName,
        Account_Name: this.state.companyName,
        Description: rowData.Description,
      },
    });

    const key = this.getKeyFromValue(optionsBU, rowData.BU);
    console.log("Devision key :: ", key);
    if (key !== null) {
      this.setState({ selectedkeydivisions: key });
    }

    this.setState({ showPopup: true });
  }

  private async deleteDivisions(
    rowid: number,
    accountName: string
  ): Promise<void> {
    const isdeleted = await this.eiAccountService.deleteDivisions(rowid);
    if (isdeleted) {
      await this.getDivisionsByAccName(accountName);
      toast.success("Division details deleted successfully.");
    } else {
      console.error("Error Deleting Division details");
      toast.error("Something went wrong!");
    }
  }

  handleFinancialsTextFieldChange = (fieldName: any, value: any, key: any) => {
    if (fieldName == 'Year') {
      this.setState({
        updatefinancials: {
          ...this.state.updatefinancials,
          [fieldName]: value.value.getFullYear(),
        },
      });
    }
    else {
      this.setState({
        updatefinancials: {
          ...this.state.updatefinancials,
          [fieldName]: value,
        },
      });
    }


    if (key !== null) {
      this.setState({ selectedkeyfinancial: key });
    }
    console.log("selected key:" + value)
  };

  handleChange = (e: any) => {
    console.log("Selected Date:", e.value.getFullYear());
  }

  private async saveOrUpdateFinancials(
    updatefinancials: IFinancials,
    accountnameid: number,
    accountName: string,
    saveoradd: string
  ): Promise<void> {
    const issaved = this.eiAccountService.saveOrUpdateFinancials(
      updatefinancials,
      accountnameid,
      accountName
    );
    if (await issaved) {
      await this.getFinancialsByAccName(accountName);

      if (saveoradd === "save") {
        this.setState({ showPopup: false });
      }

      this.setblankfields();

      if (updatefinancials.ID != 0) {
        toast.success("Fiancials details updated successfully.");
      } else {
        toast.success("Fiancials details added successfully.");
      }
    } else {
      console.error("Error saving or updating Financials details:");
    }
  }

  private async editFinancials(rowData: any): Promise<void> {
    debugger;
    this.setState({
      updatefinancials: {
        ID: rowData.ID,
        Year: rowData.Year,
        Revenue: rowData.Revenue,
        Q1Revenue: rowData.Q1Revenue,
        Q2Revenue: rowData.Q2Revenue,
        Q3Revenue: rowData.Q3Revenue,
        Q4Revenue: rowData.Q4Revenue,
        AccountNameId: 0,
        AccountName: rowData.AccountName,
        Account_Name: this.state.companyName,
      },
    });

    console.log(rowData);
    const key = this.getKeyFromValue(addFinancials, rowData.Year.toString());
    console.log(key);
    if (key !== null) {
      this.setState({ selectedkeyfinancial: key });
    }

    this.setState({ showPopup: true });
  }

  private async deleteFinancials(
    rowid: number,
    accountName: string
  ): Promise<void> {
    const isdeleted = await this.eiAccountService.deleteFinancials(rowid);
    if (isdeleted) {
      await this.getFinancialsByAccName(accountName);
      toast.success("Fiancials details deleted successfully.");
    } else {
      console.error("Error Deleting Financials details");
      toast.error("Something went wrong!");
    }
  }

  handleCompetitorsTextFieldChange = (fieldName: any, value: any, key: any) => {
    this.setState({
      updatecompetitors: {
        ...this.state.updatecompetitors,
        [fieldName]: value,
      },
    });

    if (key !== null) {
      this.setState({ selectedkeycompetitors: key });
    }
  };

  private async saveOrUpdateCompetitors(
    updatecompetitors: ICompetitors,
    accountnameid: number,
    accountName: string,
    saveoradd: string
  ): Promise<void> {
    console.log(updatecompetitors);
    const issaved = this.eiAccountService.saveOrUpdateCompetitors(
      updatecompetitors,
      accountnameid,
      accountName
    );
    if (await issaved) {
      await this.getCompetitorsByAccName(accountName);

      if (saveoradd === "save") {
        this.setState({ showPopup: false });
      }

      this.setblankfields();

      if (updatecompetitors.ID != 0) {
        toast.success("Competitors details updated successfully.");
      } else {
        toast.success("Competitors details added successfully.");
      }
    } else {
      console.error("Error saving or updating Competitors details:");
    }
  }

  private async viewCompetitors(rowData: any): Promise<void> {
    this.setState({
      updatecompetitors: {
        ID: rowData.ID,
        Category: rowData.Category,
        Name: rowData.Name,
        TeamSize: rowData.TeamSize,
        BillingType: rowData.BillingType,
        EngagementRate: rowData.EngagementRate,
        PrimaryTechnology: rowData.PrimaryTechnology,
        SecondaryTechnology: rowData.SecondaryTechnology,
        AccountNameId: 0,
        EngagementArea: "",
        AccountName: rowData.AccountName,
        Account_Name: this.state.companyName,
      },
    });

    const key = this.getKeyFromValue(optionsCompetitors, rowData.BillingType);
    console.log(key);
    if (key !== null) {
      this.setState({ selectedkeycompetitors: key })
    }

    this.setState({ viewCompetitorsPopup: true });
  }

  private async editCompetitors(rowData: any): Promise<void> {
    this.setState({
      updatecompetitors: {
        ID: rowData.ID,
        Category: rowData.Category,
        Name: rowData.Name,
        TeamSize: rowData.TeamSize,
        BillingType: rowData.BillingType,
        EngagementRate: rowData.EngagementRate,
        PrimaryTechnology: rowData.PrimaryTechnology,
        SecondaryTechnology: rowData.SecondaryTechnology,
        AccountNameId: 0,
        EngagementArea: "",
        AccountName: rowData.AccountName,
        Account_Name: this.state.companyName,
      },
    });

    const key = this.getKeyFromValue(optionsCompetitors, rowData.BillingType);
    console.log(key);
    if (key !== null) {
      this.setState({ selectedkeycompetitors: key });
    }

    this.setState({ showPopup: true });
  }

  private async deletecompetitors(
    rowid: number,
    accountName: string
  ): Promise<void> {
    const isdeleted = await this.eiAccountService.deleteCompetitors(rowid);
    if (isdeleted) {
      await this.getCompetitorsByAccName(accountName);
      toast.success("Fiancials details deleted successfully.");
    } else {
      console.error("Error Deleting Competitors details");
      toast.error("Something went wrong!");
    }
  }

  handlecustomerstackholdersTextFieldChange = (
    fieldName: any,
    value: any,
    key: any
  ) => {
    console.log("fieldName :: ", fieldName);
    console.log("value :: ", value);
    this.setState({
      updatecustomerstackholders: {
        ...this.state.updatecustomerstackholders,
        [fieldName]: value,
      },
    });

    if (key !== null) {
      if (fieldName == "RelationwithEIC") {
        this.setState({ selectedkeyrelationwitheic: key });
      } else if (fieldName == "BusinessUnit") {
        this.setState({ selectedkeybusinessunit: key });
      } else {
        this.setState({ selectedkeyreportto: key });
      }
    }
  };

  private async saveOrUpdatecustomerstackholders(
    updatecustomerstackholders: ICustomersStackholders,
    accountnameid: number,
    accountName: string,
    saveoradd: string
  ): Promise<void> {
    debugger;
    console.log("saveOrUpdatecustomerstackholders :: ", updatecustomerstackholders);

    if (this.state.profileUrl != null) {
      const issaved = this.eiAccountService.saveOrUpdateCustomersStackholders(
        updatecustomerstackholders,
        accountnameid, accountName, this.state.profile
      );
      if (await issaved) {
        await this.getCustomersStackholdersByAccName(accountName);

        if (saveoradd === "save") {
          this.setState({ showPopup: false });
        }

        this.setblankfields();

        if (updatecustomerstackholders.ID != 0) {
          toast.success("Customer Stakeholder details updated successfully.");
        } else {
          toast.success("Customer Stakeholder details added successfully.");
        }
      } else {
        console.error("Error saving or updating Customer stackholders details:");
      }
    }
  }

  private async viewcustomerstackholders(rowData: any): Promise<void> {
    this.setState({
      updatecustomerstackholders: {
        ID: rowData.ID,
        Photo: rowData.Photo,
        FullName: rowData.FullName,
        Designation: rowData.Designation,
        Email: rowData.Email,
        LinkedInID: rowData.LinkedInID,
        RelationwithEIC: rowData.RelationwithEIC,
        ManagerEmail: rowData.ManagerEmail,
        Contact: rowData.Contact,
        Project: rowData.Project,
        AccountNameId: 0,
        BusinessUnit: "",
        ReportToId: undefined,
        rowData: undefined,
        Children: undefined,
        ProfileImageUrl: "",
        Status: undefined,
        AccountName: rowData.AccountName,
        Profile: '',
        Account_Name: this.state.companyName,
      }
    });

    const relationwithEICKey = this.getKeyFromValue(optionsCustomerStakeholders, rowData.RelationwithEIC);
    console.log('relationwithEICKey :: ', relationwithEICKey);
    if (relationwithEICKey !== null) {
      this.setState({ selectedkeyrelationwitheic: relationwithEICKey })
    }

    this.state.customerstackholders.forEach((stackholder, index) => {
      // Do something with each stackholder
      console.log('stackholder :: ', stackholder);

      if (rowData.ID == stackholder.ID) {
        const reportToKey = stackholder.ReportToId != null ? this.getKeyFromReportTo(optionsReportTo, stackholder.ReportToId.toString()) : '';
        console.log('reportToKey :: ', reportToKey);
        if (reportToKey !== null) {
          this.setState({ selectedkeyreportto: reportToKey })
        }

        const businessUnitKey = this.getKeyFromValue(optionsBU, stackholder.BusinessUnit);
        console.log('businessUnitKey :: ', businessUnitKey);
        if (businessUnitKey !== null) {
          this.setState({ selectedkeybusinessunit: businessUnitKey })
        }
      }
    });

    this.state.customerstackholders.forEach((stackholder, index) => {
      // Do something with each stackholder

      if (rowData.ID == stackholder.ID) {
        if (stackholder.Profile != null) {
          const url = window.location.origin + stackholder.Profile;
          console.log('url :: ', url);
          this.setState({ profileUrl: url })
        }
      }
    });

    this.setState({ viewCompetitorsPopup: true });
  }

  private async editcustomerstackholders(rowData: any): Promise<void> {
    debugger;
    this.setState({
      updatecustomerstackholders: {
        ID: rowData.ID,
        Photo: rowData.Photo,
        FullName: rowData.FullName,
        Designation: rowData.Designation,
        Email: rowData.Email,
        LinkedInID: rowData.LinkedInID,
        RelationwithEIC: rowData.RelationwithEIC,
        ManagerEmail: rowData.ManagerEmail,
        Contact: rowData.Contact,
        Project: rowData.Project,
        BusinessUnit: rowData.BusinessUnit,
        AccountNameId: 0,
        ReportToId: undefined,
        rowData: undefined,
        Children: undefined,
        ProfileImageUrl: "",
        Status: undefined,
        Profile: '',
        AccountName: rowData.AccountName,
        Account_Name: this.state.companyName,
      },
    });

    const relationwithEICKey = this.getKeyFromValue(
      optionsCustomerStakeholders,
      rowData.RelationwithEIC
    );
    console.log("relationwithEICKey :: ", relationwithEICKey);
    if (relationwithEICKey !== null) {
      this.setState({ selectedkeyrelationwitheic: relationwithEICKey });
    }

    this.state.customerstackholders.forEach((stackholder, index) => {
      // Do something with each stackholder
      console.log("stackholder :: ", stackholder);

      if (rowData.ID == stackholder.ID) {
        const reportToKey =
          stackholder.ReportToId != null
            ? this.getKeyFromReportTo(
              optionsReportTo,
              stackholder.ReportToId.toString()
            )
            : "";
        console.log("reportToKey :: ", reportToKey);
        if (reportToKey !== null) {
          this.setState({ selectedkeyreportto: reportToKey });
        }

        const businessUnitKey = this.getKeyFromValue(
          optionsBU,
          stackholder.BusinessUnit
        );
        console.log("businessUnitKey :: ", businessUnitKey);
        if (businessUnitKey !== null) {
          this.setState({ selectedkeybusinessunit: businessUnitKey });
        }

        if (stackholder.Profile != null) {
          const url = window.location.origin + stackholder.Profile;
          console.log('url :: ', url);
          this.setState({ profileUrl: url })
        }
      }
    });

    this.setState({ showPopup: true });
  }

  private async deletecustomerstackholders(
    rowid: number,
    accountName: string
  ): Promise<void> {
    const isdeleted = await this.eiAccountService.deleteCustomersStackholders(
      rowid
    );
    if (isdeleted) {
      await this.getCustomersStackholdersByAccName(accountName);
      toast.success("Customer Stakeholder details deleted successfully.");
    } else {
      console.error("Error Deleting CustomersStackholders details");
      toast.error("Something went wrong!");
    }
  }

  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href =
      "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" +
      sourceParam;
  };

  private saveOrUpdateAccountDetails = () => {
    this.eiAccountService
      .saveOrUpdateAccountDetails(this.state.accountDetails)
      .then((result) => {
        console.log("result :: ", result);
        if (result == true) {
          if (this.state.accountDetails.ID != 0) {
            toast.success("Account details updated successfully.");
          } else {
            toast.success("Account details added successfully.");
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error); // Log any errors if the Promise is rejected
        toast.error("Something went wrong!");
      });
  };

  private handleDurationFields(value: any) {
    this.setState({ financialDuration: value });
    console.log(this.state.financialDuration);
  }

  public render(): React.ReactElement<IEiEditAccountProps> {
    const textFieldProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { height: 40, border: "1px solid #D7DADE", color: "#D7DADE" },
    };
    const textFieldWithDescProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { height: 40, border: "1px solid #D7DADE", color: "#D7DADE" },
      description: {
        fontFamily: "Poppins",
        color: "#74788D",
        fontSize: 13,
        lineHeight: 20,
        fontWeight: 400,
        marginLeft: 5,
      },
    };

    const horizontalGap: IStackTokens = {
      childrenGap: 10,
    };

    const textFieldParagraphProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { border: "1px solid #D7DADE", color: "#D7DADE" },
    };

    const financialDurationOptions: IChoiceGroupOption[] = [
      { key: 'Yearly', text: 'Yearly' },
      { key: 'Quarterly', text: 'Quarterly' },
    ];

    // const datatable = [
    //   {
    //     year:'2022',
    //     revenue1:'25,299',
    //     revenue2:'25,299',
    //     revenue3:'25,299',
    //     revenue4:'25,299',
    //   },
    //   {
    //     year:'2021',
    //     revenue1:'25,299',
    //     revenue2:'25,299',
    //     revenue3:'25,299',
    //     revenue4:'25,299',
    // },
    // {
    //   year:'2020',
    //   revenue1:'25,299',
    //   revenue2:'25,299',
    //   revenue3:'25,299',
    //   revenue4:'25,299',
    // },
    // {
    //   year:'2019',
    //   revenue1:'25,299',
    //   revenue2:'25,299',
    //   revenue3:'25,299',
    //   revenue4:'25,299',
    // },
    // {
    //   year:'2018',
    //   revenue1:'25,299',
    //   revenue2:'25,299',
    //   revenue3:'25,299',
    //   revenue4:'25,299',
    // }
    // ];

    // const datatableDivision = [
    //   {
    //     division:'HVAC Equipment',
    //     bu:'',
    //     programs:'',
    //   },
    //   {
    //     division:'Building Automation and Controls',
    //     bu:'Digital',
    //     programs:'Tools Development, OBBAS, Metasys Modernization, Metasys Linux Porting Digital',
    // },
    // {
    //   division:'Security',
    //   bu:'Digital',
    //   programs:'Kantech',
    // },
    // {
    //   division:'Fire Detection',
    //   bu:'',
    //   programs:'',
    // },
    // {
    //   division:'Fire Suppression',
    //   bu:'Digital',
    //   programs:'Tyco',
    // }
    // ];

    // const datatableCompetitors = [
    //   {
    //     category:'Avionics Non-ITAR',
    //     name:'US: LTTS',
    //     teamSize:20,
    //     billingType: 'Fixed Cost',
    //     EngagementRate: '1.2M'
    //   },
    //   {
    //     category:'Avionics Non-ITAR',
    //     name:'US: LTTS',
    //     teamSize:20,
    //     billingType: 'Fixed Cost',
    //     EngagementRate: '1.2M'
    //   },
    //   {
    //     category:'Avionics Non-ITAR',
    //     name:'US: LTTS',
    //     teamSize:20,
    //     billingType: 'Fixed Cost',
    //     EngagementRate: '1.2M'
    //   },
    //   {
    //     category:'Avionics Non-ITAR',
    //     name:'US: LTTS',
    //     teamSize:20,
    //     billingType: 'Fixed Cost',
    //     EngagementRate: '1.2M'
    //   },
    //   {
    //     category:'Avionics Non-ITAR',
    //     name:'US: LTTS',
    //     teamSize:20,
    //     billingType: 'Fixed Cost',
    //     EngagementRate: '1.2M'
    //   }
    // ]

    // const datatableCustomerStakeholders = [
    //   {
    //     name:'Vijay Sankaran',
    //     image:'https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png',
    //     designation: 'Vice President, Chief Technology Officer',
    //     email: 'vijay.sankaran@jci.com',
    //     relation: 'Need to Establish'
    //   },
    //   {
    //     name:'Laura Hahn',
    //     image:'https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png',
    //     designation: 'Vice President, OpenBlue Solutions Engineering',
    //     email: 'laura.hahn@jci.com',
    //     relation: 'Favourable'
    //   },
    //   {
    //     name:'Smita Khare',
    //     image:'https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png',
    //     designation: 'Vice President, OpenBlue Solutions Engineering',
    //     email: 'laura.hahn@jci.com',
    //     relation: 'Favourable'
    //   }
    // ]

    const divisionBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <FontIcon
            aria-label="edit"
            iconName="EditSolid12"
            className={styles.editIcon}
            onClick={() => this.editDivisions(rowData)}
          />
          <FontIcon
            aria-label="delete"
            iconName="delete"
            className={styles.deleteIcon}
            onClick={() =>
              this.deleteDivisions(rowData.ID, this.state.companyName)
            }
          />
        </React.Fragment>
      );
    };

    const financilasBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <FontIcon
            aria-label="edit"
            iconName="EditSolid12"
            className={styles.editIcon}
            onClick={() => this.editFinancials(rowData)}
          />
          <FontIcon
            aria-label="delete"
            iconName="delete"
            className={styles.deleteIcon}
            onClick={() =>
              this.deleteFinancials(rowData.ID, this.state.companyName)
            }
          />
        </React.Fragment>
      );
    };

    const competitirsBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <FontIcon
            aria-label="view"
            iconName="RedEye"
            className={styles.editIcon}
            onClick={() => this.viewCompetitors(rowData)}
          />
          <FontIcon
            aria-label="edit"
            iconName="EditSolid12"
            className={styles.editIcon}
            onClick={() => this.editCompetitors(rowData)}
          />
          <FontIcon
            aria-label="delete"
            iconName="delete"
            className={styles.deleteIcon}
            onClick={() =>
              this.deletecompetitors(rowData.ID, this.state.companyName)
            }
          />
        </React.Fragment>
      );
    };

    const customerstackholdersBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <FontIcon
            aria-label="view"
            iconName="RedEye"
            className={styles.editIcon}
            onClick={() => this.viewcustomerstackholders(rowData)}
          />
          <FontIcon
            aria-label="edit"
            iconName="EditSolid12"
            className={styles.editIcon}
            onClick={() => this.editcustomerstackholders(rowData)}
          />
          <FontIcon
            aria-label="delete"
            iconName="delete"
            className={styles.deleteIcon}
            onClick={() =>
              this.deletecustomerstackholders(
                rowData.ID,
                this.state.companyName
              )
            }
          />
        </React.Fragment>
      );
    };

    const customerStakeholdersUserBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <div className={styles.csName}>
            <img className={styles.csTableImage} src={`https://aixtor.sharepoint.com${rowData.Profile != null
              ? rowData.Profile
              : "/sites/InfoHub360/SiteAssets/Lists/d37a6df1-e19a-4583-86a7-e80d35496408/vijay.png"
              }`} />
            <span>{rowData.FullName}</span>
          </div>
        </React.Fragment>
      );
    };

    const customerStakeholdersRelationBodyTemplate = (rowData: any) => {
      const stockClassName = classNames({
        favourable: rowData.RelationwithEIC === "Favourable",
        neutral: rowData.RelationwithEIC === "Neutral",
        unfavourable: rowData.RelationwithEIC === "Unfavourable",
        needtoestablish: rowData.RelationwithEIC === "Need to Establish",
      });
      return <div className={stockClassName}>{rowData.RelationwithEIC}</div>;
    };

    const showPopup = this.state.showPopup;
    const viewCompetitorsPopup = this.state.viewCompetitorsPopup;

    const addUpdatesPopupStyles = mergeStyleSets({
      root: {
        background: "rgba(0, 0, 0, 0.2)",
        bottom: "0",
        left: "0",
        position: "fixed",
        right: "0",
        top: "0",
      },
      content: {
        background: "white",
        left: "50%",
        maxWidth: "360px",
        width: "100%",
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: 2,
      },
    });
    const columnProps: Partial<IStackProps> = {
      tokens: { childrenGap: 15 },
    };
    const modalButton: Partial<IButtonStyles> = {
      root: { margin: "20px 0 0 10px", float: "right" },
    };

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
    const uploadProfileImage = require("../assets/Union.png");

    const addFinancialsForm = this.state.updatefinancials;

    const handleTextFieldBlur = () => {
      this.setState({ isTouched: true });

      if (this.state.profileUrl === null) {
        this.setState({ profileErrorMsg: 'Profile is required.' });
      }
    };

    const handleTextFieldClose = () => {
      this.setState({ isTouched: false });
      this.setState({ selectedkeyrelationwitheic: "" });
      this.setState({ selectedkeyreportto: "" });
      this.setState({ selectedkeybusinessunit: "" });
      this.setState({ selectedkeydivisions: "" });
      this.setState({ selectedkeyfinancial: "" });
      this.setState({ selectedkeycompetitors: "" });
      this.setState({ profileUrl: null });
      this.setState({ profileErrorMsg: null });
    };

    const handleChange = (e: any) => {
      console.log('profile :: ', e.target.files[0])
      const fileURL = URL.createObjectURL(e.target.files[0]);
      console.log('fileURL :: ', fileURL)
      this.setState({ profileUrl: fileURL });
      this.setState({ profile: e.target.files[0] });
      this.setState({ profileErrorMsg: null });
    }
    // const location = window.location.href.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    // siteUrl = this.props.context.pageContext.web.absoluteUrl;
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    console.log(
      "urlParams edit account::",
      urlParams.get("source"),
      this.state.companyName
    );


    const financialYear = new Date();
    financialYear.setFullYear(addFinancialsForm.Year);


    return (
      <section>
        <Toaster position="bottom-right" reverseOrder={false} />
        <div>
          <ul className="breadcrumb">
            <li>
              {/* <a onClick={this.navigateToPreviousPage}>account dashboard</a> */}
              <Link
                href={`${splitUrl}?accountName=${urlParams.get("accountName")}`}
              >
                account dashboard
              </Link>
            </li>
            <li>Edit account</li>
          </ul>
        </div>
        <div className="vertical_tab">
          <TabView>
            <TabPanel header="Account Details">
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
              >
                <Text className="pageTitle">Account Details</Text>
                <Stack horizontal tokens={horizontalGap}>
                  <DefaultButton
                    className="btn-outline"
                    text="Cancel"
                    // href={`${splitUrl}?accountName=${urlParams.get("accountName")}`}
                    onClick={this.navigateToPreviousPage}
                  />
                  <DefaultButton
                    className="btn-primary"
                    text="Save"
                    onClick={() => this.saveOrUpdateAccountDetails()}
                  ></DefaultButton>
                </Stack>
              </Stack>
              <Separator className="i-seperator" />
              <div className="i-row">
                <div className="i-col-4 i-mb-25">
                  <TextField
                    label="Account Name"
                    styles={textFieldProps}
                    placeholder="Enter Account name"
                    value={this.state.accountDetails.AccountName}
                    required
                  />
                </div>
                <div className="i-col-4 i-mb-25">
                  <TextField
                    label="Industry Type"
                    styles={textFieldProps}
                    placeholder="Enter Industry Type"
                    value={this.state.accountDetails.IndustryType}
                    onChange={(event, value) =>
                      this.handleAccountDetailsTextFieldChange(
                        "IndustryType",
                        value
                      )
                    }
                    onBlur={handleTextFieldBlur}
                    errorMessage={
                      this.state.isTouched &&
                        !this.state.accountDetails.IndustryType
                        ? "Industry Type is required."
                        : ""
                    }
                    required
                  />
                </div>
                <div className="i-col-4 i-mb-25">
                  <TextField
                    label="Acquisitions"
                    styles={textFieldProps}
                    placeholder="Separate Acquisitions with “,”"
                    value={this.state.accountDetails.Acquisitions}
                    onChange={(event, value) =>
                      this.handleAccountDetailsTextFieldChange(
                        "Acquisitions",
                        value
                      )
                    }
                  />
                </div>
                <div className="i-col-4 i-mb-25">
                  <TextField
                    label="Parent Company"
                    styles={textFieldProps}
                    placeholder="Enter Parent Company"
                    value={this.state.accountDetails.ParentCompany}
                    onChange={(event, value) =>
                      this.handleAccountDetailsTextFieldChange(
                        "ParentCompany",
                        value
                      )
                    }
                  />
                </div>
                <div className="i-col-4 i-mb-25">
                  <TextField
                    label="Subsidiary Company"
                    styles={textFieldProps}
                    placeholder="Enter Subsidiary Company"
                    value={this.state.accountDetails.SubsidiaryCompany}
                    onChange={(event, value) =>
                      this.handleAccountDetailsTextFieldChange(
                        "SubsidiaryCompany",
                        value
                      )
                    }
                  />
                </div>
                <div className="i-col-12 i-mb-25">
                  <TextField
                    label="Account Description"
                    styles={textFieldParagraphProps}
                    multiline
                    rows={6}
                    placeholder="Enter Description..."
                    value={this.state.accountDetails.AccountDescription}
                    onChange={(event, value) =>
                      this.handleAccountDetailsTextFieldChange(
                        "AccountDescription",
                        value
                      )
                    }
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Financials">
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
              >
                <Text className="pageTitle">Financials</Text>
                <Stack horizontal tokens={horizontalGap}>
                  <DefaultButton
                    className="btn-primary"
                    text="Add"
                    onClick={() => {
                      this.setState({ showPopup: true });
                      handleTextFieldClose();
                    }}
                  ></DefaultButton>
                  {showPopup && (
                    <Layer>
                      <Popup
                        className={addUpdatesPopupStyles.root}
                        role="dialog"
                        aria-modal="true"
                        onDismiss={() => this.setState({ showPopup: false })}
                      >
                        <Overlay
                          onClick={() => this.setState({ showPopup: false })}
                        />
                        <div
                          role="document"
                          className={`modalPopup ${addUpdatesPopupStyles.content}`}
                        >
                          <Stack
                            horizontal
                            horizontalAlign="space-between"
                            verticalAlign="center"
                            className={styles.modalPopupHeader}
                          >
                            <Text className={styles.modalPopupTitle}>
                              Add Financials
                            </Text>
                            <FontIcon
                              aria-label="Compass"
                              iconName="Cancel"
                              className={styles.iconStyle}
                              onClick={() => { this.setblankfields(); this.setState({ showPopup: false }); }}
                            />
                          </Stack>
                          <div className={styles.modalContent}>
                            <Stack {...columnProps} className="formChildGap">
                              {/* <Dropdown
                                  label="Year"
                                  placeholder="Select Year"
                                  options={addFinancials}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  selectedKey={this.state.selectedkeyfinancial}
                                  onChange={(event, value) =>
                                    this.handleFinancialsTextFieldChange(
                                      "Year",
                                      value?.text,
                                      value?.key || ""
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                    !this.state.selectedkeyfinancial
                                      ? "Year is required"
                                      : ""
                                  } // Display error message if not selected
                                  required={true}
                                /> */}
                              <ChoiceGroup
                                options={financialDurationOptions}
                                label="Duration"
                                defaultSelectedKey={this.state.financialDuration}
                                className="custom-radio"
                                onChange={(e, option) => this.handleDurationFields(option?.key)}
                              />
                              <div className="i-calender mt-0">
                                <label htmlFor="Year">Year</label>
                                <Calendar
                                  id="Year"
                                  value={financialYear}
                                  onChange={(value) =>
                                    this.handleFinancialsTextFieldChange(
                                      "Year",
                                      value,
                                      null
                                    )
                                  }
                                  view="year"
                                  dateFormat='yy'
                                  onBlur={handleTextFieldBlur}
                                  required={true}
                                />
                              </div>
                              {this.state.financialDuration == "Yearly" ? (
                                <TextField
                                  label="Revenue ($)"
                                  styles={textFieldProps}
                                  placeholder="Enter Revenue ($)"
                                  value={
                                    addFinancialsForm.Revenue == 0 || addFinancialsForm.Revenue == null
                                      ? ""
                                      : addFinancialsForm.Revenue.toString()
                                  }
                                  onChange={(event, value) => {
                                    if (value && /^\d+$/g.test(value)) {
                                      this.handleFinancialsTextFieldChange(
                                        "Revenue",
                                        value,
                                        null
                                      );
                                    } else if (value?.length == 0) {
                                      this.handleFinancialsTextFieldChange(
                                        "Revenue",
                                        value,
                                        null
                                      );
                                    }
                                  }}
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !addFinancialsForm.Revenue
                                      ? "Revenue is required"
                                      : ""
                                  }
                                  required
                                />
                              ) : (
                                <div className="formChildGap">
                                  <TextField
                                    label="Q-1 Revenue ($)"
                                    styles={textFieldProps}
                                    placeholder="Enter Q-1 Revenue ($)"
                                    value={
                                      addFinancialsForm.Q1Revenue == 0
                                        ? ""
                                        : addFinancialsForm.Q1Revenue.toString()
                                    }
                                    onChange={(event, value) => {
                                      if (value && /^\d+$/g.test(value)) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q1Revenue",
                                          value,
                                          null
                                        );
                                      } else if (value?.length == 0) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q1Revenue",
                                          value,
                                          null
                                        );
                                      }
                                    }}
                                    onBlur={handleTextFieldBlur}
                                    errorMessage={
                                      this.state.isTouched &&
                                        !addFinancialsForm.Q1Revenue
                                        ? "Q-1 Revenue is required"
                                        : ""
                                    }
                                    required
                                  />
                                  <TextField
                                    label="Q-2 Revenue ($)"
                                    styles={textFieldProps}
                                    placeholder="Enter Q-2 Revenue ($)"
                                    value={
                                      this.state.updatefinancials.Q2Revenue == 0
                                        ? ""
                                        : this.state.updatefinancials.Q2Revenue.toString()
                                    }
                                    onChange={(event, value) => {
                                      if (value && /^\d+$/g.test(value)) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q2Revenue",
                                          value,
                                          null
                                        );
                                      } else if (value?.length == 0) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q2Revenue",
                                          value,
                                          null
                                        );
                                      }
                                    }}
                                  />
                                  <TextField
                                    label="Q-3 Revenue ($)"
                                    styles={textFieldProps}
                                    placeholder="Enter Q-3 Revenue ($)"
                                    value={
                                      this.state.updatefinancials.Q3Revenue == 0
                                        ? ""
                                        : this.state.updatefinancials.Q3Revenue.toString()
                                    }
                                    onChange={(event, value) => {
                                      if (value && /^\d+$/g.test(value)) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q3Revenue",
                                          value,
                                          null
                                        );
                                      } else if (value?.length == 0) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q3Revenue",
                                          value,
                                          null
                                        );
                                      }
                                    }}
                                  />
                                  <TextField
                                    label="Q-4 Revenue ($)"
                                    styles={textFieldProps}
                                    placeholder="Enter Q-4 Revenue ($)"
                                    value={
                                      this.state.updatefinancials.Q4Revenue == 0
                                        ? ""
                                        : this.state.updatefinancials.Q4Revenue.toString()
                                    }
                                    onChange={(event, value) => {
                                      if (value && /^\d+$/g.test(value)) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q4Revenue",
                                          value,
                                          null
                                        );
                                      } else if (value?.length == 0) {
                                        this.handleFinancialsTextFieldChange(
                                          "Q4Revenue",
                                          value,
                                          null
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            </Stack>
                            <DefaultButton
                              className="btn-primary"
                              text="Save"
                              styles={modalButton}
                              onClick={() =>
                                this.saveOrUpdateFinancials(
                                  this.state.updatefinancials,
                                  this.state.accountDetails.ID,
                                  this.state.companyName,
                                  "save"
                                )
                              }
                            ></DefaultButton>
                            <DefaultButton
                              className="btn-primary"
                              text="Save & Add"
                              styles={modalButton}
                              onClick={() =>
                                this.saveOrUpdateFinancials(
                                  this.state.updatefinancials,
                                  this.state.accountDetails.ID,
                                  this.state.companyName,
                                  "add"
                                )
                              }
                            ></DefaultButton>
                            <DefaultButton
                              className="btn-outline"
                              text="Cancel"
                              styles={modalButton}
                              onClick={() => { this.setblankfields(); this.setState({ showPopup: false }); }}
                            ></DefaultButton>
                          </div>
                        </div>
                      </Popup>
                    </Layer>
                  )}
                </Stack>
              </Stack>
              <Separator className="i-seperator" />
              <div className="datatable-wrapper">
                <DataTable value={this.state.financials} scrollable>
                  <Column
                    field="ID"
                    header="ID"
                    style={{ display: "none" }}
                  ></Column>
                  <Column
                    field="Year"
                    header="Year"
                    filter
                    style={{ minWidth: "150px" }}
                    align="right"
                  ></Column>
                  <Column
                    field="Revenue"
                    header="Yearly ($)"
                    filter
                    style={{ minWidth: "150px" }}
                    align="right"
                  ></Column>
                  <Column
                    field="Q1Revenue"
                    header="Q-1 Revenue ($)"
                    filter
                    style={{ minWidth: "150px" }}
                    align="right"
                  ></Column>
                  <Column
                    field="Q2Revenue"
                    header="Q-2 Revenue ($)"
                    filter
                    style={{ minWidth: "150px" }}
                    align="right"
                  ></Column>
                  <Column
                    field="Q3Revenue"
                    header="Q-3 Revenue ($)"
                    filter
                    style={{ minWidth: "150px" }}
                    align="right"
                  ></Column>
                  <Column
                    field="Q4Revenue"
                    header="Q-4 Revenue ($)"
                    filter
                    style={{ minWidth: "155px" }}
                    align="right"
                  ></Column>
                  <Column
                    header="Actions"
                    body={financilasBodyTemplate}
                    exportable={false}
                    style={{ minWidth: "120px" }}
                    align="center"
                    frozen
                    alignFrozen="right"
                  ></Column>
                </DataTable>
              </div>
            </TabPanel>
            <TabPanel header="Divisions">
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
              >
                <Text className="pageTitle">Divisions</Text>
                <Stack horizontal tokens={horizontalGap}>
                  <DefaultButton
                    className="btn-primary"
                    text="Add"
                    onClick={() => {
                      this.setState({ showPopup: true });
                      handleTextFieldClose();
                    }}
                  ></DefaultButton>
                  {showPopup && (
                    <Layer>
                      <Popup
                        className={addUpdatesPopupStyles.root}
                        role="dialog"
                        aria-modal="true"
                        onDismiss={() => this.setState({ showPopup: false })}
                      >
                        <Overlay
                          onClick={() => this.setState({ showPopup: false })}
                        />
                        <FocusTrapZone>
                          <div
                            role="document"
                            className={addUpdatesPopupStyles.content}
                          >
                            <Stack
                              horizontal
                              horizontalAlign="space-between"
                              verticalAlign="center"
                              className={styles.modalPopupHeader}
                            >
                              <Text className={styles.modalPopupTitle}>
                                Add Division
                              </Text>
                              <FontIcon
                                aria-label="Compass"
                                iconName="Cancel"
                                className={styles.iconStyle}
                                onClick={() => { this.setblankfields(); this.setState({ showPopup: false }); }}
                              />
                            </Stack>
                            <div className={styles.modalContent}>
                              <Stack {...columnProps} className="formChildGap">
                                <TextField
                                  label="Division"
                                  styles={textFieldProps}
                                  placeholder="Enter Division"
                                  value={this.state.updatedivision.Division}
                                  onChange={(event, value) =>
                                    this.handleDivisionsTextFieldChange(
                                      "BusinessUnit",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updatedivision.Division
                                      ? "Division is required."
                                      : ""
                                  }
                                  required={true}
                                />
                                {/* Commented below as no longer required in sprint 5 */}
                                {/* <Dropdown
                                  label="BU"
                                  placeholder="Select BU"
                                  selectedKey={this.state.selectedkeydivisions}
                                  options={optionsBU}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  onChange={(event, value) =>
                                    this.handleDivisionsTextFieldChange(
                                      "BU",
                                      value?.text,
                                      value?.key || ""
                                    )
                                  }
                                /> */}
                                <ComboBox
                                  // defaultSelectedKey="C"
                                  label="Programs"
                                  placeholder="Select Programs"
                                  multiSelect
                                  selectedKey={this.state.updatedivision.Programs.split(", ")}
                                  options={this.state.projectOptions.filter((x: any) => x.accountName === this.state.accountDetails.AccountName)}
                                  onChange={(ev, value) => this.handleDivisionsTextFieldChange(
                                    "Programs",
                                    value?.text,
                                    value?.key || ""
                                  )}
                                  styles={dropdownStyles}
                                />
                                <TextField
                                  label="Description"
                                  styles={textFieldProps}
                                  multiline
                                  rows={6}
                                  placeholder="Enter Description..."
                                  value={this.state.updatedivision.Description}
                                  onChange={(event, value) =>
                                    this.handleDivisionsTextFieldChange(
                                      "Description",
                                      value,
                                      null
                                    )
                                  }
                                />
                                {/* <Dropdown
                                  label="Programs"
                                  placeholder="Select Program"
                                  selectedKey={this.state.updatedivision.Programs}
                                  options={this.state.projectOptions.filter((x:any)=> x.accountName === this.state.accountDetails.AccountName)}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  onChange={(event, value) =>
                                    this.handleDivisionsTextFieldChange(
                                      "Programs",
                                      value?.text,
                                      value?.key || ""
                                    )
                                  }
                                /> */}
                              </Stack>
                              <DefaultButton
                                className="btn-primary"
                                text="Save"
                                styles={modalButton}
                                onClick={() =>
                                  this.saveOrUpdateDivisions(
                                    this.state.updatedivision,
                                    this.state.accountDetails.ID,
                                    this.state.companyName,
                                    "save"
                                  )
                                }
                              ></DefaultButton>
                              <DefaultButton
                                className="btn-primary"
                                text="Save & Add"
                                styles={modalButton}
                                onClick={() =>
                                  this.saveOrUpdateDivisions(
                                    this.state.updatedivision,
                                    this.state.accountDetails.ID,
                                    this.state.companyName,
                                    "add"
                                  )
                                }
                              ></DefaultButton>
                              <DefaultButton
                                className="btn-outline"
                                text="Cancel"
                                styles={modalButton}
                                onClick={() => { this.setblankfields(); this.setState({ showPopup: false }); }}
                              ></DefaultButton>
                            </div>
                          </div>
                        </FocusTrapZone>
                      </Popup>
                    </Layer>
                  )}
                </Stack>
              </Stack>
              <Separator className="i-seperator" />
              <div className="datatable-wrapper">
                <DataTable value={this.state.divisions} scrollable>
                  <Column
                    field="ID"
                    header="ID"
                    style={{ display: "none" }}
                  ></Column>
                  <Column
                    field="Division"
                    header="Division"
                    filter
                    style={{ minWidth: "270px" }}
                  ></Column>
                  <Column
                    field="Description"
                    header="Description"
                    filter
                    style={{ minWidth: "270px" }}
                  ></Column>
                  <Column
                    field="Programs"
                    header="Programs"
                    filter
                    style={{ minWidth: "360px" }}
                    className="columnWrap"
                  ></Column>
                  <Column
                    header="Actions"
                    body={divisionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: "100px" }}
                    align="center"
                    frozen
                    alignFrozen="right"
                  ></Column>
                </DataTable>
              </div>
            </TabPanel>
            <TabPanel header="Competitors">
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
              >
                <Text className="pageTitle">Competitors</Text>
                <Stack horizontal tokens={horizontalGap}>
                  <DefaultButton
                    className="btn-primary"
                    text="Add"
                    onClick={() => {
                      this.setState({ showPopup: true });
                      handleTextFieldClose();
                    }}
                  ></DefaultButton>
                  {showPopup && (
                    <Layer>
                      <Popup
                        className={addUpdatesPopupStyles.root}
                        role="dialog"
                        aria-modal="true"
                        onDismiss={() => this.setState({ showPopup: false })}
                      >
                        <Overlay
                          onClick={() => this.setState({ showPopup: false })}
                        />
                        <FocusTrapZone>
                          <div
                            role="document"
                            className={`modalPopup ${addUpdatesPopupStyles.content}`}
                          >
                            <Stack
                              horizontal
                              horizontalAlign="space-between"
                              verticalAlign="center"
                              className={styles.modalPopupHeader}
                            >
                              <Text className={styles.modalPopupTitle}>
                                Add Competitors
                              </Text>
                              <FontIcon
                                aria-label="Compass"
                                iconName="Cancel"
                                className={styles.iconStyle}
                                onClick={() => { this.setblankfields(); this.setState({ showPopup: false }); }}
                              />
                            </Stack>
                            <div className={styles.modalContent}>
                              <Stack {...columnProps} className="formChildGap">
                                <TextField
                                  label="Engagement Area"
                                  styles={textFieldProps}
                                  placeholder="Enter Engagement Area"
                                  value={this.state.updatecompetitors.Category}
                                  onChange={(event, value) =>
                                    this.handleCompetitorsTextFieldChange(
                                      "Category",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updatecompetitors.Category
                                      ? "Category is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <TextField
                                  label="Name"
                                  styles={textFieldProps}
                                  placeholder="Enter Name"
                                  value={this.state.updatecompetitors.Name}
                                  onChange={(event, value) =>
                                    this.handleCompetitorsTextFieldChange(
                                      "Name",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updatecompetitors.Name
                                      ? "Name is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <div className="i-row">
                                  <div className="i-col-4">
                                    <TextField
                                      label="Team Size"
                                      styles={textFieldProps}
                                      placeholder="Enter Team Size"
                                      value={
                                        this.state.updatecompetitors.TeamSize ==
                                          0
                                          ? ""
                                          : this.state.updatecompetitors.TeamSize.toString()
                                      }
                                      onChange={(event, value) => {
                                        if (value && /^\d+$/g.test(value)) {
                                          this.handleCompetitorsTextFieldChange(
                                            "TeamSize",
                                            value,
                                            null
                                          );
                                        } else if (value?.length == 0) {
                                          this.handleCompetitorsTextFieldChange(
                                            "TeamSize",
                                            value,
                                            null
                                          );
                                        }
                                      }}
                                      onBlur={handleTextFieldBlur}
                                      errorMessage={
                                        this.state.isTouched &&
                                          !this.state.updatecompetitors.TeamSize
                                          ? "TeamSize is required"
                                          : ""
                                      }
                                      required={true}
                                    />
                                  </div>
                                  <div className="i-col-8">
                                    <Dropdown
                                      label="Billing Type"
                                      placeholder="Select Billing Type"
                                      selectedKey={
                                        this.state.selectedkeycompetitors
                                      }
                                      options={optionsCompetitors}
                                      styles={dropdownStyles}
                                      className="droupdown"
                                      onChange={(event, value) =>
                                        this.handleCompetitorsTextFieldChange(
                                          "BillingType",
                                          value?.text,
                                          value?.key || ""
                                        )
                                      }
                                      onBlur={handleTextFieldBlur}
                                      errorMessage={
                                        this.state.isTouched &&
                                          !this.state.selectedkeycompetitors
                                          ? "Billing Type is required"
                                          : ""
                                      }
                                      required={true}
                                    />
                                  </div>
                                </div>

                                <TextField
                                  label="Engagement Rate ($)"
                                  styles={textFieldProps}
                                  placeholder="Enter Engagement Rate"
                                  value={
                                    this.state.updatecompetitors.EngagementRate
                                  }
                                  onChange={(event, value) =>
                                    this.handleCompetitorsTextFieldChange(
                                      "EngagementRate",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updatecompetitors.EngagementRate
                                      ? "Engagement Rate ($) is required."
                                      : ""
                                  }
                                  required={true}
                                />
                                <TextField
                                  label="Primary Technology"
                                  styles={textFieldProps}
                                  placeholder="Enter Primary Technology"
                                  value={
                                    this.state.updatecompetitors
                                      .PrimaryTechnology
                                  }
                                  onChange={(event, value) =>
                                    this.handleCompetitorsTextFieldChange(
                                      "PrimaryTechnology",
                                      value,
                                      null
                                    )
                                  }
                                />
                                <TextField
                                  label="Secondary Technology"
                                  styles={textFieldWithDescProps}
                                  placeholder="Enter Secondary Technology"
                                  description="Separate technology with “,”"
                                  value={
                                    this.state.updatecompetitors
                                      .SecondaryTechnology
                                  }
                                  onChange={(event, value) =>
                                    this.handleCompetitorsTextFieldChange(
                                      "SecondaryTechnology",
                                      value,
                                      null
                                    )
                                  }
                                />
                              </Stack>
                              <DefaultButton
                                className="btn-primary"
                                text="Save"
                                styles={modalButton}
                                onClick={() => {
                                  this.saveOrUpdateCompetitors(
                                    this.state.updatecompetitors,
                                    this.state.accountDetails.ID,
                                    this.state.companyName,
                                    "save"
                                  );
                                  this.setState({
                                    viewCompetitorsPopup: false,
                                  });
                                }}
                              ></DefaultButton>
                              <DefaultButton
                                className="btn-primary"
                                text="Save & Add"
                                styles={modalButton}
                                onClick={() => {
                                  this.saveOrUpdateCompetitors(
                                    this.state.updatecompetitors,
                                    this.state.accountDetails.ID,
                                    this.state.companyName,
                                    "add"
                                  );
                                  this.setState({
                                    viewCompetitorsPopup: false,
                                  });
                                }}
                              ></DefaultButton>
                              <DefaultButton
                                className="btn-outline"
                                text="Cancel"
                                styles={modalButton}
                                onClick={() => {
                                  this.setblankfields();
                                  this.setState({ showPopup: false });
                                  this.setState({
                                    viewCompetitorsPopup: false,
                                  });
                                }}
                              ></DefaultButton>
                            </div>
                          </div>
                        </FocusTrapZone>
                      </Popup>
                    </Layer>
                  )}
                </Stack>
              </Stack>
              <Separator className="i-seperator" />
              <div className="datatable-wrapper">
                <DataTable value={this.state.competitors} scrollable>
                  <Column
                    field="ID"
                    header="ID"
                    style={{ display: "none" }}
                  ></Column>
                  <Column
                    field="Category"
                    header="Engagement Area"
                    filter
                    style={{ minWidth: "215px" }}
                  ></Column>
                  <Column
                    field="Name"
                    header="Name"
                    filter
                    style={{ minWidth: "190px" }}
                  ></Column>
                  <Column
                    field="TeamSize"
                    header="Team Size"
                    filter
                    style={{ minWidth: "120px" }}
                    align="right"
                  ></Column>
                  <Column
                    field="BillingType"
                    header="Billing Type"
                    filter
                    style={{ minWidth: "145px" }}
                  ></Column>
                  <Column
                    field="EngagementRate"
                    header="Engagement Rate ($)"
                    filter
                    style={{ minWidth: "195px" }}
                    align="right"
                  ></Column>
                  <Column
                    header="Actions"
                    body={competitirsBodyTemplate}
                    exportable={false}
                    style={{ minWidth: "130px" }}
                    align="center"
                    frozen
                    alignFrozen="right"
                  ></Column>
                </DataTable>
              </div>
              {viewCompetitorsPopup && (
                <Layer>
                  <Popup
                    className={addUpdatesPopupStyles.root}
                    role="dialog"
                    aria-modal="true"
                    onDismiss={() =>
                      this.setState({ viewCompetitorsPopup: false })
                    }
                  >
                    <Overlay
                      onClick={() =>
                        this.setState({ viewCompetitorsPopup: false })
                      }
                    />
                    <FocusTrapZone>
                      <div
                        role="document"
                        className={addUpdatesPopupStyles.content}
                      >
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          verticalAlign="center"
                          className={styles.modalPopupHeader}
                        >
                          <Text className={styles.modalPopupTitle}>
                            View Competitors
                          </Text>
                          <FontIcon
                            aria-label="Compass"
                            iconName="Cancel"
                            className={styles.iconStyle}
                            onClick={() =>
                              this.setState({ viewCompetitorsPopup: false })
                            }
                          />
                        </Stack>
                        <div className={styles.modalContent}>
                          <div className="i-row">
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Category</Text>
                                <Text className="T-Desc">
                                  {this.state.updatecompetitors.Category}
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Name</Text>
                                <Text className="T-Desc">
                                  {this.state.updatecompetitors.Name}
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-6 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Team Size</Text>
                                <Text className="T-Desc">
                                  {this.state.updatecompetitors.TeamSize}
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-6 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Billing Type</Text>
                                <Text className="T-Desc">
                                  {this.state.updatecompetitors.BillingType}
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">
                                  Engagement Rate ($)
                                </Text>
                                <Text className="T-Desc">
                                  {this.state.updatecompetitors.EngagementRate}
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">
                                  Primary Technology
                                </Text>
                                <Text className="T-Desc">
                                  {
                                    this.state.updatecompetitors
                                      .PrimaryTechnology
                                  }
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">
                                  Secondary Technology
                                </Text>
                                <Text className="T-Desc">
                                  {
                                    this.state.updatecompetitors
                                      .SecondaryTechnology
                                  }
                                </Text>
                              </div>
                            </div>
                          </div>
                          <DefaultButton
                            className="btn-primary"
                            text="Edit"
                            styles={modalButton}
                            onClick={() => this.setState({ showPopup: true })}
                          ></DefaultButton>
                          <DefaultButton
                            className="btn-outline"
                            text="Cancel"
                            styles={modalButton}
                            onClick={() =>
                              this.setState({ viewCompetitorsPopup: false })
                            }
                          ></DefaultButton>
                        </div>
                      </div>
                    </FocusTrapZone>
                  </Popup>
                </Layer>
              )}
            </TabPanel>
            <TabPanel header="Customer Stakeholders">
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
              >
                <Text className="pageTitle">Customer Stakeholders</Text>
                <Stack horizontal tokens={horizontalGap}>
                  <DefaultButton
                    className="btn-primary"
                    text="Add"
                    onClick={() => {
                      this.setState({ showPopup: true });
                      handleTextFieldClose();
                    }}
                  ></DefaultButton>
                  {showPopup && (
                    <Layer>
                      <Popup
                        className={addUpdatesPopupStyles.root}
                        role="dialog"
                        aria-modal="true"
                        onDismiss={() => this.setState({ showPopup: false })}
                      >
                        <Overlay
                          onClick={() => this.setState({ showPopup: false })}
                        />
                        <FocusTrapZone>
                          <div
                            role="document"
                            className={`modalPopup ${addUpdatesPopupStyles.content}`}
                          >
                            <Stack
                              horizontal
                              horizontalAlign="space-between"
                              verticalAlign="center"
                              className={styles.modalPopupHeader}
                            >
                              <Text className={styles.modalPopupTitle}>
                                Add Customer Stakeholder
                              </Text>
                              <FontIcon
                                aria-label="Compass"
                                iconName="Cancel"
                                className={styles.iconStyle}
                                onClick={() =>
                                  this.setState({ showPopup: false })
                                }
                              />
                            </Stack>
                            <div className={styles.modalContent}>
                              <Stack {...columnProps} className='formChildGap'>
                                <div className='profileUploader'>
                                  <div className='profile'>
                                    <Image alt='Profile' src={this.state.profileUrl != null ? this.state.profileUrl : uploadProfileImage} />
                                    <div>
                                      {this.state.profileErrorMsg && (
                                        <p style={{ color: "#A4262C", fontSize: "12px", fontWeight: 400 }}>
                                          {this.state.profileErrorMsg}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className='uploadButton'>
                                    <label htmlFor="img" aria-required={true}><span> Upload </span></label>
                                    <input type="file" id="img" accept="image/*" onChange={handleChange} hidden />
                                  </div>
                                </div>

                                <TextField
                                  label="Full Name"
                                  styles={textFieldProps}
                                  placeholder="Enter Full Name"
                                  value={
                                    this.state.updatecustomerstackholders
                                      .FullName
                                  }
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "FullName",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updatecustomerstackholders
                                        .FullName
                                      ? "Full Name is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <TextField
                                  label="Designation"
                                  styles={textFieldProps}
                                  placeholder="Enter Designation"
                                  value={
                                    this.state.updatecustomerstackholders
                                      .Designation
                                  }
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "Designation",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updatecustomerstackholders
                                        .Designation
                                      ? "Designation is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <TextField
                                  label="Email"
                                  styles={textFieldProps}
                                  placeholder="Enter Email"
                                  value={
                                    this.state.updatecustomerstackholders.Email
                                  }
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "Email",
                                      value,
                                      null
                                    )
                                  }
                                />

                                <TextField
                                  label="LinkedIn ID"
                                  styles={textFieldProps}
                                  placeholder="Enter LinkedIn ID"
                                  value={
                                    this.state.updatecustomerstackholders
                                      .LinkedInID
                                  }
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "LinkedInID",
                                      value,
                                      null
                                    )
                                  }
                                />

                                <Dropdown
                                  label="Relation with EIC"
                                  placeholder="Select Relation with EIC"
                                  selectedKey={
                                    this.state.selectedkeyrelationwitheic
                                  }
                                  options={optionsCustomerStakeholders}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "RelationwithEIC",
                                      value?.text,
                                      value?.key || ""
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.selectedkeyrelationwitheic
                                      ? "Relation with EIC is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                {/* <Dropdown
                                  label="Division"
                                  placeholder="Select Division"
                                  selectedKey={
                                    this.state.selectedkeybusinessunit
                                  }
                                  options={optionsBU}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "BusinessUnit",
                                      value?.text,
                                      value?.key || ""
                                    )
                                  }
                                /> */}
                                <Dropdown
                                  label="Programs"
                                  placeholder="Select Program"
                                  selectedKey={this.state.updatecustomerstackholders.Project}
                                  options={this.state.projectOptions.filter((x: any) => x.accountName === this.state.accountDetails.AccountName)}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "Project",
                                      value?.text,
                                      value?.key || ""
                                    )
                                  }
                                />
                                <TextField
                                  label="Division"
                                  styles={textFieldProps}
                                  placeholder="Entert Division"
                                  value={this.state.updatecustomerstackholders.BusinessUnit}
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "BusinessUnit",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                />
                                <TextField
                                  label="Contact"
                                  styles={textFieldProps}
                                  placeholder="Entert Contact No"
                                  value={this.state.updatecustomerstackholders.Contact}
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "Contact",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                />
                                <TextField
                                  label="Manager Email"
                                  styles={textFieldProps}
                                  placeholder="Manager Email"
                                  value={
                                    this.state.updatecustomerstackholders
                                      .ManagerEmail
                                  }
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "ManagerEmail",
                                      value,
                                      null
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                // errorMessage={
                                //   this.state.isTouched &&
                                //   !this.state.updatecustomerstackholders
                                //     .ManagerEmail
                                //     ? "Manager Email is required."
                                //     : ""
                                // }
                                //required={true}
                                />
                                <Dropdown
                                  label="Report To"
                                  placeholder="Select Report To"
                                  selectedKey={this.state.selectedkeyreportto}
                                  options={optionsReportTo}
                                  styles={dropdownStyles}
                                  className="droupdown"
                                  onChange={(event, value) =>
                                    this.handlecustomerstackholdersTextFieldChange(
                                      "ReportToId",
                                      value?.key,
                                      value?.key || ""
                                    )
                                  }
                                  onBlur={handleTextFieldBlur}
                                // errorMessage={
                                //   this.state.isTouched &&
                                //   !this.state.selectedkeyreportto
                                //     ? "Report To is required."
                                //     : ""
                                // }
                                // required={true}
                                />
                              </Stack>
                              <DefaultButton
                                className="btn-primary"
                                text="Save"
                                styles={modalButton}
                                onClick={() => {
                                  this.saveOrUpdatecustomerstackholders(
                                    this.state.updatecustomerstackholders,
                                    this.state.accountDetails.ID,
                                    this.state.companyName,
                                    "save"
                                  );
                                  this.setState({
                                    viewCompetitorsPopup: false,
                                  });
                                }}
                              ></DefaultButton>
                              <DefaultButton
                                className="btn-outline"
                                text="Cancel"
                                styles={modalButton}
                                onClick={() => {
                                  this.setblankfields();
                                  this.setState({ showPopup: false });
                                  this.setState({
                                    viewCompetitorsPopup: false,
                                  });
                                }}
                              ></DefaultButton>
                            </div>
                          </div>
                        </FocusTrapZone>
                      </Popup>
                    </Layer>
                  )}
                </Stack>
              </Stack>
              <Separator className="i-seperator" />
              <div className="datatable-wrapper">
                <DataTable value={this.state.customerstackholders} scrollable>
                  <Column
                    field="ID"
                    header="ID"
                    style={{ display: "none" }}
                  ></Column>
                  <Column
                    field="Photo"
                    header="Photo"
                    style={{ display: "none" }}
                  ></Column>
                  <Column
                    field="FullName"
                    header="Full Name"
                    filter
                    body={customerStakeholdersUserBodyTemplate}
                    style={{ minWidth: "210px" }}
                  ></Column>
                  <Column
                    field="Designation"
                    header="Designation"
                    filter
                    style={{ minWidth: "230px" }}
                    className="columnWrap"
                  ></Column>
                  <Column
                    field="Email"
                    header="Email"
                    filter
                    style={{ minWidth: "230px" }}
                  ></Column>
                  <Column
                    field="RelationwithEIC"
                    header="Relation with EIC"
                    style={{ minWidth: "195px" }}
                    className="relation"
                    body={customerStakeholdersRelationBodyTemplate}
                  ></Column>
                  <Column
                    header="Actions"
                    body={customerstackholdersBodyTemplate}
                    exportable={false}
                    style={{ minWidth: "130px" }}
                    align="center"
                    frozen
                    alignFrozen="right"
                  ></Column>
                </DataTable>
              </div>

              {viewCompetitorsPopup && (
                <Layer>
                  <Popup
                    className={addUpdatesPopupStyles.root}
                    role="dialog"
                    aria-modal="true"
                    onDismiss={() =>
                      this.setState({ viewCompetitorsPopup: false })
                    }
                  >
                    <Overlay
                      onClick={() =>
                        this.setState({ viewCompetitorsPopup: false })
                      }
                    />
                    <FocusTrapZone>
                      <div
                        role="document"
                        className={addUpdatesPopupStyles.content}
                      >
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          verticalAlign="center"
                          className={styles.modalPopupHeader}
                        >
                          <Text className={styles.modalPopupTitle}>
                            View Customer Stakeholder
                          </Text>
                          <FontIcon
                            aria-label="Compass"
                            iconName="Cancel"
                            className={styles.iconStyle}
                            onClick={() =>
                              this.setState({ viewCompetitorsPopup: false })
                            }
                          />
                        </Stack>
                        <div className={styles.modalContent}>
                          <div className="i-row">
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex i-gap-10">
                                <Image className={styles.viewImage}
                                  src={this.state.profileUrl != null ? this.state.profileUrl : uploadProfileImage} height={45} width={45} />
                                <div className="d-flex flex-column">
                                  <Text className="T-Title">Full Name</Text>
                                  <Text className="T-Desc">
                                    {
                                      this.state.updatecustomerstackholders
                                        .FullName
                                    }
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Designation</Text>
                                <Text className="T-Desc">
                                  {
                                    this.state.updatecustomerstackholders
                                      .Designation
                                  }
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12  i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Email</Text>
                                <Text className="T-Desc">
                                  {this.state.updatecustomerstackholders.Email}
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">LinkedIn ID</Text>
                                <Text className="T-Desc">
                                  {
                                    this.state.updatecustomerstackholders
                                      .LinkedInID
                                  }
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">
                                  Relation with EIC
                                </Text>
                                <Text className="T-Desc">
                                  {
                                    this.state.updatecustomerstackholders
                                      .RelationwithEIC
                                  }
                                </Text>
                              </div>
                            </div>
                            <div className="i-col-12 i-mb-13">
                              <div className="d-flex flex-column">
                                <Text className="T-Title">Manager Email</Text>
                                <Text className="T-Desc">
                                  {
                                    this.state.updatecustomerstackholders
                                      .ManagerEmail
                                  }
                                </Text>
                              </div>
                            </div>
                          </div>
                          <DefaultButton
                            className="btn-primary"
                            text="Edit"
                            styles={modalButton}
                            onClick={() => this.setState({ showPopup: true })}
                          ></DefaultButton>
                          <DefaultButton
                            className="btn-outline"
                            text="Cancel"
                            styles={modalButton}
                            onClick={() =>
                              this.setState({ viewCompetitorsPopup: false })
                            }
                          ></DefaultButton>
                        </div>
                      </div>
                    </FocusTrapZone>
                  </Popup>
                </Layer>
              )}
            </TabPanel>
          </TabView>
        </div>
      </section>
    );
  }
}
