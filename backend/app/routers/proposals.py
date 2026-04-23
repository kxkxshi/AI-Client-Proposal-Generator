from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.schemas.proposal import ProposalRequest, ProposalResponse, ProposalSummary
from app.services import proposal_service

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])


# 🔥 CREATE PROPOSAL (AUTH REMOVED)
@router.post(
    "/generate",
    response_model=ProposalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a new AI proposal",
)
async def generate_proposal(
    req: ProposalRequest,
    db: Session = Depends(get_db),
):
    user_id = "temp-user"  # 👈 dummy user
    proposal = await proposal_service.create_proposal(db, user_id, req)
    return proposal


# 🔥 GET ALL PROPOSALS (AUTH REMOVED)
@router.get(
    "/",
    response_model=list[ProposalSummary],
    summary="Get all proposals",
)
def list_proposals(
    db: Session = Depends(get_db),
):
    user_id = "temp-user"
    return proposal_service.get_user_proposals(db, user_id)


# 🔥 GET SINGLE PROPOSAL (AUTH REMOVED)
@router.get(
    "/{proposal_id}",
    response_model=ProposalResponse,
    summary="Get a single proposal by ID",
)
def get_proposal(
    proposal_id: UUID,
    db: Session = Depends(get_db),
):
    user_id = "temp-user"
    return proposal_service.get_proposal_by_id(db, proposal_id, user_id)


# 🔥 DELETE PROPOSAL (AUTH REMOVED)
@router.delete(
    "/{proposal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a proposal",
)
def delete_proposal(
    proposal_id: UUID,
    db: Session = Depends(get_db),
):
    user_id = "temp-user"
    proposal_service.delete_proposal(db, proposal_id, user_id)
