import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';

interface Customer {
  id: number;
  storeName: string;
  dealerName: string;
  officialMobileNumber: string;
  officialEmailid: string;
  officialAddress: string;
  officialPincode: string;
  fullName: string;
  personalMobileNumber: string;
  personalEmailid: string;
  personalAddress: string;
  personalPincode: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}




const EmployeeMasterInsert = () => {
  const { id } = useParams<{ id: any }>();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [empName, setEmpName] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [customer, setCustomer] = useState<Customer>({
    id: 0,
    storeName: '',
    dealerName: '',
    officialMobileNumber: '',
    officialEmailid: '',
    officialAddress: '',
    officialPincode: '',
    personalMobileNumber: '',
    fullName: '',
    personalEmailid: '',
    personalAddress: '',
    personalPincode: '',
    createdBy: '',
    createdDate: '',
    updatedBy: '',
    updatedDate: ''
  });

  useEffect(() => {
    toast.dismiss();
    const storedEmpName = localStorage.getItem('EmpName');
    const storedEmpID = localStorage.getItem('EmpId');
    if (storedEmpName && storedEmpID) {
      setEmpName(`${storedEmpName} - ${storedEmpID}`);
    } else {
      setEmpName('Unknown');
    }
  }, []);

  useEffect(() => {
    if (id) {
      setEditMode(true);
      fetchCustomerById(id);
    } else {
      setEditMode(false);
    }
  }, [id]);

  const fetchCustomerById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`${config.API_URL}/CustomerMaster/GetCustomerMaster/${id}`);
      if (response.data.isSuccess) {
        const fetchedCustomer = response.data.customer_Masters[0];
        setCustomer(fetchedCustomer);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };




  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value
    });
  };


  const validateFields = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!customer.storeName) errors.storeName = 'Store Name is required';
    if (!customer.dealerName) errors.dealerName = 'Dealer Name is required';
    if (!customer.officialMobileNumber) errors.officialMobileNumber = 'Official Mobile Number is required';
    if (!customer.officialEmailid) errors.officialEmailid = 'Official Email is required';
    if (!customer.personalMobileNumber) errors.personalMobileNumber = 'Personal Mobile Number is required';
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
      ...customer,
      createdBy: editMode ? customer.createdBy : empName,
      updatedBy: empName,
      updatedDate: new Date(),
      createdDate: editMode ? customer.createdDate : new Date(),
    };
    console.log(payload)
    try {
      let apiUrl = `${config.API_URL}/CustomerMaster/CreateCustomerMaster`;

      if (editMode && id) {
        apiUrl = `${config.API_URL}/CustomerMaster/UpdateCustomerMaster/${id}`;
      }
      const method = editMode && id ? 'PUT' : 'POST';

      const response = await axiosInstance({
        method,
        url: apiUrl,
        data: payload
      });

      if (response.status === 200) {
        navigate('/pages/CustomerMaster', {
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
    <div>
      <div className="bg-white p-3 mt-3">
        <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
          <h4 className="text-primary m-0">
            <i className="ri-file-list-line me-2"></i>
            <span className="fw-bold">{editMode ? 'Edit Customer' : 'Add Customer'}</span>
          </h4>
        </div>
        <div className="bg-white p-2 rounded-3 border">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}>
                <Form.Group controlId="storeName" className="mb-3">
                  <Form.Label><i className="ri-store-line"></i> Store Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="storeName"
                    value={customer.storeName}
                    onChange={handleChange}
                    placeholder="Enter Store Name"
                    className={validationErrors.storeName ? "input-border" : ""}
                  />
                  {validationErrors.storeName && <small className="text-danger">{validationErrors.storeName}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="dealerName" className="mb-3">
                  <Form.Label><i className="ri-store-line"></i> Dealer Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="dealerName"
                    value={customer.dealerName}
                    onChange={handleChange}
                    placeholder="Enter Dealer Name"
                    className={validationErrors.dealerName ? "input-border" : ""}
                  />
                  {validationErrors.dealerName && <small className="text-danger">{validationErrors.dealerName}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="officialMobileNumber" className="mb-3">
                  <Form.Label><i className="ri-phone-line"></i> Official Mobile Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="officialMobileNumber"
                    value={customer.officialMobileNumber}
                    onChange={handleChange}
                    placeholder="Enter Official Mobile Number"
                    className={validationErrors.officialMobileNumber ? "input-border" : ""}
                  />
                  {validationErrors.officialMobileNumber && <small className="text-danger">{validationErrors.officialMobileNumber}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="officialEmailid" className="mb-3">
                  <Form.Label><i className="ri-mail-line"></i> Official Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="officialEmailid"
                    value={customer.officialEmailid}
                    onChange={handleChange}
                    placeholder="Enter Official Email"
                    className={validationErrors.officialEmailid ? "input-border" : ""}
                  />
                  {validationErrors.officialEmailid && <small className="text-danger">{validationErrors.officialEmailid}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="officialAddress" className="mb-3">
                  <Form.Label><i className="ri-map-pin-line"></i> Official Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="officialAddress"
                    value={customer.officialAddress}
                    onChange={handleChange}
                    placeholder="Enter Official Address"
                    className={validationErrors.officialAddress ? "input-border" : ""}
                  />
                  {validationErrors.officialAddress && <small className="text-danger">{validationErrors.officialAddress}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="officialPincode" className="mb-3">
                  <Form.Label><i className="ri-map-pin-line"></i> Official Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="officialPincode"
                    value={customer.officialPincode}
                    onChange={handleChange}
                    placeholder="Enter Official Pincode"
                    className={validationErrors.officialPincode ? "input-border" : ""}
                  />
                  {validationErrors.officialPincode && <small className="text-danger">{validationErrors.officialPincode}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="fullName" className="mb-3">
                  <Form.Label><i className="ri-map-pin-line"></i> Full Name </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={customer.fullName}
                    onChange={handleChange}
                    placeholder="Enter Official Pincode"
                    className={validationErrors.fullName ? "input-border" : ""}
                  />
                  {validationErrors.fullName && <small className="text-danger">{validationErrors.fullName}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="personalMobileNumber" className="mb-3">
                  <Form.Label><i className="ri-phone-line"></i> Personal Mobile Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="personalMobileNumber"
                    value={customer.personalMobileNumber}
                    onChange={handleChange}
                    placeholder="Enter Personal Mobile Number"
                    className={validationErrors.personalMobileNumber ? "input-border" : ""}
                  />
                  {validationErrors.personalMobileNumber && <small className="text-danger">{validationErrors.personalMobileNumber}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="personalEmailid" className="mb-3">
                  <Form.Label><i className="ri-mail-line"></i> Personal Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="personalEmailid"
                    value={customer.personalEmailid}
                    onChange={handleChange}
                    placeholder="Enter Personal Email"
                    className={validationErrors.personalEmailid ? "input-border" : ""}
                  />
                  {validationErrors.personalEmailid && <small className="text-danger">{validationErrors.personalEmailid}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="personalAddress" className="mb-3">
                  <Form.Label><i className="ri-map-pin-line"></i> Personal Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="personalAddress"
                    value={customer.personalAddress}
                    onChange={handleChange}
                    placeholder="Enter Personal Address"
                    className={validationErrors.personalAddress ? "input-border" : ""}
                  />
                  {validationErrors.personalAddress && <small className="text-danger">{validationErrors.personalAddress}</small>}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="personalPincode" className="mb-3">
                  <Form.Label><i className="ri-map-pin-line"></i> Personal Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="personalPincode"
                    value={customer.personalPincode}
                    onChange={handleChange}
                    placeholder="Enter Personal Pincode"
                    className={validationErrors.personalPincode ? "input-border" : ""}
                  />
                  {validationErrors.personalPincode && <small className="text-danger">{validationErrors.personalPincode}</small>}
                </Form.Group>
              </Col>
              {/* Add more fields if needed */}

              <Col className="align-items-end d-flex justify-content-end mb-3">
                <div>
                  <Link to="/pages/CustomerMaster">
                    <Button variant="primary">Back</Button>
                  </Link>
                  &nbsp;
                  <Button variant="primary" type="submit">
                    {editMode ? 'Update Customer' : 'Add Customer'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>

  );
};

export default EmployeeMasterInsert;
