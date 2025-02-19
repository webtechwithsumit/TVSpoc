import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/common';
// import type { User } from '@/types'
import config from '@/config';

export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const { isAuthenticated, saveSession } = useAuthContext();

	const redirectUrl = useMemo(
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
	);

	// Login function
	const login = async ({ email, password }: { email: string; password: string }) => {
		setLoading(true);
		try {
			// Call API for login
			const res = await fetch(`${config.API_URL}/Login/Login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error('Failed to connect to the API');
			}

			const data = await res.json();

			// Ensure API response is valid
			if (data.isSuccess && data.loginList) {
				const employeeDetails = data.loginList;

				// Validate required properties before saving session
				if (!employeeDetails.roleName || !data.token) {
					throw new Error('Invalid login response: Missing required fields');
				}

				localStorage.setItem('userRoles', employeeDetails.roleName)
				// Save session in authentication context
				saveSession({
					employeeName: employeeDetails.employeeName || '',
					emailID: employeeDetails.emailID || '',
					userName: employeeDetails.userName || '',
					roles: employeeDetails.roleName || '',
					mobileNumber: employeeDetails.mobileNumber || '',
					officeLandLine: employeeDetails.officeLandLine || '',
					extensionNumber: employeeDetails.extensionNumber || '',
					departmentID: employeeDetails.departmentID || 0,
					departmentName: employeeDetails.departmentName || '',
					roleID: employeeDetails.roleID || 0,
					roleName: employeeDetails.roleName || '',
					status: employeeDetails.status || 0,
					createdBy: employeeDetails.createdBy || '',
					createdDate: employeeDetails.createdDate || '',
					updatedBy: employeeDetails.updatedBy || '',
					updatedDate: employeeDetails.updatedDate || '',
					token: data.token,
				});

				// Store token securely (localStorage or sessionStorage)
				localStorage.setItem('authToken', data.token);

				// Redirect user after successful login
				navigate(redirectUrl);
			} else {
				throw new Error(data.message || 'Login failed');
			}
		} catch (error: any) {
			console.error('Login Error:', error.message);
			alert(error.message); // Replace with your UI error-handling mechanism
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, redirectUrl, isAuthenticated };
}
