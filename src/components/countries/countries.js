import React from 'react';
import axios from "axios";
import Country from './country';
import NavBar from '../navbar';
import MyPagination from '../traces/pagination';
import { Navigate } from 'react-router-dom';
import { SPINNERS_BORDER,isTimeout } from '../utilities';
import AddEditModal from './add_update';
import DeleteModal from '../delete_modal';
import MessageModal from "../message_modal"
import { Row, Col, Form, Table, Container, Button } from 'react-bootstrap';

class Countries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            countries: [],
            add_edit: {show: false,country: {}},
            delete: {show: false,id: 0 },
            pageInfo: {
                number: 1, totalPages: 1, startCount: 1,
                endCount: null, totalElements: null, numberPerPage: 1
            },
            user: JSON.parse(sessionStorage.getItem('user')),
            loading: true,
            messageModal: { show: false, title: "", message: "" },
            width: window.innerWidth
        };
        this.serverURl = process.env.REACT_APP_COUNTRY_URL;
        this.abortController = new AbortController();
        this.fetchCountries = this.fetchCountries.bind(this);
        this.searchBanks = this.searchBanks.bind(this);
        this.delete = this.delete.bind(this);
        this.clearKeyword = this.clearKeyword.bind(this);
    }

    showModal = (which, id) => {
        if (which === "edit" || which === "add") {
            let country = {};
            if(id) country = this.state.countries.find(b => b.id === id);
            this.setState({ add_edit: {show:true, country, which} })
        }
        if (which === "delete") {
            this.setState( state => ({
                    delete: {show:true, id}
                })
            )
        }
    }
    hideModal = (which) => {
        if (which === "edit" || which === "add") {
            this.setState(s => ({...s, add_edit : {...s.add_edit, show:false}}))
        }
        if (which === "delete") {
            this.setState(s => ({...s, delete : {...s.delete, show:false}}))
        }
        if (which === "message") {
            this.setState(s => ({messageModal:{...s.messageModal, show:false}}))
        }
    }
    delete = (id, cb) =>  {
        axios.delete(`${this.serverURl}/admin/delete/${id}`, {
            headers: {
                "Authorization": "Client " + this.state.user?.access_token
            },
            timeout: 90000,
            signal: this.abortController.signal
        })
            .then(() => {
                this.setState(state => ({
                    countries: state.countries.filter(country => country.id !== id)
                }));
                this.setState(s => ({
                    messageModal: {
                        ...s.messageModal, show: true,
                        title: "Delete Country", message: "Country deleted"
                    }
                }))
            })
            .catch(error => {
                const response = error?.response;
                if (response?.status === 406) this.setState(() => ({ user: {} }));
                let message = response?.data?.message ?? "Could not delete country";
                if (isTimeout(error?.code)) {
                    message = "timeout, check your internet connection";
                }
                this.setState(s => ({
                    messageModal: {
                        ...s.messageModal, show: true, title: "Delete Country", message
                    }
                }))
            }).finally(() => {
                this.setState({ delete: { show: false, id: -1 }})
                cb();
            });
    }
    addEdit = (country, type) => {
        if (type === "edit") {
            const countries = this.state.countries;
            const index = countries.findIndex(b => b.id === country.id);
            countries[index] = country;
            this.setState(s => ({ ...s, countries: [...s.countries] }));
            return;
        }
        this.setState(s => ({...s, countries: [...s.countries, country]}))
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleWindowWidthChange);
        this.fetchCountries(1);
    }

    fetchCountries(pageNumber, keyword) {
        keyword = keyword ?? this.state.keyword;
        this.setState(s => ({ loading: true }));
        const url = `${this.serverURl}/admin/page/${pageNumber}?keyword=${keyword}`;
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
                     countries: data.countries,
                     pageInfo: {
                         endCount: data.endCount,
                         startCount: data.startCount,
                         totalPages: data.totalPages,
                         totalElements: data.totalElements,
                         numberPerPage: data.numberPerPage,
                         number: data.currentPage
                     }
                 }));
            })
            .catch(error => {
                if (error?.response?.status === 406) this.setState(() => ({ user: {} }))
                if (isTimeout(error?.code)) {
                    alert("timeout, check your internet connection");
                }
            })
            .finally(() => {
                this.setState(s => ({loading: false}))
            })
    }

    searchBanks(e) {
        e.preventDefault();
        this.fetchCountries(1);
    }
    clearKeyword() {
        this.setState({keyword: ""})
        this.fetchCountries(1, "")
    }

    componentWillUnmount() {
        this.abortController.abort();
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
                            <Container>
                                <>
                                    <Row className="justify-content-start my-3">
                                        <Col xs={11} md={4}>
                                            <span className="material-icons fs-1 text-secondary" onClick={() => this.showModal("add")}>
                                                note_add
                                            </span>
                                        </Col>
                                        <Col xs={11} md={8}>
                                            <Form className="d-flex flex-wrap justify-content-center" onSubmit={this.searchBanks}>
                                                <div className="mt-2 col-md-7 col-11">
                                                <Form.Control value={this.state.keyword} onChange={e=>this.setState({keyword: e.target.value})} placeholder="Enter keyword"
                                                    required minLength="2" /> 
                                                </div>
                                                <div className="mt-2 col-md-5 col-11 ps-2">
                                                    <Button variant="primary" className="mx-1" type="submit" alt="search">
                                                        <span title="Search keyword" className="material-icons fs-6 mb-0"> search </span>
                                                    </Button>
                                                    <Button onClick={this.clearKeyword} variant="secondary" className="mx-1" type="button" alt="clear search">
                                                        <span title="clear keyword" className="material-icons fs-6 mb-0"> clear_all </span>
                                                    </Button>  
                                                </div>
                                                
                                            </Form>
                                        
                                        </Col>
                                    </Row>
                                    <Table striped bordered hover size="sm">
                                        <thead className="bg-light text-dark">
                                            <tr>
                                                <th>Name</th>
                                                <th className="d-none d-md-table-cell">Country Code</th>
                                                <th>Call Code</th>
                                                <th className="d-none d-md-table-cell">Continent</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='border-top-0'>
                                            {
                                                (this.state.countries.length > 0)
                                                    ? this.state.countries.map(country => <Country key={country.id} {...country} showModal={this.showModal} />)
                                                    : <tr><td colSpan={5} className="text-center">No Country found</td></tr>
                                            }
                                        </tbody>
                                    </Table>
                                </>
                                <MyPagination pageInfo={this.state.pageInfo} go={this.fetchCountries} />
                                <AddEditModal add_edit={this.state.add_edit} hideModal={this.hideModal}
                                    addEditCountry={this.addEdit} token={this.state.user?.access_token} />
                                <DeleteModal obj={this.state.delete} hideModal={this.hideModal} deleteBank={this.delete} />
                                <MessageModal obj={this.state.messageModal} hideModal={this.hideModal} />
                            </Container>
                        </React.Fragment>
                }
                
            </>
            
        );
    }
}

export default Countries;