/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

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

// Example usage

document.querySelector("#loginbtn").addEventListener("click", () => {
  console.log("i got clicked");
  let useremail = document.querySelector("#emails").value;
  useremail = useremail.toLowerCase();
  const userpassword = document.querySelector("#passwordd").value;
  signIn(useremail, userpassword).then((success) => {
    if (success) {
      // Redirect to dashboard or do something on successful sign-in
    } else {
      // Show error message or take other actions on failure
    }
  });
});
