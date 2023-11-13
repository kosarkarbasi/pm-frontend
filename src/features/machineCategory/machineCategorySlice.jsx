import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    addMachineCategoryQuery,
    deleteMachineCategoryQuery,
    getMachineCategoriesQuery,
    updateMachineCategoryQuery
} from "../../queries/machineCategoryQueries";
import {addMachineCategoryPMItemQuery, getMachineCategoryPMItems} from "../../queries/machineCategoryPMItemQueries";

export const getAllMachineCategories = createAsyncThunk("machineCategory/getAllMachineCategories", async ({messageApi}) => {
        try {
            const response = await getMachineCategoriesQuery();
            if (response.code === 415) {
                return await Promise.all(response.data.map(async (machineCategory) => {
                    const items = await getMachineCategoryPMItems({id: machineCategory.MachineCategoryID})
                    if (items.code === 415) {
                        machineCategory.MachineCategoryPMItems = items.data
                        machineCategory.key = machineCategory.MachineCategoryID
                        return machineCategory
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

export const addMachineCategory = createAsyncThunk("machineCategory/addMachineCategory",
    async ({
               pmItems,
               machineCategoryForm,
               messageApi,
               setOpenModal
           }, {dispatch, getState}) => {
        try {
            const {units} = getState().unit;
            const response = await addMachineCategoryQuery({machineCategoryForm, units});
            if (response.code === 415) {
                const machineCategoryData = response.data
                if (machineCategoryData.machineCategoryID && pmItems.length > 0) {
                    machineCategoryForm.resetFields()
                    pmItems.map(async item => {
                        const result = await addMachineCategoryPMItemQuery({item, id: response.data.machineCategoryID})
                        if (result.code === 415) {
                            dispatch(getAllMachineCategories({messageApi}))
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

export const updateMachineCategory = createAsyncThunk("machineCategory/updateMachineCategory",
    async ({id, machineCategoryForm, messageApi}, {dispatch, getState}) => {
        try {
            const {units} = getState().unit;
            const response = await updateMachineCategoryQuery({id, machineCategoryForm, units});
            if (response.code === 415) {
                const items = await getMachineCategoryPMItems({id: response.data.machineCategoryID})
                if (items.code === 415) {
                    response.data.MachineCategoryPMItems = items.data
                    response.data.key = response.data.machineCategoryID
                    return response.data
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'خطایی رخ داده است',
                    });
                    return response.data
                }
            } else if (response.code === 412) {
                messageApi.open({
                    type: 'error',
                    content: 'خطایی رخ داده است',
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
);

export const deleteMachineCategory = createAsyncThunk("machineCategory/deleteMachineCategory", async ({
                                                                                                          key,
                                                                                                          messageApi
                                                                                                      }) => {
        try {
            const response = await deleteMachineCategoryQuery(key);
            if (response.code === 415) {
                messageApi.open({
                    type: 'success',
                    content: 'دسته‌بندی با موفقیت حذف شد',
                });
            }
            if (response.code === 412) {
                messageApi.open({
                    type: 'error',
                    content: 'خطایی رخ داده است',
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
);

const machineCategorySlice = createSlice({
    name: "machineCategory",
    initialState: {
        machineCategory: {},
        machineCategories: [],
        error: "",
        loading: false,
    },
    extraReducers: {

        // ----------------------------------------------------------------- get

        [getAllMachineCategories.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllMachineCategories.fulfilled]: (state, action) => {
            state.loading = false;
            state.machineCategories = action.payload;
        },
        [getAllMachineCategories.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- add

        [addMachineCategory.pending]: (state, action) => {
            state.loading = true;
        },
        [addMachineCategory.fulfilled]: (state, {payload}) => {
            state.loading = false;
            state.machineCategory = [payload]
            state.machineCategories = [...state.machineCategories, payload];
        },
        [addMachineCategory.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- update
        [updateMachineCategory.pending]: (state, action) => {
            state.loading = true;
        },
        [updateMachineCategory.fulfilled]: (state, action) => {
            state.loading = false;
            const {
                arg: {id},
            } = action.meta;
            if (id) {
                state.machineCategories = state.machineCategories.map((item) =>
                    item.key === id ? action.payload : item
                );
            }
        },
        [updateMachineCategory.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- delete
        [deleteMachineCategory.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteMachineCategory.fulfilled]: (state, action) => {
            state.loading = false;
            const {arg: {key},} = action.meta;
            if (key) {
                state.machineCategories = state.machineCategories.filter((item) => item.key !== key);
            }
        },
        [deleteMachineCategory.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

    },
});

// export const {setCurrentPage} = unitSlice.actions;
export const selectMachineCategories = (state) => state.machineCategory.machineCategories;

export default machineCategorySlice.reducer;