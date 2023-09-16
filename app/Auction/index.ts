import {AuctionsVanilla, IAuctionCollection} from "../../lib/Auction/Auctions";
import {AuctionVanilla, IAuction} from "../../lib/Auction/Auction";
import {BetVanilla} from "../../lib/Auction/Bet";
import {FabricAuction, IFabricAuctionHTMLElement} from "./AuctionHTMLElement";
import {TimerCountDownVanilla} from "../../lib/Auction/TimerCountDown";
import {APILegacy, IAPI} from "./API";
import {AuctionsExposedForActualization, IAuctionProcessableCollection} from "./Auctions";
import {TimerCountDown} from "./Renders/TimerCountDown";
import {Bet} from "./Renders/Bet";

const TICK_PERIOD_IN_SECONDS: number = 1;

/**
 * Запуск функционала по обновлению состояний аукционов, показанных на странице
 */
const bootstrap = (): void => {
  const masterSelector: string = ".timer.active";
  let auctions: IAuctionCollection = ((selector: string, coll: IAuctionCollection, fa: IFabricAuctionHTMLElement): IAuctionCollection => {
    /*
     * Извлекает из DOM страницы и возвращает коллекцию активных аукционов
     */
    document.querySelectorAll(selector).forEach((el: HTMLElement): void => {
      try {
        coll = coll.with(fa.auction(el));
      } catch (err: Error) {
        /*
         * По какой-то причине из отобранного по определенному селектору DOM-элемента,
         * фабрика Аукционов не смогла создать инстанс :(
         */

        /*
         * Ничего не делаем - пропускаем ошибку
         * FIXME: па крайней мене нужно уведомить о проблеме ?!
         */
      }
    });
    return coll;
  }) (
    masterSelector,
    new AuctionsVanilla(),
    new FabricAuction(
      ".num.timer_h",
      ".num.timer_i",
      ".num.timer_s",
      (new AuctionVanilla())
        .withBet(
            new BetVanilla()
        )
        .withTimer(
          new TimerCountDownVanilla()
        )
    )
  );
  let tickHandler: number | null = null;
  if (!auctions.emptied()) {
    /*
     * Включаем планировщик
     */
    tickHandler = setInterval(
      (): void => {
        ((as: IAuctionCollection) => {
          /*
           * Уменьшаем значения счетчиков у аукционов и перерисовываем их на странице
           */
          as
            .each(
              (a: IAuction) => {
                a =
                  a
                    .withTimer(
                      a
                        .timer()
                        .withLeft(
                          a.timer().left() - 1
                        )
                    );
                a.timer().render(new TimerCountDown(masterSelector, document));
                auctions = auctions.with(a);
              }
            );
        })(auctions);

        ((as: IAuctionCollection, ea: IAuctionProcessableCollection, api: IAPI): void => {
          /*
           * Актуализируем параметры отдельных (не всех!) аукционов, используя данные,
           * полученные для них из api-запросов
           */
          ea
            .processed(as)
            .each(
              (a: IAuction): void => {
                api
                  .actualizedAuction(a)
                  .then(
                    (a: IAuction): void => {
                      a.timer().render(new TimerCountDown(masterSelector, document));
                      a.bet().render(new Bet(masterSelector, document));
                      if (a.timer().left() > 0) {
                        auctions = auctions.with(a);
                      } else {
                        auctions = auctions.without(a);
                        if (auctions.emptied()) {
                          /*
                           * Выключаем планировщик - все аукционы завершены
                           */
                          clearInterval(tickHandler);
                          tickHandler = null;
                        }
                      }
                    }
                  )
                  .catch(
                    (): void => {
                      /*
                       * По какой-то причине параметры для аукциона не были обновлены :(
                       */

                      /*
                       * Ничего не делаем - пропускаем ошибку
                       * FIXME: па крайней мене нужно уведомить о проблеме ?!
                       */
                    }
                  );
              }
            );
        }) (
          auctions,
          new AuctionsExposedForActualization(new AuctionsVanilla()),
          new APILegacy()
        );
      },
      TICK_PERIOD_IN_SECONDS * 1000
    );
  }
}

export {bootstrap};
