# Skylight Merged Rota

A modern web application that fetches and merges rota (schedule) data from multiple VCHP clinic systems, built with Node.js and deployed on Vercel.

## 🚀 Features

- **Real-time Data Fetching**: Automatically retrieves the latest rota data from two clinic systems
- **Modern UI**: Beautiful, responsive interface with real-time updates
- **Serverless Architecture**: Built for Vercel's serverless platform
- **Error Handling**: Robust error handling with detailed logging
- **Auto-refresh**: Automatically refreshes data every 5 minutes
- **Mobile Responsive**: Works perfectly on all device sizes

## 📋 API Endpoints

- `GET /` - API status and available endpoints
- `GET /api/merged-rota` - Returns merged rota data as JSON
- `GET /rota.html` - Interactive web interface for viewing merged rota

## 🛠️ Technology Stack

- **Backend**: Node.js with serverless functions
- **HTTP Client**: Axios for API requests
- **HTML Parsing**: Cheerio for server-side DOM manipulation
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Hosting**: Vercel
- **Version Control**: Git/GitHub

## 📦 Installation & Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd skylight-merged-rota
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Vercel CLI (if not already installed)**
   ```bash
   npm install -g vercel
   ```

4. **Run locally**
   ```bash
   npm run dev
   # or
   vercel dev
   ```

5. **Access the application**
   - API: http://localhost:3000/api
   - Merged Rota API: http://localhost:3000/api/merged-rota
   - Web Interface: http://localhost:3000/rota.html

## 🚀 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Convert Python Flask to Node.js"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to the main branch will trigger a new deployment
   - Pull requests will create preview deployments

### Method 2: Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
skylight-merged-rota/
├── api/
│   └── index.js          # Main serverless function
├── public/
│   └── rota.html         # Frontend web interface
├── package.json          # Node.js dependencies and scripts
├── vercel.json          # Vercel configuration
├── README.md            # This file
└── .gitignore           # Git ignore rules
```

## 🔧 Configuration

The application fetches data from these Salesforce URLs:
- Clinic 1: `https://vchp.my.salesforce-sites.com/rota?clinicId=7014J000000kfMy`
- Clinic 2: `https://vchp.my.salesforce-sites.com/rota?clinicId=7014J000000kfNS`

To modify these URLs, edit the `url1` and `url2` variables in `api/index.js`.

## 🎨 UI Features

- **Gradient Design**: Modern gradient backgrounds and buttons
- **Responsive Tables**: Mobile-friendly table display
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Statistics**: Shows total records and last update time
- **Auto-refresh**: Updates every 5 minutes automatically

## 🐛 Troubleshooting

### Common Issues

1. **No data appearing**
   - Check if the Salesforce URLs are accessible
   - Verify the HTML structure of the source pages hasn't changed
   - Check Vercel function logs for errors

2. **Deployment fails**
   - Ensure all dependencies are listed in `package.json`
   - Check that Node.js version is 18.x
   - Verify `vercel.json` configuration

3. **CORS errors**
   - The API includes CORS headers for cross-origin requests
   - If issues persist, check Vercel's CORS documentation

### Viewing Logs

- **Vercel Dashboard**: Go to your project → Functions → View function logs
- **Local Development**: Logs appear in your terminal

## 📝 Migration Notes

This application was converted from a Python Flask application to Node.js for Vercel compatibility:

- **Python → Node.js**: Flask routes became serverless functions
- **pandas → JavaScript**: Data processing now uses native JavaScript arrays and objects
- **BeautifulSoup → Cheerio**: HTML parsing with server-side jQuery-like syntax
- **requests → axios**: HTTP client for fetching data

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues related to:
- **VCHP Systems**: Contact your system administrator
- **Technical Issues**: Create an issue in this repository
- **Vercel Deployment**: Check [Vercel's documentation](https://vercel.com/docs)
