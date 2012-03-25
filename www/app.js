//<debug>
Ext.Loader.setPath({
    'Ext': 'st2/src'
});
//</debug>

Ext.application({
    name: 'BandOnTheRun',

    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    glossOnIcon: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@114.png'
    },

    models: ['Contact'],
    stores: ['Contacts'],
    views: ['Main', 'Login', 'Band'],
    controllers: ['Application', 'Login'],

    launch: function() {
        Ext.Viewport.add({
            xclass: 'BandOnTheRun.view.Main'
        });
        
        // login process
        var login = this.getController('Login');

        var me = this;
		
        // first thing we do, is to check to see if the url contains the access code
        // and process it if it does.
        login.handleOAuthCallback(window.location.href, {
            success : function() {
                window.location=window.location.pathname;  // this will force reload the page, and it will remove the accessToken from the URL
            }, 
            failure : function() {
                // this url was not done on call back, so normal login flow
                login.getLoggedInUser({
                    success : me.startup,
                    failure : me.showLogin
                });
            }
        });
		
    }, 
    
    startup: function() {
        this.getController('Application').showBand();
    }
});

function getUrlVars(url) {
	url || (url = window.location.href);
	var vars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}

/*
console.log("---startup");
		this.getController('Login').hideLogin();
*/