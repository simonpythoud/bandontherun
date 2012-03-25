Ext.define('BandOnTheRun.view.band.Show', {
    extend: 'Ext.Container',
    xtype: 'band-show',

    config: {
        title: 'Jam info',
        baseCls: 'x-show-band',
        layout: 'vbox',

        items: [
        {
            id: 'content',
            tpl: [
            '<div class="top">',
            '<div class="headshot" style="background-image:url({img});"></div>',
            '<div class="title">{title}</div>',
            '<div class="artist">We love to play: <span>{artist}</span></div>',
            '<div class="needed">We look for: <span>{needed}</span></div>',
            '<div class="playing">Currently playing: <span>Tigran (Guitar), Simon (Violon), Andrew (Piano)</span></div>',
            '</div>'
            ].join('')
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            cls: 'x-band-show-toolbar',
            items:[
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button', 
                action : 'call',
                text : 'Start the call',
                iconCls: 'call',
                iconMask: true
            }, 
            {
                xtype: 'spacer'
            }
            ]
        }
        ],

        record: null
    },

    updateRecord: function(newRecord) {
        if (newRecord) {
            this.down('#content').setData(newRecord.data);
        }
    }
});
