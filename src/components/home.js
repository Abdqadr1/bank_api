import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../css/login.css'
import { useRef, useState } from "react";


const Login = () => {

    const url = process.env.REACT_APP_SERVER_URL;
    const loading = `<div class="spinner-grow spinner-grow-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`;
    const buttonRef = useRef(null);
    const [alert, setAlert] = useState({ message: '', class: "d-none", variant: 'success' })
    // const [user, setUser] = useState({})
    const [data, setData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const handleChange = event => {
        setData({
        ...data,
            [event.target.id]: event.target.value
        })
    }
    const handleSubmit = event => {
        event.preventDefault()
        buttonRef.current.disabled = true;
        buttonRef.current.innerHTML = loading;
        // on error
        axios.post(`${url}/authenticate`, data, {
            headers: { "Content-Type": "multipart/form-data"},
            transformRequest: [function (data, headers) {
                const formData = new FormData();
                formData.append("username", data.username);
                formData.append("password", data.password);
                return formData;
            }]
        })
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response.data))
                navigate('/banks');
        }).catch(error => {
            setAlert({
                message: error?.response.data.message,
                variant: 'danger',
                class: 'text-center py-2'
            })
            buttonRef.current.disabled = false;
            buttonRef.current.innerHTML = 'Log in';
        })
    }


    return ( 
        <Container>
            <Row className="parent">
                <Col xs={9} md={6} className='border p-3'>
                    <h4 className='text-center'>Login</h4>
                    <Alert variant={alert.variant} className={alert.class}>{alert.message}</Alert>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className='text-start d-block'>Username</Form.Label>
                            <Form.Control value={data.username} onChange={handleChange} type="text" placeholder="Enter username" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className='text-start d-block'>Password</Form.Label>
                            <Form.Control value={data.password} onChange={handleChange} type="password" placeholder="Enter password" required/>
                        </Form.Group>
                        <Button className='d-block px-4' variant="secondary" type="submit" ref={buttonRef}>
                            Log in
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
 
export default Login;