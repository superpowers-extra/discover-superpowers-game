class TeleporterBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  
  awake() {
    this.actor.spriteRenderer.destroy();
    this.position = this.actor.getLocalPosition();
  }
  update() {
    if (this.position.distanceTo(Game.playerBehavior.position) < 1.5 && Game.playerBehavior.canMove) {
      Game.playerBehavior.teleport(this.actor.getLocalEulerAngles().y + Math.PI);
      
      new Sup.Tween(this.actor, { opacity: 0 })
        .to({ opacity: 1 }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function(object) { Sup.getActor("Blackscreen").spriteRenderer.setOpacity(object.opacity); })
        .onComplete(() => { Game.initScene(this.actor.getName()); })
        .start();
    }
  }
}
Sup.registerBehavior(TeleporterBehavior);
