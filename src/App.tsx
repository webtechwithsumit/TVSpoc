import React from 'react';
import axios from 'axios';
import configureFakeBackend from './common/api/fake-backend';
import { AuthProvider, ThemeProvider } from './common/context';
import AllRoutes from './routes/Routes';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';
import './assets/scss/icons.scss';

// Set up axios defaults to include security headers in API requests
axios.defaults.headers.common['X-Content-Type-Options'] = 'nosniff';
axios.defaults.headers.common['Cache-Control'] = 'no-store';
axios.defaults.headers.common['Pragma'] = 'no-cache';
axios.defaults.headers.common['Referrer-Policy'] = 'strict-origin-when-cross-origin';

configureFakeBackend();

function App() {
	React.useEffect(() => {
		// Remove sensitive data from the DOM (if any)
		const sensitiveElements = document.querySelectorAll('[data-sensitive]');
		sensitiveElements.forEach(el => el.remove());

		// Example API call with security headers
		axios.get('/api/secure-data')
			.then(response => console.log(response.data))
			.catch(error => console.error('API error:', error));
	}, []);

	return (
		<ThemeProvider>
			<AuthProvider>
				<AllRoutes />
				<ToastContainer
					className="toast-containers"
					position="top-right"
					autoClose={10000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
				/>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
