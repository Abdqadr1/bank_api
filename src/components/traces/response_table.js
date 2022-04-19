import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
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

    exportToExcel = () => {
        console.log("exporting to excel ...")
     }

    render() {
        const index = this.state.selectedIndex;
        const trace = index > -1 ? this.context[index] : ""
        const traces = (this.context.length < 1) ? <tr><td colSpan={6}>No Response yet</td></tr> : 
            this.context.map((trace, i) => <Response key={i} trace={trace} index={i} showModal={this.showModal} /> )
        return (
            <Container>
                <Row className="justify-content-between my-2">
                    <Col xs={4} md={3}><h4>HTTP Traces</h4></Col>
                    <Col xs={4} md={3}>
                        <Button onClick={this.exportToExcel} variant='primary'>Export to excel</Button>
                    </Col>
                </Row>
                 <Table bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>Timestamp</th>
                        <th>Method</th>
                        <th>Time taken(ms)</th>
                        <th>Status</th>
                        <th>URI</th>
                        <th>view</th>
                        </tr>
                    </thead>
                    <tbody>
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