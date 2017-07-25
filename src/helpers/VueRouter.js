/**
 * Setup relationship between VueRouter and StateHelper
 *
 * @param   {VueRouter}     router      The VueRouter instance
 * @param   {StateObject}   object      The StateObject instance
 */
export default function setup (router, object)
{
    function updateRoute()
    {
        router.push({name: object.fsm.state});
    }

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
