import * as React from 'react';
import styles from './EngagementDashboardValueAddition.module.scss';
import type { IEngagementDashboardValueAdditionProps } from './IEngagementDashboardValueAdditionProps';
import { mergeStyleSets, DefaultButton, Dropdown, Text, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, Stack, PrimaryButton, Layer, Popup, Overlay, FocusTrapZone, TextField, IStackProps, ITextFieldStyles, Link, Dialog, DialogFooter, DialogType } from '@fluentui/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import '../../common.css';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { EDServices } from '../../../services/EDServices';
import toast, { Toaster } from 'react-hot-toast';

export interface IValueAdditionFormField {
  Id?: number;
  AccountName: string;
  Category: string;
  Subject: string;
  Description: string;

}

export interface EngagementDashboardValueAdditionState {
  createPopup: boolean;
  formFields: IValueAdditionFormField;
  categoryChoices: IDropdownOption[];
  bestPracticesData: Array<any>;
  selectedCategory: string;
  isTouched: boolean;
  accountName: string;
  hideDialog: boolean
}


const url = new URL(window.location.href);
const accountName = url.searchParams.get("accountName");

export default class EngagementDashboardValueAddition extends React.Component<IEngagementDashboardValueAdditionProps, EngagementDashboardValueAdditionState, {}> {
  spServices: EDServices;

  constructor(props: IEngagementDashboardValueAdditionProps) {
    super(props);
    this.spServices = new EDServices(props.context);

    this.state = {
      createPopup: false,
      bestPracticesData: [],
      categoryChoices: [],
      selectedCategory: "All",
      formFields: this.getFormFields(),
      isTouched: false,
      accountName: '',
      hideDialog: false
    };

    this.screenInit();
  }

  public async componentDidMount(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for revenue :: ', accountName)

    this.setState({ accountName : accountName })
  }

  private async screenInit() {
    this.spServices.getListDataWithFilter(this.props.listName, `AccountName eq '${accountName}'`).then((res) => {
      this.setState({
        bestPracticesData: res
      })
    });

    const listFields = await this.spServices.getFieldsByListName(this.props.listName, "Category");
    this.setState({
      categoryChoices: [{ key: "All", text: "All" }].concat(listFields.Choices.map((x: string) => { return { key: x, text: x } }))
    })
  }

  private getFormFields() {
    return {
      AccountName: accountName ? accountName : "",
      Category: "",
      Description: "",
      Subject: ""
    }
  }

  navigateToPreviousPage = () => {
    const url = new URL(window.location.href);
    const accountName = url.searchParams.get("accountName");
    const source = url.searchParams.get("source");
    window.location.href = source + "?accountName=" + accountName;
  };


  private handleFieldChange(fieldName: string, value: string) {
    this.setState({
      formFields: {
        ...this.state.formFields,
        [fieldName]: value
      }
    })
  }

  private handleCreateAndEditForm() {
    if(this.state.formFields.Subject && this.state.formFields.Category && this.state.formFields.Description){
      const Id = this.state.formFields.Id;
      const formFields = this.state.formFields;
      if (Id) {
        let obj: IValueAdditionFormField = {
          AccountName: formFields.AccountName,
          Category: formFields.Category,
          Description: formFields.Description,
          Subject: formFields.Subject
        }
        this.spServices.updateItem(this.props.listName, Id, obj).then((res) => {
          this.handleCancelPopup();
          toast.success("Value Addition updated successfully.");
          this.screenInit();
        });
      } else {
        this.spServices.createItem(this.props.listName, this.state.formFields).then((res) => {
          this.handleCancelPopup();
          toast.success("Value Addition created successfully.");
          this.screenInit();
        })
      }
    }else{
      this.setState({ isTouched : true});
    }
  } 

  private formCategoryOptions() {
    const { bestPracticesData, categoryChoices, formFields } = this.state;
    const existsCategory = bestPracticesData && bestPracticesData.map((x) => { return x.Category });
    return categoryChoices.filter((x) => x.key != "All" && !existsCategory.includes(x.key) || (formFields.Id && x.key == formFields.Category));
  }

  private handleEditButton(item: IValueAdditionFormField, e: any) {
    e.stopPropagation();
    this.setState({
      createPopup: !this.state.createPopup,
      formFields: item
    })
  }

  private handleDeleteButton(item: IValueAdditionFormField, e: any){
    e.stopPropagation();
    this.setState({
      formFields: item,
      hideDialog: true
    })
  }

  private async handleDeletePopupButton(itemId: number | undefined) {
    console.log(itemId);
    try {
      // Iterate over each selected row and delete the corresponding item
      
      await this.spServices.deleteItem(this.props.listName, itemId != undefined ? itemId : 0);
      console.log("Going to delete success ", itemId);
      
      this.screenInit(); 
      toast.success('Value Addition details deleted successfully.');
      this.setState({ hideDialog: false })

      console.log("Value Addition deleted successfully!");
    } catch (error) {
      console.error("Error Deleting Value Addition:", error);
    }
    
  }

  dialogContentProps = {
    type: DialogType.normal,
    title: "Confirmation",
    subText: "Are you sure you want to delete the Value Addition?",
  };

  private handleCancelPopup() {
    this.setState({
      createPopup: false,
      formFields: this.getFormFields()
    })
  }

  private getBestPracticesData() {
    let data = cloneDeep(this.state.bestPracticesData);

    if (this.state.selectedCategory !== "All") {
      data = data.filter((x) => x.Category === this.state.selectedCategory);
    }

    return data;
  }


