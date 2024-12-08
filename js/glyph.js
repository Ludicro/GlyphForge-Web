class GlyphEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas size and center the coordinate system
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(1, -1); // Flip y-axis to match mathematical coordinates
    }

    clearCanvas() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    // Base shape generators
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
        const xValues = this.generateXValues(n);
        const scale = 30;

        xValues.forEach(x => {
            points.push({
                x: x * scale,
                y: (a * x * x + b * x + c) * scale
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
        const scale = 30;
        const halfN = Math.floor(n/2);
        
        for (let i = -halfN; i <= halfN; i++) {
            points.push({
                x: i * scale,
                y: (a * Math.pow(i, 3) + b * Math.pow(i, 2) + c * i + d) * scale
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

    // Line shape generators
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
        
        // Determine the correct arc direction
        let deltaAngle = endAngle - startAngle;
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = startAngle + deltaAngle * t;
            points.push({
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            });
        }
        return points;
    }

    generateXValues(n) {
        const values = [0];
        while (values.length < n) {
            if (values.includes(-values[values.length - 1])) {
                values.push(-values[values.length - 1] + 1);
            } else {
                values.push(-values[values.length - 1]);
            }
        }
        return values;
    }

    drawGlyph(params) {
        this.clearCanvas();
        
        // Generate base points
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

        // Draw base points
        this.ctx.fillStyle = '#333';
        basePoints.forEach((point, i) => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });

        // Draw connections
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;

        for (let i = 0; i < basePoints.length; i++) {
            const start = basePoints[i];
            const end = basePoints[(i + 1) % basePoints.length];
            
            let linePoints;
            if (params.lineType === 'straight') {
                linePoints = this.straightLine(start, end);
            } else {
                linePoints = this.centreCircle(start, end);
            }

            this.ctx.beginPath();
            this.ctx.moveTo(linePoints[0].x, linePoints[0].y);
            for (let j = 1; j < linePoints.length; j++) {
                this.ctx.lineTo(linePoints[j].x, linePoints[j].y);
            }
            this.ctx.stroke();
        }

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
