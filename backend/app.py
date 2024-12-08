from flask import Flask, request, jsonify
from flask_cors import CORS
import GlyphEngine.writer as writer
import GlyphEngine.bases as bases
import GlyphEngine.line_shapes as line_shapes
import io
import base64
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

@app.route('/api/attributes', methods=['GET'])
def get_attributes():
    attributes = {
        'levels': writer.load_attribute("Attributes/levels.txt"),
        'damage_types': writer.load_attribute("Attributes/damage_types.txt"),
        'conditions': writer.load_attribute("Attributes/conditions.txt"),
        'duration': writer.load_attribute("Attributes/duration.txt"),
        'range': writer.load_attribute("Attributes/range.txt"),
        'area_types': writer.load_attribute("Attributes/area_types.txt"),
        'school': writer.load_attribute("Attributes/school.txt")
    }
    return jsonify(attributes)

@app.route('/api/generate-glyph', methods=['POST'])
def generate_glyph():
    data = request.json
    
    # Map shape strings to functions
    shape_map = {
        'polygon': bases.polygon,
        'quadratic': bases.quadratic,
        'circle': bases.circle,
        'cubic': bases.cubic,
        'golden': bases.golden
    }
    
    line_map = {
        'straight': line_shapes.straight,
        'centreCircle': line_shapes.centre_circle
    }
    
    # Get base and line shape functions
    base_fn = shape_map.get(data['shape'], bases.polygon)
    line_fn = line_map.get(data['lineType'], line_shapes.straight)
    
    # Create buffer for image
    buf = io.BytesIO()
    
    # Generate glyph
    writer.draw_spell(
        level=data['level'],
        rang=data['range'],
        area=data['area'],
        dtype=data['damage'],
        school=data['school'],
        duration=data['duration'],
        condition=data['condition'],
        concentration=data['concentration'],
        ritual=data['ritual'],
        base_fn=base_fn,
        shape_fn=line_fn,
        savename=buf
    )
    
    # Convert to base64
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode()
    
    return jsonify({
        'image': image_base64
    })

if __name__ == '__main__':
    app.run(debug=True)
