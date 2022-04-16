import '../../css/pagination.css'
import { Pagination } from 'react-bootstrap'

const MyPagination = (props) => {
    const noOfPage = props.number;
    const active = props.active
    const goto = (to) => {
        if(to !== active) props.go(to);
    }
    return ( 
        <Pagination className='pages'>
              {[...Array(noOfPage)].map((x, i) =>
                  <Pagination.Item key={i} onClick={() => goto(i + 1)} active={(i+1) === active}>
                      {i + 1}
                  </Pagination.Item>
            )}  
        </Pagination>
     );
}
 
export default MyPagination;