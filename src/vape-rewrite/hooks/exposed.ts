/**
 * a bunch of methods that are exposed in the store.
 * @module
 */

import Bus from "../Bus";
import CancelableWrapper from "../event/api/CancelableWrapper";
import ClientEvents from "../event/api/Events";
import ModuleManager from "../features/module/api/ModuleManager";

export default {
  newCancelableWrapper<T>(data: T): CancelableWrapper<T> {
    return new CancelableWrapper(data);
  },
  emitEvent<E extends keyof ClientEvents>(event: E, ...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]) {
    Bus.emit(event, ...payload);
  },
  get moduleManager() {
    return ModuleManager;
  }
   //isModuleToggled(name: string): boolean {
   //  return ModuleManager.findModule(P.byName(name)).enabled;
   //}
}
