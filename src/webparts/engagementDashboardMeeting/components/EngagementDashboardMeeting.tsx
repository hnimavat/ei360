import * as React from "react";
import type { IEngagementDashboardMeetingProps } from "./IEngagementDashboardMeetingProps";
import { Image, Link } from "@fluentui/react";
import "../../common.css";
import { EDServices } from "../../../services/EDServices";
import { IMeetingsAndUpdates, IMeetingsAndUpdatesDT } from "../../../model/IMeetingsAndUpdates";
//import EiAccountService from "../../../services/EiAccountService";
import { KeyAccountName } from "../../../services/siteconfig";

export interface IEngagementDashboardMeetingState{
  meetingsAndUpdates: IMeetingsAndUpdates[];
  meetingsAndUpdatesDT: IMeetingsAndUpdatesDT[];
}

export default class EngagementDashboardMeeting extends React.Component<IEngagementDashboardMeetingProps,IEngagementDashboardMeetingState> {
  spServices: EDServices;
  //private eiAccountService: EiAccountService;

  constructor(props: IEngagementDashboardMeetingProps){
    super(props);
    this.spServices = new EDServices(props.context);

    this.state={
      meetingsAndUpdates: [],
      meetingsAndUpdatesDT: [],
    }

    //this.screenInit(this.props.event.tryGetValue());
  }

  // private async screenInit(AccountName: string){
  //   console.log("AccountName for meeting", AccountName);
  //   const meetingData = await this.spServices.getListDataWithFilter(this.props.meetingListName, `Accountname1 eq '${AccountName}'`);
  //   console.log(meetingData, "meeting Data.........");
  //   this.setState({
  //     engagementMeetings: meetingData
  //   })
  // }

  // private showMeetingDate(startDate:any, enddate: any){
  //   return startDate && enddate ? (this.formatDateTime(startDate) + " - " + this.formatDateTime(enddate)) :"";
  // }

