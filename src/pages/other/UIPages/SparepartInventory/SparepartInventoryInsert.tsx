import { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
// import Select from 'react-select';
import { Link, useNavigate, useParams } from 'react-router-dom';
import config from '@/config';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';

function SparepartInventoryInsert() {
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        id: 0,
        item_Name: '',
        category: '',
        brand: '',
        model_Number: '',
        description: '',
        stock_Quantity: 0,
        reorder_Level: 0,
        stock_Location: '',
        purchase_Price: 0,
        selling_Price: 0,
        currency: '',
        supplier_Name: '',
        supplier_ID: 0,
        supplier_Contact: '',
        voltage_Wattage: '',
        connector_Type: '',
        cable_Length: '',
        warranty_Period: '',
        manufacturing_Date: '',
        expiry_Date: '',
        batch_Number: '',
        serial_Number: '',
        status: 0,
        created_By: '',
        created_Date: '',
        updated_By: '',
        updated_Date: '',
    });

    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchEmployeeById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchEmployeeById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/InventorySpare/GetInventorySpare/${id}`);
            if (response.data.isSuccess) {
                const fetchedEmployee = response.data.inventorySpares[0];
                setFormData(fetchedEmployee);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    // Handle input change for text and number fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct the API request body
        const payload = {
            ...formData,
            updated_Date: new Date(),
            created_Date: editMode ? formData.created_Date : new Date(),
        }
        console.log(payload)

        try {
            let apiUrl = `${config.API_URL}/InventorySpare/CreateInventorySpare`;

            if (editMode && id) {
                apiUrl = `${config.API_URL}/InventorySpare/UpdateInventorySpare/${id}`;
            }

            const method = editMode && id ? 'PUT' : 'POST';

            const response = await axiosInstance({
                method,
                url: apiUrl,
                data: payload
            });

            if (response.status === 200) {
                navigate('/pages/SparepartInventory', {
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
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting employee:', error);
        }
    };

    return (
        <div className="bg-white p-2 pb-2 mt-3">
            <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                <h4 className="text-primary m-0">
                    <i className="ri-file-list-line me-2"></i>
                    <span className="fw-bold">{editMode ? 'Edit Spare Part' : 'Add Spare Part'}</span>
                </h4>
            </div>

            <div className="bg-white p-2 rounded-3 border">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="item_Name">
                                <Form.Label>Spare Part Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_Name"
                                    value={formData.item_Name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Spare Part Name"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Enter Category"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="brand">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="Enter Brand"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="model_Number">
                                <Form.Label>Model Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="model_Number"
                                    value={formData.model_Number}
                                    onChange={handleInputChange}
                                    placeholder="Enter Model Number"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter Description"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="stock_Quantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock_Quantity"
                                    value={formData.stock_Quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter Quantity"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="purchase_Price">
                                <Form.Label>Purchase Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="purchase_Price"
                                    value={formData.purchase_Price}
                                    onChange={handleInputChange}
                                    placeholder="Enter Purchase Price"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="selling_Price">
                                <Form.Label>Selling Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="selling_Price"
                                    value={formData.selling_Price}
                                    onChange={handleInputChange}
                                    placeholder="Enter Selling Price"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="currency">
                                <Form.Label>Currency</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    placeholder="Enter Currency"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="supplier_Name">
                                <Form.Label>Supplier Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="supplier_Name"
                                    value={formData.supplier_Name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Supplier Name"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="supplier_Contact">
                                <Form.Label>Supplier Contact</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="supplier_Contact"
                                    value={formData.supplier_Contact}
                                    onChange={handleInputChange}
                                    placeholder="Enter Supplier Contact"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="voltage_Wattage">
                                <Form.Label>Voltage/Wattage</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="voltage_Wattage"
                                    value={formData.voltage_Wattage}
                                    onChange={handleInputChange}
                                    placeholder="Enter Voltage/Wattage"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="connector_Type">
                                <Form.Label>Connector Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="connector_Type"
                                    value={formData.connector_Type}
                                    onChange={handleInputChange}
                                    placeholder="Enter Connector Type"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="cable_Length">
                                <Form.Label>Cable Length</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cable_Length"
                                    value={formData.cable_Length}
                                    onChange={handleInputChange}
                                    placeholder="Enter Cable Length"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="warranty_Period">
                                <Form.Label>Warranty Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="warranty_Period"
                                    value={formData.warranty_Period}
                                    onChange={handleInputChange}
                                    placeholder="Enter Warranty Period"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="batch_Number">
                                <Form.Label>Batch Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="batch_Number"
                                    value={formData.batch_Number}
                                    onChange={handleInputChange}
                                    placeholder="Enter Batch Number"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="serial_Number">
                                <Form.Label>Serial Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="serial_Number"
                                    value={formData.serial_Number}
                                    onChange={handleInputChange}
                                    placeholder="Enter Serial Number"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="manufacturing_Date">
                                <Form.Label>Manufacturing Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="manufacturing_Date"
                                    value={formData.manufacturing_Date}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2 mb-3">
                            <Form.Group controlId="expiry_Date">
                                <Form.Label>Expiry Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="expiry_Date"
                                    value={formData.expiry_Date}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col className="align-items-end d-flex justify-content-end mb-3">
                            <div>
                                <Link to="/pages/SparepartInventory">
                                    <Button variant="primary " className="me-2">
                                        Back
                                    </Button>
                                </Link>
                                <Button type="submit" variant="primary">
                                    {editMode ? 'Update Inventory' : 'Add Inventory'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default SparepartInventoryInsert;
