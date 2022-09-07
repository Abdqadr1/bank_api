import { Navigate } from "react-router-dom";

const Logout = () => {

    sessionStorage.clear();

    return ( 
        <Navigate to={'/login'} />
     );
}
 
export default Logout;