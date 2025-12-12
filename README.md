# Meta CAPI Cross-Domain Tracking

Vercel-hosted bridge for Meta Conversions API with cross-domain tracking support.

## Setup

### 1. Deploy to Vercel

```bash
npm install
vercel
```

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
META_ACCESS_TOKEN=your_capi_access_token
META_PIXEL_B_ID=1572408953943015
```

Get your access token from Meta Business Manager:
- Go to Events Manager
- Select your pixel
- Settings → Conversions API → Generate Access Token

### 3. Implement on Your Websites

#### Website A (Source)
Add to your page with the apply button:

```html
<script src="path/to/website-a-tracking.js"></script>
```

Update the button ID and target URL in the script.

#### Website B (Destination)
Add to your page with the finish button:

```html
<script src="path/to/website-b-tracking.js"></script>
```

Update:
- `CAPI_ENDPOINT` to your Vercel deployment URL
- Button ID in the script

### 4. Meta Pixel Setup

In Meta Events Manager:
1. Go to your pixel settings
2. Add both domains to allowed domains
3. Enable cross-domain tracking

## Testing

Use Meta's Test Events tool:
- Events Manager → Test Events
- Enter your Website B URL
- Click through the flow and verify events appear

## How It Works

1. **Website A**: User clicks apply button → passes `_fbp` and `_fbc` cookies via URL
2. **Website B**: User clicks finish → fires both:
   - Browser pixel event (immediate)
   - CAPI event (server-side, via Vercel)
3. **Deduplication**: Same `eventID` used for both to prevent double counting

## Troubleshooting

- Check Vercel logs for CAPI errors
- Use browser console to verify tracking params
- Verify cookies are being set by Meta Pixel
- Ensure CORS is working (check browser network tab)

## Local Development

```bash
npm install
vercel dev
```

Access at `http://localhost:3000/api/meta-capi`
