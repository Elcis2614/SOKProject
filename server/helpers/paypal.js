// server/helpers/paypal.js 

const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode : 'sandbox',
    client_id : 'AffzbClG3Y1jcg6k12Yi0FwABPsZPOgWE5IBt9UWTgqntd0WqbTtumQH1-weXdhltqwk1g7ucqPBzqiG' ,
    client_secret: 'EP3Rw9VNyHZmHBA9Uc5Yy4oos_zWbc0ynEupKQD-ANvzDG_b3gVsQPWfLbb6DROvAgqRybf_EEqIw16u'
});

module.exports = paypal
