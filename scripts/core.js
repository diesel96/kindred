const navDOM = document.querySelector(".nav-bar");
const navLeft = document.querySelector(".nav-left");
const navRight = document.querySelector(".nav-right");

let smallDevice = window.matchMedia("(min-width: 374px)");
let mediumDevice = window.matchMedia("(max-width: 677px)");

function handleDeviceChange(event) {
  navBarChange(event);
}

function navBarChange(event) {
  if (event.matches) {
    navLeft.innerHTML = `
            <div class="nav-left">
            <span>
              <a href="#">Menu</a>
            </span>
          </div>`;

    navRight.innerHTML = `
          <div class="nav-right">
          <span>
            <a href="#" class="cart-nav-info">Cart</a>
            <span class="cart-nav">(0)</span>
          </span>
        </div>
          `;
  } else {
    navLeft.innerHTML = `
        <div class="nav-left">
            <span>
              <a href="/pages/shop.html">Shop</a>
              <a href="#">Lookbook</a>
            </span>
          </div>`;

    navRight.innerHTML = `
        <div class="nav-right">
          <span>
            <a href="#">Search</a>
            <a href="#" class="cart-nav-info">Cart</a>
            <span class="cart-nav">(0)</span>
          </span>
        </div>`;
  }
}

mediumDevice.addEventListener("change", handleDeviceChange);
