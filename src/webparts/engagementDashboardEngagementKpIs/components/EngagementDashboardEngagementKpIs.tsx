import * as React from 'react';
// import styles from './EngagementDashboardEngagementKpIs.module.scss';
import type { IEngagementDashboardEngagementKpIsProps } from './IEngagementDashboardEngagementKpIsProps';
import { TabView, TabPanel } from 'primereact/tabview';
import { IconButton } from '@fluentui/react/lib/Button';
import { mergeStyleSets, ChoiceGroup, IChoiceGroupOption, DefaultButton, Dropdown, Text, FontIcon, IButtonStyles, IDropdownOption, IDropdownStyles, Stack, PrimaryButton, Layer, Popup, Overlay, FocusTrapZone, TextField, IStackProps, ITextFieldStyles, Panel, Dialog, DialogFooter, DialogType } from '@fluentui/react';
import styles from './EngagementDashboardEngagementKpIs.module.scss';
import '../../common.css';
import { cloneDeep, groupBy } from '@microsoft/sp-lodash-subset';
import { EDServices } from '../../../services/EDServices';
import { Toaster, toast } from 'react-hot-toast';

const data = require("../../../SampleData/projectData.json");

export interface IKPIFormFields {
    KPILevel: string,
    Account: string,
    Project: string,
    Year: string,
    KPIs: Array<any>
}

export interface IkpiFeedbackFormField {
    Account: string,
    KPICategory: string,
    Description: string,
    FeedbackCreated: string,
}

export interface IEngagementDashboardEngagementKpIsState {
    kpiFormFields: IKPIFormFields,
    kpiFeedbackFormFields: IkpiFeedbackFormField,
    createPopup: boolean;
    feedbackIsOpen: boolean;
    accountsOptions: Array<any>;
    projectOptions: Array<any>;
    KPIsData: Array<any>;
    KPIFeedbackData: Array<any>;
    selectedAccount: string;
    selectedProject: string;
    selectedYear: string;
    selectedTab: number;
    editPopup: boolean;
    addPopup: boolean;
    selectedKPI: any;
    isDeletePopup: IDeletePopup;
    isTouched: boolean;
}

export interface IDeletePopup {
    IsShow: boolean;
    msg: string;
    popupName: string;
    itemId: number;
}

export default class EngagementDashboardEngagementKpIs extends React.Component<IEngagementDashboardEngagementKpIsProps, IEngagementDashboardEngagementKpIsState, {}> {
    spServices: EDServices;

    constructor(props: IEngagementDashboardEngagementKpIsProps) {
        super(props);
        this.spServices = new EDServices(props.context);
        const url = new URL(window.location.href);
        const accountName = url.searchParams.get("accountName");

        this.state = {
            selectedAccount: accountName ? accountName : "",
            selectedProject: "",
            selectedYear: "2024",
            createPopup: false,
            feedbackIsOpen: false,
            editPopup: false,
            addPopup: false,
            accountsOptions: [],
            projectOptions: [],
            KPIsData: [],
            KPIFeedbackData: [],
            kpiFormFields: this.getFormEmptyFields(),
            kpiFeedbackFormFields: this.getFeedbackFormFields(),
            selectedTab: 0,
            selectedKPI: null,
            isDeletePopup: {
                IsShow: true,
                msg: "",
                popupName: "",
                itemId: 0
            },
            isTouched: false
        };

        this.screenInit();
    }

    componentDidMount(): void {
        const groupByAccount = groupBy(data.data, "clientName"); // call the API for getting the data of account and project
        const accountOption = Object.keys(groupByAccount).slice(0, 25).map((x) => { return { key: x, text: x, data: groupByAccount[x] } });
        this.setState({
            accountsOptions: accountOption,
            projectOptions: data.data.map((x: any) => { return { key: x.projectName, text: x.projectName, accountName: x.clientName } })
        });
    }

    private async screenInit() {
        const KPIsData = await this.spServices.getListData(this.props.KPIsListName);
        const feedBackData = await this.spServices.getListData(this.props.feedbackListName);
        this.setState({
            KPIFeedbackData: feedBackData,
            KPIsData: KPIsData
        });
    }

    navigateToPreviousPage = () => {
        const url = new URL(window.location.href);
        const accountName = url.searchParams.get("accountName");
        const source = url.searchParams.get("source");
        window.location.href = source + "?accountName=" + accountName;
    };

    private getFormEmptyFields() {
        return {
            Account: "",
            KPILevel: "Both",
            Project: "",
            Year: "",
            KPIs: [this.getKPIDetails()]
        }
    }