  // private formatDateTime(dateString:any) {
  //   const date = new Date(dateString);

  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); 
  //   const day = String(date.getDate()).padStart(2, '0'); 
  //   const hours = String(date.getHours()).padStart(2, '0'); 
  //   const minutes = String(date.getMinutes()).padStart(2, '0'); 
  
  //   // Format the date and time in the desired format
  //   return `${month}/${day}/${year} ${hours}:${minutes}`;
  // }

  public async componentDidMount(): Promise<void> { 
    // Subscribe to the shared service on component mount
    // this.props.sharedService.subscribe(this.handleAccountChange);
    const urlParams = new URLSearchParams(window.location.search);
    
    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for meeting expanded :: ', accountName)
    // if (urlParams.has("accountName")) {
    //   this.setState({ accountName: compName });
    // } else {
    //   this.setState({ accountName: "JCI" });
    // }

    console.log("componentDidMount Meeting");
    // console.log("Data Description 6nd:: ", this.props.event);
    const data = sessionStorage.getItem(KeyAccountName);
    console.log(
      "Data Description 6nd:: ",
      data,
      " / ",
      this.props.event.tryGetValue()
    );

    if(accountName) {
      await this.getMeetingsAndUpdates(accountName);
    } else {
      await this.getMeetingsAndUpdates(this.props.event.tryGetValue());
    }

    
    // await this.getAcountDetails(this.props.event.tryGetValue());
  }

  public async componentWillReceiveProps(
    nextProps: IEngagementDashboardMeetingProps
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
            await this.getMeetingsAndUpdates(nextProps.event.tryGetValue());
            // console.log(nextProps.event.tryGetValue());
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  public async getMeetingsAndUpdates(accountName: string): Promise<void> {
    console.log('accountName for meetings :: ', accountName);
 
    const meetingsAndUpdates: IMeetingsAndUpdates[] = await this.spServices.getMeetingsAndUpdatesDetails(accountName)
    console.log('meetingsAndUpdates :: ', meetingsAndUpdates);

    this.setState({ meetingsAndUpdates: meetingsAndUpdates });

    const meetingsAndUpdatesDT: IMeetingsAndUpdatesDT[] = meetingsAndUpdates.map(meeting => {
      console.log('meeting :: ', meeting);

      // Format Meeting and MeetingEndDate as desired '03/01/2023 | 13:00 - 03/01/2023 | 13:30'
      const formattedMeetingStart = meeting.Meeting ? this.formatDate(new Date(meeting.Meeting)) : '';
      console.log('formattedMeetingStart :: ', formattedMeetingStart);
      const formattedMeetingEnd = meeting.MeetingEndDate ? this.formatDate(new Date(meeting.MeetingEndDate)) : '';
      console.log('formattedMeetingEnd :: ', formattedMeetingEnd);

      // Combine Meeting and MeetingEndDate
      const meetingDateTime = formattedMeetingStart && formattedMeetingEnd ? `${formattedMeetingStart} - ${formattedMeetingEnd}` : '';
      console.log('meetingDateTime :: ', meetingDateTime);

      // Create a new object with the modified MeetingDateTime property
      return {
        ...meeting,
        MeetingDateTime: meetingDateTime
      };
    });

    console.log('meetingsAndUpdatesDT :: ', meetingsAndUpdatesDT);

    this.setState({ meetingsAndUpdatesDT: meetingsAndUpdatesDT });

  } 

  private formatDate(date: Date | null | undefined): string {
    console.log('formatDate  called......')
    console.log('date ::', date)
    if (!date) return '';

    const day = date.getUTCDay();
    console.log('day ::', day)
    const month = date.getUTCMonth();
    console.log('month ::', month)
    const year = date.getUTCFullYear();
    console.log('year ::', year)

    const hours = date.getHours().toString().padStart(2, '0');
    console.log('hours ::', hours)
    const minutes = date.getMinutes();
    console.log('minutes ::', minutes)

    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  }

  public render(): React.ReactElement<IEngagementDashboardMeetingProps> {
    const CalendarBlank = require("../assets/CalendarBlank-f.png");
    const expandImage = require("../../eiAccountDashboardUpdates/assets/ArrowsOut-f.png");

    const siteUrl = this.props.context.pageContext.web.absoluteUrl;

    // const engagementMeetings = [
    //   {
    //     id: "1",
    //     title: "Meeting at 19:00 with Gary",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "2",
    //     title: "Call with C919 Team at 18:00 tomorrow",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "3",
    //     title: "MOM for the meeting with Henry at 13:00 today.",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "4",
    //     title: "Meeting at 19:00 with Gary",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "5",
    //     title: "Call with C919 Team at 18:00 tomorrow",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "6",
    //     title: "MOM for the meeting with Henry at 13:00 today.",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "7",
    //     title: "Meeting at 19:00 with Gary",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "8",
    //     title: "Call with C919 Team at 18:00 tomorrow",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    //   {
    //     id: "9",
    //     title: "MOM for the meeting with Henry at 13:00 today.",
    //     description:
    //       "Lorem Ipsum is simply dummy text of the printing and typsetting...",
    //   },
    // ];

    // const location = window.location.href.split("?")[0];
    // let urlParams = new URLSearchParams(window.location.search);
    
    // const SourceUrl = urlParams.get("source");
    // const splitUrl = SourceUrl?.split("?")[0];

    return (
      <section>
        <div className="i-card engagementMeetings mt-0">
          
            <div className="i-card-header">
              <div className="i-card-title">Meetings/Updates</div>
              {
                // !urlParams.has("accountid") && 
                this.state.meetingsAndUpdatesDT.length > 0 ? (
                <Link
                  href={`${siteUrl}/SitePages/MeetingsUpdatesExpanded.aspx?accountName=${this.props.event.tryGetValue()}&source=${
                    window.location.href.split("?")[0]
                  }`}
                >
                  <Image src={expandImage} />
                </Link>
               ) : null}
            </div>
         
          <div className="i-card-body">
            <div className="inner_wrap">
              <ul className="meeting_listing_card">
                {this.state.meetingsAndUpdatesDT.map((item:any, index) => {
                  return (
                    <li key={item.Id}>
                      <div className="meeting_card">
                        <div className="meeting_card_img">
                          <Image src={CalendarBlank}></Image>
                        </div>
                        <div className="meeting_card_details">
                          <h6>{item.Title}</h6>
                          <div>{item.MeetingDateTime}</div>
                          <p>{item.Description}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
