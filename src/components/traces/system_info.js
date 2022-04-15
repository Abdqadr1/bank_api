
import React, { memo } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { SystemStatus } from '../../context/context';

class SystemInfo extends React.Component{

    render() {
        return (
            <SystemStatus.Consumer>
                {(systemInfo) => {
                    const pClass = `system_info ${(systemInfo.processor && systemInfo.processor > 3) ? '' : 'text-danger'}`;
                    const sClass = `system_info ${(systemInfo.system.toLocaleLowerCase() === 'up') ? '' : 'text-danger'}`;
                    return (
                        <Container fluid className='bg-light'>
                            <Row className='justify-content-between py-2'>
                                <Col xs={10} className='d-flex justify-content-start pb-2'>
                                    <span className={sClass}>
                                        <span className="material-icons">dns</span>
                                        <span> System: {systemInfo.system}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">storage</span>
                                        <span> DB: {systemInfo.db}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">memory</span>
                                        <span> Disk Space: {systemInfo.diskSpace}</span>
                                    </span>
                                    <span className={pClass}>
                                        <span className="material-icons">developer_board</span>
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
                    )
                }}
            </SystemStatus.Consumer>
            
        );
    }
}

export default memo(SystemInfo);