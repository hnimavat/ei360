import * as React from 'react';
import styles from './EngagementDashboardRisks.module.scss';
import type { IEngagementDashboardRisksProps } from './IEngagementDashboardRisksProps';
import {
  SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton,
  FontIcon, Dropdown, Stack, Text, IDropdownStyles, IDropdownOption,
  IButtonStyles, Layer, Popup, Overlay, FocusTrapZone, TextField,
  ITextFieldStyles, mergeStyleSets, IStackProps, ChoiceGroup, IChoiceGroupOption, Dialog, DialogType, DialogFooter,
  //  Checkbox
} from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import { EDServices } from '../../../services/EDServices';
import { cloneDeep, groupBy } from '@microsoft/sp-lodash-subset';
import { Toaster, toast } from 'react-hot-toast';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import * as moment from "moment";

const data = require("../../../SampleData/projectData.json");

const url = new URL(window.location.href);
const accountName = url.searchParams.get("accountName");

export interface IFilters {
  ProjectName: string;
  dateRange: any;
  searchText: string;
  applied: boolean;
}

export interface IRiskFormField {
  AccountName: string;
  ProjectName: string;
  EnteredBy: string;
  Owner: string;
  Status: string;
  Description: string;
  Mitigation: string;
  Contingency: string;
  VisibleToPublic: boolean;
  CreatedDate?: string;
  BU: string;
  Id?: number;
}

export interface IEiAccountDashboardProgramState {
  showFilterPopup: boolean;
  addPopup: boolean;
  value: any;
  accountOption: Array<any>;
  projectOptions: Array<any>;
  statusOptions: IDropdownOption[];
  BUOptions: IDropdownOption[];
  riskData: Array<any>;
  riskFormField: IRiskFormField;
  selectedData: Array<any>;
  filters: IFilters;
  isDeletePopup: boolean;
  isTouched: boolean;
}
export default class EiAccountsTilesDetails extends React.Component<IEngagementDashboardRisksProps, IEiAccountDashboardProgramState, {}> {
  spServices: EDServices;

  constructor(props: IEngagementDashboardRisksProps) {
    super(props);
    this.spServices = new EDServices(props.context);

    this.state = {
      showFilterPopup: false,
      addPopup: false,
      value: '',
      accountOption: [],
      projectOptions: [],
      statusOptions: [],
      BUOptions: [],
      riskData: [],
      riskFormField: this.getFormField(),
      selectedData: [],
      filters: {
        dateRange: "",
        ProjectName: "",
        searchText: "",
        applied: false
      },
      isDeletePopup: true,
      isTouched: false
    };

    this.screenInit();
  }

  private async screenInit() {
    const riskData = await this.spServices.getListDataWithFilter(this.props.listName, `AccountName eq '${accountName}'`);
    const statusChoices = await this.spServices.getFieldsByListName(this.props.listName, "Status");
    const BUChoices = await this.spServices.getFieldsByListName(this.props.listName, "BU");

    const groupByAccount = groupBy(data.data, "clientName"); // call the API for getting the data of account and project
    const accountOption = Object.keys(groupByAccount).slice(0, 25).map((x) => { return { key: x, text: x, data: groupByAccount[x] } });
    this.setState({
      accountOption: accountOption,
      projectOptions: data.data.map((x: any) => { return { key: x.projectName, text: x.projectName, accountName: x.clientName } }),
      statusOptions: statusChoices.Choices.map((x: any) => { return { key: x, text: x } }),
      BUOptions: BUChoices.Choices.map((x: any) => { return { key: x, text: x } }),
      riskData: riskData
    });
    debugger;

    console.log(riskData);
  }

  private getFormField(): IRiskFormField {
    return {
      AccountName: accountName ? accountName : "",
      ProjectName: "",
      EnteredBy: "",
      Owner: "",
      Status: "",
      Description: "",
      Mitigation: "",
      Contingency: "",
      BU:"",
      VisibleToPublic: false,
    }
  }

  private handleCancelPopup() {
    this.setState({
      addPopup: false,
      riskFormField: this.getFormField()
    })
  }

  navigateToPreviousPage = () => {
    const source = url.searchParams.get("source");
    window.location.href = source + "?accountName=" + accountName;
  };

  private handleFormChange(fieldName: string, value: any) {
    this.setState({
      riskFormField: {
        ...this.state.riskFormField,
        [fieldName]: value
      }
    })
  }

