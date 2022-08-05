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
var startX;
var startY;
var endX;
var endY;
var score = 0;
var scoreText;

function preload() {
  this.load.image('tiles', 'assets/Terrain/Terrain (16X16).png');
  this.load.tilemapTiledJSON('map', 'assets/Terrain Maps/level4.json');
  this.load.spritesheet('maskDudeRun', 'assets/Main Characters/Mask Dude/Run (32x32).png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('maskDudeIdle', 'assets/Main Characters/Mask Dude/Idle (32x32).png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('maskDudeJump', 'assets/Main Characters/Mask Dude/Jump (32x32).png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('apple', 'assets/Items/Fruits/Apple.png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('banana', 'assets/Items/Fruits/Bananas.png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('cherry', 'assets/Items/Fruits/Cherries.png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('kiwi', 'assets/Items/Fruits/Kiwi.png', {frameWidth: 32, frameHeight: 32});
};

function create() {
  const map = this.make.tilemap({key: 'map'});
  const tileset = map.addTilesetImage('platformTiles', 'tiles');
  const platforms = map.createStaticLayer('PlatformLayer', tileset, 0, 0);

  platforms.setCollisionByExclusion(-1, true);

  scoreText = this.add.text(96, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});

  this.apples = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  this.bananas = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  this.cherries = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  this.kiwis = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  map.getObjectLayer('AppleLayer').objects.forEach(apple => {
    const appleSprite = this.apples.create(apple.x, apple.y - 32, 'apple').setOrigin(0);
  });

  map.getObjectLayer('BananaLayer').objects.forEach(banana => {
    const bananaSprite = this.bananas.create(banana.x, banana.y - 32, 'banana').setOrigin(0);
  });

  map.getObjectLayer('CherryLayer').objects.forEach(cherry => {
    const cherrySprite = this.cherries.create(cherry.x, cherry.y - 32, 'cherry').setOrigin(0);
  });

  map.getObjectLayer('KiwiLayer').objects.forEach(kiwi => {
    const kiwiSprite = this.kiwis.create(kiwi.x, kiwi.y - 32, 'kiwi').setOrigin(0);
  });

  map.getObjectLayer('StartEnd').objects.forEach(coordinate => {
    if (coordinate.name == 'Start') {
      startX = coordinate.x;
      startY = coordinate.y;
    } else if (coordinate.name == 'End') {
      endX = coordinate.x;
      endY = coordinate.y;
    }
  })

  this.player = this.physics.add.sprite(startX, startY, 'maskDudeIdle');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, platforms);

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('maskDudeRun', {start: 0, end: 10}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('maskDudeIdle', {start: 0, end: 10}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('maskDudeJump', {start: 0, end: 0}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'applePlay',
    frames: this.anims.generateFrameNumbers('apple', {start: 0, end: 16}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'bananaPlay',
    frames: this.anims.generateFrameNumbers('banana', {start: 0, end: 16}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'cherryPlay',
    frames: this.anims.generateFrameNumbers('cherry', {start: 0, end: 16}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'kiwiPlay',
    frames: this.anims.generateFrameNumbers('kiwi', {start: 0, end: 16}),
    frameRate: 20,
    repeat: -1
  });

  this.apples.children.iterate(apple => {
    apple.play('applePlay');
  });

  this.bananas.children.iterate(banana => {
    banana.play('bananaPlay');
  });

  this.cherries.children.iterate(cherry => {
    cherry.play('cherryPlay');
  });

  this.kiwis.children.iterate(kiwi => {
    kiwi.play('kiwiPlay');
  });

  this.physics.add.overlap(this.player, this.apples, collectApple, null, this);
  this.physics.add.overlap(this.player, this.bananas, collectBanana, null, this);
  this.physics.add.overlap(this.player, this.cherries, collectCherry, null, this);
  this.physics.add.overlap(this.player, this.kiwis, collectKiwi, null, this);

  this.cursors = this.input.keyboard.createCursorKeys();
};

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
    if (this.player.body.onFloor()) {
      this.player.play('run', true);
    }
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
    if (this.player.body.onFloor()) {
      this.player.play('run', true);
    }
  } else {
    this.player.setVelocityX(0);
    if (this.player.body.onFloor()) {
      this.player.play('idle', true);
    }
  }
  if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }
  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
    this.player.setFlipX(true);
  }
  if ((((this.player.x + 16) > endX) && ((this.player.x - 16) < endX)) && (((this.player.y + 16) > endY) && ((this.player.y - 16) < endY))) {
    this.player.disableBody(true, true);
    scoreText.setText('GAME FINISHED.\nYour score: ' + score);
  }
}

function collectApple(player, apple) {
  apple.disableBody(true, true);
  score += 10;
  scoreText.setText('score: ' + score);
}

function collectBanana(player, banana) {
  banana.disableBody(true, true);
  score += 20;
  scoreText.setText('score: ' + score);
}

function collectCherry(player, cherry) {
  cherry.disableBody(true, true);
  score += 30;
  scoreText.setText('score: ' + score);
}

function collectKiwi(player, kiwi) {
  kiwi.disableBody(true, true);
  score += 40;
  scoreText.setText('score: ' + score);
}
