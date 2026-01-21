export default {
    get game () {
        if (this._game) {
            return this._game;
        } else {
            return this._game = Object.values(document.querySelector("#react"))[0].updateQueue.baseState.element.props.game;
        }
    }
}