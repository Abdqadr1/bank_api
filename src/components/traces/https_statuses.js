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
                <Row className="justify-content-around mx-0">
                    <Col xs={11} md={6} lg={3} className="status">
                        <div className="inner bg-success rounded">
                            <div className="justify-content-between d-flex flex-wrap align-items-center">
                                <span className="material-icons-outlined mt-1">check_circle</span>
                                <span className="mt-1">200 Response</span>
                                <span className="number mt-1">{figures._200.count}</span>
                            </div>
                            <div className="updated">Updated: <span>{figures._200.time}</span></div>
                        </div>
                        
                    </Col>
                    
                    <Col xs={11} md={6} lg={3} className="status">
                        <div className="inner bg-primary rounded">
                            <div className="justify-content-between d-flex flex-wrap align-items-center">
                                <span className="material-icons-outlined">warning_amber</span>
                                <span>404 Response</span>
                                <span className="number mt-1">{figures._404.count}</span>
                            </div>
                            <div className="updated">Updated: <span>{figures._404.time}</span></div>
                        </div>
                    </Col>
                    
                    <Col xs={11} md={6} lg={3} className=" status">
                        <div className="inner bg-warning rounded">
                            <div className="justify-content-between d-flex flex-wrap align-items-center">
                                <span className="material-icons">error</span>
                                <span>400 Response</span>
                                <span className="number mt-1">{figures._400.count}</span>
                            </div>
                            <div className="updated">Updated: <span>{figures._400.time}</span></div>
                        </div>
                    </Col>
                    
                    <Col xs={11} md={6} lg={3} className="status">
                        <div className="inner bg-danger rounded">
                            <div className="justify-content-between d-flex flex-wrap align-items-center">
                                <span className="material-icons-outlined">bug_report</span>
                                <span>500 Response</span>
                                <span className="number mt-1">{figures._500.count}</span>
                            </div>
                            <div className="updated">Updated: <span>{figures._500.time}</span></div>
                        </div>
                        
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Statuses;