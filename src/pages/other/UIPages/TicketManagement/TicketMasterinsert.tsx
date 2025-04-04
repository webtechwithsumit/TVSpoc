import { useAuthContext } from '@/common';
import config from '@/config';
import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';  // Ensure you have react-bootstrap installed
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileUploader } from '@/components/FileUploader';

function TicketMasterinsert() {
  const { user } = useAuthContext()
  const { id } = useParams<{ id: any }>();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});


  const [formData, setFormData] = useState({
    ticketID: 0,
    callNo: '',
    initiator: `${user?.userName} - ${user?.userID}` || '',
    assignedTo: 0,
    ticketStatus: '',
    registrationDate: '',
    responseTime: '',
    customerAcknowledgment: '',
    engineerFollowUp: '',
    issueDescription: '',
    createdBy: '',
    ticketType: '',
    lastUpdated: '',
    productName: '',
    modelNo: '',
    brand: '',
  });




  useEffect(() => {
    if (id) {
      setEditMode(true);
      fetchEmployeeById(id);
    } else {
      setEditMode(false);
    }
  }, [id]);

  const fetchEmployeeById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`${config.API_URL}/EmployeeMaster/GetEmployeeMaster/${id}`, {
      });
      if (response.data.isSuccess) {
        const fetchedEmployee = response.data.employee_Masters[0];
        setFormData(fetchedEmployee);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateFields = (): boolean => {
    const errors: { [key: string]: string } = {};
    // if (!employee.userName) errors.userName = 'User Name is required';
    // if (!employee.email) errors.email = 'Email is required';
    // if (!employee.mobileNumber) errors.mobileNumber = 'Mobile Number is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateFields()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      // createdBy: editMode ? formData.createdBy : empName,
      // updatedBy: editMode ? empName : '',
      ticketStatus: editMode ? formData.ticketStatus : 'Active',
      registrationDate: editMode ? formData.registrationDate : new Date(),
      responseTime: editMode ? formData.responseTime : new Date(),
      lastUpdated: editMode ? formData.lastUpdated : new Date(),
    };


    console.log(payload)
    try {

      let apiUrl = `${config.API_URL}/TicketMaster/CreateTicketMaster`;

      if (editMode && id) {
        apiUrl = `${config.API_URL}/TicketMaster/UpdateTicketMaster/${id}`;
      }

      const method = editMode && id ? 'PUT' : 'POST';

      const response = await axiosInstance({
        method,
        url: apiUrl,
        data: payload
      });

      if (response.status === 200) {
        navigate('/pages/Ticket', {
          state: {
            successMessage: editMode
              ? `Record updated successfully!`
              : `Record added successfully!`
          }
        });
      } else {
        toast.error(response.data.message || 'Failed to process request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error Adding/Updating');
      console.error('Error submitting employee:', error);
    }
  };


  return (
    <div className=" bg-white  p-3 mt-3">
      <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
        <h4 className='text-primary m-0'>
          <i className="ri-file-list-line me-2"></i>
          <span className="fw-bold">{editMode ? 'Edit' : 'Generate '} Ticket</span>
        </h4>
      </div>

      <div className='bg-white p-2 rounded-3 border'>
        <Form onSubmit={handleSubmit}>
          <Row>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="initiator">
                <Form.Label>Initiator</Form.Label>
                <Form.Control
                  type="text"
                  name="initiator"
                  value={formData.initiator}
                  placeholder="Enter Initiator Name"
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="callNo">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="callNo"
                  value={formData.callNo}
                  onChange={handleInputChange}
                  placeholder="Enter Call Number"
                  className={validationErrors.callNo ? "input-border" : ""}
                />
                {validationErrors.callNo && <small className="text-danger">{validationErrors.callNo}</small>}
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter Product Name"
                  className={validationErrors.productName ? "input-border" : ""}
                />
                {validationErrors.productName && <small className="text-danger">{validationErrors.productName}</small>}
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="modelNo">
                <Form.Label>Model No</Form.Label>
                <Form.Control
                  type="text"
                  name="modelNo"
                  value={formData.modelNo}
                  onChange={handleInputChange}
                  placeholder="Enter Modale No"
                  className={validationErrors.modelNo ? "input-border" : ""}
                />
                {validationErrors.modelNo && <small className="text-danger">{validationErrors.modelNo}</small>}
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-2">
              <Form.Group controlId="brand">
                <Form.Label>Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter Brand Name"
                  className={validationErrors.brand ? "input-border" : ""}
                />
                {validationErrors.brand && <small className="text-danger">{validationErrors.brand}</small>}
              </Form.Group>
            </Col>



            <Col lg={6} className="mt-2">
              <Form.Group controlId="ticketType">
                <Form.Label>Ticket Type</Form.Label>
                <Form.Control
                  as="select"
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleInputChange}
                >
                  <option value="">---Select---</option>
                  <option value="Damage">Damage</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Installation">Installation</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Spare Request">Spare Request</option>
                  <option value="Warranty Claim">Warranty Claim</option>
                  <option value="Upgrade Request">Upgrade Request</option>
                  <option value="Performance Issue">Performance Issue</option>
                  <option value="Customer Training">Customer Training</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>

            {
              user?.roles === 'Admin' && (

                <>


                  <Col lg={6} className="mt-2">
                    <Form.Group controlId="assignedTo">
                      <Form.Label>Assigned To</Form.Label>
                      <Form.Control
                        type="number"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        placeholder="Enter Assignee ID"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mt-2">
                    <Form.Group controlId="ticketStatus">
                      <Form.Label>Ticket Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="ticketStatus"
                        value={formData.ticketStatus}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mt-2">
                    <Form.Group controlId="responseTime">
                      <Form.Label>Response Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="responseTime"
                        value={formData.responseTime}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>





                  <Col lg={6} className="mt-2">
                    <Form.Group controlId="customerAcknowledgment">
                      <Form.Label>Customer Acknowledgment</Form.Label>
                      <Form.Control
                        type="text"
                        name="customerAcknowledgment"
                        value={formData.customerAcknowledgment}
                        onChange={handleInputChange}
                        placeholder="Enter Customer Acknowledgment"
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6} className="mt-2">
                    <Form.Group controlId="engineerFollowUp">
                      <Form.Label>Engineer Follow Up</Form.Label>
                      <Form.Control
                        type="text"
                        name="engineerFollowUp"
                        value={formData.engineerFollowUp}
                        onChange={handleInputChange}
                        placeholder="Enter Engineer Follow Up"
                      />
                    </Form.Group>
                  </Col>
                </>

              )
            }


            <Col lg={6} className="mt-2">
              <Form.Group controlId="issueDescription">
                <Form.Label>Problem Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  placeholder="Enter Issue Description"
                />
              </Form.Group>
            </Col>

            <Col lg={6} className='mt-2'>
              <Form.Group controlId="processFlowchart" className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <FileUploader
                  icon="ri-upload-cloud-2-line"
                  text="Drop files here or click to upload."
                  // endPoint={`${config.API_URL}/FileUpload/UploadFiles`}
                  // additionalData={{
                  //   moduleName: process.moduleName,
                  //   processName: process.processDisplayName,
                  //   CreatedBy: empName,
                  //   UpdatedBy: empName,
                  // }}
                  onFileUpload={(files) => {
                    console.log('Files uploaded:', files);
                  }}
                />
              </Form.Group>
            </Col>



          </Row>

          <Col className='align-items-end d-flex justify-content-end mb-3 mt-2'>
            <div>
              <Link to={'/pages/TicketManagement'}>
                <Button variant="primary">
                  Back
                </Button>
              </Link>
              &nbsp;
              <Button variant="primary" type="submit">
                {editMode ? 'Update Ticket' : 'Submit Ticket'}
              </Button>
            </div>
          </Col>
        </Form>
      </div>
    </div>
  );
}

export default TicketMasterinsert;
