import axios from "axios";

export const getEnumValuesQuery = (category) => {
    return axios.get(`/enum/${category}`)
        .then(response => response.data)
        .then(data => data)
        .catch(error => error)
}