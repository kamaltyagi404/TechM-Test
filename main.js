let globalData = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalProducts = 0;
let cartSection = document.getElementById("cart-section");
let checkoutSection = document.getElementById("checkout-section");
let cartSectionIcon = document.getElementById("cart-section-icon");
let continueToShipping = document.getElementById("continueToShipping");
let continueToPayment = document.getElementById("continueToPayment");
let continueToReviewOrder = document.getElementById("continueToReviewOrder");
let contactInformationSection = document.getElementById("contact-information-section");
let contactInformationReadonlySection = document.getElementById("contact-information-readonly-section");
let shippingMethodSection = document.getElementById("shipping-method-section");
let shippingMethodReadonlySection = document.getElementById("shipping-method-readonly-section");
let paymentInformationSection = document.getElementById("payment-information-section");
let paymentInformationReadonlySection = document.getElementById("payment-information-readonly-section");
let finalSelectedProductListSection = document.getElementById("final-selected-product-list-section");
let continueToPlaceOrder = document.getElementById("continueToPlaceOrder");
let orderSuccessfullSection = document.getElementById("order-successfull-section");
let checkoutDetails = {
  shippingInformationDet: {},
  shippingMethod: {},
  paymentInformation: {}
};

const loadProducts = async () => {
  try {
    // const response = await fetch(`https://fakestoreapi.com/products?page=${currentPage}&limit=${itemsPerPage}`);
    const response = await fetch(`https://fakestoreapi.com/products`);

    const data = await response.json();

    if (data.length > 0) {
      globalData = data;
      displayProducts(globalData);
      displayIndexProducts(globalData);
    }

  } catch (error) {
    document.getElementById('error-message').textContent = "Failed to load products. Please try again.";
  }
};

// Function to filter products by category
const filterByCategory = (category) => {
  let filteredProducts;

  if (category === 'all') {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(product => product.category === category);
  }

  displayProducts(globalData);
};

function onCheckboxClick() {
  const selectedValues = [];
  if (document.getElementById('mensClothing').checked) {
    selectedValues.push(document.getElementById('mensClothing').value);
  }
  if (document.getElementById('womensClothing').checked) {
    selectedValues.push(document.getElementById('womensClothing').value);
  }
  if (document.getElementById('electronics').checked) {
    selectedValues.push(document.getElementById('electronics').value);
  }
  if (document.getElementById('homeAppliances').checked) {
    selectedValues.push(document.getElementById('homeAppliances').value);
  }
  if (selectedValues.length > 0) {
    displayProducts(globalData, selectedValues);
  } else {
    displayProducts(globalData);
  }

}

const searchProducts = (query) => {
  const filtered = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
  displayProducts(filtered);
};

function fileterCategorySingal(data) {
  const seenCategories = new Set();
  return data.filter(product => {
    if (seenCategories.has(product.category)) {
      return false;
    }
    seenCategories.add(product.category);
    return true;
  });
}

function displayIndexProducts(list) {
  let data = fileterCategorySingal(list);
  const productListContainerA = document.getElementById('productsA');
  if (productListContainerA) {
    productListContainerA.classList.add('row');
    productListContainerA.innerHTML = '';

    data.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card', 'col-6', 'col-xl-3', 'col-md-3', 'col-sx-6');

      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.title;
      productImage.classList.add('product-image');

      const productICategory = document.createElement('h3');
      productICategory.textContent = product.category;

      productCard.appendChild(productImage);
      productCard.appendChild(productICategory);

      productListContainerA.appendChild(productCard);
    });
  }
}

let products = [];

