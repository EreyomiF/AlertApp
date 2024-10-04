document.addEventListener("deviceready", onDeviceReady, false);
const categorybutton = document.querySelector(".filter-select");
const categorydiv = document.querySelector(".categories");
const openformbutton = document.querySelector(".floatinbtn");
const formdiv = document.querySelector(".addform");
const closeformbutton = document.querySelector(".closebutton");
const homerefresh = document.querySelector(".brandlogo");
const apiUrl = "https://api.jsonbin.io/v3/b/66cfb7a1acd3cb34a87aefd7";
const apiKey = "$2a$10$Xy7PvRYnVKNN3CRusUN7huF5UKpbZXh18csHOXQToPi3xg553oFtO";
let base64Image = "";
//added
let isEditing = false; // Flag to track if we are editing a post
let editPostId = null; // Variable to store the postId of the post being edited
const opensesame =  () => {
  formdiv.style.display =
    formdiv.style.display === "none" || !formdiv.style.display
      ? "flex"
      : "none";
}
//end


// Toggle form visibility
openformbutton.addEventListener("click",opensesame);



// Close form
closeformbutton.addEventListener("click", () => {
  formdiv.style.display = "none";
});

document.querySelector(".fileinpt").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector(
        ".preview-div"
      ).innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100%;">`;
      base64Image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.querySelector(".up-btn").addEventListener("click", function () {
  document.querySelector(".fileinpt").click();
});

function displayPosts(posts) {
  postsContainer = document.querySelector(".content");
  postsContainer.innerHTML = ""; // Clear previous posts
  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts available.</p>";
    return;
  }
  console.log(posts);

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("incident-card");
    postElement.innerHTML = `
<div class="flex flex-wrap -mx-4">
    <div class="relative p-4 bg-white rounded-lg shadow-lg mb-6 w-full sm:w-1/2 lg:w-1/3 px-4">
        <!-- Edit Icon -->
        <div class="absolute top-2 right-2 cursor-pointer edit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#1D1B20"/>
            </svg>
        </div>

        <!-- Incident Image -->
        <div class="w-full h-48 mb-4 overflow-hidden rounded-lg incident-img-div">
            <img src="${post.image}" alt="Incident Image" class="w-full h-full object-cover incident-img" />
        </div>

        <!-- Incident Content -->
        <div class="incident-content text-gray-800">
            <div class="cont-t">
                <div class="title flex justify-between items-center">
                    <span class="font-bold text-lg">${post.headline}</span>
                    <span class="deletebtn cursor-pointer">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#1D1B20"/>
                        </svg>
                    </span>
                </div>
                <div class="description mb-2">${post.desc}</div>
            </div>

            <div class="card-footer flex justify-between items-center text-sm text-gray-600">
                <div class="label font-semibold">${post.category?.toUpperCase()}</div>
                <div class="location">
                    <span>Latitude: ${Math.round(post.postlocation.latitude * 10000) / 10000},</span>
                    <span>Longitude: ${Math.round(post.postlocation.longitude * 10000) / 10000}</span>
                </div>
            </div>
        </div>
    </div>
</div>
      `;

    postsContainer.appendChild(postElement);
    postElement.querySelector(".deletebtn")?.addEventListener("click", () => {
      deletePost(post.id);
    });
    postElement.querySelector(".edit")?.addEventListener("click", () => {
      console.log("i got clicked");
      openEditForm(post.id);
    })
  });
}





//function edit post

