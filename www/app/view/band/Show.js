Ext.define('BandOnTheRun.view.band.Show', {
    extend: 'Ext.Container',
    xtype: 'band-show',

    config: {
        title: 'Information',
        baseCls: 'x-show-contact',
        layout: 'vbox',

        items: [
            {
                id: 'content',
                tpl: [
                    '<div class="top">',
                        '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
                        '<div class="name">{firstName} {lastName}<span>{title}</span></div>',
                    '</div>'
                ].join('')
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
