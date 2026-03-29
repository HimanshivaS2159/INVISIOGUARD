/**
 * Main Application JavaScript for INVISIGUARD Fraud Detection System
 * 
 * This module handles all frontend functionality including:
 * - Form submission and validation
 * - API communication
 * - Tab navigation
 * - Dashboard updates
 * - Transaction history
 * - Real-time monitoring
 */

// Application state
const AppState = {
    currentTab: 'analysis',
    transactionHistory: [],
    statistics: {
        totalTransactions: 0,
        fraudCount: 0,
        totalRisk: 0,
        hourlyCount: 0,
        blockedCount: 0
    },
    isLoading: false,
    apiEndpoint: 'http://127.0.0.1:5000/api/v1/predict'
};

// Initialize components
let loader, toast;

// DOM elements
const elements = {
    // Form elements
    analysisForm: null,
    amountInput: null,
    nightCheckbox: null,
    locationCheckbox: null,
    deviceCheckbox: null,
    analyzeBtn: null,
    
    // Results elements
    resultsSection: null,
    resultStatus: null,
    riskScore: null,
    progressFill: null,
    reasonsList: null,
    
    // Tab elements
    tabButtons: null,
    tabPanes: null,
    
    // Dashboard elements
    totalTransactions: null,
    fraudCount: null,
    avgRisk: null,
    successRate: null,
    riskChart: null,
    
    // History elements
    historyList: null,
    
    // Status elements
    statusIndicator: null
};

/**
 * Initialize the application
 */
function initApp() {
    // Initialize components
    loader = new Loader();
    toast = new Toast();
    
    // Get DOM elements
    initializeElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadInitialData();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    console.log('� INVISIGUARD Fraud Detection System initialized');
}

/**
 * Initialize DOM elements
 */
function initializeElements() {
    // Form elements
    elements.analysisForm = document.getElementById('analysisForm');
    elements.amountInput = document.getElementById('amount');
    elements.nightCheckbox = document.getElementById('night');
    elements.locationCheckbox = document.getElementById('location');
    elements.deviceCheckbox = document.getElementById('device');
    elements.analyzeBtn = document.getElementById('analyzeBtn');
    
    // Results elements
    elements.resultsSection = document.getElementById('resultsSection');
    elements.resultStatus = document.getElementById('resultStatus');
    elements.riskScore = document.getElementById('riskScore');
    elements.progressFill = document.getElementById('progressFill');
    elements.reasonsList = document.getElementById('reasonsList');
    
    // Tab elements
    elements.tabButtons = document.querySelectorAll('.tab-button');
    elements.tabPanes = document.querySelectorAll('.tab-pane');
    
    // Dashboard elements
    elements.totalTransactions = document.getElementById('totalTransactions');
    elements.fraudCount = document.getElementById('fraudCount');
    elements.avgRisk = document.getElementById('avgRisk');
    elements.successRate = document.getElementById('successRate');
    elements.riskChart = document.getElementById('riskChart');
    
    // History elements
    elements.historyList = document.getElementById('historyList');
    
    // Status elements
    elements.statusIndicator = document.getElementById('statusIndicator');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Form submission
    if (elements.analysisForm) {
        elements.analysisForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Tab navigation
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });
    
    // Input validation
    if (elements.amountInput) {
        elements.amountInput.addEventListener('input', validateAmount);
        elements.amountInput.addEventListener('keypress', handleKeyPress);
    }
    
    // Checkbox changes
    [elements.nightCheckbox, elements.locationCheckbox, elements.deviceCheckbox].forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', handleCheckboxChange);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window resize
    window.addEventListener('resize', handleResize);
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (AppState.isLoading) {
        toast.warning('Analysis already in progress...');
        return;
    }
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Analyze transaction
    await analyzeTransaction(formData);
}

/**
 * Validate the form
 */
function validateForm() {
    const amount = parseFloat(elements.amountInput.value);
    
    if (!amount || amount <= 0) {
        toast.error('Please enter a valid transaction amount greater than 0');
        elements.amountInput.focus();
        return false;
    }
    
    if (amount > 1000000) {
        toast.error('Transaction amount seems unusually high. Please verify.');
        return false;
    }
    
    return true;
}

