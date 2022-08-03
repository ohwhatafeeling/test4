const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 480,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 500},
      debug: true
    }
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', 'assets/Terrain/Terrain (16X16).png');
  this.load.tilemapTiledJSON('map', 'assets/Terrain Maps/level4.json');
  this.load.spritesheet('maskDudeRun', 'assets/Main Characters/Mask Dude/Run (32x32).png', {frameWidth:32, frameHeight: 32});
  this.load.spritesheet('maskDudeIdle', 'assets/Main Characters/Mask Dude/Idle (32x32).png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('maskDudeJump', 'assets/Main Characters/Mask Dude/Jump (32x32).png', {frameWidth:32, frameHeight: 32});
};

function create() {
  const map = this.make.tilemap({key: 'map'});
  const tileset = map.addTilesetImage('platformTiles', 'tiles');
  const platforms = map.createStaticLayer('PlatformLayer', tileset, 0, 0);

  platforms.setCollisionByExclusion(-1, true);

  this.player = this.physics.add.sprite(32, 32, 'maskDudeIdle');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, platforms);

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('maskDudeRun', {start: 0, end: 16}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('maskDudeIdle', {start: 0, end: 16}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('maskDudeJump', {start: 0, end: 0}),
    frameRate: 20,
    repeat: -1
  });

  this.cursors = this.input.keyboard.createCursorKeys();
};

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
    if (this.player.body.onFloor) {
      this.player.play('run');
    }
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
    if (this.player.body.onFloor) {
      this.player.play('run');
    }
  } else {
    this.player.setVelocityX(0);
    if (this.player.body.onFloor) {
      this.player.play('idle');
    }
  }
  if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
    this.player.play('jump');
  }
}
