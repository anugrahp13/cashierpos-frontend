//import moneyFormat
import moneyFormat from "../../../utils/moneyFormat";

//import service api
import Api from "../../../services/api";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

export default function ProductList({ products, fetchCarts }) {
  //token
  const token = Cookies.get("token");

  //function addToCart
  const addToCart = (product) => {
    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      Api.post("/api/carts", {
        product_id: product.id,
        qty: 1,
        price: product.sell_price,
      }).then((response) => {
        //show toast
        toast.success(`${response.data.meta.message}`, {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        //call fetchCarts
        fetchCarts();
      });
    }
  };

  return (
    <div className="row mt-3">
      {products.length > 0 ? (
        products.map((product) => (
          <div className="col-4" key={product.id}>
            <div className="card card-link card-link-pop mt-3 rounded">
              <div className="ribbon bg-success mt-3">
                <h4 className="mb-0">{moneyFormat(product.sell_price)}</h4>
              </div>
              <div className="card-body text-center">
                <img
                  src={`${import.meta.env.VITE_APP_BASEURL}/${product.image}`}
                  alt={product.title}
                  className="me-2 rounded"
                />
                <h4 className="mb-0 mt-2">{product.title}</h4>
                <button
                  className="btn btn-primary mt-3 w-100 rounded"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-danger mb-0">Product not available</div>
      )}
    </div>
  );
}
