Ext.define('BandOnTheRun.controller.Application', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'mainview',
            band: 'bandview',
            editButton: '#editButton',
            bands: 'bands',
            listBand: 'band-list',
            showBand: 'band-show',
            editBand: 'band-edit',
            saveButton: '#saveButton'
        },

        control: {
            band: {
                push: 'onBandPush',
                pop: 'onBandPop'
            },
            editButton: {
                tap: 'onBandEdit'
            },
            listBand: {
                itemtap: 'onBandSelect'
            },
            saveButton: {
                tap: 'onBandSave'
            },
            editBand: {
                change: 'onBandChange'
            }
        }
    },
    
    showBandPanel: function(){
        this.getMain().setActiveItem(this.getBand());
    },

    onBandPush: function(view, item) {
        //var editButton = this.getEditButton();

        if (item.xtype == "band-show") {
            this.getListBand().deselectAll();

            //this.showEditButton();
        } else {
            //this.hideEditButton();
        }
    },

    onBandPop: function(view, item) {
        if (item.xtype == "band-edit") {
            //this.showEditButton();
        } else {
            //this.hideEditButton();
        }
    },

    onBandSelect: function(list, index, node, record) {

        if (!this.showBand) {
            this.showBand = Ext.create('BandOnTheRun.view.band.Show');
        }

        // Bind the record onto the show band view
        this.showBand.setRecord(record);

        // Push the show band view into the navigation view
        this.getBand().push(this.showBand);
    },

    onBandEdit: function() {
        if (!this.editBand) {
            this.editBand = Ext.create('BandOnTheRun.view.band.Edit');
        }

        // Bind the record onto the edit band view
        this.editBand.setRecord(this.getShowBand().getRecord());

        this.getBand().push(this.editBand);
    },

    onBandChange: function() {
        this.showSaveButton();
    },

    onBandSave: function() {
        var record = this.getEditBand().saveRecord();

        this.getShowBand().updateRecord(record);

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
