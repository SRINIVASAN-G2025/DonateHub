const API_BASE = "/api";



/* =========================================================
   COMMON HELPERS
   ========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



async function getJson(url, options = {}) {

    const response =
        await fetch(url, options);

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    return {
        response,
        data
    };
}



function getErrorMessage(data, fallback) {

    if (data && data.message) {
        return data.message;
    }

    if (data && data.error) {
        return data.error;
    }

    return fallback;
}



/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {

        section.classList.remove("active");

    });


    const selectedSection =
        document.getElementById(sectionId);

    if (!selectedSection) {
        return;
    }

    selectedSection.classList.add("active");


    const menuButtons =
        document.querySelectorAll(".menu-btn");

    menuButtons.forEach(button => {

        button.classList.remove("active");

        const onclickValue =
            button.getAttribute("onclick");

        if (
            onclickValue &&
            onclickValue.includes(
                "'" + sectionId + "'"
            )
        ) {

            button.classList.add("active");

        }

    });


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
        loadItems(false);
    }

}



/* =========================================================
   DASHBOARD
   ========================================================= */

async function loadDashboard() {

    try {

        const [
            drivesResult,
            donorsResult,
            recipientsResult,
            itemsResult
        ] = await Promise.all([

            getJson(`${API_BASE}/drives`),

            getJson(`${API_BASE}/donors`),

            getJson(`${API_BASE}/recipients`),

            getJson(`${API_BASE}/items`)

        ]);


        const driveCount =
            document.getElementById(
                "dashboardDriveCount"
            );

        const donorCount =
            document.getElementById(
                "dashboardDonorCount"
            );

        const recipientCount =
            document.getElementById(
                "dashboardRecipientCount"
            );

        const itemCount =
            document.getElementById(
                "dashboardItemCount"
            );

        const undistributedCount =
            document.getElementById(
                "dashboardUndistributedCount"
            );


        if (
            drivesResult.response.ok &&
            Array.isArray(drivesResult.data)
        ) {

            driveCount.textContent =
                drivesResult.data.length;

        }


        if (
            donorsResult.response.ok &&
            Array.isArray(donorsResult.data)
        ) {

            donorCount.textContent =
                donorsResult.data.length;

        }


        if (
            recipientsResult.response.ok &&
            Array.isArray(recipientsResult.data)
        ) {

            recipientCount.textContent =
                recipientsResult.data.length;

        }


        if (
            itemsResult.response.ok &&
            Array.isArray(itemsResult.data)
        ) {

            const items =
                itemsResult.data;

            itemCount.textContent =
                items.length;


            const undistributedItems =
                items.filter(
                    item =>
                        item.distributed !== true
                );


            undistributedCount.textContent =
                undistributedItems.length;

        }

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}



/* =========================================================
   DRIVES
   ========================================================= */

function openDriveForm() {

    const form =
        document.getElementById("driveForm");

    form.classList.remove("hidden");

    document.getElementById(
        "driveName"
    ).focus();

}



function closeDriveForm() {

    const form =
        document.getElementById("driveForm");

    form.classList.add("hidden");

    const formElement =
        form.querySelector("form");

    if (formElement) {
        formElement.reset();
    }

}



async function createDrive(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "driveName"
        ).value.trim();

    const startDate =
        document.getElementById(
            "driveStartDate"
        ).value;

    const endDate =
        document.getElementById(
            "driveEndDate"
        ).value;


    if (endDate < startDate) {

        alert(
            "End date cannot be before start date."
        );

        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/drives`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        startDate,
                        endDate
                    })
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to create drive."
                )
            );

            return;
        }


        alert(
            "Donation drive created successfully."
        );


        closeDriveForm();

        loadDrives();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}



async function loadDrives() {

    const container =
        document.getElementById(
            "driveList"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading drives...</p>";


    try {

        const result =
            await getJson(
                `${API_BASE}/drives`
            );


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {

            container.innerHTML =
                "<p>Unable to load drives.</p>";

            return;
        }


        const drives =
            result.data;


        if (drives.length === 0) {

            container.innerHTML =
                "<p>No donation drives found.</p>";

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

                    <td>
                        ${drive.id}
                    </td>

                    <td>
                        ${escapeHtml(drive.name)}
                    </td>

                    <td>
                        ${drive.startDate}
                    </td>

                    <td>
                        ${drive.endDate}
                    </td>

                    <td>

                        <button
                            class="table-btn delete-btn"
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


        container.innerHTML =
            html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load drives.</p>";

    }

}



async function deleteDrive(id) {

    if (
        !confirm(
            "Delete this drive?"
        )
    ) {
        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/drives/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to delete drive."
                )
            );

            return;
        }


        alert(
            "Drive deleted successfully."
        );


        loadDrives();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}



/* =========================================================
   DONORS
   ========================================================= */

function openDonorForm() {

    document
        .getElementById("donorForm")
        .classList.remove("hidden");

    document
        .getElementById("donorName")
        .focus();

}



function closeDonorForm() {

    const form =
        document.getElementById(
            "donorForm"
        );

    form.classList.add("hidden");

    const formElement =
        form.querySelector("form");

    if (formElement) {
        formElement.reset();
    }

}



async function createDonor(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "donorName"
        ).value.trim();

    const email =
        document.getElementById(
            "donorEmail"
        ).value.trim();


    try {

        const result =
            await getJson(
                `${API_BASE}/donors`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email
                    })
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to create donor."
                )
            );

            return;
        }


        alert(
            "Donor created successfully."
        );


        closeDonorForm();

        loadDonors();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}



async function loadDonors() {

    const container =
        document.getElementById(
            "donorList"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading donors...</p>";


    try {

        const result =
            await getJson(
                `${API_BASE}/donors`
            );


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {

            container.innerHTML =
                "<p>Unable to load donors.</p>";

            return;
        }


        const donors =
            result.data;


        if (donors.length === 0) {

            container.innerHTML =
                "<p>No donors found.</p>";

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

                    <td>
                        ${donor.id}
                    </td>

                    <td>
                        ${escapeHtml(donor.name)}
                    </td>

                    <td>
                        ${escapeHtml(donor.email)}
                    </td>

                    <td>

                        <button
                            class="table-btn delete-btn"
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


        container.innerHTML =
            html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load donors.</p>";

    }

}



async function deleteDonor(id) {

    if (
        !confirm(
            "Delete this donor?"
        )
    ) {
        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/donors/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to delete donor."
                )
            );

            return;
        }


        alert(
            "Donor deleted successfully."
        );


        loadDonors();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}



/* =========================================================
   RECIPIENTS
   ========================================================= */

function openRecipientForm() {

    document
        .getElementById("recipientForm")
        .classList.remove("hidden");

    document
        .getElementById("recipientName")
        .focus();

}



function closeRecipientForm() {

    const form =
        document.getElementById(
            "recipientForm"
        );

    form.classList.add("hidden");

    const formElement =
        form.querySelector("form");

    if (formElement) {
        formElement.reset();
    }

}



async function createRecipient(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "recipientName"
        ).value.trim();

    const organization =
        document.getElementById(
            "recipientOrganization"
        ).value.trim();


    try {

        const result =
            await getJson(
                `${API_BASE}/recipients`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        organization
                    })
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to create recipient."
                )
            );

            return;
        }


        alert(
            "Recipient created successfully."
        );


        closeRecipientForm();

        loadRecipients();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}



async function loadRecipients() {

    const container =
        document.getElementById(
            "recipientList"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading recipients...</p>";


    try {

        const result =
            await getJson(
                `${API_BASE}/recipients`
            );


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {

            container.innerHTML =
                "<p>Unable to load recipients.</p>";

            return;
        }


        const recipients =
            result.data;


        if (recipients.length === 0) {

            container.innerHTML =
                "<p>No recipients found.</p>";

            return;
        }


        let html = `

            <table>

                <thead>

                    <tr>

                        <th>No.</th>

                        <th>Name</th>

                        <th>Organization</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

        `;


        recipients.forEach(
            (recipient, index) => {

                html += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHtml(
                                recipient.name
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                recipient.organization
                            )}
                        </td>

                        <td>

                            <button
                                class="table-btn delete-btn"
                                onclick="deleteRecipient(${recipient.id})">

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                </tbody>

            </table>

        `;


        container.innerHTML =
            html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load recipients.</p>";

    }

}



