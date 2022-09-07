import React from "react";
import Statuses from "./https_statuses";
import Charts from './charts';
import ResponseTable from "./response_table";
import SystemInfo from './system_info'
import axios from 'axios';
import { HttpTraces, SystemStatus } from "../../context/context";
import MyPagination from "./pagination";
import { SPINNERS_BORDER , timeFormat} from "../utilities";
import { Navigate } from 'react-router-dom';
import { CSVLink } from 'react-csv'
import NavBar from '../navbar';
import { Form } from "react-bootstrap";

class Admin extends React.Component{
    // context here
    constructor(props) {
        super(props)
        this.state = {
            systemInfo:{
                system: '', db: '', diskSpace: '', processor: '', upTime: ''
            },
            httpTraces: [],
            pageInfo: {
                number: 1, totalPages: 1, startCount: 1,
                endCount: null, totalElements: null, numberPerPage: 10
            },
            figures: {
                '_200': {
                    count: 0, time: ''
                },
                '_400': {
                    count: 0, time: ''
                },
                '_404': {
                    count: 0, time: ''
                },
                '_500': {
                    count: 0, time: ''
                },
                'default':{
                    count: 0, time: ''
                },
            },
            user: JSON.parse(sessionStorage.getItem("user")),
            loading: false,
        }
        this.serverUrl = process.env.REACT_APP_BANK_URL + "/actuator";
        this.handleURLChange = this.handleURLChange.bind(this);
        this.timer = 0;
        this.abortController = new AbortController();
        this.headers = [
            { label: "Timestamp", key:"timestamp"},
            { label: "Method", key:"request.method"},
            { label: "Time taken(ms)", key:"timeTaken"},
            { label: "Status", key:"response.status"},
            { label: "URI", key:"request.uri"}
        ]
    }

    getFigures() {
        return {
            '_200': {
                count: 0, time: ''
            },
            '_400': {
                count: 0, time: ''
            },
            '_404': {
                count: 0, time: ''
            },
            '_500': {
                count: 0, time: ''
            },
            'default':{
                count: 0, time: ''
            },
        }
    }

