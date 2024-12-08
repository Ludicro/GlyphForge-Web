from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import numpy as np
from .glyph_engine import bases, line_shapes, writer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/api/attributes")
async def get_attributes():
    with open("src/data/attributes.json") as f:
        return JSONResponse(json.load(f))

@app.get("/api/spells/{level}")
async def get_spells(level: int):
    with open(f"src/data/grimoire/wizard_{level}.json") as f:
        return JSONResponse(json.load(f))

@app.post("/api/generate-glyph")
async def generate_glyph(spell_data: dict):
    # Convert the writer.py glyph generation to return base64 image
    glyph_image = writer.draw_spell(
        level=spell_data["level"],
        rang=spell_data["range"],
        area=spell_data["area_type"],
        dtype=spell_data["dtype"],
        school=spell_data["school"],
        duration=spell_data["duration"],
        condition=spell_data["condition"],
        concentration=spell_data["concentration"],
        ritual=spell_data["ritual"],
        base_fn=getattr(bases, spell_data["base_shape"]),
        shape_fn=getattr(line_shapes, spell_data["line_type"])
    )
    return {"image": glyph_image}
