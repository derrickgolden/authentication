
import { createSlice } from '@reduxjs/toolkit';

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: {
    user_id: "",
    first_name: "",
    last_name: "",
  },
  reducers: {
    setUserDetails: (state, action) => {
      const { user_id, first_name, last_name } = action.payload || {};
      if (user_id !== undefined) state.user_id = user_id;
      if (first_name !== undefined) state.first_name = first_name;
      if (last_name !== undefined) state.last_name = last_name;
    }
  }  
});

// Action creators for signup details
export const { setUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

