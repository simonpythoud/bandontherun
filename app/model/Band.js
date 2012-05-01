Ext.define('BandOnTheRun.model.Band', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
           'id',
           'title', 
           'artist', 
           'needed',
           'img'
        ]
    }
});
