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
               user: localStorage.getItem("user")
           }
        this.serverUrl = process.env.REACT_APP_ACTUATOR;
        this.timer = 0;
        this.abortController = new AbortController();
    }

    fetchSystemInfo() {
        let data;
        axios.get(`${this.serverUrl}/health`, { signal: this.abortController.signal })
            .then(response => {if (response) data = response.data})
            .catch(error => { if (error.response) data = error.response.data})
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
        axios.get(`${this.serverUrl}/httptrace`, {signal: this.abortController.signal})
            .then(response => {
                this.setState(() => ({
                    httpTraces: response.data.traces.reverse()
                }))
            })
            .catch(error => console.log(error))
    }
    fetchCPUCount() {
         axios.get(`${this.serverUrl}/metrics/system.cpu.count`, {signal: this.abortController.signal})
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
         axios.get(`${this.serverUrl}/metrics/process.uptime`, {signal: this.abortController.signal})
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
        const user = JSON.parse(this.state.user);
        if(!user?.access_token) return (<Navigate to={'/login'} />) 
        const figures = {
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
        this.state.httpTraces.forEach(trace => {
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
        })
        const noOfPage = Math.ceil(this.state.httpTraces.length / this.state.pages.number)
        const start = (this.state.pages.number * this.state.pages.active) - this.state.pages.number;
        const end = (this.state.pages.number * this.state.pages.active)
        const activeTraces = this.state.httpTraces.slice(start, end)
        return (
            <React.Fragment>
                <SystemStatus.Provider value={this.state.systemInfo}>
                    <SystemInfo refresh={this.refresh}/>
                </SystemStatus.Provider>
                <Statuses figures={figures} />    
                <Charts figures={figures} />
                <HttpTraces.Provider value={activeTraces}>
                    <ResponseTable />
                </HttpTraces.Provider>
                {/* pagination */}
                <MyPagination active={this.state.pages.active} go={this.gotoPage} number={noOfPage}/>
            </React.Fragment>
        );
    }
}

export default Admin;