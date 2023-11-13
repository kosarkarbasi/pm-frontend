import axios from "axios";


export const getMachineCategoryPMItems = ({id}) => {
    return axios.get(`/machine/category/${id}/item/view`)
        .then(response => response.data)
        .then(items => items)
}


export const addMachineCategoryPMItemQuery = ({item, id}) => {
    return axios.post(`/machine/category/${id}/item/add`, {
        itemName: item.ItemName,
        isActive: item.IsActive === true ? 1 : 0,
        description: item.Description,
    })
        .then(response => response.data)
        .then(result => result)
}