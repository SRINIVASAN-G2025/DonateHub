
function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "drives") {
        loadDrives();
    }

    if (sectionId === "donors") {
        loadDonors();
    }

    if (sectionId === "recipients") {
        loadRecipients();
    }

    if (sectionId === "items") {
        loadItems();
    }
}


async function loadDashboard() {

    try {

        const drivesResponse = await fetch("/api/drives");
        const donorsResponse = await fetch("/api/donors");
        const recipientsResponse = await fetch("/api/recipients");
        const itemsResponse = await fetch("/api/items");

        const drives = await drivesResponse.json();
        const donors = await donorsResponse.json();
        const recipients = await recipientsResponse.json();
        const items = await itemsResponse.json();

        document.getElementById("dashboardDriveCount").textContent =
            drives.length;

        document.getElementById("dashboardDonorCount").textContent =
            donors.length;

        document.getElementById("dashboardRecipientCount").textContent =
            recipients.length;

        document.getElementById("dashboardItemCount").textContent =
            items.length;

    } catch (error) {

        console.error("Dashboard loading error:", error);

    }
}



function openDriveForm() {

    document
        .getElementById("driveForm")
        .classList.remove("hidden");
}

function closeDriveForm() {

    document
        .getElementById("driveForm")
        .classList.add("hidden");
}


async function createDrive(event) {

    event.preventDefault();

    const drive = {

        name: document.getElementById("driveName").value,

        startDate:
            document.getElementById("driveStartDate").value,

        endDate:
            document.getElementById("driveEndDate").value
    };

    try {

        const response = await fetch("/api/drives", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(drive)
        });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to create drive");

            return;
        }

        alert("Drive created successfully!");

        document.querySelector("#driveForm form").reset();

        closeDriveForm();

        loadDrives();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}


async function loadDrives() {

    const container = document.getElementById("driveList");

    container.innerHTML = "<p class='empty-message'>Loading drives...</p>";

    try {

        const response = await fetch("/api/drives");

        if (!response.ok) {
            throw new Error("Failed to load drives");
        }

        const drives = await response.json();

        if (drives.length === 0) {

            container.innerHTML =
                "<p class='empty-message'>No donation drives found.</p>";

            return;
        }

        let html = `
            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>
        `;

        drives.forEach(drive => {

            html += `
                <tr>

                    <td>${drive.id}</td>

                    <td>${escapeHtml(drive.name)}</td>

                    <td>${drive.startDate}</td>

                    <td>${drive.endDate}</td>

                    <td>
                        <button
                            class="danger-btn"
                            onclick="deleteDrive(${drive.id})">
                            Delete
                        </button>
                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p class='empty-message'>Unable to load drives.</p>";
    }
}


// ======================================================
// DELETE DRIVE
// ======================================================

async function deleteDrive(id) {

    const confirmed =
        confirm("Are you sure you want to delete this drive?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`/api/drives/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to delete drive");

            return;
        }

        alert("Drive deleted successfully!");

        loadDrives();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}


// ======================================================
// DONOR FORM
// ======================================================

function openDonorForm() {

    document
        .getElementById("donorForm")
        .classList.remove("hidden");
}

function closeDonorForm() {

    document
        .getElementById("donorForm")
        .classList.add("hidden");
}


// ======================================================
// CREATE DONOR
// ======================================================

async function createDonor(event) {

    event.preventDefault();

    const donor = {

        name: document.getElementById("donorName").value,

        email: document.getElementById("donorEmail").value
    };

    try {

        const response = await fetch("/api/donors", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donor)
        });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to create donor");

            return;
        }

        alert("Donor created successfully!");

        document.querySelector("#donorForm form").reset();

        closeDonorForm();

        loadDonors();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}


// ======================================================
// LOAD DONORS
// ======================================================

