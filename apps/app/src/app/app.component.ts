import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import Web3 from "web3";
import Web3Modal from "web3modal";
import * as WalletConnectProvider from "@walletconnect/web3-provider";
@Component({
  selector: 'fantasia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';
  processing:any;
  address:any;
  isConnected:any;
  constructor(
    private _appService:AppService
  ){}
  ngOnInit(): void {
    this.title
  }
  // connectAccount()
  // {
  //   // this._appService.connectAccount();
  //   // console.log("Connect MetaMask");

  // }
  async connectAccount() {
    this.processing = true;
    try {
      if (typeof window.ethereum === "undefined") {
        alert('Metamask is not installed.');
        return;
      }
      await this.getAccount();
      if (window.ethereum.networkVersion !== 686) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(686) }]
          });
          this.isConnected = true;
        } catch (e) {
          await window
              .ethereum
              .request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: Web3.utils.toHex(686),
                  chainName: 'Fantasia Smart Chain Testnet',
                  nativeCurrency: {
                    name: 'Fantasia Smart Chain Testnet',
                    symbol: 'FST',
                    decimals: 18
                  },
                  rpcUrls: ['https://testnet.fantasiachain.com/'],
                  blockExplorerUrls: ['https://explorer.fantasiachain.com']
                }]
              });
        }
      }
    } catch (e) {
      console.log('connect error.', e);
    }

    this.processing = false;
  }
  async getAccount() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      this.address = accounts[0];
      return true;
    } catch (e:any) {
      console.log('getAddress error.', e);
      alert(e.message);
      return false;
    }
  }
}
