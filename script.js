
// =====================================
// TRIPMATE - PERSONALISED TRAVEL PLANNER
// =====================================

// 1. DESTINATION DATABASE

const places = [
    {
        id: 1,
        name: "Lalbagh Botanical Garden",
        city: "Bengaluru",
        interest: "Nature",
        cost: 50,
        duration: "2 hours",
        description: "Explore beautiful gardens, rare plants and the famous glass house.",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8"
    },
    {
        id: 2,
        name: "Bengaluru Palace",
        city: "Bengaluru",
        interest: "History",
        cost: 250,
        duration: "2 hours",
        description: "Discover royal architecture and the history of the Mysore royal family.",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144"
    },
    {
        id: 3,
        name: "Wonderla",
        city: "Bengaluru",
        interest: "Entertainment",
        cost: 1200,
        duration: "5 hours",
        description: "Enjoy exciting rides and a fun-filled amusement park experience.",
        image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf"
    },
    {
        id: 4,
        name: "ISKCON Temple",
        city: "Bengaluru",
        interest: "Spiritual",
        cost: 0,
        duration: "1 hour",
        description: "Visit a beautiful temple known for its spiritual atmosphere.",
        image: "https://images.unsplash.com/photo-1604608672516-f1b9d6a2c1d8"
    },
    {
        id: 5,
        name: "Mysore Palace",
        city: "Mysuru",
        interest: "History",
        cost: 100,
        duration: "2 hours",
        description: "Explore the magnificent royal palace of Mysuru.",
        image: "https://images.unsplash.com/photo-1600100397608-f0109c7e9c4a"
    },
    {
        id: 6,
        name: "Brindavan Gardens",
        city: "Mysuru",
        interest: "Nature",
        cost: 30,
        duration: "2 hours",
        description: "Enjoy beautiful gardens and the famous musical fountain.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    },
    {
        id: 7,
        name: "Chamundi Hills",
        city: "Mysuru",
        interest: "Spiritual",
        cost: 0,
        duration: "2 hours",
        description: "Experience scenic views and visit the famous Chamundeshwari Temple.",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
    },
    {
        id: 8,
        name: "Dubare Elephant Camp",
        city: "Coorg",
        interest: "Nature",
        cost: 200,
        duration: "3 hours",
        description: "Experience nature and learn about elephant conservation.",
        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46"
    },
    {
        id: 9,
        name: "Abbey Falls",
        city: "Coorg",
        interest: "Nature",
        cost: 20,
        duration: "2 hours",
        description: "Enjoy the beautiful waterfall surrounded by greenery.",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9"
    },
    {
        id: 10,
        name: "Adventure Activities",
        city: "Coorg",
        interest: "Adventure",
        cost: 800,
        duration: "3 hours",
        description: "Explore exciting outdoor activities and adventure experiences.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
    },
    {
        id: 11,
        name: "Mullayanagiri",
        city: "Chikkamagaluru",
        interest: "Adventure",
        cost: 0,
        duration: "3 hours",
        description: "Enjoy trekking and beautiful mountain scenery.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    },
    {
        id: 12,
        name: "Coffee Plantations",
        city: "Chikkamagaluru",
        interest: "Nature",
        cost: 150,
        duration: "2 hours",
        description: "Explore peaceful coffee estates and learn about coffee cultivation.",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e"
    }
];


// 2. GET HTML ELEMENTS

const tripForm = document.getElementById("tripForm");
const results = document.getElementById("results");
const itinerary = document.getElementById("itinerary");
const favourites = document.getElementById("favourites");

const tripActions = document.getElementById("tripActions");
const saveTripButton = document.getElementById("saveTrip");
const printTripButton = document.getElementById("printTrip");
const saveMessage = document.getElementById("saveMessage");


// 3. APPLICATION DATA

let selectedPlaces = [];
let favouritePlaces = JSON.parse(
    localStorage.getItem("tripMateFavourites") || "[]"
);

let currentBudget = 0;
let currentDays = 1;
let currentCity = "";


// 4. GENERATE TRAVEL PLAN

tripForm.addEventListener("submit", function(event) {

    event.preventDefault();

    currentCity = document.getElementById("city").value;
    currentBudget = Number(document.getElementById("budget").value);
    currentDays = Number(document.getElementById("days").value);

    const selectedInterests = Array.from(
        document.querySelectorAll('input[name="interest"]:checked')
    ).map(input => input.value);

    if (!selectedInterests.length) {
        alert("Please select at least one interest!");
        return;
    }

    if (
        !Number.isFinite(currentBudget) ||
        currentBudget <= 0 ||
        !Number.isInteger(currentDays) ||
        currentDays < 1 ||
        currentDays > 10
    ) {
        alert("Please enter a valid budget and travel duration.");
        return;
    }

    // Find places based on city and interests

    const recommendedPlaces = places.filter(place =>
        place.city === currentCity &&
        selectedInterests.includes(place.interest) &&
        place.cost <= currentBudget
    );

    displayRecommendations(recommendedPlaces);

    // Automatically create an initial itinerary
    selectedPlaces = [];

    let remainingBudget = currentBudget;

    for (let place of recommendedPlaces) {

        if (
            selectedPlaces.length < currentDays * 2 &&
            place.cost <= remainingBudget
        ) {
            selectedPlaces.push(place);
            remainingBudget -= place.cost;
        }
    }

    displayItinerary();

    saveMessage.textContent = "";

    document.getElementById("destinations").scrollIntoView({
        behavior: "smooth"
    });

});


// 5. DISPLAY RECOMMENDATIONS

function displayRecommendations(recommendedPlaces) {

    if (recommendedPlaces.length === 0) {

        results.innerHTML = `
            <div class="empty-message">
                <span>🔍</span>
                <h3>No matching places found</h3>
                <p>Try selecting different interests or increasing your budget.</p>
            </div>
        `;

        return;
    }

    results.innerHTML = recommendedPlaces.map(place => `

        <div class="place-card">

            <img
                src="${place.image}"
                alt="${place.name}"
                loading="lazy"
                onerror="this.src='https://placehold.co/600x400?text=Travel+Destination'"
            >

            <div class="place-info">

                <h3>${place.name}</h3>

                <p>${place.description}</p>

                <p class="place-meta">
                    ₹${place.cost} | ${place.duration}
                </p>

                <div class="card-buttons">

                    <button class="add-btn"
                        data-action="add"
                        data-id="${place.id}">
                        + Add to trip
                    </button>

                    <button class="fav-btn"
                        data-action="favourite"
                        data-id="${place.id}">
                        ${favouritePlaces.includes(place.id) ? "❤️ Saved" : "♡ Favourite"}
                    </button>

                </div>

            </div>

        </div>

    `).join("");

}


// 6. ADD PLACES TO ITINERARY

results.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    const place = places.find(item => item.id === id);

    if (!place) return;

    if (button.dataset.action === "add") {

        if (selectedPlaces.some(item => item.id === id)) {
            alert("This place is already in your itinerary!");
            return;
        }

        const currentCost = selectedPlaces.reduce(
            (total, item) => total + item.cost, 0
        );

        if (currentCost + place.cost > currentBudget) {
            alert("Adding this place would exceed your budget!");
            return;
        }

        if (selectedPlaces.length >= currentDays * 2) {
            alert("You have reached the initial limit of two places per day.");
            return;
        }

        selectedPlaces.push(place);

        displayItinerary();

        saveMessage.textContent = "";

    }

    if (button.dataset.action === "favourite") {

        toggleFavourite(id);

        displayRecommendations(
            places.filter(item =>
                item.city === currentCity &&
                item.cost <= currentBudget
            ).filter(item =>
                Array.from(
                    document.querySelectorAll('input[name="interest"]:checked')
                ).some(input => input.value === item.interest)
            )
        );

    }

});