// Function to display the products
const displayProducts = (data, selectedfilters = []) => {

  const productListContainer = document.getElementById('products');
  if (productListContainer) {
    productListContainer.classList.add('row');

    productListContainer.innerHTML = '';

    const val = document.getElementById("selectedProduct");
    let filteredProducts = data;
    if (selectedfilters.length > 0) {
      filteredProducts = data.filter(item =>
        selectedfilters.some(selectedfilter =>
          selectedfilter.toLowerCase() === item.category.toLowerCase()
        )
      );
    }

    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card', 'col-6', 'col-xl-3', 'col-md-3', 'col-sx-6');

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('image-wrapper');

      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.title;
      productImage.classList.add('product-image');

      imageWrapper.appendChild(productImage);

      const productName = document.createElement('h3');
      productName.textContent = product.title;

      const productPrice = document.createElement('p');
      productPrice.textContent = `$${product.price}`;

      const productDescription = document.createElement('p');
      productDescription.textContent = product.description;

      productCard.appendChild(imageWrapper);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);

      productCard.addEventListener('click', () => {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
      });

      productListContainer.appendChild(productCard);
    });

  }

};

function sortByPrice() {
  const sortedArray = [...globalData].sort((a, b) => a.price - b.price);
  displayProducts(sortedArray);
}

function resetList() {
  displayProducts(globalData);
}
if (document.getElementById('sort-options')) {
  document.getElementById('sort-options').addEventListener('change', function (event) {
    const selectedOption = event.target.value;

    if (selectedOption === 'default') {
      resetList();
    } else if (selectedOption === 'sort') {
      sortByPrice();
    }
  });

}

// Function to update the quantity when the user clicks the minus or plus buttons
function changeValue(increment) {
  const quantityInput = document.getElementById('numeric-input');
  let currentQuantity = parseInt(quantityInput.value);
  if (isNaN(currentQuantity)) {
    console.error("Invalid quantity value");
    return;
  }
  currentQuantity += increment;
  if (currentQuantity < 0) {
    currentQuantity = 0;
  }
  quantityInput.value = currentQuantity;
  console.log('Updated Quantity:', currentQuantity);
}

// validate the input
function validateInput() {
  const quantityInput = document.getElementById('numeric-input');
  let value = parseInt(quantityInput.value);
  if (isNaN(value) || value < 0) {
    quantityInput.value = 0;
  }
  console.log('Validated Quantity:', quantityInput.value);
}

function addToCart() {
  const quantityInput = document.getElementById('numeric-input');
  const quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity <= 0) {
    console.log('Invalid quantity. Please select a valid quantity.');
  } else {
    console.log('Adding to cart:', quantity);
  }

  const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
  console.log(selectedProduct);
  let getCartData = JSON.parse(localStorage.getItem("cart_list"));
  const product_obj = {
    id: selectedProduct.id,
    image: selectedProduct.image,
    title: selectedProduct.title,
    size: "",
    color: "",
    price: selectedProduct.price,
    quantity: quantity
  };
  if (getCartData && getCartData.length > 0) {
    const index = getCartData.findIndex(x => x.id == selectedProduct.id);
    if (index > -1) {
      getCartData[index].quantity = quantity;
    } else {
      getCartData.push(product_obj);
    }
  } else {
    getCartData = [];
    getCartData.push(product_obj);
  }

  var totalProductsEle = document.getElementById("no_of_products");
  totalProductsEle.textContent = getCartData.length;
  localStorage.setItem("cart_list", JSON.stringify(getCartData));

  console.log(getCartData)
}

