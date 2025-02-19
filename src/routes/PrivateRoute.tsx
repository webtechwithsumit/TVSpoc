import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/common'; // Import your auth context

interface PrivateRouteProps {
  element: JSX.Element;
  roles?: string[]; // Allowed roles
  path?: string;
}

const PrivateRoute = ({ element, roles = [] }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthContext();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // Check if the user's role is allowed to access this route
  if (roles.length > 0 && (!user || !roles.includes(user.roles))) {
    return <Navigate to="/pages/error-404" />;
  }

  // If all checks pass, render the route element
  return element;
};

export default PrivateRoute;
