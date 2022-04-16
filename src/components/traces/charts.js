import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Pie} from 'react-chartjs-2';
const Charts = (props) => {
    const pieRef = useRef();
    const chartRef = useRef()
    const figures = props.figures

    ChartJS.register(...registerables);

    const barData = {
        labels: ['200 Response', '400 Response', '404 Response', '500 Response ', 'Others'],
        datasets: [{
            label: 'HTTP TRACE',
            data: [
            figures._200.count,figures._400.count,figures._404.count, figures._500.count, figures.default.count
            ],
            backgroundColor: [
                '#198754',
                '#ffc107',
                '#0d6efd',
                '#dc3545','#6c757d'
            ],
            borderWidth: 1
        }],
    }
    const barOptions = {
        responsive: false,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: `Last 100 Request as of ${new Date().toDateString()}`,
            },
        },
        };


    return ( 
        <Container className='py-4'>
            <Row className="justify-content-between">
                <Col className='text-start'>
                    <div>HTTP RESPONSE</div>
                    <Bar 
                        width={300}
                        height={300}
                        options={barOptions}
                        ref={chartRef}
                        data={barData}
                        />
                </Col>
                <Col className='text-start d-flex justify-content-end'>
                    <div>HTTP RESPONSE</div>
                    <Pie 
                        width={300}
                        height={300}
                        options={barOptions}
                        ref={pieRef}
                        data={barData}
                        />
                </Col>
            </Row>
        </Container>
        
     );
}
 
export default Charts;