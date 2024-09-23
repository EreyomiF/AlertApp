const jsonBinUrl = "https://api.jsonbin.io/v3/b/66cf5200e41b4d34e4269084";
const apiKey = "$2a$10$Xy7PvRYnVKNN3CRusUN7huF5UKpbZXh18csHOXQToPi3xg553oFtO"; // Replace with your API key if needed

async function fetchUserData() {
  try {
    const response = await fetch(jsonBinUrl, {
      method: "GET",
      headers: {
        "X-Master-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.record.users;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function updateUserData(users) {
  try {
    const response = await fetch(jsonBinUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
      },
      body: JSON.stringify({ users }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("User data updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user data:", error);
    return false;
  }
}

async function signUp(email, password) {
  let users = await fetchUserData();
  console.log(users);
  if (users) {
    // Check if user already exists
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("User already exists... Please sign In");
      return false;
    }

    // Add new user
    users.push({ email, password });

    // Update JSON Bin with new user data
    return await updateUserData(users);
  } else {
    console.log("Error fetching user data.");
    return false;
  }
}

document.querySelector("#signUpBtn").addEventListener("click", () => {
  let regEmail = document.querySelector("#regEmail").value;
  regEmail = regEmail.toLowerCase();
  const regPassword = document.querySelector("#regPassword").value;

  signUp(regEmail, regPassword).then((success) => {
    if (success) {
      // Redirect to home page
      window.location.href = "./home.html";
    } else {
      // Show error message
      console.log("Sign-up failed. Please try again.");
    }
  });
});
