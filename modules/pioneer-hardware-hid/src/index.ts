/*
      Keepkey Hardware Module
 */

const TAG = " | pioneer-hardware | ";

const request = require('request-promise')
import {
    Keyring,
    Events
} from "@shapeshiftoss/hdwallet-core";
// const { NodeWebUSBKeepKeyAdapter } = require('@bithighlander/hdwallet-keepkey-nodewebusb')
// const { NodeWebUSBKeepKeyAdapter } = require('@shapeshiftoss/hdwallet-keepkey-nodewebusb')
// const { WebUSBKeepKeyAdapter } = require('@shapeshiftoss/hdwallet-keepkey-webusb')
// import { TCPKeepKeyAdapter } from "@shapeshiftoss/hdwallet-keepkey-tcp";
// import { create as createHIDKeepKey } from "@bithighlander/hdwallet-keepkey";

const { HIDKeepKeyAdapter } = require('@shapeshiftoss/hdwallet-keepkey-nodehid')
let hidAdapter

const log = require("@pioneer-platform/loggerdog")()
const EventEmitter = require('events');
const emitter = new EventEmitter();
let wait = require('wait-promise');
let sleep = wait.sleep;

// const usbDetect = require('@bithighlander/usb-detection');
// const usbDetect = require('usb-detection');

//usb
// var usb = require('usb')
// import * as util from "./hardware"

//keepkey
const keyring = new Keyring

//
const FIRMWARE_BASE_URL = "https://static.shapeshift.com/firmware/"

//releases
//https://static.shapeshift.com/firmware/releases.json

//globals
let KEEPKEY_WALLET:any = {}

//download firmware

//get latest



/*
    Keepkey States
    0 unknown

    1 No devices connected
    2 Already claimed
    3 locked
    4 unlocked
 */

let KEEPKEY_STATE = {
    state:0,
    msg:"unknown"
}

module.exports = {
    loadFirmware: async function (firmware:string) {
        try{
            let wallet = await createHidWallet()
            log.info("wallet: ",wallet)

            let resultWipe = await wallet.firmwareErase()
            log.info("resultWipe: ",resultWipe)

            const uploadResult = await wallet.firmwareUpload(firmware)
            return uploadResult
        }catch(e){
            console.error(e)
        }
    },
    downloadFirmware: async function (path:string) {
        try{

            let firmware = await request({
                url: FIRMWARE_BASE_URL + path,
                headers: {
                    accept: 'application/octet-stream',
                },
                encoding: null
            })


            return firmware

            // request({
            //     url: FIRMWARE_BASE_URL + path,
            //     headers: {
            //         accept: 'application/octet-stream',
            //     },
            //     encoding: null
            // }, (err:any, response:any, body:any) => {
            //     if(err) throw err
            //     if(response.statusCode !== 200) throw Error('Unable to fetch latest firmware')
            //     const firmwareIsValid = !!body
            //         && body.slice(0x0000, 0x0004).toString() === 'KPKY' // check for 'magic' bytes
            //         && body.slice(0x0004, 0x0008).readUInt32LE() === body.length - 256 // check firmware length - metadata
            //         && body.slice(0x000B, 0x000C).readUInt8() & 0x01 // check that flag is not set to wipe device
            //     if(!firmwareIsValid) throw Error('Fetched data is not valid firmware')
            //     console.log('body: ',body)
            //     return body
            // })
        }catch(e){
            console.error(e)
        }
    }
};


// @ts-ignore
let createHidWallet = async function (attempts:any = 0) {
    let tag = " | createHidWallet | ";
    try {


        // @ts-ignore
        hidAdapter = await HIDKeepKeyAdapter.useKeyring(keyring)
        let devices = await hidAdapter.delegate.getDevices()
        log.info(tag,"devices: ",devices)

        KEEPKEY_WALLET = await hidAdapter.pairDevice(devices[0].serialNumber)

        if (!KEEPKEY_WALLET) throw 'No wallet in the keyring'
        return KEEPKEY_WALLET

    } catch (error) {
        console.error(error)
        // if (attempts < 10) {
        //     await sleep(500)
        //     return await createHidWallet(attempts + 1)
        // }
        // console.log('error creating HID wallet: ', error)
        // return null
    }
};

// @ts-ignore
let uploadToDevice = async function (binary:any) {
    let tag = " | createHidWallet | ";
    try {
        const wallet = Object.values(keyring.wallets)[0]
        if (!wallet) return null
        // @ts-ignore
        await wallet.firmwareErase()
        // @ts-ignore
        const uploadResult = await wallet.firmwareUpload(binary)
        return uploadResult
    } catch (error) {
        log.error('error uploading to device: ', error)
        return false
    }
};
