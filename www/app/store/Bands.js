Ext.define('BandOnTheRun.store.Bands', {
    extend: 'Ext.data.Store',

    config: {
        model: 'BandOnTheRun.model.Band',
        autoLoad: true,
        sorters: 'artist',
        grouper: {
            groupFn: function(record) {
                return record.get('artist')[0];
            }
        },
        proxy: {
            type: 'ajax',
            url: 'bands.json',
//            url: 'http://172.25.97.123:8080/jams', 
            reader: {
                type: 'json',
                rootProperty: 'jams'
            }
        }
    }
});
