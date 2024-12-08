import json
import base64
import io
import GlyphEngine.writer as writer
import GlyphEngine.bases as bases
import GlyphEngine.line_shapes as line_shapes

def lambda_handler(event, context):
    print("Event:", event)  # Add this line for debugging
    
    # Handle direct Lambda test invocations
    if 'httpMethod' not in event:
        return get_attributes()
    
    # Handle API Gateway requests
    if event['httpMethod'] == 'GET' and event['path'] == '/api/attributes':
        return get_attributes()
    elif event['httpMethod'] == 'POST' and event['path'] == '/api/generate-glyph':
        return generate_glyph(event)

def get_attributes():
    with open("Attributes/attributes.json", "r") as f:
        attributes = json.load(f)
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(attributes)
    }

def generate_glyph(event):
    data = json.loads(event['body'])
    
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
    
    base_fn = shape_map.get(data['shape'], bases.polygon)
    line_fn = line_map.get(data['lineType'], line_shapes.straight)
    
    buf = io.BytesIO()
    
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
    
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode()
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'image': image_base64
        })
    }
