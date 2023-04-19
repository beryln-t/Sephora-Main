# Sephora Web Application

## Description of the Application

Sephora is a premier beauty and cosmetics retailer with a strong online presence as well as physical stores. The Sephora website is a comprehensive e-commerce platform, providing a wide range of makeup, skincare, hair care, fragrance, and beauty tools and accessories from multiple well-known brands. Our goal is to elevate the customer browsing and service booking experience by implementing a feature that enables them to effortlessly locate the nearest outlet with their desired products, as well as the option to choose from a diverse pool of expert makeup artists.

### Deployment

https://sephora.cyclic.app/

## Timeframe

7 Working Days

## Technologies & Tools Used

- React
- JavaScript
- CSS + Bootstrap
- Mongoose & Express
- Bcrypt (Hashing)
- JWT (Authentication)
- Mongo DB (Database)
- GitHub (version control)
- Cyclic (Deployment)
- Leaflet
- Momentjs

## Screenshots of the Application

---

## Model

![model](https://github.com/beryln-t/sephora/blob/jeremy/src/assets/readmeAssets/datamodel.png?raw=true)

## React routes for HR Admin
- /makeupartist/:id/*
- /makeupartist/edit/:id
- /newmakeupartist

## React routes for Customer
- /maps
- /booking
- /history

## React routes for Login
- /login
- /signup
- /forgetpassword

## CRUD

### ADD Products to Location

```javascript
const addLocProduct = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const productsToAdd = req.body.products;
    const location = await Location.findById(locationId);

    //check all product has quantity
    const hasMissingQuantity = productsToAdd.some(
      (product) => !product.productQty || product.productQty < 0
    );
    if (hasMissingQuantity) {
      throw new Error(
        "All selected products must have a non-negative quantity entered."
      );
    }

    // Check if selected products already exist in the location
    const existingProducts = location.products.map((product) =>
      product.productDetails.toString()
    );
    const newProducts = [];
    const existingProductNames = [];
    for (const product of productsToAdd) {
      if (existingProducts.includes(product.productId.toString())) {
        const existingProduct = await Product.findById(product.productId);
        existingProductNames.push(existingProduct.name);
      } else {
        newProducts.push({
          productDetails: product.productId,
          productQty: product.productQty,
        });
      }
    }

    if (existingProductNames.length > 0) {
      const message = `The following products already exist in the location, please select new products to add: ${existingProductNames.join(
        ", "
      )}`;
      throw new Error(message);
    }

    location.products.push(...newProducts);

    const updatedLocation = await location.save();

    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### Edit Product

```javascript
const updateProducts = async (req, res) => {
  try {
    const updatedName = req.body.name;
    const existingProduct = await Products.findOne({ name: updatedName });
    if (existingProduct && existingProduct._id.toString() !== req.params.id) {
      throw new Error("Another product with the same name already exists");
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### Show Makeup Artists by Location

```javascript
const show = async (req, res) => {
  const { id } = req.params;

  try {
    const mkaeupArtist = await MakeupArtist.find({ _id: id }).populate(
      "location.id"
    );
    res.status(200).json(mkaeupArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### Delete Makeup Artist Profile

```javascript
const deleteMakeupArtist = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await Appointment.deleteMany({ "makeupArtist.id": id });

    const findMakeUpArtist = await MakeupArtist.findByIdAndDelete(id);

    if (!findMakeUpArtist) {
      return res.status(404).json({ error: "Makeup Artist not found" });
    }

    res.status(200).json({ message: "Makeup Artist deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

## Disabling and Removing Timeslots booked
```js
  const timeSlotDisabled = (startTime, futureDate, endTime, selectArtist) => {
    console.log(`apptTiming in Times: ${JSON.stringify(apptTiming)}`);
    const isPastTimeSlot = checkTimeSlot(startTime) && !futureDate;
    const isMakeUpArtistWithinWorkingHours = isTimeSlotWithinWorkingHours(
      startTime,
      endTime,
      selectArtist
    );
    const isMakeUpArtistWithinBreakHours = isTimeSlotWithinBreakTime(
      startTime,
      endTime,
      selectArtist
    );
    const isTimeSlotBooked = apptTiming.some(
      (appt) => appt.timeslot === `${startTime} - ${endTime}`
    );
    
    return (
      isPastTimeSlot ||
      !isMakeUpArtistWithinWorkingHours ||
      isMakeUpArtistWithinBreakHours ||
      isTimeSlotBooked 
     
    );
  };

  const isAllTimeSlotRemoved = () => {
    return time.every((times) => {
      const startTime = times.split(" - ")[0];
      const endTime = times.split(" - ")[1];
      return timeSlotDisabled(startTime, futureDate, endTime, selectArtist);
    });
  };

  return (
    <div className="times">
      {time.map((times, index) => {
        const startTime = times.split(" - ")[0];
        const endTime = times.split(" - ")[1];
        //console.log(startTime)
        const disabledTime = timeSlotDisabled(
          startTime,
          futureDate,
          endTime,
          selectArtist
        );
        return !disabledTime ? (
          <div key={index}>
            <button onClick={(e) => displayInfo(e)}>{times}</button>
          </div>
        ) : null;
      })}
      {isAllTimeSlotRemoved() && <div>No timeslot available for today</div>}
      <div>
        {renderBookingMessage()}
      </div>
    </div>
  );

```
## Rendering the booking message
```js
  const renderBookingMessage = () => {
    if (errorMessage) {
      return errorMessage
    } else if(!dateChanged && info && !errorMessage){
      return `Makeup session booked on ${date.toLocaleDateString(
        "en-UK"
      )} for timeslot ${event}.`;
    }
  };
```
## Extracting Customer Name from the token
```js
//.......
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

  )
```

## Authentication
```js
const jwt = require("jsonwebtoken");
const Customer = require('../models/customerModel')

const isAuth = async (req, res, next) => {
const token = req.headers.authorization.replace(/"/g, '').split(' ')[1];
console.log("token in authcontroller" ,token)

if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      const customer = await Customer.findOne({ email: decoded.customer.email }).exec();
      if (customer) {
        req.customer = decoded.customer;
        next();
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (error) {
      res.status(401).send("Invalid token");
    //   console.log(error)
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

```
## Showing Street View Map
```js
    function handleShowStreetView(location) {
      const radius = 50
      setStreetViewImageUrl(null)
      getStreetViewImageUrl(Number(location.latitude), Number(location.longitude), radius);
    }

```
## Getting Street View Image
```js
  function getStreetViewImageUrl(lat, lng, radius) {
 
    const radiusParam = radius ? `&radius=${radius}` : '';
    const adjustedLat = lat + (Math.random() * radius * 2 - radius) * 0.0001;
    const adjustedLng = lng + (Math.random() * radius * 2 - radius) * 0.0001;
    const baseUrl = 'https://maps.googleapis.com/maps/api/streetview';
    const size = '300x200'; 
    const heading = '210'; 
    const pitch = '10'; 

    const location = new window.google.maps.LatLng(adjustedLat, adjustedLng);
    const streetViewService = new window.google.maps.StreetViewService();
    const apiKey = 'AIzaSyDDDJIzJGH2EKzuO21LzTsg6Hxiyq04Tc4';

    streetViewService.getPanorama({ location, radius }, (data, status) => {
      if (status === window.google.maps.StreetViewStatus.OK) {
        // Use the panorama ID to construct the street view image URL
        const panoId = data.location.pano;
        const imageUrl = `${baseUrl}?size=${size}&pano=${panoId}&key=${apiKey}`;
        setStreetViewImageUrl(imageUrl);
      } else {
        console.log(`No street view available for location: ${location}`);
        const imageUrl = `${baseUrl}?size=${size}&location=${adjustedLat},${adjustedLng}&heading=${heading}&pitch=${pitch}&key=${apiKey}${radiusParam}`;
        setStreetViewImageUrl(imageUrl);
  
        }
    })}

```
## Key Learning

## Create Makeup Artist
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/create makeup artist.png" alt="create-makeup-artist"></a>
</p>
<br>

## Creating Appointments
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/create appointments.png" alt="create-appointments"></a>
</p>
<br>

## View Upcoming Appointments
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/view upcoming appointments.png" alt="view-upcoming-appointment"></a>
</p>
<br>

## Map
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/map.png" alt="map"></a>
</p>
<br>

## View Makeup Artist by Location
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/view makeup artist from admin.png" alt="view-makeup-artist-by-location"></a>
</p>
<br>

## Appointment Booking with Condition
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/conditional appointment booking.png" alt="appointment-booking-with-condition"></a>
</p>
<br>

## Authenticating Routes
 <p align="center">
  <a href="" rel="noopener">
 <img style="max-width: 100%;" src="/images/authorizing routes.png" alt="authenticating-routes"></a>
</p>
<br>

## References

- https://www.sephora.sg/ (Image and Product resource)
- https://getbootstrap.com/ (CSS)
- https://shahabyazdi.github.io/react-multi-date-picker/min-&-max-date/ (React Calendar)
- https://momentjscom.readthedocs.io/en/latest/moment (Momentjs Documentation)