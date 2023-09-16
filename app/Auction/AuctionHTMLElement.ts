import {IAuction} from "../../lib/Auction/Auction";
import {BetWithSuppressedRender} from "../../lib/Auction/Bet";
import {closestSafe, queryAttributeSafe, querySelectorSafe} from "../../lib/Illuminate";

interface IFabricAuctionHTMLElement {
  /**
   * Возвращает новый инстанс, поддерживающий контракт `IAuction`, иcпользуя данные из переданного HTMLElement
   * @param elem данные о h:i:s
   */
  auction(elem: HTMLElement): IAuction
}

/**
 * Используется для первоначального извлечения данных об аукционе из элемента DOM страницы
 */
class FabricAuction implements  IFabricAuctionHTMLElement {
  private readonly hoursSelector: string;
  private readonly minutesSelector: string;
  private readonly secondsSelector: string;
  private readonly a: IAuction;

  /**
   * Cntr
   * @param hoursSelector
   * @param minutesSelector
   * @param secondsSelector
   * @param a
   */
  public constructor(hoursSelector: string, minutesSelector: string, secondsSelector: string, a: IAuction) {
    this.hoursSelector = hoursSelector;
    this.minutesSelector = minutesSelector;
    this.secondsSelector = secondsSelector;
    this.a = a;
  }

  /**
   * @inheritDoc
   * @throws Error
   */
  public auction(elem: HTMLElement): IAuction {
    let t: HTMLElement = querySelectorSafe<HTMLSpanElement>(elem, this.hoursSelector);
    const hours: number = parseInt(t.innerText, 10);
    if (hours !== 0 && !hours || hours < 0) {
      throw new Error("no valid data for the building");
    }
    t = querySelectorSafe<HTMLSpanElement>(elem, this.minutesSelector);
    const minutes: number = parseInt(t.innerText, 10);
    if (minutes !== 0 && !minutes || minutes < 0 || minutes > 59) {
      throw new Error("no valid data for the building");
    }
    t = querySelectorSafe<HTMLSpanElement>(elem, this.secondsSelector);
    const seconds: number = parseInt(t.innerText, 10);
    if (seconds !== 0 && !seconds || seconds < 0 || seconds > 59) {
      throw new Error("no valid data for the building");
    }
    const identity: string = queryAttributeSafe(elem, "data-id");
    let extended: boolean = false;
    if (
      !!closestSafe<HTMLDivElement>(elem, "div").querySelector(".auction_parent_cnt") as HTMLDivElement | null
    ) {
      extended = true;
    }
    let a: IAuction = this
      .a
      .withId(identity)
      .withTimer(
        this
          .a
          .timer()
          .withLeft(hours * 86400 + minutes * 60 + seconds)
      );
    if (!extended) {
      a = a.withBet(new BetWithSuppressedRender(a.bet()));
    }
    return a;
  }
}

export {IFabricAuctionHTMLElement, FabricAuction};
