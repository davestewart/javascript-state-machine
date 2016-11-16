import { toHash } from '../core/utils/utils';

function ObjectHelper (fsm)
{
    this.data = {};
    this.fsm = fsm;
    this.fsm
        .on('change', this.onChange.bind(this))
        .on('(pause resume cancel)', this.onPause.bind(this))
        .on('(state:add state:remove action:add action:remove)', this.onModify.bind(this));
    this.reset();
    this.update();
}

ObjectHelper.prototype =
{
    fsm : null,

    data : null,

    update:function()
    {
        this.onChange();
        this.onPause();
        this.onModify();
    },

    reset: function ()
    {
        this.data =
        {
            name     : '',
            index    : -1,
            paused   : false,
            is       : {},
            actions  : {},
            states   : {},
            all:{
                states  :[],
                actions :[]
            }
        }
    },

    onPause:function(event)
    {
        this.data.paused        = this.fsm.isPaused();
    },

    onModify:function(event)
    {
        this.data.all.states    = this.fsm.transitions.getStates();
        this.data.all.actions   = this.fsm.transitions.getActions();
    },

    onChange:function(event)
    {
        var fsm                 = this.fsm;
        this.data.name          = fsm.state;
        this.data.index         = this.fsm.transitions.states.indexOf(this.data.name);
        this.data.states        = toHash(fsm.transitions.getStatesFrom(fsm.state) || []);
        this.data.actions       = toHash(fsm.transitions.getActionsFrom(fsm.state) || []);
        this.data.is            = {};
        this.data.is[fsm.state] = true;
    }

};

export default function setup (fsm)
{
    return new ObjectHelper(fsm);
}
