import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';
import axiosInstance from '@/utils/axiosInstance';


interface Employee {
    id: number;
    userName: string;
    email: string;
    mobileNumber: string;
    managerName: string;
    departmentID: number;
    departmentName: string;
    status: number;
    createdBy: string;
    updatedBy: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}




const EmployeeMaster = () => {
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'storeName', label: 'Store Name', visible: true },
        { id: 'dealerName', label: 'Dealer Name', visible: true },
        { id: 'officialMobileNumber', label: 'Official Mobile Number', visible: true },
        { id: 'officialEmailid', label: 'Official Email', visible: true },
        { id: 'officialAddress', label: 'Official Address', visible: true },
        { id: 'officialPincode', label: 'Official Pincode', visible: true },
        { id: 'fullName', label: 'Full Name', visible: true },
        { id: 'personalMobileNumber', label: 'Personal Mobile Number', visible: true },
        { id: 'personalEmailid', label: 'Personal Email', visible: true },
        { id: 'personalAddress', label: 'Personal Address', visible: true },
        { id: 'personalPincode', label: 'Personal Pincode', visible: true },
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================



    const [searchEmployee, setSearchEmployee] = useState('');
    const [searchProject, setSearchProject] = useState('');
    const [searchAppAccessLevel, setSearchAppAccessLevel] = useState('');
    const [searchDataAccessLevel, setSearchDataAccessLevel] = useState('');
    const [searchAppAccess, setSearchAppAccess] = useState('');
    const [searchEmpstatus, setSearchEmpstatus] = useState('');



    useEffect(() => {
        if (!searchTriggered) {
            fetchEmployee();
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchTriggered) {
            if (searchEmployee || searchProject || searchAppAccessLevel || searchDataAccessLevel || searchAppAccess || searchEmpstatus) {
                (async () => {
                    await handleSearch();
                })();
            } else {
                fetchEmployee();
            }
        }
    }, [searchTriggered, currentPage]);


    const handleSearch = async () => {
        try {
            let query = `?`;

            if (searchEmployee) query += `EmployeeName=${searchEmployee}&`;
            if (searchProject) query += `CurrentProjectName=${searchProject}&`;
            if (searchAppAccessLevel) query += `AppAccessLevel=${searchAppAccessLevel}&`;
            if (searchDataAccessLevel) query += `DataAccessLevel=${searchDataAccessLevel}&`;
            if (searchAppAccess) query += `AppAccess=${searchAppAccess}&`;
            if (searchEmpstatus) query += `EmpStatus=${searchEmpstatus}&`;
            query += `PageIndex=${currentPage}`;
            query = query.endsWith('&') ? query.slice(0, -1) : query;

            const apiUrl = `${config.API_URL}/EmployeeMaster/SearchEmployee${query}`;
            console.log("API URL:", apiUrl);

            setLoading(true);

            const { data } = await axiosInstance.get(apiUrl, { headers: { accept: '*/*' } });

            if (data.isSuccess) {  // Ensure successful response
                setEmployee(data.employeeMasterList);
                setTotalPages(Math.ceil(data.totalCount / 10));
                console.log("Search Response:", data.employeeMasterList);
            } else {
                console.log("Error in API response:", data.message);  // Handle error message if needed
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleClear = async () => {
        setCurrentPage(1);
        setSearchEmployee('');
        setSearchProject('');
        setSearchAppAccessLevel('');
        setSearchDataAccessLevel('');
        setSearchAppAccess('');
        setSearchEmpstatus('');
        setSearchTriggered(false);
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchEmployee();
    };


    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/CustomerMaster/GetCustomerMaster/0`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.customer_Masters);
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



    return (

        <div className='p-3 mt-3 bg-white'>
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i>  Customer Master </h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary" className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/CustomerMasterinsert'>
                            <Button variant="primary" className="">
                                Add Customer
                            </Button>
                        </Link>
                    </div>
                </div>
            </Row>


            <div className='bg-white p-2 pb-2'>

                <Form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSearchTriggered(true);
                        await setCurrentPage(1);

                    }}
                >
                    <Row>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Store Name</Form.Label>
                                <Select
                                    name="searchEmployee"
                                    placeholder="Select Store Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>



                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchProject">
                                <Form.Label>Department Name</Form.Label>
                                <Select
                                    name="searchProject"
                                    placeholder="Select Department Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>



                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmpstatus">
                                <Form.Label> Status</Form.Label>
                                <Select
                                    name="searchEmpstatus"
                                    placeholder="Select  Status"
                                />
                            </Form.Group>
                        </Col>

                        <Col></Col>

                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
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

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <>

                    <div className="overflow-auto text-nowrap ">
                        {!employee ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>You currently don't have any Data</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className='bg-white custom-table'>
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
                                                                        {column.id === 'managerName' && (<i className="ri-user-line"></i>)}
                                                                        {column.id === 'departmentName' && (<i className="ri-briefcase-line"></i>)}
                                                                        {column.id === 'status' && (<i className="ri-flag-line"></i>)}
                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    <th className='text-center'>Action</th>
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {employee.length > 0 ? (
                                            employee.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}>

                                                            {col.id === 'status' ? (item.status === 1 ? 'Active' : 'Inactive') : (
                                                                <div>{item[col.id as keyof Employee]}</div>
                                                            )}

                                                        </td>
                                                    ))}

                                                    <td className='text-center'>
                                                        <Link to={`/pages/CustomerMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white me-3'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>

                                                        </Link>
                                                        <Button variant='primary' className='p-0 text-white'>
                                                            <i className=" btn ri-delete-bin-6-line text-white"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={12}>
                                                    <Container className="mt-5">
                                                        <Row className="justify-content-center">
                                                            <Col xs={12} md={8} lg={6}>
                                                                <Alert variant="info" className="text-center">
                                                                    <h4>No Data  Found</h4>
                                                                    <p>You currently don't have any Data</p>
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
                </>

            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
};

export default EmployeeMaster;