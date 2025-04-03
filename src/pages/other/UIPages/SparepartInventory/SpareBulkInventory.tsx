import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import config from '@/config';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';

function SparepartBulkInventoryInsert() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target.files?.[0];
        if (fileInput) {
            setFile(fileInput);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please choose a file to upload.");
            return;
        }

        // Construct the FormData object for file upload
        const formData = new FormData();
        formData.append("file", file);

        try {
            const apiUrl = `${config.API_URL}/InventorySpare/UploadBulkInventorySpare`;
            const response = await axiosInstance.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                navigate('/pages/SparepartInventory', {
                    state: {
                        successMessage: `File uploaded successfully!`
                    }
                });
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error uploading file');
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="bg-white p-2 pb-2 mt-3">
            <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                <h4 className="text-primary m-0">
                    <i className="ri-file-list-line me-2"></i>
                    <span className="fw-bold">Upload Bulk Inventory</span>
                </h4>
            </div>

            <div className="bg-white p-2 rounded-3 border">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6} className="mt-2 mb-3">
                            <Form.Group controlId="file">
                                <Form.Label>Upload Bulk Inventory File (CSV)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    accept=".csv"
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
                                    Upload CSV
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default SparepartBulkInventoryInsert;
