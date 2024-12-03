const { ethers } = require('ethers');
const routerABI = require('./routerAbi.json');
const pairABI = require('./pairAbi.json');
const erc20ABI = require('./erc20Abi.json');
const argv = require('yargs').argv;

const uniswapRouterAddress = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const pairAddress = '0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5'; // DAI-USDC
const tokenIn = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI
const amountIn = '800';

const provider = new ethers.providers.InfuraProvider('mainnet');
const UNISWAP_ROUTER_CONTRACT = new ethers.Contract(
  uniswapRouterAddress,
  routerABI,
  provider,
);
const UNISWAP_PAIR_CONTRACT = new ethers.Contract(
  pairAddress,
  pairABI,
  provider,
);

function getAmountIn(_amountOut, _token1Reserves, _token2Reserves) {
  return UNISWAP_ROUTER_CONTRACT.getAmountIn(
    _amountOut,
    _token1Reserves.toString(),
    _token2Reserves.toString(),
  );
}

function getAmountOut(_amountIn, _token1Reserves, _token2Reserves) {
  return UNISWAP_ROUTER_CONTRACT.getAmountOut(
    _amountIn,
    _token1Reserves.toString(),
    _token2Reserves.toString(),
  );
}

async function swap() {
  const [token0, token1] = await Promise.all([
    UNISWAP_PAIR_CONTRACT.token0(),
    UNISWAP_PAIR_CONTRACT.token1(),
  ]);

  const TOKEN_0_CONTRACT = new ethers.Contract(token0, erc20ABI, provider);
  const TOKEN_1_CONTRACT = new ethers.Contract(token1, erc20ABI, provider);

  const [reserves0Wei, reserves1Wei, token0Decimals, token1Decimals] =
    await Promise.all([
      TOKEN_0_CONTRACT.balanceOf(pairAddress),
      TOKEN_1_CONTRACT.balanceOf(pairAddress),
      TOKEN_0_CONTRACT.decimals(),
      TOKEN_1_CONTRACT.decimals(),
    ]);

  const reserve0 = parseFloat(reserves0Wei) / Math.pow(10, token0Decimals);
  const reserve1 = parseFloat(reserves1Wei) / Math.pow(10, token1Decimals);

  const tokenInDecimals =
    token0.toLowerCase() === tokenIn.toLowerCase()
      ? token0Decimals
      : token1Decimals;

  const amountOut = await getAmountOut(
    String(parseFloat(amountIn) * Math.pow(10, tokenInDecimals)),
    reserves0Wei,
    reserves1Wei,
  );

  console.log(amountOut);
}

swap();
