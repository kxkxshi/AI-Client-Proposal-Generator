from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class ProposalRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, description="Project title")
    description: str = Field(..., min_length=20, description="Project description")
    features: Optional[str] = Field(None, description="Comma-separated or bullet list of features")
    budget: Optional[str] = Field(None, max_length=100, description="Budget range e.g. $500-$2000")
    timeline: Optional[str] = Field(None, max_length=100, description="Expected timeline e.g. 4 weeks")
    tone: str = Field("formal", pattern="^(formal|friendly|persuasive)$", description="Proposal tone")


class ProposalResponse(BaseModel):
    id: UUID
    user_id: str
    title: str
    description: str
    features: Optional[str]
    budget: Optional[str]
    timeline: Optional[str]
    tone: str
    generated_content: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProposalSummary(BaseModel):
    id: UUID
    title: str
    tone: str
    budget: Optional[str]
    timeline: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
