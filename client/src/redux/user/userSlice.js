import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: null,
    timestamp: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
            state.timestamp = Date.now();
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
            state.timestamp = null;
        },
        checkExpiration: (state) => {
            const now = Date.now();
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            if (state.timestamp && now - state.timestamp > sevenDays) {
                state.currentUser = null;
                state.error = "Session expired";
                state.timestamp = null;
            }
        }
    }
});

export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signOutSuccess, checkExpiration } = userSlice.actions;

export default userSlice.reducer;