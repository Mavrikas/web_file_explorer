import axios from 'axios';

export const API_URL = 'http://localhost:4000';
export const getFilesCall = () => {
    return axios
        .get(API_URL + '/files')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
};

export const getFileContentCall = (path: string) => {
    return axios
        .get(API_URL + '/file/' + path)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
};

export const updateFileCall = (path: string, content: string) => {
    return axios
        .put(API_URL + '/file/', { path: path, content: content })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
};

export const createFileCall = (
    path: string,
    type: string,
    name: string,
    content?: string | []
) => {
    return axios
        .post(API_URL + '/file/', {
            path: path,
            content: content,
            type: type,
            name: name,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
};

export const deleteFileCall = (path: string) => {
    return axios
        .delete(API_URL + '/file/', { data: { path: path } })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
};
