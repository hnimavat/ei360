import * as React from 'react';
import styles from './EngagementDashboardStrategicGrowthPlan.module.scss';
import type { IEngagementDashboardStrategicGrowthPlanProps } from './IEngagementDashboardStrategicGrowthPlanProps';
import { DefaultButton, Text, Dropdown, FocusTrapZone, FontIcon, ISearchBoxStyles, Layer, Overlay, Popup, PrimaryButton, SearchBox, Stack, TextField, IDropdownOption, IDropdownStyles, IButtonStyles, mergeStyleSets, IStackProps, ITextFieldStyles, Checkbox, DatePicker, DialogType, Dialog, DialogFooter, Label } from '@fluentui/react';
import { Calendar } from 'primereact/calendar';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Accordion, AccordionTab } from 'primereact/accordion';
import '../../common.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../eiAccountDashboardCompetitors/components/datatableDesign.css';
import { EDServices } from '../../../services/EDServices';
import toast, { Toaster } from 'react-hot-toast';
import { cloneDeep } from '@microsoft/sp-lodash-subset';

export interface IStratagicGrowthPlanField {
  Subject: string;
  CustomerFocusArea: string;
  Strategy: string;
  Owner: string;
  OwnerId?: string;
  Id?: number;
  DueDate: any;
  Description: string;
  AccountName: string;
}

export interface IStratagicGrowthPlanActionsField {
  selfAssigned: boolean;
  AssignToId: number;
  Subject: string;
  Description: string;
  DueDate: any;
  StrategicGrowthPlanId: number;
  Status: boolean;
  Id?: number;
}

export interface EngagementDashboardStrategicGrowthPlanState {
  createPopup: boolean;
  createNewActionItemPopup: boolean;
  // closeActionItemPopup: boolean;
  value: any;
  // createdByMe
  siteUsers: Array<any>;
  stratagicGrowthPlanForm: IStratagicGrowthPlanField;
  stratagicGrowthPlanActionForm: IStratagicGrowthPlanActionsField;
  CFAOptions: IDropdownOption[];
  stratagicGrowthPlanData: Array<any>;
  stratagicGrowthPlanActionsData: Array<any>;
  isDeletePopup: IDeletePopup;
  filters: IFilter;
  isTouched: boolean
}

export interface IFilter {
  search: string;
  dateRange: any;
}

export interface IDeletePopup {
  IsShow: boolean;
  msg: string;
  popupName: string;
  itemId: number;
}

const url = new URL(window.location.href);
const accountName = url.searchParams.get("accountName");



export default class EngagementDashboardStrategicGrowthPlan extends React.Component<IEngagementDashboardStrategicGrowthPlanProps, EngagementDashboardStrategicGrowthPlanState, {}> {
  spServices: EDServices;
  private currentUserId = this.props.context.pageContext.legacyPageContext["userId"];

  constructor(props: IEngagementDashboardStrategicGrowthPlanProps) {
    super(props);
    this.spServices = new EDServices(props.context);

    this.state = {
      createPopup: false,
      createNewActionItemPopup: false,
      // closeActionItemPopup: false,
      value: '',
      // created by ap
      siteUsers: [],
      stratagicGrowthPlanForm: this.getGrowthFields(),
      stratagicGrowthPlanActionForm: this.getGrowthActionFields(),
      CFAOptions: [],
      stratagicGrowthPlanData: [],
      stratagicGrowthPlanActionsData: [],
      isDeletePopup: {
        IsShow: true,
        msg: "",
        popupName: "",
        itemId: 0
      },
      filters: {
        dateRange: null,
        search: ""
      },
      isTouched: false
    };
    // this.handleChange = this.handleChange.bind(this);

    this.screenInit();
  }

  private async screenInit() {
    const siteUsers = await this.spServices.getAllUsers(); // get all users from the current site

    const stratagicGrowthPlanData = await this.spServices.getListDataWithFilter(this.props.strategicListName, `AccountName eq '${accountName}'`);
    const stratagicGrowthPlanActionsData = await this.spServices.getListGrowthPlanAction(this.props.strategicActionsListName); 

    const CFAChoices = await this.spServices.getFieldsByListName(this.props.strategicListName, "CustomerFocusArea"); // getting the CustomerFocusArea choices
    const CFAOptions = CFAChoices.Choices.map((x: string) => { return { key: x, text: x } });

    this.setState({
      siteUsers: siteUsers,
      CFAOptions,
      stratagicGrowthPlanData,
      stratagicGrowthPlanActionsData
    });
  }

