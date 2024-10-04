// Wait for the deviceready event before using any of Cordova's device APIs.
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

// Example URL of the JSON bin (replace with your actual URL)
const jsonBinUrl = "https://api.jsonbin.io/v3/b/66cf5200e41b4d34e4269084";

// Function to fetch user data from the JSON bin
async function fetchUserData() {
  try {
    const response = await fetch(jsonBinUrl, {
      method: "GET",
      headers: {
        "X-Master-Key":
          "$2a$10$Xy7PvRYnVKNN3CRusUN7huF5UKpbZXh18csHOXQToPi3xg553oFtO", // Replace with your API key if needed
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.record.users);
    return data.record.users;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// Function to check if the credentials are valid
async function signIn(email, password) {
  const users = await fetchUserData();

  if (users) {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      console.log("Sign-in successful");
      window.location.href = "./home.html";
      return true;
    } else {
      alert("Invalid email or password");
      return false;
    }
  } else {
    console.log("Error fetching user data.");
    return false;
  }
}

// Event listener for form submission
document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  console.log("Form submitted");

  let useremail = document.querySelector("#emails").value.trim();
  useremail = useremail.toLowerCase();
  const userpassword = document.querySelector("#passwordd").value.trim();

  signIn(useremail, userpassword).then((success) => {
    if (success) {
      // Handle successful login
      console.log("Redirecting to home page...");
    } else {
      // Handle login failure
      console.log("Login failed.");
    }
  });
});