// 7. DISPLAY ITINERARY DAY BY DAY

function displayItinerary() {

    tripActions.hidden = true;

    if (selectedPlaces.length === 0) {

        itinerary.innerHTML = `
            <div class="empty-message">
                <span>🗺️</span>
                <h3>No places added</h3>
                <p>Add destinations to create your itinerary.</p>
            </div>
        `;

        return;
    }

    let totalCost = selectedPlaces.reduce(
        (total, place) => total + place.cost, 0
    );

    let html = "";

    for (let day = 0; day < currentDays; day++) {

        const dayPlaces = selectedPlaces.slice(day * 2, day * 2 + 2);

        if (dayPlaces.length === 0) continue;

        html += `
            <div class="day-card">

                <h3>📅 Day ${day + 1}</h3>

                ${dayPlaces.map(place => `

                    <div class="itinerary-place">

                        <strong>${place.name}</strong>

                        <p>📍 ${place.city}</p>

                        <p>⏱ ${place.duration}</p>

                        <p>Entry cost: ₹${place.cost}</p>

                        <button
                            data-remove="${place.id}"
                            aria-label="Remove ${place.name}">
                            Remove
                        </button>

                        <div style="clear: both;"></div>

                    </div>

                `).join("")}

            </div>
        `;
    }

    html += `
        <div class="trip-total">
            Estimated Entry Cost: ₹${totalCost}
        </div>

        <p style="text-align:right; color:#68776e;">
            Remaining Budget: ₹${currentBudget - totalCost}
        </p>
    `;

    itinerary.innerHTML = html;

    tripActions.hidden = false;

}


