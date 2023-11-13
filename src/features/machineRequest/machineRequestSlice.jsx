import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addMachineRequestQuery, getAllMachineRequestQuery,} from "../../queries/machineRequestQueries";
import {
    addMachineRequestReplaceQuery,
    getAllMachineRequestReplaceQuery
} from "../../queries/machineRequestReplaceQueries";

export const getAllMachineRequests = createAsyncThunk("machineRequest/getAllMachineRequests", async ({messageApi}) => {
        try {
            const response = await getAllMachineRequestQuery();
            if (response.code === 415) {
                return await Promise.all(response.data.map(async (machineRequest) => {
                    const items = await getAllMachineRequestReplaceQuery({id: machineRequest.MachineRequestID})
                    if (items.code === 415) {
                        machineRequest.ReplaceMachine = items.data
                        machineRequest.key = machineRequest.MachineRequestID
                        return machineRequest
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

export const addMachineRequest = createAsyncThunk("machineRequest/addMachineRequest",
    async ({
               machineRequestForm,
               machineCategories,
               messageApi,
               setOpenModal
           }, {dispatch, getState}) => {
        try {
            const response = await addMachineRequestQuery({machineRequestForm, machineCategories});
            if (response.code === 415) {
                const machineRequestData = response.data
                if (machineRequestData.MachineRequestID && machineRequestForm.getFieldValue('ReplaceMachine') && machineRequestForm.getFieldValue('ReplaceMachine').length > 0) {
                    machineRequestForm.getFieldValue('ReplaceMachine').map(async item => {
                        const result = await addMachineRequestReplaceQuery({
                            item,
                            machineCategories,
                            id: machineRequestData.MachineRequestID
                        })
                        if (result.code === 415) {
                            machineRequestForm.resetFields()
                            dispatch(getAllMachineRequests({messageApi}))
                        } else {
                            messageApi.open({
                                type: 'error',
                                content: 'خطایی رخ داده است',
                            });
                        }
                    })
                }
                console.log('in success')
                messageApi.open({
                    type: 'success',
                    // content: `درخواست جدید به شماره ${machineRequestData.RequestNumber} با موفقیت اضافه شد`,
                    content: 'shod'
                });
                setOpenModal(false)
            } else if (response.code === 412) {
                messageApi.open({
                    type: 'error',
                    content: 'خطایی رخ داده است',
                });
            }
        } catch
            (e) {
            console.log('in catch', e)
            messageApi.open({
                type: 'error',
                content: 'خطایی رخ داده است',
            });
        }
    }
)

const machineCategorySlice = createSlice({
    name: "machineRequest",
    initialState: {
        machineRequest: {},
        machineRequests: [],
        error: "",
        loading: false,
    },
    extraReducers: {

        // ----------------------------------------------------------------- get

        [getAllMachineRequests.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllMachineRequests.fulfilled]: (state, action) => {
            state.loading = false;
            state.machineRequests = action.payload;
        },
        [getAllMachineRequests.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- add

        [addMachineRequest.pending]: (state, action) => {
            state.loading = true;
        },
        [addMachineRequest.fulfilled]: (state, {payload}) => {
            state.loading = false;
            state.machineRequest = [payload]
            state.machineRequests = [...state.machineRequests, payload];
        },
        [addMachineRequest.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

    },
});

// export const {setCurrentPage} = unitSlice.actions;
export const selectMachineRequests = (state) => state.machineRequest.machineRequests;

export default machineCategorySlice.reducer;