/**
 * Validate amount input
 */
function validateAmount() {
    const amount = parseFloat(elements.amountInput.value);
    
    if (amount < 0) {
        elements.amountInput.value = 0;
    }
    
    // Add visual feedback for validation
    if (amount > 0) {
        elements.amountInput.style.borderColor = 'rgba(34, 197, 94, 0.5)';
    } else {
        elements.amountInput.style.borderColor = '';
    }
}

/**
 * Get form data
 */
function getFormData() {
    return {
        amount: parseFloat(elements.amountInput.value),
        is_night: elements.nightCheckbox.checked ? 1 : 0,
        new_location: elements.locationCheckbox.checked ? 1 : 0,
        new_device: elements.deviceCheckbox.checked ? 1 : 0,
        user_id: 'web_user_' + Date.now(), // Generate unique user ID
        ip_address: null // Will be determined by backend
    };
}

/**
 * Analyze transaction via API
 */
async function analyzeTransaction(formData) {
    try {
        AppState.isLoading = true;
        setLoadingState(true);
        
        console.log('🔍 Analyzing transaction:', formData);
        
        const response = await fetch(AppState.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📊 Analysis result:', result);
        
        // Display results
        displayResults(result);
        
        // Update history and statistics
        addToHistory(formData, result);
        updateStatistics();
        
        // Show appropriate notification
        if (result.result === 'FRAUD') {
            toast.warning(`🚨 Fraud detected! Risk score: ${result.risk_score}%`);
        } else {
            toast.success(`✅ Transaction approved! Risk score: ${result.risk_score}%`);
        }
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        
        let errorMessage = 'Failed to analyze transaction';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to fraud detection service. Please check your connection.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
        }
        
        toast.error(errorMessage);
        
    } finally {
        AppState.isLoading = false;
        setLoadingState(false);
    }
}

/**
 * Display analysis results
 */
function displayResults(result) {
    if (!elements.resultsSection) return;
    
    // Set result status
    if (elements.resultStatus) {
        elements.resultStatus.textContent = result.result;
        elements.resultStatus.className = `result-status ${result.result.toLowerCase()}`;
    }
    
    // Set risk score
    if (elements.riskScore) {
        elements.riskScore.textContent = `Risk: ${result.risk_score}%`;
    }
    
    // Animate progress bar
    if (elements.progressFill) {
        setTimeout(() => {
            elements.progressFill.style.width = `${result.risk_score}%`;
            
            // Set color based on risk level
            elements.progressFill.className = 'progress-fill';
            if (result.risk_score <= 30) {
                elements.progressFill.classList.add('low');
            } else if (result.risk_score <= 70) {
                elements.progressFill.classList.add('medium');
            } else {
                elements.progressFill.classList.add('high');
            }
        }, 100);
    }
    
    // Display reasons
    if (elements.reasonsList && result.reasons) {
        elements.reasonsList.innerHTML = '';
        result.reasons.forEach(reason => {
            const li = document.createElement('li');
            li.textContent = reason;
            elements.reasonsList.appendChild(li);
        });
    }
    
    // Show results section
    elements.resultsSection.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        elements.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 300);
}

/**
 * Handle tab navigation
 */
function handleTabClick(event) {
    const button = event.currentTarget;
    const tabName = button.dataset.tab;
    
    if (tabName === AppState.currentTab) return;
    
    // Update active states
    elements.tabButtons.forEach(btn => btn.classList.remove('active'));
    elements.tabPanes.forEach(pane => pane.classList.remove('active'));
    
    button.classList.add('active');
    const targetPane = document.getElementById(`${tabName}-tab`);
    if (targetPane) {
        targetPane.classList.add('active');
    }
    
    AppState.currentTab = tabName;
    
    console.log(`🔄 Switched to ${tabName} tab`);
}

/**
 * Add transaction to history
 */