  private getGrowthFields(): IStratagicGrowthPlanField {
    return {
      AccountName: accountName ? accountName : "",
      CustomerFocusArea: "",
      Description: "",
      DueDate: null,
      Owner: "",
      Strategy: "",
      Subject: ""
    }
  }

  private getGrowthActionFields(): IStratagicGrowthPlanActionsField {
    return {
      AssignToId: this.currentUserId,
      Subject: "",
      Description: "",
      DueDate: undefined,
      StrategicGrowthPlanId: 0,
      Status: false,
      selfAssigned: true
    }
  }

  // handle Strategic Growth Plan Form
  private handleChangeGrowthFormField(fieldName: string, value: any) {
    this.setState({
      stratagicGrowthPlanForm: {
        ...this.state.stratagicGrowthPlanForm,
        [fieldName]: value
      }
    })
  }

  private handleChangeGrowthActionFormField(fieldName: string, value: any) {
    this.setState({
      stratagicGrowthPlanActionForm: {
        ...this.state.stratagicGrowthPlanActionForm,
        [fieldName]: value
      }
    }, () => {
      if (fieldName == "selfAssigned" && value) {
        const userId = this.currentUserId;
        this.handleChangeGrowthActionFormField("AssignToId", userId);
      } else if (fieldName == "selfAssigned" && !value) {
        this.handleChangeGrowthActionFormField("AssignToId", 0);
      }
    });
  }

  private handleOpenActionForm(strategic: any) {
    this.setState({
      createNewActionItemPopup: true,
      stratagicGrowthPlanForm: strategic
    })
  }

  handleChange(event: any) {
    this.setState({ value: event.target.value });
  }

  navigateToPreviousPage = () => {
    const url = new URL(window.location.href);
    const accountName = url.searchParams.get("accountName");
    const source = url.searchParams.get("source");
    window.location.href = source + "?accountName=" + accountName;
  };

  private handleSaveStrategic(saveAs?: boolean) {
    console.log(this.state.stratagicGrowthPlanForm);
    
    if(this.state.stratagicGrowthPlanForm.Subject && this.state.stratagicGrowthPlanForm.CustomerFocusArea && this.state.stratagicGrowthPlanForm.Strategy && this.state.stratagicGrowthPlanForm.DueDate){
      
      let obj: any = this.state.stratagicGrowthPlanForm;
      debugger;
      if (obj.Id) {
        const data = {
          CustomerFocusArea: obj.CustomerFocusArea,
          Description: obj.Description,
          Strategy: obj.Strategy,
          DueDate: obj.DueDate,
          Subject: obj.Subject,
        }

        this.spServices.updateItem(this.props.strategicListName, obj.Id, data).then((res) => {
          this.handleCancleGrowthPopup();
          toast.success("Growth Plan Updated Successfully.");
          this.screenInit();
          if (saveAs) {
            this.handleCreateGrowthActionSaveAs(obj);
          }
        })
      } else {
        obj["OwnerId"] = Number(obj.Owner);
        obj.DueDate = new Date(obj.DueDate).toISOString();
        delete obj.Owner;

        this.spServices.createItem(this.props.strategicListName, obj).then((res) => {
          this.handleCancleGrowthPopup();
          toast.success("Growth Plan Created Successfully.");
          this.screenInit();
          if (saveAs) {
            this.handleCreateGrowthActionSaveAs(res.data);
          }
        })
      }
    }
  }

