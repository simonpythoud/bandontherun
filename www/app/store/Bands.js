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
            type: 'jsonp',
			url: 'http://stark-winter-4794.herokuapp.com/jams', 
            reader: {
                type: 'json',
                rootProperty: 'jams'
            }
        }
    }
});
