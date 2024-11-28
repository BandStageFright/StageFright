// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {get, set, update, ref, getDatabase} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7IaUJ-Zqa_ooOq4fI02uuOJJyZ_in5q0",
  authDomain: "stagefright-8aa66.firebaseapp.com",
  projectId: "stagefright-8aa66",
  storageBucket: "stagefright-8aa66.firebasestorage.app",
  messagingSenderId: "507487855236",
  appId: "1:507487855236:web:31f9b5392f14a6883118d1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Elements 
const cart_button = document.getElementById("cart_button");
const cart_items = document.getElementById("cart_items");
const cart_div = document.getElementById("cart");
const clear_button = document.getElementById("clear_button");
const checkout_form = document.getElementById("checkout_form");

// Global Variables
let items_in_cart = 0;
  
function send_email(subject, message) {
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "stagefrightbandinbox@gmail.com",
    Password: "C52E2686F30B4CD492367B323A7216F01BD5",
    To: "stagefrightbandinbox@gmail.com",
    From: "stagefrightbandinbox@gmail.com",
    Subject: subject,
    Body: message,
    Port: 587,
  }).then((message) => alert("Order Placed! (Status: " + message + ")"));
}

function display_cart() {
  cart_div.textContent = "";
  if (localStorage["cart"] != undefined && Object.keys(JSON.parse(localStorage["cart"])).length > 0) {
    let cart = JSON.parse(localStorage["cart"]);
    let keys = Object.keys(cart);
    let values = Object.values(cart);
    let total = 0.0;
    let total_quantity = 0;
    cart_div.textContent = "";
    for (let i = 0; i < keys.length; i++) {
      let quantity = values[i]["quantity"];
      total_quantity += quantity;
      let price = values[i]["quantity"] * values[i]["price"];
      let line_div = document.createElement("div");
      line_div.classList.add("cart_line");
      let quantity_input = document.createElement("input");
      quantity_input.style.width = "50px";
      quantity_input.style.textAlign = "center";
      quantity_input.type = "number";
      quantity_input.min = 0;
      quantity_input.value = values[i]["quantity"];
      quantity_input.addEventListener("change", function () {
        if (quantity_input.value == 0) {
          delete cart[keys[i]];
          items_in_cart -= quantity;
        } else {
          cart[keys[i]]["quantity"] =
            quantity + (quantity_input.value - quantity);
          items_in_cart = quantity + (quantity_input.value - quantity);
        }
        localStorage["cart"] = JSON.stringify(cart);
        cart_items.textContent = items_in_cart;
        display_cart();
      });
      line_div.appendChild(quantity_input);
      let line_text = document.createElement("div");
      line_text.textContent =
        values[i]["item_name"] + "...............$" + String(price.toFixed(2));
      line_div.appendChild(line_text);
      cart_div.appendChild(line_div);
      total += price;
      items_in_cart = total_quantity;
      cart_items.textContent = items_in_cart;
    }
    let total_div = document.createElement("div");
    total_div.textContent = "Total: $" + total.toFixed(2);
    total_div.id = "total_label";
    cart_div.appendChild(total_div);
  } else {
    cart_div.textContent = "Your cart is empty!";
  }
}

window.addEventListener("load", function () {
  let col = 1;
  display_cart();
  get(ref(db, "products/merch"))
    .then(function (snapshot) {
      let products_data = snapshot.val();
      let keys = Object.keys(products_data);
      let values = Object.values(products_data);
      for (let i = 0; i < keys.length; i++) {
        let product_listing = document.createElement("div");
        product_listing.classList.add("card");
        product_listing.id = keys[i];
        product_listing.style.marginBottom = "20px";

        let product_image = document.createElement("img");
        product_image.classList.add("card-img-top");
        if (values[i]["image"] != undefined) {
          product_image.src = values[i]["image"];
        }
        product_image.alt = values[i]["item_name"];
        product_listing.appendChild(product_image);

        let product_listing_content = document.createElement("div");
        product_listing_content.classList.add("card-body");
        product_listing.appendChild(product_listing_content);

        let product_name = document.createElement("h5");
        product_name.classList.add("card-title");
        product_name.textContent = values[i]["item_name"];
        product_listing_content.appendChild(product_name);

        let product_price = document.createElement("p");
        product_price.classList.add("card-text");
        product_price.textContent = "$" + values[i]["price"] + " | Stock: " + values[i]["quantity"];
        product_listing_content.appendChild(product_price);

        let product_buy_button = document.createElement("button");
        product_buy_button.classList.add("btn");
        if (values[i]["quantity"] <= 0) {
          product_buy_button.classList.add("btn-danger");
          product_buy_button.textContent = "Sold Out!";
          product_buy_button.addEventListener("click", function () {
            alert("This product is sold out! Sorry.");
          });
        } else {
          product_buy_button.classList.add("btn-success");
          product_buy_button.textContent = "Add to cart";
          product_buy_button.addEventListener("click", function () {
            let cart = {};
            if (localStorage["cart"] != undefined) {
              cart = JSON.parse(localStorage["cart"]);
            }
            if (cart[keys[i]] != undefined) {
              cart[keys[i]]["quantity"] += 1;
            } else {
              cart[keys[i]] = {
                item_name: values[i]["item_name"],
                price: values[i]["price"],
                quantity: 1,
              };
            }

            localStorage["cart"] = JSON.stringify(cart);
            items_in_cart += 1;
            cart_items.textContent = items_in_cart;
            alert("Item added to cart!");
          });
        }
        product_listing_content.appendChild(product_buy_button);
        document.getElementById("col" + col).appendChild(product_listing);
        if (col == 3) {
          col = 1;
        } else {
          col += 1;
        }
      }
    })
    .catch(function (err) {
      alert("Error: " + err);
    });
});

