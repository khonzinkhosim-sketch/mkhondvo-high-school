from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from google_sheets import (
    get_applications,
    update_application_status
)
from google_sheets import (
    get_applications,
    update_application_status,
    get_contact_messages,
    update_message_status
)


# ==========================================
# MKHONDVO HIGH SCHOOL
# BACKEND API
# ==========================================

app = FastAPI(
    title="Mkhondvo High School API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "status": "online",
        "school": "Mkhondvo High School",
        "service": "Administration API"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================
# GET APPLICATIONS
# ==========================================

@app.get("/applications")
def applications():

    try:
        data = get_applications()

        return {
            "status": "success",
            "count": len(data),
            "applications": data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==========================================
# STATUS REQUEST
# ==========================================

class StatusUpdate(BaseModel):

    status: str


# ==========================================
# UPDATE APPLICATION STATUS
# ==========================================

@app.put("/applications/{application_id}/status")
def change_application_status(
    application_id: str,
    request: StatusUpdate
):

    allowed_statuses = [
        "Pending",
        "Approved",
        "Rejected"
    ]

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid application status."
        )


    try:

        updated = update_application_status(
            application_id,
            request.status
        )

        if not updated:

            raise HTTPException(
                status_code=404,
                detail="Application not found."
            )


        return {
            "status": "success",
            "message": "Application status updated.",
            "application_id": application_id,
            "new_status": request.status
        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

# ==========================================
# GET CONTACT MESSAGES
# ==========================================

@app.get("/messages")
def messages():

    try:

        data = get_contact_messages()

        return {
            "status": "success",
            "count": len(data),
            "messages": data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==========================================
# UPDATE MESSAGE STATUS
# ==========================================

class MessageStatusUpdate(BaseModel):

    status: str


@app.put("/messages/{message_row}/status")
def change_message_status(
    message_row: int,
    request: MessageStatusUpdate
):

    allowed_statuses = [
        "New",
        "Read"
    ]

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid message status."
        )


    try:

        updated = update_message_status(
            message_row,
            request.status
        )


        if not updated:

            raise HTTPException(
                status_code=404,
                detail="Message not found."
            )


        return {
            "status": "success",
            "message": "Message status updated.",
            "row": message_row,
            "new_status": request.status
        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )