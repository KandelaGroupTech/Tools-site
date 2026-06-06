with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    landing = f.read()

old_link = '''                    {toolsRegistry.map((tool) => (
                        <Link 
                            key={tool.id} 
                            to={tool.route}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={w-12 h-12 rounded-xl flex items-center justify-center border }>
                                    <tool.icon size={24} />
                                </div>
                                <span className={	ext-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full }>
                                    {tool.status.replace('-', ' ')}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-sm text-slate-600 font-light flex-grow mb-6">
                                {tool.description}
                            </p>
                            
                            <div className="flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700 mt-auto">
                                Open Tool <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}'''

new_link = '''                    {toolsRegistry.map((tool) => {
                        const isExternal = tool.route.startsWith('http');
                        const content = (
                            <>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={w-12 h-12 rounded-xl flex items-center justify-center border }>
                                        <tool.icon size={24} />
                                    </div>
                                    <span className={	ext-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full }>
                                        {tool.status.replace('-', ' ')}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-sm text-slate-600 font-light flex-grow mb-6">
                                    {tool.description}
                                </p>
                                
                                <div className="flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700 mt-auto">
                                    Open Tool <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </>
                        );
                        const cardClass = "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group flex flex-col h-full";
                        return isExternal ? (
                            <a key={tool.id} href={tool.route} target="_blank" rel="noopener noreferrer" className={cardClass}>
                                {content}
                            </a>
                        ) : (
                            <Link key={tool.id} to={tool.route} className={cardClass}>
                                {content}
                            </Link>
                        );
                    })}'''

landing = landing.replace(old_link, new_link)

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(landing)
