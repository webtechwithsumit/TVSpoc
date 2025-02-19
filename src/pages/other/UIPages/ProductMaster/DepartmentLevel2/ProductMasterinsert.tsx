import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import config from '@/config';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axiosInstance from '@/utils/axiosInstance';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '@/common';

interface Product {
    id: number;
    productType: string;
    productName: string;
    productDescription: string;
    originator: string;
    authorizedSignatory: string;
    defaultAssignee: string;
    defaultAssigneeID: string;
    mobileNumber: string;
    isApproved: number;
    startDate: string;
    endDate: string;
    daysLapsed: number;
    signedOffByDepartment: string;
    queries: string;
    departmentName: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string | null;
    getProductChecklistByProductNames: ProductChecklist[];
    downloadDocuments: Document[];
    getDiscussionForms: any[];
}
interface ProductType {
    name: string;
    id: number;
}
interface CheckList {
    id: number;
    name: string;
    status: number | null;
    is_mandatory: boolean;
}
interface EmployeeList {
    empId: string;
    userName: string;
    employeeName: string;
    defaultAuthorisedSignatory: string;
    defaultAuthorisedSignatoryID: string;
}
interface ProductChecklist {
    id: number;
    name: string;
    is_mandatory: boolean
    status: number;
}

interface Document {
    id: number;
    productID: number;
    productName: string;
    files: string;
    fileUrls: string[];
    createdBy: string;
    type: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string | null;
}
const ProductMasterInsert = () => {
    const { user } = useAuthContext();
    const { id } = useParams<{ id: string }>();
    const [productTypeList, setProductTypeList] = useState<ProductType[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const storedEmpName = user?.employeeName;
    const storedDepartmentName = user?.departmentName;
    const storedMobileNumber = user?.mobileNumber;
    const storedDepartmentID = user?.departmentID;

    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [checkLists, setCheckLists] = useState<CheckList[]>([]);
    const [deparmentHead, setDepartmentHead] = useState<EmployeeList[]>([]);
    const [types, setTypes] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);

    const departmentHeadAuthorised = deparmentHead.length > 0 ? deparmentHead[0].defaultAuthorisedSignatory : '';
    const departmentHeadAuthorisedID = deparmentHead.length > 0 ? deparmentHead[0].defaultAuthorisedSignatoryID : '';

    const [product, setProduct] = useState<Product>({
        id: 0,
        productType: "",
        productName: "",
        productDescription: "",
        originator: '',
        authorizedSignatory: "",
        defaultAssignee: "",
        defaultAssigneeID: "",
        mobileNumber: '',
        isApproved: 0,
        startDate: "",
        endDate: "",
        daysLapsed: 0,
        signedOffByDepartment: "",
        queries: "",
        departmentName: "",
        createdBy: "",
        createdDate: "",
        updatedBy: "",
        updatedDate: null,
        getProductChecklistByProductNames: [
            { id: 0, name: "", status: 0, is_mandatory: false },
        ],
        downloadDocuments: [
            {
                id: 0,
                productID: 0,
                productName: "",
                files: "",
                fileUrls: [""],
                createdBy: "",
                type: "",
                createdDate: "",
                updatedBy: "",
                updatedDate: null,
            },
        ],
        getDiscussionForms: [],
    });
    const [documentsProducts, setDocumentsProducts] = useState<Document[]>([
        {
            id: 0,
            productID: 0,
            productName: "",
            files: "",
            fileUrls: [""],
            createdBy: "",
            type: "",
            createdDate: "",
            updatedBy: "",
            updatedDate: null
        }
    ]);

    useEffect(() => {
        if (!product.originator) {
            setProduct((prev) => ({
                ...prev,
                originator: storedEmpName ?? '',
                mobileNumber: storedMobileNumber ?? '',
            }));
        }
    }, [product.originator]);


    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchPorudctDetails(id);
        } else {
            setEditMode(false);
        }
    }, [id]);


    const fetchPorudctDetails = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetProductforDoucment`, {
                params: { ID: id },
            });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.getProducts[0];
                setProduct(fetchedDepartment);
                setDocumentsProducts(fetchedDepartment.downloadDocuments)
                setCheckLists(fetchedDepartment.getProductChecklistByProductNames)
            } else {
                toast.error(response.data.message || 'Failed to fetch department data');
            }
        } catch (error) {
            toast.error('Error fetching department data');
            console.error('Error fetching department:', error);
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

        fetchData('CommonDropdown/GetProductTypeList?Flag=2', setProductTypeList, 'productTypeList');
        fetchData(`CommonDropdown/EmployeeList?Flag=3&DepartmentName=${storedDepartmentName}`, setEmployeeList, 'employees');
        fetchData(`CommonDropdown/GetManagerByDepartmentList?DepartmentId=${storedDepartmentID}`, setDepartmentHead, `getManagerByDepartments`);
    }, []);

    console.log(product)

    useEffect(() => {
        const fetchPCheckList = async () => {
            try {
                const response = await axiosInstance.get(`${config.API_URL}/CommonDropdown/GetChecklistByProductType`, {
                    params: {
                        ProductType: product.productType
                    }
                });
                if (response.data.isSuccess) {
                    // setCheckLists(response.data.productTypeList);
                    console.log(response.data.productTypeList)
                    setCheckLists(
                        response.data.productTypeList.map((checkList: CheckList) => ({
                            ...checkList,
                            is_mandatory: checkList.is_mandatory,
                            status: checkList.is_mandatory ? 1 : null,
                        }))
                    );
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };
        if (!editMode && product.productType) {
            fetchPCheckList()
        }

    }, [product.productType])



    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
        setProduct({
            ...product,
            [name]: parsedValue
        });
    };

    const handleCheckbox = (id: number, selectedStatus: number, isMandatory: boolean) => {
        if (isMandatory) return;

        setCheckLists((prevCheckLists) =>
            prevCheckLists.map((checkList) =>
                checkList.id === id
                    ? { ...checkList, status: selectedStatus }
                    : checkList
            )
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            const files = Array.from(input.files);
            setSelectedFiles(files);

            files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setFilePreviews(prev => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                } else {
                    setFilePreviews(prev => [...prev, '']);
                }
            });
        }
    };

    const downloadFile = (file: File, preview: string) => {
        const a = document.createElement('a');
        a.href = preview || URL.createObjectURL(file); // Use base64 preview or Blob URL
        a.download = file.name;
        a.click();
    };


    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!product.productType) errors.productType = 'Product Type is required';
        if (!product.productName) errors.productName = 'Product Name is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss();
        console.log('hi')

        const unselectedChecklists = checkLists.filter((checkList) => checkList.status === null);
        if (unselectedChecklists.length > 0) {
            toast.error('Please select "Yes" or "No" for all checklist items.');
            return;
        }

        const updatedChecklists = checkLists.map((checkList) => ({
            id: editMode ? checkList.id : 0,
            name: checkList.name,
            productType: product.productType,
            productName: product.productName,
            is_mandatory: checkList.is_mandatory,
            status: checkList.status,
            createdBy: 'your-created-by-user',
            updatedBy: 'your-updated-by-user',
        }));

        console.log(updatedChecklists);

        if (!validateFields()) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const payload = {
                Type: types,
                id: product.id,
                ProductName: product.productName,
                ProductType: product.productType,
                ProductDescription: product.productDescription,
                Originator: product.originator,
                OriginatorID: product.originator,
                DefaultAssignee: product.defaultAssignee,
                DefaultAssigneeID: product.defaultAssigneeID,
                AuthorizedSignatory: departmentHeadAuthorised,
                AuthorizedSignatoryID: departmentHeadAuthorisedID,
                MobileNumber: product.mobileNumber,
                DepartmentName: storedDepartmentName ?? '',
                CreatedBy: product.createdBy,
                UpdatedBy: product.updatedBy,
                Files: selectedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                })),
            };

            console.log(payload)

            const formData = new FormData();
            formData.append('ID', payload.id.toString());
            formData.append('Type', payload.Type);
            formData.append('ProductName', payload.ProductName);
            formData.append('ProductType', payload.ProductType);
            formData.append('ProductDescription', payload.ProductDescription);
            formData.append('Originator', payload.Originator);
            formData.append('OriginatorID', payload.OriginatorID);
            formData.append('DefaultAssigneeID', payload.DefaultAssigneeID);
            formData.append('DefaultAssignee', payload.DefaultAssignee);
            formData.append('AuthorizedSignatoryID', payload.AuthorizedSignatoryID);
            formData.append('AuthorizedSignatory', payload.AuthorizedSignatory);
            formData.append('MobileNumber', payload.MobileNumber);
            formData.append('DepartmentName', payload.DepartmentName);
            formData.append('CreatedBy', payload.CreatedBy);
            formData.append('UpdatedBy', payload.UpdatedBy);

            selectedFiles.forEach(file => {
                formData.append('files', file, file.name);
            });

            const fileUploadResponse = await axiosInstance.post(`${config.API_URL}/Product/InsertUpdateProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (fileUploadResponse.status === 200) {

                const checklistResponse = await axiosInstance.post(
                    `${config.API_URL}/Product/ProductCheckList/ProductCheckList`,
                    updatedChecklists,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (checklistResponse.status === 200) {
                    toast.success('Record Added successfully!');
                } else {
                    toast.error('Error submitting checklists');
                }

            } else {
                alert('Error uploading files');
            }

        } catch (error: any) {
            toast.error(error);
            console.error('Error submitting product:', error);
        }
    };


    const optionsFileType = [
        { value: 'Product Note', label: 'Product Note' },
        { value: 'Internal Financial Control IFC', label: 'Internal Financial Control IFC' },
        { value: 'Final Signed Note', label: 'Final Signed Note' }
    ];


    const downloadFiles = async (file: string, name: any) => {
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

    const getFileName = (filePath: string) => {
        return filePath.split(/(\\|\/)/g).pop();  // Handles both Windows and Unix file paths
    };

    return (
        <>

            <div className="mt-3">
                <Row>
                    <Col sm={12} >
                        <Card className="p-0">
                            <Card.Body >
                                <div className=' p-2 mb-2 '>
                                    <Row >
                                        <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                            <h4 className='text-primary d-flex align-items-center m-0 py-1'><i className="ri-file-list-line me-2 text-primary "></i> Add  Product </h4>
                                        </div>
                                    </Row>
                                </div>

                                <div className='bg-white px-2 rounded-3 border'>
                                    <Form onSubmit={handleSubmit} className='mt-4'>
                                        <Row>
                                            <Col lg={6}>
                                                <Form.Group controlId="productType" className="mb-3">
                                                    <Form.Label><i className="ri-stack-line"></i> Product Type <span className='text-danger'>*</span></Form.Label>
                                                    <Select
                                                        name="productType"
                                                        value={productTypeList.find((emp) => emp.name === product.productType)}
                                                        onChange={(selectedOption) => {
                                                            setProduct({
                                                                ...product,
                                                                productType: selectedOption?.name || '',
                                                            });
                                                        }}
                                                        getOptionLabel={(emp) => emp.name}
                                                        getOptionValue={(emp) => emp.name}
                                                        options={productTypeList}
                                                        isSearchable={true}
                                                        placeholder="Select Task Name"
                                                        className={validationErrors.productType ? "input-border" : ""}
                                                    />
                                                    {validationErrors.productType && <small className="text-danger">{validationErrors.productType}</small>}
                                                </Form.Group>
                                            </Col>

                                            <Col lg={6}>
                                                <Form.Group controlId="productName" className="mb-3">
                                                    <Form.Label><i className="ri-price-tag-line"></i> Product Name <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="productName"
                                                        value={product.productName}
                                                        onChange={handleChange}
                                                        placeholder="Enter Product Name"
                                                        className={validationErrors.productName ? "input-border" : ""}
                                                    />
                                                    {validationErrors.productName && <small className="text-danger">{validationErrors.productName}</small>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6}>
                                                <Form.Group controlId="originator" className="mb-3">
                                                    <Form.Label><i className="ri-user-line"></i> Originator <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="originator"
                                                        value={product.originator}
                                                        onChange={handleChange}
                                                        placeholder=" Originator Name"
                                                        className={validationErrors.originator ? "input-border" : ""}
                                                        readOnly
                                                    />
                                                    {validationErrors.originator && <small className="text-danger">{validationErrors.originator}</small>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6}>
                                                <Form.Group controlId="mobileNumber" className="mb-3">
                                                    <Form.Label><i className="ri-phone-line"></i> Mobile Number <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="mobileNumber"
                                                        value={product.mobileNumber}
                                                        onChange={handleChange}
                                                        placeholder="Originator Mobile Number"
                                                        className={validationErrors.mobileNumber ? "input-border" : ""}
                                                        readOnly
                                                    />
                                                    {validationErrors.mobileNumber && <small className="text-danger">{validationErrors.mobileNumber}</small>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6}>
                                                <Form.Group controlId="authorizedSignatory" className="mb-3">
                                                    <Form.Label><i className="ri-user-star-line"></i> Authorized Signatory</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="authorizedSignatory"
                                                        value={departmentHeadAuthorised}
                                                        onChange={() => { }}
                                                        readOnly
                                                    />

                                                </Form.Group>
                                            </Col>

                                            <Col lg={6}>
                                                <Form.Group controlId="assignee" className="mb-3">
                                                    <Form.Label><i className="ri-user-add-line"></i> Assignee</Form.Label>
                                                    <Select
                                                        name="productType"
                                                        value={employeeList.find((emp) => emp.userName === product.defaultAssigneeID)}
                                                        onChange={(selectedOption) => {
                                                            setProduct({
                                                                ...product, defaultAssignee: selectedOption?.employeeName || '',
                                                                defaultAssigneeID: selectedOption?.userName || '',
                                                            });
                                                        }}
                                                        getOptionLabel={(emp) => emp.employeeName}
                                                        getOptionValue={(emp) => emp.userName}
                                                        options={employeeList}
                                                        isSearchable={true}
                                                        placeholder="Select Assignee"
                                                        className={validationErrors.assignee ? "input-border" : ""}
                                                    />
                                                    {validationErrors.assignee && <small className="text-danger">{validationErrors.assignee}</small>}
                                                </Form.Group>
                                            </Col>

                                            <Col lg={12} className='mb-3'>
                                                <Form.Group controlId="productDescription" className="mb-3">
                                                    <Form.Label><i className="ri-file-list-line"></i> Product Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="productDescription"
                                                        value={product.productDescription}
                                                        onChange={handleChange}
                                                        placeholder="Enter Product Description (Max 300 Characters)"
                                                        rows={3}
                                                        maxLength={300}
                                                    />
                                                </Form.Group>
                                            </Col>

                                        </Row>

                                        <Row>
                                            <Col lg={12}>
                                                <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                                    <h4 className='text-primary d-flex align-items-center m-0 py-1'><i className="ri-file-list-line me-2 text-primary "></i>  Document </h4>
                                                </div>
                                                <Row>
                                                    <Col lg={8} className='mt-3'>
                                                        <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                                            <h4 className='text-primary d-flex align-items-center m-0 py-1'><i className="ri-file-list-line me-2 text-primary "></i> Upload Document </h4>
                                                        </div>
                                                        <Row className='mt-2'>

                                                            <Col lg={7}>
                                                                <Form.Group controlId="type" className="my-3">
                                                                    <Select
                                                                        name="type"
                                                                        options={optionsFileType}
                                                                        onChange={selectedOption => setTypes(selectedOption?.value || '')}
                                                                        placeholder="Select Document Type"
                                                                        className={validationErrors.type ? " input-border" : " "}
                                                                    />
                                                                    {validationErrors.type && <small className="text-danger">{validationErrors.type}</small>}
                                                                </Form.Group>
                                                            </Col>

                                                            <Col lg={5}>
                                                                <Form.Group controlId="fileUpload" className="mt-3 mb-1 position-relative">
                                                                    <Form.Control
                                                                        type="file"
                                                                        name="fileUpload"
                                                                        multiple
                                                                        onChange={handleFileChange}
                                                                        placeholder="Enter File URL or Path"
                                                                        disabled={!types} // Disable if no document type is selected
                                                                        style={{ paddingRight: "50px" }}
                                                                    />
                                                                    <Button
                                                                        variant="link"
                                                                        className="position-absolute top-50 end-0 translate-middle-y me-2"
                                                                        onClick={() => document.getElementById('fileUpload')?.click()}
                                                                        disabled={!types}
                                                                    >
                                                                        <i className="ri-add-file"></i>
                                                                    </Button>
                                                                </Form.Group>

                                                                {selectedFiles.length > 0 && (
                                                                    <div className="mt-1">
                                                                        <ul className="list-unstyled">
                                                                            {selectedFiles.map((file, index) => (
                                                                                <li key={index} className="position-relative mb-1">
                                                                                    {file.type.startsWith('image/') ? (
                                                                                        <div className='d-flex align-items-center justify-content-between cursor-pointer'
                                                                                            onClick={() => downloadFile(file, filePreviews[index])}
                                                                                        >
                                                                                            <span>{file.name}</span>
                                                                                            <span><i className="ri-eye-line text-white bg-dark rounded-circle p-1" ></i></span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className='d-flex align-items-center justify-content-between cursor-pointer'
                                                                                            onClick={() => downloadFile(file, '')}>
                                                                                            <span>{file.name}</span>
                                                                                            <span>
                                                                                                <i className='ri-eye-line text-dark bg-light rounded-circle p-1' ></i>
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col lg={4} className='mt-3'>
                                                        <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                                            <h4 className='text-primary d-flex align-items-center m-0 py-1'>
                                                                <i className="ri-file-list-line me-2 text-primary "></i> Manage Existing Document
                                                            </h4>
                                                        </div>
                                                        <div className='my-3'>
                                                            <h5>Product Note</h5>
                                                            {documentsProducts.filter(doc => doc.type === "Product Note").map((doc) => (
                                                                <div key={doc.id}>
                                                                    {doc.fileUrls.map((fileUrl, index) => (
                                                                        <div key={index}>
                                                                            <Button className='p-0'
                                                                                variant="link"
                                                                                onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop())}
                                                                            >
                                                                                <i className="ri-download-2-fill me-2"></i>
                                                                                {getFileName(doc.files)}
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                            <hr />

                                                            <h5>Internal Financial Control IFC</h5>
                                                            {documentsProducts.filter(doc => doc.type === "Internal Financial Control IFC").map((doc) => (
                                                                <div key={doc.id}>
                                                                    {doc.fileUrls.map((fileUrl, index) => (
                                                                        <div key={index}>
                                                                            <Button className='p-0'
                                                                                variant="link"
                                                                                onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop())}
                                                                            >
                                                                                <i className="ri-download-2-fill me-2"></i>
                                                                                {getFileName(doc.files)}
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                            <hr />
                                                            <h5>Final Signed Note</h5>
                                                            {documentsProducts.filter(doc => doc.type === "Final Signed Note").map((doc) => (
                                                                <div key={doc.id}>
                                                                    {doc.fileUrls.map((fileUrl, index) => (
                                                                        <div key={index}>
                                                                            <Button className='p-0'
                                                                                variant="link"
                                                                                onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop())}
                                                                            >
                                                                                <i className="ri-download-2-fill me-2"></i>
                                                                                {getFileName(doc.files)}
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Col>


                                                </Row>
                                            </Col>

                                        </Row>
                                        <Row>
                                            {checkLists.length > 0 && product.productName.length > 0 &&
                                                <Col lg={12}>
                                                    <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                                        <h4 className='text-primary d-flex align-items-center m-0 py-1'>
                                                            <i className="ri-file-list-line me-2 text-primary"></i> CheckList
                                                        </h4>
                                                    </div>
                                                    {product.productName.length > 0 && (
                                                        <Table hover className="bg-white custom-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>CheckList Name</th>
                                                                    <th>Yes</th>
                                                                    <th>No</th>
                                                                </tr>
                                                            </thead>
                                                            {/* <tbody>
                                                                {checkLists.map((checkList) => (
                                                                    <tr key={`${checkList.id}-${checkList.name}`}>
                                                                        <td>
                                                                            {checkList.name}  {checkList.is_mandatory && <span className="text-danger">*</span>}
                                                                        </td>
                                                                        <td>
                                                                            <Form.Check
                                                                                inline
                                                                                type="checkbox"
                                                                                id={`statusActive-${checkList.id}`}
                                                                                name="status"
                                                                                value="1"
                                                                                checked={checkList.status === 1 || checkList.is_mandatory}
                                                                                onChange={() => handleCheckbox(checkList.id, 1, checkList.is_mandatory)}
                                                                                disabled={checkList.is_mandatory}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Form.Check
                                                                                inline
                                                                                type="checkbox"
                                                                                id={`statusInactive-${checkList.id}`}
                                                                                name="status"
                                                                                value="0"
                                                                                checked={checkList.status === 0 && !checkList.is_mandatory}
                                                                                onChange={() => handleCheckbox(checkList.id, 0, checkList.is_mandatory)}
                                                                                disabled={checkList.is_mandatory}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody> */}
                                                            <tbody>
                                                                {checkLists.map((checkList) => (
                                                                    <tr key={checkList.id}>
                                                                        <td>
                                                                            {checkList.name}  {checkList.is_mandatory && <span className="text-danger fs-15">*</span>}
                                                                        </td>
                                                                        <td>
                                                                            <Form.Check
                                                                                inline
                                                                                type="checkbox" // ✅ Use radio to ensure only one is selected
                                                                                id={`statusActive-${checkList.id}`}
                                                                                name={`status-${checkList.id}`} // ✅ Unique name per checklist item
                                                                                value="1"
                                                                                checked={checkList.status === 1}
                                                                                disabled={checkList.is_mandatory}
                                                                                onChange={() => handleCheckbox(checkList.id, 1, checkList.is_mandatory)}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Form.Check
                                                                                inline
                                                                                type="checkbox" // ✅ Use radio
                                                                                id={`statusInactive-${checkList.id}`}
                                                                                name={`status-${checkList.id}`} // ✅ Unique name
                                                                                value="0"
                                                                                checked={checkList.status === 0}
                                                                                onChange={() => handleCheckbox(checkList.id, 0, checkList.is_mandatory)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>


                                                        </Table>
                                                    )}
                                                </Col>
                                            }
                                            <Col className="align-items-end d-flex justify-content-end mt-2 mb-3">
                                                <div>
                                                    <Button variant="primary" type="submit">
                                                        Add Product
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form >
                                </div >

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div >



        </>
    );
};

export default ProductMasterInsert;
