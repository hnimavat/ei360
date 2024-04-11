import * as React from 'react';
//import styles from './EngagementDashboardEscalations.module.scss';
import type { IEngagementDashboardEscalationsProps } from './IEngagementDashboardEscalationsProps';
import { DefaultButton, Text, Dropdown, FontIcon, IButtonStyles, IDropdownStyles, ISearchBoxStyles, SearchBox, Stack, PrimaryButton, Layer, Popup, Overlay, FocusTrapZone, TextField, IStackProps, mergeStyleSets, ITextFieldStyles } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import Piechart from '../../../components/Piechart';
// import { escalationsBuWise } from '../../engagementDashboardResourcing/components/ApiData';
import styles from './EngagementDashboardEscalations.module.scss';
import { EDServices } from '../../../services/EDServices';
import { cloneDeep, groupBy } from '@microsoft/sp-lodash-subset';
import { Toaster, toast } from 'react-hot-toast';
import moment from 'moment';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

const data = require("../../../SampleData/projectData.json");

export interface IEscalationFormFields {
  Id?: number;
  AccountName: string;
  ProjectName: string;
  EscalationDate: string;
  EscalatedBy: string;
  BU: string;
  Status: string;
  Description: string;
  Remarks: string
}

export interface IFilters {
  ProjectName: string;
  dateRange: any;
  searchText: string;
  applied: boolean;
}

export interface EngagementDashboardEscalationsState {
  showFilterPopup: boolean;
  addPopup: boolean;
  accountOption: Array<any>,
  projectOptions: Array<any>,
  statusOptions: Array<any>,
  BUOptions: Array<any>,
  escalationData: Array<any>,
  escalationFormFields: IEscalationFormFields,
  filters: IFilters;
  isTouched: boolean
}

const url = new URL(window.location.href);
const accountName = url.searchParams.get("accountName");

export default class EngagementDashboardEscalations extends React.Component<IEngagementDashboardEscalationsProps, EngagementDashboardEscalationsState, {}> {
  spServices: EDServices;

  constructor(props: IEngagementDashboardEscalationsProps) {
    super(props);
    this.spServices = new EDServices(props.context);

    this.state = {
      showFilterPopup: false,
      addPopup: false,
      accountOption: [],
      projectOptions: [],
      statusOptions: [],
      BUOptions: [],
      escalationData: [],
      escalationFormFields: this.getFormFields(),
      filters: {
        dateRange: "",
        ProjectName: "",
        searchText: "",
        applied: false
      },
      isTouched: false
    };
    this.screenInit();
  }

  private getFormFields(): IEscalationFormFields {
    return {
      AccountName: accountName || "",
      ProjectName: "",
      EscalationDate: "",
      EscalatedBy: "",
      BU: "",
      Status: "",
      Description: "",
      Remarks: "",
    }
  }

  private async screenInit() {
    const escalationData = await this.spServices.getListDataWithFilter(this.props.listName, `AccountName eq '${accountName}'`);
    const statusChoices = await this.spServices.getFieldsByListName(this.props.listName, "Status");
    const statusOptions = statusChoices.Choices.map((x: any) => { return { key: x, text: x } })
    const BUChoices = await this.spServices.getFieldsByListName(this.props.listName, "BU");
    const BUOptions = BUChoices.Choices.map((x: any) => { return { key: x, text: x } })

    const groupByAccount = groupBy(data.data, "clientName"); // call the API for getting the data of account and project
    const accountOption = Object.keys(groupByAccount).slice(0, 25).map((x) => { return { key: x, text: x, data: groupByAccount[x] } });
    this.setState({
      accountOption: accountOption,
      projectOptions: data.data.map((x: any) => { return { key: x.projectName, text: x.projectName, accountName: x.clientName } }),
      statusOptions: statusOptions,
      BUOptions: BUOptions,
      escalationData: escalationData
    });
  }

  private handleFormChange(fieldName: string, value: any) {
    this.setState({
      escalationFormFields: {
        ...this.state.escalationFormFields,
        [fieldName]: value
      }
    })
  }

  private async handleSave() {
    if (this.state.escalationFormFields.ProjectName && this.state.escalationFormFields.BU && this.state.escalationFormFields.EscalatedBy && this.state.escalationFormFields.Status) {
      let obj = this.state.escalationFormFields;
      obj.EscalationDate = new Date().toISOString();
      this.spServices.createItem(this.props.listName, obj).then((res) => {
        this.setState({
          escalationFormFields: this.getFormFields(),
          addPopup: false,
          isTouched: false,
        });
        this.screenInit();
        toast.success("Escalation data added successfully.");
      })
      console.log(this.state.escalationFormFields);
    }
  }

