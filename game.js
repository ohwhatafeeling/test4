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
};

function create() {
  const map = this.make.tilemap({key: 'map'});
  const tileset = map.addTilesetImage('platformTiles', 'tiles');
  const platforms = map.createStaticLayer('PlatformLayer', tileset, 0, 0);
};

function update() {

}
