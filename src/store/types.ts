export type Data = {
    id: string;
    name: string;
    path: string;
    content: string | Data[];
};

export type FileTypes = 'txt' | 'json' | 'png';

export type FolderType = 'folder';

export type CreateItemTypes = FileTypes | FolderType;
