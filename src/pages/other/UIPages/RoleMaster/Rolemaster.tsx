import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';
import axiosInstance from '@/utils/axiosInstance';
import Select from 'react-select';  // Ensure you import the Select component

interface RoleMaster {
    id: number;
    roleName: string;
    status: number;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const RoleMaster = () => {
    const [employee, setEmployee] = useState<RoleMaster[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [roleNameFilter, setRoleNameFilter] = useState<string>('');  // For storing selected role name

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss();
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);

    // Both are required to make draggable columns in the table
    const [columns, setColumns] = useState<Column[]>([
        { id: 'roleName', label: 'Role Name', visible: true },
        { id: 'status', label: 'Status', visible: true },
        { id: 'createdBy', label: 'Created By', visible: true },
        { id: 'createdDate', label: 'Created Date', visible: true },
        { id: 'updatedBy', label: 'Updated By', visible: true },
        { id: 'updatedDate', label: 'Updated Date', visible: true },
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };

    useEffect(() => {
        fetchEmployee();
    }, [currentPage, roleNameFilter]);  // Re-fetch when roleNameFilter changes

    const handleClear = async () => {
        setRoleNameFilter('');
        setCurrentPage(1);
        await fetchEmployee();
    };

    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('https://tvsapi.clay.in/api/RoleMaster/GetRoleMaster/0', {
                params: { PageIndex: currentPage, RoleName: roleNameFilter }  // Sending the selected role name in the query
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.role_Masters);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching role masters:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 mt-3 bg-white'>
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0'>
                        <i className="ri-file-list-line me-2 text-primary "></i>Roles Master
                    </h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary" className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/RoleMasterinsert'>
                            <Button variant="primary">
                                Add Role
                            </Button>
                        </Link>
                    </div>
                </div>
            </Row>

            <div className='bg-white p-2 pb-2'>
                <Form onSubmit={async (e) => e.preventDefault()}>
                    <Row>
                        <Col lg={8} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Role Name</Form.Label>
                                <Select
                                    name="searchRole"
                                    // value={roleNameFilter ? { label: roleNameFilter, value: roleNameFilter } : null}  // Set the value based on roleNameFilter
                                    // onChange={(selectedOption) => setRoleNameFilter(selectedOption ? selectedOption.value : '')}  // Update filter on change
                                    // options={employee.map(emp => ({ label: emp.roleName, value: emp.roleName }))}
                                    placeholder="Select Role Name"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                            <ButtonGroup aria-label="Basic example" className="w-100">
                                <Button type="button" variant="primary" onClick={handleClear}>
                                    <i className="ri-loop-left-line"></i>
                                </Button>
                                &nbsp;
                                <Button type="submit" variant="primary">
                                    Search
                                </Button>
                            </ButtonGroup>
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
                <div className="overflow-auto text-nowrap">
                    {employee.length === 0 ? (
                        <Container className="mt-5">
                            <Row className="justify-content-center">
                                <Col xs={12} md={8} lg={6}>
                                    <Alert variant="info" className="text-center">
                                        <h4>No Data Found</h4>
                                        <p>You currently don't have any data</p>
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
                                                <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                                {columns.filter(col => col.visible).map((column, index) => (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                {column.label}
                                                            </th>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                <th>Action</th>
                                            </tr>
                                        )}
                                    </Droppable>
                                </thead>
                                <tbody>
                                    {employee.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            {columns.filter(col => col.visible).map((col) => (
                                                <td key={col.id}>
                                                    {col.id === 'status' ? (
                                                        item.status === 1 ? 'Active' : 'Inactive'
                                                    ) : (
                                                        <div>{item[col.id as keyof RoleMaster]}</div>
                                                    )}
                                                </td>
                                            ))}
                                            <td>
                                                <Link to={`/pages/RoleMasterinsert/${item.id}`}>
                                                    <Button variant='primary' className='icon-padding text-white'>
                                                        <i className='fs-18 ri-edit-line text-white'></i>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </DragDropContext>
                    )}
                </div>
            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
};

export default RoleMaster;
