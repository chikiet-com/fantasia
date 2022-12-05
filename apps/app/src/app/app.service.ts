import { Injectable } from '@angular/core';
import Web3 from "web3";
import Web3Modal from "web3modal";
import * as WalletConnectProvider from "@walletconnect/web3-provider";
import { Subject } from 'rxjs';
import { uDonate_address, uDonate_abi } from '../app/abis'
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private web3js: any;
  private provider: any;
  private accounts: any;
  uDonate:any
  web3Modal
  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  constructor() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "INFURA_ID" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }

  async connectAccount() {
    console.log("abc");
    this.web3Modal.clearCachedProvider();
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    this.accountStatusSource.next(this.accounts)
  }

  async createOrganization(orgID: any, payableWallet: any, orgName: any, tokenAddress: any) {
    this.provider = await this.web3Modal.connect(); // set provider
      this.web3js = new Web3(this.provider); // create web3 instance
      this.accounts = await this.web3js.eth.getAccounts();
      this.uDonate = new this.web3js.eth.Contract(uDonate_abi, uDonate_address);
      const create = await this.uDonate
        .methods.createOrganization(orgID, payableWallet, orgName, tokenAddress)
        .send({ from: this.accounts[0] });
      return create;


    }
    async getOrganization(orgID:any) {
      this.provider = await this.web3Modal.connect(); // set provider
      this.web3js = new Web3(this.provider); // create web3 instance
      this.accounts = await this.web3js.eth.getAccounts();

      this.uDonate = new this.web3js.eth.Contract(uDonate_abi, uDonate_address);

      const org = await this.uDonate.methods.getOrganization(orgID).call({ from: this.accounts[0] });

      const organization = org;
      const walletAddress = organization[1];
      const balence = await this.web3js.eth.getBalance(walletAddress);

      const orgWithBalence = {
        id: organization[0],
        payableWallet: organization[1],
        paused: organization[2],
        ended: organization[3],
        causesIDs: organization[4],
        balence: balence,
      }

      return orgWithBalence;
    }
    async donate(id: any, amount: number, tip: any) {
      this.provider = await this.web3Modal.connect(); // set provider
      this.web3js = new Web3(this.provider); // create web3 instance
      this.accounts = await this.web3js.eth.getAccounts();
      this.uDonate = new this.web3js.eth.Contract(uDonate_abi, uDonate_address);
      const updatedAmt = amount * 1e18;
      const donate = await this.uDonate.methods.donateETH(id, tip).send({ from: this.accounts[0], value: updatedAmt })
      return donate;
    }
  // await window
  // .ethereum
  // .request({
  //   method: 'wallet_addEthereumChain',
  //   params: [{
  //     chainId: Web3.utils.toHex(868),
  //     chainName: 'Fantasia Smart Chain Mainnet',
  //     nativeCurrency: {
  //       name: 'Fantasia Smart Chain Mainnet',
  //       symbol: 'FST',
  //       decimals: 18
  //     },
  //     rpcUrls: ['https://mainnet-data1.fantasiachain.com/', 'https://mainnet-data2.fantasiachain.com/', 'https://mainnet-data3.fantasiachain.com/'],
  //     blockExplorerUrls: ['https://explorer.fantasiachain.com']
  //   }]
  // });

  // async connect() {
  //   this.processing = true;

  //   try {
  //     if (typeof window.ethereum === "undefined") {
  //       alert('Metamask is not installed.');
  //       return;
  //     }

  //     await this.getAccount();

  //     if (window.ethereum.networkVersion !== 686) {
  //       try {
  //         await window.ethereum.request({
  //           method: 'wallet_switchEthereumChain',
  //           params: [{ chainId: Web3.utils.toHex(686) }]
  //         });

  //         this.isConnected = true;
  //       } catch (e) {
  //         await window
  //             .ethereum
  //             .request({
  //               method: 'wallet_addEthereumChain',
  //               params: [{
  //                 chainId: Web3.utils.toHex(686),
  //                 chainName: 'Fantasia Smart Chain Testnet',
  //                 nativeCurrency: {
  //                   name: 'Fantasia Smart Chain Testnet',
  //                   symbol: 'FST',
  //                   decimals: 18
  //                 },
  //                 rpcUrls: ['https://testnet.fantasiachain.com/'],
  //                 blockExplorerUrls: ['https://explorer.fantasiachain.com']
  //               }]
  //             });
  //       }
  //     }
  //   } catch (e) {
  //     console.log('connect error.', e);
  //   }

  //   this.processing = false;
  // },
  // async getAccount() {
  //   try {
  //     const accounts = await window.ethereum.request({
  //       method: 'eth_requestAccounts'
  //     });
  //     this.address = accounts[0];
  //     return true;
  //   } catch (e) {
  //     console.log('getAddress error.', e);
  //     alert(e.message);
  //     return false;
  //   }
  // },
}
