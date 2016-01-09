class RadioBehavior extends Sup.Behavior {
  modelRndr: Sup.ModelRenderer;
  spawnTimer = 0;
  spawnDelay = 30;
  music: Sup.Audio.SoundPlayer;
  musicPlayed = true;
  
  awake() {
    Game.music.stop();

    this.modelRndr = this.actor.getChild("Model").modelRenderer;
    this.music = Sup.Audio.playSound("Scenes/2D/Music", 1, { loop: true });
  }
  onDestroy() { this.music.stop(); }

  update() {
    this.spawnTimer -= 1;
    
    if (this.spawnTimer < 0 && this.musicPlayed) {
      this.spawnTimer = this.spawnDelay
      
      let noteActor = new Sup.Actor("Note");
      noteActor.setPosition(this.actor.getPosition());
      noteActor.move(Sup.Math.Random.integer(-15, 15) / 10, 3, 0);
      new Sup.SpriteRenderer(noteActor, "Scenes/2D/NoteFx");
      noteActor.addBehavior(FloatUpBehavior);
    }
    
    if (Game.playerBehavior.position.distanceTo(this.actor.getPosition()) < 5) {
      this.modelRndr.setColor(1.5, 1.5, 1.5);
      
      if (Sup.Input.wasKeyJustReleased("X") || Sup.Input.wasKeyJustReleased("RETURN")) {
        this.musicPlayed = !this.musicPlayed;
        if (this.musicPlayed) this.music.play();
        else this.music.pause();
      }
    } else this.modelRndr.setColor(1, 1, 1);
  }
}
Sup.registerBehavior(RadioBehavior);
