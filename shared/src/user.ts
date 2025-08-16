export interface UserDTOType {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
}

export interface UserEditableData {
    name: string;
    email: string;
}
