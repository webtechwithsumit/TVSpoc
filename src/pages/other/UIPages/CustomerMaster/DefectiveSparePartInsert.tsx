import { useState } from 'react';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap'; 
import Select from 'react-select'; 
import { Link } from 'react-router-dom';

function DefectiveSparePartInsert() {
  // State for form values, initialize location as an object
  const [formData, setFormData] = useState({
    spareName: '',
    description: '',
    location: { value: '', label: '' } // Initializing as an object
  });

  const handleSelectChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setFormData({ ...formData, location: selectedOption });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="bg-white p-2 pb-2">
      <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
        <h4 className="text-primary m-0">
          <i className="ri-file-list-line me-2"></i>
          <span className="fw-bold"> Add Defective Spare</span>
        </h4>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8} className="mt-2">
            <Form.Group controlId="spareName">
              <Form.Label>Defective Spare Part</Form.Label>
              <Form.Control
                type="text"
                name="spareName"
                placeholder="Enter Spare Name"
                value={formData.spareName}
                onChange={(e) => setFormData({ ...formData, spareName: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                value={formData.location} // Ensure this is an object
                onChange={handleSelectChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
            <ButtonGroup aria-label="Basic example" className="w-100">
              <Link to="/pages/DefectiveSparePart">
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

export default DefectiveSparePartInsert;
