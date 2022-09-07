import { Form, Row, Container, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const AddBank = ({ showModal, search, word }) => {
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        setKeyword(word)
    }, [word])

    const handleSubmit = e => {
        e.preventDefault();
        search(keyword)
    }
    const clearKeyword = () => {
        setKeyword("");
        search("");
    }

    return ( 
        <Container className='my-3'>
            <Row className="justify-content-start">
                <Col xs={11} md={4}>
                    <span className="material-icons fs-1 text-secondary" onClick={() => showModal("add")}>
                        note_add
                    </span>
                </Col>
                <Col xs={11} md={8}>
                    <Form className="d-flex flex-wrap justify-content-center" onSubmit={handleSubmit}>
                        <div className="mt-2 col-md-7 col-11">
                           <Form.Control value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Enter keyword"
                            required minLength="2" /> 
                        </div>
                        <div className="mt-2 col-md-5 col-11 ps-2">
                            <Button variant="primary" className="mx-1" type="submit" alt="search">
                                <span title="Search keyword" className="material-icons fs-6 mb-0"> search </span>
                            </Button>
                            <Button onClick={clearKeyword} variant="secondary" className="mx-1" type="button" alt="clear search">
                                <span title="clear keyword" className="material-icons fs-6 mb-0"> clear_all </span>
                            </Button>  
                        </div>
                        
                    </Form>
                   
                </Col>
            </Row>
        </Container>
        
     );
}
 
export default AddBank;