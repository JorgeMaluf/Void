class Particle {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.size = 16;
        this.angle = Math.random() * Math.PI * 2;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '18px "Times New Roman"';
        ctx.fillText(this.char, this.x, this.y);
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = 200;
        const minDistance = 5;
        const gravitationalPull = 2;
        
        if (distance < maxDistance) {
            let force = (1 - distance / maxDistance) * gravitationalPull;
            this.angle += 0.05 * force;
            
            if (distance > minDistance) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                this.x += forceDirectionX * force * this.density;
                this.y += forceDirectionY * force * this.density;
                
                this.x += Math.cos(this.angle) * force;
                this.y += Math.sin(this.angle) * force;
            } else {
                this.x += Math.cos(this.angle) * 2;
                this.y += Math.sin(this.angle) * 2;
            }
        } else {
            if (this.x !== this.baseX) {
                this.x -= (this.x - this.baseX) / 20;
            }
            if (this.y !== this.baseY) {
                this.y -= (this.y - this.baseY) / 20;
            }
        }
    }
}

const text = `O universo é um vasto oceano de possibilidades infinitas, onde cada estrela cintilante no firmamento
representa uma história não contada, um segredo guardado nos confins do tempo e do espaço. Desde os
primórdios da existência, a humanidade ergueu os olhos para o céu noturno, buscando compreender os
mistérios que habitam além da escuridão. Planetas giram em órbitas invisíveis, galáxias se entrelaçam
em uma dança cósmica eterna, e buracos negros devoram a luz com sua gravidade avassaladora. O tempo,
essa entidade implacável, segue seu curso inexorável, levando consigo civilizações inteiras, apagando
impérios outrora grandiosos e moldando o destino daqueles que ousam desafiar suas leis.`;

// Partículas e Mouse
let particles = [];
let mouse = { x: null, y: null, radius: 100 };

function init() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.textAlign = 'left';
    const textLines = text.split('\n');
    const lineHeight = 32;
    const charWidth = 11;

    const startY = canvas.height / 2 - (textLines.length * lineHeight) / 2;

    textLines.forEach((line, lineIndex) => {
        const characters = line.split('');
        const lineWidth = characters.length * charWidth;
        const lineX = canvas.width / 2 - lineWidth / 2;

        characters.forEach((char, i) => {
            const x = lineX + (i * charWidth);
            const y = startY + (lineIndex * lineHeight);
            particles.push(new Particle(x, y, char));
        });
    });
}

function drawBlackHoleEffect(ctx, x, y) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 200, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouse.x !== null && mouse.y !== null) {
        drawBlackHoleEffect(ctx, mouse.x, mouse.y);
    }

    particles.forEach(particle => {
        particle.update(mouse);
        particle.draw(ctx);
    });

    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    particles = [];
    init();
});

init();
animate();
