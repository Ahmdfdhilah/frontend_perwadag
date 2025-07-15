import { createSlice } from '@reduxjs/toolkit';

interface RoleState {
  // This slice is deprecated - roles are now managed through auth state
  // Keeping for backwards compatibility during migration
}

const initialState: RoleState = {};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    // Deprecated - roles are now managed through auth state
  }
});

export default roleSlice.reducer;
export type { RoleState };