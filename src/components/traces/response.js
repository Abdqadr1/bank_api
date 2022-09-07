
const Response = (props) => {

    const trace = props.trace;
    let className = ''
    switch (trace.response.status) {
        case 400:
            className = 'bg-warning text-white rounded px-1'
            break;
        case 200:
            className = 'bg-success text-white rounded px-1'
            break;
        case 404:
            className = 'bg-primary text-white rounded px-1'
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
            <td className="d-none d-lg-table-cell">{trace.timestamp}</td>
            <td className="d-none d-md-table-cell">{trace.request.method}</td>
            <td className="d-none d-lg-table-cell">{trace.timeTaken}</td>
            <td className="d-none d-lg-table-cell"><span className={className}>{trace.response.status}</span></td>
            <td>{trace.request.uri}</td>
            <td>
                <span className="material-icons view" onClick={() => props.showModal(props.index)}>visibility</span>
            </td>
        </tr>
     );
}
 
export default Response;