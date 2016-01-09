class RobotBehavior extends Sup.Behavior {
  spawnTimer = 0;
  spawnDelay = 40;

  update() {
    this.spawnTimer -= 1;
    if (this.spawnTimer >= 0) return;
    
    this.spawnTimer = this.spawnDelay;

    let starActor = new Sup.Actor("Start");
    starActor.setPosition(this.actor.getPosition());
    starActor.move(Sup.Math.Random.integer(-5, 5), Sup.Math.Random.integer(7, 12), 10);
    let scale = Sup.Math.Random.integer(6, 10) / 10;
    starActor.setLocalScale(scale, scale, 1);

    new Sup.SpriteRenderer(starActor, "Scenes/HTML5/BrillantFx");
    starActor.addBehavior(FloatUpBehavior, { speed: 0.02, delay: 800 } );
  }
}
Sup.registerBehavior(RobotBehavior);
