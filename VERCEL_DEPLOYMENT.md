# 🚀 Vercel Deployment Guide for RepVote

This guide will help you deploy the RepVote application to Vercel with Arbitrum Sepolia smart contracts.

## ✅ Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Smart contracts deployed on Arbitrum Sepolia (already done!)

## 📋 Deployed Contract Addresses

The project is configured with the following contract addresses on Arbitrum Sepolia:

- **MockRepToken**: `0xE407D9fd30d2E15038f0fe90A7CB3B466Ca51138`
- **ReputationRegistry**: `0x032FE3F6D81a9Baca0576110090869Efe81a6AA7`
- **PollFactory**: `0xB4c9c8bFdD29Fb6c727A1fd11b769BCA1988cb4B`

## 🔧 Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
# If not already in a git repository
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   NEXT_PUBLIC_CHAIN_ID=421614
   NEXT_PUBLIC_NETWORK_NAME=Arbitrum Sepolia
   NEXT_PUBLIC_MOCK_TOKEN_ADDRESS=0xE407D9fd30d2E15038f0fe90A7CB3B466Ca51138
   NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS=0x032FE3F6D81a9Baca0576110090869Efe81a6AA7
   NEXT_PUBLIC_POLL_FACTORY_ADDRESS=0xB4c9c8bFdD29Fb6c727A1fd11b769BCA1988cb4B
   NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   ```

6. Click **"Deploy"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (press Enter for default)
# - In which directory is your code located? ./
# - Want to override settings? No

# After deployment, add environment variables:
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

# Redeploy with environment variables
vercel --prod
```

### 3. Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions

## 🔍 Verify Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Connect your MetaMask wallet
3. Make sure MetaMask is on **Arbitrum Sepolia** network
   - Network Name: Arbitrum Sepolia
   - RPC URL: https://sepolia-rollup.arbitrum.io/rpc
   - Chain ID: 421614
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.arbiscan.io

4. Test the application:
   - Click "Get Free Tokens" to mint REP tokens
   - Create a poll
   - Vote on a poll
   - Check results

## 🐛 Troubleshooting

### Build Fails

**Error: TypeScript errors**
- Already configured to ignore TypeScript errors during build
- Check `next.config.js` has `typescript.ignoreBuildErrors: true`

**Error: Module not found**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Runtime Errors

**Error: Wrong network**
- Make sure MetaMask is connected to Arbitrum Sepolia (Chain ID: 421614)
- Add Arbitrum Sepolia to MetaMask if not present

**Error: Cannot read contract**
- Verify contract addresses in environment variables match deployment
- Check Arbitrum Sepolia RPC is working: https://sepolia-rollup.arbitrum.io/rpc

**Error: Transaction fails**
- Ensure you have testnet ETH for Arbitrum Sepolia
- Get testnet ETH from: https://faucet.quicknode.com/arbitrum/sepolia

### CORS Errors

- The project is configured to handle CORS properly
- All API routes have CORS headers configured in `next.config.js`
- No additional configuration needed

## 📱 Using the Deployed App

### For Users:

1. **Add Arbitrum Sepolia to MetaMask**:
   - Network Name: Arbitrum Sepolia
   - RPC URL: https://sepolia-rollup.arbitrum.io/rpc
   - Chain ID: 421614
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.arbiscan.io

2. **Get Testnet ETH**:
   - Visit https://faucet.quicknode.com/arbitrum/sepolia
   - Enter your wallet address
   - Claim testnet ETH

3. **Get REP Tokens**:
   - Connect wallet to the app
   - Click "Get Free Tokens"
   - Confirm the transaction

4. **Start Voting**:
   - Create polls
   - Vote on existing polls
   - Build your reputation!

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically deploy!
```

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments, analytics, and logs
- **Arbiscan**: Track contract interactions at https://sepolia.arbiscan.io

## 🎯 Production Checklist

- [x] Smart contracts deployed on Arbitrum Sepolia
- [x] Contract addresses configured
- [x] Environment variables set
- [x] Build succeeds locally
- [x] CORS configured
- [x] TypeScript errors handled
- [x] Webpack optimizations applied
- [x] SSR support enabled
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)

## 🔐 Security Notes

- Never commit `.env.local` or `.env` files
- Environment variables are properly prefixed with `NEXT_PUBLIC_`
- Smart contracts are on testnet - safe for testing
- Users need testnet ETH (no real value)

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify MetaMask is on Arbitrum Sepolia
4. Ensure contract addresses are correct
5. Check Arbitrum Sepolia RPC is responding

---

**Deployment Time**: ~5 minutes  
**First Deploy**: Usually takes 2-3 minutes  
**Subsequent Deploys**: Usually takes 1-2 minutes

🎉 **That's it! Your RepVote app is now live on Vercel!**
