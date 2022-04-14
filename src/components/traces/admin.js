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

    fetchSystemInfo() {
        axios.get(`${this.serverUrl}/health`)
            .then(response => console.log(response))
            .catch(error => console.error(error.response))
    }

    fetchTraces() {
        axios.get(`${this.serverUrl}/httptrace`)
            .then(response => console.log("traces", response))
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
            '_200': 0,
            '_400': 0,
            '_404': 0,
            '_500': 0,
        }

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