Ext.define('BandOnTheRun.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',

    requires: [
    'BandOnTheRun.view.Login',
    'BandOnTheRun.view.Band'
    ],

    config: {
        layout: 'card',

        items: [
        {
            xtype: 'loginview'
        }, 
        {
            xtype: 'bandview'
        } 
        ]
    }
});
