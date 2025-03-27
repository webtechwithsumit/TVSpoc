import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';

function SparepartInventoryInsert() {
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
        created_By: '',
        created_Date: '',
        updated_By: '',
        updated_Date: '',
    });

    // Fetch data from API and set form data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://tvsapi.clay.in/api/InventorySpare/GetInventorySpare/0');
                const data = await response.json();

                if (data.isSuccess && data.inventorySpares.length > 0) {
                    const sparePart = data.inventorySpares[0];
                    setFormData(sparePart)

                    // Assuming we are working with the first spare part from the list
                    //   setFormData({
                    //     item_Name: sparePart.item_Name,
                    //     description: sparePart.description,
                    //     stock_Quantity: sparePart.stock_Quantity,
                    //     stock_Location: sparePart.stock_Location,
                    //     expiry_Date: sparePart.expiry_Date.split('T')[0], // Assuming expiry date as restock date
                    //     serial_Number: sparePart.serial_Number,
                    //     batch_Number: sparePart.batch_Number,
                    //     // Map other fields as needed
                    //     manufacturing_Date: new Date().toISOString(),
                    //     created_Date: new Date().toISOString(),
                    //     updated_Date: new Date().toISOString(),
                    //   });
                }
            } catch (error) {
                console.error('Error fetching inventory spare parts:', error);
            }
        };

        fetchData();
    }, []);

    // Handle input change for text and number fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle Select input change
    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct the API request body
        const requestBody = {
            id: formData.id,
            item_Name: formData.item_Name,
            category: formData.category,
            brand: formData.brand,
            model_Number: formData.model_Number,
            description: formData.description,
            stock_Quantity: formData.stock_Quantity,
            reorder_Level: formData.reorder_Level,
            stock_Location: formData.stock_Location,
            purchase_Price: formData.purchase_Price,
            selling_Price: formData.selling_Price,
            currency: formData.currency,
            supplier_Name: formData.supplier_Name,
            supplier_ID: formData.supplier_ID,
            supplier_Contact: formData.supplier_Contact,
            voltage_Wattage: formData.voltage_Wattage,
            connector_Type: formData.connector_Type,
            cable_Length: formData.cable_Length,
            warranty_Period: formData.warranty_Period,
            manufacturing_Date: formData.manufacturing_Date,
            expiry_Date: formData.expiry_Date,
            batch_Number: formData.batch_Number,
            serial_Number: formData.serial_Number,
            created_By: formData.created_By,
            created_Date: formData.created_Date,
            updated_By: formData.updated_By,
            updated_Date: formData.updated_Date,
        };

        // Make the API request
        try {
            const response = await fetch('https://tvsapi.clay.in/api/InventorySpare/CreateInventorySpare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (data.isSuccess) {
                alert('Spare part added successfully');
            } else {
                alert('Failed to add spare part');
            }
        } catch (error) {
            console.error('Error submitting spare part:', error);
        }
    };

    return (
        <div className="bg-white p-2 pb-2">
            <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                <h4 className="text-primary m-0">
                    <i className="ri-file-list-line me-2"></i>
                    <span className="fw-bold">Add Spare Part</span>
                </h4>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={6} className="mt-2">
                        <Form.Group controlId="item_Name">
                            <Form.Label>Spare Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="item_Name"
                                value={formData.item_Name}
                                onChange={handleInputChange}
                                placeholder="Enter Spare Name"
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
                        <Form.Group controlId="stock_Location">
                            <Form.Label>Location</Form.Label>
                            <Select
                                name="stock_Location"
                                options={[
                                    { value: 'Warehouse', label: 'Warehouse' },
                                    { value: 'Store', label: 'Store' },
                                    { value: 'Main Office', label: 'Main Office' },
                                ]}
                                value={formData.stock_Location ? { value: formData.stock_Location, label: formData.stock_Location } : null}
                                onChange={(selectedOption) => handleSelectChange('stock_Location', selectedOption?.value)}
                                placeholder="Select Location"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={6} className="mt-2">
                        <Form.Group controlId="restockDate">
                            <Form.Label>Restock Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="expiry_Date"
                                value={formData.expiry_Date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={6} className="mt-2">
                        <Form.Group controlId="serialNumber">
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
                        <Form.Group controlId="batchNumber">
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
                </Row>

                <Row className="mt-3">
                    <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                        <ButtonGroup aria-label="Basic example" className="w-100">
                            <Link to="/pages/SparepartInventory">
                                <Button type="button" variant="primary">
                                    Back
                                </Button>
                            </Link>
                            &nbsp;
                            <Button type="submit" variant="primary">
                                Save
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default SparepartInventoryInsert;