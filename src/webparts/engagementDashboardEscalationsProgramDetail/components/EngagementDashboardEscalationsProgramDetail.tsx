import * as React from 'react';
import styles from './EngagementDashboardEscalationsProgramDetail.module.scss';
import type { IEngagementDashboardEscalationsProgramDetailProps } from './IEngagementDashboardEscalationsProgramDetailProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IButtonStyles, Layer, Popup, Overlay, FocusTrapZone, TextField, mergeStyleSets, IStackProps, ITextFieldStyles, Dialog, DialogFooter, DialogType } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import { EDServices } from '../../../services/EDServices';
import { cloneDeep, groupBy } from '@microsoft/sp-lodash-subset';
import moment from 'moment';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import toast, { Toaster } from 'react-hot-toast';

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
  Remarks: string;
}
export interface IFilters {
  ProjectName: string;
  dateRange: any;
  searchText: string;
  applied: boolean;
}

export interface IEiAccountDashboardProgramState {
  accountName: string;
  projectName: string;
  accountOption: Array<any>,
  projectOptions: Array<any>,
  statusOptions: Array<any>,
  BUOptions: Array<any>,
  escalationData: Array<any>,
  escalationFormFields: IEscalationFormFields,
  showFilterPopup: boolean;
  addPopup: boolean;
  filters: IFilters;
  selectedData: Array<any>;
  isTouched: boolean,
  hideDialog: boolean,
  deleteItemId: number,
}

const url = new URL(window.location.href);
const accountName = url.searchParams.get("accountName");
const projectName = url.searchParams.get("ProjectName");

export default class EiAccountsTilesDetails extends React.Component<IEngagementDashboardEscalationsProgramDetailProps, IEiAccountDashboardProgramState, {}> {
  spServices: EDServices;

  constructor(props: IEngagementDashboardEscalationsProgramDetailProps) {
    super(props);
    this.spServices = new EDServices(props.context);

    this.state = {
      accountName: accountName ? accountName : "",
      projectName: projectName ? projectName : "",
      accountOption: [],
      projectOptions: [],
      statusOptions: [],
      BUOptions: [],
      escalationData: [],
      escalationFormFields: this.getFormFields(),
      showFilterPopup: false,
      addPopup: false,
      selectedData: [],
      filters: {
        dateRange: "",
        ProjectName: "",
        searchText: "",
        applied: false
      },
      isTouched: false,
      hideDialog: false,
      deleteItemId: 0,
    };
  }

  async componentDidMount() {
    await this.screenInit();
  }

