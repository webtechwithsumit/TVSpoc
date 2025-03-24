import  { useState, useEffect } from 'react'
import { Button, Row, Col, Container, Alert, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PaginationComponent from '../../Component/PaginationComponent'
import { toast } from 'react-toastify';  // Add this import if toast is being used

interface CourierDetails {
  id: string;
  courierName: string;
  trackingID: string;
  proofOfDelivery: string;
  receivingPartyName: string;
  receivingPartyContact: string;
  receivingPartyAddress: string;
  deliveryStatus: string;
  estimatedDeliveryDate: string;
  remarks: string;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

function TicketMaster() {
  const [courierDetails, setCourierDetails] = useState<CourierDetails[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.dismiss();
      toast.success(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate])

  // Column configuration for drag-and-drop table columns
  const [columns, setColumns] = useState<Column[]>([
    { id: 'courierName', label: 'Courier Name', visible: true },
    { id: 'trackingID', label: 'Tracking ID', visible: true },
    { id: 'proofOfDelivery', label: 'Proof of Delivery', visible: true },
    { id: 'receivingPartyName', label: 'Receiving Party Name', visible: true },
    { id: 'receivingPartyContact', label: 'Receiving Party Contact', visible: true },
    { id: 'receivingPartyAddress', label: 'Receiving Party Address', visible: true },
    { id: 'deliveryStatus', label: 'Delivery Status', visible: true },
    { id: 'estimatedDeliveryDate', label: 'Estimated Delivery Date', visible: true },
    { id: 'remarks', label: 'Remarks', visible: true },
  ])

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);
    setColumns(reorderedColumns);
  };

  // Example API call to fetch courier details (you should replace it with your real API call)
  useEffect(() => {
    setLoading(true);
    // Example of data fetching
    fetchCourierDetails();
  }, [currentPage]);

  const fetchCourierDetails = async () => {
    try {
      // Replace with your API call logic
      const response = await fetch(`/api/courierDetails?page=${currentPage}`);
      const data = await response.json();
      setCourierDetails(data.items);
      setTotalPages(data.totalPages); // Assume the response contains totalPages
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  }

  return (
    <div className="p-3 mt-3 bg-white">
      <Row className="mb-2 px-2">
        <div className="d-flex justify-content-between profilebar p-1">
          <h4 className="text-primary d-flex align-items-center m-0">
            <i className="ri-file-list-line me-2 text-primary"></i> Ticket Master
          </h4>
          <div className="d-flex justify-content-end bg-light w-50 profilebar">
            <Button variant="primary" className="me-2">
              Download CSV
            </Button>
            <Link to="/pages/TicketMasterinsert">
              <Button variant="primary">
                Add Ticket Master
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
          {courierDetails.length === 0 ? (
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
                  {courierDetails.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(currentPage - 1) * 10 + index + 1}</td>
                      {columns.filter((col) => col.visible).map((col) => (
                        <td key={col.id}>
                          {col.id === 'deliveryStatus' ? (
                            <div>{item.deliveryStatus}</div>
                          ) : (
                            <div>{item[col.id as keyof CourierDetails]}</div>
                          )}
                        </td>
                      ))}
                      <td>
                        <Link to={`/pages/CourierMasterInsert/${item.id}`}>
                          <Button variant="primary" className="icon-padding text-white">
                            <i className="fs-18 ri-edit-line text-white"></i>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </DragDropContext>
          )}
        </div>
      )}

      <PaginationComponent
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  )
}

export default TicketMaster
