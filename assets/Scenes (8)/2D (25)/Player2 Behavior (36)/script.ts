class Player2Behavior extends PlayerBehavior {
  awake() { 
    Game.player2Behavior = this;
    this.canMove = true;
  }
  
  goLeft()  { return Sup.Input.getGamepadAxisValue(0, 0) < -0.25 }
  goRight() { return Sup.Input.getGamepadAxisValue(0, 0) > 0.25 }
  goUp()    { return Sup.Input.getGamepadAxisValue(0, 1) < -0.25 }
  goDown()  { return Sup.Input.getGamepadAxisValue(0, 1) > 0.25 }
  jump()    { return Sup.Input.wasGamepadButtonJustPressed(0, 0) }
}

Sup.registerBehavior(Player2Behavior);