  private getFormFields(): IEscalationFormFields {
    return {
      AccountName: accountName ? accountName : "",
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
    const escalationData = await this.spServices.getListDataWithFilter(this.props.listName, `AccountName eq '${accountName}' and ProjectName eq '${projectName}'`);
    const statusChoices = await this.spServices.getFieldsByListName(this.props.listName, "Status");
    const statusOptions = statusChoices.Choices.map((x: any) => { return { key: x, text: x } })
    const BUChoices = await this.spServices.getFieldsByListName(this.props.listName, "BU");
    const BUOptions = BUChoices.Choices.map((x: any) => { return { key: x, text: x } })

    debugger;
    const groupByAccount = groupBy(data.data, "clientName"); // call the API for getting the data of account and project
    const accountOption = Object.keys(groupByAccount).slice(0, 25).map((x) => { return { key: x, text: x, data: groupByAccount[x] } });
    this.setState({
      accountOption: accountOption,
      projectOptions: data.data.map((x: any) => { return { key: x.projectName, text: x.projectName, accountName: x.clientName } }),
      statusOptions: statusOptions,
      BUOptions: BUOptions,
      escalationData: escalationData,
    });
  }

  navigateToPreviousPage = () => {
    window.location.href = 'Engagement_Dashboard.aspx' + "?accountName=" + accountName;
  };

  //filtering escalatiion data
  private filteredEsacalation() {
    const { filters } = this.state;
    let data = cloneDeep(this.state.escalationData);

    if (filters.searchText) {
      const searchText = filters.searchText.toLocaleLowerCase();
      data = data.filter((x) => {
        return (x.ProjectName && x.ProjectName.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.EscalationDate && x.EscalationDate.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.EscalatedBy && x.EscalatedBy.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.BU && x.BU.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Description && x.Description.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Remarks && x.Remarks.toLocaleLowerCase().indexOf(searchText) > -1)
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

  private handleFormChange(fieldName: string, value: any) {
    this.setState({
      escalationFormFields: {
        ...this.state.escalationFormFields,
        [fieldName]: value
      }
    })
  }

  private getColorForStatus(key: any) {
    switch (key) {
      case "Open":
        return styles.statusCircleGreen
      case "In Progress":
        return styles.statusCircleRed
      case "Resolved":
        return styles.statusCircleGray
      case "Closed":
        return styles.statusCircleGreen
    }
  }

  private async handleUpdate() {
    if (this.state.escalationFormFields.ProjectName && this.state.escalationFormFields.BU && this.state.escalationFormFields.EscalatedBy && this.state.escalationFormFields.Status) {
      const data = this.state.escalationFormFields;
      const Id = data.Id ? data.Id : 0;
      let obj: any = {
        EscalatedBy: data.EscalatedBy,
        BU: data.BU,
        Status: data.Status,
        Description: data.Description,
        Remarks: data.Remarks
      };
      this.spServices.updateItem(this.props.listName, Id, obj).then(async (res) => {
        this.setState({
          escalationFormFields: this.getFormFields(),
          addPopup: false,
          isTouched: false,
        });
        await this.screenInit();
        toast.success("Escalation data update successfully.");
      }).catch((err) => console.log(err));
    }
  }

  private handleCancelPopup() {
    this.setState({
      addPopup: false,
      escalationFormFields: this.getFormFields(),
      isTouched: false,
    })
  }

  // private handleEditRisks() {
  //   if (this.state.selectedData.length === 1) {
  //     this.setState({
  //       addPopup: true,
  //       escalationFormFields: this.state.selectedData[0]
  //     });
  //   } else {
  //     toast('Please select at least one item to edit');
  //   }
  // }

  private handleDeleteMultipleRow() {
    console.log('handleDeleteRow called...');

    if (this.state.selectedData.length > 0) {
      this.setState({ hideDialog: true })
    } else {
      // No selected rows, handle accordingly
      console.log("No rows selected to delete.");
      toast.error("Please select at least one item to delete.");
    }
  }


  private CheckboxBodyTemplate(value: any) {
    this.setState({
      selectedData: value
    });
  }

  private downloadExcel() {
    if (this.filteredEsacalation().length > 0) {
      const fileName = "EscalationDashboardData";
      let excelData = this.filteredEsacalation().map((obj: IEscalationFormFields) => {
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
      });
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

  private actionBodyTemplate(item: any) {
    let actionItem = item;
    return (
      <React.Fragment>
        <FontIcon aria-label="edit" iconName="EditSolid12"
          className={styles.editIcon}
          onClick={() => {
            this.setState({
              addPopup: true,
              escalationFormFields: actionItem
            });
          }} />
        <FontIcon aria-label="delete"
          iconName="delete"
          onClick={() => this.handleDeleteRow(item.Id)}
          className={styles.deleteIcon} />
      </React.Fragment>
    );
  }

  private async handleDeleteEscalation(selectedData: any[], deleteItemId: number) {
    console.log("Selected rows to delete :: ", selectedData);
    console.log("Escalation id to delete :: ", deleteItemId);

    let isdeleted = false;
    try {
      if (selectedData.length > 0) {
        // Iterate over each selected row and delete the corresponding item
        await Promise.all(selectedData.map(async (row: any) => {
          isdeleted = await this.spServices.deleteItem(this.props.listName, row.ID);
        }));
      } else if (deleteItemId != 0 || deleteItemId != null) {
        isdeleted = await this.spServices.deleteItem(this.props.listName, deleteItemId);
      }

      if (isdeleted) {
        this.setState({
          escalationFormFields: this.getFormFields(),
          addPopup: false,
          hideDialog: false,
        });
        await this.screenInit();
        toast.success("Escalation data deleted successfully.");
      } else {
        console.error("Error Deleting Escalation details");
        toast.error("Something went wrong!");
      }

    } catch (error) {
      console.error("Error Deleting selected rows:", error);
      toast.error("Something went wrong!");
    }

  }

  handleDeleteRow = (itemId: any) => {
    this.setState({
      hideDialog: true,
      deleteItemId: itemId,
    })
  }

  dialogContentProps = {
    type: DialogType.normal,
    title: "Confirmation",
    subText: "Are you sure you want to delete this data?",
  };

  handleTextFieldBlur = () => {
    this.setState({ isTouched: true });
  }

  public render(): React.ReactElement<IEngagementDashboardEscalationsProgramDetailProps> {

    const { showFilterPopup, addPopup, BUOptions, accountOption, statusOptions, projectOptions, escalationFormFields } = this.state;

    const escalationDate = (item: any) => {
      return (item.EscalationDate ? moment(item.EscalationDate).format("DD/MM/YYYY") : "");
    };

    const statusBodyTemplate = (item: any) => {
      return (
        <FontIcon aria-label="status" iconName="StatusCircleInner" className={this.getColorForStatus(item.Status)} />
      );
    };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF' }
    };

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: '20px 0 0' }
    }

    const columnProps: Partial<IStackProps> = {
      tokens: { childrenGap: 15 },
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

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <div>
          <ul className='breadcrumb'>
            <li>
              <a href='javascript:void(0)' onClick={this.navigateToPreviousPage}>engagement dashboard</a>
            </li>
            <li>
              <a href={"Escalations.aspx?accountName=" + accountName} >{accountName}-escalations</a></li>
            <li>{projectName}</li>
          </ul>
        </div>
        <section className="accountOverviewSection ">
          <div className='blockTitleWrap i-mb-20'>
            <div className='titleWrap'>
              <SearchBox placeholder="Search"
                value={this.state.filters.searchText}
                onChange={(ev, value) => this.handleFilterChange("searchText", value)}
                styles={searchBoxStyles} className='searchBar' />
            </div>
            <div className='rightbar'>
              <span>
                <DefaultButton text="Delete" className='btn-outline'
                  onClick={() => this.handleDeleteMultipleRow()}></DefaultButton>
              </span>
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
              {/* Commented below edit button based on discussion with hardik vyas */}
              {/* <span>
                <DefaultButton text="Edit" className='btn-outline'
                  onClick={() => this.handleEditRisks()}></DefaultButton>
              </span> */}
              <span>
                <PrimaryButton text="Download" className='btn-primary' onClick={() => this.downloadExcel()}></PrimaryButton>
              </span>
            </div>
          </div>
          <div className='datatable-wrapper'>
            <DataTable value={this.filteredEsacalation()} selection={this.state.selectedData} scrollable onSelectionChange={(e) => this.CheckboxBodyTemplate(e.value)} dataKey='Id'>
              <Column field="Checkbox" selectionMode="multiple" style={{ minWidth: '10px' }} className={styles.Checkbox} />
              <Column field="Status" header="Status" filter style={{ minWidth: '90px' }} align='center' body={statusBodyTemplate}></Column>
              <Column field="EscalationDate" header="Escalation Date" style={{ minWidth: '170px' }} body={escalationDate}></Column>
              <Column field="EscalatedBy" header="Escalated By" filter style={{ minWidth: '215px' }} ></Column>
              <Column field="BU" header="BU" filter style={{ minWidth: '135px' }}></Column>
              <Column field="ProjectName" header="Program/Project" filter style={{ minWidth: '145px' }} ></Column>
              <Column field="Description" header="Description" filter style={{ minWidth: '190px' }}></Column>
              <Column field="Remarks" header="Remarks" filter style={{ minWidth: '190px' }}></Column>
              <Column header="Actions" body={(item: any, column: any) => this.actionBodyTemplate(item)} exportable={false} style={{ minWidth: '40px' }} frozen alignFrozen='right'></Column>
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
              onClick={() => this.handleDeleteEscalation(this.state.selectedData, this.state.deleteItemId)}
              text="Delete"
            />
            {/* Cancel */}
            <DefaultButton
              onClick={() => this.setState({ hideDialog: false })}
              text="Cancel"
            />
          </DialogFooter>
        </Dialog>

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
                    <Text className={styles.modalPopupTitle}>Edit Escalations</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleCancelPopup()} />
                  </Stack>
                  <div className={styles.modalContent}>
                    <Stack {...columnProps} className={styles.formChildGap}>
                      <div className='i-row'>
                        <div className='i-col-12 i-mb-13'>
                          <Dropdown
                            label='Program/Project'
                            placeholder='Select Program/Project'
                            selectedKey={escalationFormFields.ProjectName}
                            disabled
                            options={projectOptions.filter((x) => x.accountName == accountName)}
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
                            value={escalationFormFields.Description}
                            onChange={(ev, value) => this.handleFormChange("Description", value)}
                            styles={textFieldParagraphProps} placeholder="Enter Description" multiline
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
                        <DefaultButton className='btn-outline' text="Cancel" onClick={() => this.handleCancelPopup()}></DefaultButton>
                        <DefaultButton className='btn-primary' text="Update" onClick={() => this.handleUpdate()}></DefaultButton>
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
