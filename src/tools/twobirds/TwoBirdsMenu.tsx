import React, { useState, useMemo } from 'react';
import { MENU_DATA } from './menu_data';
import { Calendar, Utensils, Carrot, CheckCircle2 } from 'lucide-react';

interface Block {
    name: string;
    text: string;
}

const getNextWeekday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    if (day === 6) { // Saturday
        today.setDate(today.getDate() + 2);
    } else if (day === 0) { // Sunday
        today.setDate(today.getDate() + 1);
    }
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
};

const TwoBirdsMenu: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<string>(getNextWeekday());
    const [filterButter, setFilterButter] = useState(false);
    const [filterCheese, setFilterCheese] = useState(false);

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
                    
                    if (filterButter) {
                        formattedName = formattedName.replace(/(butter)/gi, '<span class="bg-yellow-200 px-1 rounded text-yellow-900">$1</span>');
                        ingredientsText = ingredientsText.replace(/(butter)/gi, '<span class="bg-yellow-200 px-1 rounded text-yellow-900">$1</span>');
                    }
                    if (filterCheese) {
                        formattedName = formattedName.replace(/(cheese)/gi, '<span class="bg-orange-200 px-1 rounded text-orange-900">$1</span>');
                        ingredientsText = ingredientsText.replace(/(cheese)/gi, '<span class="bg-orange-200 px-1 rounded text-orange-900">$1</span>');
                    }

                    let formattedBlock = `<div class="mb-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0"><strong class="text-teal-800 block mb-1">${formattedName}</strong><p class="text-sm text-slate-600 leading-relaxed">${ingredientsText.replace(/\n/g, '<br/>')}</p></div>`;
                    matchedChunks.push(formattedBlock);
                }
            }
            
            let icons = [];
            if (hasButter) icons.push('🧈');
            if (hasCheese) icons.push('🧀');
            updatedItems.push({ name: item, icons });
        }
        
        let ingredientsHtml = '';
        if (matchedChunks.length > 0) {
            matchedChunks = [...new Set(matchedChunks)]; // unique
            ingredientsHtml = matchedChunks.join('');
        } else {
            ingredientsHtml = '<p class="text-sm text-slate-400 italic">No specific ingredient data found for these items.</p>';
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
    }, [breakfastMenuRaw, breakfastBlocks, filterButter, filterCheese]);

    const { updatedItems: lunchItems, ingredientsHtml: lunchIngredientsHtml } = useMemo(() => {
        if (!lunchMenuRaw) return { updatedItems: [], ingredientsHtml: '' };
        const items = formatMenuItems(lunchMenuRaw);
        return processIngredients(lunchBlocks, items);
    }, [lunchMenuRaw, lunchBlocks, filterButter, filterCheese]);

    // Format date for display
    const displayDate = useMemo(() => {
        if (!currentDate) return "Select a date";
        const [year, month, day] = currentDate.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, [currentDate]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-600 selection:text-white">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 rounded flex items-center justify-center shadow-inner text-white">
                        <Utensils size={20} />
                    </div>
                    <div>
                        <h1 className="font-serif text-slate-900 text-xl font-bold leading-tight">Two Birds Menu</h1>
                        <p className="text-xs text-teal-700 tracking-wide uppercase font-semibold">Daycare Meal Planner</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar Controls */}
                <aside className="w-full lg:w-80 shrink-0 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-teal-600" />
                            Select Date
                        </h2>
                        <input 
                            type="date" 
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            min="2025-10-01" 
                            max="2026-08-31"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                            Allergen Filters
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={filterButter}
                                    onChange={(e) => setFilterButter(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-slate-700 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                    Highlight Butter <span className="text-xl">🧈</span>
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={filterCheese}
                                    onChange={(e) => setFilterCheese(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-slate-700 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                    Highlight Cheese <span className="text-xl">🧀</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    <div className="bg-teal-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-700 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold relative z-10">{displayDate}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Breakfast */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                                <h3 className="font-bold text-amber-900 text-lg">Breakfast & Snack</h3>
                                <span className="text-2xl">🍳</span>
                            </div>
                            <div className="p-6 flex-1">
                                {breakfastItems.length > 0 ? (
                                    <ul className="space-y-3">
                                        {breakfastItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 font-medium">
                                                    {item.name} 
                                                    {item.icons.map((icon, i) => <span key={i} className="ml-1.5">{icon}</span>)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-400 italic">No breakfast/snack menu available.</p>
                                )}
                            </div>
                        </div>

                        {/* Lunch */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                                <h3 className="font-bold text-emerald-900 text-lg">Lunch</h3>
                                <span className="text-2xl">🥗</span>
                            </div>
                            <div className="p-6 flex-1">
                                {lunchItems.length > 0 ? (
                                    <ul className="space-y-3">
                                        {lunchItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 font-medium">
                                                    {item.name}
                                                    {item.icons.map((icon, i) => <span key={i} className="ml-1.5">{icon}</span>)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-400 italic">No lunch menu available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8 mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Carrot size={24} className="text-teal-600" />
                            <h3 className="text-2xl font-serif font-bold text-slate-800">Ingredients Dictionary</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            <div>
                                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 border-b border-slate-100 pb-2">Breakfast Ingredients</h4>
                                <div 
                                    className="prose prose-sm max-w-none text-slate-600"
                                    dangerouslySetInnerHTML={{ __html: breakfastIngredientsHtml }} 
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 border-b border-slate-100 pb-2">Lunch Ingredients</h4>
                                <div 
                                    className="prose prose-sm max-w-none text-slate-600"
                                    dangerouslySetInnerHTML={{ __html: lunchIngredientsHtml }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TwoBirdsMenu;
