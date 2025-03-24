import React, { useState } from 'react';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select'; // Import Select
import { Link } from 'react-router-dom';


function CustomerMasterInsert() {
  // Initialize the state
  const [formData, setFormData] = useState({
    customerName: '',
    contactInfo: '',
    address: '',
    pinCode: '',
    associatedDealer: '', // Can be a string or an object based on Select
    warrantyStatus: '',  // Same as above
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Select changes
  const handleSelectChange = (selectedOption: { value: string; label: string } | null, name: string) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic, e.g., send data to API
    console.log(formData);
  };

  return (
    <div>
         <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
        <h4 className="text-primary m-0">
          <i className="ri-file-list-line me-2"></i>
          <span className="fw-bold"> Add Customer</span>
        </h4>
      </div>
      {/* Form to add/update customer details */}
      <div className="bg-white p-2 pb-2">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6} className="mt-2">
              <Form.Group controlId="customerName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter Customer Name"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="contactInfo">
                <Form.Label>Contact Info</Form.Label>
                <Form.Control
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Enter Contact Info"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter Address"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="pinCode">
                <Form.Label>Pin Code</Form.Label>
                <Form.Control
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="Enter Pin Code"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="associatedDealer">
                <Form.Label>Associated Dealer</Form.Label>
                <Select
                  name="associatedDealer"
                  options={[
                    { value: 'Dealer A', label: 'Dealer A' },
                    { value: 'Dealer B', label: 'Dealer B' },
                    { value: 'Dealer C', label: 'Dealer C' },
                  ]}
                  value={{ value: formData.associatedDealer, label: formData.associatedDealer }}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'associatedDealer')}
                  placeholder="Select Associated Dealer"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="warrantyStatus">
                <Form.Label>Warranty Status</Form.Label>
                <Select
                  name="warrantyStatus"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Expired', label: 'Expired' },
                    { value: 'Pending', label: 'Pending' },
                  ]}
                  value={{ value: formData.warrantyStatus, label: formData.warrantyStatus }}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'warrantyStatus')}
                  placeholder="Select Warranty Status"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
                    <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                      <ButtonGroup aria-label="Basic example" className="w-100">
                        <Link to="/pages/CustomerMaster">
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

export default CustomerMasterInsert;
