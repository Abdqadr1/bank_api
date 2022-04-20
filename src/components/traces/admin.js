import React from "react";
import Statuses from "./https_statuses";
import Charts from './charts';
import ResponseTable from "./response_table";
import SystemInfo from './system_info'
import axios from 'axios';
import { HttpTraces, SystemStatus } from "../../context/context";
import MyPagination from "./pagination";
import {timeFormat} from '../../utilities'
import { Navigate } from 'react-router-dom';
import { CSVLink } from 'react-csv'
import NavBar from '../navbar';

class Admin extends React.Component{
    // context here
    constructor(props) {
        super(props)
        this.state = {
            systemInfo:{
                system: '', db: '', diskSpace: '', processor: '', upTime: ''
            },
            httpTraces: [],
            pages: {
                number: 10,
                active: 1
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
            }
        }
        this.serverUrl = process.env.REACT_APP_ACTUATOR;
        this.timer = 0;
        this.user = JSON.parse(localStorage.getItem("user"))
        this.abortController = new AbortController();
        this.headers = [
            { label: "Timestamp", key:"timestamp"},
            { label: "Method", key:"request.method"},
            { label: "Time taken(ms)", key:"timeTaken"},
            { label: "Status", key:"response.status"},
            { label: "URI", key:"request.uri"}
        ]
    }

    fetchSystemInfo() {
        let data;
        axios.get(`${this.serverUrl}/health`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Bearer " + this.user?.access_token
            }
        })
        .then(response => { if (response) data = response.data
        })
        .catch(error => {
            console.log(error.response)
            if (error.response.status === 503) data = error.response.data
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
                    "Authorization" : "Bearer " + this.user?.access_token
                }
        })
            .then(response => {
                const figures = this.state.figures;
                const httpTraces = response.data.traces.reverse()
                    .filter(trace => !trace.request.uri.includes('manage'))
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
                }).reverse()
                this.setState(() => ({ httpTraces, figures}))
        })
        .catch(error => console.log(error))
    }
    fetchCPUCount() {
        axios.get(`${this.serverUrl}/metrics/system.cpu.count`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Bearer " + this.user?.access_token
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
        .catch(error => console.log(error))
    }
    fetchSystemUptime() {
        axios.get(`${this.serverUrl}/metrics/process.uptime`, {
            signal: this.abortController.signal,
            headers: {
                    "Authorization" : "Bearer " + this.user?.access_token
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
        .catch(error => console.log(error))
    }
    init() {
        Promise.all([this.fetchSystemInfo(), this.fetchCPUCount(), this.fetchSystemUptime(), this.fetchTraces()])
    }
    gotoPage = (number) => {
        this.setState(state => ({
            pages: {
                ...state.pages,
                active: number
            }
        }))
    }
    refresh = (f) => {
        clearInterval(this.timer)
        this.init()
        f()
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
    componentDidMount() {
        this.init()
    }
    componentWillUnmount() {
        this.abortController.abort();
    }
    render() {
        if(!this.user?.access_token) return (<Navigate to={'/login'} />) 
        
        const {httpTraces, figures, pages} = this.state
        const noOfPage = Math.ceil(httpTraces.length / pages.number)
        const start = (pages.number * pages.active) - pages.number;
        const end = (pages.number * pages.active)
        const activeTraces = httpTraces.slice(start, end)
        // csv report
        const report = {
            filename: "http_traces.csv",
            headers: this.headers,
            data: this.state.httpTraces, 
            className: 'btn btn-primary'
        }
        return (
            <React.Fragment>
                <NavBar />
                <SystemStatus.Provider value={this.state.systemInfo}>
                    <SystemInfo refresh={this.refresh}/>
                </SystemStatus.Provider>
                <Statuses figures={figures} />    
                <Charts figures={figures} />
                <HttpTraces.Provider value={activeTraces}>
                    <ResponseTable export={<CSVLink {...report}>Export to CSV</CSVLink>} />
                </HttpTraces.Provider>
                {/* pagination */}
                <MyPagination active={this.state.pages.active} go={this.gotoPage} number={noOfPage}/>
            </React.Fragment>
        );
    }
}

export default Admin;