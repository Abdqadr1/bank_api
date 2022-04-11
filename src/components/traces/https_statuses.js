import React from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../css/status.css';


class Statuses extends React.Component{

    render() {
        const figures = this.props.figures;
        return (
            <Container>
                <Row className="justify-content-around">
                    <Col className="bg-success status rounded">
                        <Row className="justify-content-between">
                            <Col xs={8} className="name"><span>200 Response</span></Col>
                            <Col xs={3} className="number">{figures._200}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">04/04/2022, 10:28 AM</span></div>
                    </Col>
                    
                    <Col className="bg-primary status rounded">
                        <Row className="justify-content-between">
                            <Col xs={8} className="name"><span>404 Response</span></Col>
                            <Col xs={3} className="number">{figures._404}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">04/04/2022, 10:28 AM</span></div>
                    </Col>
                    
                    <Col className="bg-warning status rounded">
                        <Row className="justify-content-between">
                            <Col xs={8} className="name"><span>400 Response</span></Col>
                            <Col xs={3} className="number">{figures._400}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">04/04/2022, 10:28 AM</span></div>
                    </Col>
                    
                    <Col className="bg-danger status rounded">
                        <Row className="justify-content-between">
                            <Col xs={8} className="name"><span>500 Response</span></Col>
                            <Col xs={3} className="number">{figures._500}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">04/04/2022, 10:28 AM</span></div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Statuses;