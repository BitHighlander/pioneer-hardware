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


        console.log("loading seed: ",process.env['WALLET_MAIN'])
        await Hardware.wipe()


        Hardware.load(process.env['WALLET_MAIN'])


    }catch(e){
        console.error(e)
    }
}

run_test()
