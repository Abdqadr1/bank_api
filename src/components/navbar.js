import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-bootstrap';

class NavBar extends React.Component{


    render() {
        return (
            <Navbar bg="light" expand="md">
                <Container>
                    <Navbar.Brand href="#home">Bank Api</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="w-100 me-auto text-end justify-content-md-end">
                            <Link role="button" className='nav-link' tabIndex={0} to="/banks">Banks</Link>
                            <Link role="button" className='nav-link' tabIndex={0} to="/countries">Countries</Link>
                            <Link role="button" className='nav-link' tabIndex={0} to="/system">System</Link>
                            <NavLink role="button" tabIndex={0} href={process.env.REACT_APP_ZIPKIN_URL}>Log Service</NavLink>
                            <Link role="button" className='nav-link text-danger' tabIndex={0} to="/logout">Log out</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default NavBar;