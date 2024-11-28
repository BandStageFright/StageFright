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

let tour_dates_body = document.getElementById("tour_dates_body") 

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

          let ticket = document.createElement("td")
          tour_listing.appendChild(ticket)
  
          let ticket_buy_button = document.createElement("button");
          ticket_buy_button.textContent = "Buy Tickets"
          ticket_buy_button.classList.add("btn");
          ticket_buy_button.classList.add("btn-primary")
          ticket_buy_button.setAttribute("data-bs-toggle", "modal")
          ticket_buy_button.setAttribute("data-bs-target", "#ticket_modal")
          ticket_buy_button.addEventListener("click", function(){

          })
          ticket.appendChild(ticket_buy_button)
          tour_dates_body.appendChild(tour_listing);
        }
      })
      .catch(function (err) {
        alert("Error: " + err);
      });
  });


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
  let location = location_input.value
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