function getCartDetails() {
  const cartContainer = document.getElementById("cart-container");
  const cartData = JSON.parse(localStorage.getItem('cart_list'));
  let totalAmount = 0;

  // update the total amount
  function updateTotal() {
    totalAmount = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById("total-amount").textContent = `Total: $${totalAmount.toFixed(2)}`;
  }

  function createCartItem(item) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const leftSection = document.createElement("div");
    leftSection.classList.add("left-section");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.classList.add("product-image");

    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    const title = document.createElement("h6");
    title.textContent = item.title;
    const size = document.createElement("p");
    size.classList.add('mb-0');
    size.textContent = `Size: ${item.size}`;
    const color = document.createElement("p");
    color.classList.add('mb-0');
    color.textContent = `Color: ${item.color}`;
    const price = document.createElement("p");
    price.classList.add('mb-0');
    price.textContent = `Price: $${item.price.toFixed(2)}`;

    productDetails.appendChild(title);
    productDetails.appendChild(size);
    productDetails.appendChild(color);
    productDetails.appendChild(price);

    leftSection.appendChild(img);
    leftSection.appendChild(productDetails);

    // Quantity and Total price
    const rightSection = document.createElement("div");
    rightSection.classList.add("right-section");

    const quantityControl = document.createElement("div");
    quantityControl.classList.add("quantity-control");

    const minusButton = document.createElement("button");
    minusButton.classList.add("minPlusButton");

    minusButton.textContent = "-";
    minusButton.onclick = () => updateQuantity(item, -1);

    const quantity = document.createElement("span");
    quantity.classList.add("input-box")
    quantity.textContent = item.quantity;

    const plusButton = document.createElement("button");
    plusButton.classList.add("minPlusButton");

    plusButton.textContent = "+";
    plusButton.onclick = () => updateQuantity(item, 1);

    let i = document.createElement("i");
    i.classList.add("fa", "fa-trash-o");
    i.onclick = () => deleteProduct(item);

    quantityControl.appendChild(minusButton);
    quantityControl.appendChild(quantity);
    quantityControl.appendChild(plusButton);
    quantityControl.appendChild(i);

    const totalPrice = document.createElement("p");
    totalPrice.classList.add("total-price");
    totalPrice.textContent = `Item Total: $${(item.price * item.quantity).toFixed(2)}`;

    rightSection.appendChild(quantityControl);
    rightSection.appendChild(totalPrice);

    cartItem.appendChild(leftSection);
    cartItem.appendChild(rightSection);

    cartContainer.appendChild(cartItem);
  }

  // Update quantity
  function updateQuantity(item, change) {
    if (item.quantity + change >= 1) {
      item.quantity += change;

      const index = cartData.findIndex(x => x.id == item.id);
      if (index > -1) {
        cartData[index].quantity = item.quantity;
        localStorage.setItem("cart_list", JSON.stringify(cartData));
      }
      updateCart();
    }
  }

  function deleteProduct(item) {
    console.log("item", item);
    const cartData = JSON.parse(localStorage.getItem('cart_list'));
    if (cartData) {
      const index = cartData.findIndex(x => x.id == item.id);
      if (index > -1) {
        cartData.splice(index, 1);
        console.log("cartData", cartData);
        localStorage.setItem('cart_list', JSON.stringify(cartData));
        if (cartData && cartData.length == 0) {
          document.getElementById("checkoutBtn").style.display = "none";
        }
        var totalProductsEle = document.getElementById("no_of_products");
        if (totalProductsEle) {
          let getCartData = JSON.parse(localStorage.getItem("cart_list"));
          totalProductsEle.textContent = getCartData.length > 0 ? getCartData.length : "";
        }
        getCartDetails();
      }
    }
  }

  // Update cart 
  function updateCart() {
    cartContainer.innerHTML = '';
    cartData.forEach(createCartItem);
    updateTotal();
  }

  updateCart();
}

if (document.getElementById("checkoutBtn")) {
  document.getElementById("checkoutBtn").addEventListener('click', () => {
    if (cartSection) {
      cartSection.style.display = "none";
      checkoutSection.style.display = "block";
      contactInformationSection.style.display = "block";
      contactInformationReadonlySection.style.display = "none";
      orderSuccessfullSection.style.display = "none";
      fetchCountries();
      fetchStates();
      const cartData = JSON.parse(localStorage.getItem('cart_list'));
      let totalAmount = 0;
      totalAmount = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById("Subtotal").textContent = `$${totalAmount.toFixed(2)}`;
      document.getElementById("FinalCheckoutAmount").textContent = `$${totalAmount.toFixed(2)}`;
    }
  });
}

