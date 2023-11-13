import axios from "axios";

export const getAllMachineRequestQuery = () => {
    return axios.get(`/machine/request/view`)
        .then(response => response.data)
        .then(items => items)
}


export const addMachineRequestQuery = ({machineRequestForm, machineCategories}) => {
    return axios.post(`/machine/request/add`, {
        RequestDate: machineRequestForm.getFieldValue('RequestDate'),
        ApplicantName: machineRequestForm.getFieldValue('ApplicantName')||'admin',
        ApplicantUnit: machineRequestForm.getFieldValue('ApplicantUnit')|| '',
        MachineCategory: machineRequestForm.getFieldValue('MachineCategory'),
        MachineCategoryID: machineCategories.find(category => category.MachineType === machineRequestForm.getFieldValue('MachineCategory')).MachineCategoryID,
        RequestFromDate: machineRequestForm.getFieldValue('RequestFromDateToDate')[0],
        RequestToDate: machineRequestForm.getFieldValue('RequestFromDateToDate')[1],
        RequestWorkTime: machineRequestForm.getFieldValue('RequestWorkTime'),
        WorkPlace: machineRequestForm.getFieldValue('WorkPlace'),
        WorkType: machineRequestForm.getFieldValue('WorkType'),
        WorkDescription: machineRequestForm.getFieldValue('WorkDescription'),
    })
        .then(response => response.data)
        .then(result => result)
}