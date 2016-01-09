class FloatUpBehavior extends Sup.Behavior {
  speed = 0.1;
  delay = 500;
  
  start() {
    let angle = this.actor.getLocalEulerAngles().x * Math.PI / 180;
    new Sup.Tween(this.actor, { opacity: 1 })
      .to({ opacity: 0 }, this.delay)
      .onUpdate((state) => {
        this.actor.move(Math.sin(angle) * this.speed, Math.cos(angle) * this.speed, 0);
        this.actor.spriteRenderer.setOpacity(state.opacity);
      })
      .onComplete(() => { this.actor.destroy(); })
      .start();
  }
  
}
Sup.registerBehavior(FloatUpBehavior);
