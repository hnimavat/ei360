import { IAttachmentInfo } from "@pnp/sp/attachments";

export interface MultiuploaderProps {
   Name : string
   Attachments: IAttachmentInfo[];
   service: any;
   descriptionId: number;
}