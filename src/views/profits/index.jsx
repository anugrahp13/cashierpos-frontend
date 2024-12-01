//import useState
import { useState } from "react";

//import layout admin
import LayoutAdmin from "../../layouts/admin";

//import service api
import Api from "../../services/api";

//import js cookie
import Cookies from "js-cookie";

//import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

//import export button
import ExportButton from "../../components/ExportButton";

export default function Profits() {
  //state date
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //state profits
  const [profits, setProfits] = useState([]);
  const [total, setTotal] = useState(0);

  //get token from cookies
  const token = Cookies.get("token");

  //function filter profits
  const filterProfits = async (e) => {
    e.preventDefault();

    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      try {
        //fetch data from API with Axios
        const response = await Api.get(
          `/api/profits?start_date=${startDate}&end_date=${endDate}`
        );

        //assign response data to state "profits"
        setProfits(response.data.data.profits);
        setTotal(response.data.data.total);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    } else {
      console.error("Token is not available!");
    }
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">REPORT PROFITS</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={filterProfits}>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            START DATE
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label fw-bold">END DATE</label>
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) => setEndDate(e.target.value)}
                            value={endDate}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="mb-3">
                          <label className="form-label fw-bold text-white">
                            *
                          </label>
                          <button
                            className="btn btn-md btn-primary border-0 shadow w-100 rounded"
                            type="submit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-filter"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
                            </svg>
                            FILTER
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  {profits.length > 0 ? (
                    <>
                      <div className="export text-end mb-3 mt-5">
                        <ExportButton
                          startDate={startDate}
                          endDate={endDate}
                          type="profits"
                        />
                      </div>
                      <table className="table table-bordered">
                        <thead>
                          <tr style={{ backgroundClip: "#e6e6e7" }}>
                            <th scope="col">Date</th>
                            <th scope="col">Invoice</th>
                            <th scope="col">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profits.map((profit, index) => (
                            <tr key={index}>
                              <td>{profit.created_at}</td>
                              <td>{profit.transaction.invoice}</td>
                              <td className="text-end">
                                {moneyFormat(profit.total)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={2} className="text-end fw-bold">
                              Total
                            </td>
                            <td className="text-end fw-bold">
                              {moneyFormat(total)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
