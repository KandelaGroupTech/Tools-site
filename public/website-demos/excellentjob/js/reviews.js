document.addEventListener('DOMContentLoaded', () => {
    // 1. Star Rating Input Logic
    const stars = document.querySelectorAll('#star-rating-input i');
    const ratingInput = document.getElementById('rating-value');
    
    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const value = e.target.getAttribute('data-value');
                ratingInput.value = value;
                
                // Update active state
                stars.forEach(s => {
                    if (s.getAttribute('data-value') <= value) {
                        s.classList.add('active');
                        s.style.color = '#fbbf24';
                        s.style.fill = '#fbbf24';
                    } else {
                        s.classList.remove('active');
                        s.style.color = 'var(--text-muted)';
                        s.style.fill = 'none';
                    }
                });
            });
        });
    }

    // 2. Review Submission and LocalStorage
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    const reviewSuccess = document.getElementById('review-success');
    
    // Initial placeholder reviews
    const defaultReviews = [
        {
            name: "Sarah Jenkins",
            company: "Monument Realty",
            rating: 5,
            text: "Journey Office Builders delivered exceptional quality on our lobby renovation. They were on time, professional, and their attention to detail was outstanding.",
            date: "2025-11-14T10:00:00.000Z"
        },
        {
            name: "David Chen",
            company: "TechFlow Inc.",
            rating: 5,
            text: "The entire process was seamless. Journey Office Builders completed our multi-floor tenant fit-out a week ahead of schedule, with impeccable craftsmanship.",
            date: "2026-01-22T14:30:00.000Z"
        },
        {
            name: "Marcus Webb",
            company: "Apex Defense Solutions",
            rating: 5,
            text: "Their team handled the complex SCIF construction for our new government contract space perfectly. Professional, discreet, and deeply knowledgeable about the stringent requirements.",
            date: "2026-03-08T09:15:00.000Z"
        },
        {
            name: "Elena Rodriguez",
            company: "Urban Market",
            rating: 5,
            text: "We've partnered with Journey Office Builders for three different retail expansions now. Their communication is top-notch and they always mitigate disruptions to our active storefronts.",
            date: "2026-05-19T16:45:00.000Z"
        },
        {
            name: "James Lipton",
            company: "Global Financial",
            rating: 5,
            text: "Transforming our outdated 90s cafeteria into a modern, vibrant corporate dining space was no small feat. The Journey team delivered beyond our expectations.",
            date: "2026-06-27T11:20:00.000Z"
        },
        {
            name: "Amanda Foster",
            company: "Foster & Associates Architecture",
            rating: 5,
            text: "What impressed me most was their proactive approach to problem-solving. When structural surprises arose during our renovation, they already had cost-effective solutions ready to present.",
            date: "2026-07-18T13:00:00.000Z"
        }
    ];

    function loadReviews() {
        const stored = localStorage.getItem('job_reviews_v3');
        let reviews = stored ? JSON.parse(stored) : defaultReviews;
        
        if (reviewsList) {
            reviewsList.innerHTML = ''; // Clear current
            
            reviews.reverse().forEach(review => {
                const date = new Date(review.date).toLocaleDateString();
                
                // Build stars HTML
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= review.rating) {
                        starsHtml += '<i data-lucide="star" style="width: 20px; height: 20px; color: #fbbf24; fill: #fbbf24;"></i>';
                    } else {
                        starsHtml += '<i data-lucide="star" style="width: 20px; height: 20px; color: var(--text-muted);"></i>';
                    }
                }
                
                const card = document.createElement('div');
                card.className = 'glass';
                card.style.cssText = 'padding: var(--spacing-lg); border-radius: var(--radius-lg); animation: fade-in 0.5s ease;';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-sm);">
                        <div style="display: flex; gap: 4px;">${starsHtml}</div>
                        <span style="color: var(--text-muted); font-size: 0.85rem;">${date}</span>
                    </div>
                    <p style="font-size: 1.1rem; color: var(--text-primary); font-style: italic; margin-bottom: var(--spacing-md);">"${review.text}"</p>
                    <div>
                        <strong style="display: block; color: var(--text-primary);">${review.name}</strong>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">${review.company}</span>
                    </div>
                `;
                reviewsList.appendChild(card);
            });
            
            // Re-init icons for newly added HTML
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    if (reviewForm) {
        loadReviews();
        
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rating = ratingInput.value;
            if (rating == 0) {
                alert("Please select a star rating.");
                return;
            }
            
            const name = document.getElementById('reviewer-name').value;
            const company = document.getElementById('reviewer-company').value;
            const text = document.getElementById('review-text').value;
            
            const newReview = {
                name,
                company,
                rating: parseInt(rating),
                text,
                date: new Date().toISOString()
            };
            
            const stored = localStorage.getItem('job_reviews_v3');
            let reviews = stored ? JSON.parse(stored) : defaultReviews;
            
            reviews.push(newReview);
            localStorage.setItem('job_reviews_v3', JSON.stringify(reviews));
            
            // Show success, reset form
            reviewForm.reset();
            ratingInput.value = 0;
            stars.forEach(s => {
                s.classList.remove('active');
                s.style.color = 'var(--text-muted)';
                s.style.fill = 'none';
            });
            
            reviewForm.style.display = 'none';
            reviewSuccess.style.display = 'block';
            
            setTimeout(() => {
                reviewForm.style.display = 'block';
                reviewSuccess.style.display = 'none';
            }, 3000);
            
            loadReviews();
        });
    }
});
