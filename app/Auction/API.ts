import {IAuction} from "../../lib/Auction/Auction";

interface IAPI {
  /**
   * Актуализирует параметры аукциона через api вызов
   * @param a
   */
  actualizedAuction(a: IAuction): Promise<IAuction>;
}

/**
 * Используется для обновления параметров аукциона актуальными данными, полученные через API
 */
class APILegacy implements IAPI {
  /**
   * Cntr
   */
  public constructor() {
  }

  /**
   * @inheritDoc
   */
  public actualizedAuction(a: IAuction): Promise<IAuction> {
    return fetch("/updatetimer/" + a.id() + ".txt")
      .then(
        (response) => {
          if (!response.ok) {
            throw new Error("response is invalid");
          }
          return response.json();
        }
      )
      .then(
        (data: object | null) => {
          if (
            !data ||
            !data.hasOwnProperty("timer_end") ||
            !data.hasOwnProperty("current_bet") ||
            !data.hasOwnProperty("total_bet") ||
            !data.hasOwnProperty("date_end")
          ) {
            throw new Error("data is corrupted");
          }
          return a
            .withTimer(
              a
                .timer()
                .withLeft(
                  Math.max(0, new Date(data['timer_end']).getTime() - new Date().getTime())
                )
            )
            .withBet(
              a
                .bet()
                .withCurrent(data["current_bet"])
                .withTotal(data["total_bet"])
                .withUseInfo(data["date_end"])
            );
        }
      );
  }
}

export {IAPI, APILegacy};
