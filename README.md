# River-Flow
[Play here!](https://vincentktsui.github.io/River-Flow/)
![](riverflowdemo.gif)
## Summary
River Flow is a relaxing endless runner game built using Three.js.
## How to Play
Use the arrow keys to navigate the ball along the river. Use the left and right arrow keys to move the ball left and right, and use the up and down arrow keys to jump and dive respectively to dodge the obstacles. Try to survive as long as possible and relax. Hit <span style="font-size:4em;">ESC</span> to quit.
## Libraries Used
The game is written in Three.js and regular JavaScript.   
The sky and sun uses the Sky.js module written by @author zz85.  
The water texture of the river uses the Water2.js module written by @author Mugen87.   
## Key Features
### FPS Throttle
The frames per second of the game is throttled to equalize performance across different device specs.  
```javascript
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
### River Curvature
The curvature of the river is designed and calculated using a simple mathematical function.
```javascript
formula(x, offset = 0) {
  let y = x * this.curvatureFactor;
  return (Math.sin(0.5 * y) + Math.sin(y)) * 20 + offset / 2;
}
```
### Camera Movement
The camera smoothly follows the curvature of the river and is done by using mathematical functions to adjusting the camera position. 
```javascript
adjustCamera(offset, center) {
  const der = -this.derivative(offset + (100 - this.pushBack) * this.fpsInterval * 0.0002) * (this.fpsInterval * 0.0002) * this.curvatureFactor;
  let temp = Math.atan(der);
  let adjustedCenter = -this.formula(this.offset + (100 - this.pushBack) * this.fpsInterval * 0.0002) * 5;
  let x = center - Math.sin(temp) * 100;
  let z = Math.cos(temp) * 100;
  this.graphics.camera.position.set(x, 30, z);
  this.graphics.camera.lookAt(new THREE.Vector3(center, 0, 0));
  this.adjustScore(temp, x, z);
}
```
