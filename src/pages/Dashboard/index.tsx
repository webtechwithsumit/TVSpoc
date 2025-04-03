import { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Container, Button } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosInstance';
import config from '@/config';

const Dashboard = () => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	const fetchInventorySpareCount = async () => {
		setLoading(true);
		try {
			const response = await axiosInstance.get(`${config.API_URL}/Dashboard/GetInventorySpareCount`);
			if (response.data.isSuccess) {
				setData(response.data);
			} else {
				setError(response.data.message || 'Failed to fetch inventory data.');
			}
		} catch (err) {
			console.error('Error fetching inventory data:', err);
			setError('Something went wrong while fetching inventory data.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchInventorySpareCount();
	}, []);

	return (
		<Container className='pt-4'>


			{loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
			{error && <Alert variant="danger" className="text-center">{error}</Alert>}

			{!loading && data && (
				<Row className="g-4 justify-content-center">
					<Col md={6}>
						<Card className="shadow-sm text-center border-light rounded p-3 hover-card">
							<Card.Body>
								<i className="ri-archive-line display-6 text-primary mb-3"></i>
								<Card.Title className="text-muted">Total Inventory</Card.Title>
								<Card.Text className="display-6 text-primary">{data.totalInventorySpareCount}</Card.Text>
							</Card.Body>
							<Button variant="outline-primary" className="mt-3">View More</Button>
						</Card>
					</Col>

					<Col md={6}>
						<Card className="shadow-sm text-center border-light rounded p-3 hover-card">
							<Card.Body>
								<i className="ri-checkbox-blank-circle-line display-6 text-success mb-3"></i>
								<Card.Title className="text-muted">Non-Defective</Card.Title>
								<Card.Text className="display-6 text-success">{data.totalNonDefectiveSpareCount}</Card.Text>
							</Card.Body>
							<Button variant="outline-success" className="mt-3">View More</Button>
						</Card>
					</Col>

					<Col md={6}>
						<Card className="shadow-sm text-center border-light rounded p-3 hover-card">
							<Card.Body>
								<i className="ri-close-circle-line display-6 text-danger mb-3"></i>
								<Card.Title className="text-muted">Defective</Card.Title>
								<Card.Text className="display-6 text-danger">{data.totalDefectiveSpareCount}</Card.Text>
							</Card.Body>
							<Button variant="outline-danger" className="mt-3">View More</Button>
						</Card>
					</Col>

					<Col md={6}>
						<Card className="shadow-sm text-center border-light rounded p-3 hover-card">
							<Card.Body>
								<i className="ri-time-line display-6 text-warning mb-3"></i>
								<Card.Title className="text-muted">Expired</Card.Title>
								<Card.Text className="display-6 text-warning">{data.totalExpiredSpareCount}</Card.Text>
							</Card.Body>
							<Button variant="outline-warning" className="mt-3">View More</Button>
						</Card>
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default Dashboard;
