
import React, { memo } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { SystemStatus } from '../../context/context';

class SystemInfo extends React.Component{

    render() {
        return (
            <SystemStatus.Consumer>
                {(systemInfo) => (
                          <Container fluid className='bg-light'>
                            <Row className='justify-content-between'>
                                <Col xs={10} className='d-flex justify-content-start pb-2'>
                                    <span className='system_info'>
                                        <span className="material-icons">dashboard</span>
                                        <span> System: {systemInfo.system}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">storage</span>
                                        <span> DB: {systemInfo.db}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">save</span>
                                        <span> Disk Space: {systemInfo.diskSpace}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">memory</span>
                                        <span> Processor: {systemInfo.processor}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">schedule</span>
                                        <span> Up Time: {systemInfo.upTime}</span>
                                    </span>
                                </Col>
                                <Col xs={2} className='d-flex justify-content-end'>
                                    <Button variant='success' onClick={this.props.refresh}>Refresh Data</Button>
                                </Col>
                            </Row>
                        </Container>
                    )}
            </SystemStatus.Consumer>
            
        );
    }
}

export default memo(SystemInfo);