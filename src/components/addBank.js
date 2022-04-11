import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';

const AddBank = (props) => {
    return ( 
        <Container className='my-5'>
            <Row className="justify-content-end">
                <Col xs={2}>
                    <Button onClick={() => props.showModal("add")} variant="secondary">Add Bank</Button>
                </Col>
            </Row>
        </Container>
        
     );
}
 
export default AddBank;