async function deleteRecipient(id) {

    if (
        !confirm(
            "Delete this recipient?"
        )
    ) {
        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/recipients/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to delete recipient."
                )
            );

            return;
        }


        alert(
            "Recipient deleted successfully."
        );


        loadRecipients();

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}



/* =========================================================
   DONATION FORM
   ========================================================= */

async function openItemForm() {

    const form =
        document.getElementById(
            "itemForm"
        );

    form.classList.remove("hidden");


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "itemDonationDate"
    ).value = today;


    await Promise.all([

        loadDrivesIntoSelect(),

        loadDonorsIntoSelect()

    ]);


    document.getElementById(
        "itemCategory"
    ).focus();

}



function closeItemForm() {

    const form =
        document.getElementById(
            "itemForm"
        );

    form.classList.add("hidden");


    const formElement =
        form.querySelector("form");

    if (formElement) {
        formElement.reset();
    }

}



async function loadDrivesIntoSelect() {

    const select =
        document.getElementById(
            "itemDrive"
        );

    if (!select) {
        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/drives`
            );


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {
            return;
        }


        select.innerHTML = `

            <option value="">
                Select drive
            </option>

        `;


        result.data.forEach(drive => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                drive.id;

            option.textContent =
                drive.name;

            select.appendChild(
                option
            );

        });

    } catch (error) {

        console.error(
            "Drive select loading error:",
            error
        );

    }

}



async function loadDonorsIntoSelect() {

    const select =
        document.getElementById(
            "itemDonor"
        );

    if (!select) {
        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/donors`
            );


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {
            return;
        }


        select.innerHTML = `

            <option value="">
                Select donor
            </option>

        `;


        result.data.forEach(donor => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                donor.id;

            option.textContent =
                donor.name;

            select.appendChild(
                option
            );

        });

    } catch (error) {

        console.error(
            "Donor select loading error:",
            error
        );

    }

}