  private handleSaveGrowthAction(saveAs?: boolean) {
    if(this.state.stratagicGrowthPlanActionForm.Subject && this.state.stratagicGrowthPlanActionForm.DueDate){

      let obj: any = this.state.stratagicGrowthPlanActionForm;
      const strategic: any = this.state.stratagicGrowthPlanForm;
      obj.StrategicGrowthPlanId = strategic.Id;
      obj.DueDate = new Date(obj.DueDate).toISOString();
      delete obj.selfAssigned;

      if (obj.Id) {
        const data = {
          AssignToId: obj.AssignToId,
          Description: obj.Description,
          DueDate: obj.DueDate,
          Status: obj.Status,
          Subject: obj.Subject,
        }
        this.spServices.updateItem(this.props.strategicActionsListName, obj.Id, data).then((res) => {
          this.handleCancelGrowthActionPopup();
          toast.success("Growth Plan Action Updated Successfully.");
          this.screenInit();
          if (saveAs) {
            this.handleCreateGrowthActionSaveAs(strategic);
          }
        })
      } else {
        this.spServices.createItem(this.props.strategicActionsListName, obj).then((res) => {
          this.handleCancelGrowthActionPopup();
          toast.success("Growth Plan Action Created Successfully.");
          this.screenInit();
          if (saveAs) {
            this.handleCreateGrowthActionSaveAs(strategic);
          }
        })
      }
    }else{
      this.setState({ isTouched: true});
    }
  }

  private async handleDeleteItem(listName: string, itemId: any) {
    this.spServices.deleteItem(listName, itemId).then((res) => {
      toast.success("data deleted successfully");
      this.setState({
        isDeletePopup: {
          IsShow: true,
          itemId: 0,
          msg: "",
          popupName: ""
        }
      });
      this.screenInit();
    });
  }

  private getSGPActionData(itemId: number) {
    const actionData = cloneDeep(this.growthActionData());

    return actionData && actionData.filter((x) => x.StrategicGrowthPlanId === itemId);
  }

  private editGrowthPlanPopup(data: any, e: any) {
    e.stopPropagation();
    this.setState({
      stratagicGrowthPlanForm: data,
      createPopup: true
    });
  }

  private getUserDetail(userId: any): any {
    return this.state.siteUsers.filter((x) => x.Id == userId)[0];
  }

  private handleCancleGrowthPopup() {
    this.setState({
      createPopup: false,
      stratagicGrowthPlanForm: this.getGrowthFields()
    });
  }

  private handleCancelGrowthActionPopup() {
    this.setState({
      createNewActionItemPopup: false,
      stratagicGrowthPlanForm: this.getGrowthFields(),
      stratagicGrowthPlanActionForm: this.getGrowthActionFields()
    })
  }

  private handleCreateGrowthActionSaveAs(stratagic: any) {
    this.setState({
      createNewActionItemPopup: true,
      stratagicGrowthPlanForm: stratagic
    })
  }

  private handleDeleteGrowthPlan(itemId: number, e: any) {
    e.stopPropagation();
    this.setState({
      isDeletePopup: {
        IsShow: false,
        msg: "Are you sure you want to delete this Growth Plan?",
        popupName: "Growth",
        itemId: itemId
      }
    });
  }

  private handleDeleteGrowthPlanAction(itemId: number) {
    this.setState({
      isDeletePopup: {
        IsShow: false,
        msg: "Are you sure you want to delete this Action?",
        popupName: "GrowthAction",
        itemId: itemId
      }
    });
  }


  private showDeletePopup() {
    const dialogContentProps = {
      type: DialogType.normal,
      title: "Confirmation",
      subText: this.state.isDeletePopup.msg,
    };

    return <Dialog
      hidden={this.state.isDeletePopup.IsShow}
      dialogContentProps={dialogContentProps}>
      <DialogFooter>
        <PrimaryButton onClick={() => {
          const listName = this.state.isDeletePopup.popupName === "Growth" ? this.props.strategicListName : this.props.strategicActionsListName;
          this.handleDeleteItem(listName, this.state.isDeletePopup.itemId);
        }} text="Yes" />
        <DefaultButton onClick={() => this.setState({ isDeletePopup: { IsShow: true, msg: "", popupName: "", itemId: 0 } })} text="No" />
      </DialogFooter>
    </Dialog>
  }


  private actionBodyTemplate(item: any, column: any, stratagic: any) {
    let actionItem = item;
    actionItem["selfAssigned"] = false;
    if (actionItem.AssignToId == this.currentUserId) {
      actionItem["selfAssigned"] = true;
    }
    return (
      <React.Fragment>
        <FontIcon aria-label="edit" iconName="EditSolid12"
          className={styles.editIcon}
          onClick={() => {
            this.setState({
              createNewActionItemPopup: true,
              stratagicGrowthPlanForm: stratagic,
              stratagicGrowthPlanActionForm: actionItem
            })
          }} />
        <FontIcon aria-label="delete"
          iconName="delete"
          onClick={() => this.handleDeleteGrowthPlanAction(item.Id)}
          className={styles.deleteIcon} />
      </React.Fragment>
    );
  };

