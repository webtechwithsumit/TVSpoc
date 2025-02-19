import { useState, useEffect } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import DateFormatter from '../../Component/DateComponent';

interface Manager {
    id: number;
    managerName: string;
    departmentID: number;
    status: number;
    createdBy: string;
    updatedBy: string;
    productName: string;
    departmentName: string;
    endDate: string;
    createdDate: string;
    downloadDocuments: DocumentItem[];
    getProductChecklistByProductNames: ProductChecklist[];
    productType?: string;
    defaultAssignee?: string;
    authorizedSignatory?: string;
    originator?: string;
    productDescription?: string;
    ref_Number?: string;
    finalSignoff?: number;
    isLaunched?: number;
    daysLapsed?: number;
}


interface DocumentItem {
    files: string;
    fileUrls: string[];
}

interface ProductChecklist {
    name: string;
    status: number;
}

const EmployeeMaster = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Manager | null>(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss();
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        fetchEmployee();
    }, []);

    const downloadFiles = async (file: string, name: string) => {
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${config.API_URL}/UploadDocument/DownloadFile`,
                params: { filename: file },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };
    console.log(employee)

    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetProductforDoucment`, {
                params: { ID: id }
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.getProducts[0]);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 mt-3 bg-white'>
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0 p-1'>
                        <i className="ri-file-list-line me-2 text-primary "></i> Review Document
                    </h4>
                </div>
            </Row>

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                employee && (
                    <div className='p-2'>
                        <Row className="mb-4 px-3">
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Product:</span>
                                <span className="text-dark ms-1">{employee.productName}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Product Type:</span>
                                <span className="text-dark ms-1">{employee.productType}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Product Department:</span>
                                <span className="text-dark ms-1">{employee.departmentName}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Start Date:</span>
                                <span className="text-dark ms-1"><DateFormatter dateString={employee.createdDate} /></span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Default Assignee:</span>
                                <span className="text-dark ms-1">{employee.defaultAssignee}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Authorized Signatory:</span>
                                <span className="text-dark ms-1">{employee.authorizedSignatory}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Originator:</span>
                                <span className="text-dark ms-1">{employee.originator}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Product Description:</span>
                                <span className="text-dark ms-1">{employee.productDescription}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Reference Number:</span>
                                <span className="text-dark ms-1">{employee.ref_Number}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Signed Off Department:</span>
                                <span className="text-dark ms-1">{employee.finalSignoff === 1 ? employee.departmentName : "-"}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Is Launched:</span>
                                <span className="text-dark ms-1">{employee.isLaunched === 1 ? "Yes" : "No"}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">Days Lapsed:</span>
                                <span className="text-dark ms-1">{employee.daysLapsed}</span>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <span className="text-primary fs-16 fw-bold">End Date:</span>
                                <span className="text-dark ms-1">{employee.endDate}</span>
                            </Col>
                        </Row>


                        <Row>
                            <Col lg={6}>
                                <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                    <h4 className='text-primary d-flex align-items-center m-0 py-1'>
                                        <i className="ri-file-list-line me-2 text-primary "></i> CheckLists
                                    </h4>
                                </div>
                                <Table hover className="bg-white custom-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th className='w-100px text-center'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employee.getProductChecklistByProductNames.map((list) => (
                                            <tr key={list.name}>
                                                <td>{list.name}</td>
                                                <td className='text-center'>
                                                    <input type="checkbox" checked={list.status === 1} readOnly />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col lg={6}>
                                <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                    <h4 className='text-primary d-flex align-items-center m-0 py-1'>
                                        <i className="ri-file-list-line me-2 text-primary "></i> Documents
                                    </h4>
                                </div>
                                <Table hover className="bg-white custom-table">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th className='text-center'>Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employee.downloadDocuments.map((doc, index) => (
                                            <tr key={index}>
                                                <td> {doc.files.split('\\').pop()}</td>
                                                <td className="text-center p-0">
                                                    {doc.fileUrls.map((fileUrl, i) => (
                                                        <Button key={i} className='p-0' variant="link" onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop()!)}>
                                                            <i className="fs-20 ri-arrow-down-circle-line"></i>
                                                        </Button>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </div>
                )
            )}
        </div>
    );
};

export default EmployeeMaster;