/* =========================================================
   CREATE DONATION
   ========================================================= */

async function createDonation(event) {

    event.preventDefault();


    const category =
        document.getElementById(
            "itemCategory"
        ).value.trim();

    const condition =
        document.getElementById(
            "itemCondition"
        ).value;

    const donationDate =
        document.getElementById(
            "itemDonationDate"
        ).value;

    const driveId =
        document.getElementById(
            "itemDrive"
        ).value;

    const donorId =
        document.getElementById(
            "itemDonor"
        ).value;


    if (!category) {

        alert(
            "Please enter item category."
        );

        return;
    }


    if (!condition) {

        alert(
            "Please select item condition."
        );

        return;
    }


    if (!donationDate) {

        alert(
            "Please select donation date."
        );

        return;
    }


    if (!driveId) {

        alert(
            "Please select a drive."
        );

        return;
    }


    if (!donorId) {

        alert(
            "Please select a donor."
        );

        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/items`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        category,

                        condition,

                        donationDate,

                        driveId:
                            Number(driveId),

                        donorId:
                            Number(donorId)

                    })
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to save donation."
                )
            );

            return;
        }


        alert(
            "Donation saved successfully."
        );


        closeItemForm();

        loadItems(false);

        loadDashboard();

    } catch (error) {

        console.error(
            "Donation creation error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}



/* =========================================================
   DONATED ITEMS
   ========================================================= */

async function loadItems(
    availableOnly = false
) {

    const container =
        document.getElementById(
            "itemList"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading donated items...</p>";


    const allItemsBtn =
        document.getElementById(
            "allItemsBtn"
        );

    const availableItemsBtn =
        document.getElementById(
            "availableItemsBtn"
        );


    if (allItemsBtn) {

        allItemsBtn.classList.toggle(
            "active",
            !availableOnly
        );

    }


    if (availableItemsBtn) {

        availableItemsBtn.classList.toggle(
            "active",
            availableOnly
        );

    }


    try {

        const url =
            availableOnly
                ? `${API_BASE}/items/available`
                : `${API_BASE}/items`;


        const result =
            await getJson(url);


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {

            container.innerHTML =
                "<p>Unable to load donated items.</p>";

            return;
        }


        const items =
            result.data;


        if (items.length === 0) {

            container.innerHTML =
                availableOnly
                    ? "<p>No undistributed items remaining in stock.</p>"
                    : "<p>No donated items found.</p>";

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

                        <th>Drive</th>

                        <th>Donor</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

        `;


        items.forEach(
            (item, index) => {

                const distributed =
                    item.distributed === true;


                const driveName =
                    item.drive
                        ? item.drive.name
                        : "-";


                const donorName =
                    item.donor
                        ? item.donor.name
                        : "-";


                html += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHtml(
                                item.category
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                item.condition
                            )}
                        </td>

                        <td>
                            ${item.donationDate}
                        </td>

                        <td>
                            ${escapeHtml(
                                driveName
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                donorName
                            )}
                        </td>

                        <td>

                            ${
                                distributed

                                ? `

                                    <span
                                        class="status-badge status-distributed">

                                        Distributed

                                    </span>

                                  `

                                : `

                                    <span
                                        class="status-badge status-available">

                                        Available

                                    </span>

                                  `
                            }

                        </td>

                        <td>

                            ${
                                !distributed

                                ? `

                                    <button
                                        class="table-btn distribute-btn"
                                        onclick="openDistributionModal(${item.id})">

                                        Distribute

                                    </button>

                                  `

                                : `

                                    <span>
                                        -
                                    </span>

                                  `
                            }

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                </tbody>

            </table>

        `;


        container.innerHTML =
            html;

    } catch (error) {

        console.error(
            "Donated items loading error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load donated items.</p>";

    }

}



/* =========================================================
   DISTRIBUTION MODAL
   ========================================================= */

async function openDistributionModal(
    itemId
) {

    const modal =
        document.getElementById(
            "distributionModal"
        );

    const itemIdInput =
        document.getElementById(
            "distributionItemId"
        );

    const recipientSelect =
        document.getElementById(
            "distributionRecipient"
        );

    const distributionDate =
        document.getElementById(
            "distributionDate"
        );


    if (
        !modal ||
        !itemIdInput ||
        !recipientSelect ||
        !distributionDate
    ) {

        console.error(
            "Distribution modal elements not found."
        );

        return;
    }


    itemIdInput.value =
        itemId;


    distributionDate.value =
        new Date()
            .toISOString()
            .split("T")[0];


    recipientSelect.innerHTML = `

        <option value="">
            Loading recipients...
        </option>

    `;


    modal.classList.remove(
        "hidden"
    );


    await loadRecipientsForDistribution();

}



async function loadRecipientsForDistribution() {

    const select =
        document.getElementById(
            "distributionRecipient"
        );

    if (!select) {
        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/recipients`
            );


        if (
            !result.response.ok ||
            !Array.isArray(result.data)
        ) {

            select.innerHTML = `

                <option value="">
                    Unable to load recipients
                </option>

            `;

            return;
        }


        const recipients =
            result.data;


        if (recipients.length === 0) {

            select.innerHTML = `

                <option value="">
                    No recipients available
                </option>

            `;

            return;
        }


        select.innerHTML = `

            <option value="">
                Select recipient
            </option>

        `;


        recipients.forEach(
            recipient => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    recipient.id;


                option.textContent =
                    `${recipient.name} - ${recipient.organization}`;


                select.appendChild(
                    option
                );

            }
        );

    } catch (error) {

        console.error(
            "Recipient loading error:",
            error
        );


        select.innerHTML = `

            <option value="">
                Unable to load recipients
            </option>

        `;

    }

}



