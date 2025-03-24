import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';
import axiosInstance from '@/utils/axiosInstance';


interface RoleMaster {
    id: number;
    managerName: string;
    departmentID: number;
    status: number;
    createdBy: string;
    updatedBy: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}



const QualityCheckMaster = () => {
    const [employee, setEmployee] = useState<RoleMaster[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


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
            { id: 'item_Name', label: 'Item Name', visible: true },
            { id: 'category', label: 'Category', visible: true },
            { id: 'brand', label: 'Brand', visible: true },
            { id: 'model_Number', label: 'Model Number', visible: true },
            { id: 'stock_Quantity', label: 'Stock Quantity', visible: true },
            { id: 'reorder_Level', label: 'Reorder Level', visible: true },
            { id: 'stock_Location', label: 'Stock Location', visible: true },
            { id: 'selling_Price', label: 'Selling Price', visible: true },
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

        fetchEmployee();
    }, [currentPage]);




    const handleClear = async () => {
        setCurrentPage(1);
        await fetchEmployee();
    };


    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/InventorySpare/GetInventorySpare/0`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.inventorySpares);
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
                    <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i>Quality Check Master</h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary"
                            //  onClick={downloadCSV} 
                            className="me-2">
                            Download CSV
                        </Button>
                        {/* <Link to='/pages/QualityCheckMasterInsert'>
                            <Button variant="primary" className="">
                                Add Quality Check
                            </Button>
                        </Link> */}
                    </div>
                </div>
            </Row>
            <div className='bg-white p-2 pb-2'>
                <Form
                    onSubmit={async (e) => {
                        e.preventDefault();

                    }}
                >
                    <Row>
                        <Col lg={8} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Quality Check Master</Form.Label>
                               
                            </Form.Group>
                        </Col>
                       

                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                            <ButtonGroup aria-label="Basic example" className="w-100">
                                <Button type="button" variant="primary" onClick={handleClear}>
                                    <i className="ri-loop-left-line"></i>
                                </Button>
                                &nbsp;
                                <Button type="submit" variant="primary" >
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
                                                    <th>Action</th>
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
                                                                <div>{item[col.id as keyof RoleMaster]}</div>
                                                            )}

                                                        </td>
                                                    ))}
                                                    <td><Link to={`/pages/RoleMasterinsert/${item.id}`}>
                                                        <Button variant='primary' className='icon-padding text-white'>
                                                            {/* <i className='fs-18 ri-edit-line text-white' ></i> */}
                                                            Defective
                                                        </Button>
                                                    </Link>
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

export default QualityCheckMaster;