  private getCFAOptions() {
    const stratagicGrowthPlanForm = this.state.stratagicGrowthPlanForm;
    const Options = this.state.stratagicGrowthPlanData.map((e) => e.CustomerFocusArea);
    return this.state.CFAOptions.filter((x) => !Options.includes(x.key) || (stratagicGrowthPlanForm.Id && stratagicGrowthPlanForm.CustomerFocusArea === x.key));
  }

  private handleFilterChange(fieldName: string, value: any) {
    this.setState({
      filters: {
        ...this.state.filters,
        [fieldName]: value
      }
    })
  }

  private growthData() {
    
    let data = cloneDeep(this.state.stratagicGrowthPlanData);
    const filter = this.state.filters;

    if (filter.search) {
      const searchText = filter.search.toLocaleLowerCase();
      data = data.filter((x) => {
        return (x.Description && x.Description.toLocaleLowerCase().indexOf(searchText) > -1) ||
        (x.Subject && x.Subject.toLocaleLowerCase().indexOf(searchText) > -1)
      });
    }

    return data;
  }

  private growthActionData(){
    let data = cloneDeep(this.state.stratagicGrowthPlanActionsData);
    const filter = this.state.filters;

    if (filter.dateRange) {
      // Extract the year and month from filterDate
      const filterYear = filter.dateRange.getFullYear();
      const filterMonth = filter.dateRange.getMonth();  // 0-indexed (January = 0)
      data = data.filter((dateString) => {
        const dateObj = new Date(dateString.DueDate);
        return (dateObj.getFullYear() === filterYear) && (dateObj.getMonth() === filterMonth);
      });
    }

    return data;
  }

  handleTextFieldBlur = () => {
    this.setState({ isTouched: true });
  }

