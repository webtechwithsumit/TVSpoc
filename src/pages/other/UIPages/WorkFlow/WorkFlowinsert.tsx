import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';



interface TATItem {
    id: number;
    departmentID: number;
    departmentName: string;
    userID: number;
    userName: string;
    slaTime: string;
}

interface TaskDetails {
    id: number;
    initiatorDepartmentID: number;
    initiatorDepartmentName: string;
    taskID: number;
    taskName: string;
    subTaskID: number;
    subTaskName: string;
    departmentID: number;
    departmentName: string;
    userID: number;
    userName: string;
    emailID: string;
    slaTime: string;
    createdBy: string;
    tatList: TATItem[];
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface Department {
    id: number;
    departmentName: string;
}
interface TaskList {
    id: number;
    taskName: string;
}
interface SubTaskList {
    id: number;
    subTaskName: string;
    slaTime: string;
}


const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [taskDetail, setTaskDetail] = useState<TaskDetails>({
        id: 1,
        initiatorDepartmentID: 0,
        initiatorDepartmentName: "",
        taskID: 0,
        taskName: "",
        subTaskID: 1,
        subTaskName: "",
        departmentID: 0,
        departmentName: "",
        userID: 0,
        userName: "",
        emailID: "",
        slaTime: "",
        createdBy: "",
        tatList: [],
    });

    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [subTaskList, setSubTaskList] = useState<SubTaskList[]>([]);

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





    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'departmentName', label: 'Department Name', visible: true },
        { id: 'userName', label: 'User Name', visible: true },
        { id: 'slaTime', label: 'SlaTime', visible: true },
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================






    const fetchDepartmentById = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL}/Workflow/GetWorkflowList`, { params: { id: id } });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.workflowLists[0];
                setTaskDetail(fetchedDepartment);
            } else {
                toast.error(response.data.message || 'Failed to fetch department data');
            }
        } catch (error) {
            toast.error('Error fetching department data');
            console.error('Error fetching department:', error);
        }
        finally {
            setLoading(false);
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

        fetchData('CommonDropdown/GetDepartmentList', setDepartmentList, 'getDepartmentLists');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'getTaskLists');

    }, []);

    useEffect(() => {
        const fetchSubTasks = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/CommonDropdown/GetSubTaskByTaskID`, {
                    params: { TaskID: taskDetail.taskID },
                });
                if (response.data.isSuccess) {
                    const fetchedSubTasks = response.data.subtasks;
                    setSubTaskList(fetchedSubTasks);
                } else {
                    toast.error(response.data.message || 'Failed to fetch subtasks');
                }
            } catch (error) {
                toast.error('Error fetching subtasks');
                console.error('Error fetching subtasks:', error);
            }
        };

        if (taskDetail.taskID) {
            fetchSubTasks();
        }
    }, [taskDetail.taskID]);


    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!taskDetail.departmentName.trim()) { errors.departmentName = 'Department Name is required'; }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };





    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
        setTaskDetail({
            ...taskDetail,
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
            ...taskDetail,
            createdBy: editMode ? taskDetail.createdBy : empName,
            updatedBy: editMode ? empName : ''
        };


        console.log(payload)
        try {
            const apiUrl = `${config.API_URL}/Department/InsertUpdateDepartment`;
            const response = await axios.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/departmentMaster', {
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
            <div className="">
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
                                <Form.Group controlId="departmentID" className="mb-3">
                                    <Form.Label><i className="ri-building-line"></i> Department Name <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="departmentID"
                                        value={departmentList.find((emp) => emp.id === taskDetail.departmentID)}
                                        onChange={(selectedOption) => {
                                            setTaskDetail({
                                                ...taskDetail,
                                                departmentID: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.departmentName}
                                        getOptionValue={(emp) => String(emp.id)}
                                        options={departmentList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        className={validationErrors.departmentID ? "input-border" : ""}
                                    />
                                    {validationErrors.departmentID && <small className="text-danger">{validationErrors.departmentID}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="emailID" className="mb-3">
                                    <Form.Label><i className="ri-mail-line"></i> Email ID</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="emailID"
                                        value={taskDetail.emailID}
                                        onChange={handleChange}
                                        placeholder="Enter Email Id"
                                        className={validationErrors.emailID ? 'input-border' : ''}
                                    />
                                    {validationErrors.emailID && (
                                        <small className="text-danger">{validationErrors.emailID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="taskName" className="mb-3">
                                    <Form.Label> <i className="ri-task-line"></i> Task Name <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="taskName"
                                        value={taskList.find((emp) => emp.taskName === taskDetail.taskName)}
                                        onChange={(selectedOption) => {
                                            setTaskDetail({
                                                ...taskDetail,
                                                taskName: selectedOption?.taskName || '',
                                                taskID: selectedOption?.id || 0,
                                                subTaskName: '',
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.taskName}
                                        getOptionValue={(emp) => String(emp.taskName)}
                                        options={taskList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        className={validationErrors.departmentID ? "input-border" : ""}
                                    />
                                    {validationErrors.departmentID && <small className="text-danger">{validationErrors.departmentID}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="subTaskName" className="mb-3">
                                    <Form.Label><i className="ri-corner-down-right-line"></i> SubTask Name <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="subTaskName"
                                        value={subTaskList.find((emp) => emp.subTaskName === taskDetail.subTaskName)}
                                        onChange={(selectedOption) => {
                                            setTaskDetail({
                                                ...taskDetail,
                                                subTaskName: selectedOption?.subTaskName || '',
                                                subTaskID: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.subTaskName}
                                        getOptionValue={(emp) => String(emp.subTaskName)}
                                        options={subTaskList}
                                        isSearchable={true}
                                        placeholder="Select Subtask"
                                        className={validationErrors.subTaskName ? "input-border" : ""}
                                    />
                                    {validationErrors.departmentID && <small className="text-danger">{validationErrors.departmentID}</small>}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="slaTime" className="mb-3">
                                    <Form.Label><i className="ri-time-line"></i> SLa Time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="slaTime"
                                        value={taskDetail.slaTime}
                                        onChange={handleChange}
                                        placeholder="Enter Email Id"
                                        className={validationErrors.slaTime ? 'input-border' : ''}
                                        disabled
                                    />
                                    {validationErrors.slaTime && (
                                        <small className="text-danger">{validationErrors.slaTime}</small>
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
                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (
                    <div className="overflow-auto text-nowrap rounded-3 mt-1">
                        {!taskDetail.tatList ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Task Found</h4>
                                            <p>You currently don't have Completed tasks</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className='bg-white custom-table p-2'>
                                    <thead>
                                        <Droppable droppableId="columns" direction="horizontal">
                                            {(provided) => (
                                                <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                    <th><i className="ri-list-ordered-2"></i>  Stage</th>
                                                    {columns.filter(col => col.visible).map((column, index) => (
                                                        <Draggable key={column.id} draggableId={column.id} index={index}>
                                                            {(provided) => (
                                                                <th>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        {column.id === 'taskName' && (<i className="ri-group-fill"></i>)}
                                                                        {column.id === 'status' && (<i className="ri-flag-line"></i>)}

                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {taskDetail.tatList.length > 0 ? (
                                            taskDetail.tatList.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                col.id === 'taskName' ? 'fw-bold  text-dark ' : ''
                                                            }
                                                        >
                                                            <div>{item[col.id as keyof TATItem]}</div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={12}>
                                                    <Container className="mt-5">
                                                        <Row className="justify-content-center">
                                                            <Col xs={12} md={8} lg={6}>
                                                                <Alert variant="info" className="text-center">
                                                                    <h4>No Data Found</h4>
                                                                    <p>You currently don't have Data</p>
                                                                </Alert>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </DragDropContext>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default DepartmentMasterinsert;
