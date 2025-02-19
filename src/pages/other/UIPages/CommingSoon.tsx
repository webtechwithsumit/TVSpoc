import { Container, Row, Col, Button } from 'react-bootstrap';

const CommingSoon = () => {
    return (
        <div className='p-5  d-flex align-items-center justify-content-center '>
            <Container className='text-center bg-white p-5 rounded shadow'>
                <Row>
                    <Col>
                        <h1 className='display-4 text-primary mb-3'>Coming Soon</h1>
                        <p className='lead text-secondary mb-4'>We're working hard to bring you something amazing. Stay tuned!</p>
                        <Button variant='primary' size='lg'>Notify Me</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CommingSoon;
