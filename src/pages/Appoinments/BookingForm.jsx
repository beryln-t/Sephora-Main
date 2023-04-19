const BookingForm = ({ selectArtist, selectLocation, handleChange, fetchedLocations, customerInfo}) => {
  const token = localStorage.getItem("token")
  const Name =  JSON.parse(window.atob(token.split(".")[1]))
  const customerName = Name.customer.name
  const customerEmail = Name.customer.email
  customerInfo.name = customerName
  customerInfo.email = customerEmail

  return (
    <>
      <label>Name:</label>
      <input type="text" name="name" value={customerInfo.name} onChange={handleChange} />
      <br />
      <label>Email:</label>
      <input type="text" name="email" value={customerInfo.email} onChange={handleChange} />

      <label htmlFor="location">Choose a location:</label>

      <select name="location" onChange={handleChange}>
        <option value="">--Please choose location</option>
        {fetchedLocations &&
          fetchedLocations.map((location, index) => {
            return (
              <option key={index} value={location._id}>
                {location.name}
              </option>
            );
          })}
      </select>

      {selectLocation && (
        <select name="artist" onChange={handleChange}>
          <option value="">--Please select makeup artist</option>
          {selectArtist.map((artist, index) => (
            <option key={index} value={artist.name}>
              {" "}
              {artist.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default BookingForm;