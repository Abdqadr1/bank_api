import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

class Login extends React.Component{

    constructor(props) {
        super(props)
        this.loading = `<div class="spinner-grow spinner-grow-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`;
        this.buttonRef = React.createRef(null);
        this.state = {
            username: '', password: '',
            alert: {message: '', class: "d-none", variant: 'success'}
        }
    }


    handleChange = event => {
        this.setState(() => ({
            [event.target.id]: event.target.value
        }))
    }

    handleSubmit = event => {
        event.preventDefault()
        console.info("submitting....", this.state)
        this.buttonRef.current.disabled = true;
        this.buttonRef.current.innerHTML = this.loading;
        // on error
        this.setState(() => ({
            alert: {
                message: 'submitting...',
                variant: 'danger',
                class: 'text-center py-2'
            }
        }))
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col xs={4} className='border p-3'>
                        <h4 className='text-center'>Login</h4>
                        <Alert variant={this.state.alert.variant} className={this.state.alert.class}>{this.state.alert.message}</Alert>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label className='text-start d-block'>Username</Form.Label>
                                <Form.Control value={this.username} onChange={this.handleChange} type="text" placeholder="Enter username" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className='text-start d-block'>Password</Form.Label>
                                <Form.Control value={this.password} onChange={this.handleChange} type="password" placeholder="Enter password" required/>
                            </Form.Group>
                            <Button className='d-block px-4' variant="secondary" type="submit" ref={this.buttonRef}>
                                Log in
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;