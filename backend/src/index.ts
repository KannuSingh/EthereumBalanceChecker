import express from 'express';
import cors from 'cors';
import { TOKENS } from './config/tokens';
import { 
  createPublicClient, 
  http, 
  formatUnits, 
  isAddress 
} from 'viem';
import { mainnet } from 'viem/chains';
import { erc20Abi } from 'viem';
import { ERRORS, STATUS_CODES } from './constants/errors';
import { BalanceResponse, TokenInfo } from './types';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Create Viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http()
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ethereum Balance Backend is running')
});

app.get('/api/balance', (req, res) => {
  (async () => {
    const address = (req.query.address as string || '').toLowerCase();
    if (!address || !isAddress(address)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERRORS.INVALID_ADDRESS });
    }
    
    const tokenInfo: Record<string, TokenInfo> = {};

    // Create a promise for ETH balance
    const ethPromise = client.getBalance({ address })
      .then(balance => {
        return { 
          symbol: 'ETH',
          balance: balance.toString(),
          decimals: TOKENS.ETH.decimals,
          formattedBalance: formatUnits(balance, TOKENS.ETH.decimals) 
        };
      });

    // Create promises for each ERC20 token
    const tokenPromises = ['USDC', 'LINK'].map(key => {
      const token = TOKENS[key as keyof typeof TOKENS];
      return client.readContract({
        address: token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address]
      })
      .then(balance => {
        return { 
          symbol: token.symbol, 
          balance: (balance as bigint).toString(),
          decimals: token.decimals,
          formattedBalance: formatUnits(balance as bigint, token.decimals) 
        };
      });
    });

    // Run all promises in parallel
    const results = await Promise.allSettled([ethPromise, ...tokenPromises]);
    
    // Process the results
    let found = false;
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { symbol, balance, formattedBalance, decimals } = result.value;
        
        // Store detailed info in tokenInfo
        tokenInfo[symbol] = {
          balance,
          decimals,
          formattedBalance
        };
        
        found = true;
      } else {
        const tokenSymbol = result.reason?.symbol || 'token';
        console.error(ERRORS.TOKEN_BALANCE_FETCH_ERROR(tokenSymbol), result.reason);
      }
    });

    if (!found) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERRORS.NO_BALANCES_FOUND });
    }

    const balanceResponse: BalanceResponse = {
      address,
      tokenInfo,
      timestamp: Date.now()
    };
    
    res.json(balanceResponse);
  })().catch((err) => {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
      error: ERRORS.INTERNAL_SERVER_ERROR, 
      details: err.message 
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