function closeDistributionModal() {

    const modal =
        document.getElementById(
            "distributionModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.add(
        "hidden"
    );


    const form =
        modal.querySelector("form");

    if (form) {
        form.reset();
    }


    const itemId =
        document.getElementById(
            "distributionItemId"
        );

    if (itemId) {
        itemId.value = "";
    }

}



async function confirmDistribution(
    event
) {

    event.preventDefault();


    const itemId =
        document.getElementById(
            "distributionItemId"
        ).value;


    const recipientId =
        document.getElementById(
            "distributionRecipient"
        ).value;


    const distributionDate =
        document.getElementById(
            "distributionDate"
        ).value;


    if (!itemId) {

        alert(
            "Invalid donated item."
        );

        return;
    }


    if (!recipientId) {

        alert(
            "Please select a recipient."
        );

        return;
    }


    if (!distributionDate) {

        alert(
            "Please select distribution date."
        );

        return;
    }


    try {

        const result =
            await getJson(
                `${API_BASE}/items/${itemId}/distribute`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        recipientId:
                            Number(recipientId),

                        distributionDate:
                            distributionDate

                    })
                }
            );


        if (!result.response.ok) {

            alert(
                getErrorMessage(
                    result.data,
                    "Unable to distribute item."
                )
            );

            return;
        }


        alert(
            "Item distributed successfully."
        );


        closeDistributionModal();


        loadItems(false);

        loadDashboard();

    } catch (error) {

        console.error(
            "Distribution error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}



/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const sections =
            document.querySelectorAll(
                ".section"
            );


        sections.forEach(
            section =>
                section.classList.remove(
                    "active"
                )
        );


        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (dashboard) {
            dashboard.classList.add(
                "active"
            );
        }


        showSection(
            "dashboard"
        );

    }
);