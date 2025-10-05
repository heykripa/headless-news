## API Calls
- API call should only be used to fetch data from the WordPress API using application password method.
- API call should not be used to modify or delete any data.
- API calls uses `WP_API_URL` environment variable to make API calls.
- API calls uses `WP_USERNAME` environment variable to authenticate with WordPress API.
- API calls uses `WP_APP_PASSWORD` environment variable to authenticate with WordPress API.
- API path should be relative to `WP_API_URL` environment variable + the endpoints of the WordPress API.

## WordPress API Integration & CORS Solution
- **CORS Issue**: Direct client-side calls to external WordPress API fail due to missing `Access-Control-Allow-Origin` headers.
- **Solution**: Use Next.js API routes as proxy to avoid CORS issues.
- **Implementation**:
  - Created `src/app/api/posts/route.ts` as a server-side proxy route
  - Server-side route handles authentication with WordPress API using Basic Auth
  - Client-side code calls local API route (`/api/posts`) instead of external API
  - Proxy route adds proper CORS headers and forwards requests to WordPress API
- **Environment Variables**:
  - Server-side: `WP_API_URL`, `WP_USERNAME`, `WP_APP_PASSWORD`
  - Client-side: `NEXT_PUBLIC_SITE_URL` for local API base URL
- **Data Flow**: Client → Local API Route → WordPress API → Local API Route → Client
- **Benefits**: No CORS issues, secure credential handling, consistent error handling

## UI Components
- Use only shadcn components for UI.
- Use 'npm shadcn@latest add' command to add any shadcn components.
- Crosscheck the existing shadcn components before adding any new component.
- Do not use any other UI components.

## Defaults
- Project should use light theme by default.
- Remove the default dark theme from the project.
- Remove the default shadows and outline from shadcn components while using in the project. But keep the originals in original component files.

## Do Not
- Never run 'npm run dev' and 'npm run build' commands in the project. I handle them manually.

## Project Structure
- Project should follow the standard Next.js project structure.
- All the UI components should be in the `src/components/ui` directory.
- All the API calls should be in the `src/lib/api` directory.
- All the utility functions should be in the `src/lib/utils` directory.

## Project File Tree
```
.
├── README.md
├── biome.json
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   └── ui
│   └── lib
│       └── utils.ts
└── tsconfig.json

7 directories, 19 files
```