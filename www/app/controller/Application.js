Ext.define('BandOnTheRun.controller.Application', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'mainview',
            band: 'bandview',
            login: 'loginview',
            editButton: '#editButton',
            contacts: 'contacts',
            showContact: 'contact-show',
            editContact: 'contact-edit',
            saveButton: '#saveButton', 
            loginButton: 'button[action=signin]'
        },

        control: {
            band: {
                push: 'onBandPush',
                pop: 'onBandPop'
            },
            editButton: {
                tap: 'onContactEdit'
            },
            contacts: {
                itemtap: 'onContactSelect'
            },
            saveButton: {
                tap: 'onContactSave'
            },
            editContact: {
                change: 'onContactChange'
            }
        }
    },

    onBandPush: function(view, item) {
        var editButton = this.getEditButton();

        if (item.xtype == "contact-show") {
            this.getContacts().deselectAll();

            this.showEditButton();
        } else {
            this.hideEditButton();
        }
    },

    onBandPop: function(view, item) {
        if (item.xtype == "contact-edit") {
            this.showEditButton();
        } else {
            this.hideEditButton();
        }
    },

    onContactSelect: function(list, index, node, record) {
        var editButton = this.getEditButton();

        if (!this.showContact) {
            this.showContact = Ext.create('BandOnTheRun.view.contact.Show');
        }

        // Bind the record onto the show contact view
        this.showContact.setRecord(record);

        // Push the show contact view into the navigation view
        this.getBand().push(this.showContact);
    },

    onContactEdit: function() {
        if (!this.editContact) {
            this.editContact = Ext.create('BandOnTheRun.view.contact.Edit');
        }

        // Bind the record onto the edit contact view
        this.editContact.setRecord(this.getShowContact().getRecord());

        this.getBand().push(this.editContact);
    },

    onContactChange: function() {
        this.showSaveButton();
    },

    onContactSave: function() {
        var record = this.getEditContact().saveRecord();

        this.getShowContact().updateRecord(record);

        this.getBand().pop();
    },

    showEditButton: function() {
        var editButton = this.getEditButton();

        if (!editButton.isHidden()) {
            return;
        }

        this.hideSaveButton();

        editButton.show();
    },

    hideEditButton: function() {
        var editButton = this.getEditButton();

        if (editButton.isHidden()) {
            return;
        }

        editButton.hide();
    },

    showSaveButton: function() {
        var saveButton = this.getSaveButton();

        if (!saveButton.isHidden()) {
            return;
        }

        saveButton.show();
    },

    hideSaveButton: function() {
        var saveButton = this.getSaveButton();

        if (saveButton.isHidden()) {
            return;
        }

        saveButton.hide();
    }
});
