export const siteAssetlogo = "/SiteAssets/InfoHub-Logo.png";
export const sitecategoryThumbnail = "/SiteAssets/InfoHub-Logo.png.png";
export const siteEventsThumbnail = "/SiteAssets/InfoHub-Logo.png.png";
export const platformCategory = "Platforms";
export const eventsCategory = "Events";
export const parammenu = "menu";
export const paramsubmenu = "submenu";
export const paramcategory = "category";
export const parasubmenuId = "submenuId";
export const KeyPersonaID = "personaID";
export const paramaccountname = "accountName";
export const KeyAccountName = "AccountName";


export const thumbnailgenerateUrl = (siteAbsoluteUrl: string,siteid: string, UniqueId: any) => {
    return `${siteAbsoluteUrl}/_api/v2.1/sites/${siteid}/items/${UniqueId}/driveItem/thumbnails/0/c400x99999/content?prefer=noRedirect`;
};

// Define a function that constructs the URL
export const categoryViewallUrl = (siteAbsoluteUrl: string,menu: string, submenu?: string, submenuId?:string, category?:string) => {
    let param = `${siteAbsoluteUrl}/SitePages/CategoryView.aspx?menu=${menu}`;
    
    if(submenu !== ''){
        param += `&submenu=${submenu}`;
    }
   
    if(submenuId !== ''){
        param += `&submenuId=${submenuId}`;
    }

    if(category !== ''){
        param += `&category=${category}`;
    }

    return param;
  };

export const DetailaPageUrl = (NavUrl: string, menu: string, submenu?: string, submenuId?:string) => {
    let param = `${NavUrl}?menu=${menu}`;

    if(submenu !== ''){
        param += `&submenu=${submenu}`;
    }
   
    if(submenuId !== ''){
        param += `&submenuId=${submenuId}`;
    }

    return param;
  }; 