async function fetchCountries() {
  const response = await fetch('https://www.freetestapi.com/api/v1/countries');
  const data = await response.json();

  const countrySelect = document.getElementById('country');
  data.forEach(country => {
    const option = document.createElement('option');
    option.value = country.name;
    option.textContent = country.name;
    countrySelect.appendChild(option);
  });
}

async function fetchStates() {

  const response = await fetch('https://www.freetestapi.com/api/v1/us-states');
  const data = await response.json();

  const stateSelect = document.getElementById('state');
  stateSelect.innerHTML = '<option value="">Select State</option>';
  data.forEach(state => {
    const option = document.createElement('option');
    option.value = state.name;
    option.textContent = state.name;
    stateSelect.appendChild(option);
  });
}


cartSectionIcon.addEventListener('click', () => {
  cartSection.style.display = "block";
  checkoutSection.style.display = "none";
  contactInformationReadonlySection.style.display = "none";
  orderSuccessfullSection.style.display = "none";
});

if (continueToShipping) {
  continueToShipping.addEventListener('click', () => {

    checkoutDetails.shippingInformationDet = {
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      country: document.getElementById('country').value,
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      streetAddress: document.getElementById('street-address').value,
      streetAddress2: document.getElementById('street-address-2').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value,
    }
    console.log("continueToShipping:", checkoutDetails);
    contactInformationSection.style.display = "none";
    shippingMethodReadonlySection.style.display = "none";
    paymentInformationReadonlySection.style.display = "none";
    finalSelectedProductListSection.style.display = "none";
    contactInformationReadonlySection.style.display = "block";
    shippingMethodSection.style.display = "block";
    document.getElementById("readonly_email").textContent = checkoutDetails.shippingInformationDet.email;
    document.getElementById("readonly_firstname").textContent = checkoutDetails.shippingInformationDet.firstName;
    document.getElementById("readonly_lastname").textContent = checkoutDetails.shippingInformationDet.lastName;
    document.getElementById("readonly_phonenumber").textContent = checkoutDetails.shippingInformationDet.phone;
    document.getElementById("readonly_address").textContent = checkoutDetails.shippingInformationDet.streetAddress;
    document.getElementById("readonly_address2").textContent = checkoutDetails.shippingInformationDet.streetAddress2;
    document.getElementById("readonly_city").textContent = checkoutDetails.shippingInformationDet.city;
    document.getElementById("readonly_state").textContent = checkoutDetails.shippingInformationDet.state;
    document.getElementById("readonly_country").textContent = checkoutDetails.shippingInformationDet.country;
    document.getElementById("readonly_zipcode").textContent = checkoutDetails.shippingInformationDet.zip;
  });
}

if (continueToPayment) {
  continueToPayment.addEventListener('click', () => {

    const selectedOption = document.querySelector('input[name="options"]:checked');
    if (selectedOption) {
      checkoutDetails.shippingMethod = selectedOption.value;
    }
    console.log("continueToPayment", checkoutDetails);

    shippingMethodSection.style.display = "none";
    shippingMethodReadonlySection.style.display = "block";
    paymentInformationSection.style.display = "block";

    document.getElementById("readonly_shippingMethod").textContent = checkoutDetails.shippingMethod;

  });
}

if (continueToReviewOrder) {
  continueToReviewOrder.addEventListener('click', () => {
    checkoutDetails.paymentInformation = {
      name: document.getElementById('name_on_card').value,
      cardNumber: document.getElementById('credit_card_number').value,
      expireDate: document.getElementById('expiration_date').value,
      cvv: document.getElementById('cvv').value
    }
    console.log("continueToReviewOrder", checkoutDetails);
    paymentInformationSection.style.display = "none";
    paymentInformationReadonlySection.style.display = "block";
    finalSelectedProductListSection.style.display = "block";
    const lastFour = checkoutDetails.paymentInformation.cardNumber ? checkoutDetails.paymentInformation.cardNumber.slice(-4) : '';
    document.getElementById("readonly_card_number").textContent = lastFour;
    finalDisplayProducts();

  });
}

