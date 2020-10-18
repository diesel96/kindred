// Variables
const cartNavBtn = document.querySelector(".cart-nav");
const cartNavName = document.querySelector(".cart-nav-info");
const closeCartBtn = document.querySelector(".close-cart");
const cartItem = document.querySelector(".cart-item");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const checkOutBtn = document.querySelector(".check-out");

const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartContent = document.querySelector(".cart-content");

const productDOM = document.querySelector(".products");

// Cart
let cart = [];

// Buttons
let buttonDOM = [];

// Requesting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("../local-storage/products.json");
      let data = await result.json();

      let products = data.items;
      products = products.map((item) => {
        const { id, name } = item;
        const { price } = item.properties;
        const image = item.properties.imageURL;

        return { id, name, price, image };
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// Display Products
class UI {
  setupAPP() {
    cart = Storage.getCart();
    this.setCartTotalValues(cart);
    this.populateCart(cart);

    cartNavBtn.addEventListener("click", this.showCart);
    cartNavName.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  displayProducts(products) {
    let result = "";

    products.forEach((product) => {
      result += `
      <!-- Single Product -->
        <article class="product">
        <div class="img-container">
          <img
            src=${product.image}
            alt="black-tee" 
            class="product-img"
          />
          <button class="bag-btn" data-id="${product.id}">Add to Cart</button>
        </div>
        <span class="product-name">${product.name}</span>
        <span class="product-price">$${product.price}</span>
      </article>
      <!-- End of Single Product -->
        `;
    });

    productDOM.innerHTML = result;
  }

  addToCart() {
    const bagButtons = [...document.querySelectorAll(".bag-btn")];

    buttonDOM = bagButtons;

    bagButtons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        // Get Product from Products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // Add Product to the Cart
        cart = [...cart, cartItem];
        // Save the Cart to Local Storage
        Storage.saveCart(cart);
        // Set Cart values
        this.setCartTotalValues(cart);
        // Display Cart item
        this.displayCartItem(cartItem);
        // Show the Cart
        this.showCart();
      });
    });
  }

  setCartTotalValues(cart) {
    let tempTotal = 0;

    cart.map((item) => {
      tempTotal += item.price * item.amount;
    });

    cartTotal.innerText = "$" + parseFloat(tempTotal.toFixed(2));
    // cartItems.innerText = itemsTotal;
  }

  displayCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="Product" />
    </div>

    <div class="cart-description">
      <p class="cart-item-name">${item.name}</p>
      <p class="cart-item-price">$${item.price}</p>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>

    <div class="cart-quantity">
      <i class="fas fa-minus" data-id=${item.id}></i>
      <p class="item-quantity">${item.amount}</p>
      <i class="fas fa-plus" data-id=${item.id}></i>
    </div>`;

    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  populateCart(cart) {
    cart.forEach((item) => this.displayCartItem(item));
  }

  cartEvents() {
    // Hide cart when clicking outside of Cart
    cartOverlay.addEventListener("click", (event) => {
      var clickInside = cartDOM.contains(event.target);
      var clickRemove = event.target.classList.contains("remove-item");
      var qtyZero = event.target.classList.contains("fa-minus");

      if (!clickInside && !clickRemove && !qtyZero) {
        this.hideCart();
      }
    });

    // Clearing the cart instead of checking out.
    checkOutBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // Singular Cart Item functionality
    cartContent.addEventListener("click", (event) => {
      // User removes Cart Item from Cart.
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;

        cartContent.removeChild(removeItem.parentElement.parentElement);
        // Remove item.
        this.removeItem(id);
      }

      // User adds to Cart Item quantity
      if (event.target.classList.contains("fa-plus")) {
        let plusAmount = event.target;
        let id = plusAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);

        tempItem.amount += 1;
        plusAmount.previousElementSibling.innerText = tempItem.amount;

        Storage.saveCart(cart);
        this.setCartTotalValues(cart);
      }

      // User subtracts from Cart item quantity
      if (event.target.classList.contains("fa-minus")) {
        let minusAmount = event.target;
        let id = minusAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);

        tempItem.amount -= 1;

        if (tempItem.amount > 0) {
          minusAmount.nextElementSibling.innerText = tempItem.amount;
          Storage.saveCart(cart);
          this.setCartTotalValues(cart);
        } else {
          cartContent.removeChild(minusAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    // Get me the last values of the cart and save it
    this.setCartTotalValues(cart);
    Storage.saveCart(cart);

    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerText = "Add to Cart";
  }

  getSingleButton(id) {
    return buttonDOM.find((button) => button.dataset.id === id);
  }
}

// Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // Setup APP
  ui.setupAPP();

  // Get all Products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.addToCart();
      ui.cartEvents();
    });
});
