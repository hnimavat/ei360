import * as React from 'react';
import styles from './EngagementDashboardMeetingsUpdatesExpanded.module.scss';
import type { IEngagementDashboardMeetingsUpdatesExpandedProps } from './IEngagementDashboardMeetingsUpdatesExpandedProps';
import { Stack, Text, FontIcon, DatePicker, TimePicker, Dropdown, IDropdownOption, IDropdownStyles, mergeStyleSets, IStackProps, IButtonStyles, DefaultButton, FocusTrapZone, Layer, Overlay, Popup, TextField, ITextFieldStyles, ISearchBoxStyles, SearchBox, Label, Link, PrimaryButton } from '@fluentui/react';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import { IMeetingsAndUpdates, IMeetingsAndUpdatesDT } from "../../../model/IMeetingsAndUpdates";
import { EDServices } from '../../../services/EDServices';
import { Toaster, toast } from "react-hot-toast";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { cloneDeep } from '@microsoft/sp-lodash-subset';


export interface ComponentStates {
  meetingsAndUpdates: IMeetingsAndUpdates[];
  meetingsAndUpdatesDT: IMeetingsAndUpdatesDT[];
  updateMeetingsAndUpdates: IMeetingsAndUpdates;
  showPopup: boolean;
  viewmeetings: boolean;
  value: any;
  globalFilterValue: any;
  filters: IFilters;
  accountName: string;
  selectedKeyOccurrence: any;
  MeetingDateTime: string;
  startDate: Date | null | undefined;
  startTime: Date | null | undefined;
  endDate: Date | null | undefined;
  endTime: Date | null | undefined;
  isTouched: boolean;
  selectedRows: [];
  hideDialog: boolean,
  showFilterPopup: boolean,
  deleteMeetingId: number,
}

export interface IFilters {
  searchText: string;
}

export default class EngagementDashboardMeetingsUpdatesExpanded extends React.Component<IEngagementDashboardMeetingsUpdatesExpandedProps, ComponentStates, {}> {
  private eiEDServices: EDServices;

