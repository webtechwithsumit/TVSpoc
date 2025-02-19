import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';

interface TaskMaster {
    id: number;
    taskName: string;
    status: number;
    createdBy: string;
    updatedBy: string;
}

const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [taskName, settaskName] = useState<TaskMaster>({
        id: 0,
        taskName: '',
        status: 0,
        createdBy: '',
        updatedBy: ''
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
            const response = await axios.get(`${config.API_URL}/TaskMaster/GetTaskList`, {
                params: { id, Flag: 2 }
            });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.taskMasterLists[0];
                settaskName(fetchedDepartment);
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

        if (!taskName.taskName.trim()) {
            errors.taskName = 'Department Name is required';
        }
        if (taskName.status === null || taskName.status === undefined) {
            errors.status = 'Status is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
        settaskName({
            ...taskName,
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
            ...taskName,
            createdBy: editMode ? taskName.createdBy : empName,
            updatedBy: editMode ? empName : ''
        };
        try {
            const apiUrl = `${config.API_URL}/TaskMaster/InsertUpdateTask`;
            const response = await axios.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/TaskMaster', {
                    state: {
                        successMessage: editMode
                            ? `Record updated successfully!`
                            : `Record    added successfully!`
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
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit Department' : 'Add Department'}</span>
                    </span>
                </div>
                <div className="bg-white p-2 rounded-3 border">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="departmentName" className="mb-3">
                                    <Form.Label><i className="ri-task-line"></i> Task Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="departmentName"
                                        value={taskName.taskName}
                                        onChange={handleChange}
                                        placeholder="Enter Department Name"
                                        className={validationErrors.taskName ? 'input-border' : ''}
                                    />
                                    {validationErrors.taskName && (
                                        <small className="text-danger">{validationErrors.taskName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
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
                                            checked={taskName.status === 1}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value="0"
                                            label="Inactive"
                                            checked={taskName.status === 0}
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
                                    <Link to="/pages/TaskMaster">
                                        <Button variant="primary">Back</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update ' : 'Add '} Task
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
