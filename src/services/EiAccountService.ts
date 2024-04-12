import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
//import { Caching } from "@pnp/queryable"
import { getWebPartSP } from "./pnpjsConfig";
import { IAccountDetails } from "../model/IAccountDetails";
import { IFinancials } from "../model/IFinancials";
import { IDivisions } from "../model/IDivisions";
import { ICompetitors } from "../model/ICompetitors";
import { ICustomersStackholders } from "../model/ICustomersStackholders";
import { IUpdates } from "../model/IUpdates";
import { IQuickLinks } from "../model/IQuickLinks";
import { IDescription } from "../model/IDescription";


export default class EiAccountService {
  private _sp: SPFI;

  constructor() {
    this._sp = getWebPartSP();
  }

  //get list with filter
  public async getListDataWithFilter(listTitle: string, filter: string): Promise<any[]> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }
    const items: any[] = await this._sp.web.lists.getByTitle(listTitle).items.filter(filter)();
    return items;
  }


  //account details

  public async getAccountDetails(accountname: string): Promise<IAccountDetails> {

    const results: IAccountDetails[] = await this._sp.web.lists.getByTitle('Account_Details').items
      .filter(`Account_Name eq '${accountname}'`).top(1)()
      .then((data: IAccountDetails[]) => {
        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });

    console.log(results[0]);
    return results[0];
  }
  

  // Function to save or update account details in a SharePoint list
  public async saveOrUpdateAccountDetails(accountDetails: IAccountDetails): Promise<boolean> {
    try {
      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("Account_Details");

      // Checking AccountName and accountDetails is empty or not
      if (accountDetails.AccountName && accountDetails.IndustryType) {
        // Check if the account name already exists in the SharePoint list
        //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();
        if (accountDetails.ID != 0) {
          // If the account name already exists, update the corresponding item
          await list.items.getById(accountDetails.ID).update({
            // Update properties as needed
            //AccountName: accountDetails.AccountName;
            IndustryType: accountDetails.IndustryType,
            Acquisitions: accountDetails.Acquisitions,
            ParentCompany: accountDetails.ParentCompany,
            SubsidiaryCompany: accountDetails.SubsidiaryCompany,
            AccountDescription: accountDetails.AccountDescription
            // Update other properties as needed
          });
          console.log("Account details updated successfully.");
          return true;
        } else {
          // If the account name doesn't exist, add a new item
          await list.items.add({
            // Map properties to columns in the SharePoint list
            AccountName: accountDetails.AccountName,
            Account_Name: accountDetails.AccountName,
            IndustryType: accountDetails.IndustryType,
            Acquisitions: accountDetails.Acquisitions,
            ParentCompany: accountDetails.ParentCompany,
            SubsidiaryCompany: accountDetails.SubsidiaryCompany,
            AccountDescription: accountDetails.AccountDescription
            // Add other properties as needed
          });
          console.log("New account details added successfully.");
          return true;
        }
      }
    } catch (error) {
      console.error("Error saving or updating account details:", error);
      return false;
    }

    return false;
  }

