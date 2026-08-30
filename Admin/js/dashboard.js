// ==========================================
// MKHONDVO HIGH SCHOOL
// STAFF ADMIN DASHBOARD
// ==========================================

const API_URL = "https://mkhondvo-high-school.onrender.com";

let applications = [];
let selectedApplication = null;

let messages = [];
let selectedMessage = null;


// ==========================================
// LOGIN PROTECTION
// ==========================================

const staffLoggedIn =
    sessionStorage.getItem("mkhondvoStaffLoggedIn");

if (staffLoggedIn !== "true") {
    window.location.href = "./admin.html";
}


// ==========================================
// DISPLAY STAFF USER
// ==========================================

const staffUsername =
    sessionStorage.getItem("mkhondvoStaffUsername");

const staffNameElement =
    document.querySelector(".admin-user strong");

if (staffNameElement && staffUsername) {
    staffNameElement.textContent = staffUsername;
}


// ==========================================
// LOAD APPLICATIONS
// ==========================================

async function loadApplications() {

    const tableBody =
        document.getElementById("applicationsTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="6">
                <div class="empty-state">
                    <span>⏳</span>
                    <p>Loading applications...</p>
                </div>
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_URL}/applications`);

        if (!response.ok) {
            throw new Error(
                "Unable to load applications."
            );
        }

        const data =
            await response.json();

        applications =
            data.applications || [];

        updateStatistics();

        displayApplications(applications);

    } catch (error) {

        console.error(
            "Application loading error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <span>⚠️</span>
                        <p>
                            Could not connect to the backend.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY APPLICATIONS
// ==========================================

function displayApplications(data) {

    const tableBody =
        document.getElementById(
            "applicationsTableBody"
        );

    if (!tableBody) {
        return;
    }

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <span>📋</span>
                        <p>No applications found.</p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML =
        data.map((application) => {

            const status =
                application["Status"] || "Pending";

            return `
                <tr>

                    <td>
                        ${escapeHtml(
                            application["Application ID"] || "—"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            application["Student Name"] || "—"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            application["Level"] || "—"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            application["Timestamp"] || "—"
                        )}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(status)}
                        </strong>
                    </td>

                    <td>

                        <button
                            class="view-button"
                            data-application-id="${escapeHtml(
                                application["Application ID"] || ""
                            )}">
                            View
                        </button>

                    </td>

                </tr>
            `;

        }).join("");

    attachViewButtons();
}


// ==========================================
// APPLICATION VIEW BUTTONS
// ==========================================

function attachViewButtons() {

    const buttons =
        document.querySelectorAll(
            ".view-button"
        );

    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const applicationId =
                    button.dataset.applicationId;

                const application =
                    applications.find(
                        (item) =>
                            item["Application ID"] ===
                            applicationId
                    );

                if (application) {

                    showApplicantDetails(
                        application
                    );
                }

            }
        );

    });
}


// ==========================================
// APPLICANT DETAILS
// ==========================================

function showApplicantDetails(application) {

    selectedApplication =
        application;

    const details =
        document.getElementById(
            "applicantDetails"
        );

    if (!details) {
        return;
    }

    details.style.display = "block";

    setText(
        "detailsApplicationID",
        application["Application ID"]
    );

    setText(
        "detailStudentName",
        application["Student Name"]
    );

    setText(
        "detailDOB",
        application["Date of Birth"]
    );

    setText(
        "detailGender",
        application["Gender"]
    );

    setText(
        "detailLevel",
        application["Level"]
    );

    setText(
        "detailSchool",
        application["Current School"]
    );

    setText(
        "detailParent",
        application["Parent/Guardian Name"]
    );

    setText(
        "detailPhone",
        application["Phone Number"]
    );

    setText(
        "detailEmail",
        application["Email Address"]
    );

    setText(
        "detailAddress",
        application["Home Address"]
    );

    const statusSelect =
        document.getElementById(
            "applicationStatus"
        );

    if (statusSelect) {

        statusSelect.value =
            application["Status"] ||
            "Pending";
    }

    const reportLink =
        document.getElementById(
            "reportLink"
        );

    if (reportLink) {

        reportLink.href =
            application[
                "Previous School Report/Both Symbols"
            ] || "#";
    }

    const birthCertificateLink =
        document.getElementById(
            "birthCertificateLink"
        );

    if (birthCertificateLink) {

        birthCertificateLink.href =
            application[
                "Birth Certificate Copy"
            ] || "#";
    }

    details.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// UPDATE APPLICATION STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        applications.length;

    const pending =
        applications.filter(
            app =>
                (app["Status"] || "Pending") ===
                "Pending"
        ).length;

    const approved =
        applications.filter(
            app =>
                app["Status"] ===
                "Approved"
        ).length;

    const rejected =
        applications.filter(
            app =>
                app["Status"] ===
                "Rejected"
        ).length;

    const grade8 =
        applications.filter(
            app =>
                app["Level"] ===
                "Grade 8"
        ).length;

    const form4 =
        applications.filter(
            app =>
                app["Level"] ===
                "Form 4"
        ).length;

    setText(
        "totalApplications",
        total
    );

    setText(
        "pendingApplications",
        pending
    );

    setText(
        "approvedApplications",
        approved
    );

    setText(
        "rejectedApplications",
        rejected
    );

    setText(
        "grade8Applications",
        grade8
    );

    setText(
        "form4Applications",
        form4
    );
}


// ==========================================
// APPLICATION SEARCH AND FILTER
// ==========================================

function filterApplications() {

    const search =
        document.getElementById(
            "applicationSearch"
        )?.value
        .toLowerCase()
        .trim() || "";

    const status =
        document.getElementById(
            "statusFilter"
        )?.value || "all";

    const level =
        document.getElementById(
            "levelFilter"
        )?.value || "all";

    const filtered =
        applications.filter(
            (application) => {

                const id =
                    String(
                        application["Application ID"] || ""
                    ).toLowerCase();

                const student =
                    String(
                        application["Student Name"] || ""
                    ).toLowerCase();

                const applicationStatus =
                    application["Status"] ||
                    "Pending";

                const applicationLevel =
                    application["Level"] ||
                    "";

                const matchesSearch =
                    id.includes(search) ||
                    student.includes(search);

                const matchesStatus =
                    status === "all" ||
                    applicationStatus === status;

                const matchesLevel =
                    level === "all" ||
                    applicationLevel === level;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesLevel
                );

            }
        );

    displayApplications(filtered);
}


// ==========================================
// SAVE APPLICATION STATUS
// ==========================================

async function saveApplicationStatus() {

    if (!selectedApplication) {
        return;
    }

    const statusSelect =
        document.getElementById(
            "applicationStatus"
        );

    const newStatus =
        statusSelect?.value;

    if (!newStatus) {
        return;
    }

    const applicationId =
        selectedApplication[
            "Application ID"
        ];

    try {

        const response =
            await fetch(
                `${API_URL}/applications/${encodeURIComponent(
                    applicationId
                )}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Unable to update status."
            );
        }

        alert(
            "Application status updated successfully."
        );

        await loadApplications();

        const updatedApplication =
            applications.find(
                app =>
                    app["Application ID"] ===
                    applicationId
            );

        if (updatedApplication) {

            showApplicantDetails(
                updatedApplication
            );
        }

    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            "Could not update application status."
        );
    }
}