  navigateToPreviousPage = () => {
    window.location.href = 'Engagement_Dashboard.aspx' + '?accountName=' + accountName;
  };

  private escalationStatusWise(escalationData: any, statusOptions: any) {
    const groupByStatus = escalationData && groupBy(escalationData, "Status");
    const escalationstatus = statusOptions && statusOptions.map((x: any) => {
      return { legend: x.key, data: groupByStatus[x.key] ? groupByStatus[x.key]?.length : 0, color: this.getColorForStatus(x.key) }
    });

    console.log(escalationstatus);

    return escalationstatus;
  }

  private escalationsBuWise(escalationData: any, BUOptions: any) {
    const groupByStatus = escalationData && groupBy(escalationData, "BU");
    const escalationstatus = BUOptions && BUOptions.map((x: any) => {
      return { legend: x.key, data: groupByStatus[x.key] ? groupByStatus[x.key]?.length : 0, color: this.getColorForBU(x.key) }
    });
    return escalationstatus;
  }

  private getColorForBU(key: any) {
    switch (key) {
      case "Aerospace":
        return "#2EB034"
      case "Automotive":
        return "#F57D0E"
      case "Digital":
        return "#DB4537"
      case "Embedded":
        return "#B2C2DA"
      case "Hardware":
        return "#D47D0E"
      case "Intelligent Automation":
        return "#DO4537"
    }
  }

  private getColorForStatus(key: any) {
    switch (key) {
      case "Open":
        return "#2EB034"
      case "Closed":
        return "#F57D0E"
      case "In Progress":
        return "#DB4537"
      case "Resolved":
        return "#B2C2DA"
    }
  }

  private handleCancelFilter() {
    this.setState({
      showFilterPopup: false,
      filters: {
        dateRange: "",
        ProjectName: "",
        searchText: "",
        applied: false
      }
    })
  }

  private handleFilterChange(fieldName: string, value: any) {
    this.setState({
      filters: {
        ...this.state.filters,
        [fieldName]: value
      }
    }, () => {
      if (fieldName == "applied" && value) {
        this.setState({
          showFilterPopup: false
        })
      }
    })
  }

