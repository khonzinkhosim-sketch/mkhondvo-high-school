import json
import os

import gspread
from google.oauth2.service_account import Credentials


# ==========================================
# MKHONDVO HIGH SCHOOL
# GOOGLE SHEETS SERVICE
# ==========================================

SPREADSHEET_ID = "1iA3pq-XlNhYjw7SxLEMyVpVS-Pt7W0v6RvIVT1ibqJ0"

APPLICATIONS_WORKSHEET = "Applications"
MESSAGES_WORKSHEET = "Contact Messages"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


# ==========================================
# GOOGLE CLIENT
# ==========================================

def get_google_client():

    credentials_json = os.getenv("GOOGLE_CREDENTIALS_JSON")

    if not credentials_json:
        raise RuntimeError(
            "GOOGLE_CREDENTIALS_JSON environment variable is not configured."
        )

    try:
        credentials_info = json.loads(credentials_json)

    except json.JSONDecodeError as error:
        raise RuntimeError(
            "GOOGLE_CREDENTIALS_JSON contains invalid JSON."
        ) from error

    credentials = Credentials.from_service_account_info(
        credentials_info,
        scopes=SCOPES
    )

    return gspread.authorize(credentials)


# ==========================================
# GET WORKSHEET
# ==========================================

def get_worksheet(worksheet_name):

    client = get_google_client()

    spreadsheet = client.open_by_key(
        SPREADSHEET_ID
    )

    return spreadsheet.worksheet(
        worksheet_name
    )


# ==========================================
# APPLICATIONS
# ==========================================

def get_applications():

    worksheet = get_worksheet(
        APPLICATIONS_WORKSHEET
    )

    return worksheet.get_all_records()


# ==========================================
# UPDATE APPLICATION STATUS
# ==========================================

def update_application_status(
    application_id,
    new_status
):

    worksheet = get_worksheet(
        APPLICATIONS_WORKSHEET
    )

    records = worksheet.get_all_records()

    headers = worksheet.row_values(1)

    if "Application ID" not in headers:

        raise ValueError(
            "Application ID column was not found."
        )

    if "Status" not in headers:

        raise ValueError(
            "Status column was not found."
        )

    status_column = (
        headers.index("Status") + 1
    )

    for row_number, record in enumerate(
        records,
        start=2
    ):

        current_id = str(
            record.get(
                "Application ID",
                ""
            )
        ).strip()

        if current_id == str(
            application_id
        ).strip():

            worksheet.update_cell(
                row_number,
                status_column,
                new_status
            )

            return True

    return False


# ==========================================
# CONTACT MESSAGES
# ==========================================

def get_contact_messages():

    worksheet = get_worksheet(
        MESSAGES_WORKSHEET
    )

    return worksheet.get_all_records()


# ==========================================
# UPDATE MESSAGE STATUS
# ==========================================

def update_message_status(
    row_number,
    new_status
):

    worksheet = get_worksheet(
        MESSAGES_WORKSHEET
    )

    headers = worksheet.row_values(1)

    if "Status" not in headers:

        raise ValueError(
            "Status column was not found."
        )

    status_column = (
        headers.index("Status") + 1
    )

    worksheet.update_cell(
        row_number,
        status_column,
        new_status
    )

    return True