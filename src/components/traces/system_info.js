
import React, { memo } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { SystemStatus } from '../../context/context';
import { formatBytes, formatUpTime } from '../../utilities';

class SystemInfo extends React.Component{
    refresh = (event) => {
        event.target.disabled = true
        this.props.refresh(() => event.target.disabled = false)
        
    }

    render() {
        return (
            <SystemStatus.Consumer>
                {(systemInfo) => {
                    const pClass = `system_info ${(systemInfo.processor && systemInfo.processor > 3) ? '' : 'text-danger'}`;
                    const sClass = `system_info ${(systemInfo.system.toLocaleLowerCase() === 'up') ? '' : 'text-danger'}`;
                    const diskSpace = formatBytes(systemInfo.diskSpace)
                    const time = formatUpTime(systemInfo.upTime)
                    return (
                        <Container fluid className='bg-light'>
                            <Row className='justify-content-between py-2'>
                                <Col xs={10} className='d-flex justify-content-start pb-2'>
                                    <span className={sClass}>
                                        <span className="material-icons">dns</span>
                                        <span> System: {systemInfo.system}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">schema</span>
                                        <span> DB: {systemInfo.db}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">memory</span>
                                        <span> Disk Space: {diskSpace}</span>
                                    </span>
                                    <span className={pClass}>
                                        <span className="material-icons">developer_board</span>
                                        <span> Processor: {systemInfo.processor}</span>
                                    </span>
                                    <span className='system_info'>
                                        <span className="material-icons">schedule</span>
                                        <span> Up Time: {time}</span>
                                    </span>
                                </Col>
                                <Col xs={2} className='d-flex justify-content-end'>
                                    <Button variant='success' onClick={this.refresh}>Refresh Data</Button>
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