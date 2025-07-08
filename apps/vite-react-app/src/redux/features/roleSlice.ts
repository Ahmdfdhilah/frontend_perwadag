import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role, ROLES, DEFAULT_ROLE } from '@/mocks/roles';

interface RoleState {
  currentRole: Role;
  availableRoles: Role[];
}

const initialState: RoleState = {
  currentRole: DEFAULT_ROLE,
  availableRoles: ROLES
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      const role = state.availableRoles.find(r => r.id === action.payload);
      if (role) {
        state.currentRole = role;
      }
    },
    resetRole: (state) => {
      state.currentRole = DEFAULT_ROLE;
    }
  }
});

export const { setRole, resetRole } = roleSlice.actions;
export default roleSlice.reducer;

export type { RoleState };