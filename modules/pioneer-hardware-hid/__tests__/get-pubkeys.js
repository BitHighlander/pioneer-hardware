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


prompt.start();

let blockchains = [
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance'
]

let run_test = async function(){
    try{
        //get all usb devices
        let allDevices = await Hardware.allDevices()
        console.log("allDevices: ",allDevices.length)

        //get all keepkeys
        let allKeepkeys = await Hardware.listKeepKeys()
        console.log("allKeepkeys: ",allKeepkeys)

        let KEEPKEY = await Hardware.start()
        KEEPKEY.events.on('event', async function(event) {
            //console.log("EVENT: ",event)
        });

        let info = await Hardware.info()
        console.log("info: ",info)

        let state = await Hardware.state()
        console.log("state: ",state)

        if(state.state > 2){
            //get lock status
            let lockStatus = await Hardware.isLocked()
            console.log("lockStatus: ",lockStatus)
            if(lockStatus){
                Hardware.displayPin(blockchains)
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


            //get pubkeys
            let pubkeys = await Hardware.getPubkeys(blockchains)
            console.log("pubkeys: ",pubkeys)
            console.log("pubkeys: ",prettyjson.render(pubkeys))
        } else if(state.state < 0){
            console.log("Failed to claim!")
            console.log("Please unplug the device!")
            console.log("Please exif all tabs and client that may connect to keepkey!")
            console.log("Please reconnect the device!")
        }else{
            console.log(state)
            console.log("Please connect a device!")
        }

    }catch(e){
        console.error(e)
    }
}

run_test()
