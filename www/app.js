Ext.application({
    name: 'BandOnTheRun',

    requires: [
    'Ext.MessageBox'
    ],

    models: ['Band'],
    stores: ['Bands'],
    views: ['Main', 'Login', 'Band'],
    controllers: ['Application', 'Login'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        var config = {};
        
        // If we are on a phone, we just want to add the main panel into the viewport as is.
        // This will make it stretch to the size of the Viewport.
        
        // If we are not on a phone, we want to make the main panel modal and give it a fixed with and height.
        if (Ext.os.deviceType != 'Phone')  {
            
            config = {
                modal: true,
                height: 505,
                width: 480,
                centered: true,

                // Disable hideOnMaskTap so it cannot be hidden
                hideOnMaskTap: false
            }
        }

        // Initialize the main view
        Ext.Viewport.add(Ext.create('BandOnTheRun.view.Main', config));
        
        if(this.isLogged()){
            this.getController('Application').showBandPanel();
        } 
    },
    
    isLogged : function() {
        // if URL contains a parameter 'code', then we will create an authorized user from that code.  If not, then we
        // return doing nothing.
        var token = getUrlVars()['logged_in'];
        if(token && token == 'true') {
            return true;
        } else {
            return false;
        }
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
            );
    }
});

function getUrlVars() {
    var url = window.location.href;
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

