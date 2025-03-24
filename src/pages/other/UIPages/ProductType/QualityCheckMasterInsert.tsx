import { useState } from 'react';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select'; // Import Select and SingleValue
import { Link } from 'react-router-dom';

// Define the type for the location option
interface LocationOption {
  value: string;
  label: string;
}

function QualityCheckMasterInsert() {
  const [formData, setFormData] = useState({
    spareName: '',
    description: '',
    location: null as LocationOption | null, // Location will be null initially
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption: SingleValue<LocationOption>) => {
    setFormData({ ...formData, location: selectedOption });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Process formData here
    console.log(formData);
  };

  return (
    <div className="bg-white p-2 pb-2">
      <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
        <h4 className="text-primary m-0">
          <i className="ri-file-list-line me-2"></i>
          <span className="fw-bold"> Add Quality Check</span>
        </h4>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={6} className="mt-2">
            <Form.Group controlId="spareName">
              <Form.Label>Quality Check Master</Form.Label>
              <Form.Control
                type="text"
                name="spareName"
                placeholder="Enter Spare Name"
                value={formData.spareName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col lg={6} className="mt-2">
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col lg={6} className="mt-2">
            <Form.Group controlId="location">
              <Form.Label>Related Product</Form.Label>
              <Select
                name="location"
                options={[
                  { value: 'Warehouse', label: 'Warehouse' },
                  { value: 'Store', label: 'Store' },
                  { value: 'Main Office', label: 'Main Office' },
                ]}
                placeholder="Select Location"
                value={formData.location}
                onChange={handleSelectChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
            <ButtonGroup aria-label="Basic example" className="w-100">
              <Link to="/pages/QualityCheckMaster">
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
  );
}

export default QualityCheckMasterInsert;
