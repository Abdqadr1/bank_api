import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useContext, useEffect, useRef, useState } from 'react';
import { BankContext } from '../context/context'
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Nav } from 'react-bootstrap';

export const EditModal = (props) => {
    const { editBank, banks } = useContext(BankContext);
    const [form, setForm] = useState({
        fullName: '',
        shortName: '',
        sortCode: '',
        type: ''
    });
    const [canClose, setClose] = useState(true);
    const buttonRef = useRef(null);
    const msgRef = useRef(null);

    const handleChange = (event) => {
        form[event.target.id] = event.target.value;
        setForm(form)
    }

    useEffect(() => {
        const bank = banks[banks.findIndex(bk => bk.id === props.edit.id)]
        if (bank) {
            setForm(bank);
        }
        msgRef.current?.focus();
    }, [banks, form, props.edit.id])

    const handleClose = () => {
        if (canClose) {
            props.hideModal('edit')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setClose(false);
        editBank(props.edit.id, form, buttonRef.current)
        setClose(true)
    }

    return (
        <BankContext.Consumer>
            {({banks}) => {
                const bank = banks[banks.findIndex(bk => bk.id === props.edit.id)] || form;
                const prop = props.edit;
                const className = (prop.message) ? "text-center" : 'd-none';
                return (
                <Modal show={prop.bool} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Bank</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert ref={msgRef} variant={prop.variant || "success"} className={className}>{prop.message}</Alert>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="fullName">
                                <Form.Label>Bank name</Form.Label>
                                <Form.Control defaultValue={bank.fullName} onChange={handleChange} type="text" placeholder="Enter full name" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="shortName">
                                <Form.Label>Short name</Form.Label>
                                <Form.Control defaultValue={bank.shortName} onChange={handleChange} type="text" placeholder="Enter short name" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="type">
                                <Form.Label>Bank type</Form.Label>
                                <Form.Control defaultValue={bank.type} onChange={handleChange} type="text" placeholder="Enter type" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="sortCode">
                                <Form.Label>Sort code</Form.Label>
                                <Form.Control defaultValue={bank.sortCode} onChange={handleChange} type="text" placeholder="Enter sort code" required/>
                            </Form.Group>
                            <Button variant="primary" type="submit" ref={buttonRef}>
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal> 
                )
            }}
        </BankContext.Consumer>
     );
}

export const AddModal = (props) => {
    const { addBank } = useContext(BankContext);
    const [form, setForm] = useState({
        fullName: '',
        shortName: '',
        sortCode: '',
        type: ''
    });
    const [canClose, setClose] = useState(true);
    const buttonRef = useRef(null);
    const closeAlert = () => msgRef.current.classList.toggle("d-none")
    const msgRef = useRef(null);

    const handleChange = (event) => {
        form[event.target.id] = event.target.value;
        setForm(form)
    }

    const handleClose = () => {
        if (canClose) {
            props.hideModal('add')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setClose(false);
        addBank(form, buttonRef.current)
        msgRef.current?.focus();
        setClose(true);
    }

    return (
        <BankContext.Consumer>
            {() => {
                const prop = props.add
                const className = (prop.message) ? "text-center" : "d-none";
                return (
                <Modal show={prop.bool} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Bank</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <Alert ref={msgRef} variant={prop.variant} className={className} dismissible onClose={closeAlert}>
                                {prop.message}
                            </Alert>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="fullName">
                                <Form.Label>Bank name</Form.Label>
                                <Form.Control onChange={handleChange} type="text" placeholder="Enter full name" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="shortName">
                                <Form.Label>Short name</Form.Label>
                                <Form.Control onChange={handleChange} type="text" placeholder="Enter short name" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="type">
                                <Form.Label>Bank type</Form.Label>
                                <Form.Control onChange={handleChange} type="text" placeholder="Enter type" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="sortCode">
                                <Form.Label>Sort code</Form.Label>
                                <Form.Control onChange={handleChange} type="text" placeholder="Enter sort code" required/>
                            </Form.Group>
                            <Button variant="primary" type="submit" ref={buttonRef}>
                                Add Bank
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal> 
                )
            }}
        </BankContext.Consumer>
     );
}
 
export const DeleteModal = (props) => {
    const { deleteBank } = useContext(BankContext);
    const buttonRef = useRef(null);
    const msgRef = useRef(null);
    const handleDelete = (id) => {
        deleteBank(id, buttonRef.current)
    }
    return ( 
        <BankContext.Consumer>
            {() => (
                <Modal show={props.delete.bool} onHide={() => props.hideModal('delete')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p ref={msgRef}>{props.delete.message || "Are you sure you want to delete this item?"}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary"  onClick={() => props.hideModal('delete')}>Cancel</Button>
                        <Button variant="danger" ref={buttonRef}  onClick={() => handleDelete(props.delete.id)}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </BankContext.Consumer>
        
     );
}

export const ResponseModal = (props) => {
    const trace = props.trace;
    if(!trace) return ("")
    return (
         <Modal show={props.showModalBoolean} onHide={() => props.hideModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Http Trace Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container defaultActiveKey="request" id='req-res-tab'>
                    <Row>
                        <Col xs={12}>
                            <Nav variant='pills' className='flex-row justify-content-center'>
                                <Nav.Item className='col-5 text-center'>
                                    <Nav.Link eventKey='request'>Request</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className='col-5 text-center'>
                                    <Nav.Link eventKey='response'>Response</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col xs={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="request" className='p-3 mt-2'>
                                    <div className='mb-2'><span className='fw-bold me-3'>Timestamp:</span>{trace?.timestamp}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Time Taken (ms):</span>{trace?.timeTaken}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Request Method:</span>{trace?.request?.method}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Remote Address:</span>{trace?.request?.remoteAddress}</div>
                                    <div className='mb-2'><span className='fw-bold me-3 text-break'>URI:</span>{trace?.request?.uri}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Origin:</span>{trace?.request?.headers?.origin}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>User Agent (Web Client):</span>{trace?.request?.headers['user-agent']}</div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="response" className='p-3 mt-2'>
                                    <div className='mb-2'><span className='fw-bold me-3'>Status:</span>{trace?.response.status}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Date:</span>{trace?.response.headers['Date']}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Content-Type:</span>{trace?.response.headers['Content-Type']}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Server Allowed Origins:</span>{trace?.response.headers['Access-Control-Allow-Origin']}</div>
                                </Tab.Pane> 
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    )
}