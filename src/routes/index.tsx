import React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'


const Login = React.lazy(() => import('../pages/auth/Login'))
const Register = React.lazy(() => import('../pages/auth/Register'))
const Logout = React.lazy(() => import('../pages/auth/Logout'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))
const LockScreen = React.lazy(() => import('../pages/auth/LockScreen'))

const Dashboard = React.lazy(() => import('../pages/Dashboard'))
const ProfilePages = React.lazy(() => import('../pages/other/Profile/'))

const EmployeeMaster = React.lazy(() => import('../pages/other/UIPages/EmployeeMaster/EmployeeMaster.tsx'))
const EmployeeMasterinsert = React.lazy(() => import('../pages/other/UIPages/EmployeeMaster/EmployeeMasterinsert.tsx'))


const DepartmentMaster = React.lazy(() => import('../pages/other/UIPages/DepartmentMaster/DepartmentMaster.tsx'))
const DepartmentMasterinsert = React.lazy(() => import('../pages/other/UIPages/DepartmentMaster/DepartmentMasterinsert.tsx'))

const QualityCheckMaster = React.lazy(() => import('../pages/other/UIPages/QualityCheckMaster/QualityCheckMaster.tsx'))

const DefectiveSparePart = React.lazy(() => import('../pages/other/UIPages/DefectiveSparePart/DefectiveSparePart.tsx'))

const NonDefectiveSparePart = React.lazy(() => import('../pages/other/UIPages/NonDefectiveSparePart/NonDefectiveSparePart.tsx'))

const SparepartInventory = React.lazy(() => import('../pages/other/UIPages/SparepartInventory/SparepartInventory.tsx'))
const SparepartInventoryInsert = React.lazy(() => import('../pages/other/UIPages/SparepartInventory/SparepartInventoryInsert.tsx'))

const CustomerMaster = React.lazy(() => import('../pages/other/UIPages/CustomerMaster/CustomerMaster.tsx'))
const CustomerMasterInsert = React.lazy(() => import('../pages/other/UIPages/CustomerMaster/CustomerMasterInsert.tsx'))

const ExpiredSparePart = React.lazy(() => import('../pages/other/UIPages/ExpiredSparePart/ExpiredSparePart.tsx'))

const TicketMaster = React.lazy(() => import('../pages/other/UIPages/TicketManagement/TicketMaster.tsx'))
const TicketUserMaster = React.lazy(() => import('../pages/other/UIPages/TicketManagement/TickerUsermaster.tsx'))
const TicketMasterinsert = React.lazy(() => import('../pages/other/UIPages/TicketManagement/TicketMasterinsert.tsx'))

const RoleMaster = React.lazy(() => import('../pages/other/UIPages/RoleMaster/Rolemaster.tsx'))
const RoleMasterinsert = React.lazy(() => import('../pages/other/UIPages/RoleMaster/RoleMasterinsert.tsx'))

const ProductMaster = React.lazy(() => import('../pages/other/UIPages/Inventory/InventoryMaster.tsx'))
const ProductMasterinsert = React.lazy(() => import('../pages/other/UIPages/Inventory/InventoryMasterinsert.tsx'))
const SpareBulkInventory = React.lazy(() => import('../pages/other/UIPages/SparepartInventory/SpareBulkInventory.tsx'))

const CommingSoon = React.lazy(() => import('../pages/other/UIPages/CommingSoon.tsx'))

const Error404 = React.lazy(() => import('../pages/error/Error404'))
const Error404Alt = React.lazy(() => import('../pages/error/Error404Alt'))
const Error500 = React.lazy(() => import('../pages/error/Error500'))

export interface RoutesProps {
	path: RouteProps['path']
	name?: string
	element?: RouteProps['element']
	route?: any
	exact?: boolean
	icon?: string
	header?: string
	roles?: string[]
	children?: RoutesProps[]
}

const dashboardRoutes: RoutesProps = {
	path: '/admin',
	name: 'Dashboards',
	icon: 'home',
	header: 'Navigation',
	children: [
		{
			path: '/',
			name: 'Root',
			element: <Dashboard />,
			route: PrivateRoute,
			roles: ['DME', 'User']

		},
		{
			path: '/dashboard',
			name: 'Dashboard',
			element: <Dashboard />,
			route: PrivateRoute,
			roles: ['DME', 'User']
		},
	],
}

