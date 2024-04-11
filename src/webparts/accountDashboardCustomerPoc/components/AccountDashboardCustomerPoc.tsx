import * as React from 'react';
import styles from './AccountDashboardCustomerPoc.module.scss';
import type { IAccountDashboardCustomerPocProps } from './IAccountDashboardCustomerPocProps';
import { SearchBox, ISearchBoxStyles, DefaultButton, PrimaryButton, Link, FontIcon, Dropdown, Stack, Text, IDropdownStyles, IButtonStyles, Layer, Popup, mergeStyleSets, Overlay, FocusTrapZone, IStackProps, Image, TextField, ITextFieldStyles, IDropdownOption } from '@fluentui/react';
import '../../common.css';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import { EDServices } from '../../../services/EDServices';
import moment from 'moment';
import * as XLSX from "xlsx";
import { Toaster, toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { cloneDeep, groupBy } from 'lodash';

const jsonData = require("../../../SampleData/projectData.json");

export interface IFilters {
  AccountName: string;
  ProjectName: string;
  dateRange: any;
  searchText: string;
  applied: boolean;
}

export interface IAccountDashboardCustomerPocState {
  customerPOCData: any;
  editPopup: boolean;
  showFilterPopup: boolean;
  filters: IFilters;
  editCustomerField: any;
  selectedData: Array<any>;
  accountOptions: Array<any>;
  projectOptions: Array<any>;
  profileErrorMsg: any;
  profileUrl: any;
  profile: any;
  isTouched: boolean;
  // selectedkeyreportto: string;
}

export default class EiAccountsTilesDetails extends React.Component<IAccountDashboardCustomerPocProps, IAccountDashboardCustomerPocState, {}> {
  spServices: EDServices;

  constructor(props: IAccountDashboardCustomerPocProps) {
    super(props);
    this.spServices = new EDServices(props.context);

    this.state = {
      editPopup: false,
      showFilterPopup: false,
      customerPOCData: [],
      accountOptions: [],
      projectOptions: [],
      selectedData: [],
      profile: null,
      profileUrl: null,
      editCustomerField: null,
      profileErrorMsg: null,
      isTouched: false,
      filters: {
        AccountName: "",
        dateRange: "",
        ProjectName: "",
        searchText: "",
        applied: false
      },
    };

    this.screenInit();
  }

  private handleEdit() {
    if (this.state.selectedData.length === 1) {
      const item = this.state.selectedData[0];
      this.setState({
        editPopup: true,
        editCustomerField: item
      });
      if (this.state.selectedData[0].Profile != null) {
        const url = window.location.origin + this.state.selectedData[0].Profile;
        this.setState({ profileUrl: url })
      }
    } else {
      toast('select one record for Edit.');
    }
  }


  private async screenInit() {
    const stackholderData = await this.spServices.getListDataWithFilter(this.props.accountStackHolderListName,"Project ne null");

    const groupByAccount = groupBy(jsonData.data, "clientName"); // call the API for getting the data of account and project
    const accountOption = Object.keys(groupByAccount).slice(0, 25).map((x) => { return { key: x, text: x, data: groupByAccount[x] } });

    console.log(stackholderData);
    this.setState({
      accountOptions: accountOption,
      customerPOCData: stackholderData,
      projectOptions: jsonData.data.map((x: any) => { return { key: x.projectName, text: x.projectName, accountName: x.clientName } }),
    })
  }

  private getFilteredData() {
    const { filters } = this.state;
    let data = cloneDeep(this.state.customerPOCData);

    if (filters.searchText) {
      const searchText = filters.searchText.toLocaleLowerCase();
      data = data.filter((x: any) => {
        return (x.Account_Name && x.Account_Name.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Project && x.Project.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.RelationwithEIC && x.RelationwithEIC.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.FullName && x.FullName.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Designation && x.Designation.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.BusinessUnit && x.BusinessUnit.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Contact && x.Contact.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.Email && x.Email.toLocaleLowerCase().indexOf(searchText) > -1)
          || (x.LinkedInID && x.LinkedInID.toLocaleLowerCase().indexOf(searchText) > -1)
      });
    }
    if (filters.applied) {
      if (filters.AccountName) {
        data = data.filter((x: any) => x.Account_Name == filters.AccountName);
      }
      if (filters.ProjectName) {
        data = data.filter((x: any) => x.Project == filters.ProjectName);
      }
      if (filters.dateRange) {
        let startDate = filters.dateRange[0];
        let endDate = filters.dateRange[1];
        startDate = startDate && moment(startDate).startOf('day');
        endDate = endDate && moment(endDate).endOf('day');
        data = data.filter((x: any) => {
          const itemDate = moment(x.Created);
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
      const fileName = "CustomerPOCs";
      let excelData = this.getFilteredData().map((obj: any) => {
        return {
          "Account": obj.Account_Name,
          "Programs/Projects": obj.Project,
          "Relationship Level": obj.RelationwithEIC,
          "Name": obj.FullName,
          "Job Title": obj.Designation,
          "Division": obj.BusinessUnit,
          "Contact No.": obj.Contact,
          "Email": obj.Email,
          "Linkdin ID": obj.LinkedInID
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

  private CheckboxBodyTemplate(value: any) {
    this.setState({
      selectedData: value
    });
  }

  handleEditCustomer = (fieldName: any, value: any) => {
    this.setState({
      editCustomerField: {
        ...this.state.editCustomerField,
        [fieldName]: value,
      },
    },()=> {console.log(this.state.editCustomerField) });
  };

  private async updatecustomerstackholders(): Promise<void> {
    const updatecustomerstackholders: any = this.state.editCustomerField;
    console.log("saveOrUpdatecustomerstackholders :: ", updatecustomerstackholders);

    if (this.state.profileUrl != null) {
      const issaved = this.spServices.updateStackHolder(this.props.accountStackHolderListName, updatecustomerstackholders, this.state.profile);

      if (await issaved) {
        this.setState({
          editPopup: false,
          editCustomerField: null
        });
        this.screenInit();
        toast.success("Customer Stakeholder details updated successfully.");
      } else {
        console.error("Error updating Customer stackholders details");
      }
    }
  }


  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard" + sourceParam;
  };

  public render(): React.ReactElement<IAccountDashboardCustomerPocProps> {
    const { showFilterPopup, filters, editPopup } = this.state;

    const textFieldProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: "Poppins" },
      fieldGroup: { height: 40, border: "1px solid #D7DADE", color: "#D7DADE" },
    };

    const linkedInBodyTemplate = (item: any) => {
      return (
        <React.Fragment>
          <Link className='p-Link columnWrap230'>{item.LinkedInID}</Link>
        </React.Fragment>
      );
    };

    const handleChange = (e: any) => {
      console.log('profile :: ', e.target.files[0])
      const fileURL = URL.createObjectURL(e.target.files[0]);
      console.log('fileURL :: ', fileURL);
      this.setState({
        profileUrl: fileURL,
        profile: e.target.files[0],
        profileErrorMsg: null
      });
    }

    const handleTextFieldBlur = () => {
      this.setState({ isTouched: true });

      if (this.state.profileUrl === null) {
        this.setState({ profileErrorMsg: 'Profile is required.' });
      }
    };

    const getEISColor = (RelationwithEIC: string) => {
      switch (RelationwithEIC) {
        case "Favourable":
          return "favourable";
        case "Neutral":
          return "neutral";
        case "Unfavourable":
          return "unfavourable";
        case "Need to Establish":
          return "needtoestablish";
      }
    }

    const relationShipBodyTemplate = (item: any) => {
      return (
        <span className={`customerPocRelation ${getEISColor(item.RelationwithEIC)}`}>{item.RelationwithEIC}</span>
      );
    };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF' }
    };

    const columnProps: Partial<IStackProps> = {
      tokens: { childrenGap: 15 },
    };

    const customerStakeholdersUserBodyTemplate = (rowData: any) => {
      return (
        <React.Fragment>
          <div className={styles.csName}>
            <img className={styles.csTableImage} src={`https://aixtor.sharepoint.com${rowData.Profile != null
              ? rowData.Profile
              : "/sites/InfoHub360/SiteAssets/Lists/d37a6df1-e19a-4583-86a7-e80d35496408/vijay.png"
              }`} />
            <span>{rowData.FullName}</span>
          </div>
        </React.Fragment>
      );
    };

    const optionsCustomerStakeholders: IDropdownOption[] = [
      { key: "Need to Establish", text: "Need to Establish" },
      { key: "Favourable", text: "Favourable" },
      { key: "Unfavourable", text: "Unfavourable" },
      { key: "Neutral", text: "Neutral" },
    ];

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
        maxWidth: "360px",
        width: "100%",
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: 2,
      },
    });

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: "20px 0 0 10px", float: "right" }
    }

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };
    const uploadProfileImage = require("../assets/Union.png");


    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <div>
          <ul className='breadcrumb'>
            <li>
              <a onClick={this.navigateToPreviousPage}>account dashboard</a>
            </li>
            <li>customer pocs</li>
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
              <span className='popupFilterContainer'>
                <DefaultButton text="Filter" className='btn-outline'
                  onClick={() => this.setState({ showFilterPopup: true })}></DefaultButton>
                {showFilterPopup && (
                  <div role="document" className='popupFilterWrap'>
                    <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={'modalPopupHeader'}>
                      <Text className='modalPopupTitle'>Filters</Text>
                      <FontIcon aria-label="Compass" iconName="Cancel" className='popupCancelicon'
                        onClick={() => this.setState({ showFilterPopup: false })} />
                    </Stack>
                    <div className='modalContent'>
                      <Stack className='formChildGap'>
                        <Dropdown
                          label='Account'
                          placeholder="All"
                          selectedKey={filters.AccountName}
                          options={this.state.accountOptions}
                          onChange={(ev, option) => this.handleFilterChange("AccountName", option?.key)}
                          styles={dropdownStyles}
                          className='droupdown'
                        />
                        <Dropdown
                          label='Programs/Projects'
                          placeholder="All"
                          selectedKey={this.state.filters.ProjectName}
                          disabled={!filters.AccountName}
                          options={this.state.projectOptions.filter((x) => x.accountName == filters.AccountName)}
                          onChange={(ev, option) => this.handleFilterChange("ProjectName", option?.key)}
                          styles={dropdownStyles}
                          className='droupdown'
                        />
                        {/* <Dropdown
                          label='BU'
                          placeholder="All"
                          options={buOptions}
                          styles={dropdownStyles}
                          className='droupdown'
                        /> */}
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
                          styles={modalButton} text="Reset"
                          onClick={() => this.setState({ filters: { AccountName: "", dateRange: "", ProjectName: "", searchText: "", applied: false } })}></DefaultButton>
                        <DefaultButton className='btn-ghost' styles={modalButton}
                          text="Apply" onClick={() => this.handleFilterChange("applied", true)}></DefaultButton>
                      </Stack>
                    </div>
                  </div>
                )}
              </span>
              <span>
                <DefaultButton text='Edit' className='btn-outline' onClick={() => this.handleEdit()} ></DefaultButton>
              </span>
              <span>
                <PrimaryButton text="Download" className='btn-primary' onClick={() => this.downloadExcel()}></PrimaryButton>
              </span>
            </div>
          </div>
          <div className='datatable-wrapper'>
            <DataTable value={this.getFilteredData()} selection={this.state.selectedData} scrollable onSelectionChange={(e) => this.CheckboxBodyTemplate(e.value)} dataKey='Id'>
              <Column field="Checkbox" selectionMode="multiple" style={{ minWidth: '10px' }} className={styles.Checkbox} />
              <Column field="FullName" header="Full Name" filter style={{ minWidth: '220px' }} body={customerStakeholdersUserBodyTemplate}></Column>
              <Column field="Account_Name" header="Account" filter style={{ minWidth: '220px' }} ></Column>
              <Column field="Project" header="Programs/Projects" filter style={{ minWidth: '220px' }} ></Column>
              {/* <Column field="Account_Name" header="Account" filter style={{ minWidth: '200px' }} body={accountNameBodyTemplate}></Column> */}
              {/* <Column field="Project" header="Programs/Projects" filter style={{ minWidth: '205px' }} body={programBodyTemplate}></Column> */}
              <Column field="RelationwithEIC" header="Relationship Level" filter style={{ minWidth: '170px' }} body={relationShipBodyTemplate}></Column>
              <Column field="Designation" header="Job Title" filter style={{ minWidth: '220px' }} ></Column>
              <Column field="BusinessUnit" header="Division" filter style={{ minWidth: '150px' }} ></Column>
              <Column field="Contact" header="Contact No." filter style={{ minWidth: '150px' }} ></Column>
              <Column field="Email" header="Email" filter style={{ minWidth: '200px' }} ></Column>
              <Column field="LinkedInID" header="Linkedin ID" filter style={{ minWidth: '250px' }} body={linkedInBodyTemplate} ></Column>
            </DataTable>
          </div>
          {editPopup && (
            <Layer>
              <Popup
                className={addUpdatesPopupStyles.root}
                role="dialog"
                aria-modal="true"
                onDismiss={() => this.setState({ editPopup: false })}
              >
                <Overlay
                  onClick={() => this.setState({ editPopup: false })}
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
                        Add Customer Stakeholder
                      </Text>
                      <FontIcon
                        aria-label="Compass"
                        iconName="Cancel"
                        className={styles.iconStyle}
                        onClick={() =>
                          this.setState({ editPopup: false })
                        }
                      />
                    </Stack>
                    <div className={styles.modalContent}>
                      <Stack {...columnProps} className='formChildGap'>
                        <div className='profileUploader'>
                          <div className='profile'>
                            <Image alt='Profile' src={this.state.profileUrl != null ? this.state.profileUrl : uploadProfileImage} />
                            <div>
                              {this.state.profileErrorMsg && (
                                <p style={{ color: "#A4262C", fontSize: "12px", fontWeight: 400 }}>
                                  {this.state.profileErrorMsg}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className='uploadButton'>
                            <label htmlFor="img" aria-required={true}><span> Upload </span></label>
                            <input type="file" id="img" accept="image/*" onChange={handleChange} hidden />
                          </div>
                        </div>
                        <TextField
                          label="Full Name"
                          styles={textFieldProps}
                          placeholder="Full Name"
                          value={this.state.editCustomerField.FullName}
                          onChange={(event, value) => this.handleEditCustomer("FullName", value)}
                          onBlur={handleTextFieldBlur}
                          errorMessage={
                            this.state.isTouched &&
                              !this.state.editCustomerField
                                .FullName
                              ? "Full Name is required."
                              : ""
                          }
                          required={true}
                        />

                        <TextField
                          label="Designation"
                          styles={textFieldProps}
                          placeholder="Designation"
                          value={this.state.editCustomerField.Designation}
                          onChange={(event, value) =>
                            this.handleEditCustomer("Designation",
                              value
                            )
                          }
                          onBlur={handleTextFieldBlur}
                          errorMessage={
                            this.state.isTouched &&
                              !this.state.editCustomerField
                                .Designation
                              ? "Designation is required."
                              : ""
                          }
                          required={true}
                        />

                        <TextField
                          label="Email"
                          styles={textFieldProps}
                          placeholder="Email"
                          value={
                            this.state.editCustomerField.Email
                          }
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "Email",
                              value
                            )
                          }
                        />

                        <TextField
                          label="LinkedIn ID"
                          styles={textFieldProps}
                          placeholder="LinkedIn ID"
                          value={
                            this.state.editCustomerField
                              .LinkedInID
                          }
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "LinkedInID",
                              value
                            )
                          }
                        />

                        <Dropdown
                          label="Relation with EIC"
                          placeholder="Select Relation with EIC"
                          selectedKey={this.state.editCustomerField.RelationwithEIC}
                          options={optionsCustomerStakeholders}
                          styles={dropdownStyles}
                          className="droupdown"
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "RelationwithEIC",
                              value?.text
                            )
                          }
                          onBlur={handleTextFieldBlur}
                          errorMessage={
                            this.state.isTouched &&
                              !this.state.editCustomerField
                              ? "Relation with EIC is required."
                              : ""
                          }
                          required={true}
                        />
                        <Dropdown
                          label="Programs"
                          placeholder="Select Program"
                          selectedKey={this.state.editCustomerField.Project}
                          options={this.state.projectOptions.filter((x: any) => x.accountName === this.state.editCustomerField.Account_Name)}
                          styles={dropdownStyles}
                          className="droupdown"
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "Project",
                              value?.text
                            )
                          }
                        />
                        <TextField
                          label="Division"
                          styles={textFieldProps}
                          placeholder="Entert Division"
                          value={this.state.editCustomerField.BusinessUnit}
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "BusinessUnit",
                              value
                            )
                          }
                          onBlur={handleTextFieldBlur}
                        />
                        <TextField
                          label="Contact"
                          styles={textFieldProps}
                          placeholder="Entert Contact No"
                          value={this.state.editCustomerField.Contact}
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "Contact",
                              value
                            )
                          }
                          onBlur={handleTextFieldBlur}
                        />
                        <TextField
                          label="Manager Email"
                          styles={textFieldProps}
                          placeholder="Manager Email"
                          value={
                            this.state.editCustomerField
                              .ManagerEmail
                          }
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "ManagerEmail",
                              value
                            )
                          }
                          onBlur={handleTextFieldBlur}
                        />
                        <Dropdown
                          label="Report To"
                          placeholder="Select Report To"
                          selectedKey={this.state.editCustomerField.ReportToId}
                          options={this.state.customerPOCData.map((item: any) => ({
                            key: item.ID,
                            text: item.FullName,
                          }))}
                          styles={dropdownStyles}
                          className="droupdown"
                          onChange={(event, value) =>
                            this.handleEditCustomer(
                              "ReportToId",
                              value?.key
                            )
                          }
                          onBlur={handleTextFieldBlur}
                        />
                      </Stack>
                      <DefaultButton
                        className="btn-primary"
                        text="Save"
                        styles={modalButton}
                        onClick={() => { this.updatecustomerstackholders() }}
                      ></DefaultButton>
                      <DefaultButton
                        className="btn-outline"
                        text="Cancel"
                        styles={modalButton}
                        onClick={() => {
                          this.setState({
                            editCustomerField: null,
                            editPopup: false
                          });
                        }}
                      ></DefaultButton>
                    </div>
                  </div>
                </FocusTrapZone>
              </Popup>
            </Layer>
          )}
        </section>
      </>
    );
  }
}
