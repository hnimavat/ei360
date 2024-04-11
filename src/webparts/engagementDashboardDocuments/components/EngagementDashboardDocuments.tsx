import * as React from 'react';
// import styles from './EngagementDashboardDocuments.module.scss';
import type { IEngagementDashboardDocumentsProps } from './IEngagementDashboardDocumentsProps';
import { DefaultButton, PrimaryButton, Checkbox } from '@fluentui/react';
import '../../common.css';
import { EDServices } from '../../../services/EDServices';
import { cloneDeep, groupBy } from '@microsoft/sp-lodash-subset';
import JSZip from 'jszip';
import { saveAs } from "file-saver";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

const url = new URL(window.location.href);
const accountName = url.searchParams.get("accountName");

export interface IEngagementDashboardDocumentsState {
    categoryChoices: Array<any>;
    libraryData: Array<any>;
    selectedFiles: Array<string>;
    categoryFilter: Array<string>;
}

export default class EngagementDashboardDocuments extends React.Component<IEngagementDashboardDocumentsProps, IEngagementDashboardDocumentsState> {
    spServices: EDServices;
    siteId: string;

    constructor(props: IEngagementDashboardDocumentsProps) {
        super(props);
        this.spServices = new EDServices(props.context);
        this.siteId = props.context.pageContext.site.id.toString();

        this.state = {
            categoryChoices: [],
            libraryData: [],
            selectedFiles: [],
            categoryFilter: []
        }

        this.screenInit();
    }

    private thumbnailgenerateUrl(siteAbsoluteUrl: string, siteid: string, UniqueId: any) {
        debugger;
        return `${siteAbsoluteUrl}/_api/v2.1/sites/${siteid}/items/${UniqueId}/driveItem/thumbnails/0/c400x99999/content?prefer=noRedirect`;
    };


    private async screenInit() {
        const categoryChoices = await this.spServices.getFieldsByListName(this.props.edLibraryName, "Category"); // getting the Category choices

        const edLibraryData = await this.spServices.getEDLibraryData(this.props.edLibraryName, `AccountName eq '${accountName}'`);
        // const categoryChoice = ["All"].concat(categoryChoices.Choices)
        console.log(edLibraryData);
        debugger;
        this.setState({
            categoryChoices: categoryChoices.Choices,
            libraryData: edLibraryData,
            categoryFilter: categoryChoices.Choices
        });
    }

    navigateToPreviousPage = () => {
        const source = url.searchParams.get("source");
        window.location.href = source + "?accountName=" + accountName;
    };

    private categorizedData() {
        let libraryData = this.filteredDate();
        const data = libraryData && groupBy(libraryData, "Category")
        return data;
    }

    private filteredDate() {
        let libraryData = cloneDeep(this.state.libraryData);

        if (this.state.categoryFilter) {
            libraryData = libraryData.filter((x) => this.state.categoryFilter.includes(x.Category))
        }

        return libraryData;
    }

