export interface MessageDTOType {
    id?: number;
    sender: number;
    receiver: number;
    message: string;
    createdAt: Date;
}