function finalDisplayProducts() {
  const cartData = JSON.parse(localStorage.getItem('cart_list'));
  const totalItems = calculateTotalItems(cartData);
  const productListElement = document.getElementById("product-list");
  const orderCountElement = document.getElementById("order-count");

  orderCountElement.textContent = `${totalItems} items in your order`;

  cartData.forEach(product => {
    productListElement.innerHTML += createProductHTML(product);
  });
}

function createProductHTML(product) {
  return `
    <div class="col-12 col-md-12 product-row">
      <div class="d-flex">
        <!-- Left side: Image -->
        <img src="${product.image}" alt="${product.title}" class="product-image-order-success">

        <!-- Right side: Product details -->
        <div class="product-details">
          <h6>${product.title}</h6>
          <p class="mb-0">Size: ${product.size || "N/A"}</p>
          <p class="mb-0">Color: ${product.color || "N/A"}</p>
          <p class="mb-0">Quantity: ${product.quantity}</p>
        </div>
      </div>
    </div>
  `;
}

function calculateTotalItems(products) {
  return products.reduce((total, product) => total + product.quantity, 0);
}

if (continueToPlaceOrder) {
  continueToPlaceOrder.addEventListener('click', () => {
    shippingMethodReadonlySection.style.display = "none";
    paymentInformationReadonlySection.style.display = "none";
    finalSelectedProductListSection.style.display = "none";
    contactInformationSection.style.display = "none";
    contactInformationReadonlySection.style.display = "none";
    checkoutSection.style.display = "none";
    orderSuccessfullSection.style.display = "block";
    orderSuccessfull();
  });
}


function orderSuccessfull() {
  // Shipping and payment details
  const cartData = JSON.parse(localStorage.getItem('cart_list'));
  const json = {
    productList: cartData,
    shippingInformationDet: checkoutDetails.shippingInformationDet,
    shippingMethod: checkoutDetails.shippingMethod,
    paymentInformation: checkoutDetails.paymentInformation
  }
  console.log("order success json:", json);
  document.getElementById("shipping-email").innerText = json.shippingInformationDet.email;
  document.getElementById("shipping-phone").innerText = json.shippingInformationDet.phone;
  document.getElementById("shipping-address").innerText = json.shippingInformationDet.streetAddress;
  document.getElementById("shipping-city").innerText = json.shippingInformationDet.city;
  document.getElementById("shipping-state").innerText = json.shippingInformationDet.state;
  document.getElementById("shipping-zip").innerText = json.shippingInformationDet.zip;
  document.getElementById("shipping-method").innerText = json.shippingMethod;
  document.getElementById("payment-card").innerText = json.paymentInformation.cardNumber;

  const totalQuantity = json.productList.reduce((total, product) => total + product.quantity, 0);
  document.getElementById("items-in-order").innerText = `${totalQuantity} Items in your order`;

  const productListContainer = document.getElementById("order_success_product-list");

  json.productList.forEach(product => {
    const productHTML = `
    <div class="col-12 col-md-12 product-row">
      <div class="d-flex">
        <!-- Left side: Image -->
        <img src="${product.image}" alt="${product.title}" class="product-image-order-success">

        <!-- Right side: Product details -->
        <div class="product-details">
          <h6>${product.title}</h6>
          <p class="mb-0">Size: ${product.size || "N/A"}</p>
          <p class="mb-0">Color: ${product.color || "N/A"}</p>
          <p class="mb-0">Quantity: ${product.quantity}</p>
        </div>
      </div>
    </div>
    `;
    productListContainer.innerHTML += productHTML;
  });
}

