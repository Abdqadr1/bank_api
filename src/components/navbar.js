import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

class NavBar extends React.Component{


    render() {
        return (
            <Navbar bg="light" expand="md">
                <Container>
                    <Navbar.Brand href="#home">Bank Api</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="w-100 me-auto text-center justify-content-md-end">
                            <Link role="button" className='nav-link' tabIndex={0} to="/banks">Banks</Link>
                            <Link role="button" className='nav-link' tabIndex={0} to="/system">System Dashboard</Link>
                            <Link role="button" className='nav-link text-danger' tabIndex={0} to="/logout">Log out</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default NavBar;