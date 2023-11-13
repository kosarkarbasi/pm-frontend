import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addUnitQuery, deleteUnitQuery, getUnitsQuery, updateUnitQuery} from "../../queries/unitQueries";

export const getAllUnits = createAsyncThunk("unit/getAllUnits", async ({messageApi}) => {
        const response = await getUnitsQuery();
        if (response.code === 415) {
            return response.data.map(unit => ({
                key: unit.UnitID,
                UnitName: unit.UnitName,
                ManagerName: unit.ManagerName
            }))
        } else if (response.code === 412) {
            messageApi.open({
                type: 'error',
                content: 'خطایی رخ داده است',
            });
        }
    }
)

export const addUnit = createAsyncThunk("unit/addUnit", async ({unitForm, messageApi}) => {
        const response = await addUnitQuery({unitForm});
        if (response.code === 415) {
            unitForm.resetFields()
            messageApi.open({
                type: 'success',
                content: 'واحد جدید با موفقیت افزوده شد',
            });
            return response.data;
        } else if (response.code === 412) {
            messageApi.open({
                type: 'error',
                content: 'خطایی رخ داده است',
            });
        }
    }
)


export const updateUnit = createAsyncThunk("unit/updateUnit", async ({id, updatedData, messageApi}) => {
        try {
            const response = await updateUnitQuery({id, updatedData});
            if (response.code === 415) {
                messageApi.open({
                    type: 'success',
                    content: 'واحد با موفقیت ویرایش گردید',
                });
                return response.data;
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

export const deleteUnit = createAsyncThunk("unit/deleteUnit", async ({key, messageApi}) => {
        try {
            const response = await deleteUnitQuery(key);
            if (response.code === 415) {
                messageApi.open({
                    type: 'success',
                    content: 'واحد با موفقیت حذف شد',
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

const unitSlice = createSlice({
    name: "unit",
    initialState: {
        unit: {},
        units: [],
        error: "",
        loading: false,
    },
    extraReducers: {
        // [getAllUnits.fulfilled]: (state, { payload }) => {
        //     return { ...state, units: payload };
        // },
        // ----------------------------------------------------------------- get

        [getAllUnits.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllUnits.fulfilled]: (state, action) => {
            state.loading = false;
            state.units = action.payload;
        },
        [getAllUnits.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- add

        [addUnit.pending]: (state, action) => {
            state.loading = true;
        },
        [addUnit.fulfilled]: (state, {payload}) => {
            const newUnit = {
                key: payload.UnitID,
                UnitName: payload.UnitName,
                ManagerName: payload.ManagerName,
            }
            state.loading = false;
            state.units = [...state.units, newUnit];
        },
        [addUnit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- update
        [updateUnit.pending]: (state, action) => {
            state.loading = true;
        },
        [updateUnit.fulfilled]: (state, action) => {
            state.loading = false;
            const {
                arg: {id},
            } = action.meta;
            if (id) {
                state.units = state.units.map((item) =>
                    item.key === id ? action.payload : item
                );
            }
        },
        [updateUnit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- delete

        [deleteUnit.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteUnit.fulfilled]: (state, action) => {
            state.loading = false;
            const {arg: {key},} = action.meta;
            if (key) {
                state.units = state.units.filter((item) => item.key !== key);
            }
        },
        [deleteUnit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

    },
});

// export const {setCurrentPage} = unitSlice.actions;
export const selectUnits = (state) => state.unit.units;

export default unitSlice.reducer;