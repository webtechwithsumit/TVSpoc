import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '@/pages/other/Component/PaginationComponent';



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
    tatList: TATItem[];
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}


interface DepartmentList {
    id: number;
    departmentName: string;
}

const TaskManagement = () => {
    const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [searchDept, setSearchDept] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);


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

    useEffect(() => {
        fetchData();
    }, [currentPage]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL}/Workflow/GetWorkflowList`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setTaskDetails(response.data.workflowLists);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (searchDept || searchStatus) {
            handleSearch();
        } else {
            fetchData();
        }
    }, [currentPage, searchDept, searchStatus, searchTriggered]);



    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (searchDept) query += `DepartmentName=${searchDept}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL}/DepartmentMaster/SearchDepartment${query}`;
        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log("search response ", response.data.departments);
                setTaskDetails(response.data.departments)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };
        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
    }, []);

    const handleClear = async () => {
        setCurrentPage(1);
        setSearchDept('');
        setSearchStatus('')
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchData();
    };




    const optionsStatus = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>WorkFLow List</span></span>
                <div className="d-flex justify-content-end  ">

                    <Button variant="primary"
                        className="me-2">
                        Download CSV
                    </Button>
                    <Link to='/pages/WorkFlowinsert'>
                        <Button variant="primary" className="me-2">
                            Add WorkFLow
                        </Button>
                    </Link>

                </div>
            </div>


            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (

                <>
                    <div className='bg-white p-2 pb-2'>

                        <Form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setCurrentPage(1);
                                setSearchTriggered(true);
                            }}
                        >

                            <Row>
                                <Col lg={4}>
                                    <Form.Group controlId="searchDept">
                                        <Form.Label>Department Name</Form.Label>
                                        <Select
                                            name="searchDept"
                                            value={departmentList.find(item => item.departmentName === searchDept) || null}
                                            onChange={(selectedOption) => setSearchDept(selectedOption ? selectedOption.departmentName : '')}
                                            options={departmentList}
                                            getOptionLabel={(item) => item.departmentName}
                                            getOptionValue={(item) => item.departmentName}
                                            isSearchable={true}
                                            placeholder="Select Department Name"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={4} className="">
                                    <Form.Group controlId="searchStatus">
                                        <Form.Label>Status</Form.Label>
                                        <Select
                                            name="searchStatus"
                                            options={optionsStatus}
                                            value={optionsStatus.find(option => option.value === searchStatus) || null}
                                            onChange={(selectedOption) => setSearchStatus(selectedOption?.value || '')}
                                            placeholder="Select Status"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={4} className="align-items-end d-flex justify-content-end mt-2">
                                    <ButtonGroup aria-label="Basic example" className="w-100">
                                        <Button type="button" variant="primary" onClick={handleClear}>
                                            <i className="ri-loop-left-line"></i>
                                        </Button>
                                        &nbsp;
                                        <Button type="submit" variant="primary"

                                        >
                                            Search
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Form>



                        <Row className='mt-3'>
                            <div className="d-flex justify-content-end bg-light p-1">
                                <div className="app-search d-none d-lg-block me-4">
                                </div>

                            </div>
                        </Row>
                    </div>

                    <div className="overflow-auto text-nowrap">
                        {!taskDetails ? (
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
                            <>


                                <div className="table-container ">
                                    <Table hover className='bg-white custom-table '>
                                        <thead>
                                            <tr>
                                                <th >Workflow</th>
                                                <th className=' text-center'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taskDetails.map((subTask) => (
                                                <tr key={subTask.id} >
                                                    <td>
                                                        <h4 className='my-2'>{subTask.initiatorDepartmentName}</h4>
                                                        <DragDropContext onDragEnd={handleOnDragEnd}>
                                                            <Table hover className='bg-white '>
                                                                <thead>
                                                                    <Droppable droppableId="columns" direction="horizontal">
                                                                        {(provided) => (
                                                                            <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                                                <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                                                {columns.filter(col => col.visible).map((column, index) => (
                                                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                                        {(provided) => (
                                                                                            <th>
                                                                                                <div ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}>
                                                                                                    {column.id === 'departmentName' && (<i className="ri-group-fill"></i>)}
                                                                                                    {column.id === 'status' && (<i className="ri-file-list-fill"></i>)}

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
                                                                    {subTask.tatList.length > 0 ? (
                                                                        subTask.tatList.map((item, index) => (
                                                                            <>
                                                                                <tr key={item.id}>
                                                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                                                    {columns.filter(col => col.visible).map((col) => (
                                                                                        <td key={col.id}
                                                                                            className={
                                                                                                col.id === 'departmentName' ? 'fw-bold  text-dark ' : ''
                                                                                            }
                                                                                        >
                                                                                            <div>{item[col.id as keyof TATItem]}</div>
                                                                                        </td>
                                                                                    ))}
                                                                                </tr>
                                                                            </>
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




                                                    </td>
                                                    <td className='w-10 text-center'>
                                                        <Link to={`/pages/WorkFlowinsert/${subTask.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>

                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />


        </>
    );
};

export default TaskManagement;