  public render(): React.ReactElement<IEngagementDashboardStrategicGrowthPlanProps> {
    const { stratagicGrowthPlanForm, stratagicGrowthPlanActionForm, createPopup, createNewActionItemPopup } = this.state;

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 209 } };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF', minHeight: 25 },
      dropdownItem: { minHeight: 25 },
      dropdownItems: { padding: '7px 0' },
    };

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: '0 0 0 10px', float: 'right' }
    }
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
        borderRadius: 2
      },
    });
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

    const statusBodyTemplate = (item: any) => {
      return (
        <React.Fragment>
          <FontIcon aria-label="status" iconName="StatusCircleInner" className={!item.Status ? styles.statusCircleYellow : styles.statusCircleGreen} />
        </React.Fragment>
      );
    };

    const createdDateBodyTemplate = (rowData:any) => {
      return formatDate(rowData.Created);
  };

  const dueDateBodyTemplate= (rowData:any) => {
    debugger;
    return formatDate(rowData.DueDate);
};

    const dateFilterTemplate = (options:any) => {
      debugger;
      return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const formatDate = (value:any) => {
      return value && new Date(value).toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
    };

    return (
      <>
        <Toaster
          position="top-right" reverseOrder={false} />
        <div>
          <ul className='breadcrumb'>
            <li>
              <a onClick={this.navigateToPreviousPage}>Engagement Dashboard</a>
            </li>
            <li>{accountName} - Strategic growth plan</li>
          </ul>
        </div>
        <section className="accountOverviewSection">
          <div className='blockTitleWrap i-mb-20 align-items-end'>
            <div className='titleWrap'>
              <SearchBox
                placeholder="Search"
                styles={searchBoxStyles}
                value={this.state.filters.search}
                onChange={(ec, value) => this.handleFilterChange("search", value)}
                className='searchBar' />
            </div>
            <div className='rightbar align-items-end'>
              <span>
                <div className='ms-filter'>
                  <label htmlFor="calender">Date Range</label>
                  <Calendar id="calender" placeholder='Monthly'
                    view='month' dateFormat="mm/yy"
                    value={this.state.filters.dateRange}
                    onChange={(x) => this.handleFilterChange("dateRange", x.value)}
                    readOnlyInput />
                </div>
              </span>
              <span className='popupFilterContainer'>
                <PrimaryButton text="Create New" className='btn-primary' onClick={() => this.setState({ createPopup: true })}></PrimaryButton>
              </span>
            </div>
          </div>
          <Accordion activeIndex={0}>
            {this.state.stratagicGrowthPlanData && this.growthData().map((stratagic) => {
              return <AccordionTab
                header={
                  <div className='accordion_title justify-between'>
                    {stratagic.Subject}
                    <div className="accordianBtns">
                      <FontIcon
                        aria-label="edit" iconName="EditSolid12" className="editIcon"
                        onClick={(e) => this.editGrowthPlanPopup(stratagic, e)} />
                      <FontIcon aria-label="delete"
                        iconName="delete"
                        onClick={(e) => this.handleDeleteGrowthPlan(stratagic.Id, e)}
                        className="deleteIcon" />
                    </div>
                  </div>
                }
              >
                <div className='accordion_content'>
                  <p className="m-0">{stratagic.Description}</p>
                  <div className='blockTitleWrap i-mb-20 align-items-end'>
                    <div className='titleWrap'>
                      <div className='tableHeader'>Action Items</div>
                    </div>
                    <div className='rightbar align-items-end'>
                      <span>
                        <div className='edit_content mb-0' ><DefaultButton text="Create New Action Item" className='btn-outline'
                          onClick={() => this.handleOpenActionForm(stratagic)}></DefaultButton></div>
                      </span>
                    </div>
                  </div>
                  <div className={styles.accordionTable}>
                    <DataTable value={this.getSGPActionData(stratagic.Id)} scrollable scrollHeight="195px">
                      <Column field="Status" header="Status" style={{ minWidth: '90px' }} align='center' body={statusBodyTemplate}></Column>
                      <Column field="Subject" header="Name" filter style={{ minWidth: '200px' }} ></Column>
                      <Column field="Created" header="Created Date" filterField="Created" dataType="date" style={{ minWidth: '135px' }} body={createdDateBodyTemplate} filterElement={dateFilterTemplate}></Column>
                      <Column field="DueDate" header="Due Date" filterField="DueDate" dataType="date" style={{ minWidth: '130px' }} body={dueDateBodyTemplate} filterElement={dateFilterTemplate} ></Column>
                      <Column field="Description" header="Description" filter style={{ minWidth: '300px' }}></Column>
                      <Column field="Author.Title" header="From" filter style={{ minWidth: '200px' }} ></Column>
                      <Column field="AssignTo.Title" header="Assign To" filter style={{ minWidth: '200px' }} ></Column>
                      <Column header="Actions" body={(item: any, column: any) => this.actionBodyTemplate(item, column, stratagic)} exportable={false} style={{ minWidth: '90px' }} align="center" frozen alignFrozen='right'></Column>
                    </DataTable>
                  </div>
                </div>
              </AccordionTab>
            })}
          </Accordion>
        </section>

        {createPopup && (
          <Layer>
            <Popup
              className={addUpdatesPopupStyles.root}
              role="dialog"
              aria-modal="true"
              onDismiss={() => this.setState({ createPopup: false })}
            >
              <Overlay onClick={() => this.setState({ createPopup: false })} />
              <FocusTrapZone>
                <div role="document" className={`modalPopup ${addUpdatesPopupStyles.content}`}>
                  <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                    <Text className={styles.modalPopupTitle}>{(stratagicGrowthPlanForm.OwnerId ? "Update" : "Create New") + " Growth Plan"}</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleCancleGrowthPopup()} />
                  </Stack>
                  <div className={styles.modalContent}>
                    <Stack {...columnProps} className={styles.formChildGap}>
                      <TextField
                        label="Subject"
                        styles={textFieldProps}
                        value={stratagicGrowthPlanForm.Subject}
                        onChange={(ev, value) => this.handleChangeGrowthFormField("Subject", value)}
                        placeholder="Growth plan 1 - Growth in Data Center"
                        className='mt-0'
                        onBlur={this.handleTextFieldBlur}
                        errorMessage={
                          this.state.isTouched &&
                            !stratagicGrowthPlanForm.Subject
                            ? "Program/Project is required."
                            : ""
                        }
                        required={true} />
                      <Dropdown
                        label='Customer Focus Area'
                        placeholder='Enter Customer Focus Area'
                        options={this.getCFAOptions()}
                        selectedKey={stratagicGrowthPlanForm.CustomerFocusArea}
                        onChange={(ev, option) => this.handleChangeGrowthFormField("CustomerFocusArea", option?.key)}
                        styles={dropdownStyles}
                        className='droupdown'
                        onBlur={this.handleTextFieldBlur}
                        errorMessage={
                          this.state.isTouched &&
                            !stratagicGrowthPlanForm.CustomerFocusArea
                            ? "Customer Focus Area is required."
                            : ""
                        }
                        required={true}
                      />
                      <TextField
                        label="Strategy"
                        styles={textFieldProps}
                        value={stratagicGrowthPlanForm.Strategy}
                        onChange={(ev, value) => this.handleChangeGrowthFormField("Strategy", value)}
                        placeholder="Enter Strategy"
                        onBlur={this.handleTextFieldBlur}
                        errorMessage={
                          this.state.isTouched &&
                            !stratagicGrowthPlanForm.Strategy
                            ? "Strategy is required."
                            : ""
                        }
                        required={true} />
                      {/* <TextField
                        label="Owner"
                        styles={textFieldProps}
                        value={stratagicGrowthPlanForm.Subject}
                        onChange={(ev, value) => this.handleChangeGrowthFormField("Subject", value)}
                        placeholder="John Doe" /> */}
                      <PeoplePicker
                        context={this.props.context}
                        titleText="Owner"
                        personSelectionLimit={1}
                        searchTextLimit={2}
                        disabled={stratagicGrowthPlanForm.Id ? true : false}
                        onChange={(items: any) => {
                          const userId = items ? this.state.siteUsers.filter((x) => x.Title === items[0].text)[0].Id : null;
                          this.handleChangeGrowthFormField("Owner", userId);
                        }}
                        // showHiddenInUI={false}
                        defaultSelectedUsers={[stratagicGrowthPlanForm.OwnerId ? this.getUserDetail(stratagicGrowthPlanForm.OwnerId).UserPrincipalName : undefined]}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000}
                      />
                      <div className='ms-filter'>
                        <Label htmlFor="calender" required={true}>Due Date</Label>
                        {/* <Calendar 
                        id='calendar'
                        placeholder='Select Due Date'
                        dateFormat='dd/mm/yyyy'
                        value={stratagicGrowthPlanForm.DueDate}
                        // value={stratagicGrowthPlanForm.DueDate ? new Date(stratagicGrowthPlanForm.DueDate): null}
                        onChange={(value)=> console.log(value)}
                        readOnlyInput
                        /> */}
                        <DatePicker
                          placeholder="Select a date..."
                          ariaLabel="Select a date"
                          value={stratagicGrowthPlanForm.DueDate ? new Date(stratagicGrowthPlanForm.DueDate) : undefined}
                          formatDate={(e: any) => { return e && new Date(e).toLocaleDateString() }}
                          onSelectDate={(e: any) => this.handleChangeGrowthFormField("DueDate", e)}
                          onBlur={this.handleTextFieldBlur}
                        />
                        {this.state.isTouched &&
                          (!stratagicGrowthPlanForm.DueDate) && (
                            <div>
                              <p style={{ color: "#A4262C", fontSize: "12px", fontWeight: 400 }}>
                                Date is required.
                              </p>
                            </div>
                          )}
                      </div>
                      <TextField
                        label="Description"
                        styles={textFieldParagraphProps}
                        placeholder="Enter Description"
                        value={stratagicGrowthPlanForm.Description}
                        onChange={(x, value) => this.handleChangeGrowthFormField("Description", value)}
                        multiline rows={5} />
                      <div>
                        <DefaultButton
                          className='btn-primary'
                          text={stratagicGrowthPlanForm.Id ? "Update" : "Save"} styles={modalButton}
                          onClick={() => this.handleSaveStrategic()}
                        ></DefaultButton>
                        <DefaultButton className='btn-outline'
                          text={(stratagicGrowthPlanForm.Id ? "Update" : "Save") + " and Create Action Item"}
                          styles={modalButton}
                          onClick={() => this.handleSaveStrategic(true)}></DefaultButton>
                        <DefaultButton className='btn-outline'
                          text="Cancel" styles={modalButton}
                          onClick={() => this.handleCancleGrowthPopup()}></DefaultButton>
                      </div>
                    </Stack>
                  </div>
                </div>
              </FocusTrapZone>
            </Popup>
          </Layer>
        )}

        {createNewActionItemPopup && (
          <Layer>
            <Popup
              className={addUpdatesPopupStyles.root}
              role="dialog"
              aria-modal="true"
              onDismiss={() => this.setState({ createNewActionItemPopup: false })}
            >
              <Overlay onClick={() => this.setState({ createNewActionItemPopup: false })} />
              <FocusTrapZone>
                <div role="document" className={`modalPopup ${addUpdatesPopupStyles.content}`}>
                  <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                    <Text className={styles.modalPopupTitle}>{(stratagicGrowthPlanActionForm.Id ? "Update" : "Create New") + " Action Item"}</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleCancelGrowthActionPopup()} />
                  </Stack>
                  <div className={styles.modalContent}>
                    <Stack {...columnProps} className={styles.formChildGap}>
                      <div className='i-row'>
                        <div className='i-col-12 i-mb-13'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>For</Text>
                            <Text className='T-Desc'>{stratagicGrowthPlanForm.Subject}</Text>
                          </div>
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>Customer Focus Area</Text>
                            <Text className='T-Desc'>{stratagicGrowthPlanForm.CustomerFocusArea}</Text>
                          </div>
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>Strategy</Text>
                            <Text className='T-Desc'>{stratagicGrowthPlanForm.Strategy}</Text>
                          </div>
                        </div>
                        <div className='i-col-12'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>Owner</Text>
                            <Text className='T-Desc'>{this.getUserDetail(stratagicGrowthPlanForm.OwnerId)?.Title}</Text>
                          </div>
                        </div>  
                      </div>
                      <div className='actionItemCheckbox'>
                        <Checkbox
                          label='Self Assign'
                          checked={stratagicGrowthPlanActionForm.selfAssigned}
                          onChange={(ev, checked) => {
                            this.handleChangeGrowthActionFormField("selfAssigned", checked);
                          }}
                        ></Checkbox>
                      </div>
                      <PeoplePicker
                        context={this.props.context}
                        titleText="Assign To"
                        personSelectionLimit={1}
                        disabled={stratagicGrowthPlanActionForm.selfAssigned}
                        searchTextLimit={2}
                        onChange={(items: any) => {
                          const userId = items ? this.state.siteUsers.filter((x) => x.Title === items[0].text)[0].Id : null;
                          this.handleChangeGrowthActionFormField("AssignToId", userId);
                        }}
                        defaultSelectedUsers={[stratagicGrowthPlanActionForm.AssignToId ? this.getUserDetail(stratagicGrowthPlanActionForm.AssignToId).UserPrincipalName : undefined]}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000} />
                      <TextField label="Sub"
                        styles={textFieldProps}
                        placeholder="Plan a travel and meet them."
                        value={stratagicGrowthPlanActionForm.Subject}
                        onChange={(ev, value) => this.handleChangeGrowthActionFormField("Subject", value)}
                        onBlur={this.handleTextFieldBlur}
                        errorMessage={
                          this.state.isTouched &&
                            !stratagicGrowthPlanActionForm.Subject
                            ? "Subject is required."
                            : ""
                        }
                        required={true}
                      />
                      <div className='ms-filter'>
                        <Label htmlFor="calender" required={true}>Due Date</Label>
                        <DatePicker
                          placeholder="Select a date..."
                          ariaLabel="Select a date"
                          value={stratagicGrowthPlanActionForm.DueDate ? new Date(stratagicGrowthPlanActionForm.DueDate) : undefined}
                          formatDate={(e: any) => { return e && new Date(e).toLocaleDateString() }}
                          onSelectDate={(e: any) => this.handleChangeGrowthActionFormField("DueDate", e)}
                          onBlur={this.handleTextFieldBlur}
                        />
                        {this.state.isTouched &&
                          (!stratagicGrowthPlanActionForm.DueDate) && (
                            <div>
                              <p style={{ color: "#A4262C", fontSize: "12px", fontWeight: 400 }}>
                                Date is required.
                              </p>
                            </div>
                          )}
                        {/* <Calendar id="calender" placeholder='01/01/2023' value={this.state.value} onChange={this.handleChange} readOnlyInput /> */}
                      </div>
                      <TextField label="Description"
                        styles={textFieldParagraphProps}
                        placeholder="Enter Description"
                        value={stratagicGrowthPlanActionForm.Description}
                        onChange={(ev, value) => this.handleChangeGrowthActionFormField("Description", value)}
                        multiline rows={5} />
                      <div className='d-flex justify-between align-items-center'>
                        <div className='actionItemCheckbox'>
                          {stratagicGrowthPlanActionForm.Id &&
                            <Checkbox label='Close Action Item'
                              checked={stratagicGrowthPlanActionForm.Status}
                              onChange={(ev, checked) => this.handleChangeGrowthActionFormField("Status", checked)}
                            ></Checkbox>}
                        </div>
                        <div>
                          <DefaultButton className='btn-primary'
                            text={stratagicGrowthPlanActionForm.Id ? "Update" : "Save"} styles={modalButton}
                            onClick={() => this.handleSaveGrowthAction()}
                          ></DefaultButton>
                          <DefaultButton className='btn-outline'
                            text={(stratagicGrowthPlanActionForm.Id ? "Update" : "Save") + " and Create Action Item"}
                            styles={modalButton}
                            onClick={() => this.handleSaveGrowthAction(true)}
                          ></DefaultButton>
                          <DefaultButton className='btn-outline'
                            text="Cancel" styles={modalButton}
                            onClick={() => this.handleCancelGrowthActionPopup()}></DefaultButton>
                        </div>
                      </div>
                    </Stack>
                  </div>
                </div>
              </FocusTrapZone>
            </Popup>
          </Layer>
        )}
        {this.showDeletePopup()}
        {/* {closeActionItemPopup && (
          <Layer>
            <Popup
              className={addUpdatesPopupStyles.root}
              role="dialog"
              aria-modal="true"
              onDismiss={() => this.setState({ closeActionItemPopup: false })}
            >
              <Overlay onClick={() => this.setState({ closeActionItemPopup: false })} />
              <FocusTrapZone>
                <div role="document" className={`modalPopup ${addUpdatesPopupStyles.content}`}>
                  <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                    <Text className={styles.modalPopupTitle}>Create New Action Item</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.setState({ closeActionItemPopup: false })} />
                  </Stack>
                  <div className={styles.modalContent}>
                    <Stack {...columnProps} className={styles.formChildGap}>
                      <div className='i-row'>
                        <div className='i-col-12 i-mb-13'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>For</Text>
                            <Text className='T-Desc'>Growth plan 1 - Growth in Data Center</Text>
                          </div>
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>Customer Focus Area</Text>
                            <Text className='T-Desc'>Customer Focus Area</Text>
                          </div>
                        </div>
                        <div className='i-col-12 i-mb-13'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>Strategy</Text>
                            <Text className='T-Desc'>Strategy</Text>
                          </div>
                        </div>
                        <div className='i-col-12'>
                          <div className='d-flex flex-column'>
                            <Text className='T-Title'>Owner</Text>
                            <Text className='T-Desc'>John Doe</Text>
                          </div>
                        </div>
                      </div>
                      <div className='actionItemCheckbox'>
                        <Checkbox label='Self Assign' checked></Checkbox>
                      </div>
                      <TextField label="Assign To" styles={textFieldProps} readOnly disabled />
                      <TextField label="Sub" styles={textFieldProps} placeholder="Plan a travel and meet them." />
                      <div className='ms-filter'>
                        <label htmlFor="calender">Due Date</label>
                        <Calendar id="calender" placeholder='01/01/2023' value={this.state.value} onChange={this.handleChange} readOnlyInput />
                      </div>
                      <TextField label="Description" styles={textFieldParagraphProps} placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages," multiline rows={5} />
                      <div className='d-flex justify-between align-items-center'>
                        <div className='actionItemCheckbox'>
                          <Checkbox label='Close Action Item'></Checkbox>
                        </div>
                        <div>
                          <DefaultButton className='btn-primary' text="Save" styles={modalButton}></DefaultButton>
                          <DefaultButton className='btn-outline' text="Save and Create New" styles={modalButton}></DefaultButton>
                          <DefaultButton className='btn-outline' text="Cancel" styles={modalButton} onClick={() => this.setState({ closeActionItemPopup: false })}></DefaultButton>
                        </div>
                      </div>
                    </Stack>
                  </div>
                </div>
              </FocusTrapZone>
            </Popup>
          </Layer>
        )} */}
      </>
    );
  }
}