    private getFeedbackFormFields() {
        return {
            Account: "",
            KPICategory: "",
            Description: "",
            FeedbackCreated: "",
        }
    }

    private handleKPIFormFields(fieldName: string, value: any, KPIID?: any) {
        if (!KPIID) {
            this.setState({
                kpiFormFields: {
                    ...this.state.kpiFormFields,
                    [fieldName]: value
                }
            })
        } else {
            let arr = this.state.kpiFormFields.KPIs.map((e) => {
                if (e.id === KPIID) {
                    return { ...e, [fieldName]: value }
                } else {
                    return e
                }
            })
            this.setState({
                kpiFormFields: {
                    ...this.state.kpiFormFields,
                    ["KPIs"]: arr
                }
            })
        }
    }

    private handleDeleteField(id: any) {
        let arr = this.state.kpiFormFields.KPIs.filter((x) => x.id != id);
        this.setState({
            kpiFormFields: {
                ...this.state.kpiFormFields,
                ["KPIs"]: arr
            }
        })
    }

    private handleFeedbackFields(fieldName: string, value: any) {
        this.setState({
            kpiFeedbackFormFields: {
                ...this.state.kpiFeedbackFormFields,
                [fieldName]: value
            }
        })
    }

    private handleSubmitFeedback() {
        const kpiId = this.state.KPIsData?.filter((e) => e.Category === this.state.kpiFeedbackFormFields.KPICategory)[0].ID;
        let obj = {
            AccountName: this.state.selectedAccount,
            KPICategoryId: kpiId,
            Description: this.state.kpiFeedbackFormFields.Description,
            FeedbackCreated: new Date().toISOString()
        }

        this.spServices.createItem(this.props.feedbackListName, obj).then((res) => {
            this.setState({
                feedbackIsOpen: false,
                kpiFeedbackFormFields: this.getFeedbackFormFields()
            });
            toast.success("Your Feedback submitted successfully.");
            this.screenInit();
        })
    }

    private addNewKPIDetails() {
        let arr = cloneDeep(this.state.kpiFormFields.KPIs);
        arr.push(this.getKPIDetails());
        this.handleKPIFormFields("KPIs", arr);
    }

    private getKPIDetails() {
        const KPIsLength = this.state?.kpiFormFields ? this.state.kpiFormFields.KPIs.reduce((max, obj) => Math.max(max, obj.id), 0) : 0;
        return {
            id: KPIsLength + 1,
            category: "",
            weightage: "",
            description: ""
        }
    }

    private handleCreateKPIs() {
        try {
            const formFields = this.state.kpiFormFields;
            
            let kpiArray = this.state.kpiFormFields.KPIs;
            let result = kpiArray.every(this.addKPIValue);

            if(this.state.kpiFormFields.Account != '' && this.state.kpiFormFields.Year != '' && result){
                const data = Object.keys(formFields.KPIs).map((item: any) => {
                    let obj: any = {
                        KPILevel: formFields.KPILevel,
                        Year: formFields.Year,
                        Category: formFields.KPIs[item].category,
                        Weightage: formFields.KPIs[item].weightage,
                        Description: formFields.KPIs[item].description
                    };
                    if (formFields.KPILevel === "Both") {
                        obj.AccountName = formFields.Account;
                        obj.Project = formFields.Project;
                    } else if (formFields.KPILevel === "Account") {
                        obj.AccountName = formFields.Account;
                    } else if (formFields.KPILevel === "Project") {
                        obj.AccountName = this.state.selectedAccount;
                        obj.Project = formFields.Project;
                    }
                    return obj;
                })

                this.spServices.createMultipleItems(this.props.KPIsListName, data).then((res) => {
                    if (res) {
                        toast.success("KPIs Created Successfully");
                        this.screenInit();
                        this.setState({
                            createPopup: false,
                            kpiFormFields: this.getFormEmptyFields()
                        });
                    }
                })
            }else{
                this.setState({ isTouched : true});
            }
            
        } catch (error) {
            console.error("Error saving KPIs details:", error);
            this.setState({ isTouched : true});
        }
    }

    private handleCancelPopup() {
        this.setState({
            createPopup: false,
            kpiFormFields: this.getFormEmptyFields()
        })
    }

    private handleKPIAddPopup() {
        this.setState({
            addPopup: !this.state.addPopup,
            kpiFormFields: this.getFormEmptyFields()
        })
    }

