document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  const body = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `;

  send_email(subject, body);
});

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
  })
    .then((response) => {
      if (response === "OK") {
        alert("Message sent successfully!");
        document.getElementById("contactForm").reset();
      } else {
        alert("Failed to send message. Please try again later.");
      }
    })
    .catch((error) => console.error("Error:", error));
}
