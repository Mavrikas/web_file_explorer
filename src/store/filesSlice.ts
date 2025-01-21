import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Data } from './types';
import {
    createFileCall,
    deleteFileCall,
    getFileContentCall,
    getFilesCall,
    updateFileCall,
} from './services/api';

type initStateType = {
    files: Data[];
    selectedFile: Data | null;
    loading: boolean;
};
export const fetchFilesList = createAsyncThunk(
    'files/fetchFilesList',
    async () => {
        try {
            return await getFilesCall();
        } catch (error) {
            console.log(error);
        }
    }
);

export const fetchFileContent = createAsyncThunk(
    'files/fetchFileContent',
    async (path: string) => {
        try {
            return await getFileContentCall(path);
        } catch (error) {
            console.log(error);
        }
    }
);

export const updateFileContent = createAsyncThunk(
    'files/updateFileContent',
    async ({ path, content }: { path: string; content: string }) => {
        try {
            return await updateFileCall(path, content);
        } catch (error) {
            console.log(error);
        }
    }
);

export const createNewFile = createAsyncThunk(
    'files/createNewFile',
    async ({
        path,
        type,
        name,
        content,
    }: {
        path: string;
        type: string;
        name: string;
        content?: string;
    }) => {
        try {
            return await createFileCall(path, type, name, content);
        } catch (error) {
            console.log(error);
        }
    }
);
export const deleteFile = createAsyncThunk(
    'files/deleteFile',
    async ({ path }: { path: string }) => {
        try {
            return await deleteFileCall(path);
        } catch (error) {
            console.log(error);
        }
    }
);

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
        loading: false,
        files: [],
        selectedFile: null,
    } as initStateType,
    reducers: {
        setSelectedFile(state, action) {
            state.selectedFile = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFilesList.fulfilled, (state, action) => {
            state.files = action.payload;
        });
        builder.addCase(fetchFileContent.fulfilled, (state, action) => {
            state.selectedFile!.content = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchFileContent.pending, (state, action) => {
            state.loading = true;
        });
    },
});

export const { setSelectedFile } = filesSlice.actions;

export const loadingSelector = (state: any) => state.files.loading;
export const filesSelector = (state: any) => state.files.files;
export const selectedFileSelector = (state: any) => state.files.selectedFile;
