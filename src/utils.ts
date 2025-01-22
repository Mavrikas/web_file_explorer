export const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const getFileType = (name: string) => {
    return name.split('.').pop()!;
};
