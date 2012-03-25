Ext.define('BandOnTheRun.view.band.List', {
    extend: 'Ext.List',
    xtype: 'band-list',

    config: {
        title: 'Jams',
        cls: 'x-bands',

        store: 'Bands',
        itemTpl: [
            '<div class="headshot" style="background-image:url({img});"></div>',
            '{title}',
            '<div class="more"><span>Artist we play: {artist}</span> | <span>We need: {needed}</span></div>'
        ].join('')
    }
});
