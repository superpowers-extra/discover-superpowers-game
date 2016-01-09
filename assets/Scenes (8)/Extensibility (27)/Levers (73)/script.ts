class LeverBehavior extends Sup.Behavior {
  index: number;
  direction: string;
  target: number;
  
  puzzleActor: Sup.Actor;
  puzzleStart: number;
  
  position: Sup.Math.Vector3;  
  activated = false;
  done = false;
  
  awake() {
    this.puzzleActor = Sup.getActor(`Puzzle ${this.index}`)
    this.puzzleStart = this.puzzleActor.getPosition()[this.direction];
    this.position = this.actor.getPosition();
    this.position.y -= this.actor.getLocalScale().y / 2;
  }
  
  update() {
    if (Game.playerBehavior.position.distanceTo(this.position) < 4) {
      this.actor.modelRenderer.setColor(1.5, 1.5, 1.5);
      this.actor.getChild("Lever").modelRenderer.setColor(1.5, 1.5, 1.5);
      
      if (Sup.Input.wasKeyJustReleased("X") || Sup.Input.wasKeyJustReleased("RETURN")) {
        this.activated = !this.activated;
        this.done = false;
        
        let lever = this.actor.getChild("Lever");
        let angles = new Sup.Math.Vector3(0, 0, 0);
        
        let init = { angle: Math.PI / 4 };
        let target = { angle: -Math.PI / 4 };
        if (!this.activated) {
          init.angle *= -1;
          target.angle *= -1;
        }
        
        new Sup.Tween(this.actor, init)
          .to(target, 300)
          .onUpdate((state) => {
            angles.z = state.angle;
            lever.setLocalEulerAngles(angles);
          })
          .start();
        
        this.activate();
      }
    } else {
      this.actor.modelRenderer.setColor(1, 1, 1);
      this.actor.getChild("Lever").modelRenderer.setColor(1, 1, 1);
    }
  }

  activate() {
    let position = this.puzzleActor.getPosition();
    
    new Sup.Tween(this.puzzleActor, { position: position[this.direction] })
      .to({ position: (this.activated) ? this.target : this.puzzleStart }, 2000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate((state) => {
        position[this.direction] = state.position;
        this.puzzleActor.setPosition(position);
      })
      .onComplete(() => {
        this.done = true;
        
        for (let index = 1; index <= 3; index++) {
          let leverBehavior = Sup.getActor(`Lever ${index}`).getBehavior(LeverBehavior);
          if (!leverBehavior.activated || !leverBehavior.done) return;
        }

        [
          { x: -10, y: 22, z: 0 },
          { x: -3, y: 25, z: 1 },
          { x: 1, y: 21, z: -1 },
          { x: 5, y: 24, z: 2 },
          { x: 12, y: 19, z: -3 }
        ].forEach((position) => {
          let boxActor = Sup.appendScene("Scenes/Extensibility/Box Prefab")[0];
          boxActor.cannonBody.body.position.set(position.x, position.y, position.z);
        })

        Sup.Audio.playSound("Scenes/Extensibility/Yay");
      })
      .start();
  }
}
Sup.registerBehavior(LeverBehavior);
