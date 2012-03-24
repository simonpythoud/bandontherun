Ext.define('BandOnTheRun.view.Band', {
    extend: 'Ext.navigation.View',
    xtype: 'bandview',

    requires: [
        'BandOnTheRun.view.Contacts',
        'BandOnTheRun.view.contact.Show',
        'BandOnTheRun.view.contact.Edit'
    ],

    config: {
        autoDestroy: false,

        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    id: 'editButton',
                    text: 'Edit',
                    align: 'right',
                    hidden: true,
                    hideAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeOut',
                        duration: 200
                    },
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    }
                },
                {
                    xtype: 'button',
                    id: 'saveButton',
                    text: 'Save',
                    align: 'right',
                    hidden: true,
                    hideAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeOut',
                        duration: 200
                    },
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    }
                }
            ]
        },

        items: [
            { xtype: 'contacts' }
        ]
    }
});
