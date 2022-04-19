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
import { Navigate } from 'react-router-dom';

class Banks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banks: [],
            edit: {bool: false,id: 0},
            delete: {bool: false,id: 0
            },
            add: { bool: false},
            pages: { number: 10, active: 1 },
        };
        this.serverURl = process.env.REACT_APP_SERVER_URL;
        this.user = JSON.parse(localStorage.getItem('user'))
        this.abortController = new AbortController();
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
        axios.delete(`${this.serverURl}/delete/${id}`, {
            headers: {
                "Authorization" : "Bearer " + this.user?.access_token
            }
        })
            .then(() => { 
                this.setState(state => ({
                    banks: state.banks.filter(bank => bank.id !== id),
                    delete: {bool:false, id: 0}
                }))
            })
            .catch(error => {
                console.log(error.response)
                if (error.response) {
                    this.setState(state => ({
                        delete: {...state.delete, message: error.response.data.error
                        }
                    }))
                }
            })
    }
    edit = (id, data) => {
        axios.put(`${this.serverURl}/edit/${id}`, data, {
            headers: {
                "Authorization" : "Bearer " + this.user?.access_token
            }
        })
            .then(response => {
                // console.log(response, this.state);
                this.setState(state => ({
                    edit: {...state.edit, message: 'Changes saved', variant: 'success'}
                }))
            })
            .catch(error => {
                const data = error.response.data
                this.setState(state => ({
                    edit: {...state.edit, message: data.error || data.message, variant: 'danger'}
                }))
            })
    }
    add = (data) => {
        axios.post(`${this.serverURl}/add`, data, {
            headers: {
                "Authorization" : "Bearer " + this.user?.access_token
            }
        })
            .then(response => {
                console.log(response);
                this.state.banks.push(response.data);
                this.setState(state => ({
                    add: {...state.add, message: 'Bank added!', variant:'success'}
                }))
            })
            .catch(error => {
                console.error("error", error.response)
                if (error.response) {
                    console.log("response", error.response)
                    const data = error.response.data;
                    const message = data.message || data.error;
                    this.setState(state => ({
                        add: {...state.add, message, variant:'danger'}
                        })
                    )
                }
            })
    }

    componentDidMount() {
        axios.get(this.serverURl,{signal: this.abortController.signal})
            .then(data => {
                this.setState({
                    banks: data.data,
                })
            })
            .catch(error => console.error(error.response));
    }

    gotoPage = (number) => {
        this.setState(state => ({
            pages: {
                ...state.pages,
                active: number
            }
        }))
    }
    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        if(!this.user?.access_token) return (<Navigate to={'/login'} />) 
        const isEmpty = this.state.banks.length < 1;
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
                                ? <tr><td colSpan={5}>No Bank found</td></tr>
                                : activeBanks.map(bank => <Bank key={bank.id} {...bank} showModal={this.showModal} />)}  
                        </tbody>
                    </Table>
                    <MyPagination active={this.state.pages.active} go={this.gotoPage} number={noOfPage} />
                    <EditModal edit={this.state.edit} hideModal={this.hideModal} />
                    <DeleteModal delete={this.state.delete} hideModal={this.hideModal} />
                    <AddModal add={this.state.add} hideModal={this.hideModal}/>
                </Container>
            </BankContext.Provider>
            
        );
    }
}

export default Banks;