import axios from "axios";

export const getMachineServicesQuery = ({id}) => {
    return axios.get(`/machine/${id}/service/view`)
        .then(response => response.data)
        .then(items => items)
}


export const addMachineServiceQuery = ({service, enums, id}) => {
    return axios.post(`/machine/${id}/service/add`, {
        serviceableComponent: service.ServiceableComponent,
        replacementTime: service.ReplacementTime,
        volumeStandard: service.VolumeStandard,
        commodityUnit: service.CommodityUnit,
        commodityUnitID: service.CommodityUnit ? enums.find(eachEnum => eachEnum.Title === service.CommodityUnit).EnumID : service.CommodityUnit,
        isActive: service.IsActive === true ? 1 : 0,
        description: service.Description,
    })
        .then(response => response.data)
        .then(result => result)
}