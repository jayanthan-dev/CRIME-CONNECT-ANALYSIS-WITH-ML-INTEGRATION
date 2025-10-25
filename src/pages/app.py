# app.py
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI(title="Patrol Allocator")

# Allow calls from your React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class HotspotIn(BaseModel):
    id: Optional[int]
    lat: float
    lng: float
    location: str
    incidents: int = Field(0, ge=0)

class PatrolPoint(BaseModel):
    id: Optional[int]
    lat: float
    lng: float
    location: str
    incidents: int
    priority: str
    recommendedOfficers: int
    recommendedTimeMinutes: int
    routeId: int

class AllocateRequest(BaseModel):
    hotspots: List[HotspotIn]
    total_officers: Optional[int] = 8              # total available officers to allocate
    patrol_shift_minutes: Optional[int] = 8 * 60   # e.g. 8 hours default

class AllocateResponse(BaseModel):
    patrolPlan: List[PatrolPoint]
    summary: dict

# Helper funcs
def compute_priority(incidents: int) -> str:
    if incidents >= 10:
        return "High"
    if incidents >= 5:
        return "Medium"
    return "Low"

def allocate_officers_proportional(hotspots: List[HotspotIn], total_officers: int) -> List[int]:
    """Return list of recommended officers per hotspot (same order as hotspots). 
       Ensures at least 1 officer per hotspot and sums to <= total_officers (if possible)."""
    n = len(hotspots)
    if n == 0:
        return []

    incidents_arr = [h.incidents for h in hotspots]
    total_incidents = sum(incidents_arr)
    # If no incidents, give 1 officer to top few until run out
    if total_incidents == 0:
        base = 1
        # allocate 1 to each up to total_officers
        allocations = [1 if i < total_officers else 0 for i in range(n)]
        # ensure every hotspot has at least 1 if total_officers >= n
        if total_officers >= n:
            return [1] * n
        return allocations

    # proportional allocation
    raw = [(inc / total_incidents) * total_officers for inc in incidents_arr]
    floored = [math.floor(x) for x in raw]
    # ensure each hotspot has at least 1 if there are officers left
    for i in range(n):
        if floored[i] < 1:
            floored[i] = 1

    allocated = sum(floored)
    # if we've allocated too many because of forcing min 1, reduce starting from lowest incident hotspots
    if allocated > total_officers:
        # sort indices by incidents ascending, reduce their allocation where possible
        idxs = sorted(range(n), key=lambda i: incidents_arr[i])
        i = 0
        while allocated > total_officers and i < n:
            idx = idxs[i]
            if floored[idx] > 1:
                floored[idx] -= 1
                allocated -= 1
            i += 1
        # if still allocated > total_officers (very small total_officers), allow zeros
        i = 0
        while allocated > total_officers and i < n:
            idx = idxs[i]
            if floored[idx] > 0:
                floored[idx] -= 1
                allocated -= 1
            i += 1

    # if allocated < total_officers, distribute the remainder to highest-incident hotspots
    remainder = total_officers - allocated
    if remainder > 0:
        idxs_desc = sorted(range(n), key=lambda i: incidents_arr[i], reverse=True)
        j = 0
        while remainder > 0:
            floored[idxs_desc[j % n]] += 1
            remainder -= 1
            j += 1

    return floored

def recommend_time_minutes(incidents: int, base_minutes: int = 20) -> int:
    """Recommend patrol visit time in minutes based on incidents."""
    # More incidents => more time allocated
    return base_minutes + incidents * 10  # e.g., 0 incidents => 20 minutes, each incident +10 min

@app.post("/api/allocate-patrol", response_model=AllocateResponse)
async def allocate_patrol(req: AllocateRequest):
    hotspots = req.hotspots
    total_officers = max(1, req.total_officers)
    patrol_shift_minutes = max(60, req.patrol_shift_minutes)

    if not hotspots:
        return AllocateResponse(patrolPlan=[], summary={"message": "no hotspots provided"})

    # Sort hotspots by incidents descending (importance)
    hotspots_sorted = sorted(hotspots, key=lambda h: h.incidents, reverse=True)

    # compute recommended officers
    officers_alloc = allocate_officers_proportional(hotspots_sorted, total_officers)

    # compute priority and recommended time & create initial plan entries
    plan_entries = []
    for i, h in enumerate(hotspots_sorted):
        priority = compute_priority(h.incidents)
        rec_off = max(1, officers_alloc[i])
        rec_time = recommend_time_minutes(h.incidents)
        plan_entries.append({
            "id": h.id,
            "lat": h.lat,
            "lng": h.lng,
            "location": h.location,
            "incidents": h.incidents,
            "priority": priority,
            "recommendedOfficers": rec_off,
            "recommendedTimeMinutes": rec_time,
            # routeId to be assigned
            "routeId": -1
        })

    # Create simple route assignment: create R routes where R = min(total_officers, len(hotspots))
    # Then assign hotspots round-robin to balance incident load across routes.
    R = min(total_officers, len(plan_entries))
    if R == 0:
        R = 1

    # sort entries by incidents descending (already sorted) and then assign in round-robin to routes
    routes = {r: {"hotspots": [], "total_incidents": 0} for r in range(R)}
    for idx, entry in enumerate(plan_entries):
        # choose route with smallest total_incidents currently (greedy balance)
        chosen_route = min(routes.items(), key=lambda kv: kv[1]["total_incidents"])[0]
        routes[chosen_route]["hotspots"].append(entry)
        routes[chosen_route]["total_incidents"] += entry["incidents"]

    # Now assign routeId numbers
    for r_id, rdata in routes.items():
        for e in rdata["hotspots"]:
            e["routeId"] = r_id + 1  # routeId starting from 1

    # Flatten plan_entries (they already reference same dicts inside routes) and prepare PatrolPoint models
    patrol_plan = []
    for r_id in sorted(routes.keys()):
        for e in routes[r_id]["hotspots"]:
            patrol_plan.append(PatrolPoint(
                id=e.get("id"),
                lat=e["lat"],
                lng=e["lng"],
                location=e["location"],
                incidents=e["incidents"],
                priority=e["priority"],
                recommendedOfficers=e["recommendedOfficers"],
                recommendedTimeMinutes=e["recommendedTimeMinutes"],
                routeId=e["routeId"]
            ))

    summary = {
        "requested_hotspots": len(hotspots),
        "routes_created": R,
        "total_officers_available": total_officers,
        "total_incidents": sum(h.incidents for h in hotspots)
    }

    return AllocateResponse(patrolPlan=patrol_plan, summary=summary)
