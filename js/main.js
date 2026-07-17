
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    
    let audioCtx = null;
    let musicPlaying = false;
    let sequenceTimer = null;

    
    const stars = [];
    const fallingSunflowers = [];
    const interactiveBlooms = [];
    const particles = [];
    const fireworks = [];
    const butterflies = [];

    let moonPhase = 0;
    const constellations = [];
    const btsConstellationPoints = [];
    
    
    let skyHue = 275;     
    let skySaturation = 45;
    let skyLightness = 12; 
    let globalVelocityMultiplier = 0.8;
    let isSurprisePhase = false;

   
    const mouse = { x: -1000, y: -1000, active: false };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initConstellations();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
        
    
        if (Math.random() < 0.35) {
            spawnArmyBombTrail(mouse.x, mouse.y);
        }
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });


    window.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.audio-control')) return;
        spawnClickBloom(e.clientX, e.clientY);
    });

    
    class CosmicStar {
        constructor() {
            this.reset();
            this.y = Math.random() * height; 
        }

        reset() {
            this.x = Math.random() * width;
            this.y = 0;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.7 + 0.3;
            this.alpha = this.baseAlpha;
            this.speed = Math.random() * 0.15 + 0.05;
            this.sparkleSpeed = Math.random() * 0.02 + 0.005;
            this.sparklePhase = Math.random() * Math.PI;
        }

        update() {
            this.y += this.speed * globalVelocityMultiplier;
            this.sparklePhase += this.sparkleSpeed;
            this.alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.sparklePhase));

            if (this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(230, 230, 250, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class MagicParticle {
        constructor(x, y, color = 'rgba(211, 157, 241, 0.8)', sizeMultiplier = 1) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = (Math.random() * 2 + 1) * sizeMultiplier;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.alpha = 1.0;
            this.decay = Math.random() * 0.025 + 0.015;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.color.includes('255, 255') ? 12 : 6;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

  
    class Whalien52 {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = -400;
            this.y = Math.random() * (height * 0.4) + height * 0.15;
            this.vx = Math.random() * 0.25 + 0.15;
            this.vy = (Math.random() - 0.5) * 0.08;
            this.scale = Math.random() * 0.35 + 0.4;
            this.alpha = 0;
            this.targetAlpha = Math.random() * 0.2 + 0.15;
        }

        update() {
            this.x += this.vx * globalVelocityMultiplier;
            this.y += this.vy * globalVelocityMultiplier;

          
            if (this.x < width * 0.15) {
                this.alpha += 0.0015;
            } else if (this.x > width * 0.75) {
                this.alpha -= 0.0015;
            }

            if (this.x > width + 400) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.scale, this.scale);
            ctx.globalAlpha = Math.max(0, Math.min(this.alpha, this.targetAlpha));
            
            ctx.strokeStyle = 'rgba(211, 157, 241, 0.4)';
            ctx.fillStyle = 'rgba(106, 13, 173, 0.06)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#b186f7';

           
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(60, -50, 160, -60, 220, -15);
            ctx.bezierCurveTo(260, 5, 280, 15, 300, 10);
          
            ctx.lineTo(315, -10);
            ctx.lineTo(320, 25);
            ctx.lineTo(305, 20);
            ctx.lineTo(300, 30);
            
            ctx.bezierCurveTo(220, 45, 120, 55, 0, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            
            ctx.beginPath();
            ctx.moveTo(110, 25);
            ctx.bezierCurveTo(120, 55, 140, 65, 130, 35);
            ctx.closePath();
            ctx.stroke();

           
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(35, -5, 1.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    const cosmicWhale = new Whalien52();

    class FallingSunflower {
        constructor() {
            this.reset(true);
        }

        reset(initialStart = false) {
            this.x = Math.random() * width;
            this.y = initialStart ? Math.random() * height : -60;
            this.size = Math.random() * 15 + 15; // 
            this.speedY = Math.random() * 0.8 + 0.4;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.015;
            this.alpha = Math.random() * 0.35 + 0.6;
        }

        update() {
            this.y += this.speedY * globalVelocityMultiplier;
            this.x += this.speedX * globalVelocityMultiplier;
            this.rotation += this.rotSpeed * globalVelocityMultiplier;

          
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += (dx / dist) * force * 3;
                    this.y += (dy / dist) * force * 3;
                }
            }

            if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.alpha;
            
            
            const petalCount = 12;
            const petalLength = this.size * 0.7;
            const petalWidth = this.size * 0.25;

            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';

            for (let i = 0; i < petalCount; i++) {
                ctx.rotate((Math.PI * 2) / petalCount);
               
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.ellipse(0, -petalLength / 2, petalWidth, petalLength, 0, 0, Math.PI * 2);
                ctx.fill();
                
               
                ctx.fillStyle = '#FF8C00';
                ctx.beginPath();
                ctx.ellipse(0, -petalLength / 2, petalWidth * 0.5, petalLength * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#3E2723';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
            ctx.fill();

           
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
        }
    }

    class InteractiveBloom {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.scale = 0.01;
            this.targetScale = Math.random() * 25 + 20; // 
            this.alpha = 1.0;
            this.growth = 0.06;
            this.decay = 0.015;
            this.rotation = Math.random() * Math.PI;
        }

        update() {
            if (this.scale < this.targetScale) {
                this.scale += (this.targetScale - this.scale) * this.growth;
            } else {
                this.alpha -= this.decay;
            }
        }

        isDead() {
            return this.alpha <= 0.01;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.alpha;

            const petals = 14;
            const r = this.scale;

            for (let i = 0; i < petals; i++) {
                ctx.rotate((Math.PI * 2) / petals);
                ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.beginPath();
                ctx.ellipse(0, -r, r * 0.28, r, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = '#2d1a10';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    class Firework {
        constructor() {
            this.x = Math.random() * (width - 200) + 100;
            this.y = Math.random() * (height * 0.4) + height * 0.15;
            this.particles = [];
            this.alpha = 1.0;
            this.decay = Math.random() * 0.008 + 0.012;
            this.color = Math.random() > 0.5 ? '#d39df1' : '#b186f7'; 
            this.initParticles();
        }

        initParticles() {
            const count = 60;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
                const speed = Math.random() * 3.5 + 1.5;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1.0
                });
            }
        }

        update() {
            this.alpha -= this.decay;
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02; 
                p.vx *= 0.98; 
                p.vy *= 0.98;
                p.alpha = this.alpha;
            });
        }

        isDead() {
            return this.alpha <= 0;
        }

        draw() {
            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            this.particles.forEach(p => {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
        }
    }

    class StarryButterfly {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 6 + 4;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.wingSpeed = Math.random() * 0.15 + 0.1;
            this.wingPhase = 0;
            this.alpha = Math.random() * 0.4 + 0.4;
        }

        update() {
            this.x += this.vx * globalVelocityMultiplier;
            this.y += this.vy * globalVelocityMultiplier;
            this.wingPhase += this.wingSpeed;

           
            if (Math.random() < 0.02) {
                this.vx += (Math.random() - 0.5) * 0.5;
                this.vy += (Math.random() - 0.5) * 0.5;
            }

           
            if (this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;
            
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(230, 230, 250, 0.7)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

            
            const wingWidth = this.size * Math.abs(Math.sin(this.wingPhase));

            
            ctx.beginPath();
            ctx.ellipse(-wingWidth/2, -this.size/4, wingWidth/2, this.size/2, Math.PI/4, 0, Math.PI * 2);
            ctx.fill();

            
            ctx.beginPath();
            ctx.ellipse(wingWidth/2, -this.size/4, wingWidth/2, this.size/2, -Math.PI/4, 0, Math.PI * 2);
            ctx.fill();

           
            ctx.fillStyle = '#6A0DAD';
            ctx.beginPath();
            ctx.ellipse(0, 0, 1, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    
    for (let i = 0; i < 110; i++) stars.push(new CosmicStar());
    for (let i = 0; i < 14; i++) fallingSunflowers.push(new FallingSunflower());
    for (let i = 0; i < 4; i++) butterflies.push(new StarryButterfly());

    function initConstellations() {
        constellations.length = 0;
        btsConstellationPoints.length = 0;
        
        
        const numNodes = Math.floor(width / 220);
        for (let i = 0; i < numNodes; i++) {
            constellations.push({
                x: Math.random() * width,
                y: Math.random() * (height * 0.6) + 50,
                radius: Math.random() * 2 + 1.5,
                alpha: Math.random() * 0.6 + 0.4
            });
        }

        
        const cx = width / 2;
        const cy = height * 0.35;
        const s = 45;

       
        btsConstellationPoints.push({ x: cx - s,     y: cy - s * 1.5 });
        btsConstellationPoints.push({ x: cx - s*0.2, y: cy - s * 1.2 }); 
        btsConstellationPoints.push({ x: cx - s*0.2, y: cy + s * 1.2 }); 
        btsConstellationPoints.push({ x: cx - s,     y: cy + s * 1.5 });

        
        btsConstellationPoints.push({ x: cx + s*0.2, y: cy - s * 1.2 }); 
        btsConstellationPoints.push({ x: cx + s,     y: cy - s * 1.5 }); 
        btsConstellationPoints.push({ x: cx + s,     y: cy + s * 1.5 }); 
        btsConstellationPoints.push({ x: cx + s*0.2, y: cy + s * 1.2 }); 
    }
    initConstellations();

    function spawnArmyBombTrail(x, y) {
        particles.push(new MagicParticle(x, y, 'rgba(255, 255, 255, 0.7)', 2.2));
        
        if (Math.random() < 0.2) {
            particles.push(new MagicParticle(x, y, 'rgba(255, 50, 75, 0.95)', 0.8));
        }
    }

    function spawnClickBloom(x, y) {
        interactiveBlooms.push(new InteractiveBloom(x, y));
        for (let i = 0; i < 6; i++) {
            particles.push(new MagicParticle(x, y, 'rgba(255, 215, 0, 0.8)'));
            particles.push(new MagicParticle(x, y, 'rgba(180, 140, 255, 0.8)'));
        }
    }


    function initSynth() {
        if (audioCtx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        playSequence();
    }

    function playWarmPianoNote(frequency, duration, delayTime = 0) {
        if (!audioCtx) return;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const lowpass = audioCtx.createBiquadFilter();

        osc1.type = 'triangle';
        osc2.type = 'sine';

        
        osc1.frequency.setValueAtTime(frequency, audioCtx.currentTime + delayTime);
        osc2.frequency.setValueAtTime(frequency + 1.2, audioCtx.currentTime + delayTime);

      
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(700, audioCtx.currentTime + delayTime);
        lowpass.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + delayTime + duration);

        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delayTime);
        gainNode.gain.linearRampToValueAtTime(0.24, audioCtx.currentTime + delayTime + 0.1); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delayTime + duration);

        osc1.connect(lowpass);
        osc2.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start(audioCtx.currentTime + delayTime);
        osc2.start(audioCtx.currentTime + delayTime);

        osc1.stop(audioCtx.currentTime + delayTime + duration + 0.1);
        osc2.stop(audioCtx.currentTime + delayTime + duration + 0.1);
    }

    const notesFreqs = {
        C4: 261.63, E4: 329.63, G4: 392.00, B4: 493.88,
        D4: 293.66, Fs4: 369.99, A4: 440.00, Cs5: 554.37,
        E3: 164.81, A3: 220.00, D3: 146.83, G3: 196.00, C3: 130.81,
        E5: 659.25, G5: 783.99, B5: 987.77, A5: 880.00, Fs5: 739.99, D5: 587.33
    };

    const chordProgression = [
        { bass: 'C3', chord: ['G4', 'C4', 'E4'], melody: ['G5', 'E5', 'D5'] }, 
        { bass: 'G3', chord: ['G4', 'B4', 'D4'], melody: ['Fs5', 'D5', 'B4'] }, 
        { bass: 'A3', chord: ['A4', 'C4', 'E4'], melody: ['A5', 'E5', 'C5'] }, 
        { bass: 'D3', chord: ['Fs4', 'A4', 'D4'], melody: ['Fs5', 'D5', 'A4'] }
    ];

    let currentChordIndex = 0;

    function playSequence() {
        if (!musicPlaying) return;

        const currentPart = chordProgression[currentChordIndex];
        
       
        playWarmPianoNote(notesFreqs[currentPart.bass], 4.5, 0);

       
        currentPart.chord.forEach((note, index) => {
            playWarmPianoNote(notesFreqs[note], 3.5, 0.2 + (index * 0.15));
        });

       
        currentPart.melody.forEach((note, index) => {
            if (notesFreqs[note]) {
                playWarmPianoNote(notesFreqs[note], 2.5, 1.2 + (index * 0.65));
            }
        });

        currentChordIndex = (currentChordIndex + 1) % chordProgression.length;

        
        sequenceTimer = setTimeout(playSequence, 4000);
    }

   
    const audioToggle = document.getElementById('audioToggle');
    audioToggle.addEventListener('click', () => {
        if (!audioCtx) {
            initSynth();
        }
        if (musicPlaying) {
            musicPlaying = false;
            clearTimeout(sequenceTimer);
            audioToggle.querySelector('.audio-status').innerText = "Sound Off";
        } else {
            musicPlaying = true;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            playSequence();
            audioToggle.querySelector('.audio-status').innerText = "Sound On";
        }
    });


    function drawSkyBackground() {
     
        const fillGrd = ctx.createLinearGradient(0, 0, 0, height);
        fillGrd.addColorStop(0, `hsl(${skyHue}, ${skySaturation}%, ${skyLightness}%)`);
        fillGrd.addColorStop(1, `#040208`);
        ctx.fillStyle = fillGrd;
        ctx.fillRect(0, 0, width, height);

        if (!isSurprisePhase) {
            ctx.save();
            const auroraGrd = ctx.createRadialGradient(width * 0.5, height, 10, width * 0.5, height, height * 0.8);
            auroraGrd.addColorStop(0, 'rgba(106, 13, 173, 0.15)');
            auroraGrd.addColorStop(0.5, 'rgba(138, 43, 226, 0.06)');
            auroraGrd.addColorStop(1, 'transparent');
            ctx.fillStyle = auroraGrd;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }
    }

    function drawMoon() {
        if (isSurprisePhase) return;
        ctx.save();
        
      
        const moonX = width - 120;
        const moonY = 120 + moonPhase;
        
        
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(230, 230, 250, 0.35)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 45, 0, Math.PI * 2);
        ctx.fill();

      
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
        ctx.fill();

       
        ctx.shadowBlur = 0;
        ctx.fillStyle = `hsl(${skyHue}, ${skySaturation}%, ${skyLightness}%)`;
        ctx.beginPath();
        ctx.arc(moonX - 8, moonY - 3, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawConstellations() {
        if (isSurprisePhase) return;
        ctx.save();
        
        
        ctx.strokeStyle = 'rgba(230, 230, 250, 0.08)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < constellations.length; i++) {
            const p1 = constellations[i];
            for (let j = i + 1; j < constellations.length; j++) {
                const p2 = constellations[j];
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (dist < 200) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        for (let p of constellations) {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

       
        ctx.strokeStyle = 'rgba(180, 140, 255, 0.16)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(180, 140, 255, 0.3)';

      
        if (btsConstellationPoints.length >= 8) {
            ctx.beginPath();
            ctx.moveTo(btsConstellationPoints[0].x, btsConstellationPoints[0].y);
            ctx.lineTo(btsConstellationPoints[1].x, btsConstellationPoints[1].y);
            ctx.lineTo(btsConstellationPoints[2].x, btsConstellationPoints[2].y);
            ctx.lineTo(btsConstellationPoints[3].x, btsConstellationPoints[3].y);
            ctx.closePath();
            ctx.stroke();

           
            ctx.beginPath();
            ctx.moveTo(btsConstellationPoints[4].x, btsConstellationPoints[4].y);
            ctx.lineTo(btsConstellationPoints[5].x, btsConstellationPoints[5].y);
            ctx.lineTo(btsConstellationPoints[6].x, btsConstellationPoints[6].y);
            ctx.lineTo(btsConstellationPoints[7].x, btsConstellationPoints[7].y);
            ctx.closePath();
            ctx.stroke();

           
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            btsConstellationPoints.forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        ctx.restore();
    }


    function engineLoop() {
        drawSkyBackground();
        drawMoon();
        drawConstellations();

       
        cosmicWhale.update();
        cosmicWhale.draw();

        
        stars.forEach(star => {
            star.update();
            star.draw();
        });

       
        butterflies.forEach(b => {
            b.update();
            b.draw();
        });

        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].isDead()) {
                fireworks.splice(i, 1);
            }
        }

        
        fallingSunflowers.forEach(flower => {
            flower.update();
            flower.draw();
        });

    
        for (let i = interactiveBlooms.length - 1; i >= 0; i--) {
            interactiveBlooms[i].update();
            interactiveBlooms[i].draw();
            if (interactiveBlooms[i].isDead()) {
                interactiveBlooms.splice(i, 1);
            }
        }

        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0.05) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(engineLoop);
    }

   
    engineLoop();


    const openBtn = document.getElementById('open-btn');
    const landingScreen = document.getElementById('landing-screen');
    const cinematicScreen = document.getElementById('cinematic-screen');
    const cinematicText = document.getElementById('cinematic-text');
    const journeyContainer = document.getElementById('journey-container');
    const surpriseBtn = document.getElementById('surprise-btn');
    const surpriseSequence = document.getElementById('surprise-sequence');
    const climaxScreen = document.getElementById('climax-screen');

    
    openBtn.addEventListener('click', () => {
      
        initSynth();
        musicPlaying = true;
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        playSequence();

        
        audioToggle.style.display = 'flex';

        
        gsap.to('.landing-card', {
            opacity: 0,
            y: -50,
            duration: 1.2,
            ease: 'power3.inOut',
            onComplete: () => {
                landingScreen.classList.add('hidden');
                cinematicScreen.classList.remove('hidden');
                triggerCinematicTyping();
            }
        });
    });

    
    function triggerCinematicTyping() {
        const sentences = [
            "Today isn't just your birthday...",
            "It's the celebration of someone who unknowingly became one of the most beautiful chapters of my life."
        ];

        let index = 0;
        gsap.to(cinematicText, { opacity: 1, duration: 1 });
        
        function typeText(text, callback) {
            let charIndex = 0;
            cinematicText.innerHTML = '';
            
            function nextChar() {
                if (charIndex < text.length) {
                    cinematicText.innerHTML += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(nextChar, 65);
                } else {
                    setTimeout(callback, 2200);
                }
            }
            nextChar();
        }

        function runPhrase() {
            if (index < sentences.length) {
                typeText(sentences[index], () => {
                    gsap.to(cinematicText, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            index++;
                            gsap.to(cinematicText, { opacity: 1, duration: 0.5 });
                            runPhrase();
                        }
                    });
                });
            } else {
               
                gsap.to(cinematicScreen, {
                    opacity: 0,
                    duration: 1.5,
                    onComplete: () => {
                        cinematicScreen.classList.add('hidden');
                        journeyContainer.classList.remove('hidden');
                        initializeLenisAndCards();
                    }
                });
            }
        }

        runPhrase();
    }

   
    let lenis = null;

    function initializeLenisAndCards() {

        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.95
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        
        lenis.on('scroll', (e) => {
            const scrollPercent = e.scroll / (document.body.scrollHeight - window.innerHeight);
            
            skyHue = 275 - (scrollPercent * 30);
            skySaturation = 45 + (scrollPercent * 15);
            skyLightness = 12 - (scrollPercent * 8);
            
            
            moonPhase = scrollPercent * 100;
        });

       
        const cards = document.querySelectorAll('.letter-card');
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (Math.random() < 0.4) {
                        const bounds = entry.target.getBoundingClientRect();
                        spawnClickBloom(bounds.left + bounds.width * Math.random(), bounds.top + bounds.height * 0.5);
                    }
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));
        
      
        const surpriseCard = document.getElementById('pre-surprise-section');
        if(surpriseCard) {
            const wrapperCard = surpriseCard.querySelector('.surprise-trigger-card');
            const surpriseObserver = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    wrapperCard.style.opacity = '1';
                    wrapperCard.style.transform = 'translateY(0)';
                }
            });
            surpriseObserver.observe(surpriseCard);
            wrapperCard.style.opacity = '0';
            wrapperCard.style.transform = 'translateY(40px)';
            wrapperCard.style.transition = 'all 1.2s ease';
        }
    }

    
    surpriseBtn.addEventListener('click', () => {
      
        isSurprisePhase = true;
        globalVelocityMultiplier = 0.2; 
        
        if (lenis) {
            lenis.destroy();
        }
        gsap.to(journeyContainer, {
            opacity: 0,
            duration: 1.5,
            onComplete: () => {
                journeyContainer.classList.add('hidden');
                surpriseSequence.classList.remove('hidden');
                triggerSurpriseWishes();
            }
        });
    });
    function triggerSurpriseWishes() {
        const textElements = [
            document.getElementById('surprise-text-1'),
            document.getElementById('surprise-text-2'),
            document.getElementById('surprise-text-3'),
            document.getElementById('surprise-text-4')
        ];

        const timeline = gsap.timeline();
        textElements.forEach((el, index) => {
            timeline.to(el, {
                opacity: 1,
                y: 0,
                duration: 2.2,
                ease: 'power2.out',
                onStart: () => {
                    el.classList.add('reveal');
                }
            }, `+=1.2`);
            
            
            if (index < textElements.length - 1) {
                timeline.to(el, {
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power2.in'
                }, `+=1.5`);
            }
        });

        timeline.to(textElements[textElements.length - 1], {
            opacity: 0,
            duration: 1.8,
            ease: 'power2.in',
            onComplete: () => {
                surpriseSequence.classList.add('hidden');
                climaxScreen.classList.remove('hidden');
                triggerClimaxFinal();
            }
        }, `+=2.8`);
    }

   
    function triggerClimaxFinal() {
        isSurprisePhase = false;
        globalVelocityMultiplier = 1.4; 
        skyHue = 265;
        skyLightness = 14;


        spawnClickBloom(width * 0.5, height * 0.55);
        interactiveBlooms[interactiveBlooms.length - 1].targetScale = Math.min(width * 0.18, 120);

       
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                fireworks.push(new Firework());
            }, i * 700);
        }

        setInterval(() => {
            if (!climaxScreen.classList.contains('hidden')) {
                fireworks.push(new Firework());
            }
        }, 3200);

        
        setTimeout(() => {
            document.querySelector('.climax-title').classList.add('reveal');
        }, 500);

        setTimeout(() => {
            document.querySelector('.climax-subtitle').classList.add('reveal');
        }, 2200);
    }
});