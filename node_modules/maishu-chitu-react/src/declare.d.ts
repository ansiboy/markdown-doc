

interface Require {


	/**
	* CommonJS require call
	* @param module Module to load
	* @return The loaded module
	*/
	(module: string): any;

	/**
	* Start the main app logic.
	* Callback is optional.
	* Can alternatively use deps and callback.
	* @param modules Required modules to load.
	**/
	(modules: string[]): void;

	/**
	* @see Require()
	* @param ready Called when required modules are ready.
	**/
	(modules: string[], ready: Function): void;

	/**
	* @see http://requirejs.org/docs/api.html#errbacks
	* @param ready Called when required modules are ready.
	**/
	(modules: string[], ready: Function, errback: Function): void;

}


// Ambient declarations for 'require' and 'define'
declare var requirejs: Require;
