Ext.define('BandOnTheRun.controller.Login', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            login: 'loginview',
            loginButton: 'button[action=login]', 
            logoutButton: 'button[action=logout]'
        },
        control : {
            loginButton : {
                tap : 'onSigninButton'
            },
            logoutButton : {
                tap : 'logout'
            }
        }
    },

    oAuthCred : {
        clientId : 'zWUPMkhZwYRcuQZOuJg',
        clientSecret : 'FkACuojoR6fB8hrVFZBkxOUmqSEaLVnOeh9VNvolKk',
        urlMe : 'https://auth.abc.com/me.json?access_token=',
        urlLogout : 'https://auth.abc.com/logout?access_token=',
        urlAuthorize : 'https://api.twitter.com/oauth/authorize'//'https://auth.abc.com/oauth/authorize?response_type=token'
        //iOSReturn : 'iris://authorize/callback'	// the iPad app has the 'iris' scheme defined to forward those urls to this app
    },

    TOKEN_KEY : 'bandontherun.access',

    ///////////////////////////
    // UI responders
    ///////////////////

    onSigninButton : function() {
        //this.doLogin();
        BandOnTheRun.app.startup();
    },
    hideLogin : function() {
        var panel = this.getLogin();
        panel && panel.hide();
    },
    /////////
    /**
	 * Authorize the user through logging in
	 */
    doLogin : function() {
        // we are going to check application context (depending on platform) for our access token
        // if not found, we direct the person to the oauth site
        // if found, we get the info about that person and place it into a new AuthenticatedUser object
        // which is handed off to the app.

        var returnUri = escape(window.location.href);
        window.location = this.oAuthCred.urlAuthorize + '&client_id=' + this.oAuthCred.clientId + '&redirect_uri=' + returnUri + '&client_secret=' + this.oAuthCred.clientSecret + '&scope=profile%2CSMS%2CMMS%2CACC';
    },
    /**
	 * Use the identity in the authorization flow to create a standard user record
	 */
    createUserFromIdentityRecord : function(userIdentity) {

        var user = Ext.create('ATT.lib.messaging.model.Contact');
        user.set('email', userIdentity.info.email);

        // derive phono presence and sencha-io names from email
        var name = userIdentity.info.email;
        var index = userIdentity.info.email.indexOf('@');
        if(index > 0) {
            name = userIdentity.info.email.substring(0, index);
        }

        var tmpDeviceType='webrtc';
        if (isIOS()){
            tmpDeviceType='iPad';
        }
        _kmq.push(['identify', name+'/'+tmpDeviceType]);
        var phono = name + "@voxeolabs.p1.im";
        var sencha = userIdentity.info.email;

        user.set('phono', phono);
        user.set('sencha-io-id', sencha);

        userIdentity.info.phone && user.set('phone', userIdentity.info.phone);

        // Temporary hack to test messaging

        user.set('phone', userIdentity.info.email);

        return user;
    },
    /**
	 * return the persisted access token
	 */
    getSavedAccessToken : function() {
        if(localStorage) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
    },
    saveAccessToken : function(token) {
        if(localStorage) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    },
    removeAccessToken : function() {
        if(localStorage) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    },
    /**
	 * Create authorized user based on the oAUTH code.  This will require us to request additional information from
	 * the authentication server.  Callback will include the fetched user.
	 */
    fetchAuthorizedUser : function(token, options) {
        var self = this;

        Ext.Ajax.request({
            url : this.oAuthCred.urlMe + token,

            dataType : 'jsonp',
            type : 'get',

            success : function(data) {
                console.log("jsonp success");

                try {

                    var userIdentity = data;
                    // will return failure if not logged in
                    // oddly, the return json includes a success element with a value of 'false' if the token is invalid
                    // but does not even have the 'success' element if successful
                    if(userIdentity.sucess && userIdentity.success === 'false') {
                        self.removeAccessToken();
                        options.failure && options.failure();
                    }
                    var user = self.createUserFromIdentityRecord(userIdentity);
                    user.set('access_token', token);

                    options.success && options.success(user);
                } catch (ex) {
                    console.log("some exception: " + ex);
                    self.removeAccessToken();
                    options.failure && options.failure();
                    throw ex;
                }
            },
            failure : function(response, opts) {
                self.removeAccessToken();
                console.log('server-side failure with status code ' + response.status);
                options.failure && options.failure();
            }
        });
    },
    /**
	 * Invokes success function with user if the app is currently logged in.  This will be true if two conditions are met.
	 *
	 * 1.  We have the access token in localstorage
	 * 2.  This access token is still valid
	 */
    getLoggedInUser : function(options) {

        var savedToken = this.getSavedAccessToken();
        if(savedToken) {
            this.fetchAuthorizedUser(savedToken, options);
        } else {
            options.failure && options.failure();
        }
    },
    logout : function() {
        this.removeAccessToken();

        if(!isIOS()) {

            var returnUri = escape(window.location.href);
            window.location = this.oAuthCred.urlLogout + '&client_id=' + this.oAuthCred.clientId + '&redirect_uri=' + returnUri + '&client_secret=' + this.oAuthCred.clientSecret + '&scope=profile%2CSMS%2CMMS%2CACC';

        } else {
            var returnUri = escape(this.oAuthCred.iOSReturn);
            window.location = this.oAuthCred.urlLogout + '&client_id=' + this.oAuthCred.clientId + '&redirect_uri=' + returnUri + '&client_secret=' + this.oAuthCred.clientSecret + '&scope=profile%2CSMS%2CMMS%2CACC';
        }

    },
    handleOAuthCallback : function(url, options) {
        console.log('------ got a url: ' + url);
        // if URL contains a parameter 'code', then we will create an authorized user from that code.  If not, then we
        // return doing nothing.
        var token = getUrlVars(url)['access_token'];
        if(token) {
            console.log("---has token");
            this.saveAccessToken(token);
            this.fetchAuthorizedUser(token, options);

        } else {
            console.log("--- no token");
            options.failure && options.failure();
        }
    }
});
