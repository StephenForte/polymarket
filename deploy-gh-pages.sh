#!/bin/bash

echo "🚀 Deploying Polymarket Viewer to GitHub Pages"
echo "=============================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "📝 Updating existing gh-pages branch..."
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "📝 Creating new gh-pages branch..."
    git checkout --orphan gh-pages
fi

# Remove all files except the ones we want to deploy
echo "🧹 Cleaning up files..."
git rm -rf . || true

# Copy the files we want to deploy
echo "📁 Copying deployment files..."
cp index.html ./
cp script.js ./
cp styles.css ./
cp README.md ./

# Create a simple index for GitHub Pages
echo "📄 Creating GitHub Pages index..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Polymarket Viewer - Live Demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <style>
        .demo-notice {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        .demo-notice h4 {
            margin: 0;
            font-weight: 600;
        }
        .demo-notice p {
            margin: 0.5rem 0 0 0;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="demo-notice">
        <h4><i class="fas fa-rocket me-2"></i>Polymarket Viewer - Live Demo</h4>
        <p>This is a live demo using external CORS proxy. For production use, consider the local proxy server solution.</p>
    </div>
    
    <div class="container-fluid">
        <!-- Header -->
        <header class="bg-primary text-white py-4 mb-4">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h1 class="mb-0">
                            <i class="fas fa-chart-line me-3"></i>
                            Polymarket Viewer
                        </h1>
                        <p class="mb-0 mt-2 opacity-75">Explore the most active prediction markets</p>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="d-flex justify-content-end align-items-center">
                            <span class="badge bg-success me-3">
                                <i class="fas fa-globe me-1"></i>
                                Live Demo
                            </span>
                            <button id="refreshBtn" class="btn btn-light">
                                <i class="fas fa-redo me-2"></i>Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Stats Cards -->
        <div class="container mb-4">
            <div class="row">
                <div class="col-md-3 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chart-bar fa-2x text-primary mb-2"></i>
                            <h4 id="totalMarkets">0</h4>
                            <p class="text-muted mb-0">Total Markets</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-filter fa-2x text-info mb-2"></i>
                            <h4 id="filteredMarkets">0</h4>
                            <p class="text-muted mb-0">Filtered Markets</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-dollar-sign fa-2x text-success mb-2"></i>
                            <h4 id="totalVolume">$0</h4>
                            <p class="text-muted mb-0">Total Volume</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chart-pie fa-2x text-warning mb-2"></i>
                            <h4 id="avgVolume">$0</h4>
                            <p class="text-muted mb-0">Avg Volume</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="container mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title mb-3">
                        <i class="fas fa-filter me-2"></i>Filters
                    </h5>
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <label for="searchInput" class="form-label">Search</label>
                            <input type="text" class="form-control" id="searchInput" placeholder="Search markets...">
                        </div>
                        <div class="col-md-2 mb-3">
                            <label for="categoryFilter" class="form-label">Category</label>
                            <select class="form-select" id="categoryFilter">
                                <option value="">All Categories</option>
                            </select>
                        </div>
                        <div class="col-md-2 mb-3">
                            <label for="statusFilter" class="form-label">Status</label>
                            <select class="form-select" id="statusFilter">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div class="col-md-2 mb-3">
                            <label for="minVolumeFilter" class="form-label">Min Volume</label>
                            <input type="number" class="form-control" id="minVolumeFilter" placeholder="Min $">
                        </div>
                        <div class="col-md-2 mb-3">
                            <label for="maxVolumeFilter" class="form-label">Max Volume</label>
                            <input type="number" class="form-control" id="maxVolumeFilter" placeholder="Max $">
                        </div>
                        <div class="col-md-1 mb-3 d-flex align-items-end">
                            <button class="btn btn-outline-secondary" id="clearFilters">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Indicator -->
        <div id="loadingIndicator" class="text-center py-5" style="display: none;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading markets from Polymarket API...</p>
        </div>

        <!-- Markets Grid -->
        <div class="container">
            <div class="row" id="marketsGrid">
                <!-- Markets will be loaded here -->
            </div>
        </div>

        <!-- Pagination -->
        <div class="container mt-4">
            <div class="row">
                <div class="col-12">
                    <nav aria-label="Markets pagination">
                        <ul class="pagination justify-content-center">
                            <li class="page-item">
                                <button class="page-link" id="prevPage">
                                    <i class="fas fa-chevron-left"></i> Previous
                                </button>
                            </li>
                            <li class="page-item">
                                <span class="page-link" id="pageInfo">Page 1 of 1</span>
                            </li>
                            <li class="page-item">
                                <button class="page-link" id="nextPage">
                                    Next <i class="fas fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <!-- Market Details Modal -->
    <div class="modal fade" id="marketModal" tabindex="-1" aria-labelledby="marketModalTitle" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="marketModalTitle">Market Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="marketModalBody">
                    <!-- Market details will be loaded here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom Script -->
    <script src="script.js"></script>
</body>
</html>
EOF

# Add and commit the files
echo "💾 Committing deployment files..."
git add .
git commit -m "Deploy to GitHub Pages - Polymarket Viewer Demo"

# Push to GitHub
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages

# Switch back to main branch
git checkout main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your live demo should be available at:"
echo "   https://StephenForte.github.io/polymarket"
echo ""
echo "📝 Note: It may take a few minutes for GitHub Pages to update."
echo ""
echo "🔧 To enable GitHub Pages:"
echo "   1. Go to your repository settings"
echo "   2. Scroll down to 'Pages' section"
echo "   3. Select 'Deploy from a branch'"
echo "   4. Choose 'gh-pages' branch"
echo "   5. Click 'Save'"
