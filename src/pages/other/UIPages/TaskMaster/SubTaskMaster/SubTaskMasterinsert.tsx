import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import Select from 'react-select';

interface Department {
    id: number;
    subTaskName: string;
    taskName: string;
    taskID: number;
    slaTime: string;
    status: number;
    createdBy: string;
    updatedBy: string;
}

interface TaskList {
    id: number;
    taskName: string;
}


const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [subTaskMaster, setSubTaskMaster] = useState<Department>({
        id: 0,
        subTaskName: '',
        taskName: '',
        taskID: 0,
        slaTime: '',
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
            const response = await axios.get(`${config.API_URL}/SubTaskMaster/GetSubTaskList`, {
                params: { id: id, Flag: 2 }
            });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.subTaskMasterLists[0];
                setSubTaskMaster(fetchedDepartment);
            } else {
                toast.error(response.data.message || 'Failed to fetch department data');
            }
        } catch (error) {
            toast.error('Error fetching department data');
            console.error('Error fetching department:', error);
        }
    };

    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName] as Department[]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };

        fetchData('CommonDropdown/GetTaskList', setTaskList, 'getTaskLists');
    }, []);

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!subTaskMaster.slaTime.trim()) { errors.slaTime = 'SlaTime is required'; }
        if (!subTaskMaster.subTaskName.trim()) { errors.subTaskName = 'SubTask Name is required'; }
        if (!subTaskMaster.taskName.trim()) { errors.taskName = 'Task Name is required'; }
        if (subTaskMaster.status === null || subTaskMaster.status === undefined) { errors.status = 'Status is required'; }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
        setSubTaskMaster({
            ...subTaskMaster,
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
            ...subTaskMaster,
            createdBy: editMode ? subTaskMaster.createdBy : empName,
            updatedBy: editMode ? empName : ''
        };


        console.log(payload)
        try {
            const apiUrl = `${config.API_URL}/SubTaskMaster/InsertUpdateTask`;
            const response = await axios.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/SubTaskMaster', {
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
                        <span className="fw-bold">{editMode ? 'Edit ' : 'Add '} SubTask</span>
                    </span>
                </div>
                <div className="bg-white p-2 rounded-3 border">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label><i className="ri-task-line"></i> Task Name <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="taskID"
                                        value={taskList.find((emp) => emp.taskName === subTaskMaster.taskName)}
                                        onChange={(selectedOption) => {
                                            setSubTaskMaster({
                                                ...subTaskMaster,
                                                taskID: selectedOption?.id || 0,
                                                taskName: selectedOption?.taskName || '',
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.taskName}
                                        getOptionValue={(emp) => String(emp.id)}
                                        options={taskList}
                                        isSearchable={true}
                                        placeholder="Select Task Name"
                                        className={validationErrors.taskName ? "input-border" : ""}
                                    />
                                    {validationErrors.taskName && <small className="text-danger">{validationErrors.taskName}</small>}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="subTaskName" className="mb-3">
                                    <Form.Label><i className="ri-corner-down-right-line"></i> Sub Task Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subTaskName"
                                        value={subTaskMaster.subTaskName}
                                        onChange={handleChange}
                                        placeholder="Enter Sub Task Name"
                                        className={validationErrors.subTaskName ? 'input-border' : ''}
                                    />
                                    {validationErrors.subTaskName && (
                                        <small className="text-danger">{validationErrors.subTaskName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="slaTime" className="mb-3">
                                    <Form.Label><i className="ri-time-line"></i>Sla Time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="slaTime"
                                        value={subTaskMaster.slaTime}
                                        onChange={handleChange}
                                        placeholder="Enter Sla Time"
                                        className={validationErrors.slaTime ? 'input-border' : ''}
                                    />
                                    {validationErrors.slaTime && (
                                        <small className="text-danger">{validationErrors.slaTime}</small>
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
                                            checked={subTaskMaster.status === 1}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value="0"
                                            label="Inactive"
                                            checked={subTaskMaster.status === 0}
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
                                    <Link to="/pages/SubTaskMaster">
                                        <Button variant="primary">Back</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update ' : 'Add '} SubTask
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
