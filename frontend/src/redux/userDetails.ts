
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserDetails {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface UserDetailsState {
  user_id: string;
  first_name: string;
  last_name: string;
}

const initialState: UserDetailsState = {
  user_id: "",
  first_name: "",
  last_name: "",
}

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state = action.payload;
      // const { user_id, first_name, last_name } = action.payload;
      //   state.user_id = user_id;
      //   state.first_name = first_name;
      //   state.last_name = last_name;
    }
  }  
});

// Action creators for signup details
export const { setUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

