<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SELFIE AI™ - Welcome to Your Journey</title>

    <!-- Import Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@100;200;300;400&family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        /* Custom Fonts */
        .font-bordoni { font-family: 'Bodoni Moda', serif; }
        .font-lingerie { font-family: 'Playfair Display', serif; }
        .font-neue { font-family: 'Inter', sans-serif; }

        /* Loading Spinner */
        .spinner {
            border: 2px solid #F1F1F1;
            border-top: 2px solid #171719;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Shimmer Effect */
        .shimmer {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    </style>
</head>
<body class="bg-[#F1F1F1] min-h-screen flex items-center justify-center">

<div class="w-full max-w-[1200px] mx-auto px-5 py-10">
    <div class="bg-white border border-[#E5E5E5] overflow-hidden relative">
        <!-- Top Bar -->
        <div class="bg-[#171719] h-1 w-full"></div>

        <div class="px-8 py-16 md:px-16 md:py-24 lg:px-20 lg:py-32 text-center">
            <!-- Logo -->
            <p class="text-xs tracking-[0.4em] uppercase font-thin text-[#B5B5B3] mb-10 font-neue">SELFIE AI™</p>

            <!-- Headline -->
            <h1 class="font-bordoni text-5xl md:text-6xl lg:text-7xl leading-tight font-light tracking-[-0.02em] mb-5 text-[#171719]">
                Welcome to Your
                <span class="font-lingerie italic block text-4xl md:text-5xl lg:text-6xl mt-3">Selfie Journey</span>
            </h1>

            <!-- Subheadline -->
            <p class="text-lg md:text-xl text-[#4C4B4B] mb-12 max-w-[500px] mx-auto font-neue font-light">
                Your exclusive guide is ready. Get ready to transform your selfie game and step into your confidence.
            </p>

            <!-- Download Button -->
            <button id="downloadBtn" class="relative inline-block bg-[#171719] text-[#F1F1F1] px-12 py-6 md:px-16 md:py-6 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 mb-16 overflow-hidden font-neue">
                <span id="buttonText">Download Your Guide</span>
                <div class="shimmer"></div>
            </button>

            <!-- Status Message -->
            <p id="statusMessage" class="text-xs tracking-[0.2em] uppercase text-[#B5B5B3] mt-5 opacity-0 transition-opacity duration-500 font-neue">
                Preparing your exclusive content...
            </p>

            <!-- Divider -->
            <div class="w-16 h-px bg-[#B5B5B3] mx-auto my-16"></div>

            <!-- Quote Section -->
            <div class="mb-16">
                <p class="font-bordoni text-3xl md:text-4xl leading-relaxed italic text-[#171719] mb-5">
                    "Confidence isn't about perfection,<br>it's about owning who you are"
                </p>
                <p class="text-xs tracking-[0.3em] uppercase text-[#B5B5B3] font-neue">— SANDRA</p>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-[#F1F1F1] px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20 text-center">
            <h2 class="font-bordoni text-3xl md:text-3xl mb-4 font-light">Ready for More?</h2>
            <p class="text-base text-[#4C4B4B] mb-8 font-neue font-light">
                This guide is just the beginning. Join SELFIE AI™ to unlock your full potential.
            </p>
            <a href="#" class="inline-block border border-[#171719] text-[#171719] px-12 py-4 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 hover:bg-[#171719] hover:text-[#F1F1F1] font-neue">
                Explore SELFIE AI™
            </a>
        </div>
    </div>

    <!-- Social Footer -->
    <div class="text-center py-10 text-xs text-[#B5B5B3] tracking-[0.1em] font-neue">
        <p>Follow @sandra.social for daily inspiration</p>
    </div>
</div>

<script>
    // Configuration
    const WEBHOOK_URL = 'https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe';
    const TEMPLATE_ID = '24197B16-1667-4C4B-A446-A37D12260E85';
    const TIMEOUT_DURATION = 15000; // 15 seconds

    // Get user data from URL params or session
    function getUserData() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            email: urlParams.get('email') || sessionStorage.getItem('userEmail') || '',
            name: urlParams.get('name') || sessionStorage.getItem('userName') || '',
            templateId: TEMPLATE_ID
        };
    }

    // Trigger webhook for PDF generation
    async function triggerPDFGeneration() {
        const userData = getUserData();
        const statusMessage = document.getElementById('statusMessage');
        const buttonText = document.getElementById('buttonText');
        const downloadBtn = document.getElementById('downloadBtn');

        // Show loading state
        statusMessage.style.opacity = '1';
        statusMessage.textContent = 'Creating your personalized guide...';
        buttonText.innerHTML = '<div class="spinner"></div>Processing...';
        downloadBtn.disabled = true;

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('timeout')), TIMEOUT_DURATION);
            });

            // Create the fetch promise
            const fetchPromise = fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    name: userData.name,
                    templateId: userData.templateId,
                    timestamp: new Date().toISOString()
                })
            });

            // Race between fetch and timeout
            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (response.ok) {
                // Success - wait a bit for PDF processing
                statusMessage.textContent = 'Your guide is almost ready...';

                // Simulate PDF processing time
                setTimeout(() => {
                    statusMessage.textContent = 'Your guide is ready! Click to download.';
                    buttonText.innerHTML = 'Download Now';
                    downloadBtn.disabled = false;

                    // Store success state
                    sessionStorage.setItem('pdfReady', 'true');
                }, 3000);
            } else {
                throw new Error('Webhook failed');
            }

        } catch (error) {
            console.error('PDF generation error:', error);

            // Fallback behavior
            if (error.message === 'timeout') {
                statusMessage.textContent = 'Taking longer than expected... You can still access your guide.';
            } else {
                statusMessage.textContent = 'Ready to download your guide.';
            }

            buttonText.innerHTML = 'Download Guide';
            downloadBtn.disabled = false;

            // Enable direct download as fallback
            sessionStorage.setItem('pdfFallback', 'true');
        }
    }

    // Handle download button click
    document.getElementById('downloadBtn').addEventListener('click', async function(e) {
        e.preventDefault();

        const pdfReady = sessionStorage.getItem('pdfReady');
        const pdfFallback = sessionStorage.getItem('pdfFallback');

        if (pdfReady || pdfFallback) {
            // Direct download
            const pdfUrl = '/api/download-guide'; // Your PDF endpoint
            window.location.href = pdfUrl;

            // Update UI
            document.getElementById('statusMessage').textContent = 'Download started! Check your downloads folder.';
        } else {
            // First click - trigger generation
            await triggerPDFGeneration();
        }
    });

    // Auto-trigger on page load if user data exists
    window.addEventListener('load', function() {
        const userData = getUserData();
        if (userData.email) {
            // Auto-trigger after 1 second
            setTimeout(() => {
                triggerPDFGeneration();
            }, 1000);
        }
    });

    // Clear session data on page unload (optional)
    window.addEventListener('beforeunload', function() {
        // Uncomment to clear session data
        // sessionStorage.removeItem('pdfReady');
        // sessionStorage.removeItem('pdfFallback');
    });
</script>

</body>
</html> 