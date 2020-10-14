// alert("Connected");

// Variables
const cartNavBtn = document.querySelector(".cart-nav");
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

  getBagButtons() {
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
        this.setCartValues(cart);
        // Display Cart item
        this.addCartItem(cartItem);
        // Show the Cart
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = "$" + parseFloat(tempTotal.toFixed(2));
    // cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
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

  showCart(){
      cartOverlay.classList.add('transparentBcg');
      cartDOM.classList.add('showCart');
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
}

// Event Listeners

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // Get all Products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
