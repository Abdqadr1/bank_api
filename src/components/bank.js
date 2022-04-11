import React from "react";
import { Row, Col, Button } from "react-bootstrap";
class Bank extends React.Component{

    render() {
        let props = this.props;
        return (
             <tr>
                <td>{props.fullName }</td>
                <td>{props.shortName }</td>
                <td>{props.type }</td>
                <td>{props.sortCode }</td>
                <td>
                    <Row className='justify-content-center'>
                        <Col className="d-flex justify-content-center">
                            <Button className="mx-1" variant="outline-primary" title="edit" onClick={() => props.showModal('edit', props.id)}>Edit</Button>
                            <Button className="mx-1" variant="outline-danger" title="delete" onClick={() => props.showModal('delete',props.id)}>Delete</Button>
                        </Col>
                    </Row>
                </td>
            </tr>
        );
    }
}

export default Bank;