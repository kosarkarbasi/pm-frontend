import axios from "axios";

export const getUnitsQuery = () => {
    return axios.get('/unit/view')
        .then(response => response.data)
        .then(units => units)
}

export const addUnitQuery = ({unitForm}) => {
    return axios.post('/unit/add', {
        unitName: unitForm.getFieldValue('unitName'),
        managerName: unitForm.getFieldValue('managerName')
    })
        .then(response => response.data)
        .then(result => result)
}

export const updateUnitQuery = ({id, updatedData}) => {
    return axios.put(`/unit/update/${id}`, {updatedData})
        .then(response => response.data)
        .then(result => result)
}

export const deleteUnitQuery = (id) => {
    return axios.delete(`/unit/${id}/delete`)
        .then(response => response.data)
        .then(result => result)
}