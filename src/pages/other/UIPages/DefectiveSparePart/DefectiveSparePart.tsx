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

// Define the structure of the inventory spare items
interface InventorySpare {
    id: number;
    item_Name: string;
    category: string;
    brand: string;
    model_Number: string;
    description: string;
    stock_Quantity: number;
    reorder_Level: number;
    stock_Location: string;
    purchase_Price: number;
    selling_Price: number;
    currency: string;
    supplier_Name: string;
    supplier_ID: number;
    supplier_Contact: string;
    voltage_Wattage: string;
    connector_Type: string;
    cable_Length: string;
    warranty_Period: string;
    manufacturing_Date: string;
    expiry_Date: string;
    batch_Number: string;
    serial_Number: string;
    created_By: string;
    created_Date: string;
    updated_By: string;
    updated_Date: string;
}

// Structure for column management
interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const DefectiveSparePart = () => {
    const [inventorySpares, setInventorySpares] = useState<InventorySpare[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss();
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);

    // Manage column ordering and visibility
    const [columns, setColumns] = useState<Column[]>([
        { id: 'item_Name', label: 'Item Name', visible: true },
        { id: 'category', label: 'Category', visible: true },
        { id: 'brand', label: 'Brand', visible: true },
        { id: 'model_Number', label: 'Model Number', visible: true },
        { id: 'stock_Quantity', label: 'Stock Quantity', visible: true },
        { id: 'reorder_Level', label: 'Reorder Level', visible: true },
        { id: 'stock_Location', label: 'Stock Location', visible: true },
        { id: 'selling_Price', label: 'Selling Price', visible: true },
        { id: 'supplier_Name', label: 'Supplier Name', visible: true },
        { id: 'warranty_Period', label: 'Warranty Period', visible: true },
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/InventorySpare/GetDefectiveSparePartList`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setInventorySpares(response.data.inventorySpares);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching spare parts:', error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 mt-3 bg-white'>
           <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i>Defective Spare Part List</h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary" className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/SparepartInventoryInsert'>
                            <Button variant="primary" className="">
                            Spare part Inventory Maser
                            </Button>
                        </Link>
                    </div>
                </div>
            </Row>
            <div className='bg-white p-2 pb-2'>
                <Form onSubmit={async (e) => e.preventDefault()}>
                    <Row>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Item Name</Form.Label>
                                <Select
                                    name="searchspare"
                                    // value={roleNameFilter ? { label: roleNameFilter, value: roleNameFilter } : null}  // Set the value based on roleNameFilter
                                    // onChange={(selectedOption) => setRoleNameFilter(selectedOption ? selectedOption.value : '')}  // Update filter on change
                                    // options={employee.map(emp => ({ label: emp.roleName, value: emp.roleName }))}
                                    placeholder="Select Item Name"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Model Number</Form.Label>
                                <Select
                                    name="searchspare"
                                    // value={roleNameFilter ? { label: roleNameFilter, value: roleNameFilter } : null}  // Set the value based on roleNameFilter
                                    // onChange={(selectedOption) => setRoleNameFilter(selectedOption ? selectedOption.value : '')}  // Update filter on change
                                    // options={employee.map(emp => ({ label: emp.roleName, value: emp.roleName }))}
                                    placeholder="Select Model Number"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Brand Name</Form.Label>
                                <Select
                                    name="searchspare"
                                    // value={roleNameFilter ? { label: roleNameFilter, value: roleNameFilter } : null}  // Set the value based on roleNameFilter
                                    // onChange={(selectedOption) => setRoleNameFilter(selectedOption ? selectedOption.value : '')}  // Update filter on change
                                    // options={employee.map(emp => ({ label: emp.roleName, value: emp.roleName }))}
                                    placeholder="Select Brand Name"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Stock Location</Form.Label>
                                <Select
                                    name="searchspare"
                                    // value={roleNameFilter ? { label: roleNameFilter, value: roleNameFilter } : null}  // Set the value based on roleNameFilter
                                    // onChange={(selectedOption) => setRoleNameFilter(selectedOption ? selectedOption.value : '')}  // Update filter on change
                                    // options={employee.map(emp => ({ label: emp.roleName, value: emp.roleName }))}
                                    placeholder="Select Stock Location"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Supplier Name</Form.Label>
                                <Select
                                    name="searchspare"
                                    // value={roleNameFilter ? { label: roleNameFilter, value: roleNameFilter } : null}  // Set the value based on roleNameFilter
                                    // onChange={(selectedOption) => setRoleNameFilter(selectedOption ? selectedOption.value : '')}  // Update filter on change
                                    // options={employee.map(emp => ({ label: emp.roleName, value: emp.roleName }))}
                                    placeholder="Select Supplier Name"
                                />
                            </Form.Group>
                        </Col>


                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                            <ButtonGroup aria-label="Basic example" className="w-100">
                                <Button type="button" variant="primary" >
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
                    <div className="overflow-auto text-nowrap">
                        {!inventorySpares.length ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>No spare parts available.</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Table hover className="bg-white custom-table">
                                        <thead>
                                            <Droppable droppableId="columns" direction="horizontal">
                                                {(provided) => (
                                                    <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                        <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                                        {columns.filter((col) => col.visible).map((column, index) => (
                                                            <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                {(provided) => (
                                                                    <th>
                                                                        <div ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}>
                                                                            {column.label}
                                                                        </div>
                                                                    </th>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                )}
                                            </Droppable>
                                        </thead>
                                        <tbody>
                                            {inventorySpares.length > 0 ? (
                                                inventorySpares.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter((col) => col.visible).map((col) => (
                                                            <td key={col.id}>
                                                                {item[col.id as keyof InventorySpare] || '-'}
                                                            </td>
                                                        ))}
                                                        <td className="text-center">
                                                            <Link to={`/pages/SparepartInventoryInsert/${item.id}`}>
                                                                <Button variant="primary" className="p-0 text-white me-3">
                                                                    <i className="btn ri-edit-line text-white"></i>
                                                                </Button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={columns.length + 2}>
                                                        <Alert variant="info" className="text-center">
                                                            <h4>No Data Found</h4>
                                                            <p>No spare parts available.</p>
                                                        </Alert>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </DragDropContext>
                            </>
                        )}
                    </div>
                </>
            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
};

export default DefectiveSparePart;