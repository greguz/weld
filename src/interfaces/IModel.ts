import { IObserver } from "./IObserver";

/**
 * Data model container, expose a single function to create observers
 */

export interface IModel {

  /**
   * Observe a path value
   */

  observe(path: string): IObserver;

  /**
   * Start data watching
   */

  start(): void;

  /**
   * Stop data watching
   */

  stop(): void;

}
