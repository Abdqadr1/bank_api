import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Nav } from 'react-bootstrap';

export const ResponseModal = (props) => {
    const trace = props.trace;
    if(!trace) return ("")
    return (
         <Modal show={props.showModalBoolean} onHide={() => props.hideModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Http Trace Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container defaultActiveKey="request" id='req-res-tab'>
                    <Row>
                        <Col xs={12}>
                            <Nav variant='pills' className='flex-row justify-content-center'>
                                <Nav.Item className='col-5 text-center'>
                                    <Nav.Link eventKey='request'>Request</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className='col-5 text-center'>
                                    <Nav.Link eventKey='response'>Response</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col xs={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="request" className='p-3 mt-2'>
                                    <div className='mb-2'><span className='fw-bold me-3'>Timestamp:</span>{trace?.timestamp}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Time Taken (ms):</span>{trace?.timeTaken}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Request Method:</span>{trace?.request?.method}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Remote Address:</span>{trace?.request?.remoteAddress}</div>
                                    <div className='mb-2'><span className='fw-bold me-3 text-break'>URI:</span>{trace?.request?.uri}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Origin:</span>{trace?.request?.headers?.origin}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>User Agent (Web Client):</span>{trace?.request?.headers['user-agent']}</div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="response" className='p-3 mt-2'>
                                    <div className='mb-2'><span className='fw-bold me-3'>Status:</span>{trace?.response.status}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Date:</span>{trace?.response.headers['Date']}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Content-Type:</span>{trace?.response.headers['Content-Type']}</div>
                                    <div className='mb-2'><span className='fw-bold me-3'>Server Allowed Origins:</span>{trace?.response.headers['Access-Control-Allow-Origin']}</div>
                                </Tab.Pane> 
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    )
}