# Quick Vercel Deployment Steps

## 🚀 Deploy in 5 Minutes

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Navigate to Frontend
```bash
cd frontend
```

### 3. Login and Deploy
```bash
vercel login
vercel
```

### 4. Add Environment Variables
```bash
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 421614

vercel env add NEXT_PUBLIC_MOCK_TOKEN_ADDRESS production
# Enter: 0xE407D9fd30d2E15038f0fe90A7CB3B466Ca51138

vercel env add NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS production
# Enter: 0x032FE3F6D81a9Baca0576110090869Efe81a6AA7

vercel env add NEXT_PUBLIC_POLL_FACTORY_ADDRESS production
# Enter: 0xB4c9c8bFdD29Fb6c727A1fd11b769BCA1988cb4B

vercel env add NEXT_PUBLIC_RPC_URL production
# Enter: https://sepolia-rollup.arbitrum.io/rpc
```

### 5. Deploy to Production
```bash
vercel --prod
```

## ✅ Done!

Your app is now live! 🎉

For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
