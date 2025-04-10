import { useState, useEffect } from 'react'
import { Button, Row, Col, Container, Alert, Table, Collapse } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PaginationComponent from '../../Component/PaginationComponent'
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance'
import config from '@/config'

interface FileUpload {
    id: number;
    modelNumber: string;
    url: string;
    ticketStatus: number;
    createdBy: string;
    createdDate: string;
    updatedBy: string | null;
    updatedDate: string | null;
}

interface TicketDetails {
    ticketID: number;
    callNo: string;
    initiator: string;
    productName: string;
    brandName: string | null;
    modelNumber: string;
    ticketType: string;
    ticketStatus: string;
    registrationDate: string;
    responseTime: string;
    customerAcknowledgment: string;
    engineerFollowUp: string;
    issueDescription: string;
    createdBy: string;
    lastUpdated: string;
    assignDate: string | null;
    assignEngineerName: string | null;
    fileUploads: FileUpload[];
}

function AssignedTicket() {
    const [ticketDetails, setTicketDetails] = useState<TicketDetails[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss();
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate])

    const [columns, setColumns] = useState([
        { id: 'initiator', label: 'Initiator', visible: true },
        { id: 'callNo', label: 'Mobile Number', visible: true },
        { id: 'productName', label: 'Product Name', visible: true },
        { id: 'brandName', label: 'Brand Name', visible: true },
        { id: 'modelNumber', label: 'Model Number', visible: true },
        { id: 'ticketType', label: 'Ticket Type', visible: true },
        { id: 'ticketStatus', label: 'Ticket Status', visible: true },
        { id: 'issueDescription', label: 'Issue Description', visible: true },
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };

    useEffect(() => {
        fetchTickets();
    }, [currentPage]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/TicketMaster/GetAssignTicketList`);
            if (response.data.isSuccess) {
                setTicketDetails(response.data.ticketMasters);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const toggleExpandRow = (ticketID: number) => {
        setExpandedRow(expandedRow === ticketID ? null : ticketID);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString();
    };


    const downloadFiles = async (file: string, name: any) => {
        console.log(file)
        console.log(name)
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${config.API_URL}/FileUpload/DownloadFile`,
                params: { fileName: file },
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
    const getFileName = (filePath: string) => {
        return filePath.split(/(\\|\/)/g).pop();
    };


    return (
        <div className="p-3 mt-3 bg-white">
            <Row className="mb-2 px-2">
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className="text-primary d-flex align-items-center m-0">
                        <i className="ri-file-list-line me-2 text-primary"></i> Assigned Ticket
                    </h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary" className="me-2">
                            Download CSV
                        </Button>
                        <Link to="/pages/TicketMasterinsert">
                            <Button variant="primary">
                                Raise Ticket
                            </Button>
                        </Link>
                    </div>
                </div>
            </Row>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="mt-2">Please Wait!</div>
                </div>
            ) : (
                <div className="overflow-auto text-nowrap">
                    {ticketDetails.length === 0 ? (
                        <Container className="mt-5">
                            <Row className="justify-content-center">
                                <Col xs={12} md={8} lg={6}>
                                    <Alert variant="info" className="text-center">
                                        <h4>No Data Found</h4>
                                        <p>You currently don't have any Data</p>
                                    </Alert>
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Table hover className="bg-white custom-table">
                                <thead>
                                    <Droppable droppableId="columns" direction="horizontal">
                                        {(provided) => (
                                            <tr {...provided.droppableProps} ref={provided.innerRef}>
                                                <th>Sr. No</th>
                                                {columns.filter((col) => col.visible).map((column, index) => (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                {column.label}
                                                            </th>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                <th>Action</th>
                                            </tr>
                                        )}
                                    </Droppable>
                                </thead>
                                <tbody>
                                    {ticketDetails.map((item, index) => (
                                        <>
                                            <tr key={item.ticketID}>
                                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                {columns.filter(col => col.visible).map((col) => (
                                                    <td key={col.id}>
                                                        <div>
                                                            {item[col.id as keyof TicketDetails] !== null && item[col.id as keyof TicketDetails] !== undefined
                                                                ? (Array.isArray(item[col.id as keyof TicketDetails])
                                                                    ? (item[col.id as keyof TicketDetails] as any[]).map((file, i) => (
                                                                        <div key={i}>
                                                                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                                {file.url.split('\\').pop()}
                                                                            </a>
                                                                        </div>
                                                                    ))
                                                                    : (col.id === 'registrationDate' || col.id === 'responseTime' || col.id === 'lastUpdated'
                                                                        ? formatDate(item[col.id as keyof TicketDetails] as string)
                                                                        : item[col.id as keyof TicketDetails] as React.ReactNode
                                                                    ))

                                                                : null
                                                            }
                                                        </div>
                                                    </td>
                                                ))}
                                                <td className='text-center'>
                                                    <Button onClick={() => toggleExpandRow(item.ticketID)} >
                                                        {expandedRow === item.ticketID ? <i className=" fs-18 ri-arrow-up-s-line"></i> : <i className=" fs-18 ri-arrow-down-s-line"></i>}
                                                    </Button>
                                                </td>
                                            </tr>
                                            {expandedRow === item.ticketID && (
                                                <tr>
                                                    <td colSpan={11}>
                                                        <Collapse in={expandedRow === item.ticketID}>
                                                            <div className="p-4">
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <div className="card p-3 mb-4 shadow-sm">
                                                                            <h4 className="card-title">Ticket Details</h4>
                                                                            <p><strong>Customer Acknowledgment:</strong> {item.customerAcknowledgment || '-'}</p>
                                                                            <p><strong>Engineer Follow Up:</strong> {item.engineerFollowUp || '-'}</p>
                                                                            <p><strong>Created By:</strong> {item.createdBy || '-'}</p>
                                                                            <p><strong>Last Updated:</strong> {formatDate(item.lastUpdated)}</p>
                                                                        </div>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <div className="card p-3 mb-4 shadow-sm">
                                                                            <h4 className="card-title">Assignment Details</h4>
                                                                            <p><strong>Assigned Engineer:</strong> {item.assignEngineerName}</p>
                                                                            <p><strong>Assign Date:</strong> {item.assignDate ? formatDate(item.assignDate) : '-'}</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-4">
                                                                    <Col md={12}>
                                                                        <div className="card p-3 mb-4 shadow-sm">
                                                                            <h4 className="card-title">Attachments</h4>
                                                                            {item.fileUploads && item.fileUploads.length > 0 ? (
                                                                                <div>
                                                                                    {item.fileUploads.map(file => (
                                                                                        <div key={file.id}>
                                                                                            <Button className='p-0'
                                                                                                variant="link"
                                                                                                onClick={() => downloadFiles(file.url, file.url.split('\\').pop())}
                                                                                            >
                                                                                                <i className="ri-download-2-fill me-2"></i>
                                                                                                {getFileName(file.url)}
                                                                                            </Button>
                                                                                            <span>(Uploaded by {file.createdBy} on {formatDate(file.createdDate)})</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <p>No attachments available</p>
                                                                            )}
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Collapse>
                                                    </td>
                                                </tr >
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </Table>
                        </DragDropContext>
                    )}
                </div>
            )
            }

            <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </div >
    )
}

export default AssignedTicket