import api from "@/utils/api";
import { useToast } from "@workspace/ui/components/sonner";
// import { FileUploadResponse } from "./fileService";

// Updated interfaces to match backend schemas exactly
export interface RoleResponse {
    id: number;
    name: string;
    description?: string;
}

export interface OrgUnitResponse {
    id: number;
    name: string;
    description?: string;
}

export interface UserResponse {
    password: string;
    id: number;
    email: string;
    first_name: string;
    last_name?: string;
    is_active: boolean;
    is_verified: boolean;
    password_changed_at?: string;
    force_password_change: boolean;
    last_login?: string;
    mfa_enabled?: boolean;

    // HRIS fields
    employee_id?: string;
    gender?: string;
    org_unit_id?: number;
    phone?: string;
    hire_date?: string;
    basic_salary?: number;
    avatar_file_id?: number;

    // Security fields (for admin visibility)
    failed_login_attempts?: number;
    locked_until?: string;

    // Relationships
    roles: RoleResponse[];
    org_unit?: OrgUnitResponse;
    avatar_file?: any;
}

export interface UserSearchResponse {
    id: number;
    name: string;
    email: string;
    employee_id?: string;
    org_unit_name?: string;
    is_active: boolean;
}

export interface UserCreate {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    gender?: string;
    is_active?: boolean;
    is_verified?: boolean;

    // HRIS fields
    employee_id?: string;
    phone?: string;
    hire_date?: string;
    basic_salary?: number;
    org_unit_id?: number;
    avatar_file_id?: number;

    // Role assignment
    role_ids?: number[];
}

export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    is_active?: boolean;

    // HRIS fields
    employee_id?: string;
    gender?: string;
    phone?: string;
    hire_date?: string;
    basic_salary?: number;
    org_unit_id?: number;
    avatar_file_id?: number;

    // Role management
    role_ids?: number[];
}

export interface UserProfileUpdate {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_file_id?: number;
}

export interface PasswordChange {
    current_password: string;
    new_password: string;
}

export interface PasswordReset {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    new_password: string;
}

export interface PasswordStrengthResponse {
    valid: boolean;
    strength_score: number;
    errors: string[];
    feedback: string[];
}

// Filter parameters for advanced user filtering matching backend exactly
export interface UserFilterParams {
    // Pagination
    page?: number;
    size?: number;

    // Search parameters
    search?: string;
    first_name_contains?: string;
    last_name_contains?: string;
    email_contains?: string;
    employee_id_contains?: string;

    // Filter parameters
    status?: "all" | "active" | "inactive" | "verified" | "unverified";
    is_active?: boolean;
    is_verified?: boolean;
    mfa_enabled?: boolean;
    gender?: string;
    org_unit_id?: number;
    role_name?: string;

    // Date filters
    hire_date_from?: string;
    hire_date_to?: string;
    last_login_from?: string;
    last_login_to?: string;

    // Sorting
    sort_by?: "first_name" | "last_name" | "email" | "created_at" | "last_login" | "hire_date";
    sort_order?: "asc" | "desc";
}

