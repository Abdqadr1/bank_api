import React from 'react';
import axios from "axios";
import Table from "react-bootstrap/Table";
import Bank from './bank';
import {EditModal, DeleteModal, AddModal} from './modals';
import Container from 'react-bootstrap/Container';
import { BankContext } from '../context/context'
import AddBank from './addBank'
import NavBar from './navbar';
import MyPagination from './traces/pagination';

export default class Banks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banks: [],
            edit: {
                bool: false,
                id: 0
            },
            delete: {
                bool: false,
                id: 0
            },
            add: { bool: false, message: "" },
            pages: {number: 10, active: 1}
        };
        this.serverURl = process.env.REACT_APP_SERVER_URL;
    }

    showModal = (which, id) => {
        if (which === "edit") {
            this.setState( state => ({
                    edit: {bool:true, id}
                })
            )
        } else if (which === "delete") {
            this.setState( state => ({
                    delete: {bool:true, id}
                })
            )
        } else if (which === "add") {
            this.setState( state => ({
                    add: {bool:true}
                })
            )
        }
    }
    hideModal = (which) => {
        if (which === "edit") {
            this.setState(
                {
                    ...this.state,
                    edit: {...this.state.edit, bool:false}
                }
            )
        } else if (which === "delete") {
            this.setState(
                {
                    ...this.state,
                    delete: {...this.state.delete, bool:false}
                }
            )
        } else if (which === "add") {
            this.setState(state => (
                { add: {bool: false} }
            ))
        }
    }
    delete = (id) =>  {
        console.info("deleting...", id)
        axios.get(`${this.serverURl}/delete/${id}`)
            .then(response => { 
                if (response.status === 200) {
                    this.setState(state => ({
                        banks: state.banks.filter(bank => bank.id !== id),
                        delete: {bool:false, id: 0}
                    }))
                    return true;
                } else {
                    console.log(response);
                    return false;
                }
            })
            .catch(error => {
                console.error(error);
                return false;
            })
    }
    edit = (id, data) => {
        axios.post(`${this.serverURl}/edit/${id}`, data)
            .then(response => {
                // console.log(response, this.state);
                if (response.status === 200) {
                    this.setState(state => ({
                        edit: {bool:false, id}
                    }))
                    return true;
                } else {
                    return false;
                }
            })
            .catch(error => {
                console.error(error)
                return false;
            })
    }
    add = (data) => {
        axios.post(`${this.serverURl}/add`, data)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    this.state.banks.push(response.data);
                    this.setState(state => ({
                        add: {bool:false}
                    }))
                    return true;
                } else {
                    return false;
                }
            })
            .catch(error => {
                console.error("error", error.toJSON())
                if (error.response) {
                    console.log("response", error.response)
                    const message = error.response.data.message;
                    this.setState(state => ({
                        add: {...state.add, message}
                        })
                    )
                }
            })
    }

    componentDidMount() {
        axios.get(this.serverURl)
            .then(data => {
                this.setState({
                    banks: data.data,
                })
            })
            .catch(error => console.error(error));
    }

    gotoPage = (number) => {
        this.setState(state => ({
            pages: {
                ...state.pages,
                active: number
            }
        }))
    }

    render() {
        const isEmpty = this.state.banks.length < 1;
        const editId = this.state.edit.id;
        const deleteId = this.state.delete.id;
        const val = {
            banks: this.state.banks,
            addBank: this.add,
            deleteBank: this.delete,
            editBank: this.edit
        }
        
        const noOfPage = Math.ceil(this.state.banks.length / this.state.pages.number)
        const start = (this.state.pages.number * this.state.pages.active) - this.state.pages.number;
        const end = (this.state.pages.number * this.state.pages.active)
        const activeBanks = this.state.banks.slice(start, end)
        return (
            <BankContext.Provider value={val}>
                <NavBar />
                <AddBank showModal={this.showModal} />
                <Container>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                            <th>Full Name</th>
                            <th>Short Name</th>
                            <th>Type</th>
                            <th>Sort Code</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isEmpty 
                                ? <tr><td colSpan={4}>No Banks</td></tr>
                                : activeBanks.map(bank => <Bank key={bank.id} {...bank} showModal={this.showModal} />)}  
                        </tbody>
                    </Table>
                    <MyPagination active={this.state.pages.active} go={this.gotoPage} number={noOfPage} />
                    <EditModal showModalBoolean={this.state.edit.bool} id={editId} hideModal={this.hideModal} />
                    <DeleteModal showModalBoolean={this.state.delete.bool} id={deleteId} hideModal={this.hideModal} />
                    <AddModal showModalBoolean={this.state.add.bool} hideModal={this.hideModal} response={this.state.add.message}/>
                </Container>
            </BankContext.Provider>
            
    );
  }
}