namespace Game {
  export let playerBehavior: PlayerBehavior;
  export let player2Behavior: Player2Behavior;
  export let currentScene: string;
  export let music = Sup.Audio.playSound("Sounds/Music", 1, { loop: true });
  
  export function initScene(sceneName: string) {
    playerBehavior = null;
    player2Behavior = null;
    
    if (music.getState() !== Sup.Audio.SoundPlayer.State.Playing) music.play();
    Sup.loadScene("Scenes/" + sceneName + "/Scene");
    let playerActor = Sup.getActor("Player");
    
    if (currentScene != null) {
      let spawnActor = Sup.getActor(currentScene);
      playerActor.setLocalPosition(spawnActor.getLocalPosition());
      playerActor.setLocalEulerAngles(Math.PI, spawnActor.getLocalEulerAngles().y + Math.PI, 0);
    }
    currentScene = sceneName;
    
    let backscreenActor = Sup.getActor("Blackscreen");
    new Sup.Tween(backscreenActor, { opacity: 1 })
      .to({ opacity: 0 }, 600)
      .onUpdate(function(object) { backscreenActor.spriteRenderer.setOpacity(object.opacity); })
      .onComplete(function() { playerActor.getBehavior(PlayerBehavior).canMove = true; })
      .start();
  }
}

let world = Sup.Cannon.getWorld();
world.gravity.set(0, -100, 0);
world.defaultContactMaterial.friction = 0.1;

let playerMaterial = new CANNON.Material("playerMaterial");
world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, world.defaultMaterial, {
  friction: 0,
  restitution: 0,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3
}));

Sup.Audio.setMasterVolume(0.1);
Game.initScene("Hall");
