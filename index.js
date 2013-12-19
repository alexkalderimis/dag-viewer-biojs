(function (module) {

  module.DAGViewer = DAGViewer;

  function DAGViewer (options) {
    var element, w;
    if (!options) {
      throw new Error("No options provided");
    }
    if (typeof options.target === 'string') {
      element = document.getElementById(options.target);
    } else {
      element = options.target;
    }
    if (!element) {
      throw new Error(options.target + " not found");
    }
    this.widget = w = new DAGWidget(options);
    w.setElement(element);
    w.render();

    // Proxy all events.
    w.on('all', this.fireEvent.bind(this));
  }

  DAGViewer.prototype = {

     constructor: DAGViewer
    
    ,setGraph: function (graph) {
        this.widget.setGraph(graph);
     }

    /**
     * Add a event handler for the named event.
     *
     * @param {string} eventName
     *  The name of the event to handle.
     * @param {function} callback
     *  The handler to call when events of this name are received.
     */
    ,addListener: function (eventName, callback) {
      if (!(eventName && callback)) {
        throw new Error("Both eventName and callback are required arguments");
      }
      var cbs = this._cbs;
      var cbsForThisEvent = (cbs[eventName] || (cbs[eventName] = []));
      cbsForThisEvent.push(callback);
     }

    /**
     * Remove this component from the DOM and release all its resources.
     * 
     * This method should always be called if the component is to be disposed of,
     * or else event handler callbacks will likely result in memory leaks.
     */
    ,destroy: function () {
      this._cbs = {};
      this._globalListeners = [];
      this.widget.remove();
      this.widget = null;
      this.options = null;
     }

    /**
     * Fire an event with the given name and event data.
     *
     * @private
     * @param {string} eventName
     *  The name of the event to trigger.
     * @param {Object...} args
     *  The event arguments to send to handlers.
     */
    ,fireEvent: function (eventName) {
      if (!eventName) {
        throw new Error("Not enough arguments - at least one is required.");
      }
      var args = [].slice.call(arguments, 1)
        , cbs = this._cbs
        , cbsForThisEvent = (cbs[eventName] || (cbs[eventName] = [])).slice()
        , globalListeners = this._globalListeners.slice()
        , cb;

      while (cb = globalListeners.shift()) {
        cb.apply(null, arguments);
      }

      while (cb = cbsForThisEvent.shift()) {
        cb.apply(null, args);
      }
     }

  };

})(window.Biojs || (window.Biojs = {}));
