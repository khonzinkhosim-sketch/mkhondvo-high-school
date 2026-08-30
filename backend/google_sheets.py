import gspread
from google.oauth2.service_account import Credentials


# ==========================================
# MKHONDVO HIGH SCHOOL
# GOOGLE SHEETS CONNECTION
# ==========================================

CREDENTIALS_FILE = "credentials.json"

SPREADSHEET_ID = (
    "1iA3pq-XlNhYjw7SxLEMyVpVS-Pt7W0v6RvIVT1ibqJ0"
)

APPLICATIONS_WORKSHEET = "Applications"
MESSAGES_WORKSHEET = "Contact Messages"


# ==========================================
# GOOGLE SHEETS CLIENT
# ==========================================

def get_client():

    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"
    ]

    credentials = Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=scopes
    )

    return gspread.authorize(credentials)


# ==========================================
# OPEN SPREADSHEET
# ==========================================

def get_spreadsheet():

    client = get_client()

    return client.open_by_key(
        SPREADSHEET_ID
    )


# ==========================================
# APPLICATIONS WORKSHEET
# ==========================================

def get_worksheet():

    spreadsheet = get_spreadsheet()

    return spreadsheet.worksheet(
        APPLICATIONS_WORKSHEET
    )


# ==========================================
# GET APPLICATIONS
# ==========================================

def get_applications():

    worksheet = get_worksheet()

    return worksheet.get_all_records()


# ==========================================
# UPDATE APPLICATION STATUS
# ==========================================

def update_application_status(
    application_id,
    new_status
):

    worksheet = get_worksheet()

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
# CONTACT MESSAGES WORKSHEET
# ==========================================

def get_messages_worksheet():

    spreadsheet = get_spreadsheet()

    return spreadsheet.worksheet(
        MESSAGES_WORKSHEET
    )


# ==========================================
# GET CONTACT MESSAGES
# ==========================================

def get_contact_messages():

    worksheet = get_messages_worksheet()

    return worksheet.get_all_records()


# ==========================================
# UPDATE MESSAGE STATUS
# ==========================================

def update_message_status(
    message_row,
    new_status
):

    worksheet = get_messages_worksheet()

    headers = worksheet.row_values(1)


    if "Status" not in headers:

        raise ValueError(
            "Status column was not found "
            "in Contact Messages."
        )


    status_column = (
        headers.index("Status") + 1
    )


    row_number = int(message_row)


    if row_number < 2:

        return False


    worksheet.update_cell(
        row_number,
        status_column,
        new_status
    )


    return True