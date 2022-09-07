import React from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
class Bank extends React.Component{

    constructor(props) {
        super(props);
        this.updateStatus = props.updateStatus;
        this.enabled = props.enabled
            ? <span 
                onClick={()=> this.updateStatus(props.id, false)} 
                className="material-icons text-success fs-3">
                    check_circle
                </span>
            : <span
                onClick={()=> this.updateStatus(props.id, true)} 
                className="material-icons text-secondary fs-3">circle</span>

    }

    tableItem(prop) {
        return (
             <tr>
                <td>{prop.name }</td>
                <td>{prop.alias }</td>
                <td className="d-md-none d-lg-table-cell">{prop.type }</td>
                <td>{prop.code }</td>
                <td className="d-md-none d-lg-table-cell">{prop.longCode }</td>
                <td>{this.enabled}</td>
                <td>
                    <Row className='justify-content-center'>
                        <Col className="d-flex justify-content-center">
                            <Button className="mx-1 p-1 action" variant="outline-primary" title="edit" onClick={() => prop.showModal('edit', prop.id)}>
                                <span className="material-icons pb-0">edit</span>
                            </Button>
                            <Button className="mx-1 p-1 action" variant="outline-danger" title="delete" onClick={() => prop.showModal('delete', prop.id)}>
                                <span className="material-icons pb-0">delete</span>
                            </Button>
                        </Col>
                    </Row>
                </td>
            </tr>
        );
    }

    rowItem(prop) {
        return (
            <Card className="text-start my-2">
                <Card.Header className="px-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Bank ID #{prop.id}</span>
                    <div className="justify-content-start d-flex">
                        <div className="me-2">{this.enabled}</div>
                        <Button className="me-2 p-1 action" variant="outline-primary" title="edit" onClick={() => prop.showModal('edit', prop.id)}>
                            <span className="material-icons pb-0">edit</span>
                        </Button>
                        <Button className="me-2 p-1 action" variant="outline-danger" title="delete" onClick={() => prop.showModal('delete', prop.id)}>
                            <span className="material-icons pb-0">delete</span>
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className="p-2">
                    <div className="mb-1"><strong>Name: </strong>{prop.name}</div>
                    <div className="mb-1"><strong>Type: </strong>{prop.type}</div>
                    <div><strong>Code: </strong>{prop.code}</div>
                </Card.Body>
            </Card>
        )
    }

    render() {
        return (this.props.viewType === 'detailed') ? this.tableItem(this.props) : this.rowItem(this.props);
    }
}

export default Bank;