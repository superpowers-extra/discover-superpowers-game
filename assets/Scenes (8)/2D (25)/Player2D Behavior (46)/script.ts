Sup.ArcadePhysics2D.setGravity(0, -0.02);

class Player2DBehavior extends Sup.Behavior {
  speed = 0.4;
  initialPosition: Sup.Math.Vector3;
  attackCooldown = 0;
  attackCooldownDelay = 15;
  canAttack = false;
  hitTimer = 0;
  hitDelay = 8;

  player1Behavior: Player2DBehavior;
  player2Behavior: Player2DBehavior;
  
  awake() {
    this.initialPosition = this.actor.getPosition();
    this.actor.arcadeBody2D.setVelocityMultiplier(new Sup.Math.Vector3(0.7, 1, 1));
    this.player1Behavior = Sup.getActor("2D Scene").getChild("Player 1").getBehavior(Player2DBehavior);
    this.player2Behavior = Sup.getActor("2D Scene").getChild("Player 2").getBehavior(Player2DBehavior);
  }
  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    if (this.hitTimer > 0) {
      this.hitTimer -= 1
      if (this.hitTimer === 0) { this.actor.arcadeBody2D.setVelocityMultiplier(new Sup.Math.Vector3(0.7, 1, 1)); }
      return
    }
    
    if (this.actor.getLocalPosition().y < -20) {
      this.player1Behavior.respawn();
      this.player2Behavior.respawn();
      
    } else if (this.actor.spriteRenderer.getAnimation() === "Punch") {
      if (this.canAttack && this.actor.spriteRenderer.getAnimationFrameTime() / this.actor.spriteRenderer.getAnimationFrameCount() > 0.5) {
        this.canAttack = false;
        if (this.actor.getName() === "Player 1") {
          if (this.player2Behavior.actor.getLocalPosition().x - this.actor.getLocalPosition().x < 6) this.player2Behavior.attack(1);
        } else {
          if (this.actor.getLocalPosition().x - this.player1Behavior.actor.getLocalPosition().x < 6) this.player1Behavior.attack(-1);
        }
      }
      
      if (!this.actor.spriteRenderer.isAnimationPlaying()) {
        this.attackCooldown = this.attackCooldownDelay;
        this.actor.spriteRenderer.setAnimation("Idle");
      }
      
    } else if (Math.abs(this.actor.arcadeBody2D.getVelocity().x) > 0.1) this.actor.spriteRenderer.setAnimation("Run");  
    else this.actor.spriteRenderer.setAnimation("Idle");
    
    if (this.attackCooldown > 0) this.attackCooldown -= 1;
  }
  goLeft() {
    if (this.actor.spriteRenderer.getAnimation() !== "Punch" && this.hitTimer === 0) {
      let velocity = this.actor.arcadeBody2D.getVelocity()
      velocity.x = -this.speed;
      this.actor.arcadeBody2D.setVelocity(velocity);
    }
  }
  goRight() {
    if (this.actor.spriteRenderer.getAnimation() !== "Punch" && this.hitTimer === 0) {
      let velocity = this.actor.arcadeBody2D.getVelocity()
      velocity.x = this.speed;
      this.actor.arcadeBody2D.setVelocity(velocity);
    }
  }
  punch() {
    if (this.actor.spriteRenderer.getAnimation() !== "Punch" && this.attackCooldown === 0) {
      this.actor.spriteRenderer.setAnimation("Punch", false);
      this.canAttack = true
    }
  }
  attack(direction: number) {
    let velocity = this.actor.arcadeBody2D.getVelocity();
    velocity.x = this.speed * direction * 2;
    this.actor.arcadeBody2D.setVelocity(velocity);
    
    this.actor.arcadeBody2D.setVelocityMultiplier(new Sup.Math.Vector3(0.99, 1, 1));
    this.hitTimer = this.hitDelay;
    
    this.actor.spriteRenderer.setAnimation("Hit");
  }

  respawn() {
    this.actor.arcadeBody2D.setVelocity(new Sup.Math.Vector3(0, 0, 0));
    this.actor.arcadeBody2D.warpPosition(this.initialPosition);
  }
}

Sup.registerBehavior(Player2DBehavior);