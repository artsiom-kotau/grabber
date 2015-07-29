/*
OnlineOpinion v5.7.7
Released: 11/19/2013. Compiled 11/19/2013 03:08:33 PM -0600
Branch: master Nov
Components: Full
UMD: disabled
The following code is Copyright 1998-2013 Opinionlab, Inc.  All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab
*/
/*global OOo*/

/* variable name as an example is customVar.  your variable name would be substituted */

/* var customVar; */

/* Run the Invitation instance */
var oo_inviteMyJMH = new OOo.Invitation({
/* REQUIRED - Asset identification */
    pathToAssets: '/etc/jmh/static/js/onlineopinionV5/',
/* OPTIONAL - Configuration */
    responseRate: 100,
    repromptTime: 7776000,  //  90 days in seconds
    promptTrigger: /(https:\/\/www\.johnmuirhealth\.com\/myjmh-client\/dashboard)/i,
    area: /myjmh-client\/dashboard/i,  // specifies the section of the website the invitation stays popped under
    promptDelay: 3,  // seconds before prompt is shown
    popupType: 'popunder', // 'popup' to display card as popup
//  companyLogo: '/onlineopinionV5/logo.gif',  // logo is included. update path if different
    neverShowAgainButton: true,  // sets 5 year cookie when user clicks the button on prompt to never show again
    referrerRewrite: {
        searchPattern: /:\/\/[^\/]*/,
        replacePattern: '://invite.myjohnmuirhealth.com'
    }
/* pass the custom variable previously declared above */
/*
 ,  customVariables: {
        var1: (customVar !== undefined) ? customVar : ''
    } */
});