  private downloadExcel() {
    if (this.filteredEscalations().length > 0) {
      const fileName = "EscalationDashboardData";
      let excelData = this.filteredEscalations().map((obj: IEscalationFormFields) => {
        return {
          "AccountName": accountName,
          "Programs/Projects": obj.ProjectName,
          "Escalation Date": obj.EscalationDate ? moment(obj.EscalationDate).format("DD/MM/YYYY") : "",
          "Escalated By": obj.EscalatedBy,
          "BU": obj.BU,
          "Status": obj.Status,
          "Description": obj.Description,
          "Remarks": obj.Remarks,
        }
      })
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(excelData), 'Sheet');
      const wbout = XLSX.write(wb, { bookType: 'csv', type: 'binary' });
      saveAs(new Blob([this.s2ab(wbout)], { type: 'text/csv' }), `${fileName + "_" + moment().format("YYYYMMDDhhmmss")}.csv`);
    }
  }

  private s2ab(s: any) {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }

  private filteredEscalations() {
    const { filters } = this.state;
    let data = cloneDeep(this.state.escalationData);

    if (filters.searchText) {
      const searchText = filters.searchText.toLocaleLowerCase();
      data = data.filter((x) => {
        return (x.ProjectName && x.ProjectName.toLocaleLowerCase().indexOf(searchText) > -1)
      });
    }
    if (filters.applied) {
      if (filters.ProjectName) {
        data = data.filter((x) => x.ProjectName == filters.ProjectName);
      }
      if (filters.dateRange) {
        let startDate = filters.dateRange[0];
        let endDate = filters.dateRange[1];
        startDate = startDate && moment(startDate).startOf('day');
        endDate = endDate && moment(endDate).endOf('day');
        data = data.filter((x) => {
          const itemDate = moment(x.EscalationDate);
          if (startDate && !endDate) {
            return itemDate.isAfter(startDate);
          } else if (startDate && endDate) {
            return itemDate.isBetween(startDate, endDate, 'day', '[]');
          }
        })
      }
    }

    return data;
  }

  private handleCancelPopup() {
    this.setState({
      addPopup: false,
      escalationFormFields: this.getFormFields(),
      isTouched: false,
    })
  }

  handleTextFieldBlur = () => {
    this.setState({ isTouched: true });
  }

  public render(): React.ReactElement<IEngagementDashboardEscalationsProps> {

    const { showFilterPopup, addPopup, BUOptions, escalationData, accountOption, statusOptions, projectOptions, escalationFormFields } = this.state;

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF' }
    };
    const textFieldProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: 'Poppins' },
      fieldGroup: { height: 40, border: '1px solid #D7DADE', color: '#D7DADE' },
    };
    const textFieldParagraphProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: 'Poppins' },
      fieldGroup: { border: '1px solid #D7DADE', color: '#D7DADE' },
    };
    const addUpdatesPopupStyles = mergeStyleSets({
      root: {
        background: 'rgba(0, 0, 0, 0.2)',
        bottom: '0',
        left: '0',
        position: 'fixed',
        right: '0',
        top: '0',
      },
      content: {
        background: 'white',
        left: '50%',
        maxWidth: '704px',
        width: '100%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
      },
    });
    const columnProps: Partial<IStackProps> = {
      tokens: { childrenGap: 15 },
    };

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: '20px 0 0' }
    }

    return (
      <>
        <Toaster
          position="bottom-right"
          reverseOrder={false} />
        <div>
          <ul className='breadcrumb'>
            <li>
              <a onClick={this.navigateToPreviousPage}>Engagement Dashboard</a>
            </li>
            <li>{accountName} - Escalations</li>
          </ul>
        </div>
        <section className='JCI_resourcing' >
          <div className='accountOverviewSection'>
            <div className='blockTitleWrap i-mb-20'>
              <div className='titleWrap'>
                <SearchBox placeholder="Search"
                  value={this.state.filters.searchText}
                  onChange={(ev, value) => this.handleFilterChange("searchText", value)}
                  styles={searchBoxStyles} className='searchBar' />
              </div>
              <div className='rightbar'>
                <span className='popupFilterContainer'>
                  <DefaultButton text="Filter"
                    className='btn-outline'
                    onClick={() => this.setState({ showFilterPopup: true, filters: { ...this.state.filters, applied: false } })}></DefaultButton>
                  {showFilterPopup && (
                    <div role="document" className='popupFilterWrap'>
                      <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className='modalPopupHeader'>
                        <Text className='modalPopupTitle'>Filters</Text>
                        <FontIcon aria-label="Compass" iconName="Cancel"
                          className='popupCancelicon' onClick={() => this.handleCancelFilter()} />
                      </Stack>
                      <div className='modalContent'>
                        <Stack className='formChildGap'>
                          <Dropdown
                            label='Account'
                            defaultSelectedKey='JCI'
                            selectedKey={accountName}
                            options={accountOption}
                            disabled
                            styles={dropdownStyles}
                            className='droupdown'
                          />
                          <Dropdown
                            label='Programs/Projects'
                            placeholder='Select Programs/Projects'
                            selectedKey={this.state.filters.ProjectName}
                            options={projectOptions.filter((res) => res.accountName == accountName)}
                            onChange={(ev, option) => this.handleFilterChange("ProjectName", option?.key)}
                            styles={dropdownStyles}
                            className='droupdown'
                          />
                          <div className='ms-filter'>
                            <label htmlFor="calender">Date Range</label>
                            <Calendar id="calender"
                              placeholder='01/01/2023 - 31/01/2024'
                              value={this.state.filters.dateRange}
                              onChange={(ev) => this.handleFilterChange("dateRange", ev.value)}
                              selectionMode="range" readOnlyInput />
                          </div>
                        </Stack>
                        <Stack horizontal horizontalAlign='end' className='filterButtonWrap'>
                          <DefaultButton className='btn-ghost-gray'
                            styles={modalButton} text="Reset" onClick={() => this.setState({ filters: { dateRange: "", ProjectName: "", searchText: "", applied: false } })}></DefaultButton>
                          <DefaultButton className='btn-ghost' styles={modalButton} text="Apply" onClick={() => this.handleFilterChange("applied", true)}></DefaultButton>
                        </Stack>
                      </div>
                    </div>
                  )}
                </span>
                <span>
                  <DefaultButton text="Add" className='btn-outline' onClick={() => this.setState({ addPopup: true })}></DefaultButton>
                </span>
                <span>
                  <PrimaryButton text="Download" className='btn-primary' onClick={() => this.downloadExcel()}></PrimaryButton>
                </span>
              </div>
            </div>
          </div>
          <div className="i-row">
            <div className='i-col-12'>
              <div className='i-card-transparent mb-0'>
                <div className='i-card-header'>
                  <div className='i-card-title'>Escalations - Program Wise</div>
                </div>
                <div className='i-card-body'>
                  <ul className='program_list'>
                    {escalationData &&
                      projectOptions.filter((res) => res.accountName == accountName).map((item, index) => {
                        return (
                          <li>
                            <div className='card_border_skyblue' onClick={() => window.open("EscalationsProgramDetail.aspx" + "?accountName=" + accountName + "&ProjectName=" + item.key, "_self")}>
                              <div className='header_card'>
                                <div className='title'>{item.key}</div>
                              </div>
                              <div className='body_card'>
                                <div className='title_value'>{this.filteredEscalations()?.filter((x) => x.ProjectName == item.key).length}</div>
                              </div>
                            </div>
                          </li>
                        )
                      })
                    }

                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='i-row'>
            <div className='i-col-4'>
              <div className='i-chart-card'>
                <div className='i-card-header'>
                  <div className='i-card-title'>Escalations - Status Wise</div>
                </div>
                <div className='i-card-body'>
                  <Piechart data={this.escalationStatusWise(this.filteredEscalations(), statusOptions)} />
                </div>
              </div>
            </div>
            <div className='i-col-4'>
              <div className='i-chart-card'>
                <div className='i-card-header'>
                  <div className='i-card-title'>Escalations - BU Wise</div>
                </div>
                <div className='i-card-body'>
                  <Piechart data={this.escalationsBuWise(this.filteredEscalations(), BUOptions)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {addPopup && (
          <Layer>
            <Popup
              className={addUpdatesPopupStyles.root}
              role="dialog"
              aria-modal="true"
              onDismiss={() => this.setState({ addPopup: false })}
            >
              <Overlay onClick={() => this.setState({ addPopup: false })} />
              <FocusTrapZone>
                <div role="document" className={`modalPopup ${addUpdatesPopupStyles.content}`}>
                  <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                    <Text className={styles.modalPopupTitle}>Add Escalations</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleCancelPopup()} />
                  </Stack>
                  <div className={styles.modalContent}>
                    <Stack {...columnProps} className={styles.formChildGap}>
                      <div className='i-row'>
                        <div className='i-col-12 i-mb-13'>
                          <Dropdown
                            label='Program/Project'
                            placeholder='Select Program/Project'
                            options={projectOptions.filter((x) => x.accountName == accountName)}
                            selectedKey={escalationFormFields.ProjectName}
                            onChange={(e, option) => this.handleFormChange("ProjectName", option?.key)}
                            styles={dropdownStyles}
                            className='droupdown'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !escalationFormFields.ProjectName
                                ? "Program/Project is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                          <Dropdown
                            label='BU'
                            placeholder='Select BU'
                            options={BUOptions}
                            styles={dropdownStyles}
                            selectedKey={escalationFormFields.BU}
                            onChange={(ev, option) => this.handleFormChange("BU", option?.key)}
                            className='droupdown'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !escalationFormFields.BU
                                ? "BU is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                          <TextField
                            label='Escalated By'
                            placeholder='Select Escalated By'
                            styles={textFieldProps}
                            value={escalationFormFields.EscalatedBy}
                            onChange={(ev, value) => this.handleFormChange("EscalatedBy", value)}
                            className='Sachin Singla'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !escalationFormFields.EscalatedBy
                                ? "Escalated By is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                          <Dropdown
                            label='Status'
                            placeholder='Select Status'
                            options={statusOptions}
                            styles={dropdownStyles}
                            selectedKey={escalationFormFields.Status}
                            onChange={(ev, option) => this.handleFormChange("Status", option?.key)}
                            className='droupdown'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !escalationFormFields.Status
                                ? "Status is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <TextField
                            label="Description"
                            placeholder='Select Description'
                            value={escalationFormFields.Description}
                            onChange={(ev, value) => this.handleFormChange("Description", value)}
                            styles={textFieldParagraphProps} multiline
                            rows={5} />
                        </div>
                        <div className='i-col-12'>
                          <TextField
                            label="Remarks"
                            value={escalationFormFields.Remarks}
                            onChange={(ev, value) => this.handleFormChange("Remarks", value)}
                            styles={textFieldProps} placeholder="Enter Remarks" multiline
                            rows={5} />
                        </div>
                      </div>
                      <div className='d-flex justify-right i-gap-10'>
                        <DefaultButton className='btn-outline'
                          text="Cancel" onClick={() => this.handleCancelPopup()}></DefaultButton>
                        <DefaultButton className='btn-primary'
                          onClick={() => this.handleSave()}
                          text="Add" ></DefaultButton>
                      </div>
                    </Stack>
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
