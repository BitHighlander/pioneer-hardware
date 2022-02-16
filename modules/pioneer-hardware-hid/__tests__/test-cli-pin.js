//start hardware

//events.on

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let Hardware = require("../lib")
const prompt = require('prompt');
const Table = require('cli-table');
let wait = require('wait-promise');
let sleep = wait.sleep;

//create wallet


prompt.start();

let run_test = async function(){
    try{

        let KEEPKEY = await Hardware.start()

        let info = await Hardware.info()
        console.log("info: ",info)

        // KEEPKEY.events.on('event', async function(event) {
        //     console.log("EVENT: ",event)
        //
        //     //if event = connect
        //     //attempt to start
        //     if(event.event === 'connect'){
        //         await sleep(3000)
        //
        //         //get info
        //         let info = await Hardware.info()
        //         console.log("info: ",info)
        //
        //     }
        //
        // });


        //get lock status
        //TODO why this always false?
        // let lockStatus = await Hardware.isLocked()
        // console.log("lockStatus: ",lockStatus)

        Hardware.displayPin()

        Hardware.getPubkeys()

        //Unlock
        let table = new Table({
            colWidths: [5, 5, 5]
        });
        table.push(["1", "2", "3"]);
        table.push(["4", "5", "6"]);
        table.push(["7", "8", "9"]);
        // table.push(["4", "5", "6"]);
        // table.push(["7", "8", "9"]);
        // table.push(["1", "2", "3"]);
        table = table.sort(function (a, b) {
            return b[2] - a[2];
        });
        console.log("\n \n PIN ENTRY \n \n " + table.toString() + "\n \n");


        prompt.get(['pin'], function (err, result) {
            if (err) { return onErr(err); }
            console.log('Command-line input received:');
            console.log('  pin: ' + result.pin);
            KEEPKEY.sendPin(result.pin)
        });

        function onErr(err) {
            console.log(err);
            return 1;
        }

        let pubkeys = await Hardware.getPubkeys()
        console.log("pubkeys: ",pubkeys)


        console.log("KEEPKEY: ",KEEPKEY)
        console.log("wallet: ",JSON.stringify(KEEPKEY.wallet))
        // console.log("pubkeys: ",JSON.stringify(wallet.pubkeys))
        console.log("wallet: ",KEEPKEY.wallet)
        console.log("pubkeys: ",KEEPKEY.pubkeys)

        KEEPKEY.events.on('event', async function(event) {
            //console.log("EVENT: ",event)
        });

        //TODO claim from already claimed



    }catch(e){
        console.error(e)
    }
}

run_test()
