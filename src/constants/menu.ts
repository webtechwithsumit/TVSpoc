export interface MenuItemTypes {
	key: string
	label: string
	isTitle?: boolean
	icon?: string
	url?: string
	badge?: {
		variant: string
		text: string
	}
	parentKey?: string
	target?: string
	children?: MenuItemTypes[]
	roles?: string[]
}


const MENU_ITEMS: MenuItemTypes[] = [

	{
		key: 'dashboard',
		label: 'Dashboards',
		isTitle: false,
		url: '/',
		icon: 'ri-dashboard-3-line',
		badge: {
			variant: 'success',
			text: '',
		},
		roles: ['Admin',],
	},


	{
		key: 'Masters',
		label: ' System Masters',
		isTitle: false,
		icon: 'ri-settings-3-line',
		url: '/pages/ProductMaster',
		roles: ['Admin',],
		children: [
			{
				key: 'Role Name',
				label: ' Role Master',
				url: '/pages/RoleMaster',
				icon: 'ri-calendar-todo-line',
				parentKey: 'Masters',
			},
			{
				key: 'Department Name',
				label: ' Department Master',
				url: '/pages/DepartmentMaster',
				icon: 'ri-calendar-todo-line',
				parentKey: 'Masters',
			},
			{
				key: 'Empployee Master',
				label: 'Employee Master',
				url: '/pages/EmployeeMaster',
				icon: 'ri-group-line',
				parentKey: 'Masters',
			},
		],
	},
	{
		key: 'Businessmaster',
		label: ' Business Master',
		isTitle: false,
		icon: 'ri-settings-3-line',
		url: '/pages/ProductMaster',
		roles: ['Admin',],
		children: [
			{
				key: 'Customer Master',
				label: ' Customer Master',
				url: '/pages/CustomerMaster',
				icon: 'ri-calendar-todo-line',
				parentKey: 'Businessmaster',
			},

		],
	},
	{
		key: 'InventoryMasters',
		label: 'Inventory Master',
		icon: 'ri-loop-left-line',
		roles: ['Admin',],
		children: [
			{
				key: 'Spare Part Master',
				label: 'Spare Part Master',
				url: '/pages/SparepartInventory',
				icon: 'ri-slideshow-line',
				parentKey: 'InventoryMasters',
			},
			{
				key: 'Quality Check Master',
				label: 'Quality Check Master',
				url: '/pages/QualityCheckMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'InventoryMasters',
			},
			{
				key: 'Non Defective Spare Part',
				label: 'Non Defective Spare Part',
				url: '/pages/NonDefectiveSparePart',
				icon: 'ri-slideshow-line',
				parentKey: 'InventoryMasters',
			},
			{
				key: 'Defective Spare Part',
				label: 'Defective Spare Part',
				url: '/pages/DefectiveSparePart',
				icon: 'ri-slideshow-line',
				parentKey: 'InventoryMasters',
			},
			{
				key: 'Expired Spare Part',
				label: 'Expired Spare Part',
				url: '/pages/ExpiredSparePart',
				icon: 'ri-slideshow-line',
				parentKey: 'InventoryMasters',
			},
		],
	},
	{
		key: 'TicketManagement',
		label: 'Ticket Management',
		icon: 'ri-loop-left-line',
		roles: ['Admin',],
		children: [
			{
				key: 'Ticket Master',
				label: 'Ticket Master',
				url: '/pages/TicketMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'TicketManagement',
			},
			{
				key: 'Assignd Engineer Master',
				label: 'Assignd Engineer Master',
				url: '/pages/AssignedTicket',
				icon: 'ri-slideshow-line',
				parentKey: 'TicketManagement',
			},
			{
				key: 'Service Execution Master',
				label: 'Service Execution Master',
				url: '/pages/ServiceExecutionMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'TicketManagement',
			},
			{
				key: 'Service Closure Master',
				label: 'Service Closure Master',
				url: '/pages/ClosureExecutionMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'TicketManagement',
			},
			{
				key: 'Report Master',
				label: 'Report Master',
				url: '/pages/ReportMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'TicketManagement',
			},

		],
	},
	{
		key: 'Profile',
		label: 'Settings',
		icon: 'ri-settings-3-line',
		roles: ['Admin',],
		children: [
			{
				key: 'Porfile',
				label: 'Profile',
				url: '/pages/TicketMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'Profile',
			},
			{
				key: '',
				label: 'Change Password',
				url: '/pages/AssignEngineerMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'Profile',
			},


		],
	},
	{
		key: 'TicketMasterUser',
		label: 'Generate Ticket',
		url: '/pages/TicketMasterinsert',
		icon: 'ri-dashboard-3-line',
		roles: ['Customer',],
	},
	{
		key: 'Track Ticket',
		label: 'Track Ticket',
		url: '/pages/TicketUserMaster',
		icon: 'ri-dashboard-3-line',
		roles: ['Customer',],
	},
	{
		key: 'TrackRequest',
		label: 'Update Profile',
		url: '/pages/profile',
		icon: 'ri-dashboard-3-line',
		roles: ['Customer',],
	},
]

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
	{
		key: 'dashboard',
		icon: 'ri-dashboard-3-line',
		label: 'Dashboards',
		isTitle: true,
		children: [
			{
				key: 'dashboard',
				label: 'Dashboard',
				url: '/',
				parentKey: 'dashboard',
			},
		],
	},
	{
		key: 'pages',
		icon: 'ri-pages-line',
		label: 'Pages',
		isTitle: true,
		children: [
			{
				key: 'auth',
				label: 'Authentication',
				isTitle: false,
				children: [
					{
						key: 'auth-login',
						label: 'Login',
						url: '/auth/login',
						parentKey: 'pages',
					},
					{
						key: 'auth-register',
						label: 'Register',
						url: '/auth/register',
						parentKey: 'pages',
					},
					{
						key: 'auth-logout',
						label: 'Logout',
						url: '/auth/logout',
						parentKey: 'pages',
					},
					{
						key: 'auth-forgot-password',
						label: 'Forgot Password',
						url: '/auth/forgot-password',
						parentKey: 'pages',
					},
					{
						key: 'auth-lock-screen',
						label: 'Lock Screen',
						url: '/auth/lock-screen',
						parentKey: 'pages',
					},
				],
			},
			{
				key: 'pages-error',
				label: 'Error',
				parentKey: 'pages',
				children: [
					{
						key: 'error-404',
						label: 'Error 404',
						url: '/pages/error-404',
						parentKey: 'pages-error',
					},
					{
						key: 'error-404-alt',
						label: 'Error 404-alt',
						url: '/pages/error-404-alt',
						parentKey: 'pages-error',
					},
					{
						key: 'error-500',
						label: 'Error 500',
						url: '/pages/error-500',
						parentKey: 'pages-error',
					},
				],
			},
			{
				key: 'pages-starter',
				label: 'Starter Page',
				url: '/pages/starter',
				parentKey: 'pages',
			},
			{
				key: 'pages-ContactList',
				label: 'Contact List',
				url: '/pages/contact-list',
				parentKey: 'pages',
			},
			{
				key: 'pages-profile',
				label: 'Profile',
				url: '/pages/profile',
				parentKey: 'pages',
			},
			{
				key: 'pages-invoice',
				label: 'Invoice',
				url: '/pages/invoice',
				parentKey: 'pages',
			},
			{
				key: 'pages-faq',
				label: 'FAQ',
				url: '/pages/faq',
				parentKey: 'pages',
			},
			{
				key: 'pages-pricing',
				label: 'Pricing',
				url: '/pages/pricing',
				parentKey: 'pages',
			},
			{
				key: 'pages-maintenance',
				label: 'Maintenance',
				url: '/pages/maintenance',
				parentKey: 'pages',
			},
			{
				key: 'pages-timeline',
				label: 'Timeline',
				url: '/pages/timeline',
				parentKey: 'pages',
			},
		],
	},
	{
		key: 'ui',
		icon: 'ri-stack-line',
		label: 'Components',
		isTitle: true,
		children: [
			{
				key: 'base1',
				label: 'Base UI 1',
				parentKey: 'ui',
				children: [
					{
						key: 'ui-accordions',
						label: 'Accordions',
						url: '/ui/accordions',
						parentKey: 'base1',
					},
					{
						key: 'ui-alerts',
						label: 'Alerts',
						url: '/ui/alerts',
						parentKey: 'base1',
					},
					{
						key: 'ui-avatars',
						label: 'Avatars',
						url: '/ui/avatars',
						parentKey: 'base1',
					},
					{
						key: 'ui-badges',
						label: 'Badges',
						url: '/ui/badges',
						parentKey: 'base1',
					},
					{
						key: 'ui-breadcrumb',
						label: 'Breadcrumb',
						url: '/ui/breadcrumb',
						parentKey: 'base1',
					},
					{
						key: 'ui-buttons',
						label: 'Buttons',
						url: '/ui/buttons',
						parentKey: 'base1',
					},
					{
						key: 'ui-cards',
						label: 'Cards',
						url: '/ui/cards',
						parentKey: 'base1',
					},
					{
						key: 'ui-carousel',
						label: 'Carousel',
						url: '/ui/carousel',
						parentKey: 'base1',
					},
					{
						key: 'ui-dropdowns',
						label: 'Dropdowns',
						url: '/ui/dropdowns',
						parentKey: 'base1',
					},
					{
						key: 'ui-embed-video',
						label: 'Embed Video',
						url: '/ui/embed-video',
						parentKey: 'base1',
					},
					{
						key: 'ui-grid',
						label: 'Grid',
						url: '/ui/grid',
						parentKey: 'base1',
					},
					{
						key: 'ui-list-group',
						label: 'List Group',
						url: '/ui/list-group',
						parentKey: 'base1',
					},
					{
						key: 'ui-links',
						label: 'Links',
						url: '/ui/links',
						parentKey: 'base1',
					},
				],
			},
			{
				key: 'base2',
				label: 'Base UI 2',
				parentKey: 'ui',
				children: [
					{
						key: 'ui-modals',
						label: 'Modals',
						url: '/ui/modals',
						parentKey: 'base2',
					},
					{
						key: 'ui-notifications',
						label: 'Notifications',
						url: '/ui/notifications',
						parentKey: 'base2',
					},
					{
						key: 'ui-offcanvas',
						label: 'Offcanvas',
						url: '/ui/offcanvas',
						parentKey: 'base2',
					},
					{
						key: 'ui-placeholders',
						label: 'Placeholders',
						url: '/ui/placeholders',
						parentKey: 'base2',
					},
					{
						key: 'ui-pagination',
						label: 'Pagination',
						url: '/ui/pagination',
						parentKey: 'base2',
					},
					{
						key: 'ui-popovers',
						label: 'Popovers',
						url: '/ui/popovers',
						parentKey: 'base2',
					},
					{
						key: 'ui-progress',
						label: 'Progress',
						url: '/ui/progress',
						parentKey: 'base2',
					},

					{
						key: 'ui-spinners',
						label: 'Spinners',
						url: '/ui/spinners',
						parentKey: 'base2',
					},
					{
						key: 'ui-tabs',
						label: 'Tabs',
						url: '/ui/tabs',
						parentKey: 'base2',
					},
					{
						key: 'ui-tooltips',
						label: 'Tooltips',
						url: '/ui/tooltips',
						parentKey: 'base2',
					},
					{
						key: 'ui-typography',
						label: 'Typography',
						url: '/ui/typography',
						parentKey: 'base2',
					},
					{
						key: 'ui-utilities',
						label: 'Utilities',
						url: '/ui/utilities',
						parentKey: 'base2',
					},
				],
			},
			{
				key: 'extended',
				label: 'Extended UI',
				parentKey: 'ui',
				children: [
					{
						key: 'extended-portlets',
						label: 'Portlets',
						url: '/extended-ui/portlets',
						parentKey: 'extended',
					},
					{
						key: 'extended-scrollbar',
						label: 'Scrollbar',
						url: '/extended-ui/scrollbar',
						parentKey: 'extended',
					},
					{
						key: 'extended-range-slider',
						label: 'Range Slider',
						url: '/extended-ui/range-slider',
						parentKey: 'extended',
					},
				],
			},
			{
				key: 'forms',
				label: 'Forms',
				parentKey: 'ui',
				children: [
					{
						key: 'forms-basic-elements',
						label: 'Basic Elements',
						url: '/ui/forms/basic-elements',
						parentKey: 'forms',
					},
					{
						key: 'forms-form-advanced',
						label: 'Form Advanced',
						url: '/ui/forms/form-advanced',
						parentKey: 'forms',
					},
					{
						key: 'forms-validation',
						label: 'Form Validation',
						url: '/ui/forms/validation',
						parentKey: 'forms',
					},
					{
						key: 'forms-wizard',
						label: 'Form Wizard',
						url: '/ui/forms/wizard',
						parentKey: 'forms',
					},
					{
						key: 'forms-file-uploads',
						label: 'File Uploads',
						url: '/ui/forms/file-uploads',
						parentKey: 'forms',
					},
					{
						key: 'forms-editors',
						label: 'Form Editors',
						url: '/ui/forms/editors',
						parentKey: 'forms',
					},
					{
						key: 'forms-image-crop',
						label: 'Image Crop',
						url: '/ui/forms/image-crop',
						parentKey: 'forms',
					},
					{
						key: 'forms-editable',
						label: 'Editable',
						url: '/ui/forms/editable',
						parentKey: 'forms',
					},
				],
			},
			{
				key: 'charts',
				label: 'Charts',
				isTitle: false,
				children: [
					{
						key: 'apex-charts',
						label: 'Apex Charts',
						url: '/charts/apex-charts',
						parentKey: 'charts',
					},
					{
						key: 'chartjs-charts',
						label: 'ChartJS',
						url: '/charts/chartjs',
						parentKey: 'charts',
					},
					{
						key: 'Sparkline-charts',
						label: 'Sparkline Charts',
						url: '/charts/sparkline-charts',
						parentKey: 'charts',
					},
				],
			},
			{
				key: 'tables',
				label: 'Tables',
				isTitle: false,
				children: [
					{
						key: 'tables-basic',
						label: 'Basic Tables',
						url: '/ui/tables/basic-tables',
						parentKey: 'tables',
					},
					{
						key: 'tables-data',
						label: 'Data Tables',
						url: '/ui/tables/data-tables',
						parentKey: 'tables',
					},
				],
			},
			{
				key: 'icons',
				label: 'Icons',
				isTitle: false,
				children: [
					{
						key: 'icons-remix',
						label: 'Remix icons',
						url: '/ui/icons/remix-icons',
						parentKey: 'icons',
					},
					{
						key: 'icons-Bootstrap',
						label: 'Bootstrap icons',
						url: '/ui/icons/Bootstrap-icons',
						parentKey: 'icons',
					},
					{
						key: 'icons-Material Icons',
						label: 'Material Design Icons',
						url: '/ui/icons/Material-icons',
						parentKey: 'icons',
					},
				],
			},
			{
				key: 'maps',
				label: 'Maps',
				isTitle: false,
				children: [
					{
						key: 'maps-google-maps',
						label: 'Google maps',
						url: '/ui/maps/google-maps',
						parentKey: 'maps',
					},
					{
						key: 'maps-vector-maps',
						label: 'Vector maps',
						url: '/ui/maps/vector-maps',
						parentKey: 'maps',
					},
				],
			},
		],
	},
]

export { MENU_ITEMS, HORIZONTAL_MENU_ITEMS }