// 8. REMOVE PLACES

itinerary.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-remove]");

    if (!button) return;

    const id = Number(button.dataset.remove);

    selectedPlaces = selectedPlaces.filter(
        place => place.id !== id
    );

    displayItinerary();

    saveMessage.textContent = "";

});


// 9. FAVOURITES FUNCTION

function toggleFavourite(id) {

    if (favouritePlaces.includes(id)) {

        favouritePlaces = favouritePlaces.filter(
            item => item !== id
        );

    } else {

        favouritePlaces.push(id);

    }

    localStorage.setItem(
        "tripMateFavourites",
        JSON.stringify(favouritePlaces)
    );

    displayFavourites();

}


// 10. DISPLAY FAVOURITES

function displayFavourites() {

    const savedPlaces = places.filter(place =>
        favouritePlaces.includes(place.id)
    );

    if (savedPlaces.length === 0) {

        favourites.innerHTML = `
            <p class="empty-favourite">
                You haven't saved any favourites yet.
            </p>
        `;

        return;
    }

    favourites.innerHTML = savedPlaces.map(place => `

        <div class="place-card">

            <img src="${place.image}"
                alt="${place.name}"
                loading="lazy"
                onerror="this.src='https://placehold.co/600x400?text=Travel+Destination'">

            <div class="place-info">

                <h3>${place.name}</h3>

                <p>${place.city}</p>

                <p class="place-meta">₹${place.cost}</p>

                <button class="fav-btn"
                    data-action="favourite"
                    data-id="${place.id}">
                    ❤️ Remove Favourite
                </button>

            </div>

        </div>

    `).join("");

}


// Favourite section button functionality

favourites.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    toggleFavourite(id);

});


// 11. SAVE TRIP

saveTripButton.addEventListener("click", function() {

    const tripData = {
        city: currentCity,
        budget: currentBudget,
        days: currentDays,
        places: selectedPlaces
    };

    localStorage.setItem(
        "tripMateSavedTrip",
        JSON.stringify(tripData)
    );

    saveMessage.textContent = "✅ Your trip has been saved successfully!";

});


// 12. PRINT ITINERARY

printTripButton.addEventListener("click", function() {

    window.print();

});


// 13. LOAD SAVED FAVOURITES

displayFavourites();

