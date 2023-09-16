/**
 * Описания контракта "IAuction"(Аукцион) и его ванильной имплементации
 */
import {ITimerCountDown, TimerCountDownVanilla} from "./TimerCountDown";
import {IBet, BetVanilla} from "./Bet";
import {IRenderContentCapable, IRenderEntityCapable} from "../Render";

interface IAuction extends IRenderEntityCapable {
  withId(id: string): IAuction;
  id(): string;
  withTimer(t: ITimerCountDown): IAuction;
  timer(): ITimerCountDown;
  withBet(b: IBet): IAuction;
  bet(): IBet;
}

/**
 * Ванильная реализация Аукциона
 */
class AuctionVanilla implements IAuction {
  private t: ITimerCountDown;
  private b: IBet;
  private identity: string;

  /**
   * Cntr
   */
  public constructor() {
    this.t = new TimerCountDownVanilla();
    this.b = new BetVanilla();
    this.identity = "";
  }

  /**
   * @inheritDoc
   */
  public bet(): IBet {
    return this.b;
  }

  /**
   * @inheritDoc
   * @throws Error
   */
  public id(): string {
    if (!this.identity) {
      throw new Error("invalid identity");
    }
    return this.identity;
  }

  /**
   * @inheritDoc
   */
  public timer(): ITimerCountDown {
    return this.t;
  }

  /**
   * @inheritDoc
   */
  public withBet(b: IBet): IAuction {
    const that: AuctionVanilla = this.blueprinted();
    that.b = b;
    return that;
  }

  /**
   * @inheritDoc
   */
  public withId(id: string): IAuction {
    const that: AuctionVanilla = this.blueprinted();
    that.identity = id;
    return that;
  }

  /**
   * @inheritDoc
   */
  public withTimer(t: ITimerCountDown): IAuction {
    const that: AuctionVanilla = this.blueprinted();
    that.t = t;
    return that;
  }

  /**
   * @inheritDoc
   */
  public render(r: IRenderContentCapable): void {
    r = r.with("id", this.id());
    this.timer().render(r);
    this.bet().render(r);
  }

  /**
   * Clones the current instance
   */
  public blueprinted(): AuctionVanilla {
    let that: AuctionVanilla = new AuctionVanilla();
    that.t = this.t;
    that.b = this.b;
    that.identity = this.identity;
    return that;
  }
}

export {IAuction, AuctionVanilla}
