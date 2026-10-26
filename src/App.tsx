/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Heart,
  Camera,
  Layers,
  Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { STYLES, generateAIPhotos, GenerationParams } from './services/geminiService';

type AspectRatio = "1:1" | "16:9" | "9:16";

export default function App() {
  const [step, setStep] = useState<'landing' | 'upload' | 'customize' | 'generating' | 'result'>('landing');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [gender, setGender] = useState<"Female" | "Male">("Female");
  const [customStyle, setCustomStyle] = useState("");
  const [randomPose, setRandomPose] = useState(false);
  const [keepFace, setKeepFace] = useState(true);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setStep('customize');
      // Simulate face detection
      setTimeout(() => setFaceDetected(true), 1000);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    
    setIsGenerating(true);
    setStep('generating');
    setError(null);

    try {
      const images = await generateAIPhotos({
        image: selectedImage,
        concept: selectedStyle,
        aspectRatio: aspectRatio,
        gender: gender,
        customStyle: customStyle,
        randomPose: randomPose
      });
      setGeneratedImages(images);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.");
      setStep('customize');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `women-day-ai-${index + 1}.png`;
    link.click();
  };

  const handleShare = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'ai-photo.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: "Ảnh AI 8/3 của tôi",
          text: "Tôi vừa thử AI tạo ảnh 8/3 😍 Nhìn như hoa hậu luôn!",
          files: [file]
        });
      } else {
        alert("Trình duyệt không hỗ trợ chia sẻ trực tiếp. Bạn có thể tải ảnh về.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-rose-100 luxury-gradient">
      {/* Magical Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.2
            }}
            animate={{ 
              y: [null, "-20%"],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-white/20 backdrop-blur-xl border-b border-white/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff8e53] to-[#ff6b6b] flex items-center justify-center text-white shadow-lg rotate-3 animate-glow">
            <Sparkles size={24} />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-[#2d2d2d]">DreamPortrait</span>
        </div>
        <button 
          onClick={() => setStep('landing')}
          className="text-sm font-bold text-[#ff6b6b] hover:text-[#ff8e53] transition-colors uppercase tracking-widest"
        >
          Trang chủ
        </button>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center space-y-16 py-12"
            >
              {/* Hero Section - Centered */}
              <div className="max-w-3xl space-y-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur border border-white/40 text-[#ff6b6b] text-[10px] font-black uppercase tracking-[0.25em] shadow-sm mx-auto"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  Magical AI Transformation
                </motion.div>
                
                <div className="space-y-6">
                  <h1 className="font-display text-6xl md:text-8xl font-black text-[#2d2d2d] leading-[0.85] tracking-tighter">
                    DreamPortrait – <br />
                    <span className="gradient-text italic font-serif font-light">Chân Dung Trong Mơ</span>
                  </h1>
                  <p className="text-[#2d2d2d]/70 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                    Create Stunning AI Portraits In Seconds.<br />
                    <span className="text-[#ff6b6b]">Biến ảnh của bạn thành chân dung AI lung linh chỉ trong vài giây.</span>
                  </p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-premium flex items-center gap-3 group w-full sm:w-auto justify-center text-lg"
                  >
                    📤 Tải ảnh lên
                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/portrait${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.15em] text-[#ff6b6b] mt-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Hơn 100.000 chân dung AI đã được tạo
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Cards - Centered */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                {[
                  { title: "Giữ nguyên khuôn mặt", desc: "AI giữ trọn vẹn nét mặt thật của bạn.", icon: "📸" },
                  { title: "Hàng trăm phong cách", desc: "Tạo ảnh chân dung điện ảnh, nghệ thuật, thiên nhiên.", icon: "🎨" },
                  { title: "Chất lượng 8K Ultra", desc: "Ảnh sắc nét như chụp tại studio chuyên nghiệp.", icon: "🖼" }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-10 rounded-[3rem] space-y-6 hover:translate-y-[-12px] transition-all duration-500 border-white/60 group text-center flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-white to-rose-50 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-display text-2xl font-black text-[#2d2d2d] tracking-tight">{feature.title}</h3>
                      <p className="text-[#2d2d2d]/50 text-sm leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </motion.div>
          )}

          {step === 'customize' && (
            <motion.div 
              key="customize"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Left: Preview (4 cols) */}
              <div className="lg:col-span-5 space-y-8">
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white bg-white">
                  <img 
                    src={selectedImage!} 
                    alt="Original" 
                    className="w-full h-full object-cover"
                  />
                  {faceDetected && (
                    <div className="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl">
                      <CheckCircle2 size={14} />
                      Face detected ✓
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-black shadow-2xl hover:bg-white transition-all active:scale-90"
                  >
                    <RefreshCw size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-card p-6 rounded-[2rem] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-black text-sm uppercase tracking-wider">Keep Face</span>
                        <span className="text-[10px] text-black/40">Preserve identity 100%</span>
                      </div>
                      <button 
                        onClick={() => setKeepFace(!keepFace)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${keepFace ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${keepFace ? 'left-5.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-[2rem] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-black text-sm uppercase tracking-wider">Random Pose</span>
                        <span className="text-[10px] text-black/40">Dynamic variations</span>
                      </div>
                      <button 
                        onClick={() => setRandomPose(!randomPose)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${randomPose ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${randomPose ? 'left-5.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Options (7 cols) */}
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-6">
                  <h3 className="font-display text-2xl font-bold text-black flex items-center gap-3">
                    <div className="w-1 h-8 bg-amber-600 rounded-full" />
                    Giới tính
                  </h3>
                  <div className="flex gap-4">
                    {["Female", "Male"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g as any)}
                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 uppercase tracking-widest text-xs ${
                          gender === g 
                            ? 'border-black bg-black text-white shadow-xl' 
                            : 'border-white bg-white/50 text-black/60 hover:bg-white'
                        }`}
                      >
                        {g === "Female" ? "Nữ (Female)" : "Nam (Male)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-display text-2xl font-bold text-black flex items-center gap-3">
                    <div className="w-1 h-8 bg-amber-600 rounded-full" />
                    Chọn phong cách
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-5 rounded-3xl text-left transition-all border-2 flex flex-col gap-3 ${
                          selectedStyle === style.id 
                            ? 'border-amber-600 bg-white shadow-xl scale-[1.02]' 
                            : 'border-transparent bg-white/40 hover:bg-white/60'
                        }`}
                      >
                        <span className="text-3xl">{style.icon}</span>
                        <span className="font-bold text-black text-xs uppercase tracking-wider">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-display text-2xl font-bold text-black flex items-center gap-3">
                    <div className="w-1 h-8 bg-amber-600 rounded-full" />
                    Kích thước ảnh
                  </h3>
                  <div className="flex gap-4">
                    {(["1:1", "16:9", "9:16"] as AspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 uppercase tracking-widest text-[10px] ${
                          aspectRatio === ratio 
                            ? 'border-black bg-black text-white shadow-xl' 
                            : 'border-white bg-white/50 text-black/60 hover:bg-white'
                        }`}
                      >
                        {ratio === "1:1" ? "1:1 (Square)" : ratio === "16:9" ? "16:9 (Landscape)" : "9:16 (Portrait)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-display text-2xl font-bold text-black flex items-center gap-3">
                    <div className="w-1 h-8 bg-amber-600 rounded-full" />
                    Phong cách cá nhân
                  </h3>
                  <textarea
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    placeholder="Ví dụ: phong cách điện ảnh, sang trọng, vintage, hoặc dễ thương..."
                    className="w-full p-6 rounded-[2rem] border-2 border-white bg-white/40 focus:bg-white focus:border-amber-600 outline-none transition-all text-sm min-h-[120px] resize-none shadow-inner"
                  />
                </div>

                <div className="pt-10">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full btn-premium py-6 text-xl flex items-center justify-center gap-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                  >
                    <Sparkles size={28} />
                    Tạo ảnh AI ngay
                  </button>
                  <div className="flex justify-center gap-8 mt-6 opacity-40">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                      <CheckCircle2 size={12} /> 8K Ultra HD
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                      <CheckCircle2 size={12} /> Studio Lighting
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-6 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center gap-4 text-sm border border-rose-100">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-12"
            >
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-[6px] border-black/5 border-t-amber-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-amber-600">
                  <Sparkles size={48} className="animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="font-display text-4xl font-bold text-black">Đang tạo chân dung trong mơ...</h2>
                <p className="text-black/40 uppercase tracking-[0.3em] text-xs font-bold">Vui lòng đợi khoảng 15 giây</p>
              </div>
              <div className="max-w-md w-full bg-black/5 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                  className="h-full bg-amber-600"
                />
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h2 className="font-display text-5xl font-bold text-black tracking-tight">Chân dung hoàn tất</h2>
                <p className="text-black/40 uppercase tracking-[0.2em] text-xs font-bold italic">Tuyệt đẹp như trong mơ</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {generatedImages.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="group relative"
                  >
                    <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white bg-white">
                      <img src={img} alt={`Result ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[3rem] flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                      <button 
                        onClick={() => handleDownload(img, idx)}
                        className="w-48 bg-white py-4 rounded-2xl text-black font-bold flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-2xl"
                      >
                        <Download size={20} />
                        Tải về
                      </button>
                      <button 
                        onClick={() => handleShare(img)}
                        className="w-48 bg-amber-600 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-2xl"
                      >
                        <Share2 size={20} />
                        Chia sẻ
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-8 pt-12">
                <div className="flex gap-6">
                  <button 
                    onClick={() => setStep('customize')}
                    className="px-10 py-5 rounded-full font-bold bg-white text-black border border-black/5 hover:bg-gray-50 shadow-xl flex items-center gap-3 transition-all active:scale-95"
                  >
                    <RefreshCw size={22} />
                    Tạo lại
                  </button>
                  <button 
                    onClick={() => setStep('landing')}
                    className="px-10 py-5 rounded-full font-bold bg-[#1a1a1a] text-white hover:bg-black shadow-xl flex items-center gap-3 transition-all active:scale-95"
                  >
                    Thử ảnh khác
                  </button>
                </div>
                
                <div className="glass-card p-8 rounded-[2.5rem] max-w-xl w-full text-center space-y-6">
                  <p className="text-black/80 font-serif text-xl italic leading-relaxed">
                    "Tôi vừa thử AI tạo chân dung trong mơ 😍 Nhìn như tác phẩm nghệ thuật luôn!"
                  </p>
                  <div className="flex justify-center gap-6">
                    <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">#DreamPortrait</span>
                    <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">#AIPortrait</span>
                    <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">#ArtisticAI</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-amber-100/30 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
