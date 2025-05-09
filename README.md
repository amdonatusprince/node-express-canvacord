# Verxio Dynamic Render

A dynamic Solana-powered API for generating loyalty passes, program cards, and leaderboard images with customizable branding and avatars. Built with Node.js, Express, and canvacord, this service enables real-time, visually rich rendering for NFT and loyalty program ecosystems. Easily integrate with your Solana project to provide beautiful, on-demand visuals for your users.

- **Dynamic image generation** for loyalty passes, programs, and leaderboards
- **Customizable branding**: background, header, and avatar images
- **Solana-native**: fetches on-chain data for real-time rendering
- **Easy integration**: simple REST API endpoints

## Getting started

Clone the repo:

```shell
git clone https://github.com/amdonatusprince/node-express-canvacord/
cd node-express-canvacord
```

Install dependencies:

```shell
pnpm install
```

Set up the keypair signer (one time per machine):

```shell
pnpm run setup
```

Start the api:

```shell
pnpm run dev
```

Build the api:

```shell
pnpm run build
```

The artifacts will be in the `dist` directory. You can now run the api using `npm run start` or `node dist/index.js`.

## Docker

Build the Docker image:

```shell
pnpm run docker:build
```

Run the Docker image:

```shell
pnpm run docker:run
```

## Environment variables

The following environment variables can be used to configure the API:

- `SOLANA_RPC_ENDPOINT`: The Solana RPC endpoint to use. Defaults to `devnet`.
- `SOLANA_SIGNER_PATH`: The path to the keypair signer file. Defaults to `./keypair-signer.json`.
- `CORS_ORIGINS`: A comma-separated list of allowed origins for CORS. Defaults to `*`.

---

## API Endpoints

### Get Loyalty Pass Data

```
GET /pass/:address
```
Returns loyalty pass data for the given address.

---

### Get Loyalty Pass Image

```
GET /pass/:address/image
```
Returns a PNG image of the loyalty pass for the given address.

---

### Get Loyalty Program Data

```
GET /program/:address
```
Returns loyalty program data for the given address.

---

### Get Loyalty Program Image

```
GET /program/:address/image
```
Returns a PNG image of the loyalty program for the given address.

---

### Get Leaderboard Data

```
GET /leaderboard/:address/
```
Returns leaderboard data for the given collection/program address.

---

### Get Leaderboard Image

```
GET /leaderboard/:address/image
```
Returns a PNG image of the leaderboard for the given address.

#### Query Parameters
- `backgroundImage` (optional): URL or local path to a background image.
- `headerImage` (optional): URL to the header image/logo.
- `defaultAvatar` (optional):
  - URL to a single avatar image (used for all members), **or**
  - URL to a JSON file containing an array of avatar image URLs (cycled through for members).

#### Example Usage

**Default leaderboard image:**
```shell
curl "http://localhost:3000/leaderboard/YourCollectionAddress/image" --output leaderboard.png
```

**With a custom background and header image:**
```shell
curl "http://localhost:3000/leaderboard/YourCollectionAddress/image?backgroundImage=https://example.com/bg.jpg&headerImage=https://example.com/logo.png" --output leaderboard.png
```

**With a single custom avatar:**
```shell
curl "http://localhost:3000/leaderboard/YourCollectionAddress/image?defaultAvatar=https://example.com/avatar.png" --output leaderboard.png
```

**With multiple avatars (JSON):**
1. Host a JSON file (e.g., `https://example.com/avatars.json`) with an array of avatar URLs.
2. Call:
   ```shell
   curl "http://localhost:3000/leaderboard/YourCollectionAddress/image?defaultAvatar=https://example.com/avatars.json" --output leaderboard.png
   ```

---

### Get Members of a Collection

```
GET /members/:address
```
Returns detailed member data for the given collection address.

---

## Library Reference (`src/lib`)

- `create-image-leaderboard.tsx`: Generates leaderboard images with customizable avatars, backgrounds, and header images.
- `get-leaderboard.ts`: Fetches and computes leaderboard data, including XP, level, and tier for each member.
- `create-image-loyalty-pass.tsx`: Generates loyalty pass images.
- `create-image-loyalty-program.tsx`: Generates loyalty program images.
- `get-members.ts`: Fetches detailed member data for a collection.
- ...and more utility files for Solana and API helpers.

---

## License

This project is licensed under the MIT License.
