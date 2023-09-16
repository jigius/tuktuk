/**
 * Описания контракта "TimerCountDown"(Таймер Обратного Отсчета)
 */

import {IRenderEntityCapable, IRenderContentCapable} from "../Render";

interface ITimerCountDown extends IRenderEntityCapable {
  /**
   * Задает новый период
   * @param seconds
   */
  withLeft(seconds: number): ITimerCountDown;

  /**
   * Возвращает текущий период
   */
  left(): number;
}

/**
 * Ванильная реализация контракта
 */
class TimerCountDownVanilla implements ITimerCountDown {
  private readonly seconds: number;

  /**
   * Cntr
   * @param seconds
   */
  public constructor(seconds: number = 0) {
    this.seconds = seconds;
  }

  /**
   * @inheritDoc
   */
  public left(): number {
    return Math.max(0, this.seconds);
  }

  /**
   * @inheritDoc
   */
  public render(r: IRenderContentCapable): void {
    r
      .with("seconds", this.left())
      .render();
  }

  /**
   * @inheritDoc
   */
  withLeft(seconds: number): ITimerCountDown {
    return new TimerCountDownVanilla(seconds);
  }
}

export {ITimerCountDown, TimerCountDownVanilla};