const customPagesRoutes = {
	path: '/pages',
	name: 'Pages',
	icon: 'pages',
	header: 'Custom',
	children: [
		{
			path: '/pages/profile',
			name: 'Profile',
			element: <PrivateRoute element={<ProfilePages />} />,
			route: PrivateRoute,
		},
		{
			path: '/pages/EmployeeMaster',
			name: 'EmployeeMaster',
			element: <EmployeeMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/EmployeeMasterinsert',
			name: 'EmployeeMasterinsert',
			element: <EmployeeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/EmployeeMasterinsert/:id',
			name: 'EmployeeMasterinsert',
			element: <EmployeeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DepartmentMaster',
			name: 'DepartmentMaster',
			element: <DepartmentMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DepartmentMasterinsert',
			name: 'DepartmentMasterinsert',
			element: <DepartmentMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DepartmentMasterinsert/:id',
			name: 'DepartmentMasterinsert',
			element: <DepartmentMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/SparepartInventory',
			name: 'SparepartInventory',
			element: <SparepartInventory />,
			route: PrivateRoute,
		},
		{
			path: '/pages/SpareBulkInventory',
			name: 'SpareBulkInventory',
			element: <SpareBulkInventory />,
			route: PrivateRoute,
		},
		{
			path: '/pages/SparepartInventoryInsert',
			name: 'SparepartInventoryInsert',
			element: <SparepartInventoryInsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/SparepartInventoryInsert/:id',
			name: 'SparepartInventoryInsert',
			element: <SparepartInventoryInsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/QualityCheckMaster',
			name: 'QualityCheckMaster',
			element: <QualityCheckMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/NonDefectiveSparePart',
			name: 'NonDefectiveSparePart',
			element: <NonDefectiveSparePart />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ExpiredSparePart',
			name: 'ExpiredSparePart',
			element: <ExpiredSparePart />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CustomerMaster',
			name: 'CustomerMaster',
			element: <CustomerMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CustomerMasterInsert',
			name: 'CustomerMasterInsert',
			element: <CustomerMasterInsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CustomerMasterInsert/:id',
			name: 'CustomerMasterInsert',
			element: <CustomerMasterInsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DefectiveSparePart',
			name: 'DefectiveSparePart',
			element: <DefectiveSparePart />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TicketMaster',
			name: 'TicketMaster',
			element: <TicketMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TicketUserMaster',
			name: 'TicketUserMaster',
			element: <TicketUserMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TicketMasterinsert',
			name: 'TicketMasterinsert',
			element: <TicketMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TicketMasterinsert/:id',
			name: 'TicketMasterinsert',
			element: <TicketMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RoleMaster',
			name: 'RoleMaster',
			element: <RoleMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RoleMasterinsert',
			name: 'RoleMasterinsert',
			element: <RoleMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RoleMasterinsert/:id',
			name: 'RoleMasterinsert',
			element: <RoleMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProductMaster',
			name: 'ProductMaster',
			element: <ProductMaster />,
			route: PrivateRoute,
		},

		{
			path: '/pages/ProductMasterinsert',
			name: 'ProductMasterinsert',
			element: <ProductMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProductMasterinsert/:id',
			name: 'ProductMasterinsert',
			element: <ProductMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CommingSoon',
			name: 'CommingSoon',
			element: <CommingSoon />,
			route: PrivateRoute,
		},
		{
			path: 'pages/error-404-alt',
			name: 'Error - 404-alt',
			element: <Error404Alt />,
			route: PrivateRoute,
		},
	],
}

const authRoutes: RoutesProps[] = [
	{
		path: '/auth/login',
		name: 'Login',
		element: <Login />,
		route: Route,
	},
	{
		path: '/auth/register',
		name: 'Register',
		element: <Register />,
		route: Route,
	},
	{
		path: '/auth/logout',
		name: 'Logout',
		element: <Logout />,
		route: Route,
	},
	{
		path: '/auth/forgot-password',
		name: 'Forgot Password',
		element: <ForgotPassword />,
		route: Route,
	},
	{
		path: '/auth/lock-screen',
		name: 'Lock Screen',
		element: <LockScreen />,
		route: Route,
	},
]

const otherPublicRoutes = [
	{
		path: '*',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-404',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-500',
		name: 'Error - 500',
		element: <Error500 />,
		route: Route,
	},
]

const flattenRoutes = (routes: RoutesProps[]) => {
	let flatRoutes: RoutesProps[] = []

	routes = routes || []
	routes.forEach((item: RoutesProps) => {
		flatRoutes.push(item)
		if (typeof item.children !== 'undefined') {
			flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)]
		}
	})
	return flatRoutes
}

const authProtectedRoutes = [dashboardRoutes, customPagesRoutes]
const publicRoutes = [...authRoutes, ...otherPublicRoutes]

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes])
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes])
export {
	publicRoutes,
	authProtectedRoutes,
	authProtectedFlattenRoutes,
	publicProtectedFlattenRoutes,
}
