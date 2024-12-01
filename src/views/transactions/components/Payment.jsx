//import useState and useEffect
import { useState, useEffect } from "react";

//import moneyFormat
import moneyFormat from "../../../utils/moneyFormat";

//import js cookie
import Cookies from "js-cookie";

//import service api
import Api from "../../../services/api";

//import react select
import Select from "react-select";

//import toats
import toast from "react-hot-toast";

export default function Payment({ totalCarts, fetchCarts }) {
  //set state
  const [grandTotal, setGrandTotal] = useState(totalCarts);
  const [cash, setCash] = useState("");
  const [change, setChange] = useState(0);
  const [discount, setDiscount] = useState("");

  //state customers
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  //function setDiscount
  function calculateDiscount(e) {
    //set discount
    setDiscount(e.target.value);

    //set grandTotal
    setGrandTotal(totalCarts - e.target.value);

    //set change
    setCash(0);

    //set change
    setChange(0);
  }

  //function setChange
  function calculateChange(e) {
    //set cash
    setCash(e.target.value);

    //set change
    setChange(e.target.value - grandTotal);
  }

  //function setGrandTotal
  function calculateGrandTotal() {
    setGrandTotal(totalCarts);
  }

  //hook useEffect
  useEffect(() => {
    calculateGrandTotal();
  }, [totalCarts]);

  //function "fetchCustomers"
  const fetchCustomers = async () => {
    const token = Cookies.get("token");

    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.get("/api/customers-all").then((response) => {
        //set data response to state "customers"
        setCustomers(response.data.data);
      });
    }
  };

  //hook useEffect
  useEffect(() => {
    fetchCustomers();
  }, []);

  //function storeTransaction
  const storeTransaction = async () => {
    //get token from cookies inside the function to ensure it's up-to-date
    const token = Cookies.get("token");

    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.post("/api/transactions", {
        customer_id: selectedCustomer.value || null,
        discount: parseInt(discount) || 0,
        cash: parseInt(cash),
        change: parseInt(change),
        grand_total: parseInt(grandTotal),
      }).then((response) => {
        //show toast
        toast.success(response.data.meta.message, {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        //fetchCarts
        fetchCarts();

        const receiptWindow = window.open(
          `/transactions/print?invoice=${response.data.data.invoice}`,
          "_blank"
        );
        receiptWindow.onload = function () {
          receiptWindow.print();
          receiptWindow.onafterprint = function () {
            receiptWindow.close(); // This will work since the script opened the window
          };
        };
      });
    }
  };

  return (
    <>
      <button
        className="btn btn-warning w-100 rounded"
        data-bs-toggle="modal"
        data-bs-target="#modal-pay"
        disabled={totalCarts === 0}
      >
        Pay
      </button>

      <div
        className="modal modal-blur fade"
        id="modal-pay"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment Cash</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="card rounded bg-muted-lt">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-4">
                      <h4 className="fw-bold">GRAND TOTAL</h4>
                    </div>
                    <div className="col-md-8 col-8 text-end">
                      <h2 className="fw-bold">{moneyFormat(grandTotal)}</h2>
                      <div>
                        <hr />
                        <h3 className="text-success">
                          Change : <strong>{moneyFormat(change)}</strong>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-2 mt-3">
                <div className="col-md-6">
                  <label className="mb-1">Customer</label>
                  <Select
                    options={customers}
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mb-1">Discount (Rp.)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Discount (Rp.)"
                    value={discount}
                    onChange={(e) => calculateDiscount(e)}
                  />
                </div>
              </div>
              <div className="row mb-2 mt-3">
                <div className="col-md-12">
                  <label className="mb-1">Cash (Rp.)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Cash (Rp.)"
                    value={cash}
                    onChange={(e) => calculateChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-auto rounded"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={storeTransaction}
                disabled={cash < grandTotal || grandTotal === 0}
                className="btn btn-primary rounded"
                data-bs-dismiss="modal"
              >
                Pay Order + Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
