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


const loading = `<div class="spinner-grow spinner-grow-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`;

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
            user: JSON.parse(localStorage.getItem('user'))
        };
        this.serverURl = process.env.REACT_APP_SERVER_URL;
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
    delete = (id, button) =>  {
        button.innerHTML = loading;
        button.disabled = true;
        axios.delete(`${this.serverURl}/delete/${id}`, {
            headers: {
                "Authorization" : "Bearer " + this.state.user?.access_token
            }
        })
            .then(() => { 
                this.setState(state => ({
                    banks: state.banks.filter(bank => bank.id !== id),
                    delete: {bool:false, id: 0}
                }))
                button.innerHTML = "Delete";
                button.disabled = false;
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 406) this.setState(() => ({ user: {} }))
                    else {
                        this.setState(state => ({
                            delete: {...state.delete, message: error.response.data.error
                            }
                        }))
                    }
                    
                }
                button.innerHTML = "Delete";
                button.disabled = false;
            })
    }
    edit = (id, data, button) => {
        button.innerHTML = loading;
        button.disabled = true;
        axios.put(`${this.serverURl}/edit/${id}`, data, {
            headers: {
                "Authorization" : "Bearer " + this.state.user?.access_token
            }
        })
            .then(() => {
                this.setState(state => ({
                    edit: {...state.edit, message: 'Changes saved', variant: 'success'}
                }))
                
                button.innerHTML = "Save Changes";
                button.disabled = false;
            })
            .catch(error => {
                const data = error.response.data
                if (error.response.status === 406) this.setState(() => ({ user: {} }))
                else {
                    this.setState(state => ({
                        edit: {...state.edit, message: data.error || data.message, variant: 'danger'}
                    }))
                }
                button.innerHTML = "Save Changes";
                button.disabled = false;
            })
    }
    add = (data, button) => {
        button.innerHTML = loading;
        button.disabled = true;
        axios.post(`${this.serverURl}/add`, data, {
            headers: {
                "Authorization" : "Bearer " + this.state.user?.access_token
            }
        })
            .then(response => {
                this.state.banks.push(response.data);
                this.setState(state => ({
                    add: {...state.add, message: 'Bank added!', variant:'success'}
                }))
                button.innerHTML = "Add Bank";
                button.disabled = false;
            })
            .catch(error => {
                console.error("error", error.response)
                if (error.response) {
                    if (error.response.status === 406) this.setState(() => ({ user: {} }))
                    else {
                        const data = error.response.data;
                        const message = data.message || data.error;
                        this.setState(state => ({
                            add: {...state.add, message, variant:'danger'}
                            })
                        )
                    }
                   
                }
                button.innerHTML = "Add Bank";
                button.disabled = false;
            })
    }

    componentDidMount() {
        axios.get(this.serverURl+"/",{signal: this.abortController.signal})
            .then(data => {
                this.setState({
                    banks: data.data,
                })
            })
            .catch(error => {
                if (error?.response?.status === 406) this.setState(() => ({ user: { } } ))
            });
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
        if(!this.state.user?.access_token) return (<Navigate to={'/login'} />) 
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
                        <tbody className='border-top-0'>
                            {isEmpty 
                                ? <tr><td colSpan={5} className="text-center">No Bank found</td></tr>
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