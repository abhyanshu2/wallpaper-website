document.addEventListener("DOMContentLoaded", () => {
  restoreFavorites();
  updateUserGreeting();

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  document.getElementById("toggle-dark").onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  };
});

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
}

function toggleLogin() {
  const modal = document.getElementById("loginModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

function loginUser() {
  const user = document.getElementById("username").value;
  if (user.trim() !== "") {
    localStorage.setItem("wallpaperUser", user);
    updateUserGreeting();
    toggleLogin();
  } else {
    document.getElementById("loginMsg").textContent = "Please enter a username.";
  }
}

function updateUserGreeting() {
  const user = localStorage.getItem("wallpaperUser");
  if (user) {
    document.getElementById("loginBtn").innerHTML = `👤 ${user}`;
  }
}

function showFavorites() {
  const cards = document.querySelectorAll(".card");
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  cards.forEach(card => {
    card.style.display = favorites.includes(card.dataset.id) ? "block" : "none";
  });
}

function filterCategory(category) {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    const match = category === "All" || card.dataset.category === category;
    card.style.display = match ? "block" : "none";
  });
}

function toggleFavorite(btn) {
  const card = btn.closest(".card");
  const id = card.dataset.id;
  card.classList.toggle("favorited");
  btn.textContent = card.classList.contains("favorited") ? "❤️" : "🤍";

  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (card.classList.contains("favorited")) {
    if (!favorites.includes(id)) favorites.push(id);
  } else {
    favorites = favorites.filter(fav => fav !== id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function restoreFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  favorites.forEach(id => {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) {
      card.classList.add("favorited");
      const btn = card.querySelector(".fav-btn");
      if (btn) btn.textContent = "❤️";
    }
  });
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("fav-btn")) {
    toggleFavorite(e.target);
  }
});


window.onclick = function(event) {
  const modal = document.getElementById("loginModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

 /* User Upload section  */
 const uploadForm = document.getElementById("uploadForm");
const wallpaperInput = document.getElementById("wallpaperInput");
const previewContainer = document.getElementById("previewContainer");

uploadForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = wallpaperInput.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewContainer.innerHTML = ""; // clear preview
      previewContainer.appendChild(img);

      // Optional: Save in LocalStorage (you can replace this with backend upload)
      let uploads = JSON.parse(localStorage.getItem("uploadedWallpapers")) || [];
      uploads.push(e.target.result);
      localStorage.setItem("uploadedWallpapers", JSON.stringify(uploads));

      alert("Wallpaper uploaded successfully!");
    };

    reader.readAsDataURL(file);
  } else {
    alert("Please select a valid image file.");
  }
});