    fetchSystemInfo() {
        let data;
        axios.get(`${this.serverUrl}/health`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Client " + this.state.user?.access_token
            }
        })
        .then(response => { if (response) data = response.data
        })
        .catch(error => {
            const response = error?.response;
            if (response?.status === 503) data = response.data;
            if (response?.status === 406) this.setState(() => ({ user: { } } ))
        }) 
        .finally(() => {
            if (data) {
                this.setState(state => ({
                    systemInfo: {
                        ...state.systemInfo,
                        system: data.status,
                        db: `${data?.components.db.details.database} - ${data?.components.db.status}`,
                        diskSpace: data?.components.diskSpace.details.free
                    }
                }))
            }
        })
    }
    fetchTraces() {
        axios.get(`${this.serverUrl}/httptrace`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Client " + this.state.user?.access_token
                }
        })
        .then(response => {
            const figures = this.getFigures();
            const httpTraces = response.data.traces.reverse()
                .map(trace => {
                    switch (trace.response.status) {
                        case 200:
                            figures._200.count++;
                            figures._200.time = timeFormat(new Date(trace.timestamp))
                            break;
                        case 400:
                            figures._400.count++;
                            figures._400.time = timeFormat(new Date(trace.timestamp))
                            break;
                        case 404:
                            figures._404.count++;
                            figures._404.time = timeFormat(new Date(trace.timestamp))
                            break;
                        case 500:
                            figures._500.count++;
                            figures._500.time = timeFormat(new Date(trace.timestamp))
                            break;
                        default:
                            figures.default.count++;
                            figures.default.time = timeFormat(new Date(trace.timestamp))
                            break;
                    }
                    return {
                        ...trace,
                        timestamp: timeFormat(new Date(trace.timestamp))
                    }
                }).reverse();
            const { pageInfo } = this.state;
            const start = (pageInfo.numberPerPage * pageInfo.number) - pageInfo.numberPerPage;
            const end = (pageInfo.numberPerPage * pageInfo.number);
            this.setState(() => ({
                httpTraces, figures,
                pageInfo: {
                    number: 1,
                    totalPages: Math.ceil(httpTraces.length / pageInfo.numberPerPage),
                    startCount: start,
                    endCount: end,
                    totalElements: httpTraces.length,
                    numberPerPage: 10
                }
            }));
        })
        .catch(error => {
            const response = error?.response;
            if (response?.status === 406) this.setState(() => ({ user: { } } ))
        })
    }
    fetchCPUCount() {
        axios.get(`${this.serverUrl}/metrics/system.cpu.count`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Client " + this.state.user?.access_token
            }
        })
            .then(response => {
                const number = response.data?.measurements[0].value;
                this.setState(state => ({
                    systemInfo: {
                        ...state.systemInfo,
                        processor:number,
                    }
                }))
            })
            .catch(error => {
                if (error?.response?.status === 406) this.setState(() => ({ user: { } } ))
            })
    }
    fetchSystemUptime() {
        axios.get(`${this.serverUrl}/metrics/process.uptime`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Client " + this.state.user?.access_token
            }
        })
        .then(response => {
            const value = response?.data.measurements[0].value;
            this.setState(state => ({
                systemInfo: {
                    ...state.systemInfo,
                    upTime:value,
                }
            }))
            this.upTime()
        })
            .catch(error => {
                if (error?.response?.status === 406) this.setState(() => ({ user: { } } ))
            })
    }
    init() {
        this.setState({ loading: true })
        Promise.all([
            this.fetchSystemInfo(),
            this.fetchCPUCount(),
            this.fetchSystemUptime(),
            this.fetchTraces()])
        .finally(() => {this.setState({loading: false})});
    }
    gotoPage = (number) => {
        this.setState(s => {
            const start = (s.pageInfo.numberPerPage * number) - s.pageInfo.numberPerPage;
            const end = (s.pageInfo.numberPerPage * number);
            return  ({
            pageInfo: {
                ...s.pageInfo,
                number,
                startCount: start,
                endCount: end,
            }
        })})
    }
    refresh = (f) => {
        clearInterval(this.timer);
        this.init()
        f && f()
    }
    upTime() {
        this.timer = setInterval(() => {
            this.setState(state => ({
                systemInfo: {
                    ...state.systemInfo,
                    upTime: state.systemInfo.upTime + 1,
                }
            }))
        }, 1000)
    }
    handleURLChange(e) {
        this.serverUrl = e.target.value;
        this.refresh();
    }
    componentDidMount() {
        this.init()
    }
    componentWillUnmount() {
        this.abortController.abort();
        clearInterval(this.timer);
    }
    render() {
        if(!this.state.user?.access_token) return (<Navigate to={'/login'} />) 
        
        const { httpTraces, figures, pageInfo } = this.state;
        const activeTraces = httpTraces.slice(pageInfo.startCount, pageInfo.endCount);
        // csv report
        const report = {
            filename: "http_traces.csv",
            headers: this.headers,
            data: this.state.httpTraces, 
            className: 'btn btn-primary'
        }
        return (
            <>
                {
                    (this.state.loading)
                        ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                        : <React.Fragment>
                            <NavBar />
                            {/* NavDropdown */}
                            <div className="d-flex">
                                <Form.Select className="w-50" name="country" onChange={this.handleURLChange} >
                                    <option value={process.env.REACT_APP_BANK_URL + "/actuator"}>BANK</option>
                                    <option value={process.env.REACT_APP_COUNTRY_URL + "/actuator"}>COUNTRY</option>
                                </Form.Select>
                            </div>
                            
                            <SystemStatus.Provider value={this.state.systemInfo}>
                                <SystemInfo refresh={this.refresh}/>
                            </SystemStatus.Provider>
                            <Statuses figures={figures} />    
                            <Charts figures={figures} />
                            <HttpTraces.Provider value={activeTraces}>
                                <ResponseTable export={<CSVLink {...report}>Export to CSV</CSVLink>} />
                            </HttpTraces.Provider>
                            {/* pagination */}
                            <MyPagination pageInfo={this.state.pageInfo} go={this.gotoPage}/>
                        </React.Fragment>
                }
             </>
            
        );
    }
}

export default Admin;