function addToHistory(formData, result) {
    const historyItem = {
        amount: formData.amount,
        result: result.result,
        riskScore: result.risk_score,
        timestamp: new Date(),
        reasons: result.reasons || [],
        factors: {
            night: formData.is_night === 1,
            newLocation: formData.new_location === 1,
            newDevice: formData.new_device === 1
        }
    };
    
    AppState.transactionHistory.unshift(historyItem);
    
    // Keep only last 50 transactions
    if (AppState.transactionHistory.length > 50) {
        AppState.transactionHistory = AppState.transactionHistory.slice(0, 50);
    }
    
    updateHistoryDisplay();
    updateStatistics();
}

/**
 * Update history display
 */
function updateHistoryDisplay() {
    if (!elements.historyList) return;
    
    elements.historyList.innerHTML = '';
    
    if (AppState.transactionHistory.length === 0) {
        elements.historyList.innerHTML = '<p style="text-align: center; color: #64748b;">No transactions yet</p>';
        return;
    }
    
    AppState.transactionHistory.slice(0, 10).forEach(item => {
        const historyDiv = document.createElement('div');
        historyDiv.className = 'history-item';
        
        const timeAgo = getTimeAgo(item.timestamp);
        const amountFormatted = `$${item.amount.toFixed(2)}`;
        
        historyDiv.innerHTML = `
            <div class="history-info">
                <div class="history-amount">${amountFormatted}</div>
                <div class="history-time">${timeAgo}</div>
            </div>
            <div class="history-result ${item.result.toLowerCase()}">${item.result}</div>
        `;
        
        elements.historyList.appendChild(historyDiv);
    });
}

/**
 * Update statistics
 */
function updateStatistics() {
    if (!elements.totalTransactions) return;
    
    // Calculate statistics
    const totalTransactions = AppState.transactionHistory.length;
    const fraudCount = AppState.transactionHistory.filter(t => t.result === 'FRAUD').length;
    const totalRisk = AppState.transactionHistory.reduce((sum, t) => sum + t.riskScore, 0);
    const avgRisk = totalTransactions > 0 ? Math.round(totalRisk / totalTransactions) : 0;
    const successRate = totalTransactions > 0 ? Math.round(((totalTransactions - fraudCount) / totalTransactions) * 100) : 100;
    
    // Update DOM
    elements.totalTransactions.textContent = totalTransactions;
    elements.fraudCount.textContent = fraudCount;
    elements.avgRisk.textContent = `${avgRisk}%`;
    elements.successRate.textContent = `${successRate}%`;
    
    // Update chart
    updateRiskChart();
    
    console.log('📊 Statistics updated:', { totalTransactions, fraudCount, avgRisk, successRate });
}

/**
 * Update risk chart
 */
function updateRiskChart() {
    if (!elements.riskChart) return;
    
    // Generate sample data for demonstration
    const chartData = [30, 45, 25, 60, 35, 50, 40];
    const bars = elements.riskChart.querySelectorAll('.bar');
    
    bars.forEach((bar, index) => {
        const height = chartData[index];
        bar.style.height = `${height}%`;
        const valueElement = bar.querySelector('.bar-value');
        if (valueElement) {
            valueElement.textContent = `${height}%`;
        }
    });
}

/**
 * Get time ago string
 */
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

/**
 * Set loading state
 */
function setLoadingState(loading) {
    AppState.isLoading = loading;
    
    if (elements.analyzeBtn) {
        elements.analyzeBtn.disabled = loading;
        elements.analyzeBtn.innerHTML = loading ? 
            '<span class="btn-text">Analyzing...</span><span class="btn-icon">⏳</span>' :
            '<span class="btn-text">Analyze Transaction</span><span class="btn-icon">🔬</span>';
    }
    
    if (loader) {
        if (loading) {
            loader.show('Analyzing transaction...');
        } else {
            loader.hide();
        }
    }
}

/**
 * Handle checkbox changes
 */
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const label = checkbox.nextElementSibling;
    
    if (label) {
        if (checkbox.checked) {
            label.style.color = '#3b82f6';
        } else {
            label.style.color = '';
        }
    }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (AppState.currentTab === 'analysis' && elements.analysisForm) {
            event.preventDefault();
            handleFormSubmit(event);
        }
    }
    
    // Number keys to switch tabs
    if (event.key === '1') {
        switchToTab('analysis');
    } else if (event.key === '2') {
        switchToTab('dashboard');
    } else if (event.key === '3') {
        switchToTab('history');
    }
}

