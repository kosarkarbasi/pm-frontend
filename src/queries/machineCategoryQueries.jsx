import axios from "axios";

export const addMachineCategoryQuery = ({machineCategoryForm, units}) => {
    return axios.post('/machine/category/add', {
        machineType: machineCategoryForm.getFieldValue('MachineType'),
        machineCode: machineCategoryForm.getFieldValue('MachineCode'),
        categoryName: machineCategoryForm.getFieldValue('CategoryName'),
        categoryCode: machineCategoryForm.getFieldValue('CategoryCode'),
        isTimeEffective: machineCategoryForm.getFieldValue('IsTimeEffective') === true ? 1 : 0,
        unit: units.find(unit => unit.UnitName === machineCategoryForm.getFieldValue('UnitName')),
    })
        .then(response => response.data)
        .then(result => result)
}


export const getMachineCategoriesQuery = () => {
    return axios.get('/machine/category/view')
        .then(response => response.data)
        .then(units => units)
}


export const updateMachineCategoryQuery = ({id, machineCategoryForm, units}) => {
    return axios.put(`/machine/category/${id}/update`, {
        machineType: machineCategoryForm.getFieldValue('MachineType'),
        machineCode: machineCategoryForm.getFieldValue('MachineCode'),
        categoryName: machineCategoryForm.getFieldValue('CategoryName'),
        categoryCode: machineCategoryForm.getFieldValue('CategoryCode'),
        isTimeEffective: machineCategoryForm.getFieldValue('IsTimeEffective') === true ? 1 : 0,
        unit: units.find(unit => unit.UnitName === machineCategoryForm.getFieldValue('UnitName')),
    })
        .then(response => response.data)
        .then(result => result)
}


export const deleteMachineCategoryQuery = (id) => {
    return axios.delete(`/machine/category/${id}/delete`)
        .then(response => response.data)
        .then(result => result)
}


