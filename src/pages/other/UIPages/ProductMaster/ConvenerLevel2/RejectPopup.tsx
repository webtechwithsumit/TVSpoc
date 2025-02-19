import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import config from "@/config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "@/common";
import axiosInstance from "@/utils/axiosInstance";

interface ProductDetails {
    id: number;
    productName: string;
    departmentName: string;
    startDate: string;
}

interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
    dataItem: ProductDetails | any;
}

const RejectPopup: React.FC<ProcessCanvasProps> = ({ show, setShow, dataItem }) => {
    const { user } = useAuthContext()
    const [projects, setProjects] = useState<ProductDetails>({
        id: 0,
        productName: '',
        departmentName: '',
        startDate: ''
    });

    const [rejectValue, setRejectValue] = useState('');

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
            id: projects.id,
            rejectedReason: rejectValue,
            isRejected: 1,
            updatedBy: `${user?.employeeName ?? "Unknown Employee"} - ${user?.userName ?? "Unknown User"}`,
        };
        console.log(payload)

        try {
            const apiUrl = `${config.API_URL}/Product/ApproveRejectProduct`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                toast.warning(response.data.message || 'Rejected Successfully');
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting employee:', error);
        }
    };


    return (
        <div>
            <Modal className="p-2" show={show} placement="end" onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Reason Of Rejection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="">
                            <Row className="mb-2">
                                <Col lg={6}>
                                    <span className="text-primary fs-16 fw-bold"> Product : </span>
                                    <span className="text-dark">{projects.productName}</span>
                                </Col>
                                <Col lg={6}>
                                    <span className="text-primary fs-16 fw-bold"> Product Department : </span>
                                    <span className="text-dark">{projects.departmentName}</span>
                                </Col>
                                {/* <Col lg={4}>
                                    <span className="text-primary fs-16 fw-bold"> Start Date : </span>
                                    <span className="text-dark">{projects.startDate}</span>
                                </Col> */}
                            </Row>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Reason Of Rejection</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={rejectValue}
                                    onChange={(e) => setRejectValue(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default RejectPopup;
