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

const loading = `<div class="spinner-grow spinner-grow-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`;

export const EditModal = (props) => {
    const { editBank, banks } = useContext(BankContext);
    const [form, setForm] = useState({
        fullName: '',
        shortName: '',
        sortCode: '',
        type: ''
    });
    const [canClose, setClose] = useState(true);
    const [alert, setAlert] = useState({variant: "success", class:"d-none", message: ""});
    const buttonRef = useRef(null);
    const msgRef = useRef(null);

    const handleChange = (event) => {
        form[event.target.id] = event.target.value;
        setForm(form)
    }

    useEffect(() => {
        const bank = banks[banks.findIndex(bk => bk.id === props.id)]
        if (bank) {
            setForm(bank);
        }
    }, [banks, form, props.id])

    const handleClose = () => {
        if (canClose) {
            props.hideModal('edit')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setClose(false);
        buttonRef.current.innerHTML = loading;
        buttonRef.current.disabled = true;
        console.log("submitting...", form);
        if (editBank(props.id, form)) {
            setAlert({
                variant: "danger", class: "text-center", message: "Something went wrong"
            })
        }
        setClose(true);
        buttonRef.current.innerHTML = "Save Changes";
        buttonRef.current.disabled = false;
        msgRef.current.focus();
        
    }

    return (
        <BankContext.Consumer>
            {({banks}) => {
                const bank = banks[banks.findIndex(bk => bk.id === props.id)] || form;
                return (
                <Modal show={props.showModalBoolean} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Bank</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert ref={msgRef} variant={alert.variant} className={alert.class}>{alert.message}</Alert>
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
    const [alert, setAlert] = useState({variant: "danger", message: ""});
    const buttonRef = useRef(null);
    const msgRef = useRef(null);

    const handleChange = (event) => {
        form[event.target.id] = event.target.value;
        setForm(form)
    }

    // useEffect(() => {
    //     const bank = banks[banks.findIndex(bk => bk.id === props.id)]
    //     if (bank) {
    //         setForm(bank);
    //     }
    // }, [banks, form, props.id])

    const handleClose = () => {
        if (canClose) {
            props.hideModal('add')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setClose(false);
        buttonRef.current.innerHTML = loading;
        buttonRef.current.disabled = true;
        console.log("submitting...", form);
        if (addBank(form)) {
            setAlert({
                variant: "danger", class: "text-center", message: "Something went wrong"
            })
        }
        setClose(true);
        buttonRef.current.innerHTML = "Add Bank";
        buttonRef.current.disabled = false;
        msgRef.current.focus();
        
    }

    return (
        <BankContext.Consumer>
            {() => {
                const className = (props.response) ? "text-center" : "d-none";
                return (
                <Modal show={props.showModalBoolean} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Bank</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert ref={msgRef} variant={alert.variant} className={className}>{props.response}</Alert>
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
        buttonRef.current.innerHTML = loading;
        if (!deleteBank(id)) {
            msgRef.current.textContent = "Something went wrong. Try again"
        }
    }
    return ( 
        <BankContext.Consumer>
            {() => (
                <Modal show={props.showModalBoolean} onHide={() => props.hideModal('delete')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p ref={msgRef}>Are you sure you want to delete this item?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary"  onClick={() => props.hideModal('delete')}>Cancel</Button>
                        <Button variant="danger" ref={buttonRef}  onClick={() => handleDelete(props.id)}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </BankContext.Consumer>
        
     );
}

export const ResponseModal = (props) => {
    return (
         <Modal show={props.showModalBoolean} onHide={() => props.hideModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Response Result</Modal.Title>
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
                                    <div><span className='fw-bold'>Timestamp:</span> July 34, 2020 10:45pm</div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="response" className='p-3 mt-2'>
                                    <div><span className='fw-bold'>Status:</span> 200</div>
                                </Tab.Pane> 
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    )
}