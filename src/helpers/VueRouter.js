/**
 * Setup relationship between VueRouter and StateHelper
 *
 * @param   {VueRouter}     router      The VueRouter instance
 * @param   {StateObject}   object      The StateObject instance
 * @param   {Object}        object      Setup parameters
 */
export default function setup (router, object, params)
{
    function updateRoute()
    {
        return router[params.method]({name: object.fsm.state})
    }

    params = params || {};
    params.method = typeof(router[params.method] === 'function') ? params.method : 'push';

    // set the current route as current state
    object.fsm.state = router.currentRoute.name;
    // manually update helper
    object.update();

    // update route when state updates
    object.fsm.on('change', updateRoute);

    // update state when route updates
    router.afterEach(function(route)
    {
        // directly set state so state machine event handlers are not triggered
        object.fsm.state = route.name;

        // manually update helper
        object.update();
    });

    // immediately update route
    updateRoute();
}
