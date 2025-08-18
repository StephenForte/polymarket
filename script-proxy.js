// Polymarket Viewer - Main JavaScript (Proxy Version)

class PolymarketViewer {
    constructor() {
        // Use local proxy server instead of external CORS proxy
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.markets = [];
        this.filteredMarkets = [];
        this.currentPage = 1;
        this.itemsPerPage = 20; // 4 columns × 5 rows
        this.filters = {
            search: '',
            category: ''
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadMarkets();
        this.updateStats();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.filterMarkets();
        });

        // Filter controls
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.filterMarkets();
        });

        // Clear filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.filterMarkets();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const maxPages = Math.ceil(this.allFilteredMarkets.length / this.itemsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.filterMarkets();
            }
        });
    }

    async loadMarkets() {
        this.showLoading(true);
        
        try {
            console.log('Fetching markets from:', `${this.apiBaseUrl}/markets?closed=false&limit=100`);
            
            // Use local proxy server
            const response = await fetch(`${this.apiBaseUrl}/markets?closed=false&limit=100`);
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Received data:', data);
            
            this.markets = data.results || data;
            console.log('Processed markets:', this.markets.length);
            
            // Sort by volume (descending) to show most active first
            this.markets.sort((a, b) => {
                const volumeA = parseFloat(a.volume || 0);
                const volumeB = parseFloat(b.volume || 0);
                return volumeB - volumeA;
            });

            // Load top 20 markets by volume on initial load
            this.filteredMarkets = this.markets.slice(0, 20);
            this.currentPage = 1;
            this.displayMarkets();
            this.populateCategoryFilter();
            this.updateStats();
            this.updatePagination();
            
        } catch (error) {
            console.error('Error loading markets:', error);
            console.error('Error details:', error.message);
            
            if (error.message.includes('HTTP error')) {
                this.showError(`API Error: ${error.message}. Loading sample data instead.`);
                this.loadSampleData();
            } else {
                this.showError(`Failed to load markets: ${error.message}. Loading sample data instead.`);
                this.loadSampleData();
            }
        } finally {
            this.showLoading(false);
        }
    }

    async refreshData() {
        await this.loadMarkets();
        this.updateStats();
    }

    populateCategoryFilter() {
        // Extract categories from multiple sources
        const categories = new Set();
        
        this.markets.forEach(market => {
            // Direct category field
            if (market.category) {
                categories.add(market.category);
            }
            
            // Try to extract from events array
            if (market.events && Array.isArray(market.events)) {
                market.events.forEach(event => {
                    if (event.category) {
                        categories.add(event.category);
                    }
                });
            }
            
            // Try to extract from question/title keywords
            const title = (market.title || market.question || '').toLowerCase();
            if (title.includes('fed') || title.includes('rate') || title.includes('recession')) {
                categories.add('Economics');
            } else if (title.includes('bitcoin') || title.includes('crypto') || title.includes('tether') || title.includes('usdt')) {
                categories.add('Cryptocurrency');
            } else if (title.includes('nuclear') || title.includes('weapon') || title.includes('iran') || title.includes('nato')) {
                categories.add('Politics');
            } else if (title.includes('weed') || title.includes('marijuana')) {
                categories.add('Policy');
            } else if (title.includes('taylor swift') || title.includes('swift')) {
                categories.add('Taylor Swift');
            }
        });
        
        const categoryFilter = document.getElementById('categoryFilter');
        
        // Clear existing options except the first one
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        Array.from(categories).sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    filterMarkets() {
        let filtered = this.markets.filter(market => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const title = (market.title || market.question || '').toLowerCase();
                const description = (market.description || '').toLowerCase();
                if (!title.includes(searchTerm) && !description.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.filters.category) {
                let marketCategory = market.category;
                
                // If no direct category, try to determine from title/keywords
                if (!marketCategory) {
                    const title = (market.title || market.question || '').toLowerCase();
                    if (title.includes('fed') || title.includes('rate') || title.includes('recession')) {
                        marketCategory = 'Economics';
                    } else if (title.includes('bitcoin') || title.includes('crypto') || title.includes('tether') || title.includes('usdt')) {
                        marketCategory = 'Cryptocurrency';
                    } else if (title.includes('nuclear') || title.includes('weapon') || title.includes('iran') || title.includes('nato')) {
                        marketCategory = 'Politics';
                    } else if (title.includes('weed') || title.includes('marijuana')) {
                        marketCategory = 'Policy';
                    } else if (title.includes('taylor swift') || title.includes('swift')) {
                        marketCategory = 'Taylor Swift';
                    }
                }
                
                if (marketCategory !== this.filters.category) {
                    return false;
                }
            }

            return true;
        });

        // Sort by volume (highest to lowest)
        filtered.sort((a, b) => {
            const volumeA = parseFloat(a.volume || 0);
            const volumeB = parseFloat(b.volume || 0);
            return volumeB - volumeA;
        });

        // Store all filtered results for pagination
        this.allFilteredMarkets = filtered;
        
        // Get current page of results
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.filteredMarkets = filtered.slice(startIndex, startIndex + this.itemsPerPage);

        this.displayMarkets();
        this.updateStats();
        this.updatePagination();
    }

    clearFilters() {
        this.filters = {
            search: '',
            category: ''
        };

        // Reset form inputs
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';

        // Reset to top 20 markets by volume
        this.allFilteredMarkets = this.markets;
        this.filteredMarkets = this.markets.slice(0, 20);
        this.currentPage = 1;
        this.displayMarkets();
        this.updateStats();
        this.updatePagination();
    }

    displayMarkets() {
        const container = document.getElementById('marketsGrid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageMarkets = this.filteredMarkets.slice(startIndex, endIndex);

        container.innerHTML = '';

        if (pageMarkets.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No markets found</h4>
                    <p class="text-muted">Try adjusting your search criteria or filters.</p>
                </div>
            `;
            return;
        }

        pageMarkets.forEach(market => {
            const card = this.createMarketCard(market);
            container.appendChild(card);
        });

        this.updatePagination();
    }

    createMarketCard(market) {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
        
        const volume = parseFloat(market.volume || 0);
        const volumeClass = volume > 1000000 ? 'volume-high' : volume > 100000 ? 'volume-medium' : 'volume-low';
        const statusClass = market.closed ? 'status-closed' : 'status-active';
        const statusText = market.closed ? 'Closed' : 'Active';

        // Handle different title fields from API
        let title = market.title || market.question || 'Untitled Market';
        if (this.filters.search) {
            const regex = new RegExp(`(${this.filters.search})`, 'gi');
            title = title.replace(regex, '<span class="highlight">$1</span>');
        }

        // Handle different outcome formats
        let outcomes = [];
        let outcomePrices = [];
        
        if (market.outcomes) {
            if (typeof market.outcomes === 'string') {
                try {
                    outcomes = JSON.parse(market.outcomes);
                } catch (e) {
                    outcomes = [market.outcomes];
                }
            } else if (Array.isArray(market.outcomes)) {
                outcomes = market.outcomes;
            }
        }
        
        if (market.outcomePrices) {
            if (typeof market.outcomePrices === 'string') {
                try {
                    outcomePrices = JSON.parse(market.outcomePrices);
                } catch (e) {
                    outcomePrices = [];
                }
            } else if (Array.isArray(market.outcomePrices)) {
                outcomePrices = market.outcomePrices;
            }
        }

        col.innerHTML = `
            <div class="card market-card h-100" onclick="polymarketViewer.showMarketDetails('${market.id}')">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="status-indicator ${statusClass}"></span>
                        <small class="text-muted">${statusText}</small>
                    </div>
                    
                    <h6 class="card-title">${title}</h6>
                    
                    <p class="card-text text-muted">
                        ${market.description ? market.description.substring(0, 100) + '...' : 'No description available'}
                    </p>
                    
                    ${market.category ? `<span class="badge bg-secondary category-badge mb-2">${market.category}</span>` : ''}
                    
                    ${outcomes.length > 0 ? `
                        <div class="outcomes-preview mb-3">
                            <small class="text-muted d-block mb-1">Outcomes & Odds:</small>
                            ${outcomes.map((outcome, index) => {
                                const price = outcomePrices[index] || 'N/A';
                                const priceDisplay = price !== 'N/A' ? `$${parseFloat(price).toFixed(2)}` : 'N/A';
                                return `
                                    <div class="outcome-item-small d-flex justify-content-between align-items-center mb-1">
                                        <span class="outcome-name-small">${outcome}</span>
                                        <span class="outcome-price-small fw-bold">${priceDisplay}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="market-stats">
                        <div class="stat-item">
                            <div class="stat-value ${volumeClass}">$${this.formatNumber(volume)}</div>
                            <div class="stat-label">Volume</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${outcomes.length}</div>
                            <div class="stat-label">Outcomes</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    async showMarketDetails(marketId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/markets/${marketId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const market = await response.json();
            this.displayMarketModal(market);
            
        } catch (error) {
            console.error('Error loading market details:', error);
            this.showError('Failed to load market details.');
        }
    }

    displayMarketModal(market) {
        const modal = document.getElementById('marketModal');
        const modalTitle = document.getElementById('marketModalTitle');
        const modalBody = document.getElementById('marketModalBody');

        modalTitle.textContent = market.title || 'Market Details';

        const volume = parseFloat(market.volume || 0);
        const statusClass = market.closed ? 'status-closed' : 'status-active';
        const statusText = market.closed ? 'Closed' : 'Active';

        modalBody.innerHTML = `
            <div class="market-detail-section">
                <h6><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                <p><strong>Description:</strong> ${market.description || 'No description available'}</p>
                <p><strong>Category:</strong> ${market.category || 'Uncategorized'}</p>
                <p><strong>Status:</strong> <span class="status-indicator ${statusClass}"></span>${statusText}</p>
                <p><strong>Created:</strong> ${new Date(market.created_time).toLocaleDateString()}</p>
                ${market.close_time ? `<p><strong>Closes:</strong> ${new Date(market.close_time).toLocaleDateString()}</p>` : ''}
            </div>

            <div class="market-detail-section">
                <h6><i class="fas fa-chart-line me-2"></i>Market Statistics</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Total Volume:</strong> $${this.formatNumber(volume)}</p>
                        <p><strong>Number of Outcomes:</strong> ${market.outcomes ? market.outcomes.length : 0}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Market ID:</strong> <code>${market.id}</code></p>
                        <p><strong>Slug:</strong> <code>${market.slug || 'N/A'}</code></p>
                    </div>
                </div>
            </div>

            ${market.outcomes && market.outcomes.length > 0 ? `
                <div class="market-detail-section">
                    <h6><i class="fas fa-list me-2"></i>Outcomes</h6>
                    ${market.outcomes.map(outcome => `
                        <div class="outcome-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="outcome-name">${outcome.name}</span>
                                <span class="outcome-price">$${parseFloat(outcome.price || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }

    updateStats() {
        const totalMarkets = this.markets.length;
        const filteredCount = this.filteredMarkets.length;
        const totalVolume = this.filteredMarkets.reduce((sum, market) => sum + parseFloat(market.volume || 0), 0);
        const avgVolume = filteredCount > 0 ? totalVolume / filteredCount : 0;

        document.getElementById('totalMarkets').textContent = totalMarkets.toLocaleString();
        document.getElementById('filteredMarkets').textContent = filteredCount.toLocaleString();
        document.getElementById('totalVolume').textContent = `$${this.formatNumber(totalVolume)}`;
        document.getElementById('avgVolume').textContent = `$${this.formatNumber(avgVolume)}`;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.allFilteredMarkets.length / this.itemsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toFixed(0);
        }
    }

    showLoading(show) {
        const loadingElement = document.getElementById('loadingIndicator');
        const marketsGrid = document.getElementById('marketsGrid');
        
        if (show) {
            loadingElement.style.display = 'block';
            marketsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Loading markets...</p>
                </div>
            `;
        } else {
            loadingElement.style.display = 'none';
        }
    }

    loadSampleData() {
        console.log('Loading sample data...');
        this.markets = [
            {
                id: "sample-1",
                question: "Will Bitcoin reach $100,000 in 2025?",
                description: "This market will resolve to 'Yes' if Bitcoin reaches $100,000 or higher at any point in 2025.",
                volume: "2500000",
                closed: false,
                category: "Cryptocurrency",
                outcomes: ["Yes", "No"],
                created_time: "2024-12-01T00:00:00Z"
            },
            {
                id: "sample-2", 
                question: "Will the US have a recession in 2025?",
                description: "This market will resolve to 'Yes' if the NBER declares a recession in 2025.",
                volume: "1500000",
                closed: false,
                category: "Economics",
                outcomes: ["Yes", "No"],
                created_time: "2024-11-15T00:00:00Z"
            },
            {
                id: "sample-3",
                question: "Will Tesla deliver 2M vehicles in 2025?",
                description: "This market will resolve to 'Yes' if Tesla delivers 2 million or more vehicles in 2025.",
                volume: "800000",
                closed: false,
                category: "Business",
                outcomes: ["Yes", "No"],
                created_time: "2024-12-10T00:00:00Z"
            },
            {
                id: "sample-4",
                question: "Will Apple release a foldable iPhone in 2025?",
                description: "This market will resolve to 'Yes' if Apple officially announces and releases a foldable iPhone in 2025.",
                volume: "600000",
                closed: false,
                category: "Technology",
                outcomes: ["Yes", "No"],
                created_time: "2024-11-20T00:00:00Z"
            },
            {
                id: "sample-5",
                question: "Will SpaceX successfully land on Mars in 2025?",
                description: "This market will resolve to 'Yes' if SpaceX successfully lands a spacecraft on Mars in 2025.",
                volume: "400000",
                closed: false,
                category: "Space",
                outcomes: ["Yes", "No"],
                created_time: "2024-10-01T00:00:00Z"
            }
        ];
        
        this.filteredMarkets = [...this.markets];
        this.currentPage = 1;
        this.displayMarkets();
        this.populateCategoryFilter();
        this.updateStats();
        
        // Show a temporary message that sample data is loaded
        setTimeout(() => {
            const marketsGrid = document.getElementById('marketsGrid');
            const sampleNotice = document.createElement('div');
            sampleNotice.className = 'col-12';
            sampleNotice.innerHTML = `
                <div class="alert alert-info alert-dismissible fade show" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Sample Data Loaded:</strong> The Polymarket API is currently unavailable. This is sample data for demonstration purposes.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            marketsGrid.insertBefore(sampleNotice, marketsGrid.firstChild);
        }, 1000);
    }

    showError(message) {
        const marketsGrid = document.getElementById('marketsGrid');
        marketsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4 class="text-danger">Error</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="polymarketViewer.refreshData()">
                    <i class="fas fa-redo me-2"></i>Try Again
                </button>
            </div>
        `;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.polymarketViewer = new PolymarketViewer();
});
