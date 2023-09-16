/**
 * Описания контракта "IAuctionCollection" (Коллекция Аукционов) и его ванильной имплементации
 */
import {IAuction} from "./Auction";

interface CbAuction {
  (value: IAuction): void;
}

interface IAuctionCollection {
  /**
   * Appends an item into the collection
   * @param item
   */
  with(item: IAuction): IAuctionCollection;

  /**
   * Removes an item from the collection
   * @param item
   */
  without(item: IAuction): IAuctionCollection;

  /**
   * Iterates items via callable
   * @param callback
   */
  each(callback: CbAuction): void;

  /**
   * Signs if the collection is emptied
   */
  emptied(): boolean;

  /**
   * Clones the instance
   */
  blueprinted(): IAuctionCollection
}

/**
 * Ванильная реализация коллекции Аукционов
 */
class AuctionsVanilla implements IAuctionCollection {
  private coll: object;

  /**
   * Cntr
   */
  public constructor() {
    this.coll = {};
  }

  /**
   * @inheritDoc
   */
  public each(callback: CbAuction): void {
    for (const k in this.coll) {
      if (!callback(this.coll[k])) {
        break;
      }
    }
  }

  /**
   * @inheritDoc
   */
  public with(item: IAuction): IAuctionCollection {
    const that: AuctionsVanilla = this.blueprinted();
    that.coll[item.id()] = item;
    return that;
  }

  /**
   * @inheritDoc
   */
  public without(item: IAuction): IAuctionCollection {
    const that: AuctionsVanilla = this.blueprinted();
    delete(that.coll[item.id()]);
    return that;
  }

  /**
   * @inheritDoc
   */
  public emptied(): boolean {
    return Object.keys(this.coll).length === 0
  }

  /**
   * @inheritDoc
   */
  public blueprinted(): AuctionsVanilla {
    let that: AuctionsVanilla = new AuctionsVanilla();
    that.coll = Object.assign({}, this.coll);
    return that;
  }
}

export {IAuctionCollection, AuctionsVanilla, CbAuction};