async function loadDonors() {

    const container = document.getElementById("donorList");

    container.innerHTML =
        "<p class='empty-message'>Loading donors...</p>";

    try {

        const response = await fetch("/api/donors");

        const donors = await response.json();

        if (donors.length === 0) {

            container.innerHTML =
                "<p class='empty-message'>No donors found.</p>";

            return;
        }

        let html = `
            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>
        `;

        donors.forEach(donor => {

            html += `
                <tr>

                    <td>${donor.id}</td>

                    <td>${escapeHtml(donor.name)}</td>

                    <td>${escapeHtml(donor.email)}</td>

                    <td>

                        <button
                            class="danger-btn"
                            onclick="deleteDonor(${donor.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p class='empty-message'>Unable to load donors.</p>";
    }
}


// ======================================================
// DELETE DONOR
// ======================================================

async function deleteDonor(id) {

    if (!confirm("Are you sure you want to delete this donor?")) {
        return;
    }

    try {

        const response = await fetch(`/api/donors/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to delete donor");

            return;
        }

        alert("Donor deleted successfully!");

        loadDonors();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}


// ======================================================
// RECIPIENT FORM
// ======================================================

function openRecipientForm() {

    document
        .getElementById("recipientForm")
        .classList.remove("hidden");
}

function closeRecipientForm() {

    document
        .getElementById("recipientForm")
        .classList.add("hidden");
}


// ======================================================
// CREATE RECIPIENT
// ======================================================

async function createRecipient(event) {

    event.preventDefault();

    const recipient = {

        name:
            document.getElementById("recipientName").value,

        organization:
            document.getElementById("recipientOrganization").value
    };

    try {

        const response = await fetch("/api/recipients", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(recipient)
        });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to create recipient");

            return;
        }

        alert("Recipient created successfully!");

        document.querySelector("#recipientForm form").reset();

        closeRecipientForm();

        loadRecipients();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}


// ======================================================
// LOAD RECIPIENTS
// ======================================================

async function loadRecipients() {

    const container =
        document.getElementById("recipientList");

    container.innerHTML =
        "<p class='empty-message'>Loading recipients...</p>";

    try {

        const response =
            await fetch("/api/recipients");

        const recipients =
            await response.json();

        if (recipients.length === 0) {

            container.innerHTML =
                "<p class='empty-message'>No recipients found.</p>";

            return;
        }

        let html = `
            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Organization</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>
        `;

        recipients.forEach(recipient => {

            html += `
                <tr>

                    <td>${recipient.id}</td>

                    <td>${escapeHtml(recipient.name)}</td>

                    <td>${escapeHtml(recipient.organization)}</td>

                    <td>

                        <button
                            class="danger-btn"
                            onclick="deleteRecipient(${recipient.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p class='empty-message'>Unable to load recipients.</p>";
    }
}



async function deleteRecipient(id) {

    if (!confirm("Are you sure you want to delete this recipient?")) {
        return;
    }

    try {

        const response =
            await fetch(`/api/recipients/${id}`, {

                method: "DELETE"

            });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to delete recipient");

            return;
        }

        alert("Recipient deleted successfully!");

        loadRecipients();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}

function openItemForm() {

    document
        .getElementById("itemForm")
        .classList.remove("hidden");

    loadDriveDropdown();

    loadDonorDropdown();
}

function closeItemForm() {

    document
        .getElementById("itemForm")
        .classList.add("hidden");
}

async function loadDriveDropdown() {

    const select =
        document.getElementById("itemDrive");

    try {

        const response =
            await fetch("/api/drives");

        const drives =
            await response.json();

        select.innerHTML =
            `<option value="">Select drive</option>`;

        drives.forEach(drive => {

            select.innerHTML += `
                <option value="${drive.id}">
                    ${escapeHtml(drive.name)}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }
}


async function loadDonorDropdown() {

    const select =
        document.getElementById("itemDonor");

    try {

        const response =
            await fetch("/api/donors");

        const donors =
            await response.json();

        select.innerHTML =
            `<option value="">Select donor</option>`;

        donors.forEach(donor => {

            select.innerHTML += `
                <option value="${donor.id}">
                    ${escapeHtml(donor.name)}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }
}


async function createDonation(event) {

    event.preventDefault();

    const donation = {

        category:
            document.getElementById("itemCategory").value,

        condition:
            document.getElementById("itemCondition").value,

        donationDate:
            document.getElementById("itemDonationDate").value,

        driveId:
            Number(document.getElementById("itemDrive").value),

        donorId:
            Number(document.getElementById("itemDonor").value)
    };

    try {

        const response =
            await fetch("/api/items", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(donation)

            });

        if (!response.ok) {

            const error = await response.json();

            alert(error.message || "Unable to create donation");

            return;
        }

        alert("Donation created successfully!");

        document.querySelector("#itemForm form").reset();

        closeItemForm();

        loadItems();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}

async function loadItems() {

    const container =
        document.getElementById("itemList");

    container.innerHTML =
        "<p class='empty-message'>Loading donated items...</p>";

    try {

        const response =
            await fetch("/api/items");

        const items =
            await response.json();

        if (items.length === 0) {

            container.innerHTML =
                "<p class='empty-message'>No donated items found.</p>";

            return;
        }

        let html = `
            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Category</th>

                        <th>Condition</th>

                        <th>Donation Date</th>

                        <th>Donor</th>

                        <th>Drive</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>
        `;

        items.forEach(item => {

            const status =
                item.distributed
                    ? "Distributed"
                    : "Available";

            const statusClass =
                item.distributed
                    ? "status-distributed"
                    : "status-available";

            const donorName =
                item.donor
                    ? item.donor.name
                    : "-";

            const driveName =
                item.drive
                    ? item.drive.name
                    : "-";

            html += `
                <tr>

                    <td>${item.id}</td>

                    <td>${escapeHtml(item.category)}</td>

                    <td>${item.condition}</td>

                    <td>${item.donationDate}</td>

                    <td>${escapeHtml(donorName)}</td>

                    <td>${escapeHtml(driveName)}</td>

                    <td class="${statusClass}">
                        ${status}
                    </td>

                    <td>

                        ${
                            item.distributed
                            ?
                            "-"
                            :
                            `
                            <button
                                class="primary-btn"
                                onclick="distributeItem(${item.id})">
                                Distribute
                            </button>
                            `
                        }

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p class='empty-message'>Unable to load donated items.</p>";
    }
}


async function distributeItem(itemId) {

    try {

        const recipientResponse =
            await fetch("/api/recipients");

        const recipients =
            await recipientResponse.json();

        if (recipients.length === 0) {

            alert(
                "Please create at least one recipient first."
            );

            return;
        }

        let message =
            "Select Recipient ID:\n\n";

        recipients.forEach(recipient => {

            message +=
                `${recipient.id} - ${recipient.name} (${recipient.organization})\n`;

        });

        const recipientId =
            prompt(message);

        if (!recipientId) {
            return;
        }

        const distributionDate =
            prompt(
                "Enter distribution date (YYYY-MM-DD):"
            );

        if (!distributionDate) {
            return;
        }

        const request = {

            recipientId:
                Number(recipientId),

            distributionDate:
                distributionDate
        };

        const response =
            await fetch(
                `/api/items/${itemId}/distribute`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(request)
                }
            );

        if (!response.ok) {

            const error = await response.json();

            alert(
                error.message ||
                "Unable to distribute item"
            );

            return;
        }

        alert("Item distributed successfully!");

        loadItems();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }
}



function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



document.addEventListener("DOMContentLoaded", function () {

    loadDashboard();

});