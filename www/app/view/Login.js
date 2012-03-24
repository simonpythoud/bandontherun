Ext.define('BandOnTheRun.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'loginview',
           
    config: {
        scrollable: false,
        width: 480,
        centered: true,
        modal: true,
        cls: 'login-panel',
        items: [
        {
            xtype: 'fieldset',
            title: 'Twitter login info',
            instructions: 'Please enter the information above.',     
            defaults: {
                required: true,
                labelAlign: 'left',
                labelWidth: '40%'
            },
            items: [
            {
                xtype: 'textfield',
                name: 'name',
                label: 'Name',
                autoCapitalize: false
            },
            {
                xtype: 'passwordfield',
                name: 'password',
                label: 'Password'
            },
            {
                xtype: 'checkboxfield',
                name: 'remember',
                label: 'Remember me?',
                value: true
            },
            {
                xtype : 'button',
                action : 'signin',
                text : 'Sign In'
            }
            ]
        } 
        ]
    }
});