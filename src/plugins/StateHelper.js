import { toHash } from '../utils/utils';

export default function StateHelper (fsm)
{
    this.data = {};
    this.fsm = fsm;
    this.fsm.on('update', this.update.bind(this));
    this.update();
}

StateHelper.prototype =
{
    fsm : null,

    data :
    {
        name     : '',
        paused   : false,
        is       : {},
        actions  : {},
        states   : {}
    },

    update:function()
    {
        var fsm                 = this.fsm;
        this.data.name          = fsm.state;
        this.data.paused        = fsm.isPaused();
        this.data.states        = toHash(fsm.transitions.getToStates(fsm.state));
        this.data.actions       = toHash(fsm.transitions.getActionsFrom(fsm.state));
        this.data.is            = {};
        this.data.is[fsm.state] = true;
    }

};
