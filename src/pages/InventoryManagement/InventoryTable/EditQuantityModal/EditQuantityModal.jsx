import { useState } from "react";

export default function ({ productQty, onSubmitSuccess }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const [formValues, setFormValues] = useState({
    productQty,
  });

  const handleProductQtyChange = (e) => {
    const productQty = Number(e.target.value);
    setFormValues((prevState) => ({
      ...prevState,
      productQty,
    }));
  };

  const handleEditQuantitySubmit = (e) => {
    e.preventDefault();
    onSubmitSuccess(formValues.productQty);
    setShow(false);
  };

  const isConfirmButtonDisabled = () =>
    formValues.productQty === productQty || formValues.productQty < 0;

  return (
    <div>
      <button className="btn btn-dark me-3" onClick={() => setShow(true)}>
        Edit Quantity
      </button>
      <div
        className="modal"
        style={{ display: show ? "block" : "none" }}
        id="exampleModal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modify quantity
              </h5>
              <button type="button" className="btn-close" onClick={handleClose}>
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditQuantitySubmit}>
                <div className="input-group mb-3">
                  <span className="input-group-text">Quantity</span>
                  <input
                    min={0}
                    type="number"
                    className="form-control"
                    defaultValue={formValues.productQty}
                    onChange={handleProductQtyChange}
                  ></input>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleEditQuantitySubmit}
                disabled={isConfirmButtonDisabled()}
              >
                Confirm
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