  constructor(props: IEngagementDashboardMeetingsUpdatesExpandedProps) {
    super(props);
    this.eiEDServices = new EDServices(props.context);

    this.state = {
      meetingsAndUpdates: [],
      meetingsAndUpdatesDT: [],
      updateMeetingsAndUpdates: {
        ID: 0,
        Title: '',
        Attendee: '',
        Occurrence: null,
        Description: '',
        AccountName: '',
        Meeting: null,
        MeetingEndDate: null,
        Account_Name: ''
      },
      showPopup: false,
      viewmeetings: false,
      value: "",
      accountName: "",
      globalFilterValue: '',
      filters: {
        searchText: ""
      },
      selectedKeyOccurrence: '',
      MeetingDateTime: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      isTouched: false,
      selectedRows: [],
      hideDialog: false,
      showFilterPopup: false,
      deleteMeetingId: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  occurrenceOptions: IDropdownOption[] = [
    { key: 'every week', text: 'Every Week' },
    { key: 'every month', text: 'Every Month' },
    { key: 'does not repeat', text: 'Does Not Repeat' },
  ];

  public async componentDidMount(): Promise<void> {
    console.log("componentDidMount MeetingsAndUpdates");

    const urlParams = new URLSearchParams(window.location.search);
    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for meeting expanded :: ', accountName)

    this.setState({ accountName: accountName, })
    this.setState({
      updateMeetingsAndUpdates: {
        ...this.state.updateMeetingsAndUpdates,
        Account_Name: accountName
      }
    })

    await this.getMeetingsAndUpdates(accountName);
  }

  public async getMeetingsAndUpdates(accountName: string): Promise<void> {
    const meetingsAndUpdates: IMeetingsAndUpdates[] = await this.eiEDServices.getMeetingsAndUpdatesDetails(accountName)
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

  // Function to save or update account details in a SharePoint list
  public async saveOrUpdateMeetingsAndUpdates(meetingsDetails: IMeetingsAndUpdates): Promise<boolean> {
    console.log('saveOrUpdateMeetingsAndUpdates called...')
    let result: boolean = false

    console.log('meetingsDetails ::: ', meetingsDetails);

    try {
      if (meetingsDetails.Title != '' && meetingsDetails.Attendee != '' && meetingsDetails.Occurrence != null &&
        this.state.startDate != null && this.state.startTime != null && this.state.endDate != null &&
        this.state.endTime != null) {
        if (meetingsDetails.ID != 0) {
          await this.eiEDServices.updateItem('Engagement_Meetings', meetingsDetails.ID, {
            Title: meetingsDetails.Title,
            Attendee: meetingsDetails.Attendee,
            Meeting: this.getMeetingStartDate(),
            MeetingEndDate: this.getMeetingEndDate(),
            Occurrence: meetingsDetails.Occurrence,
            Description: meetingsDetails.Description
          })
          toast.success('Meeting details updated successfully.');
          console.log("Meetings details updated successfully.");
          result = true;
        } else {
          //Pass AccountNameId dynamic while saving data need to do dynamic
          await this.eiEDServices.createItem('Engagement_Meetings', {
            Title: meetingsDetails.Title,
            Attendee: meetingsDetails.Attendee,
            Meeting: this.getMeetingStartDate(),
            MeetingEndDate: this.getMeetingEndDate(),
            Occurrence: meetingsDetails.Occurrence,
            Description: meetingsDetails.Description,
            Account_Name: this.state.accountName
          })

          toast.success('Meeting details added successfully.');
          console.log("New Meetings details added successfully.");
          result = true;
        }
      }
    } catch (error) {
      console.error("Error saving or updating account details:", error);
      result = false;
    }

    if (result === true) {
      await this.getMeetingsAndUpdates(this.state.accountName)// need to do dynamic
      this.setState({ showPopup: false, viewmeetings: false })
      this.setblankfields();

    }

    return result;
  }

  private async editMeetingsAndUpdates(rowData: any): Promise<void> {
    debugger;
    this.setState({
      updateMeetingsAndUpdates: {
        ID: rowData.ID,
        Title: rowData.Title,
        Attendee: rowData.Attendee,
        Occurrence: rowData.Occurrence,
        Description: rowData.Description,
        AccountName: this.state.accountName, 
        Meeting: null,
        MeetingEndDate: null,
        Account_Name: this.state.accountName
      },
    });

    const occurrenceKey = this.getKeyFromValue(
      this.occurrenceOptions,
      rowData.Occurrence
    );
    console.log("occurrenceKey :: ", occurrenceKey);
    if (occurrenceKey !== null) {
      this.setState({ selectedKeyOccurrence: occurrenceKey });
    }

    this.state.meetingsAndUpdates.forEach((meeting) => {
      // Do something with each stackholder
      console.log("meeting :: ", meeting);

      if (rowData.ID == meeting.ID) {
        const startDate = meeting.Meeting ? new Date(meeting.Meeting) : null;
        const startTime = meeting.Meeting ? new Date(meeting.Meeting) : null;
        const endDate = meeting.MeetingEndDate ? new Date(meeting.MeetingEndDate) : null;
        const endTime = meeting.MeetingEndDate ? new Date(meeting.MeetingEndDate) : null;
        console.log('start date :: ', startDate);
        console.log('start time :: ', startTime);
        console.log('end date :: ', endDate);
        console.log('end time :: ', endTime);

        this.setState({
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime
        });
      }
    });

    this.setState({ showPopup: true });
  }

  private async viewMeetingsAndUpdates(rowData: any): Promise<void> {

    this.setState({
      updateMeetingsAndUpdates: {
        ID: rowData.ID,
        Title: rowData.Title,
        Attendee: rowData.Attendee,
        Occurrence: rowData.Occurrence,
        Description: rowData.Description,
        AccountName: this.state.accountName, 
        Account_Name: this.state.accountName,
        Meeting: null,
        MeetingEndDate: null
      },
    });

    const occurrenceKey = this.getKeyFromValue(
      this.occurrenceOptions,
      rowData.Occurrence
    );
    console.log("occurrenceKey :: ", occurrenceKey);
    if (occurrenceKey !== null) {
      this.setState({ selectedKeyOccurrence: occurrenceKey });
    }

    this.state.meetingsAndUpdates.forEach((meeting) => {
      console.log("meeting :: ", meeting);

      if (rowData.ID == meeting.ID) {
        const startDate = meeting.Meeting ? new Date(meeting.Meeting) : null;
        const startTime = meeting.Meeting ? new Date(meeting.Meeting) : null;
        const endDate = meeting.MeetingEndDate ? new Date(meeting.MeetingEndDate) : null;
        const endTime = meeting.MeetingEndDate ? new Date(meeting.MeetingEndDate) : null;
        console.log('start date :: ', startDate);
        console.log('start time :: ', startTime);
        console.log('end date :: ', endDate);
        console.log('end time :: ', endTime);

        this.setState({
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime
        });
      }
    });

    this.setState({ viewmeetings: true });
  }

  private handleDeleteMeeting(meetingId: number) {
    this.setState({
      deleteMeetingId: meetingId,
      hideDialog: true
    })
  }

  private async deleteMultipleMeetingsAndUpdates(selectedRows: any[], deleteMeetingId: number): Promise<void> {
    console.log("Selected rows to delete :: ", selectedRows);
    console.log("Meeting id to delete :: ", deleteMeetingId);

    let isdeleted = false;
    try {
      if (selectedRows.length > 0) {
        // Iterate over each selected row and delete the corresponding item
        await Promise.all(selectedRows.map(async (row: any) => {
          isdeleted = await this.eiEDServices.deleteItem('Engagement_Meetings', row.ID);
        }));
      } else if (deleteMeetingId != 0) {
        isdeleted = await this.eiEDServices.deleteItem('Engagement_Meetings', deleteMeetingId);
      }

      if (isdeleted) {
        await this.getMeetingsAndUpdates(this.state.accountName); 
        toast.success('Meeting details deleted successfully.');
        this.setState({ hideDialog: false, selectedRows: [] })
        console.log("Selected rows deleted successfully!");
      } else {
        console.error("Error Deleting MeetingsAndUpdates details");
        toast.error("Something went wrong!");
      }

    } catch (error) {
      console.error("Error Deleting selected rows:", error);
      toast.error("Something went wrong!");
    }
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

  private setblankfields() {
    this.setState({
      updateMeetingsAndUpdates: {
        ID: 0,
        Title: '',
        Attendee: '',
        Occurrence: null,
        Description: '',
        AccountName: this.state.accountName,
        Meeting: null,
        MeetingEndDate: null,
        Account_Name: this.state.accountName
      },
      value: '',
      selectedKeyOccurrence: '',
      MeetingDateTime: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      isTouched: false
    });
  }

  private getKeyFromValue(dropdown: IDropdownOption[], value: any) {
    debugger;
    const option = dropdown.find((option) => option.text === value);
    if (option !== undefined) {
      return option.key.toString();
    }
    return "";
  }

  handleStartDateChange = (date: Date | null | undefined) => {
    this.setState({ startDate: date });
  };

  handleEndDateChange = (date: Date | null | undefined) => {
    this.setState({ endDate: date });
  };

  handleStartTimeChange = (time: Date | null | undefined) => {
    this.setState({ startTime: time });
  };

  handleEndTimeChange = (date: Date | null | undefined) => {
    this.setState({ endTime: date });
  };

  private getMeetingStartDate(): any {
    if (this.state.startDate && this.state.startTime) {
      return new Date(
        Date.UTC(
          this.state.startDate.getUTCFullYear(),
          this.state.startDate.getUTCMonth(),
          this.state.startDate.getUTCDate(),
          this.state.startTime.getUTCHours(),
          this.state.startTime.getUTCMinutes()
        ));
    }
    return null;
  }

  private getMeetingEndDate(): any {
    if (this.state.endDate && this.state.endTime) {
      return new Date(
        Date.UTC(
          this.state.endDate.getUTCFullYear(),
          this.state.endDate.getUTCMonth(),
          this.state.endDate.getUTCDate(),
          this.state.endTime.getUTCHours(),
          this.state.endTime.getUTCMinutes()
        ));
    }
    return null;
  }


  handleMeetingsTextFieldChange(fieldName: any, value: any, key: any) {
    console.log('fieldName :: ', fieldName);
    console.log('value :: ', value);
    console.log('meetingsAndUpdates :: ', this.state.updateMeetingsAndUpdates);

    this.setState({
      updateMeetingsAndUpdates: {
        ...this.state.updateMeetingsAndUpdates,
        [fieldName]: value
      }
    });

    if (key !== null) {
      if (fieldName == 'Occurrence') {
        this.setState({ selectedKeyOccurrence: key });
      }
    }

  }

  onSelectionChange = (e: { value: any }) => {
    let tempMeetingDetails: any = { ...this.state.meetingsAndUpdates };
    console.log('tempMeetingDetails ::', tempMeetingDetails)
    const selectedRows = e.value;
    console.log('selectedRows ::', selectedRows)

    const selectedRowData = selectedRows.map((rowKey: any) =>
      this.state.meetingsAndUpdates.find((row) => row.ID === rowKey.ID)
    );
    console.log('selectedRowData ::', selectedRowData)
    if (selectedRowData.length > 0) {
      tempMeetingDetails.ID = selectedRowData[0].ID;
    }

    this.setState({
      selectedRows: selectedRows,
    })
  };

  handleDeleteRow = () => {
    console.log('handleDeleteRow called...');

    if (this.state.selectedRows.length > 0) {
      this.setState({ hideDialog: true })
    } else {
      // No selected rows, handle accordingly
      console.log("No rows selected to delete.");
      toast.error("Please select at least one item to delete.");
    }
  }

  handleTextFieldBlur = () => {
    this.setState({ isTouched: true });
  }

  handleChange(event: any) {
    this.setState({ value: event.target.value });
  }
  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href =
      "Engagement_Dashboard.aspx" +
      sourceParam;
  }

  private handleFilterChange(fieldName: string, value: any) {
    this.setState({
      filters: {
        ...this.state.filters,
        [fieldName]: value
      }
    })

  }

  private getFilteredData() {
    const { filters } = this.state;
    let data = cloneDeep(this.state.meetingsAndUpdatesDT);

    if (filters.searchText) {
      const searchText = filters.searchText.toLocaleLowerCase();
      data = data.filter((x) => {
        return (x.Attendee && x.Attendee.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Title && x.Title.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Occurrence && x.Occurrence.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Description && x.Description.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.MeetingDateTime && x.MeetingDateTime.toLocaleLowerCase().indexOf(searchText) > -1)
      });
    }
    return data;
  }

  dialogContentProps = {
    type: DialogType.normal,
    title: "Confirmation",
    subText: "Are you sure you want to delete the selected meetings?",
  };

  public render(): React.ReactElement<IEngagementDashboardMeetingsUpdatesExpandedProps> {

    const viewmeetings = this.state.viewmeetings;

    const actionBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <FontIcon aria-label="view" iconName="RedEye" className={styles.editIcon} onClick={() => this.viewMeetingsAndUpdates(rowData)} />
          <FontIcon aria-label="edit" iconName="EditSolid12" className={styles.editIcon} onClick={() => this.editMeetingsAndUpdates(rowData)} />
          <FontIcon aria-label="delete" iconName="delete" className={styles.deleteIcon} onClick={() => this.handleDeleteMeeting(rowData.ID)} />
        </React.Fragment>
      );
    };
   
    const textFieldProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { height: 40, border: "1px solid #D7DADE", color: "#D7DADE" },
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
      viewContent: {
        background: 'white',
        left: '50%',
        maxWidth: '340px',
        width: '100%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
      }
    });

