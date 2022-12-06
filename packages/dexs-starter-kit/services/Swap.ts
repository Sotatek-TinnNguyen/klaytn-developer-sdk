import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '@klaytn/dex-contracts/typechain';
import { Signer, Wallet, providers, BigNumber, ContractTransaction, Contract } from 'ethers'

export default class Liquidity {
    public router: DexRouter;
    public factory: DexFactory;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    public async exactTokensForTokens(amountIn: number, amountDesiredOut: number, path: [string], deadline: number): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#exactTokensForTokens: path length must be at least 2');
        const inputToken: KIP7 = new KIP7__factory().attach(path[0]);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountIn))) throw new Error(`func#exactTokensForTokens: inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactTokensForTokens(amountIn, amountDesiredOut, path, signerAddress, deadline);
    }
    public async tokensForExactTokens(amountOut: number, amountDesiredMaxIn: number, path: [string], deadline: number): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#tokensForExactTokens: path length must be at least 2');
        const inputToken: KIP7 = new KIP7__factory().attach(path[0]);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountDesiredMaxIn))) throw new Error(`func#tokensForExactTokens: inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapTokensForExactTokens(amountOut, amountDesiredMaxIn, path, signerAddress, deadline);
    }
    public async exactKlayForTokens(amountKlayIn: number, amountDesiredOutMin: number, path: [string], deadline: number): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#exactKlayForTokens: path length must be at least 2');
        // const inputToken: KIP7 = new KIP7__factory().attach(path[0]); // WKLAY no approval required as router internally wrapping KLAY into WKLAY to proceed
        const signerAddress: string = await this.router.signer.getAddress();
        const klayBalance: BigNumber = await this.router.signer.getBalance()
        // check if input token's allowance sufficient
        if (klayBalance.lt(BigNumber.from(amountKlayIn))) throw new Error(`func#tokensForExactTokens: KLAY insufficient balance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactKLAYForTokens(amountDesiredOutMin, path, signerAddress, deadline, {value: amountKlayIn});
    }

    public async tokensForExactKlay(amountKlayOut: number, amountDesiredTokenMaxIn: number, path: [string], deadline: number): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#tokensForExactTokens: path length must be at least 2');
        const inputToken: KIP7 = new KIP7__factory().attach(path[0]);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountDesiredTokenMaxIn))) throw new Error(`func#tokensForExactTokens: inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapTokensForExactKLAY(amountKlayOut, amountDesiredTokenMaxIn, path, signerAddress, deadline);
    }
    public async exactTokensForKlay(amountIn: number, amountDesiredKlayOut: number, path: [string], deadline: number): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#exactTokensForTokens: path length must be at least 2');
        const inputToken: KIP7 = new KIP7__factory().attach(path[0]);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountIn))) throw new Error(`func#exactTokensForTokens: inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactTokensForTokens(amountIn, amountDesiredKlayOut, path, signerAddress, deadline);
    }
    public async exactKlayForExactTokens(amountKlayIn: number, amountDesiredOut: number, path: [string], deadline: number): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#exactKlayForTokens: path length must be at least 2');
        // const inputToken: KIP7 = new KIP7__factory().attach(path[0]); // WKLAY no approval required as router internally wrapping KLAY into WKLAY to proceed
        const signerAddress: string = await this.router.signer.getAddress();
        const klayBalance: BigNumber = await this.router.signer.getBalance()
        // check if input token's allowance sufficient
        if (klayBalance.lt(BigNumber.from(amountKlayIn))) throw new Error(`func#tokensForExactTokens: KLAY insufficient balance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactKLAYForTokens(amountDesiredOut, path, signerAddress, deadline, {value: amountKlayIn});
    }

    // Getters

    public getRouter(): DexRouter { return this.router}
    public async getPair(tokenA: string, tokenB: string, privKey: string, rpcURL: string):Promise<DexPair> {
        const pairAddress: string = await this.factory.getPair(tokenA, tokenB)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }
    public async getAddressOfWKLAY():Promise<string> {
        return this.router.WKLAY()
    }
}
