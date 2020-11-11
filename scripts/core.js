// Variables
const navDOM = document.querySelector(".nav-bar");
const navMenu = document.querySelector(".nav-menu");
const navSearch = document.querySelector(".nav-search");
const navShop = document.querySelector(".nav-shop");

let smallDevice = window.matchMedia("(min-width: 374px)");
let mediumDevice = window.matchMedia("(max-width: 677px)");

// Change Nav text for smaller Screens
function handleDeviceChange(event) {
  if (event.matches) {
    navMenu.classList.remove("hidden");
    navShop.classList.add("hidden");
    navSearch.classList.add("hidden");
  }
}

mediumDevice.addEventListener("change", handleDeviceChange);
mediumDevice.addEventListener("click", handleDeviceChange);
mediumDevice.addEventListener("DOMContentLoaded", handleDeviceChange);
