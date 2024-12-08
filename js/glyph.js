class GlyphEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
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

        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            const angle = startAngle + (endAngle - startAngle) * t;
            points.push({
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            });
        }
        return points;
    }

    drawGlyph(params) {
        this.clearCanvas();
        
        // Generate base points based on shape type
        let basePoints;
        switch (params.shape) {
            case 'polygon':
                basePoints = this.polygon(7);
                break;
            case 'quadratic':
                basePoints = this.quadratic(7);
                break;
            // Add other shape types here
        }

        // Draw the connections
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

            // Draw the line
            this.ctx.beginPath();
            this.ctx.moveTo(linePoints[0].x, linePoints[0].y);
            for (let j = 1; j < linePoints.length; j++) {
                this.ctx.lineTo(linePoints[j].x, linePoints[j].y);
            }
            this.ctx.stroke();
        }

        // Add ritual and concentration markers if needed
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
