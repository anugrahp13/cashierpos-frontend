//import useState and useEffect
import { useState, useEffect } from 'react';

//import layout admin
import LayoutAdmin from "../../layouts/admin";

//import service api
import Api from "../../services/api";

//import js cookie
import Cookies from 'js-cookie';

//import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

//import chart apex
import ApexCharts from "apexcharts";

export default function Dashboard() {

  //state sales
  const [countSalestoday, setCountSalestoday] = useState(0);
  const [sumSalestoday, setSumSalestoday] = useState(0);
  const [sumSalesWeek, setSumSalesWeek] = useState(0);
  const [salesDate, setSalesDate] = useState([]);
  const [salesTotal, setSalesTotal] = useState([]);

  //state profits
  const [sumProfitsToday, setSumProfitsToday] = useState(0);
  const [sumProfitsWeek, setSumProfitsWeek] = useState(0);
  const [profitsDate, setProfitsDate] = useState([]);
  const [profitsTotal, setProfitsTotal] = useState([]);

  //function fetch data dashboard
  const fetchData = async () => {

    //get token from cookies
    const token = Cookies.get("token");

    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      try {

        //fetch data from API with Axios
        const response = await Api.get("/api/dashboard");

        //assign response data to state "countSalestoday", "sumSalestoday", "sumSalesWeek", "salesDate", "salesTotal"
        setCountSalestoday(response.data.data.count_sales_today);
        setSumSalestoday(response.data.data.sum_sales_today);
        setSumSalesWeek(response.data.data.sum_sales_week);
        setSalesDate(response.data.data.sales.sales_date);
        setSalesTotal(response.data.data.sales.sales_total);

        //assign response data to state "sumProfitsToday", "sumProfitsWeek", "profitsDate", "profitsTotal"
        setSumProfitsToday(response.data.data.sum_profits_today);
        setSumProfitsWeek(response.data.data.sum_profits_week);
        setProfitsDate(response.data.data.profits.profits_date);
        setProfitsTotal(response.data.data.profits.profits_total);

      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    } else {
      console.error("Token is not available!");
    }
  };

  //hook useEffect
  useEffect(() => {

    //call function "fetchData"
    fetchData();
  }, []);

  // Function to initialize a chart
  const initializeChart = (elementId, chartOptions) => {
    const chart = new ApexCharts(document.getElementById(elementId), chartOptions);
    chart.render();

    return chart;
  };

  // Common chart options
  const commonChartOptions = {
    fontFamily: 'inherit',
    animations: { enabled: false },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    tooltip: { theme: 'dark' },
    xaxis: {
      labels: { padding: 0 },
      tooltip: { enabled: false },
      axisBorder: { show: false },
      type: 'datetime',
    },
    yaxis: { labels: { padding: 4 } },
    colors: ['#206bc4'], // Set the color according to your theme
    legend: { show: false },
  };

  // Effect to initialize charts when data changes
  useEffect(() => {

    const salesChart = initializeChart('chart-sales', {
      ...commonChartOptions,
      chart: { type: "area", height: 40.0, sparkline: { enabled: true } },
      fill: { opacity: .16, type: 'solid' },
      stroke: { width: 2, lineCap: "round", curve: "smooth" },
      series: [{
        name: "Sales",
        data: salesTotal,
      }],
      labels: salesDate,
    });

    const profitsChart = initializeChart('chart-profits', {
        ...commonChartOptions,
        chart: { type: "bar", height: 40.0, sparkline: { enabled: true } },
        plotOptions: { bar: { columnWidth: '50%' } },
        series: [{
          name: "Profits",
          data: profitsTotal,
        }],
        labels: profitsDate,
      });

    // Cleanup charts on component unmount
    return () => {
      salesChart.destroy();
      profitsChart.destroy();
    };
  }, [salesDate, salesTotal, profitsDate, profitsTotal]);

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">
                HALAMAN
              </div>
              <h2 className="page-title">
                DASHBOARD
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Sales Today</div>
                  </div>
                  <div className="h1 mb-2">{countSalestoday}</div>
                  <hr className='mb-2 mt-1' />
                  <div className="h1 mb-0 me-2">{moneyFormat(sumSalestoday)}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center ">
                    <div className="subheader">Profits Today</div>
                  </div>
                  <div className="h1 mb-0 me-2 mt-4">{moneyFormat(sumProfitsToday)}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">SALES</div>
                    <div className="ms-auto lh-1">
                      <span className="text-end active" href="#">Last 7 days</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">{moneyFormat(sumSalesWeek)}</div>
                  </div>
                </div>
                <div id="chart-sales" className="chart-sm"></div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">PROFITS</div>
                    <div className="ms-auto lh-1">
                      <span className="text-end active" href="#">Last 7 days</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-3 me-2">{moneyFormat(sumProfitsWeek)}</div>
                  </div>
                  <div id="chart-profits" className="chart-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  )
}