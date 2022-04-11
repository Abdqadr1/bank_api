const Response = (props) => {
    return ( 
        <tr>
            <td>JULY 28, 2022 10:56:23 PM</td>
            <td>GET</td>
            <td>44</td>
            <td><span className="bg-success text-white rounded px-1">200</span></td>
            <td>http://localhost:8080/bank_api</td>
            <td>
                <span className="material-icons view" onClick={props.showModal}>visibility</span>
            </td>
        </tr>
     );
}
 
export default Response;