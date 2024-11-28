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

let tour_dates_body = document.getElementById("tour_dates_body");
let ticket_date = document.getElementById("ticket_date");
let ticket_location = document.getElementById("ticket_location");
let ticket_price = document.getElementById("ticket_price")
let ticket_quantity = document.getElementById("ticket_quantity");
let ticket_quantity_add_button = document.getElementById(
  "ticket_quantity_add_button"
);
let ticket_quantity_subtract_button = document.getElementById(
  "ticket_quantity_subtract_button"
);
let checkout_button = document.getElementById("checkout_button")
let checkout_form = document.getElementById("checkout_form")
let total = document.getElementById("total");

let current_id = ""
let current_price = 0;

window.addEventListener("load", function () {
  get(ref(db, "products/tickets"))
    .then(function (snapshot) {
      let tickets_data = snapshot.val();
      let keys = Object.keys(tickets_data);
      let values = Object.values(tickets_data);
      for (let i = 0; i < keys.length; i++) {
        let tour_listing = document.createElement("tr");
        tour_listing.id = keys[i];

        let tour_date = document.createElement("td");
        tour_date.textContent = new Date(values[i]["date"]).toDateString();
        tour_listing.appendChild(tour_date);

        let tour_location = document.createElement("td");
        tour_location.textContent = values[i]["location"];
        tour_listing.appendChild(tour_location);

        let ticket = document.createElement("td");
        tour_listing.appendChild(ticket);

        let ticket_buy_button = document.createElement("button");
        ticket_buy_button.textContent = "Buy Tickets";
        ticket_buy_button.classList.add("btn");
        ticket_buy_button.classList.add("btn-primary");
        ticket_buy_button.setAttribute("data-bs-toggle", "modal");
        ticket_buy_button.setAttribute("data-bs-target", "#ticket_modal");
        ticket_buy_button.addEventListener("click", function () {
          ticket_date.innerHTML = "<strong>Date: </strong>" + new Date(values[i]["date"]).toDateString();
          ticket_location.innerHTML = "<strong>Location: </strong>" + values[i]["location"];
          ticket_price.innerHTML = "<strong>Price: </strong> $" + Number(values[i]["price"]).toFixed(2) + "/ea.";
          ticket_quantity.value = 1;
          current_id = keys[i]
          current_price = values[i]["price"];
          total.innerHTML = "<strong>Total: $</strong>" + Number(values[i]["price"]).toFixed(2);
        });
        ticket.appendChild(ticket_buy_button);
        tour_dates_body.appendChild(tour_listing);
      }
    })
    .catch(function (err) {
      alert("Error: " + err);
    });
});

function update_total() {
  let price = current_price * Number(ticket_quantity.value)
  total.innerHTML = "<strong>Total: $</strong>" + price.toFixed(2);
}

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

ticket_quantity.addEventListener("change", function () {
  update_total();
});

ticket_quantity_add_button.addEventListener("click", function () {
  if(Number(ticket_quantity.value) < ticket_quantity.max){
      ticket_quantity.value = Number(ticket_quantity.value) + 1;
      update_total();
  }
});

ticket_quantity_subtract_button.addEventListener("click", function () {
    if(Number(ticket_quantity.value) > ticket_quantity.min){
      ticket_quantity.value = Number(ticket_quantity.value) - 1;
      update_total();
    }
  });

  checkout_form.addEventListener("submit", async function (e) {
    e.preventDefault();
    // Grabs all the data from the form
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let credit_card_number = document.getElementById("credit_card_number").value;
    // Generates reciept of the order
    let requested_quantity = Number(ticket_quantity.value)
    let reciept = ""
    let total_cost = 0
    let can_process = true
    await get(ref(db, "products/tickets/" + current_id))
        .then(function (snapshot) {
          let ticket_data = snapshot.val();
          if (requested_quantity <= ticket_data["quantity"]) {
            total_cost = requested_quantity * ticket_data["price"];
            reciept = "Date: " + new Date(ticket_data["date"]).toDateString() + "<br>Location: " 
            + ticket_data["location"] 
            + "<br>Number of Tickets: " + requested_quantity 
            update(ref(db, "products/tickets/" + current_id), {
              quantity: ticket_data["quantity"] - requested_quantity
            });
          } else {
            alert("Your order could not be processed. You're currently ordering more tickets than there are available for this event.");
            can_process = false;
          }
        })
        .catch(function (err) {
          alert("Your order could not be processed. An error has occured. Error: " + err);
          can_process = false;
        });
      checkout_button.disabled = true
      if (can_process) {
        send_email(
            "Order-" + email,
            `
                <p><strong>Your ticket order has been recieved by Stage Fright!</strong></p>
                <p><strong>Name:</strong> ${first_name + " " + last_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Card #:</strong> ${credit_card_number}</p>
                <p><strong>Your Ticket Order:</strong></p>
                <p>${reciept}</p>
                <p><strong>Total:</strong> ${total_cost.toFixed(2)}</p>
                <p>Please fill out our contact form if you have any questions/updates regarding your ticket order. Thank for your purchase.</p>
             `
          );
          setTimeout(function(){
            checkout_form.submit()
          }, 3000)
      }
      checkout_button.disabled = false
})
// Adding Items
const id_input = document.getElementById("id_input");
const date_input = document.getElementById("date_input");
const location_input = document.getElementById("location_input");
const price_input = document.getElementById("price_input");
const quantity_input = document.getElementById("quantity_input");
const product_form = document.getElementById("product_form");

product_form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let id = id_input.value;
  let date = date_input.value;
  let location = location_input.value;
  let price = price_input.value;
  let quantity = quantity_input.value;

  if (id == "") {
    id = "0000";
  }

  await set(ref(db, "products/tickets/" + id), {
    date: date,
    location: location,
    price: price,
    quantity: quantity,
  })
    .then(function () {
      alert("Product Successfully Added!");
    })
    .catch(function (err) {
      alert(err);
    });

  product_form.submit();
});
