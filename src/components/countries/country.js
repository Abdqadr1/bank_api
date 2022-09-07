import React from "react";
import { Row, Col, Button } from "react-bootstrap";
class Country extends React.Component{

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
                <td className="d-none d-md-table-cell">{prop.code }</td>
                <td>{prop.callCode }</td>
                <td className="d-none d-md-table-cell">{prop.continent }</td>
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

    render() {
        return this.tableItem(this.props);
    }
}

export default Country;