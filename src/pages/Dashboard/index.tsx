import { Image } from 'react-bootstrap'
import logo from '../../assets/images/logotvs.png'
<title>TVS</title>

const Dashboard = () => {


	return (
		<>
			<div className='w-25 m-auto mt-5 pt-5'>
				<Image src={logo} alt="logo" className='w-100 ' />
			</div>

		</>
	)
}

export default Dashboard
