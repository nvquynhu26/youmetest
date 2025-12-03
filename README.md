# Van Gogh Gram - Interactive Museum

An interactive web application showcasing Van Gogh's artworks with data visualization.

## Features

- **VanGoghmap**: Interactive network graph showing Van Gogh's travels across countries and cities
- **Colors Studio**: Browse and explore Van Gogh's artworks with detailed color analysis
- **Period Chart**: Visualize artworks by time period

## Setup for GitHub Pages

1. Push all files to your GitHub repository
2. Go to Settings > Pages
3. Select the branch and folder (usually `main` and `/` or `/van-gogh-museum`)
4. The site will be available at `https://[username].github.io/[repository-name]/`

## File Structure

```
van-gogh-museum/
├── index.html          # Main HTML file
├── script.js           # JavaScript logic
├── styles.css          # CSS styles
├── location.json       # Location data for VanGoghmap
├── period.json         # Period data for charts
├── van_gogh_artwork_kr.json  # Artwork data
├── images/            # Image files (SVG, JPG)
└── sunflower.mp3      # Background music
```

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- All dependencies are loaded from CDN (D3.js, Pretendard font)

## Notes

- The `.nojekyll` file ensures GitHub Pages doesn't process files with Jekyll
- All file paths are relative, so the site works on GitHub Pages
- Images should be in the `images/` folder
- JSON files should be in the root directory

