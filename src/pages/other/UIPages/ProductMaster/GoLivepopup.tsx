import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axiosInstance from '@/utils/axiosInstance';
import config from "@/config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "@/common";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';



interface ProductDetails {
    id: number;
    productName: string;
    departmentName: string;
    launchRequestDate: string;
    launchDescription: string;
    launchDate: string;
    isLaunched: number;
}

interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
    dataItem: ProductDetails | any;
}

const GoLivepopup: React.FC<ProcessCanvasProps> = ({ show, setShow, dataItem }) => {
    const { user } = useAuthContext();
    const [projects, setProjects] = useState<ProductDetails>({
        id: 0,
        productName: '',
        departmentName: '',
        launchRequestDate: '',
        launchDescription: '',
        launchDate: '',
        isLaunched: 0,
    });

    useEffect(() => {
        if (show && dataItem) {
            setProjects(dataItem);
        }
    }, [show, dataItem]);

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss();

        if (!user) {
            toast.error("User information is not available.");
            return;
        }

        const payload = {
            productID: projects.id,
            launchRequestDate: projects.launchRequestDate,
            launchDescription: projects.launchDescription,
            launchDate: projects.launchDate,
            isLaunched: 1,
            updatedBy: `${user?.employeeName ?? "Unknown Employee"} - ${user?.userName ?? "Unknown User"}`,
        };


        try {
            const apiUrl = `${config.API_URL}/Product/UpdateLaunchDate`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                toast.success(response.data.message || 'Product Launched Successfully');
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error in Launching Product');
            console.error('Error submitting:', error);
        }
    };

    return (
        <div>
            <Modal className="p-2" show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Request for Product Launch</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-2">
                            <Col lg={6}>
                                <span className="text-primary fs-16 fw-bold">Product:</span>
                                <span className="text-dark"> {projects.productName}</span>
                            </Col>
                            <Col lg={6}>
                                <span className="text-primary fs-16 fw-bold">Department:</span>
                                <span className="text-dark"> {projects.departmentName}</span>
                            </Col>
                        </Row>


                        <Form.Group className="mb-3">
                            <Form.Label> Requested Launch Date  </Form.Label>
                            <Flatpickr
                                value={projects.launchRequestDate || ''}
                                onChange={([date]) => {
                                    if (date) {
                                        const formattedDate = date.toLocaleDateString('en-CA');
                                        setProjects({
                                            ...projects,
                                            launchRequestDate: formattedDate,
                                        });
                                    }
                                }}
                                options={{
                                    enableTime: false,
                                    dateFormat: "Y-m-d",
                                    time_24hr: false,
                                }}
                                placeholder="Requested Launch Date "
                                className={" form-control "}
                                disabled
                            
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label> Launch  Date  </Form.Label>
                            <Flatpickr
                                value={projects.launchDate || ''}
                                onChange={([date]) => {
                                    if (date) {
                                        const formattedDate = date.toLocaleDateString('en-CA');
                                        setProjects({
                                            ...projects,
                                            launchDate: formattedDate,
                                        });
                                    }
                                }}
                                options={{
                                    enableTime: false,
                                    dateFormat: "Y-m-d",
                                    time_24hr: false,
                                }}
                                placeholder="launch Date "
                                className={" form-control "}
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label> Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={projects.launchDescription}
                                onChange={(e) => setProjects({ ...projects, launchDescription: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Col className="d-flex justify-content-end">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GoLivepopup;
