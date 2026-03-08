from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class CreateBrandRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 120:
            raise ValueError("Brand name must be between 2 and 120 characters")
        return v


class UpdateBrandRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 120:
            raise ValueError("Brand name must be between 2 and 120 characters")
        return v


class BrandResponse(BaseModel):
    id: str
    name: str
    logo_url: Optional[str] = None
    kit_status: str = "not_started"
    created_at: datetime
    updated_at: datetime


class BrandListItem(BaseModel):
    id: str
    name: str
    logo_url: Optional[str] = None
    kit_status: str = "not_started"
    created_at: datetime


class LogoUploadResponse(BaseModel):
    logo_url: str
