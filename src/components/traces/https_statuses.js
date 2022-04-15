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
                            <Col xs={9} className="name pe-0">
                                <span className="material-icons-outlined">check_circle</span>
                                <span>200 Response</span>
                            </Col>
                            <Col xs={3} className="number">{figures._200.count}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">{figures._200.time}</span></div>
                    </Col>
                    
                    <Col className="bg-primary status rounded">
                        <Row className="justify-content-between">
                            <Col xs={9} className="name pe-0">
                                <span className="material-icons-outlined">warning_amber</span>
                                <span>404 Response</span>
                            </Col>
                            <Col xs={3} className="number">{figures._404.count}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">{figures._404.time}</span></div>
                    </Col>
                    
                    <Col className="bg-warning status rounded">
                        <Row className="justify-content-between">
                            <Col xs={9} className="name pe-0">
                                <span className="material-icons">error</span>
                                <span>400 Response</span>
                            </Col>
                            <Col xs={3} className="number">{figures._400.count}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">{figures._400.time}</span></div>
                    </Col>
                    
                    <Col className="bg-danger status rounded">
                        <Row className="justify-content-between">
                            <Col xs={9} className="name pe-0">
                                <span className="material-icons-outlined">bug_report</span>
                                <span>500 Response</span>
                            </Col>
                            <Col xs={3} className="number">{figures._500.count}</Col>
                        </Row>
                        <div className="updated">Updated: <span className="ps-2">{figures._500.time}</span></div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Statuses;