if (document.getElementById("shippingInformationEditIcon")) {
  document.getElementById("shippingInformationEditIcon").addEventListener('click', () => {
    checkoutSection.style.display = "block";
    contactInformationSection.style.display = "block";
    contactInformationReadonlySection.style.display = "none";
    shippingMethodReadonlySection.style.display = "none";
    console.log(checkoutDetails);

    document.getElementById('email').value = checkoutDetails.shippingInformationDet.email;
    document.getElementById('phone').value = checkoutDetails.shippingInformationDet.phone;
    document.getElementById('country').value = checkoutDetails.shippingInformationDet.country;
    document.getElementById('first-name').value = checkoutDetails.shippingInformationDet.firstName;
    document.getElementById('last-name').value = checkoutDetails.shippingInformationDet.lastName;
    document.getElementById('street-address').value = checkoutDetails.shippingInformationDet.streetAddress;
    document.getElementById('street-address-2').value = checkoutDetails.shippingInformationDet.streetAddress2;
    document.getElementById('city').value = checkoutDetails.shippingInformationDet.city;
    document.getElementById('state').value = checkoutDetails.shippingInformationDet.state;
    document.getElementById('zip').value = checkoutDetails.shippingInformationDet.zip;
  });
}

function hideAllSection() {
  checkoutSection.style.display = "none";
  contactInformationSection.style.display = "none";
  contactInformationReadonlySection.style.display = "none";
  shippingMethodSection.style.display = "none";
  shippingMethodReadonlySection.style.display = "none";
  paymentInformationSection.style.display = "none";
  paymentInformationReadonlySection.style.display = "none";
  finalSelectedProductListSection.style.display = "none";
}



window.onload = () => {

  loadProducts();
  let url = window.location.href;
  url = url.substring(url.lastIndexOf('/') + 1);
  url = url.split('.')[0]

  var totalProductsEle = document.getElementById("no_of_products");
  let getCartData = JSON.parse(localStorage.getItem("cart_list"));
  if (totalProductsEle && getCartData) {
    totalProductsEle.textContent = getCartData.length > 0 ? getCartData.length : "";
  }

  if (url == 'product-detail') {
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

    if (selectedProduct) {

      const imageContainer = document.getElementById('image-container');
      const detailsContainer = document.getElementById('details-container');

      const productImage = document.createElement('img');
      productImage.src = selectedProduct.image;
      productImage.alt = selectedProduct.title;
      productImage.classList.add('product-image');

      imageContainer.appendChild(productImage);

      const productName = document.createElement('h3');
      productName.textContent = selectedProduct.title;

      const productPrice = document.createElement('p');
      productPrice.textContent = `$${selectedProduct.price}`;

      const productDescription = document.createElement('p');
      productDescription.textContent = selectedProduct.description;

      detailsContainer.appendChild(productName);
      detailsContainer.appendChild(productPrice);
      detailsContainer.appendChild(productDescription);

      const descriptionContainer = document.getElementById('description-container');
      const clonedProductName = productName.cloneNode(true);
      const clonedProductDescription = productDescription.cloneNode(true);

      descriptionContainer.appendChild(clonedProductName);
      descriptionContainer.appendChild(clonedProductDescription);

    } else {
      console.log('No product data found!');
    }
  } else if (url == "cart") {
    cartSection.style.display = "block";
    checkoutSection.style.display = "none";
    contactInformationReadonlySection.style.display = "none";
    orderSuccessfullSection.style.display = "none";

    const cartData = JSON.parse(localStorage.getItem('cart_list'));
    if (cartData && cartData.length == 0) {
      document.getElementById("checkoutBtn").style.display = "none";
    }
    getCartDetails();
  }
};


const button = document.getElementById('showFilter');
const hiddenDiv = document.getElementById('hiddenFilter');
if (button) {
  button.addEventListener('click', function () {
    if (hiddenDiv.style.display === 'none') {
      hiddenDiv.style.display = 'block';
    } else {
      hiddenDiv.style.display = 'none';
    }
  });
}

const toggleIcon = document.getElementById("toggleIcon");
const toggleDiv = document.getElementById("toggleDiv");
if (toggleIcon) {
  toggleIcon.addEventListener("click", function () {
    if (toggleDiv.style.display === "none") {
      toggleDiv.style.display = "block";
    } else {
      toggleDiv.style.display = "none";
    }
  });
}
