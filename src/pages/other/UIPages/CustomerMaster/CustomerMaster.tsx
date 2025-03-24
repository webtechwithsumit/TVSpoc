import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';

interface CustomerDetails {
    id: number;
    customerName: string;
    contactInfo: string;
    address: string;
    pinCode: string;
    associatedDealer: string;
    warrantyStatus: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const CustomerMaster = () => {
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    console.log(setTotalPages)
    console.log(setCustomerDetails)
    console.log(setLoading)
    

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss();
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);

    // Column configuration for drag-and-drop table columns
    const [columns, setColumns] = useState<Column[]>([
        { id: 'customerName', label: 'Customer Name', visible: true },
        { id: 'contactInfo', label: 'Contact Info', visible: true },
        { id: 'address', label: 'Address', visible: true },
        { id: 'pinCode', label: 'Pin Code', visible: true },
        { id: 'associatedDealer', label: 'Associated Dealer', visible: true },
        { id: 'warrantyStatus', label: 'Warranty Status', visible: true }
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };



    return (
        <div className='p-3 mt-3 bg-white'>
            <Row className='mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0'>
                        <i className="ri-file-list-line me-2 text-primary"></i> Customer Master
                    </h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary" className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/CustomerMasterInsert'>
                            <Button variant="primary">
                                Add Customer
                            </Button>
                        </Link>
                    </div>
                </div>
            </Row>

           

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <div className="overflow-auto text-nowrap">
                    {!customerDetails.length ? (
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
                                                <th>Sr. No</th>
                                                {columns.filter(col => col.visible).map((column, index) => (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th>
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                    {column.label}
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
                                    {customerDetails.length > 0 ? (
                                        customerDetails.slice(0, 10).map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                {columns.filter(col => col.visible).map((col) => (
                                                    <td key={col.id}>
                                                        {item[col.id as keyof CustomerDetails]}
                                                    </td>
                                                ))}
                                                <td>
                                                    <Link to={`/pages/CustomerMasterInsert/${item.id}`}>
                                                        <Button variant='primary' className='icon-padding text-white'>
                                                            <i className='fs-18 ri-edit-line text-white'></i>
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
                                                                <h4>No Data Found</h4>
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
            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
};

export default CustomerMaster;
