import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';

interface Department {
    id: number;
    departmentName: string;
    departmentCode: string;
    departmentDescription: string;
    spareName: string;
    description: string;
    quantity: number;
    location: string;
    restockDate: string;
    serialNumber: string;
    associatedProduct: string;
    remarks: string;
    status: number;
    createdBy: string;
    updatedBy: string;
}

const DepartmentMasterInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department>({
        id: 0,
        departmentName: '',
        departmentCode: '',
        departmentDescription: '',
        spareName: '',
        description: '',
        quantity: 0,
        location: '',
        restockDate: '',
        serialNumber: '',
        associatedProduct: '',
        remarks: '',
        status: 0,
        createdBy: '',
        updatedBy: '',
    });

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        toast.dismiss();
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);

    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchDepartmentById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchDepartmentById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/DepartmentMaster/GetDepartment`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.departments[0];
                setDepartments(fetchedDepartment);
            } else {
                toast.error(response.data.message || 'Failed to fetch department data');
            }
        } catch (error) {
            toast.error('Error fetching department data');
            console.error('Error fetching department:', error);
        }
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!departments.departmentName.trim()) errors.departmentName = 'Department Name is required';
        if (!departments.departmentCode.trim()) errors.departmentCode = 'Department Code is required';
        if (!departments.departmentDescription.trim()) errors.departmentDescription = 'Department Description is required';
        if (!departments.spareName.trim()) errors.spareName = 'Spare Name is required';
        if (!departments.description.trim()) errors.description = 'Description is required';
        if (departments.quantity < 1) errors.quantity = 'Quantity should be greater than zero';
        if (!departments.location.trim()) errors.location = 'Location is required';
        if (!departments.restockDate.trim()) errors.restockDate = 'Restock Date is required';
        if (!departments.serialNumber.trim()) errors.serialNumber = 'Serial Number is required';
        if (!departments.associatedProduct.trim()) errors.associatedProduct = 'Associated Product is required';
        if (departments.status === null || departments.status === undefined) errors.status = 'Status is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseInt(value, 10) : value;
        setDepartments({
            ...departments,
            [name]: parsedValue
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFields()) {
            toast.dismiss();
            toast.error('Please fill in all required fields.');
            return;
        }

        const payload = {
            ...departments,
            createdBy: editMode ? departments.createdBy : empName,
            updatedBy: editMode ? empName : ''
        };

        try {
            const apiUrl = `${config.API_URL}/DepartmentMaster/InsertorUpdateDepartment`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/producMaster', {
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
            toast.dismiss();
            toast.error(error.response?.data?.message || 'An error occurred while submitting the form.');
            console.error('Error submitting department:', error);
        }
    };

    return (
        <div>
            <div className="bg-white p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit Department' : 'Add Department'}</span>
                    </h4>
                </div>
                <div className="bg-white p-2 rounded-3 border">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="spareName" className="mb-3">
                                    <Form.Label>Spare Name</Form.Label>
                                    <Form.Control type="text" name="spareName" value={departments.spareName} onChange={handleChange} placeholder="Enter Spare Name" />
                                    {validationErrors.spareName && <small className="text-danger">{validationErrors.spareName}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="quantity" className="mb-3">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control type="number" name="quantity" value={departments.quantity} onChange={handleChange} placeholder="Enter Quantity" />
                                    {validationErrors.quantity && <small className="text-danger">{validationErrors.quantity}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="location" className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type="text" name="location" value={departments.location} onChange={handleChange} placeholder="Enter Location" />
                                    {validationErrors.location && <small className="text-danger">{validationErrors.location}</small>}

                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="restockDate" className="mb-3">
                                    <Form.Label>Restock Date</Form.Label>
                                    <Form.Control type="date" name="restockDate" value={departments.restockDate} onChange={handleChange} />
                                    {validationErrors.restockDate && <small className="text-danger">{validationErrors.restockDate}</small>}

                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="serialNumber" className="mb-3">
                                    <Form.Label>Serial Number</Form.Label>
                                    <Form.Control type="text" name="serialNumber" value={departments.serialNumber} onChange={handleChange} placeholder="Enter Serial Number" />
                                    {validationErrors.serialNumber && <small className="text-danger">{validationErrors.serialNumber}</small>}

                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="associatedProduct" className="mb-3">
                                    <Form.Label>Associated Product</Form.Label>
                                    <Form.Control type="text" name="associatedProduct" value={departments.associatedProduct} onChange={handleChange} placeholder="Enter Associated Product" />
                                    {validationErrors.associatedProduct && <small className="text-danger">{validationErrors.associatedProduct}</small>}

                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">{editMode ? 'Update Department' : 'Add Department'}</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default DepartmentMasterInsert;
