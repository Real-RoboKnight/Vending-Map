from typing import Annotated

from fastapi import FastAPI
from pydantic import BaseModel, BeforeValidator
from pymongo import AsyncMongoClient, ReturnDocument

app = FastAPI()

db_uri = None
with open("/run/secrets/db_password", "r") as f:
    db_uri = f.read().strip()

db = AsyncMongoClient(db_uri).database
student_collection = db.get_collection("students")
PyObjectId = Annotated[str, BeforeValidator(str)]


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

class machine_location(BaseModel):
    id: int | None = None
    name: str | None = None
    longitude: float
    latitude: float
    cash: bool | None = None
    tap: bool | None = None
    other_payment_methods: list[str] | None = None

@app.get("/locations/")
async def get_locations(
    min_longitude: float, min_latitude: float, max_longitude: float, max_latitude: float
) -> list[machine_location]:
    """Get all locations within the given bounding box. Will return a list of machine_location objects."""
    return []

@app.post("/locations/")
async def create_location(location: machine_location) -> bool:
    """Create a NEW location in the database. Will return True if the location was created successfully, False otherwise.
    Will return False if the location already exists in the database.
    """
    return False

@app.put("/locations/")
async def update_location(location: machine_location) -> bool:
    """Update an existing location in the database. Will return True if the location was updated successfully, False otherwise.
    Will return False if the location does not exist in the database.
    """
    return False