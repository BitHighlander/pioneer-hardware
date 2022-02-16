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
            // let pubkeys = await Hardware.getPubkeys(blockchains)
            // console.log("pubkeys: ",pubkeys)
            // console.log("pubkeys: ",prettyjson.render(pubkeys))

            //sign tx
            let ethTx = {
                "nonce":"0x0",
                "gasPrice":"0x5FB9ACA00",
                "gasLimit":"0x186A0",
                "value":"0x00",
                "to":"0x41e5560054824ea6b0732e656e3ad64e20e94e45",
                "chainId":3,
                "data":"0x1fece7b400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000031535741503a4254432e4254433a6d6b7152467a786d6b434758396a78677071714648637852556d4c4a634c444265723a31000000000000000000000000000000",
                "addressNList":[
                    2147483692,
                    2147483708,
                    2147483648,
                    0,
                    0
                ]
            }


            let rawTx = await KEEPKEY.ethSignTx(ethTx)
            console.log("rawTx: ",rawTx)
        } else if(state.state < 0){
            console.log("Failed to claim!")
            console.log("Please unplug the device!")
            console.log("Please exif all tabs and client that may connect to keepkey!")
            console.log("Please reconnect the device!")
        }else{
            console.log(state)
            console.log("Please connect a device!")
        }

        //example BARE MIN FIELDS STRIPPED DOWN
        // "txid":"b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea",
        //     tx: {
        //     "txid": "b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea",
        //         "version": 1,
        //         "vin": [
        //         {
        //             "txid": "a3b6284d252846ce8305d50edd7239831dc291716ec1752918d876d6ea05f681",
        //             "vout": 1,
        //             "scriptSig": {
        //                 "hex": "47304402207f3220930276204c83b1740bae1da18e5a3fa2acad34944ecdc3b361b419e3520220598381bdf8273126e11460a8c720afdbb679233123d2d4e94561f75e9b280ce30141045da61d81456b6d787d576dce817a2d61d7f8cb4623ee669cbe711b0bcff327a3797e3da53a2b4e3e210535076c087c8fb98aef60e42dfeea8388435fc99dca43"
        //             },
        //         }
        //     ],
        //         "vout": [
        //         {
        //             "value": "0.00978000",
        //             "scriptPubKey": {
        //                 "hex": "76a914f7b9e0239571434f0ccfdba6f772a6d23f2cfb1388ac",
        //             },
        //         },
        //         {
        //             "value": "0.00010000",
        //             "scriptPubKey": {
        //                 "hex": "76a9149c9d21f47382762df3ad81391ee0964b28dd951788ac",
        //             },
        //         }
        //     ],
        // }


        // let btcTx = {
        //     //"opReturnData":"=:THOR.RUNE:thor142vegztpy2yq8uzmdvjyx646agrmlpsl6x84hw:580535444",
        //     "coin":"Bitcoin",
        //     //"hex":"01000000000101b5f79ad72bac050d61de487c7e697a1b6696072195e9f26877319902a7e15f780100000000ffffffff02e803000000000000160014586d610cebab2b00070cc0b7c2ef30daae040d071bad09000000000016001487b367ee3dbbcd7997aa598c34330ea3f1f9b39702483045022100ce14789303877baa8d0b6ca3c910a12ce24e4305ee75bac6efb4c4c437a979a202204a6dd63542e8d76e55f8c37c0a72a7c13e908d372a27347452c3f0ec8f972c530121023400effc03c3add95bd56ae57949d72304a86e1835788a9436ba62cc34a2867000000000",
        //     "inputs":[
        //         {
        //             "addressNList":[
        //                 2147483732,
        //                 2147483648,
        //                 2147483648,
        //                 0,
        //                 0
        //             ],
        //             "scriptType":"p2pkh",
        //             "amount":"634139",
        //             "vout":1,
        //             "txid":"b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea",
        //             tx: {
        //                 "txid": "b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea",
        //                 "version": 1,
        //                 "vin": [
        //                     {
        //                         "txid": "a3b6284d252846ce8305d50edd7239831dc291716ec1752918d876d6ea05f681",
        //                         "vout": 1,
        //                         "n": 0,
        //                         "scriptSig": {
        //                             "hex": "47304402207f3220930276204c83b1740bae1da18e5a3fa2acad34944ecdc3b361b419e3520220598381bdf8273126e11460a8c720afdbb679233123d2d4e94561f75e9b280ce30141045da61d81456b6d787d576dce817a2d61d7f8cb4623ee669cbe711b0bcff327a3797e3da53a2b4e3e210535076c087c8fb98aef60e42dfeea8388435fc99dca43"
        //                         },
        //                         "sequence": 4294967295,
        //                         "addr": "1ParaEza5Ew5ioT5c8zR2wSSvArqiSQbpT",
        //                         "valueSat": 989000,
        //                         "value": 0.00989
        //                     }
        //                 ],
        //                 "vout": [
        //                     {
        //                         "value": "0.00978000",
        //                         "n": 0,
        //                         "scriptPubKey": {
        //                             "hex": "76a914f7b9e0239571434f0ccfdba6f772a6d23f2cfb1388ac",
        //                         },
        //                         "spentTxId": "171113f0745f570d18199efcb944b8f742fc590c700a41968081c5655338e4fc",
        //                         "spentIndex": 0,
        //                         "spentHeight": 355935
        //                     },
        //                     {
        //                         "value": "0.00010000",
        //                         "n": 1,
        //                         "scriptPubKey": {
        //                             "hex": "76a9149c9d21f47382762df3ad81391ee0964b28dd951788ac",
        //                         },
        //                     }
        //                 ],
        //             }
        //         }
        //     ],
        //     "outputs":[
        //         {
        //             "address":"bc1q6m9u2qsu8mh8y7v8rr2ywavtj8g5arzlyhcej7",
        //             "addressType":"spend",
        //             "scriptType":"p2wpkh",
        //             "amount":"2005",
        //             "isChange":false
        //         },
        //         {
        //             "address":"bc1qs7ek0m3ah0xhn9a2txxrgvcw50clnvuhymx87h",
        //             "addressType":"spend",
        //             "scriptType":"p2wpkh",
        //             "amount":"23",
        //             "isChange":false
        //         }
        //     ],
        //     "version":1,
        //     "locktime":0
        // }


        //example works
        // let input = {
        //     addressNList: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
        //     scriptType: 'p2pkh',
        //     amount: String(10000),
        //     vout: 1,
        //     txid: 'b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea',
        //     tx: {
        //         "txid": "b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea",
        //         "hash": "b3002cd9c033f4f3c2ee5a374673d7698b13c7f3525c1ae49a00d2e28e8678ea",
        //         "version": 1,
        //         "size": 257,
        //         "vsize": 257,
        //         "weight": 1028,
        //         "locktime": 0,
        //         "vin": [
        //             {
        //                 "txid": "a3b6284d252846ce8305d50edd7239831dc291716ec1752918d876d6ea05f681",
        //                 "vout": 1,
        //                 "n": 0,
        //                 "scriptSig": {
        //                     "asm": "304402207f3220930276204c83b1740bae1da18e5a3fa2acad34944ecdc3b361b419e3520220598381bdf8273126e11460a8c720afdbb679233123d2d4e94561f75e9b280ce3[ALL] 045da61d81456b6d787d576dce817a2d61d7f8cb4623ee669cbe711b0bcff327a3797e3da53a2b4e3e210535076c087c8fb98aef60e42dfeea8388435fc99dca43",
        //                     "hex": "47304402207f3220930276204c83b1740bae1da18e5a3fa2acad34944ecdc3b361b419e3520220598381bdf8273126e11460a8c720afdbb679233123d2d4e94561f75e9b280ce30141045da61d81456b6d787d576dce817a2d61d7f8cb4623ee669cbe711b0bcff327a3797e3da53a2b4e3e210535076c087c8fb98aef60e42dfeea8388435fc99dca43"
        //                 },
        //                 "sequence": 4294967295,
        //                 "addr": "1ParaEza5Ew5ioT5c8zR2wSSvArqiSQbpT",
        //                 "valueSat": 989000,
        //                 "value": 0.00989
        //             }
        //         ],
        //         "vout": [
        //             {
        //                 "value": "0.00978000",
        //                 "n": 0,
        //                 "scriptPubKey": {
        //                     "asm": "OP_DUP OP_HASH160 f7b9e0239571434f0ccfdba6f772a6d23f2cfb13 OP_EQUALVERIFY OP_CHECKSIG",
        //                     "hex": "76a914f7b9e0239571434f0ccfdba6f772a6d23f2cfb1388ac",
        //                     "reqSigs": 1,
        //                     "addresses": ["1ParaEza5Ew5ioT5c8zR2wSSvArqiSQbpT"],
        //                     "type": "pubkeyhash"
        //                 },
        //                 "spentTxId": "171113f0745f570d18199efcb944b8f742fc590c700a41968081c5655338e4fc",
        //                 "spentIndex": 0,
        //                 "spentHeight": 355935
        //             },
        //             {
        //                 "value": "0.00010000",
        //                 "n": 1,
        //                 "scriptPubKey": {
        //                     "asm": "OP_DUP OP_HASH160 9c9d21f47382762df3ad81391ee0964b28dd9517 OP_EQUALVERIFY OP_CHECKSIG",
        //                     "hex": "76a9149c9d21f47382762df3ad81391ee0964b28dd951788ac",
        //                     "reqSigs": 1,
        //                     "addresses": ["1FH6ehAd5ZFXCM1cLGzHxK1s4dGdq1JusM"],
        //                     "type": "pubkeyhash"
        //                 },
        //                 "spentTxId": "84da2a3cc29a3e0fb8a3a28882c6fb59a426a95952d484ec2422c5a47b6f93d4",
        //                 "spentIndex": 2,
        //                 "spentHeight": 370585
        //             }
        //         ],
        //         "blockhash": "000000000000000005c60c504e109684bb0886ab95520ad6a5af0d384f587a6a",
        //         "blockheight": 335414,
        //         "confirmations": 258975,
        //         "time": 1419279547,
        //         "blocktime": 1419279547,
        //         "valueOut": 0.00988,
        //         "valueIn": 0.00989,
        //         "fees": 0.00001
        //     },
        //     hex:"010000000181f605ead676d8182975c16e7191c21d833972dd0ed50583ce4628254d28b6a3010000008a47304402207f3220930276204c83b1740bae1da18e5a3fa2acad34944ecdc3b361b419e3520220598381bdf8273126e11460a8c720afdbb679233123d2d4e94561f75e9b280ce30141045da61d81456b6d787d576dce817a2d61d7f8cb4623ee669cbe711b0bcff327a3797e3da53a2b4e3e210535076c087c8fb98aef60e42dfeea8388435fc99dca43ffffffff0250ec0e00000000001976a914f7b9e0239571434f0ccfdba6f772a6d23f2cfb1388ac10270000000000001976a9149c9d21f47382762df3ad81391ee0964b28dd951788ac00000000",
        // }




        // //get lock status
        // let lockStatus = await Hardware.isLocked()
        // console.log("lockStatus: ",lockStatus)
        //
        //
        // //
        // let ethTx = {
        //     "nonce":"0x0",
        //     "gasPrice":"0x5FB9ACA00",
        //     "gasLimit":"0x186A0",
        //     "value":"0x00",
        //     "to":"0x41e5560054824ea6b0732            let bchTx = {
        //                 "coin":"BitcoinCash",
        //                 "inputs":[
        //                     {
        //                         "addressNList":[
        //                             2147483692,
        //                             2147483793,
        //                             2147483648,
        //                             1,
        //                             4
        //                         ],
        //                         "scriptType":"p2pkh",
        //                         "amount":"320778283",
        //                         "vout":1,
        //                         "txid":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
        //                         "segwit":false,
        //                         "hex":"0100000002a4fe4e5f5117bb8359007d164c2f4cf429dcc71b22d88476422f93f5b194847e000000006a473044022076b723e4ebea6e3f3825fff3832118620bf0499e5ed82c61bf6d04bd176e41fa02207c591b65562641afe418cb1eb0f6140778dea6b02a43f4be8154908a19195035412103e5b6c4e2b2239cc571aa671c1d23462543711a67d61e658a753f4e3fd35bd9fbffffffffcd83926b6e327a9c0fccd688bfb7f3e85f6dc41738a11f652213f516f27e6774000000006b48304502210080a3fe6be137657050bf94bb028709f08d3106da748f028d21523a2c3914cf52022036352b3730b58888d3e636c7d595120158643c6d027e6c1395bc4109c6e9c1604121023261f4cef888bf214c4ec7328b60e7c31ad3cace74d84a82c9f5a9374bccad65ffffffff0254250300000000001976a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac2bb01e13000000001976a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac00000000",
        //                         "tx":{
        //                             "txid":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
        //                             "hash":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
        //                             "version":1,
        //                             "vin":[
        //                                 {
        //                                     "txid":"7e8494b1f5932f427684d8221bc7dc29f44c2f4c167d005983bb17515f4efea4",
        //                                     "addr":"bitcoincash:qqmacwsa4eay0yklh6vkazee92r28ptpkvm682xr2m",
        //                                     "scriptSig":{
        //                                         "hex":"0014459a4d8600bfdaa52708eaae5be1dcf959069efc"
        //                                     },
        //                                     "valueSat":206112,
        //                                     "value":0.00206112
        //                                 },
        //                                 {
        //                                     "txid":"74677ef216f51322651fa13817c46d5fe8f3b7bf88d6cc0f9c7a326e6b9283cd",
        //                                     "addr":"bitcoincash:qr7uyrqt6auk9g3sm2sdfev6ccuv2a2rnupn5eh8c2",
        //                                     "scriptSig":{
        //                                         "hex":"0014459a4d8600bfdaa52708eaae5be1dcf959069efc"
        //                                     },
        //                                     "valueSat":320780249,
        //                                     "value":3.20780249
        //                                 }
        //                             ],
        //                             "vout":[
        //                                 {
        //                                     "value":"206164",
        //                                     "scriptPubKey":{
        //                                         "hex":"76a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac"
        //                                     }
        //                                 },
        //                                 {
        //                                     "value":"320778283",
        //                                     "scriptPubKey":{
        //                                         "hex":"76a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac"
        //                                     }
        //                                 }
        //                             ],
        //                             "hex":"0100000002a4fe4e5f5117bb8359007d164c2f4cf429dcc71b22d88476422f93f5b194847e000000006a473044022076b723e4ebea6e3f3825fff3832118620bf0499e5ed82c61bf6d04bd176e41fa02207c591b65562641afe418cb1eb0f6140778dea6b02a43f4be8154908a19195035412103e5b6c4e2b2239cc571aa671c1d23462543711a67d61e658a753f4e3fd35bd9fbffffffffcd83926b6e327a9c0fccd688bfb7f3e85f6dc41738a11f652213f516f27e6774000000006b48304502210080a3fe6be137657050bf94bb028709f08d3106da748f028d21523a2c3914cf52022036352b3730b58888d3e636c7d595120158643c6d027e6c1395bc4109c6e9c1604121023261f4cef888bf214c4ec7328b60e7c31ad3cace74d84a82c9f5a9374bccad65ffffffff0254250300000000001976a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac2bb01e13000000001976a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac00000000"
        //                         }
        //                     }
        //                 ],
        //                 "outputs":[
        //                     {
        //                         "address":"1MU8xvQJESoZRYuhmpTc6TY5eL7PG7ufLA",
        //                         "addressType":"spend",
        //                         "scriptType":"p2wpkh",
        //                         "amount":"200001",
        //                         "isChange":false
        //                     },
        //                     {
        //                         "address":"1D9Zuv9YPDuvuAztBs5AThNYaj9mZpW6K8",
        //                         "addressType":"spend",
        //                         "scriptType":"p2pkh",
        //                         "amount":"320757831",
        //                         "isChange":true
        //                     }
        //                 ],
        //                 "version":1,
        //                 "locktime":0
        //             }
        //
        //             let rawTx = await KEEPKEY.btcSignTx(bchTx)e656e3ad64e20e94e45",
        //     "chainId":3,
        //     "data":"0x1fece7b400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000031535741503a4254432e4254433a6d6b7152467a786d6b434758396a78677071714648637852556d4c4a634c444265723a31000000000000000000000000000000",
        //     "addressNList":[
        //         2147483692,
        //         2147483708,
        //         2147483648,
        //         0,
        //         0
        //     ]
        // }
        //
        //
        // let rawTx = await KEEPKEY.ethSignTx(ethTx)
        // console.log("rawTx: ",rawTx)

    }catch(e){
        console.error(e)
    }
}

run_test()
