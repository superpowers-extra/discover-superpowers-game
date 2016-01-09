class XboxBehavior extends Sup.Behavior {
  update() {
    if (Sup.Input.getGamepadAxisValue(0, 0) < -0.25 || Sup.Input.getGamepadAxisValue(0, 0) > 0.25 || 
    Sup.Input.getGamepadAxisValue(0, 1) < -0.25 || Sup.Input.getGamepadAxisValue(0, 1) > 0.25 ||
    Sup.Input.wasGamepadButtonJustPressed(0, 0))
      this.actor.destroy();
  }
}
Sup.registerBehavior(XboxBehavior);
