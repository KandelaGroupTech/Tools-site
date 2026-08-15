import re

with open('public/website-demos/excellentjob/projects.html', 'r', encoding='utf-8') as f:
    html = f.read()

gallery_start = html.find('<!-- Project Gallery -->')
gallery_end = html.find('<!-- Client Logo Marquee -->')

new_gallery = """<!-- Project Gallery -->
    <section class="section">
        <div class="container">
            <!-- Filter Bar -->
            <div class="reveal filter-container" style="display: flex; justify-content: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-2xl); flex-wrap: wrap;">
                <button class="btn btn-primary filter-btn" data-filter="all" style="padding: 0.5rem 1rem; border-radius: 20px;">All</button>
                <button class="btn btn-outline filter-btn" data-filter="office-buildout" style="padding: 0.5rem 1rem; border-radius: 20px;">Office Buildout</button>
                <button class="btn btn-outline filter-btn" data-filter="office-renovations" style="padding: 0.5rem 1rem; border-radius: 20px;">Office Renovations</button>
                <button class="btn btn-outline filter-btn" data-filter="retail" style="padding: 0.5rem 1rem; border-radius: 20px;">Retail</button>
                <button class="btn btn-outline filter-btn" data-filter="industrial" style="padding: 0.5rem 1rem; border-radius: 20px;">Industrial</button>
            </div>

            <div class="project-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-xl);">
                <!-- Office Buildout -->
                <div class="glass reveal project-card" data-category="office-buildout" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <img src="images/hero-office.png" alt="Office Renovation" style="width: 100%; height: 250px; object-fit: cover; transition: transform var(--transition-normal);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Tysons Corner Tech Hub</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Office Buildout</p>
                    </div>
                </div>

                <div class="glass reveal project-card" data-category="office-buildout" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #e0f2fe; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="building" style="color: #0284c7; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Corporate Headquarters</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Office Buildout</p>
                    </div>
                </div>

                <div class="glass reveal project-card" data-category="office-buildout" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #f1f5f9; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="scale" style="color: #475569; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Law Firm Suite</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Office Buildout</p>
                    </div>
                </div>

                <!-- Office Renovations -->
                <div class="glass reveal project-card" data-category="office-renovations" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <img src="images/hero-construction.png" alt="Building Exterior" style="width: 100%; height: 250px; object-fit: cover; transition: transform var(--transition-normal);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Monument Realty Plaza</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Office Renovations</p>
                    </div>
                </div>

                <div class="glass reveal project-card" data-category="office-renovations" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #fef3c7; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="door-open" style="color: #d97706; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Downtown Lobby Refit</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Office Renovations</p>
                    </div>
                </div>

                <!-- Retail -->
                <div class="glass reveal project-card" data-category="retail" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #fee2e2; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="shopping-bag" style="color: #dc2626; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Georgetown Retail Space</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Retail</p>
                    </div>
                </div>

                <div class="glass reveal project-card" data-category="retail" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #fce7f3; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="store" style="color: #db2777; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Bethesda Boutique</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Retail</p>
                    </div>
                </div>

                <!-- Industrial -->
                <div class="glass reveal project-card" data-category="industrial" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #e0e7ff; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="factory" style="color: #4f46e5; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Dulles Industrial Warehouse</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Industrial</p>
                    </div>
                </div>

                <div class="glass reveal project-card" data-category="industrial" style="border-radius: var(--radius-lg); overflow: hidden; position: relative; transition: all var(--transition-normal);">
                    <div style="width: 100%; height: 250px; background-color: #d1fae5; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="truck" style="color: #059669; width: 40px; height: 40px;"></i>
                    </div>
                    <div style="padding: var(--spacing-md); background: var(--bg-primary);">
                        <h3 style="margin-bottom: 4px; font-size: 1.25rem;">Alexandria Distribution Center</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Industrial</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    """

new_html = html[:gallery_start] + new_gallery + html[gallery_end:]
with open('public/website-demos/excellentjob/projects.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
