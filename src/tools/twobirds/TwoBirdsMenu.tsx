import React, { useState, useMemo, useEffect } from 'react';
import { MENU_DATA } from './menu_data';
import { Calendar, Utensils, Carrot, ChevronRight } from 'lucide-react';

interface Block {
    name: string;
    text: string;
}

const getTargetMenuDate = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const isPastRollover = currentHour > 9 || (currentHour === 9 && currentMinute >= 15);
    
    const targetDate = new Date(today);
    const day = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // If it's a weekday and past 9:15 AM, target tomorrow
    if (day >= 1 && day <= 5) {
        if (isPastRollover) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
    }
    
    // If the target date lands on a weekend, push it to Monday
    const targetDay = targetDate.getDay();
    if (targetDay === 6) { // Saturday
        targetDate.setDate(targetDate.getDate() + 2);
    } else if (targetDay === 0) { // Sunday
        targetDate.setDate(targetDate.getDate() + 1);
    }
    
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const date = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
};

const TwoBirdsMenu: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<string>(getTargetMenuDate());
    const [filterButter, setFilterButter] = useState(false);
    const [filterCheese, setFilterCheese] = useState(false);
    const [filterMilk, setFilterMilk] = useState(false);

    useEffect(() => {
        const checkTimeAndRefresh = () => {
            const newDate = getTargetMenuDate();
            setCurrentDate(prev => {
                if (prev !== newDate) {
                    return newDate;
                }
                return prev;
            });
        };

        // Initial check on mount
        checkTimeAndRefresh();

        // Check every minute if the date should roll over
        const intervalId = setInterval(checkTimeAndRefresh, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const formatMenuItems = (text: string) => {
        let cleanText = text.replace(/~+/g, ' ').trim();
        
        const knownFoods = [
            "Toasted oats", "Whole wheat pita pizza w/ cheese", "Whole wheat pita pizza with Cheese", "Whole wheat bagel", "Soft pretzel", "Applesauce", 
            "Apple oatmeal", "Graham cracker", "Graham Crackers", "Diced peaches", "Diced Peaches", "Rice Chex", "Strawberry oatmeal bar", "Cheese cubes",
            "Cinnamon toasted oats", "Saltines", "Peach yogurt", "Bran muffin", "Diced pears", "Cereal snack mix",
            "Kix", "Vanilla yogurt", "Vanilla Yogurt", "Granola", "Blueberry-peach oatmeal", "Blueberry – peach oatmeal", "Veggie crackers", "Apple slices",
            "Whole wheat flakes", "Wheat thins", "Cheddar cheese round", "Rice Crispies", "Sweet potato cracker", "Sweet potato crackers",
            "Mango yogurt", "Blueberry yogurt", "Strawberry/banana yogurt", "Strawberry banana yogurt", "Cherry/vanilla yogurt", "Cherry vanilla yogurt", "Fresh fruit",
            "Chicken parmesan", "Elbows, tomato sauce w/ soy", "Zucchini & yellow squash", "Whole wheat bread/butter",
            "Beef BBQ", "BBQ with soy", "Bean medley", "Roll", "Whole wheat macaroni & cheese", "Mixed vegetables",
            "Whole wheat Turk-a-roni", "White bean mushroom soup", "Grated cheese", "Southwest salad", "Teriyaki-style chicken", "Teriyaki chicken",
            "Broccoli & cheddar quinoa w/brown rice", "Sugar snaps & carrots", "Chicken nuggets", "Chicken Nuggets", "Veggie nuggets", "Potato soup",
            "Whole grain pizza", "Garden salad", "Spinach manicotti", "Winter blend vegetables", "Turkey taco w/whole wheat Tortilla",
            "Beans & brown rice burrito", "Corn", "Whole grain cheese melt", "Tomato soup", "Stuffing topped chicken pot pie", "Apple coleslaw",
            "Black bean tortilla soup", "Chicken thigh w/gravy", "Chicken thigh with gravy", "Picadillo", "Peas", "Chicken Alfredo with tri-color pasta", "Tri-color pasta alfredo",
            "Salad", "Dirty brown rice with beef", "Dirty brown rice", "Spinach salad", "Bean, corn, & chicken quesadilla", "Bean, corn & cheese quesadilla",
            "Green Beans", "Whole wheat spaghetti & meat sauce", "Spaghetti & tomato sauce w/ soy", "Turkey meatloaf", "French lentils w/ thyme", "French Lentils W/ Thyme",
            "Mashed sweet potatoes", "Lasagna", "Tossed salad", "Whole wheat ziti with chicken", "Whole wheat ziti w/chicken sausage", "Lentil penne & tomato sauce w/ soy", "Beans & Brown rice", "Beans and brown rice",
            "Shepherd’s Pie", "Chickpea curry with potatoes", "Pineapple/mango coleslaw", "Pineapple/Mango Coleslaw", "Ravioli w/olive oil, tomato sauce & fresh basil", "Ravioli w/olive oil, tomato sauce, & fresh basil", "BBQ chicken",
            "Mushroom stroganoff", "California blend vegetables", "Turkey sloppy joe", "Turkey Sloppy Joe", "Vegetarian sloppy joe", "Vegetarian Sloppy Joe", "Corn & edamame", "Chicken chili",
            "Veg out chili", "Broccoli & cheese salad", "Vegetarian meal", "Turkey taco w/whole wheat", "Tortilla"
        ].sort((a, b) => b.length - a.length);

        let items: string[] = [];
        let remainingText = cleanText;

        while (remainingText.length > 0) {
            let found = false;
            
            remainingText = remainingText.replace(/^\s*\*\s*/, '');
            remainingText = remainingText.replace(/^\s*\^\s*/, '');
            remainingText = remainingText.replace(/^\s*#\s*/, '');
            remainingText = remainingText.replace(/^\s*\(V\)\s*/, '');
            
            if (remainingText.trim() === '') break;

            for (let food of knownFoods) {
                if (remainingText.toLowerCase().startsWith(food.toLowerCase())) {
                    items.push(food);
                    remainingText = remainingText.substring(food.length).trim();
                    found = true;
                    break;
                }
            }

            if (!found) {
                let spaceIdx = remainingText.indexOf(' ');
                if (spaceIdx === -1) {
                    if (remainingText.trim() && !["(V)", "*", "^", "#"].includes(remainingText.trim())) {
                        items.push(remainingText.trim());
                    }
                    remainingText = "";
                } else {
                    let word = remainingText.substring(0, spaceIdx).trim();
                    if (word && !["(V)", "*", "^", "#"].includes(word)) {
                        items.push(word);
                    }
                    remainingText = remainingText.substring(spaceIdx + 1).trim();
                }
            }
        }

        let mergedItems: string[] = [];
        for (let item of items) {
            if (mergedItems.length > 0 && item.length <= 4 && !knownFoods.some(f => f.toLowerCase() === item.toLowerCase())) {
                mergedItems[mergedItems.length - 1] += " " + item;
            } else {
                mergedItems.push(item);
            }
        }

        return mergedItems.map(item => item.replace(/\*|\^|#|\(V\)/g, '').trim()).filter(i => i.length > 0);
    };

    const processIngredients = (blocks: Block[], menuItems: string[]) => {
        if (!menuItems || menuItems.length === 0) {
            return { updatedItems: [], ingredientsHtml: '' };
        }

        let matchedChunks: string[] = [];
        let updatedItems: { name: string, icons: string[] }[] = [];
        
        for (let item of menuItems) {
            let searchItem = item.toLowerCase()
                                 .replace(/fresh fruit/g, '')
                                 .replace(/vegetarian meal/g, '')
                                 .replace(/w\//g, 'with')
                                 .trim();
                                 
            let hasButter = false;
            let hasCheese = false;
            let hasMilk = false;

            if (!searchItem || searchItem.length < 3) {
                updatedItems.push({ name: item, icons: [] });
                continue;
            }

            if (searchItem.includes('pita pizza')) searchItem = 'whole wheat pita pizza w/ cheese';
            if (searchItem.includes('graham cracker')) searchItem = 'graham crackers';
            if (searchItem.includes('sweet potato cracker')) searchItem = 'sweet potato crackers';

            for (let block of blocks) {
                let blockName = block.name.toLowerCase()
                                     .replace(/w\//g, 'with')
                                     .trim();

                if (blockName === searchItem || 
                   (searchItem.length > 5 && blockName.includes(searchItem)) || 
                   (blockName.length > 5 && searchItem.includes(blockName))) {
                    
                    let text = block.text;
                    const nameLength = block.name.length;
                    
                    let formattedName = block.name;
                    let ingredientsText = text.substring(nameLength).trim();

                    if (filterButter && /butter/i.test(text)) hasButter = true;
                    if (filterCheese && /cheese/i.test(text)) hasCheese = true;
                    if (filterMilk && /milk/i.test(text)) hasMilk = true;
                    
                    if (filterButter) {
                        formattedName = formattedName.replace(/(butter)/gi, '<span class="bg-amber-200 px-1 rounded text-amber-900 font-medium">$1</span>');
                        ingredientsText = ingredientsText.replace(/(butter)/gi, '<span class="bg-amber-200 px-1 rounded text-amber-900 font-medium">$1</span>');
                    }
                    if (filterCheese) {
                        formattedName = formattedName.replace(/(cheese)/gi, '<span class="bg-orange-200 px-1 rounded text-orange-900 font-medium">$1</span>');
                        ingredientsText = ingredientsText.replace(/(cheese)/gi, '<span class="bg-orange-200 px-1 rounded text-orange-900 font-medium">$1</span>');
                    }
                    if (filterMilk) {
                        formattedName = formattedName.replace(/(milk)/gi, '<span class="bg-blue-200 px-1 rounded text-blue-900 font-medium">$1</span>');
                        ingredientsText = ingredientsText.replace(/(milk)/gi, '<span class="bg-blue-200 px-1 rounded text-blue-900 font-medium">$1</span>');
                    }

                    let formattedBlock = `
                    <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <strong class="text-slate-900 block mb-2 font-serif text-lg">${formattedName}</strong>
                        <p class="text-sm text-slate-600 leading-relaxed font-light">${ingredientsText.replace(/\n/g, '<br/>')}</p>
                    </div>`;
                    matchedChunks.push(formattedBlock);
                }
            }
            
            let icons = [];
            if (hasButter) icons.push('🧈');
            if (hasCheese) icons.push('🧀');
            if (hasMilk) icons.push('🥛');
            updatedItems.push({ name: item, icons });
        }
        
        let ingredientsHtml = '';
        if (matchedChunks.length > 0) {
            matchedChunks = [...new Set(matchedChunks)]; // unique
            ingredientsHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${matchedChunks.join('')}</div>`;
        } else {
            ingredientsHtml = '<div class="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-slate-500 italic font-light">No specific ingredient data found for these items.</div>';
        }
        
        return { updatedItems, ingredientsHtml };
    };

    // Prepare data
    const breakfastMenuRaw = MENU_DATA.breakfast_menu[currentDate as keyof typeof MENU_DATA.breakfast_menu];
    const lunchMenuRaw = MENU_DATA.lunch_menu[currentDate as keyof typeof MENU_DATA.lunch_menu];
    const breakfastBlocks = MENU_DATA.breakfast_ingredients_blocks || [];
    const lunchBlocks = MENU_DATA.lunch_ingredients_blocks || [];

    const { updatedItems: breakfastItems, ingredientsHtml: breakfastIngredientsHtml } = useMemo(() => {
        if (!breakfastMenuRaw) return { updatedItems: [], ingredientsHtml: '' };
        const items = formatMenuItems(breakfastMenuRaw);
        return processIngredients(breakfastBlocks, items);
    }, [breakfastMenuRaw, breakfastBlocks, filterButter, filterCheese, filterMilk]);

    const { updatedItems: lunchItems, ingredientsHtml: lunchIngredientsHtml } = useMemo(() => {
        if (!lunchMenuRaw) return { updatedItems: [], ingredientsHtml: '' };
        const items = formatMenuItems(lunchMenuRaw);
        return processIngredients(lunchBlocks, items);
    }, [lunchMenuRaw, lunchBlocks, filterButter, filterCheese, filterMilk]);

    // Format date for display
    const displayDate = useMemo(() => {
        if (!currentDate) return "Select a date";
        const [year, month, day] = currentDate.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, [currentDate]);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-rose-500 selection:text-white">
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg text-white transform rotate-3">
                        <Utensils size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h1 className="font-serif text-white text-xl md:text-2xl font-bold leading-tight tracking-wide">Two Birds</h1>
                        <p className="text-[10px] md:text-xs text-rose-300 tracking-[0.2em] uppercase font-bold">Meal Planner</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Sidebar Controls */}
                <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <Calendar size={18} className="text-slate-900" />
                            Select Date
                        </h2>
                        <input 
                            type="date" 
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            min="2025-10-01" 
                            max="2026-08-31"
                            className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all hover:border-slate-200 cursor-pointer"
                        />
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <h2 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 md:mb-5">
                            Allergen Filters
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                    Highlight Butter <span className="text-2xl drop-shadow-sm">🧈</span>
                                </span>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filterButter ? 'bg-amber-400' : 'bg-slate-200'}`}>
                                    <input type="checkbox" checked={filterButter} onChange={(e) => setFilterButter(e.target.checked)} className="sr-only" />
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterButter ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </label>
                            
                            <div className="h-px bg-slate-100 w-full" />

                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                    Highlight Cheese <span className="text-2xl drop-shadow-sm">🧀</span>
                                </span>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filterCheese ? 'bg-orange-400' : 'bg-slate-200'}`}>
                                    <input type="checkbox" checked={filterCheese} onChange={(e) => setFilterCheese(e.target.checked)} className="sr-only" />
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterCheese ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </label>
                            <div className="h-px bg-slate-100 w-full" />

                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                    Highlight Milk <span className="text-2xl drop-shadow-sm">🥛</span>
                                </span>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filterMilk ? 'bg-blue-400' : 'bg-slate-200'}`}>
                                    <input type="checkbox" checked={filterMilk} onChange={(e) => setFilterMilk(e.target.checked)} className="sr-only" />
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterMilk ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-6 lg:space-y-10 min-w-0">
                    <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 text-white shadow-[0_20px_50px_rgb(15,23,42,0.15)] relative overflow-hidden">
                        {/* Decorative background circles */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                        
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold relative z-10 leading-tight break-words pr-4">
                            {displayDate}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Breakfast */}
                        <div className="bg-white border border-rose-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(225,29,72,0.06)] flex flex-col transform transition-transform md:hover:-translate-y-1 duration-300">
                            <div className="bg-rose-50 px-5 py-4 md:px-8 md:py-6 border-b border-rose-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif font-bold text-rose-900 text-xl md:text-2xl mb-1">Breakfast & Snack</h3>
                                    <p className="text-[10px] md:text-xs font-bold text-rose-400 tracking-wider uppercase">Morning Fuel</p>
                                </div>
                                <span className="text-3xl md:text-4xl drop-shadow-md">🍳</span>
                            </div>
                            <div className="p-5 md:p-8 flex-1">
                                {breakfastItems.length > 0 ? (
                                    <ul className="space-y-4">
                                        {breakfastItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <ChevronRight size={14} className="text-rose-600" />
                                                </div>
                                                <span className="text-slate-700 font-medium text-lg leading-snug">
                                                    {item.name} 
                                                    {item.icons.map((icon, i) => <span key={i} className="ml-2 text-xl inline-block">{icon}</span>)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <span className="text-2xl opacity-50">🍽️</span>
                                        </div>
                                        <p className="text-slate-400 font-medium">No breakfast menu found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lunch */}
                        <div className="bg-white border border-emerald-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(16,185,129,0.06)] flex flex-col transform transition-transform md:hover:-translate-y-1 duration-300">
                            <div className="bg-emerald-50 px-5 py-4 md:px-8 md:py-6 border-b border-emerald-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif font-bold text-emerald-900 text-xl md:text-2xl mb-1">Lunch</h3>
                                    <p className="text-[10px] md:text-xs font-bold text-emerald-500 tracking-wider uppercase">Mid-day Meal</p>
                                </div>
                                <span className="text-3xl md:text-4xl drop-shadow-md">🥗</span>
                            </div>
                            <div className="p-5 md:p-8 flex-1">
                                {lunchItems.length > 0 ? (
                                    <ul className="space-y-4">
                                        {lunchItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <ChevronRight size={14} className="text-emerald-600" />
                                                </div>
                                                <span className="text-slate-700 font-medium text-lg leading-snug">
                                                    {item.name}
                                                    {item.icons.map((icon, i) => <span key={i} className="ml-2 text-xl inline-block">{icon}</span>)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <span className="text-2xl opacity-50">🍽️</span>
                                        </div>
                                        <p className="text-slate-400 font-medium">No lunch menu found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="pt-8 md:pt-12 pb-8 border-t border-slate-200">
                        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <Carrot size={20} className="md:w-6 md:h-6 text-slate-700" />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Ingredients Dictionary</h3>
                                <p className="text-sm md:text-base text-slate-500 font-light mt-1">Detailed breakdown of the meals above</p>
                            </div>
                        </div>
                        
                        <div className="space-y-8 md:space-y-12">
                            {/* Breakfast Ingredients */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-6 bg-rose-400 rounded-full"></div>
                                    <h4 className="font-bold text-slate-800 tracking-wide text-xl font-serif">Breakfast Ingredients</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: breakfastIngredientsHtml }} />
                            </div>
                            
                            {/* Lunch Ingredients */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-6 bg-emerald-400 rounded-full"></div>
                                    <h4 className="font-bold text-slate-800 tracking-wide text-xl font-serif">Lunch Ingredients</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: lunchIngredientsHtml }} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TwoBirdsMenu;
