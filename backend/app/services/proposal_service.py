from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.proposal import Proposal
from app.schemas.proposal import ProposalRequest
from app.services import gemini_service


async def create_proposal(
    db: Session, user_id: str, req: ProposalRequest
) -> Proposal:
    """Generate proposal via Gemini and persist to database."""
    try:
        generated_content = await gemini_service.generate_proposal(
            title=req.title,
            description=req.description,
            features=req.features,
            budget=req.budget,
            timeline=req.timeline,
            tone=req.tone,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    proposal = Proposal(
        user_id=user_id,
        title=req.title,
        description=req.description,
        features=req.features,
        budget=req.budget,
        timeline=req.timeline,
        tone=req.tone,
        generated_content=generated_content,
    )

    db.add(proposal)
    db.commit()
    db.refresh(proposal)
    return proposal


def get_user_proposals(db: Session, user_id: str) -> list[Proposal]:
    """Return all proposals for the given user, newest first."""
    return (
        db.query(Proposal)
        .filter(Proposal.user_id == user_id)
        .order_by(Proposal.created_at.desc())
        .all()
    )


def get_proposal_by_id(db: Session, proposal_id: UUID, user_id: str) -> Proposal:
    """Return a single proposal, ensuring it belongs to the current user."""
    proposal = (
        db.query(Proposal)
        .filter(Proposal.id == proposal_id, Proposal.user_id == user_id)
        .first()
    )
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proposal not found.",
        )
    return proposal


def delete_proposal(db: Session, proposal_id: UUID, user_id: str) -> None:
    """Delete a proposal owned by the user."""
    proposal = get_proposal_by_id(db, proposal_id, user_id)
    db.delete(proposal)
    db.commit()
