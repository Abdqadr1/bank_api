import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useEffect, useRef, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { isTimeout, listFormData, SPINNERS_BORDER_HTML} from '../utilities';

const AddEditModal = ({ hideModal, add_edit, addEditCountry, token }) => {
    const [form, setForm] = useState({});
    const url = process.env.REACT_APP_COUNTRY_URL + "/admin/save";
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
        if (add_edit?.country?.name) {
            setForm({ ...add_edit.country });
        } else setForm({});
        setAlert(s => ({ ...s, show: false }))
        abortControllerRef.current = new AbortController();
        return () => abortControllerRef.current.abort();
    }, [add_edit.country]);

    const handleChange = (event) => {
        setForm(s => ({
            ...s,
            [event.target.id]: event.target.value
        }))
    }

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
                addEditCountry(res.data, add_edit.which);
                setAlert(s => ({ ...s, variant: "success", show: true, message: "Country saved!" }));
            })
            .catch(error => {
                const response = error?.response;
                if (response?.status === 406) navigate("/login/1");
                let message = response?.data?.message ?? "Something went wrong";
                if (isTimeout(error?.code)) {
                    message = "timeout, check your internet connection";
                }
                setAlert(s => ({...s, variant: "danger", show: true, message}))
            })
            .finally(() => {
                button.innerHTML = text;
                button.disabled = false;
            })
    }

    return (
        <>
            <Modal show={add_edit.show} onHide={()=>hideModal('edit')}>
                <Modal.Header closeButton>
                    <Modal.Title>Country {(add_edit?.country?.id) && <strong>ID: {add_edit?.country?.id}</strong>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                        {alert.message}
                    </Alert>
                    <Form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={form?.id ?? ""} />
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Country name</Form.Label>
                            <Form.Control value={form?.name ?? ""} name="name"  onChange={handleChange} type="text" placeholder="Enter name" required minLength="3" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="code">
                            <Form.Label>Country Code</Form.Label>
                            <Form.Control value={form?.code ?? ""} name="code"  onChange={handleChange} type="text" placeholder="Enter code" required minLength="2" maxLength="2"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="continent">
                            <Form.Label>Continent</Form.Label>
                            <Form.Select value={form?.continent ?? ""} onChange={handleChange} name="continent" required>
                                <option value="" hidden>Select continent</option>
                                <option value="AFRICA">AFRICA</option>
                                <option value="ANTARCTICA">ANTARCTICA</option>
                                <option value="ASIA">ASIA</option>
                                <option value="AUSTRALIA">AUSTRALIA</option>
                                <option value="EUROPE">EUROPE</option>
                                <option value="NORTH AMERICA">NORTH AMERICA</option>
                                <option value="OCEANIA">OCEANIA</option>
                                <option value="SOUTH AMERICA">SOUTH AMERICA</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="callCode">
                            <Form.Label>Call Code</Form.Label>
                            <Form.Control value={form?.callCode ?? ""} onChange={handleChange} name="callCode" placeholder="Enter callCode" maxLength="10" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal> 
        </>
     );
}

export default AddEditModal;
