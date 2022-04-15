

const Response = (props) => {
    const timeFormat = (time) => {
        return new Intl.DateTimeFormat('en-GB', {dateStyle: 'short', timeStyle:'short'}).format(new Date(time));
    }

    const trace = props.trace;
    let className = ''
    switch (trace.response.status) {
        case 400:
            className = 'bg-primary text-white rounded px-1'
            break;
        case 200:
            className = 'bg-success text-white rounded px-1'
            break;
        case 404:
            className = 'bg-warning text-white rounded px-1'
            break;
        case 500:
            className = 'bg-danger text-white rounded px-1'
            break;
        default:
            className = 'bg-secondary text-white rounded px-1'
            break;
    }

    return ( 
        <tr>
            <td>{timeFormat(trace.timestamp)}</td>
            <td>{trace.request.method}</td>
            <td>{trace.timeTaken}</td>
            <td><span className={className}>{trace.response.status}</span></td>
            <td>{trace.request.uri}</td>
            <td>
                <span className="material-icons view" onClick={() => props.showModal(props.index)}>visibility</span>
            </td>
        </tr>
     );
}
 
export default Response;