class PlaneBehavior extends Sup.Behavior {
  quaternion = new Sup.Math.Quaternion(0, 0, 0, 1).setFromYawPitchRoll(Math.PI / 300, Math.PI / 300, 0);
  
  update() { this.actor.rotate(this.quaternion); }
}
Sup.registerBehavior(PlaneBehavior);
