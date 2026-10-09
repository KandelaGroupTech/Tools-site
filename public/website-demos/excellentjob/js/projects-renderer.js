document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projects-container");
    if (!container) return;

    // Photography coming soon banner
    const photoNote = document.getElementById("photo-coming-soon");
    if (photoNote) {
        photoNote.style.display = SHOW_PROJECT_PHOTOS ? "none" : "block";
    }

    const categories = [
        "Building Renovations",
        "Office Interiors",
        "Medical Offices",
        "Industrial & Warehouse",
        "Retail",
        "Education & Institutional"
    ];

    let html = "";
    let globalIdx = 0;

    categories.forEach(category => {
        const catProjects = projectsData.filter(p => p.category === category && p.featured);
        
        if (catProjects.length > 0) {
            html += `<div style="margin-bottom: var(--spacing-3xl);">`;
            html += `<h2 style="margin-bottom: var(--spacing-xl); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">${category}</h2>`;
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: var(--spacing-xl);">`;
            
            catProjects.forEach(project => {
                globalIdx++;
                
                html += `<div class="glass project-card" style="background: #eceef1; border: 1px solid #d5d9df; border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column;">`;
                
                // Slider Logic
                if (SHOW_PROJECT_PHOTOS && project.photos && project.photos.length > 0) {
                    const photo = project.photos[0]; // Just use first for now
                    html += `
                    <div class="split-slider">
                        <img alt="Before: ${project.name}" class="split-slider-before" height="600" loading="lazy" src="${photo.before}" style="object-fit: cover;" width="800"/>
                        <img alt="After: ${project.name}" class="split-slider-after" height="600" id="after-img-${globalIdx}" loading="lazy" src="${photo.after}" style="object-fit: cover;" width="800"/>
                        <div class="split-label split-label-after">After</div>
                        <div class="split-label split-label-before">Before</div>
                        <div class="split-slider-handle" id="slider-handle-${globalIdx}">
                            <div class="split-slider-handle-btn"><i data-lucide="chevrons-left-right"></i></div>
                        </div>
                        <input class="split-slider-range" max="100" min="0" oninput="document.getElementById('after-img-${globalIdx}').style.clipPath = \`polygon(0 0, \${this.value}% 0, \${this.value}% 100%, 0 100%)\`; document.getElementById('slider-handle-${globalIdx}').style.left = \`\${this.value}%\`;" type="range" value="50"/>
                    </div>`;
                }

                // Text Content
                html += `<div style="padding: clamp(20px, 4vw, 32px); background: #eceef1; flex-grow: 1;">`;
                html += `<h3 style="margin-bottom: var(--spacing-sm); font-size: 1.25rem;">${project.name}</h3>`;
                
                project.locations.forEach(loc => {
                    html += `<p style="color: #374151; font-size: 0.95rem; margin-bottom: 4px;">${loc}</p>`;
                });
                
                if (project.architect) {
                    html += `<p style="color: #4b5563; font-size: 0.9rem; margin-top: var(--spacing-md); padding-top: var(--spacing-sm); border-top: 1px solid var(--border);">Architect: ${project.architect}</p>`;
                }
                
                html += `</div>`;
                html += `</div>`;
            });
            
            html += `</div></div>`;
        }
    });

    container.innerHTML = html;
    
    // Re-initialize Lucide icons for the newly injected HTML
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
