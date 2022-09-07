import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useRef, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { isTimeout, listFormData, SPINNERS_BORDER_HTML } from '../utilities';
import axios from 'axios';
import { useNavigate } from 'react-router';

const AddModal = ({ hideModal, show, addBank, token, countries }) => {
    const url = process.env.REACT_APP_BANK_URL + "/admin/add";
    const navigate = useNavigate();
    const abortControllerRef = useRef();
    const alertRef = useRef();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert]);

    useEffect(() => {
        if (show) setAlert(s => ({ ...s, show: false }));
    }, [show])

    useEffect(() => {
        abortControllerRef.current = new AbortController();
        return () => abortControllerRef.current.abort();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const target = event.target;
        const data = new FormData(target);
        listFormData(data);
        const button = target.querySelector("button");
        button.disabled = true;
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML;

        axios.post(url, data, {
            headers: {
                "Authorization" : "Client " + token
            },
            timeout: 90000,
            signal: abortControllerRef.current.signal
        })
        .then(res => {
            addBank(res.data);
            setAlert(s => ({ ...s, variant: "success", show: true, message: "Bank saved!" }));
        }).catch(error => {
            const response = error?.response;
            if (response?.status === 406) navigate("/login/1");
            let message = response?.data?.message ?? "Something went wrong";
            if (isTimeout(error?.code)) {
                message = "timeout, check your internet connection";
            }
            setAlert(s => ({...s, variant: "danger", show: true, message}))
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = text;
        })
    }

    return (
        <>
            <Modal show={show} onHide={()=>hideModal('add')}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Bank</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Alert className="text-center" ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                        {alert.message}
                    </Alert>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Bank name</Form.Label>
                            <Form.Control name="name" type="text" placeholder="Enter full name" required minLength="3"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="alias">
                            <Form.Label>Alias</Form.Label>
                            <Form.Control name="alias" type="text" placeholder="Enter alias" required minLength="3"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Select name="type">
                                <option value="" hidden>Select bank type</option>
                                <option value="nuban">nuban</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Select name="country" required>
                                <option value="" hidden>Select bank country</option>
                                {
                                    countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="currency">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control name="currency" type="text" placeholder="Enter currency" required minLength="3"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="code">
                            <Form.Label>Code</Form.Label>
                            <Form.Control name="code" type="number" placeholder="Enter code" minLength="3"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="longCode">
                            <Form.Label>Long Code</Form.Label>
                            <Form.Control name="longCode" type="number" placeholder="Enter long code" minLength="3"/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal> 
        </>
     );
}
export default AddModal;