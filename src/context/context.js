import React from "react";
export const BankContext = React.createContext({
    banks: [],
    addBank: () => { },
    deleteBank: () => { },
    editBank: () => {}
});

export const SystemStatus = React.createContext({
    system: '', db: '', diskSpace: '', processor: '', upTime: ''
})

export const HttpTraces = React.createContext({})
