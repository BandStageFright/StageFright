document.addEventListener("DOMContentLoaded", () => {
  const waitForNavbar = setInterval(() => {
    const navbar = document.getElementById("navbarNav");

    if (navbar) {
      clearInterval(waitForNavbar);

      const currentPath = window.location.pathname.split("/").pop();
      console.log("Current Path:", currentPath);

      const navLinks = {
        home: "index.html",
        tour: "tickets.html",
        merch: "merch.html",
        contact: "contact.html",
      };

      for (const id in navLinks) {
        if (currentPath === navLinks[id]) {
          console.log(`Found active link: ${id}`);
          document.getElementById(id).classList.add("active");
        }
      }
    }
  }, 100);
});
