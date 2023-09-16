/**
 * Описания контракта "IBet"(Ставки) и его ванильной имплементации
 */
import {IRenderContentCapable, IRenderEntityCapable} from "../Render";

interface IBet extends IRenderEntityCapable {
  /**
   *
   * @param value
   * @return IBet
   */
  withCurrent(value: number): IBet;
  withTotal(value: number): IBet;
  withUseInfo(value: string): IBet;
}

type BetData = {
  current: number,
  total: number,
  userInfo: string
};

/**
 * Ванильная реализация Ставки
 */
class BetVanilla implements IBet {
  private i: BetData | undefined;

  /**
   * Cntr
   */
  public constructor() {
  }

  /**
   * @inheritDoc
   */
  public render(r: IRenderContentCapable): void {
    if (
      typeof this.i.current === "undefined" ||
      typeof this.i.total === "undefined" ||
      typeof this.i.userInfo === "undefined"
    ) {
      throw new Error("data is invalid");
    }
    r
      .with("current", this.i.current)
      .with("total", this.i.total)
      .with("userInfo", this.i.userInfo)
      .render();
  }

  /**
   * @inheritDoc
   */
  public withCurrent(value: number): IBet {
    let that: BetVanilla = this.blueprinted();
    that.i.current = value;
    return that;
  }

  /**
   * @inheritDoc
   */
  public withTotal(value: number): IBet {
    let that: BetVanilla = this.blueprinted();
    that.i.total = value;
    return that;
  }

  /**
   * @inheritDoc
   */
  public withUseInfo(value: string): IBet {
    let that: BetVanilla = this.blueprinted();
    that.i.userInfo = value;
    return that;
  }

  /**
   * Clones the current instance
   */
  public blueprinted(): BetVanilla {
    let that: BetVanilla = new BetVanilla();
    that.i = Object.assign({}, this.i);
    return that;
  }
}

/**
 * Блокирует вызов отрисовки информации о текущих ставках для инкапсулированного инстанса.
 * Используется в случае вывода аукционного товара на странице, без вывода его параметров
 * по ставкам (Например - блок "Наш выбор" в карточке товара)
 */
class BetWithSuppressedRender implements IBet {
  private readonly original: IBet;

  /**
   * Cntr
   * @param bet
   */
  constructor(bet: IBet) {
    this.original = bet;
  }

  /**
   * @inheritDoc
   */
  public render(r: IRenderContentCapable): void {
    return;
  }

  /**
   * @inheritDoc
   */
  public withCurrent(value: number): IBet {
    const that: BetWithSuppressedRender = this.blueprinted();
    that.original.withCurrent(value);
    return that;
  }

  /**
   * @inheritDoc
   */
  public withTotal(value: number): IBet {
    const that: BetWithSuppressedRender = this.blueprinted();
    that.original.withTotal(value);
    return that;
  }

  /**
   * @inheritDoc
   */
  public withUseInfo(value: string): IBet {
    const that:BetWithSuppressedRender = this.blueprinted();
    that.original.withUseInfo(value);
    return that;
  }

  /**
   * Clones the current instance
   */
  public blueprinted(): BetWithSuppressedRender {
    return new BetWithSuppressedRender(this.original);
  }
}

export {IBet, BetVanilla, BetWithSuppressedRender}
