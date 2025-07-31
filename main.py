import pandas as pd
from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

leadership_df = pd.read_csv("filtered_leadership.csv")
facilities_df = pd.read_csv("facilities_with_coordinates.csv")

# convert EmpAnnivDate to calculate years of experience
leadership_df["EmpAnnivDate"] = pd.to_datetime(leadership_df["EmpAnnivDate"], errors="coerce")
leadership_df["YearsAtHCA"] = (datetime.now() - leadership_df["EmpAnnivDate"]).dt.days // 365

# RN experience Yes/No 
leadership_df["RNExperience"] = leadership_df["EmpRNExperienceDate"].notna().map({True: "Yes", False: "No"})

@app.get("/")
def read_root():
    return {"message": "Leadership API is Running!"}

# manual filtering
@app.get("/supervisors")
def get_supervisors(
    department: str = Query(None, description="Filter by department"),
    rn_experience: str = Query(None, description="Filter by RN experience (Yes/No)"),
    min_experience: int = Query(0, description="Minimum years of experience at HCA"),
    state: str = Query(None, description="Filter by facility state"),
    city: str = Query(None, description="Filter by facility city")
):
    """
    Filters supervisors based on user selections.
    """
    filtered_df = leadership_df.copy()

    if department:
        filtered_df = filtered_df[filtered_df["EmpDepartmentName"] == department]
    if rn_experience:
        filtered_df = filtered_df[filtered_df["RNExperience"] == rn_experience]
    if min_experience:
        filtered_df = filtered_df[filtered_df["YearsAtHCA"] >= min_experience]
    if state:
        filtered_df = filtered_df[filtered_df["facility_state"] == state]
    if city:
        filtered_df = filtered_df[filtered_df["facility_city"] == city]

    # include  info
    columns_to_return = [
        "EmpFirstName", "EmpLastName", "Emp34Id",
        "EmpLocationDesc", "EmpPositionDesc", "EmpDepartmentName", "Availability",
        "Mgr34Id", "MgrName", "MgrTitle"  
    ]

    return filtered_df[columns_to_return].fillna("Not Available").to_dict(orient="records")  

# facility locations
@app.get("/facilities")
def get_facilities():
    """Returns all facilities with valid lat/lon"""
    return facilities_df.dropna(subset=["latitude", "longitude"]).to_dict(orient="records")

# supervisors for each facility
@app.get("/facility-supervisors")
def get_facility_supervisors(facility_name: str):
    """Returns supervisors for a given facility"""
    filtered_df = leadership_df[leadership_df["EmpLocationDesc"] == facility_name]

    # include manager info
    columns_to_return = [
        "EmpFirstName", "EmpLastName", "Emp34Id",
        "EmpLocationDesc", "EmpPositionDesc", "EmpDepartmentName", "Availability",
        "Mgr34Id", "MgrName", "MgrTitle"  
    ]

    return filtered_df[columns_to_return].fillna("Not Available").to_dict(orient="records")

