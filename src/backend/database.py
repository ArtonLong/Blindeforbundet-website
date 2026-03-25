from motor.motor_asyncio import AsyncIOMotorClient
from typing import Any
from decouple import config

from src.backend.modles.courses import CourseModell

DATABASE_LINK = config("database_link")

class Database:
    def __init__(self):
        self._client = AsyncIOMotorClient(DATABASE_LINK)
        self._db = self._client["Blindeforbundet"]
        self.courses = self._db.get_collection("courses")

    def dumpy(self, class_instance) -> dict:
        dumped = class_instance.model_dump(by_alias=True)
        return dumped

    def db_dumpy(self, class_instance) -> dict:
        dumped = class_instance.model_dump(by_alias=True, exclude="_id")
        return dumped
    
    async def add_course(self, course):
        result = await self.courses.insert_one(course)
        return result.inserted_id

    async def instanceiate_courses(self):
        document = self.courses.find()
        document_list = await document.to_list(length=100)
        courses = [{**c} for c in document_list]
        return {"courses": courses}
