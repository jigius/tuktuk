import {IRenderContentCapable} from "../../../lib/Auction/Render";
import {closestSafe, queryAttributeSafe, querySelectorSafe} from "../../../lib/Illuminate";


/**
 * Legacy formatter
 * @param number
 * @param decimals
 * @param dec_point
 * @param thousands_sep
 */
const number_format = (number: number, decimals: number, dec_point: string, thousands_sep: string): string => {
  let str = number.toFixed(decimals ? decimals : 0).toString().split('.');
  let parts = [];
  for (let i: number = str[0].length; i > 0; i -= 3) {
    parts.unshift(str[0].substring(Math.max(0, i - 3), i));
  }
  str[0] = parts.join(thousands_sep ? thousands_sep : ',');
  return str.join(dec_point ? dec_point : '.');
}

/**
 * Обновляет данные по ставкам у Аукциона
 */
class Bet implements IRenderContentCapable {
  private ctx: {};
  private readonly selector: string;
  private document: Document;

  /**
   * Cntr
   */
  public constructor(selector: string, d: Document) {
    this.ctx = {};
    this.selector = selector;
    this.document = d;
  }

  /**
   * @inheritDoc
   */
  public render(): void {
    if (
      !this.ctx.hasOwnProperty("id") ||
      this.ctx.hasOwnProperty("current") ||
      this.ctx.hasOwnProperty("total") ||
      this.ctx.hasOwnProperty("userInfo")
    ) {
      throw new Error("data is corrupted");
    }
    const sel: string = this.selector + "[data=\"" + this.ctx["id"] + "\"]";
    const elBase: HTMLDivElement = querySelectorSafe<HTMLDivElement>(this.document, sel);
    const elSuper: HTMLDivElement = closestSafe<HTMLDivElement>(elBase, "div");
    const rate: number | null =
      parseFloat(
        queryAttributeSafe(
          querySelectorSafe(elSuper, ".auc_bet_block .auc_notice"),
          "rate"
        )
      );
    if (rate !== 0 && !rate) {
      throw new Error("the output content is invalid");
    }
    querySelectorSafe<HTMLSpanElement>(elSuper, ".current_bet").innerText = ((current: number, rate: number): string => {
      let currentBet: number = Math.round(current / rate * 100) / 100;
      let ret: string;
      if (rate == 1) {
        ret = number_format(currentBet, 0, ".", " ");
      } else {
        ret = number_format(currentBet, 2, ".", " ");
      }
      return ret;
    }) (this.ctx['current'], rate);
    querySelectorSafe<HTMLSpanElement>(elSuper, ".bet_count").innerText = this.ctx["total"];
    querySelectorSafe<HTMLDivElement>(elSuper, ".timer_end_time").innerText = this.ctx["userInfo"];
  }

  /**
   * @inheritDoc
   */
  public with(key: string, value): Bet {
    let that: Bet = this.blueprinted();
    that.ctx[key] = value;
    return that;
  }

  /**
   * Clones the instance
   */
  public blueprinted(): Bet
  {
    let that: Bet = new Bet(this.selector, this.document);
    that.ctx = Object.assign({}, this.ctx);
    return that;
  }
}

export {Bet};
