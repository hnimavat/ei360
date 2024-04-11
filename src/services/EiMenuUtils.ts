import { DetailaPageUrl, siteEventsThumbnail, sitecategoryThumbnail, thumbnailgenerateUrl } from "./siteconfig";

export const generateICSFile = (eventDetails: any) => {
    const { title, startDate, endDate, location, description } = eventDetails;
  
  //  const formattedStartDate = startDate.toISOString().replace(/-/g, '').replace(/:/g, '').slice(0, -5);
  // const formattedEndDate = endDate.toISOString().replace(/-/g, '').replace(/:/g, '').slice(0, -5);
  
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your Application//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${description || ''}
LOCATION:${location || ''}
END:VEVENT
END:VCALENDAR`;
  
    return icsContent.replace(/[ \t]+/g, '');
  }

  export const handleDownloadICS = (data: any) => {

    const eventDetails = {
      title: data.Title,
      startDate: data.EventDate,
      endDate: data.EndDate,
      location: '',
      description: '',
    };

    const icsContent = generateICSFile(eventDetails);

    // Create a Blob from the ICS content
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'event.ics';

    // Trigger the download
    downloadLink.click();
  }

  export const formatDay = (inputDate: Date | undefined) => {
    if(inputDate !== undefined){
      const date = new Date(inputDate);
      const day = date.getDate();
  
      return `${day}`;
    }
  }

  export const formatMonth = (inputDate: Date | undefined) => {
    if(inputDate !== undefined){
      const date = new Date(inputDate);
      const month = date.toLocaleString('default', { month: 'short' });
  
      return `${month}`;
    }
  }

  export const _onPlatformclick = (NavUrl: string, menu: string, submemu: string) => {
    const categoryViewUrl = `${DetailaPageUrl(NavUrl,menu,submemu)}`;
    window.open(categoryViewUrl, '_blank');
  }

  export const getThumbnail = (siteAbsoluteUrl: string, file: any, property: any, siteId: string) => {
    let thumbnailUrl = ``;
    if(property.vti_x005f_shortcuturl){
      thumbnailUrl = `${siteAbsoluteUrl}${sitecategoryThumbnail}`;
    }else{
      thumbnailUrl = `${thumbnailgenerateUrl(siteAbsoluteUrl,siteId,file.UniqueId)}`;
    }
    return thumbnailUrl;
  }

  export const getBanner = (siteAbsoluteUrl: string, file: any) => {
    let BannerUrl = ``;
    if(file != undefined){
      BannerUrl = file.Url;
    }else{
      BannerUrl = `${siteAbsoluteUrl}${siteEventsThumbnail}`;
      //BannerUrl = `${this.props.siteAbsoluteUrl}${thumbnailgenerateUrl(this.state.siteId,file.UniqueId)}`;
    }
    return BannerUrl;
  }

  export const _onVideoclick = (siteAbsoluteUrl: string,fileurl: any, property: any) => {
    let categoryViewUrl = ``;
    if(property.vti_x005f_shortcuturl){
      categoryViewUrl = `${property.vti_x005f_shortcuturl}`;
    }else{
      // Create a URL object
      const url = new URL(siteAbsoluteUrl);
      // Extract the base URL
      const baseURL = url.origin;
      categoryViewUrl = `${baseURL}${fileurl}?web=1`;
    }
   
    window.open(categoryViewUrl, '_blank');
  }