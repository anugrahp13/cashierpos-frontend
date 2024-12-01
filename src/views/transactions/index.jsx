//import useState, useEffect dan useRef
import { useState, useEffect, useRef } from "react";

//import layout admin
import LayoutAdmin from "../../layouts/admin";

//import service api
import Api from "../../services/api";

//import js cookie
import Cookies from "js-cookie";

//import component product list
import ProductList from "./components/ProductList";

//import component category list
import CategoryList from "./components/CategoryList";

//import component order item list
import OrderItemList from "./components/OrderItemList";

//import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

//import component pagination
import PaginationComponent from "../../components/Pagination";

//import component Payment
import Payment from "./components/Payment";

export default function TransactionsIndex() {
  //state products
  const [products, setProducts] = useState([]);

  //define state "pagination"
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 0,
    total: 0,
  });

  //state barcode
  const [barcode, setBarcode] = useState("");

  //ref search
  const searchInputRef = useRef(null);

  //state categories
  const [categories, setCategories] = useState([]);

  //state currentCategoryId
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  //state carts
  const [carts, setCarts] = useState([]);
  const [totalCarts, setTotalCarts] = useState(0);

  //token
  const token = Cookies.get("token");

  //function "fetchProducts"
  const fetchProducts = async (pageNumber) => {
    if (token) {
      //define variable "page"
      const page = pageNumber ? pageNumber : pagination.currentPage;

      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.get(`/api/products?page=${page}&limit=9`).then((response) => {
        //set data response to state "products"
        setProducts(response.data.data);

        //set data response to state "pagination"
        setPagination({
          currentPage: response.data.pagination.currentPage,
          perPage: response.data.pagination.perPage,
          total: response.data.pagination.total,
        });
      });
    }
  };

  //function "fetchProductByBarcode"
  const fetchProductByBarcode = async (barcode) => {
    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.post("/api/products-by-barcode", {
        barcode: barcode,
      }).then((response) => {
        //set data response to state "products"
        setProducts(response.data.data);
      });
    }
  };

  //function searchHandler
  const searchHandler = (e) => {
    //set state "barcode"
    setBarcode(e.target.value);

    //call function "fetchProductByBarcode"
    fetchProductByBarcode(e.target.value);
  };

  //function "fetchCategories"
  const fetchCategories = async () => {
    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.get("/api/categories-all").then((response) => {
        //set data response to state "catgeories"
        setCategories(response.data.data);
      });
    }
  };

  //function fetchProductByCategoryID
  const fetchProductByCategoryID = async (categoryId, pageNumber) => {
    if (token) {
      //define variable "page"
      const page = pageNumber ? pageNumber : pagination.currentPage;

      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.get(
        `/api/products-by-category/${categoryId}?page=${page}&limit=9`
      ).then((response) => {
        //set data response to state "products"
        setProducts(response.data.data);

        //set data response to state "pagination"
        setPagination({
          currentPage: response.data.pagination.currentPage,
          perPage: response.data.pagination.perPage,
          total: response.data.pagination.total,
        });
      });
    }
  };

  //function "fetchCarts"
  const fetchCarts = async () => {
    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.get("/api/carts").then((response) => {
        //set data response to state "carts"
        setCarts(response.data.data);

        //set totalCarts
        setTotalCarts(response.data.totalPrice);
      });
    }
  };

  //hook
  useEffect(() => {
    //call function "fetchProducts"
    fetchProducts();

    // check if searchInputRef is defined
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    //call function "fetchCategories"
    fetchCategories();

    //call function "fetchCarts"
    fetchCarts();
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-8 mb-3">
              {/* Search and Scan Barcode */}
              <form onSubmit={searchHandler} autoComplete="off" noValidate>
                <div className="input-icon">
                  <span className="input-icon-addon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Scan Barcode"
                    value={barcode}
                    onChange={(e) => searchHandler(e)}
                    ref={searchInputRef}
                  />
                </div>
              </form>

              {/* Category List */}
              <CategoryList
                categories={categories}
                fetchProducts={fetchProducts}
                fetchProductByCategoryID={fetchProductByCategoryID}
                setCurrentCategoryId={setCurrentCategoryId}
              />

              {/* Product List */}
              <ProductList products={products} fetchCarts={fetchCarts} />

              {/* Pagination */}
              <div className="row mt-3">
                <PaginationComponent
                  currentPage={pagination.currentPage}
                  perPage={pagination.perPage}
                  total={pagination.total}
                  onChange={(pageNumber) => {
                    if (currentCategoryId) {
                      fetchProductByCategoryID(currentCategoryId, pageNumber);
                    } else {
                      fetchProducts(pageNumber);
                    }
                  }}
                  position="center"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-header p-3">
                  <h3 className="mb-0">ORDER ITEMS</h3>
                </div>
                <div className="card-body scrollable-card-body p-0">
                  {/* Order Items */}
                  <OrderItemList carts={carts} fetchCarts={fetchCarts} />
                </div>
                <div className="card-body">
                  <div className="mt-3">
                    <h3 className="float-end">{moneyFormat(totalCarts)}</h3>
                    <h3 className="mb-0">Total ({carts.length} Items)</h3>
                  </div>
                  <hr />
                  <Payment totalCarts={totalCarts} fetchCarts={fetchCarts} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
