import axios from "axios";

export const getMachinesQuery = () => {
    return axios.get('/machine/view')
        .then(response => response.data)
        .then(machines => machines)
}

export const addMachineQuery = ({machineForm, machineCategories}) => {
    return axios.post('/machine/add', {
        machineCategory: machineForm.getFieldValue('MachineCategory'),
        machineCategoryID: machineCategories.find(category => category.machineType === machineForm.getFieldValue('machineCategory')).MachineCategoryID,
        machineName: machineForm.getFieldValue('MachineName'),
        machineCode: machineForm.getFieldValue('MachineCode'),
        plate: machineForm.getFieldValue('Plate'),
        driverName: machineForm.getFieldValue('DriverName') || '',
        model: machineForm.getFieldValue('Model') || '',
        company: machineForm.getFieldValue('Company') || '',
        serialNumber: machineForm.getFieldValue('SerialNumber') || '',
        chassisNumber: machineForm.getFieldValue('ChassisNumber') || '',
        functionType: machineForm.getFieldValue('FunctionType') || '',
        motorNumber: machineForm.getFieldValue('MotorNumber') || '',
        color: machineForm.getFieldValue('Color') || '',
        entryDateTime: machineForm.getFieldValue('EntryDateTime') || '',
        isActive: machineForm.getFieldValue('IsActive') === true ? 1 : 0,
    })
        .then(response => response.data)
        .then(result => result)
}

// export const updateMachineQuery = ({id, updatedData}) => {
//     return axios.put(`/machine/update/${id}`, {updatedData})
//         .then(response => response.data)
//         .then(result => result)
// }
//
// export const deleteMachineQuery = (id) => {
//     return axios.delete(`/machine/${id}/delete`)
//         .then(response => response.data)
//         .then(result => result)
// }