Ext.define('BandOnTheRun.store.Bands', {
    extend: 'Ext.data.Store',

    config: {
        model: 'BandOnTheRun.model.Band',
        autoLoad: true,
        sorters: 'firstName',
        grouper: {
            groupFn: function(record) {
                return record.get('lastName')[0];
            }
        },
        proxy: {
            type: 'ajax',
            url: 'contacts.json'
        }
    }
});
