# River-Flow
[Play here!](https://vincentktsui.github.io/River-Flow/)
![](riverflowdemo.gif)
## Summary
River Flow is a relaxing endless runner game built using Three.js.
## How to Play
Use the arrow keys to navigate the ball along the river. Use the left and right arrow keys to move the ball left and right, and use the up and down arrow keys to jump and dive respectively to dodge the obstacles. Try to survive as long as possible and relax. Hit <span style="font-size:4em;">ESC</span> to quit.
## Libraries Used
The game is written in Three.js and regular JavaScript.   
The sky and sun uses the Sky.js module written by @author zz85. The water texture of the river uses the Water2.js module written by @author Mugen87.   
## Key Features
### FPS Throttle
```lang-js
animate() {
        this.animationLoop = window.requestAnimationFrame(this.animate);
        this.now = Date.now();
        this.aliveTime = this.now - this.startTime;
        this.elapsed = this.now - this.then;
        this.offset = this.now * 0.0002;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.render(this.offset);
        }
    }
```
### River Curvature and Camera Movement
### 
