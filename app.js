/**
 * Find VPD by Aphid#4690
 */
const {
    Toggle,
    Form
} = require('enquirer');

/** Setup our variables */
let tempUnit = `f`,
    relativeHumidity = 33,
    ambientTemp = 86,
    leafTemp = 83,
    TempC,
    LTempC;

/** VPD Functions */
/** Convert to C from F */
getCfromF = (T) => {
    return ((5 / 9) * (T - 32));
};

/**Get our Vapor Pressure Deficit */
getVPD = (ltC, rtC, valrh) => {

        // Leaf VPD
    let a=7.5*ltC,
        b=(237.3+ltC),
        c=a/b,
        svpp = (610.7*10**c)/1000,

        // Ambient VPD
        aa=7.5*rtC,
        bb=(237.3+rtC),
        cc=aa/bb,
        svpa = ((610.7*10**cc)*(.01*valrh))/1000,

        valvpd = svpp - svpa;

    /** Return VPD */
    return valvpd.toFixed(2);
};

/** Setup Get C or F */
const questionCorF = new Toggle({
    message: 'Celsius or Fahrenheit?',
    enabled: 'F',
    disabled: 'C'
});

/** Run C or F */
questionCorF.run()
    .then(async answer => {
        if (answer === false) {
            tempUnit = `c`;
        }
    })
    .then(() => {
        /** Setup Temperature Form Input */
        const VPDform = new Form({
            name: 'VPD',
            message: 'Please provide the following information:',
            choices: [{
                    name: 'ambientTemp',
                    message: 'Ambient Temperature',
                    initial: '85'
                },
                {
                    name: 'relativeHumidity',
                    message: 'Relative Humidity',
                    initial: '55'
                },
                {
                    name: 'leafTemp',
                    message: 'Leaf Temperature',
                    initial: '83'
                }
            ]
        });

        /** Run Temperature Form Input */
        VPDform.run()
            .then(formInput => {

                /** Move formInput data */
                ambientTemp = formInput.ambientTemp;
                relativeHumidity = formInput.relativeHumidity;
                leafTemp = formInput.leafTemp;
                
            })
            .then(() => {

                /** Change F to C */
                if (tempUnit == `f`) {
                    TempC = getCfromF(ambientTemp);
                    LTempC = getCfromF(leafTemp);
                } else {
                    TempC = ambientTemp;
                    LTempC = leafTemp;
                }
                
                /** Output answer to console */
                console.log(`
                    Actual VPD: ${getVPD(LTempC, TempC, relativeHumidity)}
                    `);

            })
            .catch(console.error);
    });
