# Genesys INSPIRE - The Game

AI-powered sales simulation platform for the FY27 INSPIRE event. Teams compete through 4 realistic sales scenarios, receive AI coaching, and compete for prizes.

## Quick Deploy to Vercel

### 1. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_REPO)

Or manually:

```bash
npm i -g vercel
vercel
```

### 2. Add Environment Variable

In Vercel Dashboard → Settings → Environment Variables:

```
ANTHROPIC_API_KEY = sk-ant-your-key-here
```

Get your API key at [console.anthropic.com](https://console.anthropic.com/)

### 3. Deploy

```bash
vercel --prod
```

That's it! Your app is live at `your-project.vercel.app`

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your API key
echo "ANTHROPIC_API_KEY=sk-ant-xxxxx" > .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## For the Event (1,400 participants)

### Scaling Considerations

- **No login required** - Teams just enter team name + table number
- **Serverless** - Auto-scales with Vercel's edge network
- **API rate limits** - Claude API handles ~1000 concurrent requests
- **Estimated cost** - ~$0.02 per submission (using Claude Sonnet)

### Pre-Event Checklist

1. [ ] Deploy to production URL
2. [ ] Test with 10+ concurrent submissions
3. [ ] Set up monitoring in Vercel dashboard
4. [ ] Prepare backup scoring (app works offline with cached scores)
5. [ ] Share URL with facilitators: `https://your-domain.vercel.app`

### Day-Of Setup

1. Display URL on screens: `inspire-game.vercel.app`
2. Teams navigate on their phones/laptops
3. No downloads, no accounts, no friction

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Vercel Edge    │────▶│   Claude API    │
│   (Next.js)     │     │  /api/score     │     │   (Sonnet)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Frontend**: React + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **AI**: Claude Sonnet for scoring & coaching
- **No database needed** - Scores stored client-side during session

---

## Customization

### Modify Scenarios

Edit the `simulationRounds` array in `app/page.js`

### Adjust Scoring

Edit the AI system prompt in `api/score.js`

### Change Branding

Update colors in the `colors` object at the top of `app/page.js`

---

## Support

Built by [Your Company] for Genesys FY27 INSPIRE