cart_button.addEventListener("click", function () {
  display_cart();
});

checkout_form.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Grabs all the data from the form
  let first_name = document.getElementById("first_name").value;
  let last_name = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let credit_card_number = document.getElementById("credit_card_number").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let state = document.getElementById("state").value;
  let zipcode = document.getElementById("zipcode").value;
  let country = document.getElementById("country").value;
  // Generates reciept of the order
  let cart = JSON.parse(localStorage["cart"]);
  let keys = Object.keys(cart);
  let values = Object.values(cart);
  let can_process = true;
  let reciept = "";
  let total_price = 0;
  for (let i = 0; i < keys.length; i++) {
    await get(ref(db, "products/merch/" + keys[i]))
      .then(function (snapshot) {
        let product_data = snapshot.val();
        if (values[i]["quantity"] <= product_data["quantity"]) {
          let cost = values[i]["quantity"] * values[i]["price"];
          total_price += cost;
          reciept += product_data["item_name"] +" (x" + values[i]["quantity"] + "): $" + cost.toFixed(2) + "<br>";
          update(ref(db, "products/merch/" + keys[i]), {
            quantity: product_data["quantity"] - values[i]["quantity"]
          });
        } else {
          alert("Your order could not be processed. You currently have more '" + values[i]["item_name"] + "' in your cart than available.");
          can_process = false;
        }
      })
      .catch(function (err) {
        alert("Your order could not be processed. An error has occured. Error: " + err);
        can_process = false;
      });
    if (!can_process) {
      return;
    }
  }
  send_email(
    "Order-" + email,
    `
        <p><strong>Your order has been recieved by Stage Fright!</strong></p>
        <p><strong>Name:</strong> ${first_name + " " + last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Card #:</strong> ${credit_card_number}</p>
        <p><strong>Address:</strong> ${address + ", " + city + ", " + state + ", " + country + ", " + zipcode}</p>
        <p><strong>Your Order:</strong></p>
        <p>${reciept}</p>
        <p><strong>Total:</strong> ${total_price.toFixed(2)}</p>
        <p>Please fill out our contact form if you have any questions/updates regarding your order. Thank for your purchase.</p>
     `
  );
  setTimeout(function(){
    localStorage.removeItem("cart");
    checkout_form.submit()
  }, 3000)
});

clear_button.addEventListener("click", function () {
  if (localStorage["cart"] != undefined) {
    localStorage.removeItem("cart");
  }
  display_cart();
});


// Adding Items
const id_input = document.getElementById("id_input");
const name_input = document.getElementById("name_input");
const price_input = document.getElementById("price_input");
const quantity_input = document.getElementById("quantity_input");
const image_input = document.getElementById("image_input");
const submit_button = document.getElementById("add_product_button");
const product_form = document.getElementById("product_form");

product_form.addEventListener("submit", function (e) {
  e.preventDefault();

  let id = id_input.value;
  let name = name_input.value;
  let price = price_input.value;
  let quantity = quantity_input.value;
  let image = image_input.value;

  if (id == "") {
    id = "0000";
  }

  set(ref(db, "products/merch/" + id), {
    item_name: name,
    price: price,
    quantity: quantity,
    image: image,
  })
    .then(function () {
      alert("Product Successfully Added!");
    })
    .catch(function (err) {
      alert(err);
    });

  product_form.submit();
});
