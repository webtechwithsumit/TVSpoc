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
				body: JSON.stringify({ userID: email, password }),
			});

			if (!res.ok) {
				throw new Error('Failed to connect to the API');
			}

			const data = await res.json();

			// Ensure API response is valid
			if (data.isSuccess && data.login) {
				const employeeDetails = data.login;
				console.log(employeeDetails)


				// Save session in authentication context
				saveSession({
					userID: employeeDetails.userID || '',
					userName: employeeDetails.userName || '',
					roles: employeeDetails.role || '',
					status: employeeDetails.status || '',
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
