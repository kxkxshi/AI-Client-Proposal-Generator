from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.proposal import ProposalRequest, ProposalResponse, ProposalSummary
from app.services import proposal_service

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])


# 🔥 CREATE PROPOSAL (AUTH ENABLED)
@router.post(
    "/generate",
    response_model=ProposalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a new AI proposal",
)
async def generate_proposal(
    req: ProposalRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    proposal = await proposal_service.create_proposal(db, user_id, req)
    return proposal


# 🔥 GET ALL PROPOSALS (AUTH ENABLED)
@router.get(
    "/",
    response_model=list[ProposalSummary],
    summary="Get all proposals for current user",
)
def list_proposals(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    return proposal_service.get_user_proposals(db, user_id)


# 🔥 GET SINGLE PROPOSAL (AUTH ENABLED)
@router.get(
    "/{proposal_id}",
    response_model=ProposalResponse,
    summary="Get a single proposal by ID",
)
def get_proposal(
    proposal_id: UUID,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    return proposal_service.get_proposal_by_id(db, proposal_id, user_id)


# 🔥 DELETE PROPOSAL (AUTH ENABLED)
@router.delete(
    "/{proposal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a proposal",
)
def delete_proposal(
    proposal_id: UUID,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    proposal_service.delete_proposal(db, proposal_id, user_id)
