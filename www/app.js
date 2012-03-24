//<debug>
Ext.Loader.setPath({
    'Ext': 'st2/src'
});
//</debug>

Ext.application({
    name: 'BandOnTheRun',

    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    glossOnIcon: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@114.png'
    },

    models: ['Contact'],
    stores: ['Contacts'],
    views: ['Main', 'Login', 'Band'],
    controllers: ['Application'],

    launch: function() {
        Ext.Viewport.add({
            xclass: 'BandOnTheRun.view.Main'
        });
    }
});
