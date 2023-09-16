import {AuctionsVanilla, IAuctionCollection} from "../../lib/Auction/Auctions";
import {IAuction} from "../../lib/Auction/Auction";

/**
 * Контракт c возможностью фильтрации коллекции аукционов
 */
interface IAuctionProcessableCollection {
  /**
    * @param coll
   */
  processed(coll: IAuctionCollection): IAuctionCollection;
}

/**
 * Инстанс с предконфигурированным фильтром, по которому отбираются аукционы для обновления
 * их параметров через api-вызовы
 */
class AuctionsExposedForActualization implements IAuctionProcessableCollection {
  private original: IAuctionCollection;
  private readonly accepted: (a: IAuction) => boolean;
  private readonly coll: IAuctionCollection;

  /**
   * Cntr
   */
  public constructor(coll: IAuctionCollection) {
    this.coll = coll;
    this.accepted = (a: IAuction): boolean => {
      /*
       * Аукционы, которые не обновлялись последние 15 секунд включаем в список итерируемых объектов
       */
      if (a.timer().left() % 15 === 0) {
        return true;
      }
      /*
       * Аукционы, до окончания которых осталось меньше 5 минут включаем в список итерируемых объектов
       */
      return a.timer().left() < 5 * 60;

    };
    this.original = new AuctionsVanilla();
  }

  /**
   * @inheritDoc
   */
  public processed(coll: IAuctionCollection): IAuctionCollection {
    let ret: IAuctionCollection = this.coll;
    this.original.each((a: IAuction): void => {
      if (this.accepted(a)) {
        ret = ret.with(a);
      }
    });
    return ret;
  }
}

export {AuctionsExposedForActualization, IAuctionProcessableCollection};