// ==========================================
// CLOSE APPLICANT DETAILS
// ==========================================

function closeApplicantDetails() {

    const details =
        document.getElementById(
            "applicantDetails"
        );

    if (details) {
        details.style.display = "none";
    }

    selectedApplication = null;
}


// ==========================================
// LOAD CONTACT MESSAGES
// ==========================================

async function loadMessages() {

    const tableBody =
        document.getElementById(
            "messagesTableBody"
        );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="6">
                <div class="empty-state">
                    <span>⏳</span>
                    <p>Loading messages...</p>
                </div>
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_URL}/messages`);

        if (!response.ok) {

            throw new Error(
                "Unable to load messages."
            );
        }

        const data =
            await response.json();

        messages =
            data.messages || [];

        updateMessageBadge();

        displayMessages(messages);

    } catch (error) {

        console.error(
            "Message loading error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <span>⚠️</span>
                        <p>
                            Could not load messages.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY MESSAGES
// ==========================================

function displayMessages(data) {

    const tableBody =
        document.getElementById(
            "messagesTableBody"
        );

    if (!tableBody) {
        return;
    }

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <span>📩</span>
                        <p>No messages found.</p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML =
        data.map(
            (message, index) => {

                const status =
                    message["Status"] ||
                    "New";

                const rowNumber =
                    index + 2;

                const rowClass =
                    status === "New"
                        ? "message-new"
                        : "";

                return `
                    <tr class="${rowClass}">

                        <td>
                            ${escapeHtml(
                                message["Date"] || "—"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                message["Name"] || "—"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                message["Email"] || "—"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                message["Subject"] || "—"
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(status)}
                            </strong>
                        </td>

                        <td>

                            <button
                                class="view-message-button"
                                data-message-index="${index}">
                                View
                            </button>

                        </td>

                    </tr>
                `;

            }
        ).join("");

    attachMessageButtons();
}


// ==========================================
// MESSAGE VIEW BUTTONS
// ==========================================

function attachMessageButtons() {

    const buttons =
        document.querySelectorAll(
            ".view-message-button"
        );

    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset.messageIndex
                    );

                const message =
                    messages[index];

                if (message) {

                    showMessageDetails(
                        message,
                        index
                    );
                }

            }
        );

    });
}


// ==========================================
// MESSAGE DETAILS
// ==========================================

function showMessageDetails(
    message,
    index
) {

    selectedMessage = {
        data: message,
        index: index,
        row: index + 2
    };

    const details =
        document.getElementById(
            "messageDetails"
        );

    if (!details) {
        return;
    }

    details.style.display = "block";

    setText(
        "messageDetailsDate",
        message["Date"]
    );

    setText(
        "messageDetailName",
        message["Name"]
    );

    setText(
        "messageDetailEmail",
        message["Email"]
    );

    setText(
        "messageDetailSubject",
        message["Subject"]
    );

    setText(
        "messageDetailMessage",
        message["Message"]
    );

    const statusSelect =
        document.getElementById(
            "messageStatus"
        );

    if (statusSelect) {

        statusSelect.value =
            message["Status"] ||
            "New";
    }

    details.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// MESSAGE SEARCH AND FILTER
// ==========================================

function filterMessages() {

    const search =
        document.getElementById(
            "messageSearch"
        )?.value
        .toLowerCase()
        .trim() || "";

    const status =
        document.getElementById(
            "messageStatusFilter"
        )?.value || "all";

    const filtered =
        messages.filter(
            (message) => {

                const name =
                    String(
                        message["Name"] || ""
                    ).toLowerCase();

                const email =
                    String(
                        message["Email"] || ""
                    ).toLowerCase();

                const subject =
                    String(
                        message["Subject"] || ""
                    ).toLowerCase();

                const messageText =
                    String(
                        message["Message"] || ""
                    ).toLowerCase();

                const messageStatus =
                    message["Status"] ||
                    "New";

                const matchesSearch =
                    name.includes(search) ||
                    email.includes(search) ||
                    subject.includes(search) ||
                    messageText.includes(search);

                const matchesStatus =
                    status === "all" ||
                    messageStatus === status;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    displayMessages(filtered);
}


// ==========================================
// UPDATE MESSAGE BADGE
// ==========================================

function updateMessageBadge() {

    const badge =
        document.getElementById(
            "newMessagesBadge"
        );

    if (!badge) {
        return;
    }

    const newMessages =
        messages.filter(
            message =>
                (message["Status"] || "New") ===
                "New"
        ).length;

    badge.textContent =
        newMessages;
}


// ==========================================
// SAVE MESSAGE STATUS
// ==========================================

async function saveMessageStatus() {

    if (!selectedMessage) {
        return;
    }

    const statusSelect =
        document.getElementById(
            "messageStatus"
        );

    const newStatus =
        statusSelect?.value;

    if (!newStatus) {
        return;
    }

    const row =
        selectedMessage.row;

    try {

        const response =
            await fetch(
                `${API_URL}/messages/${row}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Unable to update message."
            );
        }

        alert(
            "Message status updated successfully."
        );

        await loadMessages();

        const updatedMessage =
            messages.find(
                (message) =>
                    message["Date"] ===
                        selectedMessage.data["Date"] &&
                    message["Name"] ===
                        selectedMessage.data["Name"] &&
                    message["Email"] ===
                        selectedMessage.data["Email"]
            );

        if (updatedMessage) {

            const updatedIndex =
                messages.indexOf(
                    updatedMessage
                );

            showMessageDetails(
                updatedMessage,
                updatedIndex
            );
        }

    } catch (error) {

        console.error(
            "Message status update error:",
            error
        );

        alert(
            "Could not update message status."
        );
    }
}


