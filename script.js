alert("Cheers to your special day!")
let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Handle both mouse and touch events
    const moveEvent = (e) => {
      e.preventDefault();
      let clientX = e.clientX || (e.touches && e.touches[0].clientX);
      let clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round(180 * angle / Math.PI)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Handle start of drag
    const startEvent = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      let clientX = e.clientX || (e.touches && e.touches[0].clientX);
      let clientY = e.clientY || (e.touches && e.touches[0].clientY);

      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      if (e.button === 2) {
        this.rotating = true;
      }
    };

    // Handle end of drag
    const endEvent = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Add event listeners for both mouse and touch
    document.addEventListener('mousemove', moveEvent);
    document.addEventListener('touchmove', moveEvent, { passive: false });

    paper.addEventListener('mousedown', startEvent);
    paper.addEventListener('touchstart', startEvent, { passive: false });

    window.addEventListener('mouseup', endEvent);
    window.addEventListener('touchend', endEvent);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// ====== Background Music Feature (Fixed for Mobile) ======
document.addEventListener("DOMContentLoaded", () => {
    const audio = new Audio("song/Dil Se Dil.mp3");
    audio.loop = true; // Loop music continuously
    audio.muted = true; // Start muted to bypass autoplay restrictions

    // Function to unmute and play music
    const playMusic = () => {
        audio.muted = false; // Unmute
        audio.play().catch(() => {
            console.log("Autoplay blocked. Waiting for user interaction.");
        });
    };

    // Try playing immediately (Muted autoplay allowed in some browsers)
    audio.play().catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction.");
    });

    // Ensure music starts on user interaction if autoplay is blocked
    document.body.addEventListener("click", playMusic, { once: true });
    document.body.addEventListener("touchstart", playMusic, { once: true });
});