// Pagination params for search
export interface PaginationParams {
    page?: number;
    size?: number;
    offset?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface StatusMessage {
    status: string;
    message: string;
}

const { toast } = useToast();

export const userService = {
    // Get all users with advanced filtering (admin/master_admin only)
    getAllUsers: async (filters?: UserFilterParams): Promise<PaginatedResponse<UserResponse>> => {
        try {
            const response = await api.get("/users/", {
                params: filters
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to fetch users";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Search users for activity assignment - returns safe data only with pagination
    searchUsers: async (
        query: string,
        pagination?: PaginationParams
    ): Promise<PaginatedResponse<UserSearchResponse>> => {
        try {
            const params: any = { q: query };
            if (pagination?.page) params.page = pagination.page;
            if (pagination?.size) params.size = pagination.size;
            if (pagination?.offset !== undefined) params.offset = pagination.offset;

            const response = await api.get("/users/search", { params });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to search users";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Get specific user by ID
    getUserById: async (userId: number): Promise<UserResponse> => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to fetch user";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Create a new user (master_admin only)
    createUser: async (userData: UserCreate): Promise<UserResponse> => {
        try {
            const response = await api.post("/users/", userData);
            toast({
                title: "Success",
                description: "User created successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to create user";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Update user
    updateUser: async (userId: number, userData: UserUpdate): Promise<UserResponse> => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            toast({
                title: "Success",
                description: "User updated successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to update user";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Delete user (soft delete, master_admin only)
    deleteUser: async (userId: number): Promise<UserResponse> => {
        try {
            const response = await api.delete(`/users/${userId}`);
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to delete user";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Get users by org unit with filtering (admin/master_admin only)
    getUsersByOrgUnit: async (
        orgUnitId: number,
        filters?: UserFilterParams
    ): Promise<PaginatedResponse<UserResponse>> => {
        try {
            const response = await api.get(`/users/admin/org-unit/${orgUnitId}`, {
                params: filters
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to fetch users by org unit";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Get all available roles (admin/master_admin only)
    getAllRoles: async (): Promise<RoleResponse[]> => {
        try {
            const response = await api.get("/users/roles");
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to fetch roles";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Password management
    changePassword: async (passwordData: PasswordChange): Promise<UserResponse> => {
        try {
            const response = await api.post("/auth/change-password", passwordData);
            toast({
                title: "Success",
                description: "Password changed successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to change password";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    checkPasswordStrength: async (password: string): Promise<PasswordStrengthResponse> => {
        try {
            const response = await api.post("/auth/check-password-strength", { password });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to check password strength";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    requestPasswordReset: async (email: string): Promise<StatusMessage> => {
        try {
            const response = await api.post("/auth/password-reset", { email });
            toast({
                title: "Success",
                description: "Password reset email sent",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to request password reset";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    confirmPasswordReset: async (resetData: PasswordResetConfirm): Promise<StatusMessage> => {
        try {
            const response = await api.post("/auth/password-reset/confirm", resetData);
            toast({
                title: "Success",
                description: "Password reset successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to reset password";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Admin functions
    unlockUserAccount: async (userId: number): Promise<UserResponse> => {
        try {
            const response = await api.post(`/auth/unlock-account/${userId}`);
            toast({
                title: "Success",
                description: "User account unlocked successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to unlock user account";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Helper functions to check user permissions
    hasRole: (user: UserResponse | null, roleType: string): boolean => {
        if (!user || !user.roles) return false;
        return user.roles.some(role => role.name === roleType);
    },

    hasAnyRole: (user: UserResponse | null, roleTypes: string[]): boolean => {
        if (!user || !user.roles) return false;
        return user.roles.some(role => roleTypes.includes(role.name));
    },

    isAdmin: (user: UserResponse | null): boolean => {
        return userService.hasRole(user, 'admin');
    },

    isMasterAdmin: (user: UserResponse | null): boolean => {
        return userService.hasRole(user, 'master_admin');
    },

    isAdminOrMasterAdmin: (user: UserResponse | null): boolean => {
        return userService.hasAnyRole(user, ['admin', 'master_admin']);
    },

    // Utility functions
    getUserFullName: (user: UserResponse | UserSearchResponse): string => {
        if ('name' in user) {
            return user.name; // UserSearchResponse already has formatted name
        }
        return `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`;
    },

    isUserLocked: (user: UserResponse): boolean => {
        if (!user.locked_until) return false;
        return new Date(user.locked_until) > new Date();
    },

    formatUserStatus: (user: UserResponse): string => {
        if (!user.is_active) return "Inactive";
        if (userService.isUserLocked(user)) return "Locked";
        if (!user.is_verified) return "Unverified";
        return "Active";
    },

    // Get user status color
    getUserStatusColor: (user: UserResponse): string => {
        if (!user.is_active) return "red";
        if (userService.isUserLocked(user)) return "orange";
        if (!user.is_verified) return "yellow";
        return "green";
    },

    // Format user roles
    formatUserRoles: (user: UserResponse): string => {
        if (!user.roles || user.roles.length === 0) return "No roles";
        return user.roles.map(role => role.name).join(", ");
    },

    // Get org unit name
    getOrgUnitName: (user: UserResponse): string => {
        return user.org_unit?.name || "No org unit";
    },

    // Filter helpers
    createFilterParams: (filters: Partial<UserFilterParams> = {}): UserFilterParams => {
        return {
            page: 1,
            size: 10,
            sort_by: "first_name",
            sort_order: "asc",
            status: "all",
            ...filters
        };
    },

    // Create pagination params
    createPaginationParams: (pagination: Partial<PaginationParams> = {}): PaginationParams => {
        return {
            page: 1,
            size: 10,
            ...pagination
        };
    },

    // Format date for display
    formatDate: (dateString?: string): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    },

    // Format datetime for display
    formatDateTime: (dateString?: string): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    },

    // Check if password change is forced
    requiresPasswordChange: (user: UserResponse): boolean => {
        return user.force_password_change;
    },

    // Check if MFA is enabled
    isMFAEnabled: (user: UserResponse): boolean => {
        return user.mfa_enabled === true;
    },

    // Role utility functions
    getRoleById: (roles: RoleResponse[], roleId: number): RoleResponse | undefined => {
        return roles.find(role => role.id === roleId);
    },

    getRoleByName: (roles: RoleResponse[], roleName: string): RoleResponse | undefined => {
        return roles.find(role => role.name === roleName);
    },

    // Format role names for display
    formatRoleNames: (roles: RoleResponse[]): string => {
        if (!roles || roles.length === 0) return "No roles";
        return roles.map(role => role.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(", ");
    },

    // Check if role exists in list
    hasRoleInList: (roles: RoleResponse[], roleName: string): boolean => {
        return roles.some(role => role.name === roleName);
    },

    // Get current user profile
    getCurrentUser: async (): Promise<UserResponse> => {
        try {
            const response = await api.get("/users/me");
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to fetch current user";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Update current user profile with form data (including avatar)
    updateCurrentUserProfile: async (formData: FormData): Promise<UserResponse> => {
        try {
            const response = await api.put("/users/me", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "Failed to update profile";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw new Error(errorMessage);
        }
    },

    // Helper function to build FormData for profile update
    buildProfileFormData: (profileData: {
        first_name: string;
        last_name?: string;
        phone?: string;
        avatar?: File;
    }): FormData => {
        const formData = new FormData();
        
        formData.append('first_name', profileData.first_name);
        
        if (profileData.last_name) {
            formData.append('last_name', profileData.last_name);
        }
        
        if (profileData.phone) {
            formData.append('phone', profileData.phone);
        }
        
        if (profileData.avatar) {
            formData.append('avatar', profileData.avatar);
        }
        
        return formData;
    },

    // Get avatar URL with fallback to default
    getAvatarUrl: (user: UserResponse | null, defaultUrl: string = '/static/images/avatar.png'): string => {
        if (!user) return defaultUrl;
        return user.avatar_file?.file_url || defaultUrl;
    },

    // Check if user has avatar
    hasAvatar: (user: UserResponse | null): boolean => {
        return !!(user?.avatar_file?.file_url);
    }
};

export default userService;