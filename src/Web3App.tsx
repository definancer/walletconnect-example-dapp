// import * as React from "react";
// import Web3 from "web3";
// import WalletConnectClient from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import {   IInternalEvent, IWalletConnectSession } from "@walletconnect/types";
//
// import Column from "./components/Column";
// import Modal from "./components/Modal";
// import Header from "./components/Header";
// import Loader from "./components/Loader";
// import Banner from "./components/Banner";
// import AccountAssets from "./components/AccountAssets";
// import {
//   IAppState,
//   INITIAL_STATE, SBalances,
//   SButtonContainer, SConnectButton,
//   SContent,
//   SKey, SLanding,
//   SLayout,
//   SModalContainer,
//   SModalParagraph,
//   SModalTitle,
//   SRow,
//   STable,
//   STestButton,
//   STestButtonContainer,
//   SValue,
//   SContainer,
//   bridge
// } from "./base";
// // import { apiGetAccountAssets } from "./helpers/api";
// import WalletConnect from "@walletconnect/client";
//
//
// // bridge url
// // const bridge = "https://bridge.walletconnect.org";
// // const bridge = "http://10.0.3.22:5001";
// // localStorage.setItem('testObject', JSON.stringify(testObject));
//
// let connectorProvider: WalletConnectProvider;
// let walletConnectClient: WalletConnect;
// let web3Provider: any;
//
// const POLLING_INTERVAL = 26000; // 12000
// // 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
// const RPC_URLS: { [chainId: number]: string } = {
//   1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
//   4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", //
// };
//
// const chainId = 4;
//
// // console.log("connector", connector.connected);
// // https://bridge.element.market
// // http://47.75.58.188:5001
// // http://10.0.5.58:5001
// const walletConnectProvider = (chainId: number, walletSession?: IWalletConnectSession): WalletConnectProvider => {
//   console.log('Web3 Wallet Connect Provider', Number(chainId))
//
//     walletConnectClient = walletSession
//     ? new WalletConnectClient({ session: walletSession })
//     : new WalletConnectClient({ bridge, qrcodeModal: QRCodeModal })
//
//
//   return new WalletConnectProvider({
//     pollingInterval: POLLING_INTERVAL,
//     rpc: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
//     chainId: Number(chainId),
//     connector: walletConnectClient
//   })
// }
//
//
// class Web3App extends React.Component<any, any> {
//   public state: IAppState = {
//     ...INITIAL_STATE,
//   };
//
//
//   // 链接按钮
//   public walletConnectInit = async () => {
//
//     const walletSession: string | null = localStorage.getItem("walletconnect");
//     if (walletSession) {
//       const session: IWalletConnectSession = JSON.parse(walletSession)
//       console.log('onWalletConnect by session')
//       connectorProvider = walletConnectProvider(chainId, session)
//     } else {
//       connectorProvider = walletConnectProvider(chainId)
//     }
//
//     await connectorProvider.enable();
//     // @ts-ignore
//     web3Provider = new  Web3(connectorProvider)
//     await this.setState({ connector:walletConnectClient });
//     await this.setState({ chainId: connectorProvider.chainId, accounts: connectorProvider.accounts, address: connectorProvider.accounts[0] });
//     await this.subscribeToEvents();
//   };
//
//   public subscribeToEvents = () => {
//     const connector = walletConnectClient;
//     if (!connector) {
//       return;
//     }
//
//     connector.on("message", async (error:any, payload:any) => {
//       console.log(`connector.on("message")`);
//     });
//
//     connector.on("session_update", async (error:any, payload:any) => {
//       console.log(`connector.on("session_update")`);
//
//       if (error) {
//         throw error;
//       }
//
//       const { chainId, accounts } = payload.params[0];
//       this.onSessionUpdate(accounts, chainId);
//     });
//
//     connector.on("connect", (error:any, payload:any) => {
//       console.log(`connector.on("connect")`);
//
//       if (error) {
//         throw error;
//       }
//
//       this.onConnect(payload);
//     });
//
//     connector.on("disconnect", (error:any, payload:any) => {
//       console.log(`connector.on("disconnect")`);
//
//       if (error) {
//         throw error;
//       }
//
//       this.onDisconnect();
//     });
//
//     if (connector.connected) {
//       const { chainId, accounts } = connector;
//       const address = accounts[0];
//       this.setState({
//         connected: true,
//         chainId,
//         accounts,
//         address,
//       });
//       this.onSessionUpdate(accounts, chainId);
//     }
//
//     this.setState({ connector });
//   };
//
//   public killSession = async () => {
//     const { connector } = this.state;
//     console.log("killSession for this state");
//     if (connector) {
//       connector.killSession();
//     }
//     this.resetApp();
//   };
//
//   public resetApp = async () => {
//     await this.setState({ ...INITIAL_STATE });
//   };
//
//   public onConnect = async (payload: IInternalEvent) => {
//     const { chainId, accounts } = payload.params[0];
//
//     const address = accounts[0];
//     await this.setState({
//       connected: true,
//       chainId,
//       accounts,
//       address,
//     });
//     this.getAccountAssets();
//   };
//
//   public onDisconnect = async () => {
//     this.resetApp();
//   };
//
//   public onSessionUpdate = async (accounts: string[], chainId: number) => {
//     const address = accounts[0];
//     await this.setState({ chainId, accounts, address });
//     await this.getAccountAssets();
//   };
//
//   public getAccountAssets = async () => {
//
//     console.log("getAccountAssets")
//     const { address } = this.state;
//     this.setState({ fetching: true });
//     try {
//       // get account balances
//       const balance = await web3Provider.eth.getBalance(address);
//       const assets = [
//         {
//           symbol: "ETH",
//           name: "ETH",
//           decimals: "18",
//           contractAddress: "00000",
//           balance
//         }]
//       await this.setState({ fetching: false, address, assets });
//     } catch (error) {
//       console.error(error);
//       await this.setState({ fetching: false });
//     }
//   };
//
//   public toggleModal = () => this.setState({ showModal: !this.state.showModal });
//
//   // ---------  签名按钮 --------------
//   public testSendTransaction = async () => {
//     console.log("testSendTransaction")
//   };
//
//   public testSignPersonalMessage = async () => {
//     console.log("testSignPersonalMessage")
//   };
//
//   public testSignTypedData = async () => {
//     console.log("testSignTypedData")
//   };
//
//   public render = () => {
//     const {
//       assets,
//       address,
//       connected,
//       chainId,
//       fetching,
//       showModal,
//       pendingRequest,
//       result,
//     } = this.state;
//     return (
//       <SLayout>
//         <Column maxWidth={1000} spanHeight>
//           <Header
//             connected={connected}
//             address={address}
//             chainId={chainId}
//             killSession={this.killSession}
//           />
//           <SContent>
//             {!address && !assets.length ? (
//               <SLanding center>
//                 <h3>
//                   {`Try out Web3 WalletConnect`}
//                   <br/>
//                   <span>{`v${process.env.REACT_APP_VERSION}`}</span>
//                 </h3>
//                 <SButtonContainer>
//                   <SConnectButton left onClick={this.walletConnectInit} fetching={fetching}>
//                     {"Connect to Web3 WalletConnect"}
//                   </SConnectButton>
//                 </SButtonContainer>
//               </SLanding>
//             ) : (
//               <SBalances>
//                 <Banner/>
//                 <h3>Actions</h3>
//                 <Column center>
//                   <STestButtonContainer>
//                     <STestButton left onClick={this.testSendTransaction}>
//                       {"eth_sendTransaction"}
//                     </STestButton>
//
//                     <STestButton left onClick={this.testSignPersonalMessage}>
//                       {"personal_sign"}
//                     </STestButton>
//
//                     <STestButton left onClick={this.testSignTypedData}>
//                       {"eth_signTypedData"}
//                     </STestButton>
//                   </STestButtonContainer>
//                 </Column>
//                 <h3>Balances</h3>
//                 {!fetching ? (
//                   <AccountAssets chainId={chainId} assets={assets}/>
//                 ) : (
//                   <Column center>
//                     <SContainer>
//                       <Loader/>
//                     </SContainer>
//                   </Column>
//                 )}
//               </SBalances>
//             )}
//           </SContent>
//         </Column>
//         <Modal show={showModal} toggleModal={this.toggleModal}>
//           {pendingRequest ? (
//             <SModalContainer>
//               <SModalTitle>{"Pending Call Request"}</SModalTitle>
//               <SContainer>
//                 <Loader/>
//                 <SModalParagraph>{"Approve or reject request using your wallet"}</SModalParagraph>
//               </SContainer>
//             </SModalContainer>
//           ) : result ? (
//             <SModalContainer>
//               <SModalTitle>{"Call Request Approved"}</SModalTitle>
//               <STable>
//                 {Object.keys(result).map(key => (
//                   <SRow key={key}>
//                     <SKey>{key}</SKey>
//                     <SValue>{result[key].toString()}</SValue>
//                   </SRow>
//                 ))}
//               </STable>
//             </SModalContainer>
//           ) : (
//             <SModalContainer>
//               <SModalTitle>{"Call Request Rejected"}</SModalTitle>
//             </SModalContainer>
//           )}
//         </Modal>
//       </SLayout>
//     );
//   };
// }
//
// export default Web3App;
