import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import Select from 'react-select';

interface Employee {
    id: number;
    userName: string;
    name: string;
    email: string;
    mobileNumber: string;
    managerName: string;
    departmentID: number;
    officeLandline: string;
    roleName: string;
    departmentName: string;
    extensionNumber: string;
    password: string;
    status: number;
    createdBy: string;
    updatedBy: string;
    roleID: number;
}
interface DepartmentList {
    departmentName: string
    id: number
}

interface RoleList {
    id: number
    roleName: string
}



const EmployeeMasterInsert = () => {
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [roleList, setRoleList] = useState<RoleList[]>([]);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [employee, setEmployee] = useState<Employee>({
        id: 0,
        userName: '',
        name: '',
        email: '',
        mobileNumber: '',
        managerName: '',
        departmentID: 0,
        departmentName: '',
        officeLandline: '',
        password: '',
        extensionNumber: '',
        status: 0,
        createdBy: '',
        roleID: 0,
        roleName: '',
        updatedBy: ''
    });

    useEffect(() => {
        toast.dismiss();
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName && storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        } else {
            setEmpName('Unknown');
        }
    }, []);

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
            const response = await axiosInstance.get(`${config.API_URL}/EmployeeMaster/GetEmployeeMaster/${id}`, {
            });
            if (response.data.isSuccess) {
                const fetchedEmployee = response.data.employee_Masters[0];
                setEmployee(fetchedEmployee);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };


    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axiosInstance.get(`${config.API_URL}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };

        fetchData('CommonDropdown/GetDepartmentMasterList', setDepartmentList, 'activeDepartmentsDDL');
        fetchData('CommonDropdown/GetRoleMasterList', setRoleList, 'activeRolesDDL');
    }, []);



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, value, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setEmployee({
                    ...employee,
                    [eventName]: checked
                });
            } else if (type === 'radio') {
                const parsedValue = parseInt(value, 10);
                setEmployee({
                    ...employee,
                    [eventName]: parsedValue
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setEmployee({
                    ...employee,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setEmployee({
                ...employee,
                [name]: value
            });
        }
    };



    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!employee.userName) errors.userName = 'User Name is required';
        if (!employee.email) errors.email = 'Email is required';
        if (!employee.mobileNumber) errors.mobileNumber = 'Mobile Number is required';
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

        const payload = {
            ...employee,
            createdBy: editMode ? employee.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        try {

            let apiUrl = `${config.API_URL}/EmployeeMaster/CreateEmployeeMaster`;

            if (editMode && id) {
                apiUrl = `${config.API_URL}/EmployeeMaster/UpdateEmployeeMaster/${id}`;
            }

            const method = editMode && id ? 'PUT' : 'POST';

            const response = await axiosInstance({
                method,
                url: apiUrl,
                data: payload
            });

            if (response.status === 200) {
                navigate('/pages/EmployeeMaster', {
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
        <div>
            <div className=" bg-white  p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit Employee' : 'Add Employee'}</span>
                    </h4>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Full Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={employee.name}
                                        onChange={handleChange}
                                        placeholder='Enter Full Name'
                                        className={validationErrors.name ? "input-border" : ""}
                                    />
                                    {validationErrors.name && <small className="text-danger">{validationErrors.name}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="userName" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> User Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userName"
                                        value={employee.userName}
                                        onChange={handleChange}
                                        placeholder='Enter User Name'
                                        className={validationErrors.userName ? "input-border" : ""}
                                    />
                                    {validationErrors.userName && <small className="text-danger">{validationErrors.userName}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label><i className="ri-mail-line"></i> Email <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={employee.email}
                                        onChange={handleChange}
                                        placeholder='Enter Email'
                                        className={validationErrors.email ? "input-border" : ""}
                                    />
                                    {validationErrors.email && <small className="text-danger">{validationErrors.email}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="departmentName" className="mb-3">
                                    <Form.Label>Department Name  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="departmentName"
                                        value={departmentList.find((emp) => emp.departmentName === employee.departmentName)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                departmentName: selectedOption?.departmentName || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.departmentName}
                                        getOptionValue={(emp) => emp.departmentName}
                                        options={departmentList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        className={validationErrors.departmentName ? " input-border" : "  "}
                                    />
                                    {validationErrors.departmentName && (
                                        <small className="text-danger">{validationErrors.departmentName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="roleName" className="mb-3">
                                    <Form.Label>Role Name  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="roleName"
                                        value={roleList.find((emp) => emp.roleName === employee.roleName)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                roleName: selectedOption?.roleName || "",
                                                roleID: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.roleName}
                                        getOptionValue={(emp) => emp.roleName}
                                        options={roleList}
                                        isSearchable={true}
                                        placeholder="Select Role Name"
                                        className={validationErrors.roleName ? " input-border" : "  "}
                                    />
                                    {validationErrors.roleName && (
                                        <small className="text-danger">{validationErrors.roleName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="mobileNumber" className="mb-3">
                                    <Form.Label><i className="ri-phone-line"></i> Mobile Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mobileNumber"
                                        value={employee.mobileNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Mobile Number'
                                        className={validationErrors.mobileNumber ? "input-border" : ""}
                                    />
                                    {validationErrors.mobileNumber && <small className="text-danger">{validationErrors.mobileNumber}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="officeLandline" className="mb-3">
                                    <Form.Label><i className="ri-phone-line"></i> Office Landline <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="officeLandline"
                                        value={employee.officeLandline}
                                        onChange={handleChange}
                                        placeholder='Enter Office Landline'
                                        className={validationErrors.officeLandline ? "input-border" : ""}
                                    />
                                    {validationErrors.officeLandline && <small className="text-danger">{validationErrors.officeLandline}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="extensionNumber" className="mb-3">
                                    <Form.Label><i className="ri-phone-line"></i> Extension Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="extensionNumber"
                                        value={employee.extensionNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Office Landline'
                                        className={validationErrors.extensionNumber ? "input-border" : ""}
                                    />
                                    {validationErrors.extensionNumber && <small className="text-danger">{validationErrors.extensionNumber}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label><i className="ri-phone-line"></i> Password <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="password"
                                        value={employee.password}
                                        onChange={handleChange}
                                        placeholder='Enter Password'
                                        className={validationErrors.password ? "input-border" : ""}
                                    />
                                    {validationErrors.password && <small className="text-danger">{validationErrors.password}</small>}
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
                                            checked={employee.status === 1}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value={0}
                                            label="Inactive"
                                            checked={employee.status === 0}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/EmployeeMaster'}>
                                        <Button variant="primary">
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Employee' : 'Add Employee'}
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

export default EmployeeMasterInsert;
