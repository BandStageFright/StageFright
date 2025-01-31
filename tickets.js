//--------------------Database--------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  get,
  set,
  update,
  ref,
  getDatabase,
  orderByChild,
  query,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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
//--------------------Elements & Variables--------------------//
// Elements
let tour_dates_body = document.getElementById("tour_dates_body");
let ticket_date = document.getElementById("ticket_date");
let ticket_location = document.getElementById("ticket_location");
let ticket_price = document.getElementById("ticket_price");
let ticket_quantity = document.getElementById("ticket_quantity");
let ticket_quantity_add_button = document.getElementById(
  "ticket_quantity_add_button"
);
let ticket_quantity_subtract_button = document.getElementById(
  "ticket_quantity_subtract_button"
);
let checkout_button = document.getElementById("checkout_button");
let checkout_form = document.getElementById("checkout_form");
let total = document.getElementById("total");

// Global Variables
let current_id = "";
let current_price = 0;
//--------------------Functions--------------------//
// Sends an email to Stage Fright's inbox
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

// Updates the total label in the modal if the quantity changes
function update_total() {
  let price = current_price * Number(ticket_quantity.value);
  total.innerHTML = "<strong>Total: $</strong>" + price.toFixed(2);
}
//--------------------Load Content--------------------//
// Loads all ticket listings from the database onto the page
window.addEventListener("load", function () {
  let data_query = query(ref(db, "products/tickets"), orderByChild("date"));
  get(data_query)
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        // New Row
        let tour_listing = document.createElement("tr");
        tour_listing.id = child.key;
        // Date Column
        let tour_date = document.createElement("td");
        tour_date.textContent = new Date(child.val()["date"])
          .toUTCString()
          .slice(0, 16);
        tour_listing.appendChild(tour_date);
        // Location Column
        let tour_location = document.createElement("td");
        tour_location.textContent = child.val()["location"];
        let location_link = document.createElement("a")
        location_link.target = "_blank"
        location_link.href = "http://maps.google.com/?q=" + child.val()["location"];
        location_link.style.color = "#e1d9d9"
        location_link.style.marginLeft = "5px"
        let location_icon = document.createElement("i")
        location_icon.classList.add("bi-geo-alt-fill")
        location_link.appendChild(location_icon)
        tour_location.appendChild(location_link)
        tour_listing.appendChild(tour_location);
        // Ticket Button Column
        let ticket = document.createElement("td");
        tour_listing.appendChild(ticket);
        // Ticket Button
        let ticket_buy_button = document.createElement("button");
        ticket_buy_button.classList.add("btn");
        ticket_buy_button.style.width = "100%";
        ticket.appendChild(ticket_buy_button);
        // Sells out the event if stock runs out or the date has already passed
        if (
          child.val()["quantity"] > 0 &&
          new Date() <= new Date(child.val()["date"])
        ) {
          ticket_buy_button.classList.add("btn-warning");
          ticket_buy_button.textContent =
            "Buy Tickets (" + child.val()["quantity"] + " left)";
          ticket_buy_button.setAttribute("data-bs-toggle", "modal");
          ticket_buy_button.setAttribute("data-bs-target", "#ticket_modal");
          ticket_buy_button.addEventListener("click", function () {
            // Updates global variables
            current_id = child.key;
            current_price = child.val()["price"];
            // Updates Elements
            ticket_date.innerHTML =
              "<strong>Date: </strong>" +
              new Date(child.val()["date"]).toUTCString().slice(0, 16);
            ticket_location.innerHTML =
              "<strong>Location: </strong>" + child.val()["location"];
            ticket_price.innerHTML =
              "<strong>Price: </strong> $" +
              Number(child.val()["price"]).toFixed(2) +
              "/ea.";
            total.innerHTML =
              "<strong>Total: $</strong>" +
              Number(child.val()["price"]).toFixed(2);
            ticket_quantity.value = 1;
          });
        } else {
          // Changes the button to be sold out
          ticket_buy_button.classList.add("btn-danger");
          ticket_buy_button.textContent = "Sold Out!";
          ticket_buy_button.addEventListener("click", function () {
            alert("This event is sold out. Sorry!");
          });
        }
        // Appends the listing to the table
        tour_dates_body.appendChild(tour_listing);
      });
    })
    // Catches any errors that happen
    .catch(function (err) {
      alert("Error: " + err);
    });
});
//--------------------Update Total--------------------//
ticket_quantity.addEventListener("change", function () {
  update_total();
});

ticket_quantity_add_button.addEventListener("click", function () {
  if (Number(ticket_quantity.value) < ticket_quantity.max) {
    ticket_quantity.value = Number(ticket_quantity.value) + 1;
    update_total();
  }
});

ticket_quantity_subtract_button.addEventListener("click", function () {
  if (Number(ticket_quantity.value) > ticket_quantity.min) {
    ticket_quantity.value = Number(ticket_quantity.value) - 1;
    update_total();
  }
});
//--------------------Checkout--------------------//
// Performs server-side checks & sends order confirmation email when order is processed
checkout_form.addEventListener("submit", async function (e) {
  // Stops the form from refreshing the page
  e.preventDefault();
  // Grabs all the data from the form
  let first_name = document.getElementById("first_name").value;
  let last_name = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let credit_card_number = document.getElementById("credit_card_number").value;
  // Generates receipt of the order
  let requested_quantity = Number(ticket_quantity.value);
  let receipt = "";
  let total_cost = 0;
  let can_process = true; // Flag to check that the order can go through
  await get(ref(db, "products/tickets/" + current_id))
    .then(function (snapshot) {
      let ticket_data = snapshot.val();
      if (requested_quantity <= ticket_data["quantity"]) {
        total_cost = requested_quantity * ticket_data["price"];
<<<<<<< HEAD
        receipt = "Date: " + new Date(ticket_data["date"]).toUTCString().slice(0, 16) + "<br>Location: " + ticket_data["location"] + "<br>Number of Tickets: " + requested_quantity;
=======
        receipt =
          "Date: " +
          new Date(values[i]["date"]).toUTCString().slice(0, 16) +
          "<br>Location: " +
          ticket_data["location"] +
          "<br>Number of Tickets: " +
          requested_quantity;
>>>>>>> 740b347d246b28f8c6f54efa7a148fbdf239efbe
        update(ref(db, "products/tickets/" + current_id), {
          quantity: ticket_data["quantity"] - requested_quantity,
        });
      } else {
        alert(
          "Your order could not be processed. You're currently ordering more tickets than there are available for this event."
        );
        can_process = false;
      }
    })
    .catch(function (err) {
      alert(
        "Your order could not be processed. An error has occured. Error: " + err
      );
      can_process = false;
    });
  // Disables the order button for a bit
  checkout_button.disabled = true;
  // Sends the email to the Stage Fright inbox
  if (can_process) {
    send_email(
      "Order-" + email,
      `
        <p><strong>Your ticket order has been recieved by Stage Fright!</strong></p>
        <p><strong>Name:</strong> ${first_name + " " + last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Card #:</strong> ${credit_card_number}</p>
        <p><strong>Your Ticket Order:</strong></p>
        <p>${receipt}</p>
        <p><strong>Total:</strong> ${total_cost.toFixed(2)}</p>
        <p>Please fill out our contact form if you have any questions/updates regarding your ticket order. Thank for your purchase.</p>
     `
    );
    // Submits form after 3 seconds
    setTimeout(function () {
      checkout_form.submit();
    }, 3000);
  }
  // Reenables the order button
  checkout_button.disabled = false;
});
//---------------------------------------------------//
