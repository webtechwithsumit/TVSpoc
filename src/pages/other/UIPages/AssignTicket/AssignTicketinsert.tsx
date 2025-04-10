import { useAuthContext } from '@/common';
import config from '@/config';
import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';  // Ensure you have react-bootstrap installed
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function TicketMasterinsert() {
    const { user } = useAuthContext()
    const { ticketID } = useParams<{ ticketID: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    // const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [employees, setEmployees] = useState<{ userName: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        assignmentID: 0,
        ticketID: 0,
        engineerID: '',
        engineerName: '',
        assignedDate: '',
        status: '',
        remarks: '',
        visitScheduled: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
    });

    useEffect(() => {
        fetchEmployeeList();
        if (ticketID) {
            setEditMode(true);
            fetchAssignmentById(ticketID);
        } else {
            setEditMode(false);
        }
    }, [ticketID]);

    const fetchEmployeeList = async () => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/CommonDropdown/GetEmployeeMasterList`);
            if (response.data.isSuccess) {
                setEmployees(response.data.activeEmployeeMasterDDL);
                console.log(response.data.activeEmployeeMasterDDL)
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    const fetchAssignmentById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/AssignEngineer/GetAssignment/${id}`);
            if (response.data.isSuccess) {
                const fetchedAssignment = response.data.assignment;
                setFormData(fetchedAssignment);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching assignment:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        // Perform validation here (e.g., ensure required fields are filled)
        // setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss();

        if (!validateFields()) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const payload = {
            ...formData,
            assignedDate: formData.assignedDate || new Date().toISOString(),
            visitScheduled: formData.visitScheduled || new Date().toISOString(),
            createdDate: formData.createdDate || new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            createdBy: formData.createdBy || user?.userName,
            updatedBy: formData.updatedBy || user?.userName,
            ticketID: ticketID,
        };

        console.log(payload)
        try {
            let apiUrl = `${config.API_URL}/AssignEngineer/InsertAssignEngineer`;

            // if (editMode && ticketID) {
            //     apiUrl = `${config.API_URL}/AssignEngineer/InsertAssignEngineer/${ticketID}`;
            // }

            const method = 'POST';

            const response = await axiosInstance({
                method,
                url: apiUrl,
                data: payload
            });

            if (response.status === 200) {
                navigate('/pages/TicketManagement', {
                    state: {
                        successMessage: editMode
                            ? `Assignment updated successfully!`
                            : `Assignment created successfully!`
                    }
                });
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error adding/updating assignment');
            console.error('Error submitting assignment:', error);
        }
    };

    return (
        <div className="bg-white p-3 mt-3">
            <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                <h4 className='text-primary m-0'>
                    <i className="ri-file-list-line me-2"></i>
                    <span className="fw-bold">Assign Engineer</span>
                </h4>
            </div>

            <div className='bg-white p-2 rounded-3 border'>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="engineerName">
                                <Form.Label>Engineer</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="engineerName"
                                    value={formData.engineerName}
                                    onChange={(e) => {
                                        const selectedEngineer = employees.find(employee => employee.name === e.target.value);
                                        setFormData({
                                            ...formData,
                                            engineerName: e.target.value,
                                            engineerID: selectedEngineer ? selectedEngineer.userName : '', // Set Engineer ID from selection
                                        });
                                    }}
                                    placeholder="Select Engineer"
                                >
                                    <option value="">---Select Engineer---</option>
                                    {employees.map((employee) => (
                                        <option key={employee.userName} value={employee.name}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="remarks">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    placeholder="Enter Remarks"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className="mt-2">
                            <Form.Group controlId="visitScheduled">
                                <Form.Label>Visit Scheduled</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="visitScheduled"
                                    value={formData.visitScheduled}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Col className='align-items-end d-flex justify-content-end mb-3 mt-2'>
                        <div>
                            <Link to={'/pages/TicketManagement'}>
                                <Button variant="primary">Back</Button>
                            </Link>
                            &nbsp;
                            <Button variant="primary" type="submit">
                                {editMode ? 'Update Engineer' : ' Assign Engineer'}
                            </Button>
                        </div>
                    </Col>
                </Form>
            </div>
        </div>
    );
}

export default TicketMasterinsert;