/**
 * Switch to specific tab
 */
function switchToTab(tabName) {
    const button = document.querySelector(`[data-tab="${tabName}"]`);
    if (button) {
        button.click();
    }
}

/**
 * Handle key press in amount input
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleFormSubmit(event);
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    // Adjust chart dimensions if needed
    if (AppState.currentTab === 'dashboard' && elements.riskChart) {
        // Responsive chart adjustments
        const containerWidth = elements.riskChart.offsetWidth;
        if (containerWidth < 400) {
            // Adjust for small screens
            const bars = elements.riskChart.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.width = '20px';
            });
        }
    }
}

/**
 * Load initial data
 */
function loadInitialData() {
    // Load sample data for demonstration
    const sampleTransactions = [
        {
            amount: 1250,
            result: 'SAFE',
            riskScore: 15,
            timestamp: new Date(Date.now() - 120000),
            reasons: ['Normal transaction pattern']
        },
        {
            amount: 5000,
            result: 'FRAUD',
            riskScore: 85,
            timestamp: new Date(Date.now() - 900000),
            reasons: ['High amount', 'New location detected']
        },
        {
            amount: 750,
            result: 'SAFE',
            riskScore: 12,
            timestamp: new Date(Date.now() - 3600000),
            reasons: ['No risk factors detected']
        }
    ];
    
    AppState.transactionHistory = sampleTransactions;
    updateHistoryDisplay();
    updateStatistics();
    
    console.log('📋 Initial data loaded');
}

/**
 * Start real-time updates
 */
function startRealTimeUpdates() {
    // Update system status
    updateSystemStatus();
    
    // Simulate real-time data updates every 30 seconds
    setInterval(() => {
        if (AppState.currentTab === 'dashboard') {
            // Update some metrics
            const currentRisk = Math.floor(Math.random() * 30) + 10;
            const systemHealth = Math.floor(Math.random() * 5) + 95;
            
            // Update status indicator
            updateSystemStatus(currentRisk, systemHealth);
        }
    }, 30000);
    
    console.log('⏰ Real-time updates started');
}

/**
 * Update system status
 */
function updateSystemStatus(currentRisk = null, systemHealth = null) {
    if (!elements.statusIndicator) return;
    
    const statusText = elements.statusIndicator.querySelector('.status-text');
    const statusDot = elements.statusIndicator.querySelector('.status-dot');
    
    if (currentRisk > 70) {
        statusText.textContent = 'High Risk Alert';
        statusDot.style.background = '#ef4444';
        elements.statusIndicator.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        elements.statusIndicator.style.background = 'rgba(239, 68, 68, 0.1)';
    } else if (systemHealth < 90) {
        statusText.textContent = 'System Warning';
        statusDot.style.background = '#f59e0b';
        elements.statusIndicator.style.borderColor = 'rgba(245, 158, 11, 0.3)';
        elements.statusIndicator.style.background = 'rgba(245, 158, 11, 0.1)';
    } else {
        statusText.textContent = 'System Active';
        statusDot.style.background = '#22c55e';
        elements.statusIndicator.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        elements.statusIndicator.style.background = 'rgba(34, 197, 94, 0.2)';
    }
}

/**
 * Check API connectivity
 */
async function checkApiConnectivity() {
    try {
        const response = await fetch(`${AppState.apiEndpoint.replace('/predict', '/health')}`);
        return response.ok;
    } catch (error) {
        console.error('API connectivity check failed:', error);
        return false;
    }
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Check API connectivity
    checkApiConnectivity().then(isConnected => {
        if (!isConnected) {
            toast.warning('⚠️ Unable to connect to fraud detection service');
        } else {
            console.log('✅ API connectivity confirmed');
        }
    });
});

/**
 * Handle page visibility change
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause real-time updates when page is hidden
        console.log('📱 Page hidden - pausing updates');
    } else {
        // Resume real-time updates when page is visible
        console.log('📱 Page visible - resuming updates');
        if (AppState.currentTab === 'dashboard') {
            updateStatistics();
        }
    }
});

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
    toast.error('An unexpected error occurred');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        initApp,
        analyzeTransaction,
        updateStatistics
    };
}
