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
const prettyjson = require('prettyjson');
//create wallet
//pioneer


prompt.start();

let run_test = async function(){
    try{

        let KEEPKEY = await Hardware.start()
        KEEPKEY.events.on('event', async function(event) {
            //console.log("EVENT: ",event)
        });

        let info = await Hardware.info()
        console.log("info: ",info)

        //get lock status
        let lockStatus = await Hardware.isLocked()
        console.log("lockStatus: ",lockStatus)
        if(lockStatus){
            Hardware.displayPin()
            prompt.get(['pin'], async function (err, result) {
                if (err) { return onErr(err); }
                console.log('Command-line input received:');
                console.log('  pin: ' + result.pin);
                KEEPKEY.sendPin(result.pin)
            });
        }

        let table = new Table({
            colWidths: [5, 5, 5]
        });

        table.push(["1", "2", "3"]);
        table.push(["4", "5", "6"]);
        table.push(["7", "8", "9"]);

        table = table.sort(function (a, b) {
            return b[2] - a[2];
        });
        console.log("\n \n PIN ENTRY \n \n " + table.toString() + "\n \n");


        //blockchains
        let blockchains = [
            'bitcoin',
            'ethereum',
            'thorchain'
        ]
        let masterDevice = await KEEPKEY.ethGetAddress({
            "addressNList":[0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0,0,0],
            showDisplay: false,
        })

        //get pubkeys
        let pubkeys = await Hardware.getPubkeys(blockchains,true)
        // console.log("pubkeys: ",pubkeys)
        // console.log("pubkeys: ",prettyjson.render(pubkeys))

        //expect master to be right
        let masterEth = pubkeys.wallet.WALLET_PUBLIC.ETH.master
        console.log("masterDevice: ",masterDevice)
        console.log("masterEth: ",masterEth)
        console.log("reference: ","0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8")

        // Hardware.displayPin()
        //
        // Hardware.getPubkeys()
        //
        //
        // KEEPKEY.events.on('event', async function(event) {
        //     console.log("EVENT: ",event)
        // });
        //
        // //TODO claim from already claimed



    }catch(e){
        console.error(e)
    }
}

run_test()
