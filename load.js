function load() {
  const x = new XMLHttpRequest();
  x.open("GET", "footer.html", true);
  x.onload = function () {
    if (x.status === 200) {
      document.getElementById("footer").innerHTML = x.responseText;
    }
  };
  x.send();

  const y = new XMLHttpRequest();
  y.open("GET", "navbar.html", true);
  y.onload = function () {
    if (y.status === 200) {
      document.getElementById("navbar").innerHTML = y.responseText;
    }
  };
  y.send();
}
window.onload = load;
