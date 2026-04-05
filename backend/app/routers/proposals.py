from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.proposal import ProposalRequest, ProposalResponse, ProposalSummary
from app.services import proposal_service

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])


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
    """
    Accepts project details, generates a professional proposal via Gemini 1.5 Flash,
    saves it to the database, and returns the full proposal.
    """
    proposal = await proposal_service.create_proposal(db, user_id, req)
    return proposal


@router.get(
    "/",
    response_model=list[ProposalSummary],
    summary="Get all proposals for current user",
)
def list_proposals(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Returns a list of all proposals belonging to the authenticated user."""
    return proposal_service.get_user_proposals(db, user_id)


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
    """Returns the full proposal content for a given ID."""
    return proposal_service.get_proposal_by_id(db, proposal_id, user_id)


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
    """Permanently deletes a proposal owned by the current user."""
    proposal_service.delete_proposal(db, proposal_id, user_id)
