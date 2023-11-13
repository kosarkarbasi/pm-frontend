import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getEnumValuesQuery} from "../../queries/enumQueries";

export const getEnumCategory = createAsyncThunk("enum/getEnumCategory", async ({messageApi, category}) => {
        try {
            const response = await getEnumValuesQuery(category)
            if (response.code === 415) {
                return response.data;
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

const machineSlice = createSlice({
    name: "enum",
    initialState: {
        enum: {},
        enums: [],
        error: "",
        loading: false,
    },
    extraReducers: {

        // ----------------------------------------------------------------- get

        [getEnumCategory.pending]: (state, action) => {
            state.loading = true;
        },
        [getEnumCategory.fulfilled]: (state, action) => {
            state.loading = false;
            state.enums = action.payload;
        },
        [getEnumCategory.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // ----------------------------------------------------------------- add

    },
});

export const selectEnum = (state) => state.enum.enums;

export default machineSlice.reducer;