import * as React from "react";
import styles from "./EiAccountDashboardUpdates.module.scss";
import "../../common.css";
import type { IEiAccountDashboardUpdatesProps } from "./IEiAccountDashboardUpdatesProps";
import {
  Stack,
  Image,
  Text,
  mergeStyleSets,
  IStackProps,
  FocusTrapZone,
  Layer,
  Overlay,
  Popup,
  Link,
  FontIcon,
  TextField,
  ITextFieldStyles,
  DefaultButton,
  IButtonStyles,
  PrimaryButton,
  IStackTokens,
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/primereact.css";
import "../../eiAccountDashboardCompetitors/components/datatableDesign.css";
import EiAccountService from "../../../services/EiAccountService";
import { IUpdates } from "../../../model/IUpdates";
import { KeyAccountName } from "../../../services/siteconfig";

import { format } from "date-fns"; // Import date-fns for date formatting
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";

import { SPFx, spfi } from "@pnp/sp";
import { IEmailProperties } from "@pnp/sp/sputilities";
import "@pnp/sp/sputilities";
import { Toaster, toast } from 'react-hot-toast';

export interface IEiAccountDashboardUpdatesState {
  updates: IUpdates[];
  updateUpdate: IUpdates;
  showPopup: boolean;
  sharePopup: boolean;
  selectedRows: [];
  mailRemarks: string;
  selectedCategory: string;
  to: [];
  cc: [];

  AccountNameId: number;
  shareDeleteDiasable: boolean;
  selectedRowData: any;
  Category: string;
  ButtonDisable: boolean;
  hideDialog: boolean;
  isTouched: boolean;
  companyName: string;
  isTouchedUpdate: boolean;
  updateDisabled: boolean;
}

export default class EiAccountDashboardUpdates extends React.Component<
  IEiAccountDashboardUpdatesProps,
  IEiAccountDashboardUpdatesState,
  {}
> {
  private eiAccountService: EiAccountService;

  constructor(props: IEiAccountDashboardUpdatesProps) {
    super(props);

    this.state = {
      showPopup: false,
      isTouched: false,
      isTouchedUpdate: false,
      sharePopup: false,
      selectedRows: [],
      selectedCategory: "both",
      selectedRowData: [],
      mailRemarks: "",
      updates: [],
      to: [],
      cc: [],
      Category: "",
      ButtonDisable: true,
      hideDialog: false,
      shareDeleteDiasable: true,
      updateUpdate: {
        ID: 0,
        UpdateName: "",
        Details: "",
        Category: "",
        UpdateCreated: new Date(),
        AccountNameId: 0,
        selectedCategoryUpdate: "",
        selectedRowData: [], // or the initial value based on its type
        isButtonVisible: false,
        AccountName: undefined,
        Account_Name: '',
      },
      updateDisabled: true, companyName: "JCI",
      AccountNameId: this.props.event.tryGetValue(),
    };

    this.eiAccountService = new EiAccountService();
    // this.handleCategoryChangeUpdate =
    //   this.handleCategoryChangeUpdate.bind(this);
    // // Bind the method to maintain correct context
    // this.handleUpdatesTextFieldChange =
    //   this.handleUpdatesTextFieldChange.bind(this);
  }
  public handleInputChange = async (event: any) => {
    const { id, value } = event.target;
    switch (id) {
      case "to":
        {
          const toList = value.split(";").map((email: any) => email.trim());
          this.setState({ to: toList });
        }
        break;
      case "cc":
        {
          const ccList = value.split(";").map((email: any) => email.trim());
          this.setState({ cc: ccList });
        }
        break;
      case "remarks":
        this.setState({ mailRemarks: value });
        break;

      default:
        break;
    }
  };
  public async componentDidMount(): Promise<void> {
    // this.props.sharedService.subscribe(this.handleAccountChange);
    console.log("componentDidMount Updates");

    const data = sessionStorage.getItem(KeyAccountName);

    console.log("data", data);
    // Convert the string to an integer
    // Use a base of 10 for decimal numbers

    if (data != null) {
      // const AccountNameId = parseInt(data, 10);
      const AccountNameId = this.props.event.tryGetValue();
      this.setState({ AccountNameId: AccountNameId });
    }

    await this.getUpdates(this.props.event.tryGetValue()); // Replace 1 with the actual AccountNameId from your data source
  }

  public async componentWillReceiveProps(
    nextProps: IEiAccountDashboardUpdatesProps
  ) {
    try {
      if (this.props != nextProps) {
        if (!nextProps.needsConfiguration) {
          if (nextProps.event.tryGetValue() != undefined) {
            console.log("Update overview Data");
            // console.log("Update Data Print2::", this.props.event.tryGetValue());
            await this.getUpdates(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  // Update the Updates when the selected account changes
  // private handleAccountChange = (selectedOption: string) => {
  //   const AccountNameId = parseInt(selectedOption, 10); // Convert the selected option to the appropriate type
  //   this.getUpdates(AccountNameId);
  // };

  public async getUpdates(AccountName: string): Promise<void> {
    if (!AccountName) {
      console.error("Account name is undefined or empty.");
      return;
    }

    const modifiedAccountName = AccountName.replace(/"/g, "'");
    const { selectedCategory } = this.state;
    const updates: IUpdates[] = await this.eiAccountService.getUpdates(
      modifiedAccountName,
      selectedCategory
    );
    // console.log("updates fg", updates, AccountNameId, selectedCategory);
    // console.log("Category", this.state.Category);
    // this.setState({ companyName: updates[0]?.AccountName?.AccountName || "" });
    this.setState({
      updates: updates,
      companyName: AccountName.replace(/"/g, ""),
    });
  }

  onSelectionChange = (e: { value: any }) => {
    let tempUpdateDetails: any = { ...this.state.updateUpdate };
    const selectedRows = e.value;
    const selectedRowData = selectedRows.map((rowKey: any) =>
      this.state.updates.find((row) => row.ID === rowKey.ID)
    );
    if (selectedRowData.length > 0) {
      tempUpdateDetails.ID = selectedRowData[0].ID;
      tempUpdateDetails.UpdateName = selectedRowData[0].UpdateName;
      tempUpdateDetails.Details = selectedRowData[0].Details;
      tempUpdateDetails.AccountNameId = selectedRowData[0].AccountNameId;
      tempUpdateDetails.UpdateCreated = selectedRowData[0].UpdateCreated;
      tempUpdateDetails.Category = selectedRowData[0].Category;
      tempUpdateDetails.selectedCategoryUpdate = selectedRowData[0].Category;

    } else {
      tempUpdateDetails.ID = 0;
      tempUpdateDetails.UpdateName = "";
      tempUpdateDetails.Details = "";
      (tempUpdateDetails.AccountNameId = 0),
        (tempUpdateDetails.selectedCategoryUpdate = "");
      tempUpdateDetails.UpdateCreated = new Date();
      tempUpdateDetails.Category = "";
      tempUpdateDetails.isButtonVisible = false;

      this.setState({ isTouchedUpdate: false });
    }

    console.log('selectedRowData length :: ', selectedRowData.length)

    if (selectedRowData.length == 1) {
      this.setState({ updateDisabled: false });
    } else {
      this.setState({ updateDisabled: true });
    }

    this.setState({
      selectedRows: selectedRowData,
      selectedRowData: selectedRowData,
      updateUpdate: tempUpdateDetails,
      ButtonDisable: selectedRowData.length == 1 ? false : true,
      shareDeleteDiasable: selectedRowData.length > 0 ? false : true,
    });
  };

  // public async sendEmail() {
  //   var sp = spfi().using(SPFx(this.props.context));
  //   var subject = "find details";
  //   const toEmails = this.state.to.join(';'); // Join email addresses with semicolon (;)
  //   const ccEmails = this.state.cc.join(';');
  //   const selectedRowsTable = this.createSelectedRowsTable();
  //   var bodyTeam = "Dear Team, <br>";
  //   bodyTeam += selectedRowsTable;
  //   bodyTeam += "Thank You,<br>";

  //   bodyTeam += "<br><font size='1'>This is system generated email. Please do not reply.</font>";
  //   const emailProps: IEmailProperties = {
  //     To: [toEmails],
  //     CC: [ccEmails],
  //     Subject: subject,
  //     Body: bodyTeam,
  //     AdditionalHeaders: {
  //       "content-type": "text/html"
  //     }
  //   };
  //   await sp.utility.sendEmail(emailProps);

  //   // After sending email
  // console.log("Updates Shared Successfully"); // Console log
  // alert("Updates Shared Successfully"); // Alert

  //   this.setState({ sharePopup: false });

  // }

  public async sendEmail() {
    let sp = spfi().using(SPFx(this.props.context));
    let subject = "find details";
    const toEmails = this.state.to.join(";"); // Join email addresses with semicolon (;)
    const ccEmails = this.state.cc.join(";");
    const selectedRowsTable = this.createSelectedRowsTable();
    let bodyTeam = "Dear Team, <br>";
    bodyTeam += selectedRowsTable;
    bodyTeam += "Thank You,<br>";

    bodyTeam +=
      "<br><font size='1'>This is system generated email. Please do not reply.</font>";

    // Set isTouched state to true when handling input
    this.setState({ isTouched: true });

    // Validation for To field
    if (!toEmails || !this.validateEmails(toEmails)) {
      toast.error("To is required."); // Alert user about invalid email address
      return;
    }

    const emailProps: IEmailProperties = {
      To: [toEmails],
      CC: [ccEmails],
      Subject: subject,
      Body: bodyTeam,
      AdditionalHeaders: {
        "content-type": "text/html",
      },
    };

    try {
      await sp.utility.sendEmail(emailProps);

      // After sending email
      console.log("Updates Shared Successfully"); // Console log
      toast.success("Updates shared Successfully"); // Alert

      this.setState({ sharePopup: false });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email, Please try again."); // Alert user about error
      this.setState({ sharePopup: false });
    }

  }

  // Function to validate email addresses
  private validateEmails(emails: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    const emailArray = emails.split(";"); // Split email addresses by semicolon
    for (let i = 0; i < emailArray.length; i++) {
      if (!emailRegex.test(emailArray[i].trim())) {
        return false; // Return false if any email address is invalid
      }
    }
    return true; // Return true if all email addresses are valid
  }

  private async handleDeleteRow() {
    debugger;
    console.log('handleDeleteRow called...');

    if (this.state.selectedRowData.length > 0) {
      this.setState({ hideDialog: true })
    } else {
      // No selected rows, handle accordingly
      console.log("No rows selected to delete.");
      toast.error("Please select at least one item to delete");
    }
  }

  private async handleShareButton() {
    debugger;
    console.log('handleDeleteRow called...');

    if (this.state.selectedRowData.length > 0) {
      this.setState({ sharePopup: true })
    } else {
      // No selected rows, handle accordingly
      console.log("No rows selected to delete.");
      toast.error("Please select at least one item to share");
    }
  }


  public async deleteRows() {
    if (this.state.selectedRowData.length > 0) {

      // Call deleteMultipleUpdates function
      const deleteSuccess = await this.eiAccountService.deleteMultipleUpdates(this.state.selectedRowData);

      // Check if deletion was successful
      if (deleteSuccess) {
        // Deletion successful, handle accordingly
        toast.success('Update details deleted successfully.');
        console.log("Selected rows deleted successfully!");
      } else {
        // Deletion failed, handle accordingly
        console.error("Failed to delete selected rows!");
      }
    } else {
      // No selected rows, handle accordingly
      console.log("No rows selected to delete.");
    }
    await this.getUpdates(this.props.event.tryGetValue());
    this.setState({
      hideDialog: false, selectedRowData: [], selectedRows: [],
      isTouchedUpdate : false,
      updateDisabled : true,
      updateUpdate: {
        ID: 0,
        UpdateName: "",
        Details: "",
        Category: "",
        UpdateCreated: new Date(),
        AccountNameId: 0,
        selectedCategoryUpdate: "",
        selectedRowData: [], // or the initial value based on its type
        isButtonVisible: false,
        AccountName: undefined,
        Account_Name: '',
      }
    });
  }
  // private async deleteRows() {
  //     try {
  //         // Call deleteMultipleUpdates function
  //         const deleteSuccess = await this.eiAccountService.deleteMultipleUpdates(this.state.selectedRowData);

  //         // Check if deletion was successful
  //         if (deleteSuccess) {
  //             // Deletion successful, handle accordingly
  //             console.log("Selected Updates Deleted Successfully!");

  //             // Update state to remove deleted updates from selectedRowData
  //             const remainingUpdates = this.state.selectedRowData.filter((update: { deleted: any; }) => !update.deleted);
  //             this.setState(prevState => ({
  //                 selectedRowData: remainingUpdates,
  //                 hideDialog: false // Reset hideDialog if necessary
  //             }));

  //             // Auto-refresh by fetching updates again
  //             await this.getUpdates(this.state.AccountNameId);

  //             // Alert the user
  //             alert("Selected Updates Deleted Successfully");
  //         } else {
  //             // Deletion failed, handle accordingly
  //             console.error("Failed to delete selected rows!");
  //         }
  //     } catch (error) {
  //         console.error("Error deleting rows:", error);
  //     }
  // }

  private createSelectedRowsTable() {
    // Extract selected rows' details from state or props
    const selectedRows = this.state.selectedRowData;
    let tableHTML =
      "<table border='1'><tr><th>UpdateName</th><th>Details</th><th>Category</th></tr>";
    selectedRows.forEach((row: any) => {
      tableHTML += `<tr><td>${row.UpdateName}</td><td>${row.Details}</td><td>${row.Category}</td></tr>`; // Update column names accordingly
    });
    tableHTML += "</table>";

    tableHTML += `<p>Remarks :${this.state.mailRemarks}</p>`;

    return tableHTML;
  }

  // private createSelectedRowsTable() {
  //   // Extract selected rows' details from state or props
  //   const selectedRows = this.state.selectedRowData;
  //   let tableHTML = "<table border='1'><tr><th>UpdateName</th><th>Details</th><th>Category</th></tr>";
  //   selectedRows.forEach((row: any) => {
  //     tableHTML += `<tr><td>${row.UpdateName}</td><td>${row.Details}</td><td>${row.Category}</td></tr>`; // Update column names accordingly
  //   });
  //   tableHTML += "</table>";

  //   tableHTML += `<p>Remarks :${this.state.mailRemarks}</p>`;

  //   return tableHTML;
  // }

  // public async deleteRows() {

  //   if (this.state.selectedRowData.length > 0) {

  //     // Call deleteMultipleUpdates function
  //     const deleteSuccess = await this.eiAccountService.deleteMultipleUpdates(this.state.selectedRowData);

  //     // Check if deletion was successful
  //     if (deleteSuccess) {
  //       // Deletion successful, handle accordingly
  //       console.log("Selected Updates Deleted Successfully!");
  //       alert("Selected Updates Deleted Successfully");
  //     } else {
  //       // Deletion failed, handle accordingly
  //       console.error("Failed to delete selected rows!");
  //     }
  //   } else {
  //     // No selected rows, handle accordingly
  //     console.log("No rows selected to delete.");
  //   }
  //   await this.getUpdates(this.state.AccountNameId);
  //   this.setState({ hideDialog: false });
  // }

  // public async deleteRows() {
  //   if (this.state.selectedRowData.length > 0) {
  //     // Call deleteMultipleUpdates function
  //     const deleteSuccess = await this.eiAccountService.deleteMultipleUpdates(this.state.selectedRowData);

  //     // Check if deletion was successful
  //     if (deleteSuccess) {
  //       // Deletion successful, handle accordingly
  //       console.log("Selected Updates Deleted Successfully!");
  //       alert("Selected Updates Deleted Successfully");

  //       // Update state to remove deleted updates from selectedRowData
  //       const remainingUpdates = this.state.selectedRowData.filter((update: { deleted: any; }) => !update.deleted);
  //       this.setState(prevState => ({
  //         selectedRowData: remainingUpdates,
  //         hideDialog: false // Reset hideDialog if necessary
  //       }));

  //       // Auto-refresh by fetching updates again
  //     await this.getUpdates(this.state.AccountNameId);

  //     } else {
  //       // Deletion failed, handle accordingly
  //       console.error("Failed to delete selected rows!");
  //     }
  //   } else {
  //     // No selected rows, handle accordingly
  //     console.log("No rows selected to delete.");
  //   }
  //   await this.getUpdates(this.state.AccountNameId);
  //   this.setState({ hideDialog: false });
  // }

  // public async deleteRows() {
  //   if (this.state.selectedRowData.length > 0) {
  //     try {
  //       // Call deleteMultipleUpdates function
  //       const deleteSuccess = await this.eiAccountService.deleteMultipleUpdates(this.state.selectedRowData);

  //       // Check if deletion was successful
  //       if (deleteSuccess) {
  //         // Deletion successful, handle accordingly
  //         console.log("Selected Updates Deleted Successfully!");

  //         // Update state to remove deleted updates from selectedRowData
  //         const remainingUpdates = this.state.selectedRowData.filter((update: { deleted: any; }) => !update.deleted);
  //         this.setState(prevState => ({
  //           selectedRowData: remainingUpdates,
  //           hideDialog: false // Reset hideDialog if necessary
  //         }));

  //         // Auto-refresh by fetching updates again
  //         await this.getUpdates(this.state.AccountNameId);

  //         // Alert the user
  //         alert("Selected Updates Deleted Successfully");
  //       } else {
  //         // Deletion failed, handle accordingly
  //         console.error("Failed to delete selected rows!");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting rows:", error);
  //     }
  //   } else {
  //     // No selected rows, handle accordingly
  //     console.log("No rows selected to delete.");
  //   }
  // }

  private handleCategoryChange = (selectedCategory: string) => {
    this.setState({ selectedCategory }, () => {
      this.getUpdates(this.props.event.tryGetValue());
    });
    this.setState({ selectedRows: [] });
    this.setState({ updateDisabled: true });
  };
  private handleCategoryChangeUpdate = (selectedCategoryUpdate: string) => {
    let tempUpdateDetails: any = { ...this.state.updateUpdate };
    tempUpdateDetails.selectedCategoryUpdate = selectedCategoryUpdate;
    this.setState({ updateUpdate: tempUpdateDetails });
  };

  // private async updateData() {
  //   await this.eiAccountService.saveOrUpdateUpdates(this.state.updateUpdate, this.state.updateUpdate.AccountNameId);
  //   await this.getUpdates(this.state.AccountNameId);
  //   alert('Account Updates saved successfully.');
  // }

  // Add a method to handle validation
  private handleValidation = (): boolean => {
    // Perform your validation logic here
    const { updateUpdate } = this.state;
    const isValid =
      updateUpdate.UpdateName.trim() !== "" &&
      updateUpdate.Details.trim() !== "" &&
      updateUpdate.Category.trim() !== "";

    // Update the isTouched state to indicate that validation has been triggered
    this.setState({ isTouched: true });

    return isValid;
  };

  // private async updateData() {
  //   try {
  //     if (!this.state.updateUpdate.UpdateName || !this.state.updateUpdate.Details) {
  //       this.setState({ isTouched: true });
  //       return;
  //     }
  //     await this.eiAccountService.saveOrUpdateUpdates(this.state.updateUpdate, this.state.updateUpdate.AccountNameId);
  //     await this.getUpdates(this.state.AccountNameId);
  //     alert('Account Updates saved successfully.');
  //     // Close the popup after saving the data
  //     this.setState({ showPopup: false, isTouched: false });
  //   } catch (error) {
  //     console.error('Error saving or updating Account Updates:', error);
  //   }
  // }

  // Update the updateData method to include validation before saving data
  // private async updateData() {
  //   try {
  //     // Call the validation method before saving data
  //     const isValid = this.handleValidation();
  //     if (!isValid) {
  //       return;
  //     }

  //     // If validation passes, proceed with saving data
  //     await this.eiAccountService.saveOrUpdateUpdates(this.state.updateUpdate, this.state.updateUpdate.AccountNameId);
  //     await this.getUpdates(this.state.AccountNameId);
  //     alert('Account Updates Updated successfully.');

  //     // Close the popup after saving the data
  //     this.setState({ showPopup: false, isTouched: false });
  //   } catch (error) {
  //     console.error('Error saving or updating Account Updates:', error);
  //   }
  // }

  // private async updateData() {
  //   try {
  //     // Call the validation method before saving data
  //     const isValid = this.handleValidation();
  //     if (!isValid) {
  //       return;
  //     }

  //     // If validation passes, proceed with saving data
  //     await this.eiAccountService.saveOrUpdateUpdates(this.state.updateUpdate, this.state.updateUpdate.AccountNameId);
  //     await this.getUpdates(this.state.AccountNameId);

  //     // Update state to reflect changes
  //     this.setState(prevState => ({
  //       showPopup: false,
  //       isTouched: false,
  //       updateUpdate: { ...prevState.updateUpdate } // Ensure state update to trigger re-rendering
  //     }));

  //     // Alert the user
  //     alert('Account Updates Updated successfully.');
  //   } catch (error) {
  //     console.error('Error saving or updating Account Updates:', error);
  //   }
  // }

  private async updateData() {
    try {
      // Call the validation method before saving data
      const isValid = this.handleValidation();
      if (!isValid) {
        return;
      }

      // If validation passes, proceed with saving data
      await this.eiAccountService.saveOrUpdateUpdates(
        this.state.updateUpdate,
        this.state.companyName
      );

      // Update state to reflect changes
      this.setState((prevState) => ({
        showPopup: false,
        isTouched: false,
        updateUpdate: { ...prevState.updateUpdate }, // Ensure state update to trigger re-rendering
      }));

      // Auto-refresh by fetching updates again
      await this.getUpdates(this.props.event.tryGetValue());

      // Alert the user
      toast.success('Update details updated successfully.');
    } catch (error) {
      console.error("Error saving or updating Account Updates:", error);
    }
  }

  // private async saveOrUpdateUpdates(updateUpdate: IUpdates, AccountNameId: number, saveoradd: string): Promise<void> {
  //   console.log('updateUpdate', updateUpdate);
  //   console.log('AccountNameId', AccountNameId);

  //   const issaved = await this.eiAccountService.saveOrUpdateUpdates(
  //     updateUpdate,
  //     AccountNameId
  //   );
  //   if (issaved) {

  //     console.log('Saved or updated item:', updateUpdate);
  //     await this.getUpdates(this.props.event.tryGetValue());
  //     if (saveoradd === "save") {
  //       this.setState({ showPopup: false });

  //     }

  //     this.setblankfields();
  //   } else {
  //     console.error('Error saving or updating Updates details:');
  //   }
  // }

  private async saveOrUpdateUpdates(
    updateUpdate: IUpdates,
    AccountName: string,
    saveoradd: string
  ): Promise<void> {
    // // Perform validation
    // if (updateUpdate.UpdateName.trim() === '' || updateUpdate.Details.trim() === '') {
    //   alert('Title and Details cannot be empty.');
    //   console.error('Validation error: UpdateName and Details cannot be empty.');
    //   return;
    // }

    console.log("updateUpdate", updateUpdate);
    console.log("AccountName", AccountName);

    try {
      if (updateUpdate.UpdateName.trim() != '' && updateUpdate.Details.trim() != '' && updateUpdate.Category.trim() != '') {
        // Save or update the updates
        const issaved = await this.eiAccountService.saveOrUpdateUpdates(
          updateUpdate,
          AccountName
        );

        if (issaved) {
          console.log("Saved or updated item:", updateUpdate);
          await this.getUpdates(this.props.event.tryGetValue());

          if (saveoradd === "save") {
            this.setState({ showPopup: false });
          }

          this.setblankfields();

          if (updateUpdate.ID != 0) {
            toast.success('Update details updated successfully.');
          } else {
            toast.success('Update details added successfully.');
          }

        } else {
          console.error("Error saving or updating Updates details:");
        }
      }
    } catch (error) {
      console.error("Error saving or updating Updates details:", error);
    }
  }

  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" +
  //     sourceParam;
  // };

  toggleHideDialog = () => {
    this.setState({ hideDialog: false });
  };
  // Event handler for updating state when a TextField value changes
  handleUpdatesTextFieldChange = (fieldName: any, value: any, key: any) => {
    this.setState({
      updateUpdate: {
        ...this.state.updateUpdate,
        [fieldName]: value,
      },
      isTouched: true, // Set isTouched to true whenever a change occurs
    });

    // if(key !== null){
    //   this.setState({ selectedkeyupdates: key});
    // }

    console.log(this.state.updateUpdate);
  };

  // handleChoiceGroupChange = (event: React.FormEvent<HTMLInputElement>, option?: IChoiceGroupOption) => {
  //   const value = option?.text || '';
  //   this.handleUpdatesTextFieldChange('Category', value, '');
  // };

  // handleChoiceGroupChange = (event: React.FormEvent<HTMLInputElement>, option?: IChoiceGroupOption) => {
  //   const value = option?.key || ''; // Assuming option.key represents the category value
  //   this.handleUpdatesTextFieldChange('Category', value, '');
  // };

  handleChoiceGroupChange = (
    event: React.FormEvent<HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    this.setState({
      updateUpdate: {
        ...this.state.updateUpdate,
        Category: option?.key || "",
      },
      isTouched: true,
    });
  };

  private setblankfields() {
    this.setState({
      updateUpdate: {
        ID: 0,
        UpdateName: "",
        Details: "",
        Category: "",
        UpdateCreated: new Date(),
        AccountNameId: 0,
        selectedCategoryUpdate: "",
        selectedRowData: [],
        isButtonVisible: false,
        AccountName: {},
        Account_Name: '',
      },
    });
  }

  public render(): React.ReactElement<IEiAccountDashboardUpdatesProps> {
    const showPopup = this.state.showPopup;
    const sharePopup = this.state.sharePopup;

    const options: IChoiceGroupOption[] = [
      { key: "highlight", text: "Highlight" },
      { key: "lowlight", text: "Lowlight" },
      { key: "both", text: "Both" },
    ];

    const addUpdatesOptions: IChoiceGroupOption[] = [
      { key: "Highlight", text: "Highlight" },
      { key: "Lowlight", text: "Lowlight" },
    ];
    const updateOptions: IChoiceGroupOption[] = [
      { key: "Highlight", text: "Highlight" },
      { key: "Lowlight", text: "Lowlight" },
    ];
    const modalButton: Partial<IButtonStyles> = {
      root: { margin: "20px 0 20px 10px", float: "right" },
    };

    const iconGap: IStackTokens = {
      childrenGap: 5,
    };

    const textFieldProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { height: 40, border: "1px solid #D7DADE", color: "#D7DADE" },
    };
    const textFieldParagraphProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { border: "1px solid #D7DADE", color: "#D7DADE" },
    };

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
        maxWidth: "704px",
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

    const rowClass = () => {
      return {
        "bg-primary": "Highlight",
      };
    };

    // const statusBodyTemplate = () => {
    //   return (
    //     <span>Highlight</span>
    //   );
    // };

    // const updateBodyTemplate = (rowData: any) => {
    //   return (
    //     <React.Fragment>
    //       {/* <FontIcon aria-label="edit" iconName="EditSolid12" className={styles.editIcon} onClick={() => this.editUpdates(rowData)} /> */}
    //       <FontIcon aria-label="delete" iconName="delete" className={styles.deleteIcon} onClick={() => this.deleteUpdates(rowData.ID, this.state.updateUpdate.ID)} />
    //     </React.Fragment>
    //   );
    // };

    const dialogContentProps = {
      type: DialogType.normal,
      title: "Confirmation",
      subText: "Are you sure you want to delete the selected updates?",
    };
    const expandImage = require("../assets/ArrowsOut-f.png");

    const location = window.location.href.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    let imgsrc = null;

    if (location != `${siteUrl}/SitePages/Updates.aspx`) {
      imgsrc = { expandImage };
    }
    const rowsPerPage = 5;

    const handleTextFieldBlur = () => {
      this.setState({ isTouched: true });
    };

    const handleTextFieldClose = () => {
      this.setState({ isTouched: false });
    };

    const handleBlurUpdate = () => {
      this.setState({ isTouchedUpdate: true });
    };

    // const handleBlurUpdateClose = () => {
    //   this.setState({ isTouchedUpdate: false });
    // };

    return (
      <>
        <Toaster
          position="bottom-right"
          reverseOrder={false} />

        {urlParams.has("source") && (
          <ul className="breadcrumb">
            <li>
              {/* <a onClick={this.navigateToPreviousPage}>account dashboard</a> */}
              <Link href={`${splitUrl}?accountName=${this.state.companyName}`}>
                account dashboard
              </Link>
            </li>
            <li>Updates</li>
          </ul>
        )}

        <section className={styles.updatesWrapper}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            className={styles.accountSectionTitle}
          >
            {!urlParams.has("accountid") && this.state.updates.length > 0 ? (
              <>
                <Text className="tableTitle">Updates</Text>

                <Link
                  href={`${siteUrl}/SitePages/Updates.aspx?accountid=${this.props.event.tryGetValue()}&source=${window.location.href.split("?")[0]
                    }`}
                >
                  {imgsrc && <Image src={expandImage} />}
                </Link>
              </>
            ) : null}
          </Stack>
          <div className="i-row">
            <div className="i-col-6">
              <div className={styles.updateDatatableWrap}>
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                >
                  <ChoiceGroup
                    options={options}
                    label="View"
                    defaultSelectedKey="both"
                    className="custom-radio"
                    onChange={(ev, option) =>
                      this.handleCategoryChange(option?.key ?? "")
                    }
                  />
                  <Stack horizontal tokens={iconGap} verticalAlign="center">
                    <Link>
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className={styles.shareIcon}
                        onClick={() => this.handleShareButton()}
                      ></FontAwesomeIcon>
                    </Link>

                    {sharePopup && (
                      <Layer>
                        <Popup
                          className={addUpdatesPopupStyles.root}
                          role="dialog"
                          aria-modal="true"
                          onDismiss={() => this.setState({ sharePopup: false })}
                        >
                          <Overlay
                            onClick={() => this.setState({ sharePopup: false })}
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
                                  Share Update
                                </Text>
                                <FontIcon
                                  aria-label="Compass"
                                  aria-disabled={
                                    this.state.updateUpdate.isButtonVisible
                                  }
                                  iconName="Cancel"
                                  className={styles.iconStyle}
                                  onClick={() =>
                                    this.setState({ sharePopup: false })
                                  }
                                />
                              </Stack>
                              <div className={styles.modalContent}>
                                <Stack
                                  {...columnProps}
                                  className={styles.formChildGap}
                                >
                                  <TextField
                                    label="To"
                                    id="to"
                                    onChange={this.handleInputChange}
                                    styles={textFieldProps}
                                    placeholder="Enter Email"
                                    errorMessage={
                                      this.state.isTouched && !this.state.to
                                        ? "Email is required."
                                        : ""
                                    }
                                    required
                                  />
                                  <TextField
                                    label="CC"
                                    id="cc"
                                    onChange={this.handleInputChange}
                                    styles={textFieldProps}
                                  />
                                  <TextField
                                    styles={textFieldParagraphProps}
                                    id="remarks"
                                    onChange={this.handleInputChange}
                                    multiline
                                    rows={5}
                                  />
                                </Stack>
                                <DefaultButton
                                  className="btn-primary"
                                  text="Share"
                                  onClick={() => this.sendEmail()}
                                  styles={modalButton}
                                ></DefaultButton>
                                <DefaultButton
                                  className="btn-outline"
                                  text="Cancel"
                                  styles={modalButton}
                                  onClick={() =>
                                    this.setState({ sharePopup: false })
                                  }
                                ></DefaultButton>
                              </div>
                            </div>
                          </FocusTrapZone>
                        </Popup>
                      </Layer>
                    )}
                    <Link>

                      {/* <FontIcon aria-label="delete" iconName="delete" className={styles.deleteIcon} />   */}

                      <FontIcon
                        aria-label="delete"
                        iconName="delete"
                        className={styles.deleteIcon}
                        onClick={() => this.handleDeleteRow()}
                      />
                    </Link>
                    <Link
                      onClick={() => {
                        this.setState({ showPopup: true });
                        handleTextFieldClose();
                      }}
                    >
                      <FontIcon
                        aria-label="add"
                        iconName="add"
                        className={styles.addIcon}
                      />
                    </Link>
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
                                  Create New Update
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
                                <Stack
                                  {...columnProps}
                                  className={styles.formChildGap}
                                >
                                  <div>
                                    <ChoiceGroup
                                      options={addUpdatesOptions}
                                      label="Category"
                                      // defaultSelectedKey="highlight"
                                      className="custom-radio"
                                      onBlur={handleTextFieldBlur}
                                      onChange={this.handleChoiceGroupChange}
                                      required={true}
                                    />
                                    {this.state.isTouched &&
                                      !this.state.updateUpdate.Category && (
                                        <div>
                                          <p style={{ color: "#A4262C", fontSize: "12px", fontWeight: 400 }}>
                                            Category is required.
                                          </p>
                                        </div>
                                      )}
                                  </div>

                                  <TextField
                                    label="Title"
                                    styles={textFieldProps}
                                    placeholder="Enter Title"
                                    className="mt-0"
                                    onChange={(event, value) =>
                                      this.handleUpdatesTextFieldChange(
                                        "UpdateName",
                                        value,
                                        null
                                      )
                                    }
                                    onBlur={handleTextFieldBlur}
                                    errorMessage={
                                      this.state.isTouched &&
                                        !this.state.updateUpdate.UpdateName
                                        ? "Title is required."
                                        : ""
                                    }
                                    required
                                  />
                                  <TextField
                                    label="Details"
                                    styles={textFieldParagraphProps}
                                    placeholder="Enter Details"
                                    multiline
                                    rows={5}
                                    onChange={(event, value) =>
                                      this.handleUpdatesTextFieldChange(
                                        "Details",
                                        value,
                                        null
                                      )
                                    }
                                    onBlur={handleTextFieldBlur}
                                    errorMessage={
                                      this.state.isTouched &&
                                        !this.state.updateUpdate.Details
                                        ? "Details are required."
                                        : ""
                                    }
                                    required
                                  />
                                </Stack>
                                <DefaultButton
                                  className="btn-primary"
                                  text="Save"
                                  styles={modalButton}
                                  onClick={() =>
                                    this.saveOrUpdateUpdates(
                                      this.state.updateUpdate,
                                      this.state.companyName,
                                      "save"
                                    )
                                  }
                                ></DefaultButton>
                                <DefaultButton
                                  className="btn-outline"
                                  text="Cancel"
                                  styles={modalButton}
                                  onClick={() =>
                                    this.setState({ showPopup: false })
                                  }
                                ></DefaultButton>
                              </div>
                            </div>
                          </FocusTrapZone>
                        </Popup>
                      </Layer>
                    )}
                  </Stack>
                </Stack>
                <DataTable
                  value={this.state.updates}
                  rowClassName={rowClass}
                  selection={this.state.selectedRows}
                  onSelectionChange={this.onSelectionChange}
                  paginator={this.state.updates.length > rowsPerPage}
                  rows={rowsPerPage}
                >
                  <Column
                    selectionMode="multiple"
                    style={{ minWidth: "10px" }}
                    className={styles.accountUpdateCheckbox}
                  ></Column>
                  <Column
                    field="UpdateName"
                    header="Update Name"
                    filter
                    style={{ minWidth: "310px", borderLeft: 0 }}
                    filterPlaceholder="Search"
                  ></Column>
                  <Column
                    field="UpdateCreated"
                    header="Date & Time"
                    filter
                    style={{ minWidth: "193px" }}
                    filterPlaceholder="Search"
                    body={(rowData) => {
                      // Format the 'UpdateCreated' date
                      const formattedDate = format(
                        new Date(rowData.UpdateCreated),
                        "MM/dd/yyyy | HH:mm"
                      );
                      return <span>{formattedDate}</span>;
                    }}
                  />
                  <Column
                    field="Category"
                    header="Category"
                    filter
                    body={(rowData) => (
                      <span className={rowData.Category}>
                        {rowData.Category}
                      </span>
                    )}
                    style={{ minWidth: "115px" }}
                    className={styles.categoryTag}
                    filterPlaceholder="Search"
                  ></Column>
                  {/* <Column header="Actions" body={updateBodyTemplate} exportable={false} style={{ minWidth: '100px' }}></Column> */}
                </DataTable>
              </div>
            </div>
            <div className="i-col-6">
              <div className={styles.updateFormWrap}>
                <ChoiceGroup
                  options={updateOptions}
                  label="Category :"
                  selectedKey={this.state.updateUpdate.selectedCategoryUpdate}
                  defaultSelectedKey={
                    this.state.updateUpdate.selectedCategoryUpdate
                  }
                  className="custom-radio"
                  onChange={(ev, option) =>
                    this.handleCategoryChangeUpdate(option?.key ?? "")
                  }
                  disabled={this.state.updateDisabled}
                />

                <ul className="formWrap full_li">
                  <li>
                    <TextField
                      placeholder="Title"
                      styles={textFieldProps}
                      value={this.state.updateUpdate.UpdateName}
                      onChange={(event, value) =>
                        this.handleUpdatesTextFieldChange(
                          "UpdateName",
                          value,
                          null
                        )
                      }
                      onBlur={handleBlurUpdate}
                      errorMessage={this.state.isTouchedUpdate && !this.state.updateUpdate.UpdateName ? 'Title is required.' : ''}
                      disabled={this.state.updateDisabled}
                    //required
                    />
                  </li>
                  <li>
                    <TextField
                      placeholder="Details..."
                      multiline
                      rows={5}
                      styles={textFieldParagraphProps}
                      value={this.state.updateUpdate.Details}
                      onChange={(event, value) =>
                        this.handleUpdatesTextFieldChange(
                          "Details",
                          value,
                          null
                        )
                      }
                      onBlur={handleBlurUpdate}
                      errorMessage={this.state.isTouchedUpdate && !this.state.updateUpdate.Details ? 'Details are required.' : ''}
                      disabled={this.state.updateDisabled}
                    //required
                    />
                  </li>
                  <li>
                    <DefaultButton
                      disabled={this.state.ButtonDisable}
                      className="btn-primary"
                      text="Update"
                      styles={modalButton}
                      onClick={() => this.updateData()}
                      aria-disabled={this.state.updateDisabled}
                    ></DefaultButton>
                    {/* <DefaultButton className='btn-primary' text="Edit" styles={modalButton} onClick={() => this.setState({ showPopup: true })}></DefaultButton> */}
                  </li>
                </ul>
              </div>
              <Dialog
                hidden={!this.state.hideDialog}
                dialogContentProps={dialogContentProps}
              >
                <DialogFooter>
                  {/* Confirm deletion */}
                  <PrimaryButton
                    onClick={() => this.deleteRows()}
                    text="Delete"
                  />
                  {/* Cancel */}
                  <DefaultButton
                    onClick={this.toggleHideDialog}
                    text="Cancel"
                  />
                </DialogFooter>
              </Dialog>
            </div>
          </div>
        </section>
      </>
    );
  }
}
