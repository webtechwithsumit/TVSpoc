import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, Link, useParams } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { useAuthContext } from '@/common';

interface Manager {
    id: number;
    roleName: string;
    status: number;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
}

const RoleMasterInsert = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get `id` from URL params

    const [editMode, setEditMode] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [manager, setManager] = useState<Manager>({
        id: 0,
        roleName: '',
        status: 1, // default to active
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: ''
    });

    useEffect(() => {
        toast.dismiss();
        if (id) {
            // If id is available, set editMode and fetch data
            setEditMode(true);
            fetchRoleData(Number(id));
        }
    }, [id]);

    const fetchRoleData = async (roleId: number) => {
        try {
            const apiUrl = `${config.API_URL}/RoleMaster/GetRoleMaster/${roleId}`;
            const response = await axiosInstance.get(apiUrl);

            if (response.status === 200 && response.data.isSuccess) {
                const roleData = response.data.role_Masters[0];
                setManager({
                    id: roleData.id,
                    roleName: roleData.roleName,
                    status: roleData.status,
                    createdBy: roleData.createdBy,
                    createdDate: roleData.createdDate,
                    updatedBy: roleData.updatedBy,
                    updatedDate: roleData.updatedDate,
                });
            } else {
                toast.error(response.data.message || 'Failed to fetch role data');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error fetching role data');
            console.error('Error fetching role data:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
        setManager(prev => ({ ...prev, [name]: parsedValue }));
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!manager.roleName) errors.roleName = 'Role Name is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss();

        if (!validateFields()) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const now = new Date().toISOString();
        const empCode = `${user?.userName}-${user?.userID}`;

        const payload = {
            ...manager,
            createdBy: editMode ? manager.createdBy : empCode,
            createdDate: editMode ? manager.createdDate : now,
            updatedBy: empCode,
            updatedDate: now,
        };

        try {
            let apiUrl = `${config.API_URL}/RoleMaster/CreateRoleMaster`;

            // Use PUT for update if in edit mode
            if (editMode) {
                apiUrl = `${config.API_URL}/RoleMaster/UpdateRoleMaster/${manager.id}`;
                const response = await axiosInstance.put(apiUrl, payload);

                if (response.status === 200 && response.data.isSuccess) {
                    toast.success(response.data.message || 'Role updated successfully');
                    navigate('/pages/RoleMaster', {
                        state: { successMessage: 'Record updated successfully!' }
                    });
                } else {
                    toast.error(response.data.message || 'Failed to update role');
                }
            } else {
                const response = await axiosInstance.post(apiUrl, payload);

                if (response.status === 200 && response.data.isSuccess) {
                    toast.success(response.data.message || 'Role added successfully');
                    navigate('/pages/RoleMaster', {
                        state: { successMessage: 'Record added successfully!' }
                    });
                } else {
                    toast.error(response.data.message || 'Failed to add role');
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting manager:', error);
        }
    };

    return (
        <div>
            <div className="bg-white p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit' : 'Add'} Role </span>
                    </h4>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="roleName" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Role Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roleName"
                                        value={manager.roleName}
                                        onChange={handleChange}
                                        placeholder='Enter Role Name'
                                        className={validationErrors.roleName ? "input-border" : ""}
                                    />
                                    {validationErrors.roleName && <small className="text-danger">{validationErrors.roleName}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label><i className="ri-flag-line"></i> Status</Form.Label>
                                    <div className="d-flex mt-1">
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusActive"
                                            name="status"
                                            value={1}
                                            label="Active"
                                            checked={manager.status === 1}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value={0}
                                            label="Inactive"
                                            checked={manager.status === 0}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/RoleMaster'}>
                                        <Button variant="primary">Back</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update' : 'Add'} Role
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RoleMasterInsert;
