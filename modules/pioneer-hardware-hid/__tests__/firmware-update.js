require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let Hardware = require("../lib")


let run_test = async function() {
    try {

        let url = 'v7.2.1/firmware.keepkey.bin'

        //TODO detect firmware update mode

        let firmware = await Hardware.downloadFirmware(url)
        console.log("firmware: ",firmware)

        const updateResponse = await Hardware.loadFirmware(firmware)
        console.log("updateResponse: ",updateResponse)

    } catch (e) {
        console.error(e)
    }
}

run_test()