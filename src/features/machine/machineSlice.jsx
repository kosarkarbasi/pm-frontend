import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addMachineQuery, getMachinesQuery} from "../../queries/machineQueries";
import {addMachineServiceQuery, getMachineServicesQuery} from "../../queries/machineServiceQueries";
import {addEventQuery} from "../../queries/eventQueries";

export const getAllMachines = createAsyncThunk("machine/getAllMachines", async ({messageApi}) => {
        try {
            const response = await getMachinesQuery()
            if (response.code === 415) {
                return await Promise.all(response.data.map(async (machine) => {
                    const items = await getMachineServicesQuery({id: machine.MachineID})
                    if (items.code === 415) {
                        machine.MachineServices = items.data
                        machine.key = machine.MachineID
                        return machine
                    } else {
                        return response.data
                    }
                }))
            } else if (response.code === 412) {
                messageApi.open({
                    type: 'error',
                    content: 'خطایی رخ داده است',
                });
                return response.data
            }
        } catch (e) {
            console.log(e)
        }
    }
)

export const addMachine = createAsyncThunk("machine/addMachine",
    async ({
               machineForm,
               messageApi,
               setOpenModal
           }, {dispatch, getState}) => {
        try {
            const {machineCategories} = getState().machineCategory;
            const response = await addMachineQuery({machineForm, machineCategories});
            if (response.code === 415) {
                if (response.data.MachineID && machineForm.getFieldValue('MachineServices').length > 0) {
                    machineForm.getFieldValue('MachineServices').map(async service => {
                        const {enums} = getState().enum;
                        const result = await addMachineServiceQuery({service, enums, id: response.data.MachineID})
                        if (result.code === 415) {
                            machineForm.resetFields()
                            dispatch(getAllMachines({messageApi}))
                            setOpenModal(false)
                        } else {
                            messageApi.open({
                                type: 'error',
                                content: 'خطایی رخ داده است',
                            });
                        }
                    })
                } else {
                    messageApi.open({
                        type: 'success',
                        content: 'دسته‌بندی جدید با موفقیت اضافه شد',
                    });
                    setOpenModal(false)
                }

                if (machineForm.getFieldValue('DriverName')) {
                    const response = await addEventQuery({
                        EventType: 'add',
                        TableName: 'machine',
                        ChangedField: 'DriverName',
                        OldValue: null,
                        NewValue: machineForm.getFieldValue('DriverName'),
                    })
                    if (response.code === 415) {
                        console.log('event added')
                    }
                }

            } else if (response.code === 412) {
                messageApi.open({
                    type: 'error',
                    content: 'خطایی رخ داده است',
                });
            }
        } catch (e) {
            console.log('in catch', e)
            messageApi.open({
                type: 'error',
                content: 'خطایی رخ داده است',
            });
        }
    }
)

// export const updateMachine = createAsyncThunk("machine/updateMachine",
//     async ({id, machineForm, messageApi}, {dispatch, getState}) => {
//         try {
//             const {units} = getState().unit;
//             const response = await updateMachineQuery({id, machineForm, units});
//             if (response.code === 415) {
//                 const items = await getMachinePMItems({id: response.data.machineID})
//                 if (items.code === 415) {
//                     response.data.MachinePMItems = items.data
//                     response.data.key = response.data.machineID
//                     return response.data
//                 } else {
//                     messageApi.open({
//                         type: 'error',
//                         content: 'خطایی رخ داده است',
//                     });
//                     return response.data
//                 }
//             } else if (response.code === 412) {
//                 messageApi.open({
//                     type: 'error',
//                     content: 'خطایی رخ داده است',
//                 });
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }
// );

// export const deleteMachine = createAsyncThunk("machine/deleteMachine", async ({key, messageApi}) => {
//         try {
//             const response = await deleteMachineQuery(key);
//             if (response.code === 415) {
//                 messageApi.open({
//                     type: 'success',
//                     content: 'دسته‌بندی با موفقیت حذف شد',
//                 });
//             }
//             if (response.code === 412) {
//                 messageApi.open({
//                     type: 'error',
//                     content: 'خطایی رخ داده است',
//                 });
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }
// );

const machineSlice = createSlice({
    name: "machine",
    initialState: {
        machine: {},
        machines: [],
        error: "",
        loading: false,
    },
    extraReducers: {

        // ----------------------------------------------------------------- get

        [getAllMachines.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllMachines.fulfilled]: (state, action) => {
            state.loading = false;
            state.machines = action.payload;
        },
        [getAllMachines.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- add

        [addMachine.pending]: (state, action) => {
            state.loading = true;
        },
        [addMachine.fulfilled]: (state, {payload}) => {
            state.loading = false;
            state.machine = [payload]
            console.log('payload: ', payload)
            state.machines = [...state.machines, payload];
        },
        [addMachine.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- update
        // [updateMachineCategory.pending]: (state, action) => {
        //     state.loading = true;
        // },
        // [updateMachineCategory.fulfilled]: (state, action) => {
        //     state.loading = false;
        //     const {
        //         arg: {id},
        //     } = action.meta;
        //     if (id) {
        //         state.machineCategories = state.machineCategories.map((item) =>
        //             item.key === id ? action.payload : item
        //         );
        //     }
        // },
        // [updateMachineCategory.rejected]: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload.message;
        // },

        // ----------------------------------------------------------------- delete
        // [deleteMachineCategory.pending]: (state, action) => {
        //     state.loading = true;
        // },
        // [deleteMachineCategory.fulfilled]: (state, action) => {
        //     state.loading = false;
        //     const {arg: {key},} = action.meta;
        //     if (key) {
        //         state.machineCategories = state.machineCategories.filter((item) => item.key !== key);
        //     }
        // },
        // [deleteMachineCategory.rejected]: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload.message;
        // },

    },
});

export const selectMachines = (state) => state.machine.machines;

export default machineSlice.reducer;