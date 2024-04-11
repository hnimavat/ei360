import * as React from "react";
// import styles from './EngagementDashboardDescriptionEdit.module.scss';
import type { IEngagementDashboardDescriptionEditProps } from "./IEngagementDashboardDescriptionEditProps";
import Multiuploader from "../../../components/Multiuploader";
import {
  DefaultButton,
 // ITextFieldStyles,
  Link,
  //TextField,
} from "@fluentui/react";
import "../../common.css";
import { EDServices } from "../../../services/EDServices";
import { IDescription } from '../../../model/IDescription';

import { IAttachmentInfo } from "@pnp/sp/attachments";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface ComponentStates {
  description: IDescription[];
  updateDescription: IDescription;
  AccountName: string;
  attachments: IAttachmentInfo[];
}

export default class EngagementDashboardDescriptionEdit extends React.Component<
  IEngagementDashboardDescriptionEditProps, ComponentStates,
  {}
> {

  private edServices: EDServices;

  constructor(props: IEngagementDashboardDescriptionEditProps) {
    super(props);
    this.state = {
      description: [], // Initialize description as an empty array
      updateDescription:{
        ID: 0,
        Account_Name: null,
        AccountNameId: 0,
        AttachmentFiles: [],
        Description: ''
      },
      AccountName: '',
      attachments: [],
    };
    this.edServices = new EDServices(props.context);
  }

  public async componentDidMount(): Promise<void> {
    console.log("componentDidMount called..");
    // const data = sessionStorage.getItem(KeyAccountName);
    // console.log("Description Edit", data);

    const urlParams = new URLSearchParams(window.location.search);
    const accountNameString: string | null = urlParams.get("accountName");
    const accountName: string = accountNameString !== null ? accountNameString : '';
    console.log('accountName for description edit :: ', accountName)
    
    this.setState({AccountName : accountName})

    // Fetch dynamic data and update state
    await this.getDescription(accountName)
    await this.getAttachments(accountName) 
  }

  public async getDescription(accountName: string): Promise<void> {
    // Use your SharePoint service or API to fetch Description data
    try {
      const description: IDescription[] = await this.edServices.getListDataWithFilter('Description', `Account_Name eq '${accountName}'`)
      console.log('description :: ', description)
      this.setState({ description: description});

      if(description.length > 0 ){
        this.setState({ updateDescription: {
          ID : description[0].ID,
          Account_Name : description[0].Account_Name,
          AccountNameId : description[0].AccountNameId,
          AttachmentFiles : description[0].AttachmentFiles,
          Description: description[0].Description
        }});
      }
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  }

  private async getAttachments(accountName: string): Promise<void> {
    // Use your SharePoint service or API to fetch Description data
    try {
      const attachments: IAttachmentInfo[] = await this.edServices.getDescriptionAttachments(accountName)
      console.log('attachments :: ', attachments)
      this.setState({ attachments: attachments });
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  }

  private async saveOrUpdateDescription(description: IDescription){
    console.log('saveOrUpdateDescription called....')
    let result: boolean = false

    try {
      if (description.Description != '') {
        if (description.ID != 0) {
          await this.edServices.updateItem('Description', description.ID, {
            Description: description.Description
          });
          console.log("Meetings details updated successfully.");
          result = true;
        } else {
          await this.edServices.createItem('Description', {
            Description: description.Description,
            AccountName: this.state.AccountName
          })
          console.log("New Meetings details added successfully.");
          result = true;
        }
      }
    } catch (error) {
      console.error("Error saving or updating account details:", error);
      result = false;
    }

    if(result === true){
      let urlParams = new URLSearchParams(window.location.search);
      window.location.href = 
        `${this.props.context.pageContext.web.absoluteUrl}/SitePages/engagementDashboardDescription.aspx?accountName=${urlParams.get("accountName")}&source=${window.location.href.split("?")[0]}`
    }
  }

  handleMeetingsTextFieldChange(fieldName: any, value: any, key: any) {
    console.log('fieldName :: ', fieldName);
    console.log('value :: ', value);
    console.log('Description :: ', this.state.updateDescription);

    //await this.setMeetingDateAndTime();

    this.setState({
      updateDescription: {
        ...this.state.updateDescription,
        [fieldName]: value
      }
    });
  }


  // navigateToPreviousPage = () => {
  //   const currentUrl = window.location.href;
  //   const sourceParam = "?source=" + encodeURIComponent(currentUrl);
  //   window.location.href =
  //     "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx" +
  //     sourceParam;
  // };

  public render(): React.ReactElement<IEngagementDashboardDescriptionEditProps> {
    // const textFieldParagraphProps: Partial<ITextFieldStyles> = {
    //   wrapper: { fontFamily: "Poppins" },
    //   fieldGroup: { border: "1px solid #D7DADE", color: "#D7DADE" },
    //   description: {
    //     fontFamily: "Poppins",
    //     color: "#74788D",
    //     fontSize: 11,
    //     lineHeight: 17,
    //     fontWeight: 500,
    //     fontStyle: "italic",
    //   },
    // };

    let urlParams = new URLSearchParams(window.location.search);
    const siteUrl = this.props.context.pageContext.web.absoluteUrl;
    // const SourceUrl = urlParams.get("source");
    // const splitUrl = SourceUrl?.split("?")[0];

    return (
      <>
        <div className="d-flex justify-between align-items-center">
          <ul className="breadcrumb">
            <li>
              {/* <a onClick={this.navigateToPreviousPage}>engagement dashboard</a> */}
              <Link
                href={`${siteUrl}/SitePages/Engagement_Dashboard.aspx?accountName=${urlParams.get("accountName")}`}
              >
                engagement dashboard
              </Link>
            </li>
            <li>
              <Link
                href={`${siteUrl}/SitePages/engagementDashboardDescription.aspx?accountName=${urlParams.get("accountName")}&source=${window.location.href.split("?")[0]}`}
              >
                Engagement Description
              </Link>
            </li>
            <li>edit</li>
          </ul>
          <div className="d-flex i-gap-10">
            <DefaultButton
              className="btn-outline"
              text="Cancel"
              href={`${siteUrl}/SitePages/engagementDashboardDescription.aspx?accountName=${urlParams.get("accountName")}&source=${window.location.href.split("?")[0]}`}
            />
            <DefaultButton className="btn-primary" text="Save" onClick={ () => this.saveOrUpdateDescription(this.state.updateDescription)}/>
          </div>
        </div>
        <div>
          <div className="i-row">
            <div className="i-col-12 i-mb-20">
              {/* <TextField
                label="Engagement Description"
                styles={textFieldParagraphProps}
                multiline
                rows={6}
                placeholder="Description..."
                description="Press enter key to create a new bullet point."
                value={this.state.updateDescription ? this.state.updateDescription.Description : ''}
                onChange={(event, value) => this.handleMeetingsTextFieldChange('Description', value, null)}
              /> */}
              <CKEditor   
                editor={ClassicEditor}
                data={this.state.updateDescription.Description}
                onChange={(event, editor) => this.handleMeetingsTextFieldChange('Description', editor.getData(), null)}
              />
            </div>
            <div className="i-col-4">
              <Multiuploader Name={"hello"}  Attachments={this.state.attachments} service={this.edServices} descriptionId={this.state.updateDescription.ID}/>
            </div>
          </div>
        </div>
      </>
    );
  }
}
