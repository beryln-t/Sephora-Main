export default function ProductsDeleteButton({ id, delProduct }) {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/locations/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    await response.json();
    delProduct(id);
  };

  return (
    <button className="btn btn-danger" onClick={handleDelete}>
      Delete
    </button>
  );
}
