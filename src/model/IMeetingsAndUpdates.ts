export interface IMeetingsAndUpdates {
    ID: number;
    Title: string;
    Attendee: string;
    Occurrence: any;
    Description: string;
    AccountName: string;
    Account_Name: string;
    Meeting: Date | null;
    MeetingEndDate: Date | null;
};

// Below object is use for DataTable
export interface IMeetingsAndUpdatesDT {
  ID: number;
  Title: string;
  Attendee: string;
  Occurrence: any;
  Description: string;
  AccountName: string;
  Meeting: Date | null;
  MeetingEndDate: Date | null;
  MeetingDateTime: string;
};