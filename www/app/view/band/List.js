Ext.define('BandOnTheRun.view.band.List', {
    extend: 'Ext.List',
    xtype: 'band-list',

    config: {
        title: 'Jams',
        cls: 'x-bands',

        store: 'Bands',
        itemTpl: [
            '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
            '{firstName} {lastName}',
            '<span>{title}</span>'
        ].join('')
    }
});
