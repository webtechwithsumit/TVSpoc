import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';


interface Department {
    id: number;
    departmentName: string;
    departmentCode: string;
    departmentDescription: string;
    status: number;
    createdBy: string;
    updatedBy: string;
}




const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department>({
        id: 0,
        departmentName: '',
        departmentCode: '',
        departmentDescription: '',
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

        if (!departments.departmentName.trim()) {
            errors.departmentName = 'Department Name is required';
        }
        if (!departments.departmentCode.trim()) {
            errors.departmentCode = 'Department Code is required';
        }
        if (!departments.departmentDescription.trim()) {
            errors.departmentDescription = 'Department Description is required';
        }
        if (departments.status === null || departments.status === undefined) {
            errors.status = 'Status is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
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


        console.log(payload)
        try {
            const apiUrl = `${config.API_URL}/DepartmentMaster/InsertorUpdateDepartment`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/departmentMaster', {
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
            <div className=" bg-white  p-3 mt-3">
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
                                <Form.Group controlId="departmentName" className="mb-3">
                                    <Form.Label><i className="ri-building-line"></i> Department Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="departmentName"
                                        value={departments.departmentName}
                                        onChange={handleChange}
                                        placeholder="Enter Department Name"
                                        className={validationErrors.departmentName ? 'input-border' : ''}
                                    />
                                    {validationErrors.departmentName && (
                                        <small className="text-danger">{validationErrors.departmentName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="departmentCode" className="mb-3">
                                    <Form.Label><i className="ri-building-line"></i> Department Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="departmentCode"
                                        value={departments.departmentCode}
                                        onChange={handleChange}
                                        placeholder="Enter Department Code"
                                        className={validationErrors.departmentCode ? 'input-border' : ''}
                                    />
                                    {validationErrors.departmentCode && (
                                        <small className="text-danger">{validationErrors.departmentCode}</small>
                                    )}
                                </Form.Group>
                            </Col>




                            <Col lg={6}>
                                <Form.Group controlId="departmentDescription" className="mb-3">
                                    <Form.Label><i className="ri-building-line"></i> Department Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="departmentDescription"
                                        value={departments.departmentDescription}
                                        onChange={handleChange}
                                        placeholder="Enter Department Description"
                                        className={validationErrors.departmentDescription ? 'input-border' : ''}
                                        rows={3}
                                        maxLength={300}
                                    />
                                    {validationErrors.departmentDescription && (
                                        <small className="text-danger">{validationErrors.departmentDescription}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={2}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label><i className="ri-flag-line"></i> Status</Form.Label>
                                    <div className="d-flex mt-1">
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusActive"
                                            name="status"
                                            value="1"
                                            label="Active"
                                            checked={departments.status === 1}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value="0"
                                            label="Inactive"
                                            checked={departments.status === 0}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {validationErrors.status && (
                                        <small className="text-danger">{validationErrors.status}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col className="d-flex justify-content-end mb-3">
                                <div>
                                    <Link to="/pages/DepartmentMaster">
                                        <Button variant="primary">Back</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Department' : 'Add Department'}
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

export default DepartmentMasterinsert;
