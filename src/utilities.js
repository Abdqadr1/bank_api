export const timeFormat = (dateString) => {
        return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })
            .format(dateString);
}
    
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