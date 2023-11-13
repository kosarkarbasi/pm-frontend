import axios from "axios";

export const addEventQuery = (event) => {
    return axios.post('/event/add', event)
        .then(response => response.data)
        .then(result => result)
}