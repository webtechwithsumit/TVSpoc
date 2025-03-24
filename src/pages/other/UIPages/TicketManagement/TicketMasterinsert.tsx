import { useState } from 'react';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';  // Ensure you have react-bootstrap installed
import { Link } from 'react-router-dom';

function TicketMasterinsert() {
  const [formData, setFormData] = useState({
    courierName: '',
    trackingID: '',
    proofOfDelivery: null,
    receivingPartyName: '',
    receivingPartyContact: '',
    receivingPartyAddress: '',
    deliveryStatus: '',
    estimatedDeliveryDate: '',
    remarks: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission (e.g., API call)
    console.log(formData);
  };

  return (
    <div>
      <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
        <h4 className="text-primary m-0">
          <i className="ri-file-list-line me-2"></i>
          <span className="fw-bold"> Add Expired</span>
        </h4>
      </div>
      
      <div className="bg-white p-2 pb-2">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6} className="mt-2">
              <Form.Group controlId="courierName">
                <Form.Label>Master Name</Form.Label>
                <Form.Control
                  type="text"
                  name="courierName"
                  value={formData.courierName}
                  onChange={handleInputChange}
                  placeholder="Enter Courier Name"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="trackingID">
                <Form.Label>Tracking ID</Form.Label>
                <Form.Control
                  type="text"
                  name="trackingID"
                  value={formData.trackingID}
                  onChange={handleInputChange}
                  placeholder="Enter Tracking ID"
                />
              </Form.Group>
            </Col>

            
            <Col lg={6} className="mt-2">
              <Form.Group controlId="receivingPartyAddress">
                <Form.Label>Receiving Party Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="receivingPartyAddress"
                  value={formData.receivingPartyAddress}
                  onChange={handleInputChange}
                  placeholder="Enter Receiving Party Address"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="deliveryStatus">
                <Form.Label>Delivery Status</Form.Label>
                <Form.Control
                  as="select"
                  name="deliveryStatus"
                  value={formData.deliveryStatus}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Delivered">Delivered</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Pending">Pending</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="estimatedDeliveryDate">
                <Form.Label>Estimated Delivery Date</Form.Label>
                <Form.Control
                  type="date"
                  name="estimatedDeliveryDate"
                  value={formData.estimatedDeliveryDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="remarks">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Enter Remarks"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
              <ButtonGroup aria-label="Basic example" className="w-100">
                <Link to="/pages/ExpiredSparePart">
                  <Button type="button" variant="primary">
                    Back
                  </Button>
                </Link>
                &nbsp;
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default TicketMasterinsert;
