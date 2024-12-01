//import moneyFormat
import moneyFormat from "../../../utils/moneyFormat";

//import service api
import Api from "../../../services/api";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

export default function OrderItemList({ carts, fetchCarts }) {
  //token
  const token = Cookies.get("token");

  //function deleteCart
  const deleteCart = (cartID) => {
    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      Api.delete(`/api/carts/${cartID}`).then((response) => {
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

        //fetchCarts
        fetchCarts();
      });
    }
  };

  return (
    <div className="card-body scrollable-card-body">
      <div className="row">
        {carts.map((cart) => (
          <div className="col-12 mb-2" key={cart.id}>
            <div className="card rounded">
              <div className="card-body d-flex align-items-center">
                <img
                  src={`${import.meta.env.VITE_APP_BASEURL}/${
                    cart.product.image
                  }`}
                  alt={cart.product.title}
                  width={50}
                  height={50}
                  className="me-3 rounded"
                />
                <div className="flex-fill">
                  <h4 className="mb-0">{cart.product.title}</h4>
                  <p className="text-success mb-0 mt-1">
                    {moneyFormat(cart.price)}
                  </p>
                  <hr className="mb-1 mt-1" />
                  <p className="text-muted mb-0">Qty: {cart.qty}</p>
                </div>
                <button
                  className="btn btn-danger ms-3 rounded p-2 pt-1 pb-1"
                  onClick={() => deleteCart(cart.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
