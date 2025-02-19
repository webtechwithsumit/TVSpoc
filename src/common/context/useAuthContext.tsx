import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import config from '@/config';

// Define the User type based on API response
type User = {
	emailID?: string;
	userName?: string;
	employeeName: string;
	roles: string;
	roleID: number;
	roleName: string;
	mobileNumber: string;
	officeLandLine?: string;
	extensionNumber?: string;
	departmentID?: number;
	departmentName?: string;
	status: number;
	createdBy?: string;
	createdDate?: string;
	updatedBy?: string;
	updatedDate?: string;
	token?: string;
};

// Define the shape of the AuthContext
interface AuthContextType {
	user?: User;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<{ status: number; message?: string }>;
	logout: () => void;
	saveSession: (user: User) => void;
	removeSession: () => void;
	updateRole: (newRole: string) => void; // Function to update role dynamically
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for using AuthContext
export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

// Storage keys
const authSessionKey = '_AUTH_SESSION';
const authTokenKey = '_AUTH_TOKEN';

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
	// Load session from localStorage
	const [user, setUser] = useState<User | undefined>(
		localStorage.getItem(authSessionKey)
			? JSON.parse(localStorage.getItem(authSessionKey) || '{}')
			: undefined
	);

	// Save session in localStorage and state
	const saveSession = useCallback((user: User) => {
		localStorage.setItem(authSessionKey, JSON.stringify(user));
		localStorage.setItem(authTokenKey, user.token || '');
		setUser(user);
	}, []);

	// Remove session from localStorage
	const removeSession = useCallback(() => {
		localStorage.removeItem(authSessionKey);
		localStorage.removeItem(authTokenKey);
		setUser(undefined);
	}, []);

	// Login function with API call
	const login = async (email: string, password: string): Promise<{ status: number; message?: string }> => {
		try {
			const response = await axios.post(`${config.API_URL}/Login/Login`, { email, password });
			const data = response.data;

			if (data.isSuccess && data.loginList) {
				const employeeDetails = data.loginList;
				const userData: User = {
					emailID: employeeDetails.emailID,
					userName: employeeDetails.userName,
					employeeName: employeeDetails.employeeName,
					roles: employeeDetails.roleName,
					roleID: employeeDetails.roleID,
					roleName: employeeDetails.roleName,
					mobileNumber: employeeDetails.mobileNumber,
					officeLandLine: employeeDetails.officeLandLine,
					extensionNumber: employeeDetails.extensionNumber,
					departmentID: employeeDetails.departmentID,
					departmentName: employeeDetails.departmentName,
					status: employeeDetails.status,
					createdBy: employeeDetails.createdBy,
					createdDate: employeeDetails.createdDate,
					updatedBy: employeeDetails.updatedBy,
					updatedDate: employeeDetails.updatedDate,
					token: data.token,
				};

				saveSession(userData);
				return { status: 200, message: data.message };
			}

			return { status: 400, message: data.message || 'Login failed. Invalid response.' };
		} catch (error: unknown) {
			const axiosError = error as AxiosError;
			console.error('Login failed:', axiosError);

			return {
				status: axiosError.response?.status || 500,
				message: axiosError.response?.data?.message || 'Login failed. Please try again.',
			};
		}
	};

	// Logout function
	const logout = useCallback(() => {
		removeSession();
	}, [removeSession]);

	// Function to update role dynamically
	const updateRole = (newRole: string) => {
		if (user) {
			const updatedUser = { ...user, roles: newRole, roleName: newRole };
			setUser(updatedUser);
			localStorage.setItem(authSessionKey, JSON.stringify(updatedUser)); // Persist updated role
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				login,
				logout,
				saveSession,
				removeSession,
				updateRole, // Provide updateRole function in context
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