  private async handleSave() {
    if(this.state.riskFormField.ProjectName && this.state.riskFormField.Owner && this.state.riskFormField.EnteredBy && this.state.riskFormField.Status && this.state.riskFormField.BU){
      let obj = this.state.riskFormField;
      if (!obj.Id) {
        obj.CreatedDate = new Date().toISOString();
        this.spServices.createItem(this.props.listName, obj).then((res) => {
          toast.success("Risk data added successfully.");
          this.setState({
            addPopup: false,
            riskFormField: this.getFormField()
          });
          this.screenInit();
        })
      } else {
        let data: IRiskFormField = {
          AccountName: obj.AccountName,
          ProjectName: obj.ProjectName,
          EnteredBy: obj.EnteredBy,
          Owner: obj.Owner,
          Status: obj.Status,
          BU:obj.BU,
          Description: obj.Description,
          Mitigation: obj.Mitigation,
          Contingency: obj.Contingency,
          VisibleToPublic: obj.VisibleToPublic,
        }
        this.spServices.updateItem(this.props.listName, obj.Id, data).then((res) => {
          toast.success("Risk data updated successfully.");
          this.setState({
            addPopup: false,
            riskFormField: this.getFormField(),
            selectedData: []
          });
          this.screenInit();
        })
      }
    }
  }

  // private handleEditRisks() {
  //   if (this.state.selectedData.length === 1) {
  //     this.setState({
  //       addPopup: true,
  //       riskFormField: this.state.selectedData[0]
  //     })
  //   } else {
  //     toast.error('Please select at least one item to edit.');
  //   }
  // }

  private async handleDeleteRisks() {
    if (this.state.selectedData.length > 0) {
      const itemId = this.state.selectedData.map((x) => x.Id);
      this.spServices.bulkDeleteItem(this.props.listName, itemId).then((res) => {
        console.log(res);
        this.setState({
          selectedData: [],
          isDeletePopup: true
        });
        toast.success("Risk data deleted successfully.");
        this.screenInit();
      });
    }
    console.log(this.state.riskFormField);
  }

  private CheckboxBodyTemplate(value: any) {
    this.setState({
      selectedData: value
    });
  }

