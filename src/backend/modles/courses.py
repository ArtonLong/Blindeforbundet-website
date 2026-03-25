from pydantic import BaseModel, Field
from typing import Optional
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class CourseModell(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    name: str
    desc: str
    start_date:str
    end_date:str