//
function openEditForm(postId) {
  fetch(`${apiUrl}/latest`, {
    headers: {
      "X-Master-Key": apiKey,
    }
  })
    .then((response) => response.json())
    .then(data => {
      const posts = data?.record?.record?.posts;
      
      if (posts && Array.isArray(posts)) {
        const postToEdit = posts.find((post) => post.id === postId);
        

        if (postToEdit) {
          isEditing = true;
          editPostId = postId;
          // Open the form
          opensesame();
          // Populate form fields with post data
          document.getElementById("headline").value = postToEdit.headline;
          document.getElementById("description").value = postToEdit.desc;
          document.querySelector("#selectcat").value = postToEdit.category;
          document.querySelector(
            ".preview-div"
          ).innerHTML = `<img src="${postToEdit.image}" alt="Preview" style="width: 100%;">`;
          
          base64Image = postToEdit.image; // Set base64Image for the form

          // Handle save button for updating
          document.querySelector(".submitbtn").addEventListener("click", () => {
            const updatedHeadline = document.getElementById("headline").value;
            const updatedDescription = document.getElementById("description").value;
            const updatedCategory = document.querySelector("#selectcat").value;

            updatesPost(postId, updatedHeadline, updatedDescription, updatedCategory, base64Image);
          });
        } else {
          alert("Post not found.");
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
    });
}






function updatesPost(postId, updatedHeadline, updatedDescription, updatedCategory, updatedImage) {
  fetch(`${apiUrl}/latest`, {
    headers: {
      "X-Master-Key": apiKey,
    }
  })
    .then((response) => response.json())
    .then(data => {
      const posts = data?.record?.record?.posts;
      if (posts && Array.isArray(posts)) {
        const updatedPosts = posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              headline: updatedHeadline,
              desc: updatedDescription,
              category: updatedCategory,
              image: updatedImage || post.image,
            };
          }
          return post;
        });

        // Save the updated posts back to the bin
        return fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
          },
          body: JSON.stringify({ record: { posts: updatedPosts } }),
        });
      } else {
        throw new Error("Invalid data structure");
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      return response.json();
    })
    .then(() => {
      alert("Post updated successfully");


      
      // Close form and refresh posts
      formdiv.style.display = "none";
       isEditing = false;
      editPostId = null;
      fetchAndDisplayPosts();
    })
    .catch((error) => {
      console.error("Error updating post:", error);
    });
}










//delete post function
function deletePost(postId) {
  fetch(`${apiUrl}/latest`, {
    headers: {
      "X-Master-Key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Retrieve posts array from the fetched data
      const posts = data?.record?.record?.posts;

      // Ensure posts is an array
      if (posts && Array.isArray(posts)) {
        // Filter out the post with the matching postId
        const updatedPosts = posts.filter((post) => post.id !== postId);

        // Send PUT request to update the posts data
        return fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
          },
          body: JSON.stringify({ record: { posts: updatedPosts } }),
        });
      } else {
        throw new Error("Invalid data structure during delete");
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      return response.json();
    })
    .then(() => {
      // Fetch and display the updated list of posts
      fetchAndDisplayPosts();
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
    });
}

categorybutton.addEventListener("change", () => {
  fetchAndDisplayPosts();
});

