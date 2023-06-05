import { FileTypeEnum, EventAttahcmentAllowedActions } from './enum';
export class EventAttachmentModel {
    id: string;
    name: string;
    url!: string;
    size: number;
    type: FileTypeEnum;
    allowedActions: EventAttahcmentAllowedActions[]
}
