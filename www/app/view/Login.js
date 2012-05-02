Ext.define('BandOnTheRun.view.Login', {
    extend: 'Ext.Panel',
    xtype: 'loginview',
           
    config: {
        cls: 'login-panel',
        items: [
        {
            xtype : 'button',
            action : 'login',
            text : 'Login with twitter'
        } 
        ]
    }
});