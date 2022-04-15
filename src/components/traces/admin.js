import React from "react";
import Statuses from "./https_statuses";
import Charts from './charts';
import ResponseTable from "./response_table";
import SystemInfo from './system_info'
import axios from 'axios';
import { HttpTraces, SystemStatus } from "../../context/context";

class Admin extends React.Component{
    // context here
    constructor(props) {
        super(props)
           this.state = {
               systemInfo:{
                    system: '', db: '', diskSpace: '', processor: '', upTime: ''
                },
               httpTraces: []
           }
        this.serverUrl = process.env.REACT_APP_ACTUATOR
    }

    timeFormat(dateString) {
        return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })
            .format(dateString);
    }

    fetchSystemInfo() {
        axios.get(`${this.serverUrl}/health`)
            .then(response => console.log(response))
            .catch(error => console.error(error.response))
    }

    fetchTraces() {
        axios.get(`${this.serverUrl}/httptrace`)
            .then(response => {
                this.setState(() => ({
                    httpTraces: response.data.traces
                }))
            })
            .catch(error => console.error(error.response))
    }

    refresh = () => {
        console.log("refreshing...")
    }

    componentDidMount() {
        this.fetchSystemInfo();
        this.fetchTraces();
    }

    render() {
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
        this.state.httpTraces.reverse().forEach(trace => {
            switch (trace.response.status) {
                case 200:
                    figures._200.count++;
                    figures._200.time = this.timeFormat(new Date(trace.timestamp)) 
                    break;
                case 400:
                    figures._400.count++;
                    figures._400.time = this.timeFormat(new Date(trace.timestamp)) 
                    break;
                case 404:
                    figures._404.count++;
                    figures._404.time = this.timeFormat(new Date(trace.timestamp)) 
                    break;
                case 500:
                    figures._500.count++;
                    figures._500.time = this.timeFormat(new Date(trace.timestamp)) 
                    break;
                default:
                    figures.default.count++;
                    figures.default.time = this.timeFormat(new Date(trace.timestamp)) 
                    break;
            }
        })
        console.log(this.state.httpTraces)
        return (
            <React.Fragment>
                <SystemStatus.Provider value={this.state.systemInfo}>
                    <SystemInfo refresh={this.refresh}/>
                </SystemStatus.Provider>
                <Statuses figures={figures} />    
                <Charts figures={figures} />
                <HttpTraces.Provider value={this.state.httpTraces}>
                    <ResponseTable />
                </HttpTraces.Provider>
                
            </React.Fragment>
        );
    }
}

export default Admin;