import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/fields";
import "@pnp/sp/site-users/web";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { IDescription } from '../model/IDescription';
import { createBatch } from "@pnp/sp/batching";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

// Interface for list item data (replace with your actual properties)
// export interface MyListItem {
//   Title: string;
//   // Add other properties as needed
// }

export class EDServices {
  private _sp: SPFI;

  constructor(context: WebPartContext) {
    this._sp = spfi()
      .using(SPFx(context)) // Establish context with SPFx
      .using(PnPLogging(LogLevel.Info)); // Enable logging for debugging
  }

  // Get all items from a specific list
  public async getListData(listTitle: string): Promise<any[]> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }
    const items = await this._sp.web.lists.getByTitle(listTitle).items();
    return items;
  }

  public async bulkDelete (listName: string,itemIds:any) {
    const list = await this._sp.web.lists.getByTitle(listName);
    // const items = await list.items.getAll();
    const [batchedListBehavior, execute] = createBatch(itemIds);
    list.using(batchedListBehavior);
    itemIds.forEach((id: any) => {
        list.items.getById(id).delete();
    });
    return await execute();
}

  // Get all items from a specific list with the filtre
  public async getListDataWithFilter(listTitle: string, filter: string): Promise<any[]> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }
    const items: any[] = await this._sp.web.lists.getByTitle(listTitle).items.filter(filter)();
    return items;
  }

  public async getFieldsByListName(listName: string, fieldName: string): Promise<any> {
    const fields = await this._sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldName)();
    return fields;
    // const field2: IFieldInfo = await sp.web.lists.getByTitle("My List").fields.getByTitle("Title")();
  }

  public async getListDataByItemId(listName: string, itemId: number): Promise<any> {
    return await this._sp.web.lists.getByTitle(listName).items.getById(itemId)();
  }

  // Create a new item in a specific list
  public async createItem(listTitle: string, itemData: any): Promise<any> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }

    return await this._sp.web.lists.getByTitle(listTitle).items.add(itemData);
  }

  public async createMultipleItems(listTitle: string, items: Array<any>): Promise<boolean> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }

    try {
      // Create an array to store promises for individual item additions
      const itemAddPromises = items.map(item => {
        const list = this._sp.web.lists.getByTitle(listTitle);
        return list.items.add(item);
      });

      // Wait for all item additions to complete
      await Promise.all(itemAddPromises);

      return true; // Success message (optional)
    } catch (error) {
      console.error("Error creating items:", error);
      return false;
      // Handle errors during item additions (optional)
    }
  }

  // Update an existing item in a specific list
  public async updateItem(listTitle: string, itemId: number, itemData: any): Promise<any> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }

    return await this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).update(itemData);
  }
  
  public async updateStackHolder(listName:string,object:any, profile:any){
    const CustomersStackholders = object;
    let profileResult: any = null;

    if(profile != null){
      //Getting contents of image
      const fileContent = await profile.arrayBuffer(); 
        
      // Upload the file to the specified SharePoint library
      profileResult = await this._sp.web.lists.getByTitle('Site Assets').rootFolder.files.addChunked(profile.name, fileContent, undefined, true);
      console.log("Profile uploaded successfully:", profileResult);
    }

    await this._sp.web.lists.getByTitle(listName).items.getById(object.ID).update({
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
      Contact: CustomersStackholders.Contact,
      //AccountNameId: AccountNameId
      // Update other properties as needed
    });
    console.log("CustomersStackholders details updated successfully.");
    return true;
  }
      

  // Delete an item from a specific list
  public async deleteItem(listTitle: string, itemId: number): Promise<any> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }

    return await this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).delete();
  }

    // Delete an item from a specific list
    public async bulkDeleteItem(listTitle: string, itemIds: Array<any>): Promise<any> {
      if (!this._sp) {
        throw new Error("SharePoint context not initialized");
      }
      
      try {
        // Create an array to store promises for individual item additions
        const itemAddPromises = itemIds.map((itemId) => {
          return this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).delete();
        });
  
        // Wait for all item additions to complete
        await Promise.all(itemAddPromises);
  
        return true; // Success message (optional)
      } catch (error) {
        console.error("Error creating items:", error);
        return false;
        // Handle errors during item additions (optional)
      }
    }

  //get all users from the site
  public async getAllUsers() {
    return await this._sp.web.siteUsers();
  }

  // Get all items from a specific list with the filtre
  public async getListGrowthPlanAction(listTitle: string): Promise<any[]> {
    if (!this._sp) {
      throw new Error("SharePoint context not initialized");
    }
    const items = await this._sp.web.lists.getByTitle(listTitle).items.top(5000).select("*","Author/Title", "AssignTo/Title", "AssignTo/Id","AssignTo/EMail").expand("AssignTo","Author")();
    console.log(items);
    return items;
  }

  public async getMeetingsAndUpdatesDetails(accountName: string): Promise<any[]> {

    console.log('getMeetingsAndUpdatesDetails called.. '); 

    const results: any[] = await this._sp.web.lists.getByTitle('Engagement_Meetings').items
        .filter(`Account_Name eq '${accountName}'`)()
        .then((data: any[]) => {
            console.log('then data :: ', data);
            return data;
        })
        .catch((error) => {
            console.error('Error retrieving list of Engagement Meetings ::', error);
            return [];
        });
    
    console.log('Engagement Meetings :: ', results);

    // debugger;
    // const items = await this._sp.web.lists.getByTitle('Engagement_Meetings').items.select('Attendee/ID,Attendee/Name').expand('Attendee')()
    // console.log('Engagement Meetings items:: ', items.length);
    // //Process the items
    // items.forEach((item: any) => {
    //   console.log('item:', item.Attendee);
    //   console.log('Attendee:', item.Attendee.Name); // Assuming "Title" is a property of the Person or Group field
    // });

    return results;
  }

    // Get all items from a specific list with the filtre
    public async getEDLibraryData(listTitle: string, filter: string): Promise<any[]> {
      if (!this._sp) {
        throw new Error("SharePoint context not initialized");
      }
      const items = await this._sp.web.lists.getByTitle(listTitle).items.filter(filter).select("*","FileRef","File/Name","File/UniqueId").expand("File")();
      return items;
    }

    // public getThumbnail (siteAbsoluteUrl: string, file: any, property: any, siteId: string)  {
    //   let thumbnailUrl = ``;
    //   if(property.vti_x005f_shortcuturl){
    //     thumbnailUrl = `${siteAbsoluteUrl}${sitecategoryThumbnail}`;
    //   }else{
    //     thumbnailUrl = `${thumbnailgenerateUrl(siteAbsoluteUrl,siteId,file.UniqueId)}`;
    //   }
    //   return thumbnailUrl;
    // }

    public thumbnailgenerateUrl = (siteAbsoluteUrl: string,siteid: string, UniqueId: any) => {
      return `${siteAbsoluteUrl}/_api/v2.1/sites/${siteid}/items/${UniqueId}/driveItem/thumbnails/0/c400x99999/content?prefer=noRedirect`;
    };

    public async getDescriptionAttachments(AccountName: string): Promise<IAttachmentInfo[]> {
      // Use your SharePoint service or API to fetch Description data
      try {
        const description: IDescription[] = await this._sp.web.lists.getByTitle('Description').items
        .filter(`Account_Name eq '${AccountName}'`)()
        console.log("description Edit::", description);

        let itemId: number = 0;

        // Log attachments
        description.forEach(data => {
          itemId = data.ID;
        });

        let item: IItem  = this._sp.web.lists.getByTitle('Description').items.getById(itemId);
        console.log("item:", item);

        const filesItem: IAttachmentInfo[] = await item.attachmentFiles();
        console.log("attachmentFiles:", filesItem);
        return filesItem;

      } catch (error) {
        console.error("Error fetching description:", error);
      }

      return [];
    }

    public async addAttachments(itemId: number, file: any): Promise<boolean> {
      const item: IItem = this._sp.web.lists.getByTitle("Description").items.getById(itemId);
      await item.attachmentFiles.add(file.name, file)
      return true;
    }

    public async deleteAttachments(itemId: number, fileName: string): Promise<boolean> {
      const item: IItem = this._sp.web.lists.getByTitle("Description").items.getById(itemId);
      await item.attachmentFiles.getByName(fileName).delete();
      return true;
    }
}