function fetchAndDisplayPosts() {
  fetch(`${apiUrl}/latest`, {
    headers: {
      "X-Master-Key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Fetched data:", JSON.stringify(data, null, 2)); // Log the entire data
      const postscontainer = document.querySelector(".content");
      postscontainer.innerHTML = ""; // Clear previous posts

      const posts = data?.record?.record?.posts; // not to throw error thats why i add ?.

      console.log(posts);

      const selectedCategory = categorybutton.value;

      if (posts && Array.isArray(posts)) {
        //filter the posts to display
        const filteredPosts = selectedCategory
          ? posts.filter((post) => post.category === selectedCategory)
          : posts;
        //make display post dynamic
        displayPosts(selectedCategory ? filteredPosts : posts);
      } else {
        if (posts && !Array.isArray(posts)) {
          const p = [posts];
          displayPosts(p);
        }
      }

      // Validate data structure
      /* if (data.record && Array.isArray(data.record.posts)) {
        data.record.posts.forEach((post) => {
          displayPost(post);
        });
      } else {
        console.error("Invalid data structure:", JSON.stringify(data, null, 2));
      } */
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

//let see
function addReports(title, desc, catg, image, latitude, longitude) {
  // Fetch the latest posts from the API
  fetch(`${apiUrl}/latest`, { headers: { "X-Master-Key": apiKey } })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch the latest posts");
      }
      return response.json();
    })
    .then((data) => {
      // Create a new incident object with the obtained location
      const newIncident = {
        id: Date.now().toString(),
        headline: title,
        desc: desc,
        category: catg,
        postlocation: {
          longitude: longitude,
          latitude: latitude,
        },
        image: image || base64Image,
      };

      console.log(newIncident);

      // Retrieve the posts array directly from the data
      const posts = data?.record?.record?.posts || [];

      // Add the new incident to the posts array
      posts.push(newIncident);
      console.log(posts);

      // Update the posts data in the API with the new post added to the existing ones
      return fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify({ record: { posts } }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add post");
      }
      return response.json();
    })
    .then(() => {
      console.log("Post added successfully");

      // Reset the form fields
      document.getElementById("headline").value = "";
      document.getElementById("description").value = "";
      document.querySelector("#selectcat").value = "";
      document.querySelector(".preview-div").innerHTML = "+ preview";
      formdiv.style.display = "none";
      isEditing = false;
  editPostId = null;
      base64Image = "";

      // Fetch and display posts
      fetchAndDisplayPosts();
      alert("New Report Added");
    })
    .catch((error) => {
      console.error("Error adding post:", error.message);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.cordova) {
    // Running as a Cordova app on Android
    document.addEventListener(
      "deviceready",
      function () {
        var permissions = cordova.plugins.permissions;

        document.querySelector(".submitbtn").addEventListener("click", () => {
          const headline = document.getElementById("headline").value;
          const description = document.getElementById("description").value;
          const category = document.querySelector("#selectcat").value;
          const fileInput = document.querySelector(".fileinpt");
          const file = fileInput.files[0];
          let base64Image = "";

          if (isEditing && editPostId) {
            updatesPost(editPostId, headline, description, category, base64Image)
          }else{ // Check and request permission in Cordova environment
          permissions.hasPermission(
            permissions.ACCESS_FINE_LOCATION,
            function (status) {
              if (status.hasPermission) {
                // Permission is already granted, proceed to get the location
                getLocationAndProceed(
                  headline,
                  description,
                  category,
                  file,
                  base64Image
                );
              } else {
                // Request geolocation permission
                permissions.requestPermission(
                  permissions.ACCESS_FINE_LOCATION,
                  function (status) {
                    if (status.hasPermission) {
                      getLocationAndProceed(
                        headline,
                        description,
                        category,
                        file,
                        base64Image
                      );
                    } else {
                      alert(
                        "Geolocation permission is required to retrieve location."
                      );
                      handleLocationError(
                        headline,
                        description,
                        category,
                        file,
                        base64Image
                      );
                    }
                  },
                  function () {
                    alert("Geolocation permission request failed.");
                    handleLocationError(
                      headline,
                      description,
                      category,
                      file,
                      base64Image
                    );
                  }
                );
              }
            },
            null
          );}
        });
      },
      false
    );
  } else {
    // Running in a web browser
    document.querySelector(".submitbtn").addEventListener("click", () => {
      const headline = document.getElementById("headline").value;
      const description = document.getElementById("description").value;
      const category = document.querySelector("#selectcat").value;
      const fileInput = document.querySelector(".fileinpt");
      const file = fileInput.files[0];
      let base64Image = "";
      if (isEditing && editPostId) {
        updatesPost(editPostId, headline, description, category, base64Image);
      } else {  // Proceed to get the location directly in the browser environment
        getLocationAndProceed(headline, description, category, file, base64Image);
      }
     
     
    });
  }
});

function getLocationAndProceed(
  headline,
  description,
  category,
  file,
  base64Image
) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log(
        "i got clicked",
        headline,
        description,
        category,
        latitude,
        longitude
      );

      if (file && file.size > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
          addReports(
            headline,
            description,
            category,
            e.target.result,
            latitude,
            longitude
          );
        };
        reader.readAsDataURL(file);
      } else {
        console.log("no image provided");
        addReports(
          headline,
          description,
          category,
          base64Image,
          latitude,
          longitude
        );
      }
    },
    function (error) {
      console.error("Error getting location:", error);
      alert(
        "Unable to retrieve location. Please check your enable in settings. Settings > Apps > Reportera > Permissions >locations"
      );

      // Fallback in case location is not available
      handleLocationError(headline, description, category, file, base64Image);
    },
    {
      enableHighAccuracy: true,
    }
  );
}

function handleLocationError(
  headline,
  description,
  category,
  file,
  base64Image
) {
  const latitude = null;
  const longitude = null;

  if (file && file.size > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      addReports(
        headline,
        description,
        category,
        e.target.result,
        latitude,
        longitude
      );
    };
    reader.readAsDataURL(file);
  } else {
    addReports(
      headline,
      description,
      category,
      base64Image,
      latitude,
      longitude
    );
  }
}

fetchAndDisplayPosts();

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

setInterval(() => {
  //i am so dangerous [not advisable code to implement]
  console.log("re-fetch from JSON BIN");
  fetchAndDisplayPosts();
}, 60000);