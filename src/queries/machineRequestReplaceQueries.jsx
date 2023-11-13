import axios from "axios";


export const getAllMachineRequestReplaceQuery = ({id}) => {
    return axios.get(`/machine/request/${id}/replace/view`)
        .then(response => response.data)
        .then(items => items)
}

export const addMachineRequestReplaceQuery = ({item, machineCategories, id}) => {
    return axios.post(`/machine/request/replace/add`, {
        MachineCategory: item,
        MachineCategoryID: machineCategories.find((category) => category.MachineType === item).MachineCategoryID,
        MachineRequestID: id,
    })
        .then(response => response.data)
        .then(result => result)
}