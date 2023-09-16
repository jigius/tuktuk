import {IRenderContentCapable} from "../../../lib/Auction/Render";
import {closestSafe, querySelectorSafe} from "../../../lib/Illuminate";

/**
 * Контракт для манипуляций со значением периода. Описывает методы, используемые при выводе таймера Аукциона
 */
interface IPeriod {
  withSeconds(quantity: number): IPeriod;
  hours(): string;
  minutes(): string;
  seconds(): string;
}

/**
 * Ванильная реализация контакта `IPeriod`
 */
class Period implements IPeriod {
  private quantity: number;

  /**
   * @inheritDoc
   */
  public constructor() {
    this.quantity = 0;
  }

  /**
   * @inheritDoc
   */
  public hours(): string {
    const hours: number = Math.floor(this.quantity / 3600);
    return (hours < 10? "0": "") + hours;
  }

  /**
   * @inheritDoc
   */
  public minutes(): string {
    const minutes: number = Math.floor((this.quantity % 3600) / 60);
    return (minutes < 10? "0": "") + minutes;
  }

  /**
   * @inheritDoc
   */
  public seconds(): string {
    const seconds: number = Math.floor((this.quantity % (3600 * 60)));
    return (seconds < 10? "0": "") + seconds;
  }

  /**
   * @inheritDoc
   */
  public withSeconds(quantity: number): IPeriod {
    let that: Period = this.blueprinted();
    that.quantity = quantity;
    return that;
  }

  /**
   * Clones the instance
   * @return Period
   */
  public blueprinted(): Period {
    let that: Period = new Period();
    that.seconds = this.seconds;
    return that;
  }
}

/**
 * Контракт, используемый для склонения существительных
 */
interface IDeclensionOfNoun {
  /**
   * Возвращает существительное, для переданного числа, в требуемом склонении
   * @param num
   */
  noun(num: string): string;

  /**
   * Инициализирует инстанс параметрами из разметки страницы
   * @param elem
   */
  loaded(elem: HTMLElement): IDeclensionOfNoun;
}

/**
 * Ванильная реализация контракта `IDeclensionOfNoun`
 */
class DeclensionOfNoun implements IDeclensionOfNoun {
  private elem: HTMLElement | null;

  /**
   * Cntr
   */
  public constructor() {
    this.elem = null;
  }

  /**
   *
   * @param num
   */
  public noun(num: string): string {
    if (!this.elem) {
      throw new Error("a source of params has not been defined");
    }
    if (
      !this.elem.getAttribute("data-ed") ||
      !this.elem.getAttribute("data-eds") ||
      !this.elem.getAttribute("data-ed5")
    ) {
      throw new Error("the source of params is invalid");
    }
    const n= parseInt(num, 10);
    if (n !== 0 && !n) {
      throw new Error("the source of params is invalid");
    }
    const sel: string = n % 10 == 1 && n != 11 ? 'ed' : (n % 10 > 4 || n % 10 == 0 || n < 20 ? 'ed5' : 'eds');
    const ret: string | null = this.elem.getAttribute("data-" + sel) as string | null;
    if (!ret) {
      throw new Error("the source of params is invalid");
    }
    return ret;
  }

  /**
   * @inheritDoc
   */
  public loaded(elem: HTMLElement): IDeclensionOfNoun {
    const that: DeclensionOfNoun = this.blueprinted();
    that.elem = elem;
    return that;
  }

  /**
   * Clones the instance
   */
  public blueprinted(): DeclensionOfNoun
  {
    let that: DeclensionOfNoun = new DeclensionOfNoun();
    that.elem = this.elem;
    return that;
  }
}

/**
 * Обновляет данные каунт-даун счетчика Аукциона
 */
class TimerCountDown implements IRenderContentCapable {
  private ctx: {};
  private readonly selector: string;
  private period: IPeriod;
  private declension: IDeclensionOfNoun;
  private readonly document: Document;

  /**
   * Cntr
   * @param selector
   * @param d
   */
  public constructor(selector: string, d: Document) {
    this.ctx = {};
    this.selector = selector;
    this.document = d;
    this.period = new Period();
    this.declension = new DeclensionOfNoun();
  }

  /**
   * @inheritDoc
   * @throws Error
   */
  public render(): void {
    if (!this.ctx.hasOwnProperty("id") || this.ctx.hasOwnProperty("seconds")) {
      throw new Error("data is corrupted");
    }
    const elBase: HTMLDivElement = querySelectorSafe<HTMLDivElement>(this.document,"[data=\"" + this.ctx["id"] + "\"]");
    if (this.ctx["seconds"] === 0) {
      elBase.innerHTML = "<div class=\"end\">Завершен</div>";
    } else {
      const period: IPeriod = this.period.withSeconds(this.ctx["seconds"])
      /* hours */
      const elHours: HTMLSpanElement = querySelectorSafe<HTMLSpanElement>(elBase,".time_h");
      elHours.innerText = period.hours();
      const elHoursUnit: HTMLSpanElement = querySelectorSafe<HTMLSpanElement>(closestSafe(elHours, ".titem"), ".ed");
      elHoursUnit.innerText = this.declension.loaded(elHoursUnit).noun(elHours.innerText);
      /* minutes */
      const elMinutes: HTMLSpanElement = querySelectorSafe<HTMLSpanElement>(elBase,".time_i");
      elHours.innerText = period.hours();
      const elMinutesUnit: HTMLSpanElement = querySelectorSafe<HTMLSpanElement>(closestSafe(elMinutes, ".titem"), ".ed");
      elMinutesUnit.innerText = this.declension.loaded(elHoursUnit).noun(elMinutes.innerText);
      /* seconds */
      const elSeconds: HTMLSpanElement = querySelectorSafe<HTMLSpanElement>(elBase,".time_s");
      elHours.innerText = period.hours();
      const elSecondsUnit: HTMLSpanElement = querySelectorSafe<HTMLSpanElement>(closestSafe(elSeconds, ".titem"), ".ed");
      elSecondsUnit.innerText = this.declension.loaded(elHoursUnit).noun(elSeconds.innerText);
    }
  }

  /**
   * @inheritDoc
   */
  public with(key: string, value): TimerCountDown {
    let that: TimerCountDown = this.blueprinted();
    that.ctx[key] = value;
    return that;
  }

  /**
   * Clones the instance
   */
  public blueprinted(): TimerCountDown
  {
    let that: TimerCountDown = new TimerCountDown(this.selector, this.document);
    that.ctx = Object.assign({}, this.ctx);
    that.period = this.period;
    that.declension = this.declension;
    return that;
  }
}

export {TimerCountDown};