    private getKPIsData() {
        let data = cloneDeep(this.state.KPIsData);

        const { selectedAccount, selectedProject, selectedYear } = this.state;

        if (selectedAccount && data.length > 0) {
            data = data.filter((x) => x.AccountName === selectedAccount);
        }
        if (selectedProject && this.state.selectedTab === 1) {
            data = data.filter((x) => x.Project === selectedProject);
        }
        if (selectedYear) {
            data = data.filter((x) => x.Year === selectedYear);
        }

        return data;
    }

    private KPICategoryOptions() {
        return this.getKPIsData().map((e) => {
            return { key: e.Category, text: e.Category, data: e }
        })
    }

    private handleDeleteKPIs(itemId: number) {
        this.setState({
            isDeletePopup: {
                IsShow: false,
                msg: "Are you sure you want to delete this KPI?",
                popupName: "KPI",
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
                    const listName = this.state.isDeletePopup.popupName === "KPI" ? this.props.KPIsListName : this.props.feedbackListName;
                    this.handleDeleteItem(listName, this.state.isDeletePopup.itemId);
                }} text="Yes" />
                <DefaultButton onClick={() => this.setState({ isDeletePopup: { IsShow: true, msg: "", popupName: "", itemId: 0 } })} text="No" />
            </DialogFooter>
        </Dialog>
    }

    private handleDeleteItem(listName: string, itemId: number) {
        this.spServices.deleteItem(listName, itemId).then((res) => {
            toast.success((this.state.isDeletePopup.popupName === "KPI" ? "KPI" : "Feedback") + " deleted successfully");
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

    private getFeedbacks() {
        if (this.state.feedbackIsOpen) {
            return this.state.KPIFeedbackData.filter((x) => x.AccountName === this.state.selectedAccount);
        }
        return [];
    }

    private getKPICategoryNameById(id: any) {
        return this.state.KPIsData.length > 0 ? this.state.KPIsData.filter((x) => x.ID === id)[0]?.Category : ""
    }

    private handleEditKPIPopup(item: any) {
        this.setState({
            editPopup: !this.state.editPopup,
            selectedKPI: item
        })
    }

    private handleUpdateKPIField(fieldName: string, value: any) {
        this.setState({
            selectedKPI: {
                ...this.state.selectedKPI,
                [fieldName]: value
            }
        })
    }
    addKPIValue(el : any) {
        return el.category !== "" && el.weightage !== "";
    }
    EditKPIValue(el : any) {
        return el.Category !== "" && el.Weightage !== "";
    }

    private handleCreateOrUpdateKPI() {
        try{
            let kpiArray;
            let result;
            if(this.state.selectedKPI){
                kpiArray = this.state.selectedKPI;
                result = this.EditKPIValue(kpiArray);
            }else{
                kpiArray = this.state.kpiFormFields.KPIs;
                result = kpiArray.every(this.addKPIValue);
            } 
            
            if(result)
            {
                const Id = this.state.selectedKPI?.ID;
                if (Id) {
                    let obj = {
                        Category: this.state.selectedKPI.Category,
                        Weightage: this.state.selectedKPI.Weightage,
                        Description: this.state.selectedKPI.Description
                    }

                    this.spServices.updateItem(this.props.KPIsListName, this.state.selectedKPI.Id, obj).then((res) => {
                        this.handleEditKPIPopup(null);
                        toast.success("KPI Updated successfully.")
                        this.screenInit();
                    })
                } else {
                    let formFields = cloneDeep(this.state.kpiFormFields);
                    const data = Object.keys(formFields.KPIs).map((item: any) => {
                        let obj: any = {
                            AccountName: this.state.selectedAccount,
                            Year: this.state.selectedYear,
                            Category: formFields.KPIs[item].category,
                            Weightage: formFields.KPIs[item].weightage,
                            Description: formFields.KPIs[item].description
                        };
                        if (this.state.selectedProject && this.state.selectedTab == 1) {
                            obj.Project = this.state.selectedProject;
                        }
                        return obj;
                    })  

                    this.spServices.createMultipleItems(this.props.KPIsListName, data).then((res) => {
                        this.setState({
                            kpiFormFields: this.getFormEmptyFields(),
                            addPopup: false
                        });
                        this.screenInit();
                        toast.success("KPI Created successfully.");
                    })
                }
            }else{
                this.setState({ isTouched : true});
            }
        } catch (error) {
            console.error("Error adding KPIs details:", error);
        }
    }

    private handleDeleteFeedback(itemId: number) {
        this.setState({
            isDeletePopup: {
                IsShow: false,
                msg: "Are you sure you want to delete this Feedback?",
                popupName: "Feedback",
                itemId: itemId
            }
        });
    }

    public render(): React.ReactElement<IEngagementDashboardEngagementKpIsProps> {
        const { kpiFormFields, accountsOptions, feedbackIsOpen, createPopup } = this.state;
        const editPopup = this.state.editPopup;
        const addPopup = this.state.addPopup;

        const uniqYearsOption = [...new Set(this.state.KPIsData.map(item => item.Year))];

        const handleTextFieldBlur = () => {
            this.setState({ isTouched: true });
        };

        const kpiLevelOptions: IChoiceGroupOption[] = [
            { key: 'Account', text: 'Account' },
            { key: 'Project', text: 'Project' },
            { key: 'Both', text: 'Both' },
        ];

        const yearOptions: IDropdownOption[] = [
            { key: '2020', text: '2020' },
            { key: '2021', text: '2021' },
            { key: '2022', text: '2022' },
            { key: '2023', text: '2023' },
            { key: '2024', text: '2024' }
        ];

        const dropdownStyles: Partial<IDropdownStyles> = {
            dropdown: { fontFamily: 'Poppins' },
            title: { height: 40, borderColor: '#D7DADE', color: '#495057', fontFamily: 'Poppins', fontSize: 13, lineHeight: 37 },
            caretDownWrapper: { lineHeight: 37 },
            dropdownItemSelected: { background: '#E7F3FF', minHeight: 25, margin: '2px 0' },
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
        return (
            <>
                <Toaster
                    position="top-right"
                    reverseOrder={false} />
                <div>
                    <ul className='breadcrumb'>
                        <li>
                            <a onClick={this.navigateToPreviousPage}>Engagement Dashboard</a>
                        </li>
                        <li>{this.state.selectedAccount} - Engagement KPIs</li>
                    </ul>
                </div>
                <section className="accountOverviewSection">
                    <div className='blockTitleWrap i-mb-20 align-items-end'>
                        <div className={`titleWrap ${styles.dropdownWidth}`}>
                            <Dropdown
                                selectedKey={this.state.selectedAccount}
                                options={accountsOptions}
                                onChange={(e, option: any) => this.setState({ selectedAccount: option.key })}
                                styles={dropdownStyles}
                                className='droupdown'
                            />
                        </div>
                        <div className='rightbar'>
                            <span className='popupFilterContainer'>
                                <PrimaryButton text="Create New" className='btn-primary' onClick={() => this.setState({ createPopup: true })}></PrimaryButton>
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
                                                        <Text className={styles.modalPopupTitle}>Create New KPI</Text>
                                                        <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.setState({ createPopup: false })} />
                                                    </Stack>
                                                    <div className={styles.modalContent}>
                                                        <Stack {...columnProps} className={styles.formChildGap}>
                                                            <ChoiceGroup
                                                                options={kpiLevelOptions}
                                                                label="KPI Level"
                                                                selectedKey={kpiFormFields.KPILevel}
                                                                onChange={(e, option) => this.handleKPIFormFields("KPILevel", option?.key)}
                                                                className='custom-radio-column'
                                                                required={true} />
                                                            {/* {kpiFormFields.KPILevel !== 'Project' && */} 
                                                            <Dropdown
                                                                label='Account'
                                                                //   defaultSelectedKey='JCI'
                                                                selectedKey={kpiFormFields.KPILevel === 'Project' ? this.state.selectedAccount : kpiFormFields.Account}
                                                                onChange={(e, option) => this.handleKPIFormFields("Account", option?.key)}
                                                                placeholder='Select Account'
                                                                disabled={kpiFormFields.KPILevel === 'Project'}
                                                                options={accountsOptions}
                                                                styles={dropdownStyles}
                                                                className='droupdown'
                                                                onBlur={handleTextFieldBlur}
                                                                errorMessage={
                                                                    this.state.isTouched &&
                                                                    !this.state.kpiFormFields.Account
                                                                    ? "Account is required."
                                                                    : ""
                                                                }
                                                                required={true} 
                                                            />
                                                            {/* } */}
                                                            {kpiFormFields.KPILevel !== "Account" && <Dropdown
                                                                label='Project'
                                                                selectedKey={kpiFormFields.Project}
                                                                //   defaultSelectedKey="521 PES Client Innovation-Linux-Porting"
                                                                onChange={(e, option) => this.handleKPIFormFields("Project", option?.key)}
                                                                options={this.state.projectOptions.filter((x) => x.accountName == (kpiFormFields.KPILevel === 'Project' ? this.state.selectedAccount : kpiFormFields.Account))}
                                                                placeholder='Select Project'
                                                                styles={dropdownStyles}
                                                                className='droupdown'
                                                                // onBlur={handleTextFieldBlur}
                                                                // errorMessage={
                                                                //     this.state.isTouched &&
                                                                //     !this.state.kpiFormFields.Project
                                                                //     ? "Project is required."
                                                                //     : ""
                                                                // }
                                                                // required={true}
                                                            />}
                                                            <Dropdown
                                                                label='Year'
                                                                selectedKey={kpiFormFields.Year}
                                                                onChange={(e, option) => this.handleKPIFormFields("Year", option?.key)}
                                                                options={yearOptions}
                                                                placeholder='Select Year'
                                                                styles={dropdownStyles}
                                                                className='droupdown'
                                                                onBlur={handleTextFieldBlur}
                                                                errorMessage={
                                                                    this.state.isTouched &&
                                                                    !this.state.kpiFormFields.Year
                                                                    ? "Year is required."
                                                                    : ""
                                                                }
                                                                required={true}
                                                            />
                                                            <div className='accountOverviewSection'>
                                                                <div className='blockTitleWrap'>
                                                                    <Text className='pageTitle'>KPIs</Text>
                                                                    <DefaultButton
                                                                        className='btn-primary'
                                                                        text="Add"
                                                                        onClick={() => this.addNewKPIDetails()}
                                                                    >
                                                                    </DefaultButton>
                                                                </div>
                                                            </div>
                                                            {this.state.kpiFormFields.KPIs.map((kpi) => {
                                                                return <div className={['i-row', styles.KPIsSection].join(" ")}>
                                                                    {this.state.kpiFormFields.KPIs.length > 1 &&
                                                                        <div className='i-col-12 text-right'>
                                                                            <IconButton
                                                                                className='deleteBtn'
                                                                                iconProps={{ iconName: 'Delete' }}
                                                                                onClick={() => this.handleDeleteField(kpi.id)}
                                                                                title="Delete" ariaLabel="Delete" />
                                                                        </div>
                                                                    }
                                                                    <div className='i-col-6 i-mb-13'>
                                                                        <TextField
                                                                            label="Category"
                                                                            onChange={(e, newValue) => this.handleKPIFormFields("category", newValue, kpi.id)}
                                                                            styles={textFieldProps} placeholder="Enter Category" 
                                                                            onBlur={handleTextFieldBlur}
                                                                            errorMessage={
                                                                                this.state.isTouched &&
                                                                                !kpi.category
                                                                                ? "Category is required."
                                                                                : ""
                                                                            }
                                                                            required={true}/>
                                                                    </div>
                                                                    <div className='i-col-6 i-mb-13'>
                                                                        <TextField
                                                                            label="Weightage (Optional)"
                                                                            type='number'
                                                                            onChange={(e, newValue) => this.handleKPIFormFields("weightage", newValue, kpi.id)}
                                                                            styles={textFieldProps} placeholder="Enter Weightage" 
                                                                            onBlur={handleTextFieldBlur}
                                                                            errorMessage={
                                                                                this.state.isTouched &&
                                                                                !kpi.weightage
                                                                                ? "Weightage is required."
                                                                                : ""
                                                                            }
                                                                            required={true} />
                                                                    </div>
                                                                    <div className='i-col-12'>
                                                                        <TextField
                                                                            label="Description"
                                                                            onChange={(e, newValue) => this.handleKPIFormFields("description", newValue, kpi.id)}
                                                                            styles={textFieldProps} placeholder="Enter Description" />
                                                                    </div>
                                                                </div>
                                                            })}
                                                            <div>
                                                                <DefaultButton className='btn-primary' text="Create" styles={modalButton} onClick={() => this.handleCreateKPIs()}></DefaultButton>
                                                                <DefaultButton className='btn-outline' text="Cancel" styles={modalButton} onClick={() => this.handleCancelPopup()}></DefaultButton>
                                                            </div>
                                                        </Stack>
                                                    </div>
                                                </div>
                                            </FocusTrapZone>
                                        </Popup>
                                    </Layer>
                                )}
                            </span>
                        </div>
                    </div>
                </section>
                <div className='JCI_Engagement_Wrap'>
                    <div className="horizontal_tab">
                        <TabView activeIndex={this.state.selectedTab} onTabChange={(e) => this.setState({ selectedTab: e.index })}>
                            <TabPanel header="Account Level">
                                <div className="accountOverviewSection">
                                    <div className='blockTitleWrap i-mb-20 align-items-end'>
                                        <div className={styles.yeardropdown}>
                                            <Dropdown
                                                placeholder="Select Year"
                                                selectedKey={this.state.selectedYear}
                                                options={uniqYearsOption.map((x) => { return { key: x, text: x } })}
                                                onChange={(e, option: any) => this.setState({ selectedYear: option.key })}
                                                styles={dropdownStyles}
                                                className='droupdown'
                                            />
                                        </div>
                                        <div className='rightbar'>
                                            <span className='popupFilterContainer'>
                                                <DefaultButton className='btn-outline' text="Add" onClick={() => this.handleKPIAddPopup()}></DefaultButton>
                                            </span>
                                            <span>
                                                <PrimaryButton
                                                    text="Feedback" className='btn-primary'
                                                    disabled={this.getKPIsData().length === 0}
                                                    onClick={() => this.setState({ feedbackIsOpen: true })}></PrimaryButton>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ul className={['i-flex-4', styles.cardRow].join(" ")}>
                                    {this.getKPIsData().map((kpi) => {
                                        return <li>
                                            <div className='details_card'>
                                                <IconButton
                                                    className='editBtn'
                                                    iconProps={{ iconName: 'EditSolid12' }}
                                                    title="Edit" ariaLabel="Edit"
                                                    onClick={() => this.handleEditKPIPopup(kpi)} />
                                                <IconButton
                                                    className='deleteBtn'
                                                    iconProps={{ iconName: 'Delete' }}
                                                    onClick={() => this.handleDeleteKPIs(kpi.Id)}
                                                    title="Delete" ariaLabel="Delete" />
                                                <div className='i-form-group-view'>
                                                    <div className='i-view-label'>Category</div>
                                                    <div className='i-view-value'>{kpi.Category}</div>
                                                </div>
                                                <div className='i-form-group-view'>
                                                    <div className='i-view-label'>Weightage</div>
                                                    <div className='i-view-value'>{kpi.Weightage}%</div>
                                                </div>
                                                <div className='i-form-group-view'>
                                                    <div className='i-view-label'>Description</div>
                                                    <div className='i-view-value'>{kpi.Description}</div>
                                                </div>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </TabPanel>
                            <TabPanel header="Project Level">
                                <div className="accountOverviewSection">
                                    <div className='blockTitleWrap i-mb-20 align-items-end'>
                                        <div className='leftbar'>
                                            <div className={styles.yeardropdown}>
                                                <Dropdown
                                                    placeholder="Select Year"
                                                    options={uniqYearsOption.map((x) => { return { key: x, text: x } })}
                                                    selectedKey={this.state.selectedYear}
                                                    onChange={(e, option: any) => this.setState({ selectedYear: option.key })}
                                                    styles={dropdownStyles}
                                                    className='droupdown'
                                                />
                                            </div>
                                            <div className={styles.projectdropdown}>
                                                <Dropdown
                                                    // defaultSelectedKey="521 PES Client Innovation-Linux-Porting"
                                                    placeholder='Select Project'
                                                    selectedKey={this.state.selectedProject}
                                                    options={this.state.projectOptions.filter((x) => x.accountName == this.state.selectedAccount)}
                                                    onChange={(e, option: any) => this.setState({ selectedProject: option.key })}
                                                    styles={dropdownStyles}
                                                    className='droupdown'
                                                />
                                            </div>
                                        </div>
                                        <div className='rightbar'>
                                            <span className='popupFilterContainer'>
                                                <DefaultButton className='btn-outline' text="Add" onClick={() => this.handleKPIAddPopup()}></DefaultButton>
                                            </span>
                                            <span>
                                                <PrimaryButton
                                                    text="Feedback" className='btn-primary'
                                                    disabled={this.getKPIsData().length === 0}
                                                    onClick={() => this.setState({ feedbackIsOpen: true })}>
                                                </PrimaryButton>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ul className={['i-flex-4', styles.cardRow].join(" ")}>
                                    {this.getKPIsData().map((kpi) => {
                                        return <li>
                                            <div className='details_card'>
                                                <IconButton className='editBtn' 
                                                iconProps={{ iconName: 'EditSolid12' }}
                                                 title="Edit" ariaLabel="Edit"
                                                 onClick={() => this.handleEditKPIPopup(kpi)} />
                                                <IconButton className='deleteBtn'
                                                    onClick={() => this.handleDeleteKPIs(kpi.Id)}
                                                    iconProps={{ iconName: 'Delete' }} title="Delete" ariaLabel="Delete" />
                                                <div className='i-form-group-view'>
                                                    <div className='i-view-label'>Category</div>
                                                    <div className='i-view-value'>{kpi.Category}</div>
                                                </div>
                                                <div className='i-form-group-view'>
                                                    <div className='i-view-label'>Weightage</div>
                                                    <div className='i-view-value'>{kpi.Weightage}%</div>
                                                </div>
                                                <div className='i-form-group-view'>
                                                    <div className='i-view-label'>Description</div>
                                                    <div className='i-view-value'>{kpi.Description}</div>
                                                </div>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
                {editPopup && (
                    <Layer>
                        <Popup
                            className={addUpdatesPopupStyles.root}
                            role="dialog"
                            aria-modal="true"
                            onDismiss={() => this.handleEditKPIPopup(null)}
                        >
                            <Overlay onClick={() => this.handleEditKPIPopup(null)} />
                            <FocusTrapZone>
                                <div role="document" className={addUpdatesPopupStyles.content}>
                                    <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                                        <Text className={styles.modalPopupTitle}>Edit KPI</Text>
                                        <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleEditKPIPopup(null)} />
                                    </Stack>
                                    <div className={styles.modalContent}>
                                        <Stack {...columnProps} className={styles.formChildGap}>
                                            <div className='i-row'>
                                                <div className='i-col-6 i-mb-13'>
                                                    <TextField
                                                        label="Category"
                                                        styles={textFieldProps}
                                                        placeholder="Enter Category"
                                                        value={this.state.selectedKPI?.Category}
                                                        onChange={(ev, value) => this.handleUpdateKPIField("Category", value)}
                                                        onBlur={handleTextFieldBlur}
                                                        errorMessage={
                                                            this.state.isTouched &&
                                                            !this.state.selectedKPI?.Category
                                                            ? "Category is required."
                                                            : ""
                                                        }
                                                        required={true}
                                                    />
                                                </div>
                                                <div className='i-col-6 i-mb-13'>
                                                    <TextField
                                                        label="Weightage (Optional)"
                                                        type='number'
                                                        value={this.state.selectedKPI?.Weightage}
                                                        styles={textFieldProps}
                                                        onChange={(ev, value) => this.handleUpdateKPIField("Weightage", value)}
                                                        placeholder="Enter Weightage" 
                                                        onBlur={handleTextFieldBlur}
                                                        errorMessage={
                                                            this.state.isTouched &&
                                                            !this.state.selectedKPI?.Weightage
                                                            ? "Weightage is required."
                                                            : ""
                                                        }
                                                        required={true}/>
                                                </div>
                                                <div className='i-col-12'>
                                                    <TextField
                                                        label="Description"
                                                        value={this.state.selectedKPI?.Description}
                                                        styles={textFieldProps}
                                                        onChange={(ev, value) => this.handleUpdateKPIField("Description", value)}
                                                        placeholder="Enter Description" />
                                                </div>
                                            </div>
                                            <div>
                                                <DefaultButton className='btn-primary' text="Update" styles={modalButton} onClick={() => this.handleCreateOrUpdateKPI()}></DefaultButton>
                                                <DefaultButton className='btn-outline' text="Cancel" styles={modalButton} onClick={() => this.handleEditKPIPopup(null)}></DefaultButton>
                                            </div>
                                        </Stack>
                                    </div>
                                </div>
                            </FocusTrapZone>
                        </Popup>
                    </Layer>
                )}
                {addPopup && (
                    <Layer>
                        <Popup
                            className={addUpdatesPopupStyles.root}
                            role="dialog"
                            aria-modal="true"
                            onDismiss={() => this.handleKPIAddPopup()}
                        >
                            <Overlay onClick={() => this.handleKPIAddPopup()} />
                            <FocusTrapZone>
                                <div role="document" className={`modalPopup ${addUpdatesPopupStyles.content}`}>
                                    <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                                        <Text className={styles.modalPopupTitle}>Add KPI</Text>
                                        <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.handleKPIAddPopup()} />
                                    </Stack>
                                    <div className={styles.modalContent}>
                                        <Stack {...columnProps} className={styles.formChildGap}>
                                            <div className='accountOverviewSection'>
                                                <div className='blockTitleWrap'>
                                                    <Text className='pageTitle'>KPIs</Text>
                                                    <DefaultButton className='btn-primary' text="Add" onClick={() => this.addNewKPIDetails()}></DefaultButton>
                                                </div>
                                            </div>
                                            {this.state.kpiFormFields.KPIs.map((kpi) => {
                                                return <div className={['i-row', styles.KPIsSection].join(" ")}>
                                                    {this.state.kpiFormFields.KPIs.length > 1 &&
                                                        <div className='i-col-12 text-right'>
                                                            <IconButton className='deleteBtn' iconProps={{ iconName: 'Delete' }} title="Delete" ariaLabel="Delete" onClick={() => this.handleDeleteField(kpi.id)}/>
                                                        </div>
                                                    }
                                                    <div className='i-col-6 i-mb-13'>
                                                        <TextField
                                                            label="Category"
                                                            onChange={(e, newValue) => this.handleKPIFormFields("category", newValue, kpi.id)}
                                                            styles={textFieldProps} placeholder="Enter Category"
                                                            onBlur={handleTextFieldBlur}
                                                            errorMessage={
                                                                this.state.isTouched &&
                                                                !kpi.category
                                                                ? "Category is required."
                                                                : ""
                                                            }
                                                            required={true} />
                                                    </div>
                                                    <div className='i-col-6 i-mb-13'>
                                                        <TextField
                                                            label="Weightage (Optional)"
                                                            type='number'
                                                            onChange={(e, newValue) => this.handleKPIFormFields("weightage", newValue, kpi.id)}
                                                            styles={textFieldProps} placeholder="Enter Weightage" 
                                                            onBlur={handleTextFieldBlur}
                                                            errorMessage={
                                                                this.state.isTouched &&
                                                                !kpi.weightage
                                                                ? "Weightage is required."
                                                                : ""
                                                            }
                                                            required={true}/>
                                                    </div>
                                                    <div className='i-col-12'>
                                                        <TextField
                                                            label="Description"
                                                            onChange={(e, newValue) => this.handleKPIFormFields("description", newValue, kpi.id)}
                                                            styles={textFieldProps} placeholder="Enter Description" />
                                                    </div>
                                                </div>
                                            })}
                                            <div>
                                                <DefaultButton className='btn-primary' text="Save" styles={modalButton} onClick={() => this.handleCreateOrUpdateKPI()} ></DefaultButton>
                                                <DefaultButton className='btn-outline' text="Cancel" styles={modalButton} onClick={() => this.handleKPIAddPopup()}></DefaultButton>
                                            </div>
                                        </Stack>
                                    </div>
                                </div>
                            </FocusTrapZone>
                        </Popup>
                    </Layer>
                )}
                {this.showDeletePopup()}
                <Panel
                    isLightDismiss
                    isOpen={feedbackIsOpen}
                    onDismiss={() => this.setState({ feedbackIsOpen: false })}
                    headerText="Feedback"
                    closeButtonAriaLabel="Close"
                    className='i-panel'
                >
                    <Stack {...columnProps} className={styles.formChildGap}>
                        <Dropdown
                            label='KPI Category'
                            placeholder="Select KPI Category"
                            // options={yearOptions}
                            options={this.KPICategoryOptions()}
                            selectedKey={this.state.kpiFeedbackFormFields.KPICategory}
                            onChange={(ev, option) => this.handleFeedbackFields("KPICategory", option?.key)}
                            styles={dropdownStyles}
                            className='droupdown'
                        />
                        <TextField label="Feedback"
                            placeholder='Give your feedback here...'
                            value={this.state.kpiFeedbackFormFields.Description}
                            onChange={(ev, value) => this.handleFeedbackFields("Description", value)}
                            styles={textFieldParagraphProps} multiline
                            rows={5} />
                        <div style={{ textAlign: "right" }}><PrimaryButton className='btn-primary' text='Submit' onClick={() => this.handleSubmitFeedback()} /></div>
                        <div className='recent-feedback'>
                            <div className='feedback-title'>Recent Feedback</div>
                            {this.getFeedbacks().map((e) => {
                                return <div className='feedback-content'>
                                    <div className='i-col-12 text-right'>
                                        <IconButton className='deleteBtn'
                                            iconProps={{ iconName: 'Delete' }} title="Delete"
                                            onClick={() => this.handleDeleteFeedback(e.Id)}
                                            ariaLabel="Delete" />
                                    </div>
                                    <p>Category: {this.getKPICategoryNameById(e.KPICategoryId)}</p>
                                    <p>{e.Description}</p>
                                    <p>Date: {new Date(e.FeedbackCreated).toLocaleDateString()}</p>
                                </div>
                            })}
                        </div>
                    </Stack>
                </Panel>
            </>
        );
    }
}