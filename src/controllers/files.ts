import axios from 'axios';
import { dummyData } from '../../data/data';

export const getFiles = () => {
    return dummyData;
    // return axios
    //     .get('http://localhost:4000/')
    //     .then((response) => {
    //         console.log(response.data);
    //         return response.data;
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
};
