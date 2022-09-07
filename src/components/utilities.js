
import { Spinner } from "react-bootstrap";
export const timeFormat = (dateString) => {
        dateString = dateString instanceof Date ? dateString : new Date(dateString)
        return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })
            .format(dateString);
}

export const isOffline = () => !navigator.onLine;

export const isTimeout = code => code && code === "ECONNABORTED";
    
 export const formatBytes = (size) => {
        if (size === 0) return "0 Byte";
        const k = 1023;
        const dm = 2 < 0 ? 0 : 2
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(size) / Math.log(k))
        return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
    
 export const formatUpTime = (timestamp) =>  {
        timestamp = Math.round(timestamp)
        const hours = Math.floor(timestamp / 60 / 60)
        const minutes = Math.floor(timestamp / 60) - (hours * 60)
        const seconds = timestamp % 60
        return hours.toString().padStart(2, '0') + 'h' + minutes.toString().padStart(2, '0') + 'm'
            +  seconds.toString().padStart(2, '0') + 's'
}

export function listFormData(data){
    if(!process.env.NODE_ENV || process.env.NODE_ENV === "development"){
        for (const pair of data.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
    }
      
}
export const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-dark" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SPINNERS_BORDER = <Spinner animation="border" size="sm" className="d-block m-auto" style={{ width: "4rem", height: "4rem" }} />

export const useThrottle = (cb, delay) => {
    let shouldWait = false;
    let waitArgs = null;
    let setTimeoutFunc = () => {
        if (waitArgs == null) {
            shouldWait = false;
        }else {
            cb(...waitArgs);
            waitArgs = null;
            setTimeout(setTimeoutFunc, delay);
        }
    };

    return (...args) => {
      if(shouldWait) {
        waitArgs = args
        return;
      }
      cb(...args)
      shouldWait = true;
      setTimeout(setTimeoutFunc, delay)
    };
}
