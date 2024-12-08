const binaryGenerator = new BinaryGenerator();

class GlyphEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.binaryCache = new Map();
    }

    setupCanvas() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    }

    clearCanvas() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    getBinaryPattern(n) {
        if (!this.binaryCache.has(n)) {
            this.binaryCache.set(n, binaryGenerator.generateUniqueCombinations(n));
        }
        return this.binaryCache.get(n);
    }

    polygon(n, radius = 100, startAngle = null) {
        if (startAngle === null) startAngle = Math.PI / n;
        const points = [];
        for (let i = 1; i <= n; i++) {
            const angle = startAngle + (i * 2 * Math.PI / n);
            points.push({
                x: radius * Math.sin(angle),
                y: radius * Math.cos(angle)
            });
        }
        return points;
    }

    quadratic(n, a = 1, b = 0, c = 0) {
        const points = [];
        let x = 0;
        const xValues = [];
        
        while (xValues.length < n) {
            if (xValues.includes(-x)) {
                xValues.push(-x + 1);
            } else {
                xValues.push(-x);
            }
            x = xValues[xValues.length - 1];
        }

        xValues.forEach(x => {
            points.push({
                x: x * 30,
                y: (a * x * x + b * x + c) * 30
            });
        });
        return points;
    }

    circle(n, radius = 100, theta0 = 0, theta1 = -Math.PI/2) {
        const points = [];
        for (let i = 0; i < n; i++) {
            const theta = theta0 + (theta1 - theta0) * i / (n - 1);
            points.push({
                x: radius * Math.cos(theta),
                y: radius * Math.sin(theta)
            });
        }
        return points;
    }

    cubic(n, a = 0.1, b = 0, c = -0.75, d = 0) {
        const points = [];
        const halfN = Math.floor(n/2);
        
        for (let i = -halfN; i <= halfN; i++) {
            points.push({
                x: i * 30,
                y: (a * Math.pow(i, 3) + b * Math.pow(i, 2) + c * i + d) * 30
            });
        }
        return points;
    }

    golden(n, limit = 3 * Math.PI) {
        const points = [];
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const scale = 15;

        for (let i = 0; i < n; i++) {
            const t = (i * limit) / (n - 1);
            const factor = Math.pow(goldenRatio, (t * goldenRatio) / (2 * Math.PI));
            points.push({
                x: Math.cos(t) * factor * scale,
                y: Math.sin(t) * factor * scale
            });
        }
        return points;
    }

    straightLine(p1, p2) {
        return [p1, p2];
    }

    centreCircle(p1, p2) {
        const points = [];
        const center = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
        const radius = Math.sqrt(
            Math.pow(center.x - p1.x, 2) + 
            Math.pow(center.y - p1.y, 2)
        );

        const startAngle = Math.atan2(p1.y - center.y, p1.x - center.x);
        const endAngle = Math.atan2(p2.y - center.y, p2.x - center.x);
        
        for (let i = 0; i <= 150; i++) {
            const t = i / 150;
            const angle = startAngle + (endAngle - startAngle) * t;
            points.push({
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            });
        }
        return points;
    }

    drawShape(points, pattern, k = 1, lineType = 'straight', color = '#333') {
        const n = points.length;
        
        for (let i = 0; i < n; i++) {
            const start = points[i];
            const end = points[(i + k) % n];
            
            let linePoints;
            if (lineType === 'straight') {
                linePoints = this.straightLine(start, end);
            } else {
                linePoints = this.centreCircle(start, end);
            }

            this.ctx.beginPath();
            this.ctx.moveTo(linePoints[0].x, linePoints[0].y);
            
            if (pattern[i] === 0) {
                this.ctx.setLineDash([2, 2]);
                this.ctx.strokeStyle = 'gray';
                this.ctx.lineWidth = 0.25;
            } else {
                this.ctx.setLineDash([]);
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
            }

            for (let j = 1; j < linePoints.length; j++) {
                this.ctx.lineTo(linePoints[j].x, linePoints[j].y);
            }
            this.ctx.stroke();
        }
        this.ctx.setLineDash([]);
    }

    drawGlyph(params) {
        this.clearCanvas();
        
        // Get base points based on shape type
        let basePoints;
        const n = 7; // Number of points
        
        switch (params.shape) {
            case 'polygon':
                basePoints = this.polygon(n);
                break;
            case 'quadratic':
                basePoints = this.quadratic(n);
                break;
            case 'circle':
                basePoints = this.circle(n);
                break;
            case 'cubic':
                basePoints = this.cubic(n);
                break;
            case 'golden':
                basePoints = this.golden(n);
                break;
            default:
                basePoints = this.polygon(n);
        }

        // Get binary patterns
        const N = 15; // 2 * 7 + 1 attributes
        const patterns = this.getBinaryPattern(N);
        const selectedPatterns = patterns.slice(0, 7); // Take first 7 patterns

        // Draw base points
        basePoints.forEach((point, i) => {
            if (i === 0) {
                this.ctx.fillStyle = '#000';
            } else {
                this.ctx.fillStyle = 'none';
                this.ctx.strokeStyle = '#000';
            }
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            if (i === 0) {
                this.ctx.fill();
            } else {
                this.ctx.stroke();
            }
        });

        // Draw patterns
        selectedPatterns.forEach((pattern, i) => {
            this.drawShape(
                basePoints,
                pattern,
                i + 1,
                params.lineType === 'centreCircle' ? 'centre' : 'straight'
            );
        });

        // Add markers
        if (params.ritual) {
            this.drawRitualMarker();
        }
        if (params.concentration) {
            this.drawConcentrationMarker();
        }
    }

    drawRitualMarker() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
    }

    drawConcentrationMarker() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
}
