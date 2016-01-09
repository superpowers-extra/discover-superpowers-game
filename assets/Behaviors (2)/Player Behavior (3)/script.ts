class PlayerBehavior extends Sup.Behavior {
  speed = 20;
  teleportSpeedFactor = 2;
  canMove = false;
  canJump = true;
  radius = 2;
  height = 5;

  position: Sup.Math.Vector3;
  angles = new Sup.Math.Vector3(Math.PI / 2, 0, 0);
  direction = new Sup.Math.Vector3(0, 0, 1);

  modelRndr: Sup.ModelRenderer;
  modelPosition = new Sup.Math.Vector3(0, 0, 0);

  shadowActor: Sup.Actor;
  initialShadowScale: Sup.Math.Vector3;
  shadowScale: Sup.Math.Vector3;

  awake() {
    Game.playerBehavior = this;
  }
  
  start() {
    this.position = this.actor.getLocalPosition();
    this.angles.y = this.actor.getLocalEulerAngles().y;

    let angle = this.actor.getLocalEulerAngles().y;
    this.actor.cannonBody.body.position.set(this.position.x, this.height / 2, this.position.z);
    this.actor.cannonBody.body.velocity.x = Math.sin(angle) * this.speed / this.teleportSpeedFactor;
    this.actor.cannonBody.body.velocity.z = Math.cos(angle) * this.speed / this.teleportSpeedFactor;
    
    this.actor.cannonBody.body.material = playerMaterial;
    this.actor.cannonBody.body.addEventListener("collide", (event) => {
      // Only allow jumping if touching the floor
      if (event.contact.ni.y > 0.9) this.canJump = true;
    });

    this.modelRndr = this.actor.getChild("Model").modelRenderer;
    this.modelRndr.setAnimation("Walk");
    
    this.shadowActor = this.actor.getChild("Shadow");
    this.initialShadowScale = this.shadowActor.getLocalScale();
    this.shadowScale = this.initialShadowScale.clone();
  }

  goLeft()  { return Sup.Input.isKeyDown("LEFT"); }
  goRight() { return Sup.Input.isKeyDown("RIGHT"); }
  goUp()    { return Sup.Input.isKeyDown("UP"); }
  goDown()  { return Sup.Input.isKeyDown("DOWN"); }
  jump()    { return Sup.Input.wasKeyJustPressed("SPACE"); }
  
  update() {
    this.position.set(this.actor.cannonBody.body.position.x, this.actor.cannonBody.body.position.y - this.height / 2, this.actor.cannonBody.body.position.z);
    
    this.shadowScale.x = this.initialShadowScale.x / (1 + (this.actor.cannonBody.body.position.y - this.height / 2) / 4);
    this.shadowScale.y = this.initialShadowScale.y / (1 + (this.actor.cannonBody.body.position.y - this.height / 2) / 4);
    this.shadowActor.setLocalScale(this.shadowScale);
    this.shadowActor.setPosition(new Sup.Math.Vector3(this.actor.cannonBody.body.position.x, 0.1, this.actor.cannonBody.body.position.z));
    
    this.actor.setLocalEulerAngles(this.angles);
    if (!this.canMove) { return; }

    if (this.goLeft()) { this.direction.x = -1; }
    else if (this.goRight()) { this.direction.x = 1; }
    else { this.direction.x = 0; }

    if (this.goUp()) { this.direction.z = -1; }
    else if (this.goDown()) { this.direction.z = 1; }
    else { this.direction.z = 0; }

    if (this.direction.length() !== 0) {
      this.direction.normalize();
      this.actor.cannonBody.body.velocity.x = this.direction.x * this.speed;
      this.actor.cannonBody.body.velocity.z = this.direction.z * this.speed;
    } else {
      this.actor.cannonBody.body.velocity.x = 0;
      this.actor.cannonBody.body.velocity.z = 0;
    }

    let animation = "Idle";
    if ((this.actor.cannonBody.body.velocity.x !== 0 || this.actor.cannonBody.body.velocity.z !== 0)) {
      animation = "Walk";
      let angle = Math.atan2(-this.actor.cannonBody.body.velocity.z, this.actor.cannonBody.body.velocity.x) + Math.PI / 2;
      this.angles.set(Math.PI / 2, angle, 0);
    }
    
    if (!this.canJump) animation = "Jump";
    else if (this.canJump && this.jump()) {
      this.canJump = false;
      this.actor.cannonBody.body.velocity.y = 30;
      animation = "Jump";
      Sup.Audio.playSound("Sounds/Jump");
    }
    
    this.modelRndr.setAnimation(animation);
  }

  teleport(angle: number) {
    this.canMove = false;
    
    this.actor.cannonBody.body.velocity.x = Math.sin(angle) * this.speed / this.teleportSpeedFactor;
    this.actor.cannonBody.body.velocity.z = Math.cos(angle) * this.speed / this.teleportSpeedFactor;
    
    this.angles.y = angle;
  }
}
Sup.registerBehavior(PlayerBehavior);
