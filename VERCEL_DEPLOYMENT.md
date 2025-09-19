# Vercel Deployment Guide for Cipher Vote Parliament

This guide provides step-by-step instructions for deploying the Cipher Vote Parliament application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository access
- Environment variables configured

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository: `devsolidity88/cipher-vote-parliament`

### 3. Configure Build Settings

In the Vercel dashboard:

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (./)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4. Set Environment Variables

In the Vercel dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_KEY
```

### 5. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your app will be available at: `https://cipher-vote-parliament.vercel.app`

### 6. Custom Domain (Optional)

1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to be issued

## Environment Variables Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_CHAIN_ID` | Ethereum chain ID | `11155111` (Sepolia) |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint URL | `https://sepolia.infura.io/v3/YOUR_API_KEY` |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | `YOUR_PROJECT_ID` |
| `NEXT_PUBLIC_INFURA_API_KEY` | Infura API key | `YOUR_INFURA_KEY` |

## Build Configuration

### Vercel Configuration File

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Environment Variables Not Working**: Ensure variables start with `NEXT_PUBLIC_`
3. **Wallet Connection Issues**: Verify WalletConnect project ID is correct
4. **RPC Errors**: Check that RPC URL is accessible and has sufficient quota

### Build Logs

If deployment fails:
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check build logs for errors

### Local Testing

Test your build locally before deploying:

```bash
npm run build
npm run preview
```

## Post-Deployment

### 1. Verify Deployment

- Check that the app loads correctly
- Test wallet connection
- Verify all features work as expected

### 2. Monitor Performance

- Use Vercel Analytics (if enabled)
- Monitor build times
- Check for any runtime errors

### 3. Update Environment Variables

If you need to change environment variables:
1. Go to Vercel dashboard
2. Settings > Environment Variables
3. Update the values
4. Redeploy the project

## Advanced Configuration

### Custom Headers

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Redirects

Add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

## Support

For deployment issues:
- Check Vercel documentation
- Review build logs
- Contact support if needed

For application issues:
- Check GitHub issues
- Review README.md
- Contact development team
