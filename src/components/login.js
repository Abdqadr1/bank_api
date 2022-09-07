import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../css/login.css'
import {useEffect, useRef, useState } from "react";
import { isTimeout, SPINNERS_BORDER_HTML } from "./utilities";

const Login = () => {
    const abortControllerRef = useRef();
    const { id } = useParams();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const [form, setForm] = useState({name: '', secret: ''})
    const alertRef = useRef();
    const url = process.env.REACT_APP_AUTH_URL;
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }
    const navigate = useNavigate();

    const handleInput = event => {
        const id = event.target.name;
        const value = event.target.value;
        setForm(f => ({
            ...f,
            [id]: value
        }))
    }
    const handleSubmit = event => {
        event.preventDefault();
        const target = event.target;
        const button = target.querySelector("button");
        button.disabled = true;
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML;
        // on error
        axios.post(url, form, {
            timeout: 40000,
            signal: abortControllerRef.current.signal
        })
        .then(response => {
                sessionStorage.setItem("user", JSON.stringify(response.data))
                navigate('/banks');
        }).catch(error => {
            let message = error?.response?.data?.message ?? "Something went wrong";
            if (isTimeout(error?.code)) {
                message = "timeout, check your internet connection";
            }
            setAlert({
                message,
                variant: 'danger',
                class: 'text-center py-2'
            });
        }).finally(() => {
            button.disabled = false;
            button.textContent = text;
        })
    }

     useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])

    useEffect(() => {
        if (id && id === "1") {
            setAlert(s=>({...s, show: true, message: "Session expired" }))
        }
    }, [id])

    useEffect(() => {
        abortControllerRef.current = new AbortController();
        return () => abortControllerRef.current.abort();
    },[])

    return ( 
        <Container>
            <Row className="parent">
                <Col xs={9} md={7} lg={6} className='border p-3 rounded'>
                    <h3 className='text-center fw-bold'>Login</h3>
                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show}
                        dismissible onClose={toggleAlert} style={{fontSize: '.8em'}}>
                        {alert.message}
                    </Alert>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className='text-start d-block'>Name</Form.Label>
                            <Form.Control onInput={handleInput} name="name" type="text" placeholder="Enter client name" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className='text-start d-block'>Secret</Form.Label>
                            <Form.Control onInput={handleInput} name="secret" type="password" placeholder="Enter secret" required/>
                        </Form.Group>
                        <Button className='d-block px-4' variant="secondary" type="submit">
                            Log in
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
 
export default Login;