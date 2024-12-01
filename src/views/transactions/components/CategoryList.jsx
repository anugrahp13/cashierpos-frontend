//import useHorizontalScroll
import { useHorizontalScroll } from "../../../utils/useHorizontalScroll";

export default function CategoryList({
  categories,
  fetchProducts,
  fetchProductByCategoryID,
  setCurrentCategoryId,
}) {
  //destruct useHorizontalScroll
  const { scrollRef, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } =
    useHorizontalScroll();

  return (
    <div className="row">
      <div className="col-md-2">
        <a
          href="#"
          className="text-decoration-none"
          onClick={() => fetchProducts()}
        >
          <div className="card card-link card-link-pop mt-3 rounded">
            <div className="card-body d-flex align-items-center justify-content-center p-2">
              <img
                src="/images/categories.png"
                alt=""
                width={50}
                height={50}
                className="me-2 p-2"
              />
              <h4 className="mb-0 mt-2">All</h4>
            </div>
          </div>
        </a>
      </div>
      <div className="col-md-10">
        <div
          className="horizontal-scroll"
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          <div className="row mt-3">
            {categories.map((category) => (
              <div className="col-4" key={category.id}>
                <a
                  href="#"
                  className="text-decoration-none"
                  onClick={() => {
                    fetchProductByCategoryID(category.id);
                    setCurrentCategoryId(category.id);
                  }}
                >
                  <div className="card card-link card-link-pop rounded">
                    <div className="card-body d-flex align-items-center justify-content-center p-2">
                      <img
                        src={`${import.meta.env.VITE_APP_BASEURL}/${
                          category.image
                        }`}
                        alt={category.name}
                        width={50}
                        height={50}
                        className="me-2"
                      />
                      <h4 className="mb-0 mt-2">{category.name}</h4>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
