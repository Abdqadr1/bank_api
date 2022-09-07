import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Response from './response'
import { ResponseModal } from '../modals'
import '../../css/response.css'
import { HttpTraces } from '../../context/context'

class ResponseTable extends React.Component{

    constructor(props) {
        super(props);
        this.state = { showModalBoolean: false, selectedIndex: -1 }
        this.tableRef = React.createRef();
    }

    showModal = (index) => {
        this.setState(() => ({
            showModalBoolean: true,
            selectedIndex: index
        }));
    }
    hideModal = () => {
        this.setState({ ...this.state, showModalBoolean: false });
    }

    render() {
        const index = this.state.selectedIndex;
        const trace = index > -1 ? this.context[index] : ""
        const traces = (this.context.length < 1) ? <tr><td colSpan={6} className="text-center">No Response yet</td></tr> : 
            this.context.map((trace, i) => <Response key={i} trace={trace} index={i} showModal={this.showModal} /> )
        return (
            <Container id='response_root'>
                <Row className="justify-content-between my-2">
                    <Col xs={5} md={3}><h4>HTTP Traces</h4></Col>
                    <Col xs={5} md={3}>{this.props.export}</Col>
                </Row>
                 <Table striped bordered responsive hover size="sm" ref={this.tableRef}>
                    <thead className="bg-light text-secondary">
                        <tr>
                        <th className="d-none d-lg-table-cell">Timestamp</th>
                        <th className="d-none d-md-table-cell">Method</th>
                        <th className="d-none d-lg-table-cell">Time taken(ms)</th>
                        <th className="d-none d-lg-table-cell">Status</th>
                        <th>URI</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='border-top-0'>
                      {traces}  
                    </tbody>
                </Table>
                <ResponseModal hideModal={this.hideModal} trace={trace} showModalBoolean={this.state.showModalBoolean} />
            </Container>  
        );
    }
}

ResponseTable.contextType = HttpTraces;

export default ResponseTable;