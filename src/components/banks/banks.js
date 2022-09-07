import React from 'react';
import axios from "axios";
import Table from "react-bootstrap/Table";
import Bank from './bank';
import Container from 'react-bootstrap/Container';
import AddBank from './addBank'
import NavBar from '../navbar';
import MyPagination from '../traces/pagination';
import { Navigate } from 'react-router-dom';
import { isTimeout, SPINNERS_BORDER, useThrottle } from '../utilities';
import EditModal from './edit_bank';
import AddModal from './add_bank';
import DeleteModal from '../delete_modal';
import MessageModal from "../message_modal"

class Banks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            banks: [],
            countries: [],
            edit: {show: false,bank: {}},
            delete: {show: false,id: 0 },
            add: false,
            pageInfo: {
                number: 1, totalPages: 1, startCount: 1,
                endCount: null, totalElements: null, numberPerPage: 1
            },
            user: JSON.parse(sessionStorage.getItem('user')),
            loading: true,
            messageModal: { show: false, title: "", message: "" },
            width: window.innerWidth
        };
        this.serverURL = process.env.REACT_APP_BANK_URL;
        this.countryURL = process.env.REACT_APP_COUNTRY_URL;
        this.abortController = new AbortController();
        this.updateEnabled = this.updateEnabled.bind(this);
        this.fetchBanks = this.fetchBanks.bind(this);
        this.searchBanks = this.searchBanks.bind(this);
        this.delete = this.delete.bind(this);
        this.handleWindowWidthChange = this.handleWindowWidthChange.bind(this);
    }

    showModal = (which, id) => {
        if (which === "edit") {
            const bank = this.state.banks.find(b => b.id === id);
            this.setState( state => ({
                    edit: {show:true, bank}
                })
            )
        }
        if (which === "delete") {
            this.setState( state => ({
                    delete: {show:true, id}
                })
            )
        }
        if (which === "add") {
            this.setState( state => ({
                    add: true
                })
            )
        }
    }
    hideModal = (which) => {
        if (which === "edit") {
            this.setState(s => ({...s, edit : {...s.edit, show:false}}))
        }
        if (which === "delete") {
            this.setState(s => ({...s, delete : {...s.delete, show:false}}))
        }
        if (which === "add") {
            this.setState(state => ( { add: false }  ))
        }
        if (which === "message") {
            this.setState(s => ({messageModal:{...s.messageModal, show:false}}))
        }
    }
    delete = (id, cb) =>  {
        axios.delete(`${this.serverURL}/admin/delete/${id}`, {
            headers: {
                "Authorization": "Client " + this.state.user?.access_token
            },
            timeout: 90000,
            signal: this.abortController.signal
        })
            .then(() => {
                this.setState(state => ({
                    banks: state.banks.filter(bank => bank.id !== id)
                }));
                this.setState(s => ({
                    messageModal: {
                        ...s.messageModal, show: true,
                        title: "Delete Bank", message: "Bank deleted"
                    }
                }))
            })
            .catch(error => {
                const response = error?.response;
                if (response?.status === 406) this.setState(() => ({ user: {} }));
                let message = response?.data?.message ?? "Could not delete bank";
                if (isTimeout(error?.code)) {
                    message = "timeout, check your internet connection";
                }
                this.setState(s => ({
                    messageModal: {
                        ...s.messageModal, show: true, title: "Delete Bank", message
                    }
                }))
            }).finally(() => {
                this.setState({ delete: { show: false, id: -1 }})
                cb();
            });
    }
    edit = (bank) => {
        const banks = this.state.banks;
        const index = banks.findIndex(b => b.id === bank.id);
        banks[index] = bank;
        this.setState(s => ({...s, banks: [...s.banks]}))
    }
    add = (bank) => {
       this.setState(s => ({...s, banks: [...s.banks, bank]}))
    }

    handleWindowWidthChange = useThrottle(() => this.setState({width: window.innerWidth}), 500)

    componentDidMount() {
        window.addEventListener("resize", this.handleWindowWidthChange);
        this.fetchBanks(1);
    }

    fetchCountries() {
        if (this.state.countries.length < 1) {
            const countryUrl = this.countryURL + "/all";
            this.setState(s => ({ loading: true }));
            axios.get(countryUrl,{
                timeout: 90000,
                signal: this.abortController.signal,
                headers: {
                    "Authorization" : `Client ${this.state.user?.access_token}`
                }
            })
                .then(res => {
                    const data = res.data;
                    this.setState({ countries: data });
            })
            .catch(error => {
                if (isTimeout(error?.code)) {
                    alert("timeout, check your internet connection");
                }
                if (error?.response?.status === 406) this.setState(() => ({ user: { } } ))
            })
            .finally(() => {
                this.setState(s => ({loading: false}))
            })
        }
    }

    fetchBanks(pageNumber, keyword) {
        this.setState(s => ({ loading: true }));
        keyword = keyword ?? this.state.keyword;
        const url = `${this.serverURL}/admin/page/${pageNumber}?keyword=${keyword}`;
         axios.get(url,{
            headers: {
                "Authorization": "Client " + this.state.user?.access_token
             },
            timeout: 90000,
            signal: this.abortController.signal
         })
             .then(res => {
                const data = res.data;
                 this.setState(s => ({
                     banks: data.banks,
                     pageInfo: {
                         endCount: data.endCount,
                         startCount: data.startCount,
                         totalPages: data.totalPages,
                         totalElements: data.totalElements,
                         numberPerPage: data.numberPerPage,
                         number: data.currentPage
                     }
                 }));
                 this.fetchCountries();
            })
             .catch(error => {
                if (isTimeout(error?.code)) {
                    alert("timeout, check your internet connection");
                }
                if (error?.response?.status === 406) this.setState(() => ({ user: { } } ))
            })
            .finally(() => {
                this.setState(s => ({loading: false}))
            })
    }

    searchBanks(keyword) {
        this.setState({ keyword });
        this.fetchBanks(1, keyword);
    }

    updateEnabled(id, status) {
        this.setState({ loading: true });
        const url = `${this.serverURL}/admin/enabled/${id}/${status}`;
        axios.get(url,{
            headers: {
                "Authorization" : "Client " + this.state.user?.access_token
            },
            signal: this.abortController.signal
        })
            .then(() => {
                const banks = this.state.banks;
                const index = banks.findIndex(b => b.id === id);
                banks[index].enabled = status;
                this.setState(s => ({ ...s, banks: [...s.banks] }))
                const message = "Bank " + (status ? 'enabled' : 'disabled');
                this.setState(s => ({messageModal:{...s.messageModal, show:true, title:"Enable Bank", message}}))
            })
            .catch(error => {
                if (error?.response?.status === 406) this.setState(() => ({ user: {} }));
                this.setState(s => ({messageModal:{...s.messageModal, show:true, title:"Enable Bank", message: "An error occurred"}}))
            })
            .finally(() => {
                this.setState(s => ({loading: false}))
            })
    }
    componentWillUnmount() {
        this.abortController.abort();
        window.removeEventListener("resize", this.handleWindowWidthChange)
    }

    listBanks(banks, type) {
        return (banks.length > 0)
            ? banks.map(bank => <Bank key={bank.id} viewType={type} {...bank} showModal={this.showModal}
                            updateStatus={this.updateEnabled} />)
            : ((type === 'detailed')
                ? <tr><td colSpan={7} className="text-center">No Bank found</td></tr>
                : <div className="text-center my-3 fw-bold">No Bank found</div>)
    }

    render() {
        if(!this.state.user?.access_token) return (<Navigate to={'/login'} />) 
        return (
            <>
                {
                    (this.state.loading)
                        ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                        :
                        <React.Fragment>
                            <NavBar />
                            <AddBank showModal={this.showModal} search={this.searchBanks} word={this.state.keyword} />
                            <Container>
                                {
                                    (this.state.width >= 769)
                                    ? 
                                        <Table striped bordered hover size="sm">
                                            <thead className="bg-light text-dark">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Alias</th>
                                                    <th className="d-md-none d-lg-block">Type</th>
                                                    <th>Code</th>
                                                    <th className="d-md-none d-lg-block">Long Code</th>
                                                    <th>Enabled</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className='border-top-0'>
                                                {this.listBanks(this.state.banks, 'detailed')}
                                            </tbody>
                                        </Table>
                                    
                                    : this.listBanks(this.state.banks, 'less')
                                }
                                <MyPagination pageInfo={this.state.pageInfo} go={this.fetchBanks} />
                                <AddModal countries={this.state.countries} show={this.state.add} hideModal={this.hideModal}
                                    addBank={this.add} token={this.state.user?.access_token} />
                                <EditModal countries={this.state.countries} edit={this.state.edit} hideModal={this.hideModal}
                                    editBank={this.edit} token={this.state.user?.access_token} />
                                <DeleteModal obj={this.state.delete} hideModal={this.hideModal} deleteBank={this.delete} />
                                <MessageModal obj={this.state.messageModal} hideModal={this.hideModal} />
                            </Container>
                        </React.Fragment>
                }
                
            </>
            
        );
    }
}

export default Banks;