//financials

  public async getFinancials(AccountNameId: number): Promise<IFinancials[]> {

    const results: IFinancials[] = await this._sp.web.lists.getByTitle('Financials').items.select('*', 'AccountName/AccountName').expand("AccountName")
      .filter(`AccountNameId eq '${AccountNameId}'`).orderBy("Year", true)()
      .then((data: IFinancials[]) => {
        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });

    console.log(results);
    return results;
  }

  public async saveOrUpdateFinancials(financials: IFinancials, AccountNameId: number, accountName: string): Promise<boolean> {
    try {

      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("Financials");

      if (financials.Year != 0 && (financials.Q1Revenue != 0 || financials.Revenue != 0)) {
        // Check if the account name already exists in the SharePoint list
        //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();
        if (financials.ID != 0) {
          // If the account name already exists, update the corresponding item
          await list.items.getById(financials.ID).update({
            // Update properties as needed
            Year: financials.Year,
            Revenue: financials.Revenue,
            Q1Revenue: financials.Q1Revenue,
            Q2Revenue: financials.Q2Revenue,
            Q3Revenue: financials.Q3Revenue,
            Q4Revenue: financials.Q4Revenue,
            //AccountNameId: AccountNameId
            // Update other properties as needed
          });
          console.log("Fiancials details updated successfully.");
          return true;
        } else {
          // If the account name doesn't exist, add a new item
          await list.items.add({
            // Map properties to columns in the SharePoint list
            Year: financials.Year,
            Revenue: financials.Revenue,
            Q1Revenue: financials.Q1Revenue,
            Q2Revenue: financials.Q2Revenue,
            Q3Revenue: financials.Q3Revenue,
            Q4Revenue: financials.Q4Revenue,
            AccountNameId: AccountNameId,
            Account_Name: accountName
            // Add other properties as needed
          });
          console.log("New Fiancials details added successfully.");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error saving or updating Fiancials details:", error);
      return false;
    }
  }

  public async deleteFinancials(financialsid: number): Promise<boolean> {
    try {
      await this._sp.web.lists.getByTitle('Financials').items.getById(financialsid).delete();
      return true;

    } catch (error) {
      console.error("Error Deleting Financials details:", error);
      return false;
    }
  }

//divisions

  public async getDivisions(AccountNameId: number): Promise<IDivisions[]> {

    const results: IDivisions[] = await this._sp.web.lists.getByTitle('Divisions').items.select('*', 'AccountName/AccountName').expand("AccountName")
      .filter(`AccountNameId eq '${AccountNameId}'`)()
      .then((data: IDivisions[]) => {
        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });

    console.log(results);
    return results;
  }

  public async saveOrUpdateDivisions(divisions: IDivisions, AccountNameId: number, accountName: string): Promise<boolean> {
    try {

      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("Divisions");

      if (divisions.Division != '') {
        // Check if the account name already exists in the SharePoint list
        //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();
        if (divisions.ID != 0) {
          // If the account name already exists, update the corresponding item
          await list.items.getById(divisions.ID).update({
            // Update properties as needed
            Division: divisions.Division,
            BU: divisions.BU,
            Programs: divisions.Programs,
            Description: divisions.Description,
            //AccountNameId: AccountNameId 
            // Update other properties as needed
          });
          console.log("Division details updated successfully.");
          return true;
        } else {
          // If the account name doesn't exist, add a new item
          await list.items.add({
            // Map properties to columns in the SharePoint list
            Division: divisions.Division,
            BU: divisions.BU,
            Programs: divisions.Programs,
            AccountNameId: AccountNameId,
            Account_Name: accountName,
            Description: divisions.Description,
            // Add other properties as needed
          });
          console.log("New Division details added successfully.");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error saving or updating Division details:", error);
      return false;
    }
  }

  public async deleteDivisions(divisionid: number): Promise<boolean> {
    try {
      await this._sp.web.lists.getByTitle('Divisions').items.getById(divisionid).delete();
      return true;

    } catch (error) {
      console.error("Error Deleting Division details:", error);
      return false;
    }
  }


//cometitors

  public async getCompetitors(AccountNameId: number): Promise<ICompetitors[]> {

    const results: ICompetitors[] = await this._sp.web.lists.getByTitle('Competitors').items.select('*', 'AccountName/AccountName').expand("AccountName")
      .filter(`AccountNameId eq '${AccountNameId}'`)()
      .then((data: ICompetitors[]) => {
        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });

    console.log(results);
    return results;
  }

  public async saveOrUpdateCompetitors(Competitors: ICompetitors, AccountNameId: number, accountName: string): Promise<boolean> {
    try {

      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("Competitors");

      if (Competitors.Category != '' && Competitors.Name != '' && Competitors.TeamSize != 0 &&
        Competitors.BillingType != '' && Competitors.EngagementRate != '') {

        // Check if the account name already exists in the SharePoint list
        //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();
        if (Competitors.ID != 0) {
          // If the account name already exists, update the corresponding item
          await list.items.getById(Competitors.ID).update({
            // Update properties as needed
            Category: Competitors.Category,
            Name: Competitors.Name,
            TeamSize: Competitors.TeamSize,
            EngagementArea: Competitors.EngagementArea,
            BillingType: Competitors.BillingType,
            EngagementRate: Competitors.EngagementRate,
            PrimaryTechnology: Competitors.PrimaryTechnology,
            SecondaryTechnology: Competitors.SecondaryTechnology,
            //AccountNameId: AccountNameId
            // Update other properties as needed
          });
          console.log("Competitors details updated successfully.");
          return true;
        } else {
          // If the account name doesn't exist, add a new item
          await list.items.add({
            // Map properties to columns in the SharePoint list
            Category: Competitors.Category,
            Name: Competitors.Name,
            TeamSize: Competitors.TeamSize,
            BillingType: Competitors.BillingType,
            EngagementArea: Competitors.EngagementArea,
            EngagementRate: Competitors.EngagementRate,
            PrimaryTechnology: Competitors.PrimaryTechnology,
            SecondaryTechnology: Competitors.SecondaryTechnology,
            AccountNameId: AccountNameId,
            Account_Name: accountName
            // Add other properties as needed
          });
          console.log("New Competitors details added successfully.");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error saving or updating Competitors details:", error);
      return false;
    }
  }

  public async deleteCompetitors(competitorsid: number): Promise<boolean> {
    try {
      await this._sp.web.lists.getByTitle('Competitors').items.getById(competitorsid).delete();
      return true;

    } catch (error) {
      console.error("Error Deleting competitorsid details:", error);
      return false;
    }
  }

  public async deleteMultipleUpdates(selectedRows: any[]): Promise<boolean> {
    try {
      // Iterate over each selected row and delete the corresponding item
      await Promise.all(selectedRows.map(async (row: any) => {
        await this._sp.web.lists.getByTitle('Account_Updates').items.getById(row.ID).delete();
      }));

      return true;
    } catch (error) {
      console.error("Error Deleting selected rows:", error);
      return false;
    }
  }


  //updates

  public async getUpdates(AccountName: string, selectedCategory: string): Promise<IUpdates[]> {

    var filter = "";
    selectedCategory == "both" ?
      filter = `Account_Name eq ${AccountName}` : filter = `Account_Name eq ${AccountName} and Category eq '${selectedCategory}'`;

    const results: IUpdates[] = await this._sp.web.lists.getByTitle('Account_Updates').items.select('*', 'AccountName/AccountName').expand("AccountName")
      .filter(filter)()
      .then((data: IUpdates[]) => {
        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });
    console.log('AccountName:', AccountName);
    console.log('Updates', results);
    return results;
  }



  public async saveOrUpdateUpdates(Updates: IUpdates, AccountName: string): Promise<boolean> {
    try {

      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("Account_Updates");

      // Check if the account name already exists in the SharePoint list
      //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();

      if (Updates.ID != 0) {
        // If the account name already exists, update the corresponding item
        await list.items.getById(Updates.ID).update({
          // Update properties as needed

          UpdateName: Updates.UpdateName,
          Details: Updates.Details,
          Category: Updates.selectedCategoryUpdate,
          UpdateCreated: Updates.UpdateCreated,
          // Update other properties as needed
        });
        console.log("Updates details updated successfully.");
        return true;
      } else {
        // If the account name doesn't exist, add a new item
        await list.items.add({
          // Map properties to columns in the SharePoint list

          UpdateName: Updates.UpdateName,
          Details: Updates.Details,
          Category: Updates.Category,
          UpdateCreated: Updates.UpdateCreated,
          Account_Name: AccountName
          // Add other properties as needed
        });
        console.log("New Updates details added successfully.");
        return true;
      }
    } catch (error) {
      console.error("Error saving or updating Updates details:", error);
      return false;
    }
  }

  public async deleteUpdates(updatesid: number): Promise<boolean> {
    try {
      await this._sp.web.lists.getByTitle('Account_Updates').items.getById(updatesid).delete();
      return true;

    } catch (error) {
      console.error("Error Deleting updatesid details:", error);
      return false;
    }
  }




  public async getCustomersStackholders(AccountNameId: number): Promise<ICustomersStackholders[]> {

    const results: ICustomersStackholders[] = await this._sp.web.lists.getByTitle('Customer_Stakeholder').items.select('*', 'AccountName/AccountName').expand("AccountName")
      .filter(`AccountNameId eq '${AccountNameId}'`)()
      .then((data: ICustomersStackholders[]) => {
        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });

    console.log('CustomersStackholders :: ', results);
    return results;
  }

  public async saveOrUpdateCustomersStackholders(CustomersStackholders: ICustomersStackholders, AccountNameId: number, accountName: string, profile: any): Promise<boolean> {
    debugger;
    try {

      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("Customer_Stakeholder");

      if (CustomersStackholders.FullName != ''
        && CustomersStackholders.Designation != '' && CustomersStackholders.RelationwithEIC != '') {
        // && CustomersStackholders.ManagerEmail != '' && CustomersStackholders.ReportToId != '') {
        
        let profileResult: any = null;

        if(profile != null){
          //Getting contents of image
          const fileContent = await profile.arrayBuffer(); 
            
          // Upload the file to the specified SharePoint library
          profileResult = await this._sp.web.lists.getByTitle('Site Assets').rootFolder.files.addChunked(profile.name, fileContent, undefined, true);
          console.log("Profile uploaded successfully:", profileResult);
        }

        
       
        // Check if the account name already exists in the SharePoint list
        //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();
        if (CustomersStackholders.ID != 0) {
          // If the account name already exists, update the corresponding item
          await list.items.getById(CustomersStackholders.ID).update({
            // Update properties as needed
            //Photo: profileResult != null ? profileResult : CustomersStackholders.Photo,
            Profile: profileResult != null ? profileResult.data.ServerRelativeUrl : CustomersStackholders.Profile,
            FullName: CustomersStackholders.FullName,
            Designation: CustomersStackholders.Designation,
            Email: CustomersStackholders.Email,
            LinkedInID: CustomersStackholders.LinkedInID,
            RelationwithEIC: CustomersStackholders.RelationwithEIC,
            ManagerEmail: CustomersStackholders.ManagerEmail,
            BusinessUnit: CustomersStackholders.BusinessUnit,
            ReportToId: CustomersStackholders.ReportToId,
            Project: CustomersStackholders.Project,
            Contact: CustomersStackholders.Contact
            //AccountNameId: AccountNameId
            // Update other properties as needed
          });
          console.log("CustomersStackholders details updated successfully.");
          return true;
        } else {
          // If the account name doesn't exist, add a new item
          await list.items.add({
            // Map properties to columns in the SharePoint list
            //Photo: profileResult != null ? profileResult.file : null,
            Profile: profileResult != null ? profileResult.data.ServerRelativeUrl : '',
            FullName: CustomersStackholders.FullName,
            Designation: CustomersStackholders.Designation,
            Email: CustomersStackholders.Email,
            LinkedInID: CustomersStackholders.LinkedInID,
            RelationwithEIC: CustomersStackholders.RelationwithEIC,
            ManagerEmail: CustomersStackholders.ManagerEmail,
            AccountNameId: AccountNameId,
            Account_Name: accountName,
            BusinessUnit: CustomersStackholders.BusinessUnit,
            Project: CustomersStackholders.Project,
            Contact: CustomersStackholders.Contact,
            ReportToId: CustomersStackholders.ReportToId ? CustomersStackholders.ReportToId : null  ,
            // Add other properties as needed
          });
          console.log("New CustomersStackholders details added successfully.");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error saving or updating CustomersStackholders details:", error);
      return false;
    }
  }

  public async deleteCustomersStackholders(customerStackholderid: number): Promise<boolean> {
    try {
      await this._sp.web.lists.getByTitle('Customer_Stakeholder').items.getById(customerStackholderid).delete();
      return true;

    } catch (error) {
      console.error("Error Deleting CustomersStackholders details:", error);
      return false;
    }
  }


  //QuickLinks

  // Inside your class or function, you can define a method to fetch QuickLinks
  public async getQuickLinks(): Promise<IQuickLinks[]> {
    try {
      const quickLinks = await this._sp.web.lists.getByTitle("QuickLinks").items.top(5)();
      console.log('top 5 QuickLinks', quickLinks);
      return quickLinks;
    } catch (error) {
      console.error("Error retrieving QuickLinks:", error);
      return [];
    }
  }



  public async saveOrUpdateQuickLinks(QuickLinks: IQuickLinks): Promise<boolean> {
    try {

      // Specify the SharePoint list where you want to save the account details
      const list = await this._sp.web.lists.getByTitle("QuickLinks");

      // Check if the account name already exists in the SharePoint list
      //const existingItem = await list.items.filter(`AccountName eq '${accountDetails.accountName}'`).get();

      if (QuickLinks.ID != 0) {
        // If the account name already exists, update the corresponding item
        await list.items.getById(QuickLinks.ID).update({
          // Update properties as needed

          Name: QuickLinks.Name,
          URL: QuickLinks.URL,


        });
        console.log("QuickLinks details updated successfully.");
        return true;
      } else {
        // If the account name doesn't exist, add a new item
        await list.items.add({
          // Map properties to columns in the SharePoint list

          Name: QuickLinks.Name,
          URL: QuickLinks.URL,

        });
        console.log("New QuickLinks details added successfully.");
        return true;
      }
    } catch (error) {
      console.error("Error saving or updating QuickLinks details:", error);
      return false;
    }
  }

  public async deleteQuickLinks(quicklinksid: number): Promise<boolean> {
    try {
      await this._sp.web.lists.getByTitle('QuickLinks').items.getById(quicklinksid).delete();
      return true;

    } catch (error) {
      console.error("Error Deleting QuickLinks details:", error);
      return false;
    }
  }

  // public async getEngagementDescription(AccountNameId: number): Promise<IDescription[]> {

  //   const results: IDescription[] = await this._sp.web.lists.getByTitle('Description').items.select('*', 'AccountName/AccountName','AttachmentFiles').expand('AccountName','AttachmentFiles')
  //     .filter(`AccountNameId eq '${AccountNameId}'`)()
  //     .then((data: IDescription[]) => {

  //       return data;
  //     })
  //     .catch((error) => {
  //       console.error('Error retrieving list data:', error);
  //       return [];
  //     });

  //   console.log("getEngagementDescription", results);
  //   return results;
  // }

  public async getEngagementDescriptionName(AccountName: string): Promise<IDescription[]> {

    const results: IDescription[] = await this._sp.web.lists.getByTitle('Description').items.select('*', 'AttachmentFiles').expand('AttachmentFiles')
      .filter(`Account_Name eq '${AccountName}'`)()
      .then((data: IDescription[]) => { 

        return data;
      })
      .catch((error) => {
        console.error('Error retrieving list data:', error);
        return [];
      });

    console.log("getEngagementDescriptionName", results);
    return results;
  }
  
}