    private getfileContent(url: string): Promise<any> {
        return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.arrayBuffer();
            })
            .catch((error: any) => {
                throw error;
            });
    }

    private async downloadFiles() {
        const files = this.state.selectedFiles;

        if (files.length) {
            const zip = new JSZip();
            const promises = files.map(async (document) => {
                const URL = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/GetFileByServerRelativeUrl('${this.props.context.pageContext.web.serverRelativeUrl}/${this.props.edLibraryName}/${document}')/OpenBinaryStream()`;
                return await this.getfileContent(URL).then((content) => {
                    zip.file(document, content);
                }).catch(error => console.log(error))
            });

            await Promise.all(promises).then(result => {
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                    saveAs(content, "Engagement/.zip");
                    // const blobUrl = URL.createObjectURL(content);
                    // window.open(blobUrl, '_blank');
                }).catch(error => console.log(error))
            }).catch(error => console.log(error));
        }
    };

    private handleChangeFilter(value: string) {
        let arr: any = cloneDeep(this.state.categoryFilter);
        if (value !== "All") {
            if (arr.includes(value)) {
                arr = arr.filter((x: string) => x != value);
            } else {
                arr = arr.concat(value);
            }
        } else {
            arr = this.state.categoryChoices.length === this.state.categoryFilter.length ? [] : this.state.categoryChoices;
        }

        debugger;

        this.setState({
            categoryFilter: arr,
            selectedFiles:[]
        });
    }

    private handleSelectFile(document: any, fileByCategory?: any) {
        if (!fileByCategory) {
            let arr: any = cloneDeep(this.state.selectedFiles);
            console.log(document);

            const fileName = document.File.Name;

            if (arr.includes(fileName)) {
                arr = arr.filter((x: string) => x != fileName);
            } else {
                arr = arr.concat(fileName);
            }

            this.setState({
                selectedFiles: arr
            })
        } else {
            let arr: any = cloneDeep(this.state.selectedFiles);
            let fileArr = fileByCategory.filter((x:any) => !this.state.selectedFiles.includes(x));
            fileArr.map((fileName: any) => {
                if (arr.includes(fileName)) {
                    arr = arr.filter((x: string) => x != fileName);
                } else {
                    arr = arr.concat(fileName);
                }
            });

            this.setState({
                selectedFiles: arr
            })
        }
    }

    public render(): React.ReactElement<IEngagementDashboardDocumentsProps> {

        // const docsImg = require('../assets/fileDocs.png');

        return (
            <>
                <div>
                    <ul className='breadcrumb'>
                        <li>
                            <a onClick={this.navigateToPreviousPage}>ENGAGEMENT DASHBOARD</a>
                        </li>
                        <li>{accountName} - Documents</li>
                    </ul>
                </div>
                <div className='dashboardDocuments_Wrap'>
                    <div className='filterBlock'>
                        <div className='filters'>
                            <div className='filtersInnerBlock'>
                                <div className='headerDiv'>
                                    Category Filters
                                </div>
                                <div className='bodyDiv'>
                                    <div className="card flex justify-content-center">
                                        <Checkbox label={"All"}
                                            checked={this.state.categoryFilter.length === this.state.categoryChoices.length}
                                            onChange={(ev, checked: boolean) => this.handleChangeFilter("All")} />
                                    </div>
                                    {this.state.categoryChoices.map((x) => {
                                        return <div className="card flex justify-content-center">
                                            <Checkbox label={x}
                                                checked={this.state.categoryFilter && this.state.categoryFilter.includes(x)}
                                                onChange={(ev, checked: boolean) => this.handleChangeFilter(x)} />
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='filtredContent'>
                            <div className='filtredInnerContent'>
                                <div className='headerDiv'>
                                    <div className='checkAll'>
                                        <Checkbox
                                            label="Select All to Download"
                                            checked={this.state.selectedFiles.length === this.filteredDate().length}
                                            onChange={(ev, checked) => {
                                                const fileNames = checked ? this.filteredDate().map((x) => x.File.Name) : [];
                                                this.setState({
                                                    selectedFiles: fileNames
                                                });
                                            }}
                                        />
                                    </div>
                                    <PrimaryButton
                                        text="Download"
                                        className='btn-primary'
                                        disabled={this.state.selectedFiles.length === 0}
                                        onClick={() => this.downloadFiles()}
                                    ></PrimaryButton>
                                </div>
                                <div className='bodyDiv'>
                                    {this.state.libraryData && Object.keys(this.categorizedData()).map((category) => {
                                        const fileNames = this.categorizedData()[category].map((x) => x.File.Name);
                                        return <div className='listing_block'>
                                            <div className='listing_header_block'>
                                                <div className='checkListing_all'>
                                                    <Checkbox
                                                        label={category}
                                                        checked={this.categorizedData()[category].length === this.state.selectedFiles.filter((x) => fileNames.includes(x)).length}
                                                        onChange={(ev, checked) => {
                                                            let fileArr = this.categorizedData()[category].map((x) => x.File.Name);
                                                            this.handleSelectFile(document, fileArr);
                                                        }}
                                                    />
                                                </div>
                                                {this.categorizedData()[category].length > 3 && <DefaultButton text="View All" className='btn-outline'></DefaultButton>}
                                            </div>
                                            <div className='listing_body_block'>
                                                <ul className='i-flex-3'>
                                                    {this.categorizedData()[category].slice(0, 3).map((document) => {
                                                        return <li>
                                                            <div className='i_docs_card'>
                                                                <Checkbox name='11'
                                                                    checked={this.state.selectedFiles && this.state.selectedFiles.includes(document.File.Name)}
                                                                    onChange={() => this.handleSelectFile(document)}
                                                                />
                                                                <div className='i_docs_img'>
                                                                    <img
                                                                        // src={require("../assets/fileDocs.png")}          
                                                                        src={this.thumbnailgenerateUrl(this.props.context.pageContext.web.absoluteUrl, this.siteId, document.File.UniqueId)}
                                                                        alt='' />
                                                                </div>
                                                                <div className='i_docs_dtls'>
                                                                    <h5 className='i_docs_header'>{document.Title}</h5>
                                                                    <p className='i_docs_body' >{document.DocumentDescription}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}