from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False, index=True)  # Supabase user UUID (sub)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    features = Column(Text, nullable=True)
    budget = Column(String(100), nullable=True)
    timeline = Column(String(100), nullable=True)
    tone = Column(String(50), nullable=False, default="formal")
    generated_content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "features": self.features,
            "budget": self.budget,
            "timeline": self.timeline,
            "tone": self.tone,
            "generated_content": self.generated_content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