  public render(): React.ReactElement<IEngagementDashboardValueAdditionProps> {

    const createPopup = this.state.createPopup;

    const handleTextFieldBlur = () => {
      this.setState({ isTouched: true });
    };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { fontFamily: 'Poppins' },
      title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
      caretDownWrapper: { lineHeight: 37 },
      dropdownItemSelected: { background: '#E7F3FF', minHeight: 25, margin: '2px 0' },
      dropdownItem: { minHeight: 25 },
      dropdownItems: { padding: '7px 0' },
    };

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: '13px 0 20px 10px', float: 'right' }
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
        borderRadius: 2,
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

    let urlParams = new URLSearchParams(window.location.search);
    const SourceUrl = urlParams.get("source");
    const splitUrl = SourceUrl?.split("?")[0];
    console.log("revenue leakage tile", this.state.accountName);

    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <div>
          <ul className='breadcrumb'>
            <li>
              <Link href={`${splitUrl}?accountName=${this.state.accountName}`}>
                ENGAGEMENT DASHBOARD
              </Link>
            </li>
            <li>{this.state.accountName} - Value Addition</li>
          </ul>
        </div>
        <section className="accountOverviewSection">
          <div className='blockTitleWrap i-mb-20 align-items-end'>
            <div className={`titleWrap ${styles.dropdownWidth}`}>
            <Dropdown
              label='Category'
              selectedKey={this.state.selectedCategory}
              options={this.state.categoryChoices}
              onChange={(ev,option:any)=> this.setState({ selectedCategory: option?.key})}
              styles={dropdownStyles}
              className='droupdown'
            />
            </div>
            <div className='rightbar'>
              <span className='popupFilterContainer'>
                <PrimaryButton text="Create New" className='btn-primary' onClick={() => this.setState({ createPopup: true })}></PrimaryButton>
              </span>
            </div>
          </div>
        </section>
        <Accordion activeIndex={0}>
        {this.state.bestPracticesData && this.getBestPracticesData().map((item)=>{
            return <AccordionTab
            header={
              <div className='accordion_title justify-between'>
                <div className='d-flex align-items-center'>{item.Subject} <span className='badge'>{item.Category}</span></div>
                <div className="accordianBtns">
                  <FontIcon
                    aria-label="edit" iconName="EditSolid12" className="editIcon"
                    onClick={(e) => this.handleEditButton(item, e)} />
                  <FontIcon aria-label="delete"
                    iconName="delete"
                    onClick={(e) => this.handleDeleteButton(item, e)} 
                    className="deleteIcon" />
                </div>
              </div>
            }
          >
            <div className='accordion_content'>
              {/* <div className='edit_content' >
                <DefaultButton text="Edit" className='btn-outline' 
                onClick={(e) => this.handleEditButton(item, e)}></DefaultButton></div> */}
              <p className="m-0"> {item.Description}</p>
            </div>
          </AccordionTab>
          })}
        </Accordion>

        <Dialog
          hidden={!this.state.hideDialog}
          dialogContentProps={this.dialogContentProps}
        >
          <DialogFooter>
            {/* Confirm deletion */}
            <PrimaryButton
              onClick={() => this.handleDeletePopupButton(this.state.formFields.Id)}
              text="Delete"
            />
            {/* Cancel */}
            <DefaultButton
              onClick={() => this.setState({ hideDialog: false })}
              text="Cancel"
            />
          </DialogFooter>
        </Dialog>

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
                <div role="document" className={addUpdatesPopupStyles.content}>
                  <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                    <Text className={styles.modalPopupTitle}>Create New Value Addition</Text>
                    <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.setState({ createPopup: false })} />
                  </Stack>
                  <div className={styles.modalContent}>
                  <Stack {...columnProps} className={styles.formChildGap}>
                    <TextField 
                      label="Subject" 
                      styles={textFieldProps} 
                      placeholder="Enter Subject" 
                      value={this.state.formFields.Subject}
                      onChange={(ev, value:string)=> this.handleFieldChange("Subject", value)}
                      className='mt-0' 
                      onBlur={handleTextFieldBlur}
                      errorMessage={
                          this.state.isTouched &&
                          !this.state.formFields.Subject
                          ? "Subject is required."
                          : ""
                      }
                      required={true}/>
                    <Dropdown
                      label='Category'
                      placeholder='Select Category'
                      options={this.formCategoryOptions()}
                      selectedKey={this.state.formFields.Category}
                      onChange={(ev, option)=> this.handleFieldChange("Category", (option?.key as string))}
                      styles={dropdownStyles}
                      className='droupdown'
                      onBlur={handleTextFieldBlur}
                      errorMessage={
                          this.state.isTouched &&
                          !this.state.formFields.Category
                          ? "Category is required."
                          : ""
                      }
                      required={true}
                    />
                    <TextField 
                      label="Description" 
                      styles={textFieldParagraphProps} 
                      value={this.state.formFields.Description}
                      onChange={(ev, value:string)=> this.handleFieldChange("Description", value)}
                      placeholder="Enter Description" 
                      multiline rows={5} 
                      onBlur={handleTextFieldBlur}
                      errorMessage={
                          this.state.isTouched &&
                          !this.state.formFields.Description
                          ? "Description is required."
                          : ""
                      }
                      required={true} />
                  </Stack>
                  <DefaultButton className='btn-primary' text={this.state.formFields.Id ? "Update" : "Create"} styles={modalButton} onClick={()=> this.handleCreateAndEditForm()}></DefaultButton>
                  <DefaultButton className='btn-outline' text="Cancel" styles={modalButton} onClick={() => this.handleCancelPopup()}></DefaultButton>
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
