//--------------------Database--------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {get, set, update, ref, getDatabase} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
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
const auth = getAuth();
//--------------------Elements & Variables--------------------//
// Elements
const password_input = document.getElementById("password_input");
const login_form = document.getElementById("login_form");

const id_input = document.getElementById("id_input");
const name_input = document.getElementById("name_input");
const price_input = document.getElementById("price_input");
const date_input = document.getElementById("date_input");
const location_input = document.getElementById("location_input");
const quantity_input = document.getElementById("quantity_input");
const image_input = document.getElementById("image_input");

const merch_button = document.getElementById("merch_button");
const tour_button = document.getElementById("tour_button");
const product_form = document.getElementById("product_form");
// Global Variables
let product_type = "";
//--------------------Security--------------------//
onAuthStateChanged(auth, function (user) {
  if (user != null && user.email == "stagefrightbandinbox@gmail.com") {
    login_form.remove()
    merch_button.setAttribute("data-bs-target", "#add_product_modal")
    tour_button.setAttribute("data-bs-target", "#add_product_modal")
  } 
});

login_form.addEventListener("submit", function (e) {
  e.preventDefault();
  signInWithEmailAndPassword(auth, "stagefrightbandinbox@gmail.com", password_input.value).then(function () {
    login_form.remove()
    merch_button.setAttribute("data-bs-target", "#add_product_modal")
    tour_button.setAttribute("data-bs-target", "#add_product_modal")
  }).catch(function(err){
    alert(err)
  });
});
//--------------------Add Products--------------------//
// Switches to merch products
merch_button.addEventListener("click", function () {
  product_type = "merch";
  name_input.style.display = "block";
  image_input.style.display = "block";
  date_input.style.display = "none";
  location_input.style.display = "none";
});

// Switches to tour products
tour_button.addEventListener("click", function () {
  product_type = "tour";
  name_input.style.display = "none";
  image_input.style.display = "none";
  date_input.style.display = "block";
  location_input.style.display = "block";
});

// Adds in products into firebase based on input from the form
product_form.addEventListener("submit", async function (e) {
  // Prevents the form from refreshing the page
  e.preventDefault();
  // Checks if user is an admin
  if (auth.currentUser != null && auth.currentUser.email == "stagefrightbandinbox@gmail.com") {
    // Values from form
    let id = id_input.value;
    let price = price_input.value;
    let quantity = quantity_input.value;
    // Default ID if none is provided
    if (id == "") {
      id = "0000";
    }
    if (product_type == "merch") {
      // Adds a new MERCH product
      let merch_name = name_input.value;
      let image = image_input.value;

      await set(ref(db, "products/merch/" + id), {
        item_name: merch_name,
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
    } else {
      // Adds a new TOUR product
      let date = date_input.value;
      let location = location_input.value;
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
    }
    // Submits the form
    product_form.submit();
  } else {
    alert("You don't have access to this.")
  }
});
//---------------------------------------------------//