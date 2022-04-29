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
                            <Button className="mx-1 p-1 action" variant="outline-primary" title="edit" onClick={() => props.showModal('edit', props.id)}>
                                <span className="material-icons pb-0">edit</span>
                            </Button>
                            <Button className="mx-1 p-1 action" variant="outline-danger" title="delete" onClick={() => props.showModal('delete', props.id)}>
                                <span className="material-icons pb-0">delete</span>
                            </Button>
                        </Col>
                    </Row>
                </td>
            </tr>
        );
    }
}

export default Bank;