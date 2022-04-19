import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';

const AddBank = (props) => {
    return ( 
        <Container className='my-3'>
            <Row className="justify-content-end">
                <Col xs={4} className="d-flex justify-content-end">
                    <Button className='px-4' onClick={() => props.showModal("add")} variant="secondary">Add Bank</Button>
                </Col>
            </Row>
        </Container>
        
     );
}
 
export default AddBank;