// ==========================================
// CLOSE MESSAGE DETAILS
// ==========================================

function closeMessageDetails() {

    const details =
        document.getElementById(
            "messageDetails"
        );

    if (details) {
        details.style.display = "none";
    }

    selectedMessage = null;
}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "mkhondvoStaffLoggedIn"
            );

            sessionStorage.removeItem(
                "mkhondvoStaffUsername"
            );

            window.location.href =
                "./admin.html";

        }
    );
}


// ==========================================
// APPLICATION BUTTON EVENTS
// ==========================================

document
    .getElementById("refreshApplications")
    ?.addEventListener(
        "click",
        loadApplications
    );

document
    .getElementById("saveStatus")
    ?.addEventListener(
        "click",
        saveApplicationStatus
    );

document
    .getElementById("closeDetails")
    ?.addEventListener(
        "click",
        closeApplicantDetails
    );

document
    .getElementById("applicationSearch")
    ?.addEventListener(
        "input",
        filterApplications
    );

document
    .getElementById("statusFilter")
    ?.addEventListener(
        "change",
        filterApplications
    );

document
    .getElementById("levelFilter")
    ?.addEventListener(
        "change",
        filterApplications
    );


// ==========================================
// MESSAGE BUTTON EVENTS
// ==========================================

document
    .getElementById("refreshMessages")
    ?.addEventListener(
        "click",
        loadMessages
    );

document
    .getElementById("saveMessageStatus")
    ?.addEventListener(
        "click",
        saveMessageStatus
    );

document
    .getElementById("closeMessageDetails")
    ?.addEventListener(
        "click",
        closeMessageDetails
    );

document
    .getElementById("messageSearch")
    ?.addEventListener(
        "input",
        filterMessages
    );

document
    .getElementById("messageStatusFilter")
    ?.addEventListener(
        "change",
        filterMessages
    );


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// TEXT HELPER
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value || "—";
    }
}


// ==========================================
// START DASHBOARD
// ==========================================

loadApplications();
loadMessages();


console.log(
    "Mkhondvo Staff Dashboard loaded successfully."
);