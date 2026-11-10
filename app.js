
// Smart Parking System
// Frontend Simulation Demo
// 31261 Internetworking Project

// 1. Simulated parking sensor data
const parkingSpaces = [
    {
        id: "A01",
        spotId: 1001,
        occupied: false,
        online: true,
        lastUpdate: new Date()
    },
    {
        id: "A02",
        spotId: 1002,
        occupied: true,
        online: true,
        lastUpdate: new Date()
    },
    {
        id: "A03",
        spotId: 1003,
        occupied: false,
        online: false,
        lastUpdate: null
    }
];

// 2. Determine parking status
function getParkingStatus(space) {
    if (!space.online) {
        return "unknown";
    }

    return space.occupied ? "occupied" : "available";
}

// 3. Update Parking Dashboard
function updateDashboard() {
    const parkingGrid = document.getElementById("parkingGrid");

    parkingGrid.innerHTML = "";

    let available = 0;
    let occupied = 0;
    let unknown = 0;

    parkingSpaces.forEach(space => {
        const status = getParkingStatus(space);

        if (status === "available") available++;
        if (status === "occupied") occupied++;
        if (status === "unknown") unknown++;

        const card = document.createElement("div");
        card.className = "parking-card " + status;

        const title = document.createElement("h3");
        title.textContent = space.id;

        const badge = document.createElement("span");
        badge.className = "status-badge";
        badge.textContent =
            status.charAt(0).toUpperCase() + status.slice(1);

        card.appendChild(title);
        card.appendChild(badge);
        parkingGrid.appendChild(card);
    });

    document.getElementById("availableCount").textContent = available;
    document.getElementById("occupiedCount").textContent = occupied;
    document.getElementById("unknownCount").textContent = unknown;
}

// 4. Update Admin View
function updateAdminView() {
    const tableBody = document.getElementById("adminTableBody");

    tableBody.innerHTML = "";

    parkingSpaces.forEach(space => {
        const row = document.createElement("tr");

        const sensorId = document.createElement("td");
        sensorId.textContent = space.id;

        const parkingStatus = document.createElement("td");
        parkingStatus.textContent = getParkingStatus(space);

        const connection = document.createElement("td");
        connection.textContent = space.online ? "Online" : "Offline";
        connection.className =
            "connection " + (space.online ? "online" : "offline");

        const lastUpdate = document.createElement("td");
        lastUpdate.textContent = space.lastUpdate
            ? space.lastUpdate.toLocaleTimeString()
            : "No data";

        row.appendChild(sensorId);
        row.appendChild(parkingStatus);
        row.appendChild(connection);
        row.appendChild(lastUpdate);

        tableBody.appendChild(row);
    });
}

// 5. Navigation between Dashboard and Admin View
const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));

        tab.classList.add("active");

        const pageId = tab.dataset.page;
        document.getElementById(pageId).classList.add("active");
    });
});

// 6. Simulated sensor updates
// These are generated locally, not received from ESP32.
let simulationStep = 0;

function simulateSensorUpdates() {
    simulationStep++;

    // Change the first parking space every 10 seconds
    if (simulationStep % 2 === 0) {
        parkingSpaces[0].occupied = !parkingSpaces[0].occupied;
    }

    // Change the second parking space every 15 seconds
    if (simulationStep % 3 === 0) {
        parkingSpaces[1].occupied = !parkingSpaces[1].occupied;
    }

    // Simulated heartbeat from online sensors
    parkingSpaces.forEach(space => {
        if (space.online) {
            space.lastUpdate = new Date();
        }
    });

    updateDashboard();
    updateAdminView();
}

// 7. Initialise application
updateDashboard();
updateAdminView();

// Simulate new readings every 5 seconds
setInterval(simulateSensorUpdates, 5000);
