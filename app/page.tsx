'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ScanLine, TrendingUp, Bot, ChefHat, 
  Settings, ArrowLeft, History, Bell, Bookmark, 
  CheckCircle2, Leaf, Beef, Droplet, Check, Play, Send,
  Flame, Activity, Zap, Search, X, Clock, Camera, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const energyData = [
  { time: '8 AM', cals: 320 }, { time: '12 PM', cals: 850 },
  { time: '4 PM', cals: 1100 }, { time: '8 PM', cals: 1950 }, { time: '10 PM', cals: 2150 },
];

const recipesDB = [
  { id: 1, title: 'Superfood Keto Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop', stats: '450 kcal • 35g Protein • 15m Prep', desc: 'A rich bowl of mixed greens, grilled tofu, and roasted chickpeas topped with a light vinaigrette.' },
  { id: 2, title: 'Cauliflower Crust Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', stats: '600 kcal • 40g Protein • 30m Prep', desc: 'Guilt-free pizza night. Low carb cauliflower base loaded with fresh mozzarella, basil, and cherry tomatoes.' }
];

export default function NutriVisionApp() {
  const [activeTab, setActiveTab] = useState('Log Meals');
  
  // --- SCANNER STATE ---
  // 'camera' = waiting to scan | 'scanning' = laser animation | 'results' = show macros
  const [scanStage, setScanStage] = useState<'camera' | 'scanning' | 'results'>('camera');
  
  // --- LOG MEALS STATE ---
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Atlantic Salmon', 'Quinoa', 'Avocado', 'Baby Spinach']);

  // --- AI COACH STATE ---
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey Alex! I noticed you were slightly under your protein goal yesterday. How about a high-protein breakfast today? I can suggest some recipes.' },
    { role: 'user', text: 'Yeah, sounds good. Show me something with eggs and spinach.' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- RECIPES STATE ---
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  // --- HANDLERS ---
  const startScan = () => {
    setScanStage('scanning');
    // Simulate AI processing time for 3 seconds, then show results
    setTimeout(() => {
      setScanStage('results');
    }, 3000);
  };

  const resetScanner = () => {
    setScanStage('camera');
    setIsBookmarked(false);
  };

  const handleLogMeal = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      resetScanner(); // Reset back to camera after logging
    }, 3000);
  };

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessages = [...messages, { role: 'user', text: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "That's a great choice! A spinach and egg white omelette will give you about 25g of protein and keep you under 300 calories. Should I log that for breakfast?" 
      }]);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex font-sans selection:bg-emerald-500/30">
      
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2">
            <CheckCircle2 size={20} /> Meal Logged Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECIPE MODAL */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#121215] border border-zinc-800 rounded-[2rem] w-full max-w-2xl overflow-hidden relative">
              <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-black transition-colors"><X size={20} /></button>
              <div className="h-64 w-full"><img src={selectedRecipe.image} className="w-full h-full object-cover" alt="Recipe" /></div>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-2">{selectedRecipe.title}</h2>
                <div className="flex items-center gap-4 text-emerald-400 font-medium mb-6">
                  <span className="flex items-center gap-1"><Flame size={16}/> {selectedRecipe.stats.split('•')[0]}</span>
                  <span className="flex items-center gap-1"><Activity size={16}/> {selectedRecipe.stats.split('•')[1]}</span>
                  <span className="flex items-center gap-1"><Clock size={16}/> {selectedRecipe.stats.split('•')[2]}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed mb-8">{selectedRecipe.desc}</p>
                <button onClick={() => setSelectedRecipe(null)} className="w-full bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors">Start Cooking</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800/50 p-6 flex flex-col justify-between hidden md:flex bg-[#0a0a0c]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-400 mb-10 flex items-center gap-2">NutriVision</h1>
          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" isActive={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
            <NavItem icon={<ScanLine size={18} />} label="Log Meals" isActive={activeTab === 'Log Meals'} onClick={() => setActiveTab('Log Meals')} />
            <NavItem icon={<TrendingUp size={18} />} label="Analytics" isActive={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            <NavItem icon={<Bot size={18} />} label="AI Coach" isActive={activeTab === 'AI Coach'} onClick={() => setActiveTab('AI Coach')} />
            <NavItem icon={<ChefHat size={18} />} label="Recipes" isActive={activeTab === 'Recipes'} onClick={() => setActiveTab('Recipes')} />
          </nav>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-zinc-900/50 transition-colors cursor-pointer">
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Alex" alt="Profile" className="w-10 h-10 rounded-full bg-zinc-800" />
            <div><p className="text-sm font-medium">Alex Rivera</p><p className="text-xs text-emerald-500 font-medium">Pro Member</p></div>
          </div>
          <button className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors w-full px-2">
            <Settings size={18} /> <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 max-w-5xl mx-auto overflow-y-auto relative w-full">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors"><ArrowLeft size={20} /></button>
            <h2 className="text-2xl font-semibold tracking-tight">{activeTab}</h2>
          </div>
          <div className="flex gap-4 text-zinc-400">
            <button className="hover:text-white transition-colors"><History size={20} /></button>
            <button className="hover:text-white transition-colors"><Bell size={20} /></button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'Dashboard' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-900/40 to-zinc-900 border border-zinc-800/50 p-8 rounded-[2rem]">
                  <h3 className="text-3xl font-bold mb-2">Welcome back, Alex</h3>
                  <p className="text-zinc-400">You're on a 4-day streak. Keep it up!</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 bg-[#121215] border border-zinc-800/50 p-6 rounded-[2rem]">
                    <h4 className="font-semibold mb-4 flex items-center gap-2"><Flame size={18} className="text-emerald-500"/> Energy Curve</h4>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={energyData}>
                          <defs>
                            <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                          </defs>
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10}/>
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: '#10b981' }}/>
                          <Area type="monotone" dataKey="cals" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCals)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-[#121215] border border-zinc-800/50 p-6 rounded-[2rem] flex flex-col justify-center gap-4">
                    <MicroBar label="Protein" value="145g" percent="80%" color="bg-blue-500" />
                    <MicroBar label="Carbs" value="180g" percent="60%" color="bg-purple-500" />
                    <MicroBar label="Fats" value="65g" percent="40%" color="bg-yellow-500" />
                  </div>
                </div>
              </div>
            )}

            {/* --- LOG MEALS TAB (WITH NEW SCANNER FLOW) --- */}
            {activeTab === 'Log Meals' && (
              <div className="space-y-6">
                
                {/* 1. CAMERA VIEW */}
                {scanStage === 'camera' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[500px] bg-[#121215] border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 transition-colors rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-50 z-10" />
                    <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 blur-sm transition-all" alt="Camera Feed" />
                    
                    <div className="z-20 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                        <Camera size={48} />
                      </div>
                      <h3 className="text-3xl font-bold mb-3">AI Food Scanner</h3>
                      <p className="text-zinc-400 mb-8 max-w-sm">Center your meal in the frame. Our AI will automatically detect ingredients and macros.</p>
                      
                      <button onClick={startScan} className="bg-emerald-500 text-black px-10 py-4 rounded-xl font-bold hover:bg-emerald-400 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <ScanLine size={24} /> Capture & Analyze
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. SCANNING ANIMATION */}
                {scanStage === 'scanning' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] rounded-[2rem] overflow-hidden relative border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover brightness-75" alt="Scanning" />
                    
                    {/* Laser Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_4px_#10b981] z-10"
                    />
                    <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
                    
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-zinc-950/90 text-emerald-400 px-6 py-3 rounded-full font-bold flex items-center gap-3 backdrop-blur-md border border-emerald-500/30 z-20">
                      <Loader2 size={20} className="animate-spin" /> Analyzing 10M+ Food Datapoints...
                    </div>
                  </motion.div>
                )}

                {/* 3. RESULTS (The existing macro breakdown) */}
                {scanStage === 'results' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <section className="relative h-[300px] rounded-[2rem] overflow-hidden mb-6 group">
                      <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000&auto=format&fit=crop" alt="Grilled Salmon Bowl" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
                      
                      {/* Close/Reset button on image */}
                      <button onClick={resetScanner} className="absolute top-6 right-6 bg-black/50 hover:bg-black/80 backdrop-blur-md p-3 rounded-full transition-colors z-10">
                        <X size={20} className="text-zinc-300" />
                      </button>

                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/50">
                          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full w-fit mb-3">
                            <CheckCircle2 size={12} /> <span className="text-xs font-semibold">Verified AI</span>
                          </div>
                          <h3 className="text-2xl font-bold mb-1">Grilled Salmon Bowl</h3>
                          <p className="text-4xl font-bold text-emerald-400">550 <span className="text-lg text-zinc-400 font-medium">kcal</span></p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={handleLogMeal} className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-semibold px-6 py-3 rounded-xl transition-all">Log for Dinner</button>
                          <button onClick={() => setIsBookmarked(!isBookmarked)} className={`backdrop-blur-md p-3 rounded-xl border transition-all active:scale-95 ${isBookmarked ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/80 border-zinc-800/50 text-zinc-300 hover:bg-zinc-800'}`}>
                            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </section>
                    <section className="grid grid-cols-3 gap-4 mb-6">
                      <MacroCard title="Protein" amount="42g" percentage="75% of target" color="text-blue-500" stroke="#3b82f6" />
                      <MacroCard title="Carbs" amount="35g" percentage="42% of target" color="text-purple-500" stroke="#a855f7" />
                      <MacroCard title="Fat" amount="22g" percentage="28% of target" color="text-yellow-500" stroke="#eab308" />
                    </section>
                    <section className="grid grid-cols-2 gap-6">
                      <div className="bg-[#121215] border border-zinc-800/50 rounded-[2rem] p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-semibold text-lg">Detected Ingredients</h4>
                          <span className="text-xs text-zinc-500">{selectedIngredients.length} Selected</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <IngredientCard icon={<Beef size={16}/>} name="Atlantic Salmon" details="180g • 324 kcal" isSelected={selectedIngredients.includes('Atlantic Salmon')} onClick={() => toggleIngredient('Atlantic Salmon')} />
                          <IngredientCard icon={<Leaf size={16}/>} name="Quinoa" details="120g • 144 kcal" isSelected={selectedIngredients.includes('Quinoa')} onClick={() => toggleIngredient('Quinoa')} />
                          <IngredientCard icon={<Droplet size={16}/>} name="Avocado" details="50g • 80 kcal" isSelected={selectedIngredients.includes('Avocado')} onClick={() => toggleIngredient('Avocado')} />
                          <IngredientCard icon={<Leaf size={16}/>} name="Baby Spinach" details="30g • 7 kcal" isSelected={selectedIngredients.includes('Baby Spinach')} onClick={() => toggleIngredient('Baby Spinach')} />
                        </div>
                      </div>
                      <div className="bg-[#121215] border border-zinc-800/50 rounded-[2rem] p-6">
                        <h4 className="font-semibold text-lg mb-6">Micronutrients</h4>
                        <div className="space-y-5">
                          <MicroBar label="Fiber" value="8g" percent="32%" />
                          <MicroBar label="Sugar" value="2g" percent="4%" color="bg-rose-500" />
                          <MicroBar label="Sodium" value="420mg" percent="18%" color="bg-zinc-400" />
                          <MicroBar label="Vitamin D" value="4.2mcg" percent="65%" />
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}
              </div>
            )}

            {/* --- AI COACH TAB --- */}
            {activeTab === 'AI Coach' && (
              <div className="bg-[#121215] border border-zinc-800/50 rounded-[2rem] h-[600px] flex flex-col">
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {messages.map((msg, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800'}`}>
                        {msg.role === 'ai' ? <Bot size={20} /> : <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Alex" alt="Me" className="w-full h-full rounded-full" />}
                      </div>
                      <div className={`p-4 text-sm max-w-[80%] ${msg.role === 'ai' ? 'bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-800/50' : 'bg-emerald-600 text-white rounded-2xl rounded-tr-none'}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-zinc-800/50 flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask your AI nutritionist..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors" />
                  <button onClick={handleSendMessage} className="bg-emerald-500 text-black p-3 rounded-xl hover:bg-emerald-400 active:scale-95 transition-transform"><Send size={20} /></button>
                </div>
              </div>
            )}

            {/* --- RECIPES TAB --- */}
            {activeTab === 'Recipes' && (
              <div className="grid grid-cols-2 gap-6">
                {recipesDB.map((recipe) => (
                  <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="bg-[#121215] border border-zinc-800/50 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-zinc-500 transition-all">
                    <div className="h-48 overflow-hidden"><img src={recipe.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={recipe.title} /></div>
                    <div className="p-5">
                      <h4 className="text-lg font-bold mb-1">{recipe.title}</h4>
                      <p className="text-zinc-400 text-sm mb-4">{recipe.stats}</p>
                      <button className="w-full bg-zinc-900 hover:bg-zinc-800 py-2 rounded-xl text-sm font-medium transition-colors">View Recipe</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- ANALYTICS TAB --- */}
            {activeTab === 'Analytics' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                 <TrendingUp size={48} className="mb-4 opacity-50 text-emerald-500" />
                 <h3 className="text-xl font-medium text-zinc-300 mb-2">Weekly Analytics Generation</h3>
                 <p className="text-sm">More advanced charts loading...</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---
function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-zinc-800/80 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
      <span className={isActive ? 'text-emerald-400' : ''}>{icon}</span> {label}
    </button>
  );
}

function MacroCard({ title, amount, percentage, color, stroke }: { title: string, amount: string, percentage: string, color: string, stroke: string }) {
  return (
    <div className="bg-[#121215] border border-zinc-800/50 hover:border-zinc-700 transition-colors rounded-[2rem] p-6 flex items-center gap-6 cursor-pointer">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className={color} strokeWidth="3" strokeDasharray="75, 100" stroke={stroke} fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span className="absolute text-sm font-bold">{amount}</span>
      </div>
      <div><p className="text-sm font-medium text-white mb-1">{title}</p><p className={`text-xs ${color}`}>{percentage}</p></div>
    </div>
  );
}

function IngredientCard({ icon, name, details, isSelected, onClick }: { icon: React.ReactNode, name: string, details: string, isSelected: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`text-left rounded-xl p-3 flex flex-col gap-3 transition-all border ${isSelected ? 'bg-zinc-900/80 border-emerald-500/30' : 'bg-zinc-900/30 border-zinc-800/50 opacity-60 hover:opacity-100'}`}>
      <div className="flex items-center justify-between w-full">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>{icon}</div>
        {isSelected && <Check size={14} className="text-emerald-500" />}
      </div>
      <div><p className={`text-sm font-medium ${isSelected ? 'text-zinc-200' : 'text-zinc-400'}`}>{name}</p><p className="text-[10px] text-zinc-500">{details}</p></div>
    </button>
  );
}

function MicroBar({ label, value, percent, color = "bg-emerald-500" }: { label: string, value: string, percent: string, color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2"><span className="text-zinc-300 font-medium">{label}</span><span className="text-zinc-500">{value} / {percent} DV</span></div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{ width: percent }} /></div>
    </div>
  );
}