**shippingAddress**

**How it Works**
This component renders a shippingAddress form in checkout flow. 
For authenticated user list of previous stored addresses will be shown.
For unauthenticated user, a empty shippingAddressForm will shown.

After Filling the Form, it validates the address and opens an Modal to show suggested address if have.

Following is the JSON schema required by this component which CMS has to send:

```json
{
  "title": "Shipping Address",
  "status": "wip",
  "context": {
    "data": {
      "cms": {
        "isAuthoring": "Y",
      "checkoutTitle": "CHECKOUT",
      "checkoutUnauthDescriptionText" : "You're checking out as guest. Sign in for a faster checkout experience.",
      "shippingTitle" : "SHIPPING ADDRESS",
      "shippingAddressLabel" : "SHIPPING",
      "pickupLabel" : "Pick up instead?",
      "pickupURL" : "http://www.google.com",
      "fullNameLabel" : "Full Name",
      "phoneNumberLabel" : "Phone Number",
      "addressLabel" : "Address",
      "addMoreDetailsOptionalLabel" : "Add Company Name,Apt. Number,etc. (Optional)",
      "addMoreDetailsLabel":"Company Name, Apt. Number, P.O.Box",
      "zipCodeLabel" : "ZIP Code",
      "cityLabel" : "City",
      "stateLabel" : "State",
      "shippingMethodLabel" : "SHIPPING METHOD",
      "shipmentLabel" : "Shipment",
      "arrivesLabel" : "Arrives",
      "addNewShippingAddressLabel" : "Add a New Shipping Address"
      }
    }
  }
}

```