    const columnProps: Partial<IStackProps> = {
      tokens: { childrenGap: 15 },
    };

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: "20px 0 0 10px", float: "right" },
    };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF' }
    };

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    let urlParams = new URLSearchParams(window.location.search);
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];

    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        {urlParams.has("source") && (
          <div>
            <ul className="breadcrumb">
              <li>
                {/* <a onClick={this.navigateToPreviousPage}>engagement dashboard</a> */}
                <Link
                  href={`${splitUrl}?accountName=${this.state.accountName}`}
                >
                  engagement dashboard
                </Link>
              </li>
              <li>meetings/updates</li>
            </ul>
          </div>
        )}
        <section className="accountOverviewSection ">
          <div className="blockTitleWrap i-mb-20">
            <div className="titleWrap">
              <SearchBox
                placeholder="Search"
                styles={searchBoxStyles}
                className="searchBar"
                value={this.state.filters.searchText}
                onChange={(e, text: string) => this.handleFilterChange("searchText", text)}
              />
            </div>
            <div className="rightbar">
              <span>
                <DefaultButton
                  text="Delete"
                  className="btn-outline"
                  onClick={this.handleDeleteRow}
                ></DefaultButton>
              </span>

              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
              >
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                  <DefaultButton
                    className="btn-primary"
                    text="Create New Event"
                    onClick={() => { this.setState({ showPopup: true, isTouched: false }); this.setblankfields(); }}
                  ></DefaultButton>
                  {this.state.showPopup && (
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
                                Create New Event
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
                                <TextField
                                  label="Title"
                                  styles={textFieldProps}
                                  placeholder="Enter Title"
                                  value={this.state.updateMeetingsAndUpdates.Title}
                                  onChange={(event, value) => this.handleMeetingsTextFieldChange('Title', value, null)}
                                  onBlur={this.handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updateMeetingsAndUpdates
                                        .Title
                                      ? "Title is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <TextField
                                  label="Attendee"
                                  styles={textFieldProps}
                                  placeholder="Enter Attendee"
                                  description="Separate Attendee with “,”"
                                  value={this.state.updateMeetingsAndUpdates.Attendee}
                                  onChange={(event, value) => this.handleMeetingsTextFieldChange('Attendee', value, null)}
                                  onBlur={this.handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updateMeetingsAndUpdates
                                        .Attendee
                                      ? "Attendee is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <Stack tokens={{ childrenGap: 8 }}>
                                  <Label required={true}>Date & Time</Label>
                                  <Stack horizontal tokens={{ childrenGap: 8 }} className='DateTimeContainer'>
                                    <DatePicker
                                      placeholder="Start Date"
                                      allowTextInput={true}
                                      //isRequired={true}
                                      onSelectDate={(value) => this.handleStartDateChange(value)}
                                      styles={{ root: { width: '100%' } }}
                                      value={this.state.startDate ? this.state.startDate : undefined}
                                      //onChange={(value) => this.handleMeetingsTextFieldChange('Meeting', value, null)}
                                      onBlur={this.handleTextFieldBlur}
                                    />
                                    <TimePicker
                                      placeholder="Start Time"
                                      allowFreeform={true}
                                      //required={true}
                                      styles={{ root: { width: '100%' } }}
                                      value={this.state.startTime ? this.state.startTime : undefined}
                                      onChange={(event, value) => this.handleStartTimeChange(value)}
                                    />
                                    <DatePicker
                                      placeholder="End Date"
                                      allowTextInput={true}
                                      //isRequired={true}
                                      onSelectDate={(value) => this.handleEndDateChange(value)}
                                      styles={{ root: { width: '100%' } }}
                                      value={this.state.endDate ? this.state.endDate : undefined}
                                    //onChange={(value) => this.handleMeetingsTextFieldChange('MeetingEndDate', value, null)}
                                    />
                                    <TimePicker
                                      placeholder="End Time"
                                      allowFreeform={true}
                                      //required={true}
                                      styles={{ root: { width: '100%' } }}
                                      value={this.state.endTime ? this.state.endTime : undefined}
                                      onChange={(event, value) => this.handleEndTimeChange(value)}
                                    />
                                  </Stack>
                                  {this.state.isTouched &&
                                    (!this.state.startDate ||
                                      !this.state.startTime ||
                                      !this.state.endDate ||
                                      !this.state.endTime) && (
                                      <div>
                                        <p style={{ color: "#A4262C", fontSize: "12px", fontWeight: 400 }}>
                                          Date & Time is required.
                                        </p>
                                      </div>
                                    )}
                                </Stack>
                                <Dropdown
                                  label="Occurrence"
                                  placeholder='Select Occurrence'
                                  selectedKey={this.state.selectedKeyOccurrence}
                                  options={this.occurrenceOptions}
                                  styles={dropdownStyles}
                                  className='droupdown'
                                  onChange={(event, value) => this.handleMeetingsTextFieldChange('Occurrence', value?.text, value?.key || '')}
                                  onBlur={this.handleTextFieldBlur}
                                  errorMessage={
                                    this.state.isTouched &&
                                      !this.state.updateMeetingsAndUpdates
                                        .Occurrence
                                      ? "Occurrence is required."
                                      : ""
                                  }
                                  required={true}
                                />

                                <TextField
                                  label="Description"
                                  styles={textFieldProps}
                                  placeholder="Enter Description"
                                  value={this.state.updateMeetingsAndUpdates.Description}
                                  onChange={(event, value) => this.handleMeetingsTextFieldChange('Description', value, null)}
                                />
                              </Stack>
                              <DefaultButton className='btn-primary' text="Save" styles={modalButton} onClick={() => { this.saveOrUpdateMeetingsAndUpdates(this.state.updateMeetingsAndUpdates) }}></DefaultButton>

                              <DefaultButton className='btn-outline' text="Cancel" styles={modalButton} onClick={() => this.setState({ showPopup: false, viewmeetings: false })}></DefaultButton>
                            </div>
                          </div>
                        </FocusTrapZone>
                      </Popup>
                    </Layer>
                  )}
                </Stack>
              </Stack>

            </div>
          </div>
          <div className='datatable-wrapper'>
            <DataTable value={this.getFilteredData()} scrollable globalFilterFields={['MeetingDateTime', 'Title', 'Attendee', 'Occurrence', 'Description']} selection={this.state.selectedRows} onSelectionChange={this.onSelectionChange}>
              <Column field="Checkbox" selectionMode="multiple" style={{ minWidth: '10px' }} className={styles.Checkbox} />
              <Column field="MeetingDateTime" header="Meeting Date & Time" filter style={{ minWidth: '260px' }} ></Column>
              <Column field="Title" header="Title" filter style={{ minWidth: '215px' }}  ></Column>
              <Column field="Attendee" header="Attendee" filter style={{ minWidth: '220px' }}></Column>
              <Column field="Occurrence" header="Occurrence" filter style={{ minWidth: '170px' }}></Column>
              <Column field="Description" header="Description" filter style={{ minWidth: '270px' }}></Column>
              <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '150px' }}></Column>
            </DataTable>
          </div>
        </section>

        <Dialog
          hidden={!this.state.hideDialog}
          dialogContentProps={this.dialogContentProps}
        >
          <DialogFooter>
            {/* Confirm deletion */}
            <PrimaryButton
              onClick={() => this.deleteMultipleMeetingsAndUpdates(this.state.selectedRows, this.state.deleteMeetingId)}
              text="Delete"
            />
            {/* Cancel */}
            <DefaultButton
              onClick={() => this.setState({ hideDialog: false })}
              text="Cancel"
            />
          </DialogFooter>
        </Dialog>

        {viewmeetings && (
          <Layer>
            <Popup
              className={addUpdatesPopupStyles.root}
              role="dialog"
              aria-modal="true"
              onDismiss={() =>
                this.setState({ viewmeetings: false })
              }
            >
              <Overlay
                onClick={() =>
                  this.setState({ viewmeetings: false })
                }
              />
              <FocusTrapZone>
                <div
                  role="document"
                  className={addUpdatesPopupStyles.viewContent}
                >
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                    className={styles.modalPopupHeader}
                  >
                    <Text className={styles.modalPopupTitle}>
                      Event Details
                    </Text>
                    <FontIcon
                      aria-label="Compass"
                      iconName="Cancel"
                      className={styles.iconStyle}
                      onClick={() =>
                        this.setState({ viewmeetings: false })
                      }
                    />
                  </Stack>
                  <div className={styles.modalContent}>
                    <div className="i-row">
                      <div className="i-col-12 i-mb-13">
                        <div className="d-flex flex-column">
                          <Text className="T-Title">Title</Text>
                          <Text className="T-Desc">
                            {this.state.updateMeetingsAndUpdates.Title}
                          </Text>
                        </div>
                      </div>
                      <div className="i-col-12  i-mb-13">
                        <div className="d-flex flex-column">
                          <Text className="T-Title">Attendee</Text>
                          <Text className="T-Desc">
                            {this.state.updateMeetingsAndUpdates.Attendee}
                          </Text>
                        </div>
                      </div>
                      <div className="i-col-6 i-mb-13">
                        <div className="d-flex flex-column">
                          <Text className="T-Title">Start Date & Time</Text>
                          <Text className="T-Desc">
                            {this.state.startDate ? this.formatDate(new Date(this.state.startDate)) : ''}
                          </Text>
                        </div>
                      </div>
                      <div className="i-col-6 i-mb-13">
                        <div className="d-flex flex-column">
                          <Text className="T-Title">End Date & Time</Text>
                          <Text className="T-Desc">
                            {this.state.endDate ? this.formatDate(new Date(this.state.endDate)) : ''}
                          </Text>
                        </div>
                      </div>
                      <div className="i-col-12 i-mb-13">
                        <div className="d-flex flex-column">
                          <Text className="T-Title">Occurrence</Text>
                          <Text className="T-Desc">
                            {this.state.updateMeetingsAndUpdates.Occurrence}
                          </Text>
                        </div>
                      </div>
                      <div className="i-col-12 i-mb-13">
                        <div className="d-flex flex-column">
                          <Text className="T-Title">Description</Text>
                          <Text className="T-Desc">
                            {this.state.updateMeetingsAndUpdates.Description}
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
                        this.setState({ viewmeetings: false })
                      }
                    ></DefaultButton>
                  </div>
                </div>
              </FocusTrapZone>
            </Popup>
          </Layer>
        )}
      </>
    );
  }
}