  private getFilteredData() {
    const { filters } = this.state;
    let data = cloneDeep(this.state.riskData);

    if (filters.searchText) {
      const searchText = filters.searchText.toLocaleLowerCase();
      data = data.filter((x) => {
        return (x.ProjectName && x.ProjectName.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Owner && x.Owner.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.EnteredBy && x.EnteredBy.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Description && x.Description.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.BU && x.BU.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Mitigation && x.Mitigation.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Contingency && x.Contingency.toLocaleLowerCase().indexOf(searchText) > -1)
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
          const itemDate = moment(x.CreatedDate);
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

  private showDeletePopup() {
    const dialogContentProps = {
      type: DialogType.normal,
      title: "Confirmation",
      subText: "Are you sure you want to delete this data?",
    };

    return <Dialog
      hidden={this.state.isDeletePopup}
      dialogContentProps={dialogContentProps}>
      <DialogFooter>
        <PrimaryButton onClick={() => this.handleDeleteRisks()} text="Delete" />
        <DefaultButton onClick={() => this.setState({ isDeletePopup: true })} text="Cancel" />
      </DialogFooter>
    </Dialog>
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
    if (this.getFilteredData().length > 0) {
      const fileName = "RiskDashboardData";
      let excelData = this.getFilteredData().map((obj: any) => {
        return {
          "Programs/Projects": obj.ProjectName,
          "Entered By": obj.EnteredBy,
          "Owner": obj.Owner,
          "Status": obj.Status,
          "BU":obj.BU,
          "Created Date": obj.CreatedDate ? new Date(obj.CreatedDate).toLocaleDateString() : "",
          "Description": obj.Description,
          "Mitigation": obj.Mitigation,
          "Contingency": obj.Contingency,
          "Visible To Public": obj.VisibleToPublic ? "Yes" : "No",
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

  private actionBodyTemplate(item: any) {
    let actionItem = item;
    return (
      <React.Fragment>
        <FontIcon aria-label="edit" iconName="EditSolid12"
          className={styles.editIcon}
          onClick={() => {
            this.setState({
              addPopup: true,
              riskFormField: actionItem
            });
          }} />
        <FontIcon aria-label="delete"
          iconName="delete"
          onClick={() => this.setState({
            isDeletePopup: false,
            selectedData: [item]
          })}
          className={styles.deleteIcon} />
      </React.Fragment>
    );
  }

  handleTextFieldBlur = () => {
    this.setState({ isTouched: true });
  }

  public render(): React.ReactElement<IEngagementDashboardRisksProps> {
    const { showFilterPopup, addPopup, riskFormField } = this.state;

    const getStyleName = (status: any) => {
      switch (status) {
        case "High":
          return styles.statusCircleRed
        case "Medium":
          return styles.statusCircleYellow
        case "Low":
          return styles.statusCircleGreen
      }
    }

    const statusBodyTemplate = (item: any) => {
      return (
        <React.Fragment>
          <FontIcon aria-label="status"
            iconName="StatusCircleInner"
            className={getStyleName(item.Status)} />
        </React.Fragment>
      );
    };

    const createdDateTemplate = (item: any) => {
      return (
        <React.Fragment>
          <div>{item.CreatedDate ? new Date(item.CreatedDate).toLocaleDateString() : ""}</div>
        </React.Fragment>
      );
    }

    const visibleToPublicTemplate = (item: any) => {
      return (
        <React.Fragment>
          <div>{item.VisibleToPublic ? "Yes" : "No"}</div>
        </React.Fragment>
      );
    }

    const visibleToPublic: IChoiceGroupOption[] = [
      { key: 'Yes', text: 'Yes' },
      { key: 'No', text: 'No' },
    ];


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

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    return (
      <>
        <Toaster
          position="bottom-right"
          reverseOrder={false} />
        <div>
          <ul className='breadcrumb'>
            <li>
              <a onClick={this.navigateToPreviousPage}>engagement dashboard</a>
            </li>
            <li>{accountName} - risks</li>
          </ul>
        </div>
        <section className="accountOverviewSection ">
          <div className='blockTitleWrap i-mb-20'>
            <div className='titleWrap'>
              <SearchBox placeholder="Search"
                styles={searchBoxStyles}
                value={this.state.filters.searchText}
                onChange={(e, text: string) => this.handleFilterChange("searchText", text)}
                className='searchBar' />
            </div>
            <div className='rightbar'>
              <span>
                <DefaultButton text='Delete' className='btn-outline'
                  onClick={() => {
                    if (this.state.selectedData.length == 0) {
                      toast.error("Please select at least one item to delete.")
                    } else {
                      this.setState({ isDeletePopup: false })
                    }
                  }} ></DefaultButton>
              </span>
              {/* <span>
                <DefaultButton text='Edit' className='btn-outline' onClick={() => this.handleEditRisks()} ></DefaultButton>
              </span> */}
              <span className='popupFilterContainer'>
                <DefaultButton text="Filter"
                  className='btn-outline'
                  onClick={() => this.setState({ showFilterPopup: true, filters: { ...this.state.filters, applied: false } })}></DefaultButton>
                {showFilterPopup && (
                  <div role="document" className='popupFilterWrap'>
                    <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className='modalPopupHeader'>
                      <Text className='modalPopupTitle'>Filters</Text>
                      <FontIcon aria-label="Compass" iconName="Cancel" className='popupCancelicon'
                        onClick={() => this.handleCancelFilter()} />
                    </Stack>
                    <div className='modalContent'>
                      <Stack className='formChildGap'>
                        <Dropdown
                          label='Account'
                          placeholder='Select Account'
                          selectedKey={accountName}
                          disabled
                          options={this.state.accountOption}
                          styles={dropdownStyles}
                          className='droupdown'
                        />
                        <Dropdown
                          label='Programs/Projects'
                          placeholder="Select Programs/Projects"
                          selectedKey={this.state.filters.ProjectName}
                          options={this.state.projectOptions.filter((x) => x.accountName == accountName)}
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
                        <DefaultButton className='btn-ghost-gray' styles={modalButton} text="Reset" onClick={() => this.setState({ filters: { dateRange: "", ProjectName: "", searchText: "", applied: false } })}></DefaultButton>
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
          <div className='datatable-wrapper'>
            <DataTable value={this.getFilteredData()} selection={this.state.selectedData} scrollable onSelectionChange={(e) => this.CheckboxBodyTemplate(e.value)} dataKey='Id'>
              <Column field="Id" selectionMode="multiple" style={{ minWidth: '10px' }} className={styles.Checkbox} />
              <Column field="Status" header="Status" style={{ minWidth: '90px' }} align='center' body={statusBodyTemplate}></Column>
              <Column field="ProjectName" header="Programs/Projects" filter style={{ minWidth: '260px' }}></Column>
              <Column field="BU" header="BU" filter style={{ minWidth: '145px' }}></Column>
              <Column field="CreatedDate" header="Date" style={{ minWidth: '180px' }} body={createdDateTemplate} ></Column>
              <Column field="Owner" header="Owner" filter style={{ minWidth: '145px' }}></Column>
              <Column field="EnteredBy" header="Entered By" filter style={{ minWidth: '145px' }}></Column>
              <Column field="Description" header="Risk Description" filter style={{ minWidth: '240px' }}></Column>
              <Column field="Mitigation" header="Mitigation" filter style={{ minWidth: '240px' }}></Column>
              <Column field="Contingency" header="Contingency" filter style={{ minWidth: '240px' }}></Column>
              <Column field="VisibleToPublic" header="Visible to Public" filter style={{ minWidth: '190px' }} body={visibleToPublicTemplate}></Column>
              <Column header="Actions" body={(item: any, column: any) => this.actionBodyTemplate(item)} exportable={false} style={{ minWidth: '40px' }} align="center" frozen alignFrozen='right'></Column>
            </DataTable>
          </div>
        </section>
        {addPopup && (
          <Layer>
            <Popup
              className={addUpdatesPopupStyles.root}
              role="dialog"
              aria-modal="true"
              onDismiss={() => this.handleCancelPopup()}
            >
              <Overlay onClick={() => this.handleCancelPopup()} />
              <FocusTrapZone>
                <div role="document" className={`modalPopup ${addUpdatesPopupStyles.content}`}>
                  <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                    <Text className={styles.modalPopupTitle}>{riskFormField.Id ? "Edit" : "Add"} Risks</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleCancelPopup()} />
                  </Stack>
                  <div className={styles.modalContent}>
                    <Stack {...columnProps} className={styles.formChildGap}>
                      <div className='i-row'>
                        <div className='i-col-12 i-mb-13'>
                          <Dropdown
                            label='Program/Project'
                            placeholder='Select Project'
                            selectedKey={riskFormField.ProjectName}
                            options={this.state.projectOptions.filter((x) => x.accountName == accountName)}
                            onChange={(e, option) => this.handleFormChange("ProjectName", option?.key)}
                            styles={dropdownStyles}
                            className='droupdown'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !riskFormField.ProjectName
                                ? "Program/Project is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                          <TextField
                            label='Owner'
                            value={riskFormField.Owner}
                            onChange={(ev, value) => this.handleFormChange("Owner", value)}
                            styles={textFieldProps}
                            placeholder='Enter Owner'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !riskFormField.Owner
                                ? "Owner is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                          <TextField
                            label='Entered By'
                            value={riskFormField.EnteredBy}
                            onChange={(ev, value) => this.handleFormChange("EnteredBy", value)}
                            styles={textFieldProps}
                            placeholder='Enter Entered By'
                            className='Sachin Singla'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !riskFormField.EnteredBy
                                ? "Entered By is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                          <Dropdown
                            label='Status'
                            placeholder='Select Status'
                            options={this.state.statusOptions}
                            selectedKey={riskFormField.Status}
                            onChange={(ev, option) => this.handleFormChange("Status", option?.key)}
                            styles={dropdownStyles}
                            className='droupdown'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !riskFormField.Status
                                ? "Status is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-4 i-mb-13'>
                        <Dropdown
                            label='BU'
                            placeholder='Select BU'
                            options={this.state.BUOptions}
                            selectedKey={riskFormField.BU}
                            onChange={(ev, option) => this.handleFormChange("BU", option?.key)}
                            styles={dropdownStyles}
                            className='droupdown'
                            onBlur={this.handleTextFieldBlur}
                            errorMessage={
                              this.state.isTouched &&
                                !riskFormField.BU
                                ? "BU is required."
                                : ""
                            }
                            required={true}
                          />
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <TextField
                            label="Risk Description"
                            styles={textFieldParagraphProps}
                            value={riskFormField.Description}
                            onChange={(e, value) => this.handleFormChange("Description", value)}
                            placeholder="Enter Risk Description" 
                            multiline
                            rows={5} />
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <TextField
                            label="Mitigation"
                            value={riskFormField.Mitigation}
                            onChange={(ev, value) => this.handleFormChange("Mitigation", value)}
                            styles={textFieldProps} placeholder="Enter Mitigation" />
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <TextField
                            label="Contingency"
                            value={riskFormField.Contingency}
                            onChange={(ev, value) => this.handleFormChange("Contingency", value)}
                            styles={textFieldProps} placeholder="Enter Contingency" />
                        </div>
                        <div className='i-col-12'>
                          <ChoiceGroup
                            options={visibleToPublic}
                            label="Visible to Public"
                            selectedKey={riskFormField.VisibleToPublic ? "Yes" : "No"}
                            onChange={(a, option) => this.handleFormChange("VisibleToPublic", option?.key === "Yes")}
                            className='custom-radio-column' />
                        </div>
                      </div>
                      <div className='d-flex justify-right i-gap-10'>
                        <DefaultButton className='btn-outline' text="Cancel" onClick={() => this.handleCancelPopup()}></DefaultButton>
                        <DefaultButton className='btn-primary' text={riskFormField.Id ? "Update" : "Add"} onClick={() => this.handleSave()} ></DefaultButton>
                      </div>
                    </Stack>
                  </div>
                </div>
              </FocusTrapZone>
            </Popup>
          </Layer>
        )}
        {this.showDeletePopup()}
      </>
    );
  }
}
