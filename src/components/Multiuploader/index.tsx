import React from "react";
import type { MultiuploaderProps } from './MultiuploaderProps.js';
import { IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import './style.css';
import { Toaster, toast } from "react-hot-toast";

interface FileUploadState {
    files: any;
    progress: number;
    isDraggingOver: boolean;
}

class Multiuploader extends React.Component<MultiuploaderProps, FileUploadState> {
    constructor(props: MultiuploaderProps) {
        super(props);
        this.state = {
            files: null,
            progress: 35,
            isDraggingOver: false,
        };
    }

    handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            this.props.Attachments.push({
                FileName : e.target.files[0].name,
                FileNameAsPath : {
                    DecodedUrl: ''
                },
                ServerRelativePath: {
                    DecodedUrl: ''
                },
                ServerRelativeUrl: ''
            });
            this.setState({ files: e.target.files[0] });
            console.log('descriptionId :: ', this.props.descriptionId)
            await this.props.service.addAttachments(this.props.descriptionId, e.target.files[0]); //need to do dynamic
            console.log('Attechment added successfully.....')
            toast.success('Attechment added successfully.')
        }
    }

    handleDeleteFile = async (fileName: string) => {
        console.log('Going to delete :: ', fileName)
        await this.props.service.deleteAttachments(this.props.descriptionId, fileName); //need to do dynamic
        toast.success('Attechment deleted successfully.')
        //this.props.Attachments
        this.setState({files : null});
        window.location.reload() // need to do dynamic
    }

    handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        this.setState({ isDraggingOver: true });
    };

    handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        this.setState({ isDraggingOver: true });
    };

    handleDragLeave = () => {
        this.setState({ isDraggingOver: false });
    };

    handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        this.setState({ isDraggingOver: false });

        if (e.dataTransfer.files.length > 0) {
            this.setState({ files: e.dataTransfer.files[0] });
        }
    };

    handleUpload = async () => {
        // Your upload logic here
    };

    componentDidUpdate(): void {
        console.log("Files", this.state.files)
    }

    public render(): React.ReactElement<MultiuploaderProps> {
        const { isDraggingOver } = this.state;
        const { Attachments } = this.props;
        console.log('Attachments in index :: ', Attachments);

        return (
            <>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="fileUploder">
                    <label                       
                        className={`filerDragDrop ${isDraggingOver ? 'drag-over' : ''}`}
                        onDragOver={this.handleDragOver}
                        onDragEnter={this.handleDragEnter} 
                        onDragLeave={this.handleDragLeave}
                        onDrop={this.handleDrop}
                        htmlFor="fileUploderId"
                    >
                        <span>Drag and drop</span> files here or<br />  
                        <span>browse</span> to begin upload
                    </label>
                    <input id="fileUploderId" type="file" multiple onChange={this.handleFileChange} />

                    {/* <div className="progessBar_wrap" >
                        <div className="progress_details">
                            <div className="file_icon"><Icon iconName="FileImage" /></div>
                            <div className="file_Name">img1.png</div>
                            <div className="progress_counter">35%</div>
                        </div>
                        <div className="progresing_bar">
                            
                            <div className="progressBar">
                                <div className="activeProgressbar" style={{ width: `${this.state.progress}%` }} ></div>
                            </div>
                            <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" />
                        </div>
                    </div> */}

                    <div className="fileUploaded_list">
                        <ul>
                            {Attachments.map((file, index) => (
                                <li key={index}>
                                    <div className="fileAdded_wrap">
                                        <div className="file_icon"><Icon iconName="FileImage" /></div>
                                        <div className="file_Name">{file.FileName}</div>
                                        <IconButton 
                                            className="deleteBtn" 
                                            iconProps={{ iconName: 'Delete' }} 
                                            title="Delete" 
                                            ariaLabel="Delete"
                                            onClick={() => this.handleDeleteFile(file.FileName)}
                                         />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

export default Multiuploader;
