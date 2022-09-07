import '../../css/pagination.css'
import { Pagination } from 'react-bootstrap'

const MyPagination = ({ pageInfo, go }) => {
    let currentPage = pageInfo.number;
    const maxPageShown = pageInfo.totalPages > 25 ? 25 : pageInfo.totalPages;
    const isPrev = currentPage <= 1
    const isNext = currentPage >= pageInfo.totalPages;

    const items = [];
    for (let i = 1; i <= maxPageShown; i++){
        items.push(
            <Pagination.Item onClick={() => go(i)} key={i} active={(i) === currentPage}>
                {i}
            </Pagination.Item>
        )
    }

    return ( 
        <Pagination className="flex-wrap mt-2 justify-content-center mx-0">    
            {/* <Pagination.First /> */}
            <Pagination.Prev onClick={() => go(currentPage - 1)} disabled={isPrev} />
            {items}
            <Pagination.Next onClick={() => go(currentPage + 1)} disabled={isNext} />
            {/* <Pagination.Last /> */}
        </Pagination>
     );
}
 
export default MyPagination;