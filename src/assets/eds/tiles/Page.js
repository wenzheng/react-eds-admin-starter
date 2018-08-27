import { Tile } from './Tile';

export class Page {

  constructor(){
    this.dom = {
      page: document,
      tiles: document.querySelectorAll('.tile'),
    };
    this.tiles = []
  }

  init(){
    if(this.dom.tiles) {
      this.dom.tiles.forEach( tile => {
        const t = new Tile(tile);
        t.init();
        this.tiles.push(t);
      });
    }
    this.eventHandler();
  }

  eventHandler(){
    this.dom.page.addEventListener('maximizeTile', (e) => this.hideNotSelf(e), false);
    this.dom.page.addEventListener('minimizeTile', () => this.showAll(), false);
  }

  showAll(event){
    this.tiles.forEach( tile => {
      tile.show();
    });
  }

  hideNotSelf(event) {
    this.tiles.forEach( tile => {
      if(tile.dom.id != event.detail.id){ tile.hide(); }
    });
  }

  destroy(){
    //
  }

}
