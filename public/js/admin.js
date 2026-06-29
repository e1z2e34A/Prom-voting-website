function login() {
  const password = document.getElementById("password").value;

  if (password === "EMMANUEL") {
    window.location.href = "dashboard.html";
  } else {
    alert("Wrong Password");
  }
}
