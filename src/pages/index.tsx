import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Camera, Sparkles, Zap, ArrowRight } from "lucide-react";

// Главная страница выбора галереи
export default function ImagesIndex() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Главные световые элементы */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div 
          className="absolute top-40 right-20 w-80 h-80 bg-purple-500/12 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div 
          className="absolute bottom-32 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        
        {/* Дополнительные световые акценты */}
        <div className="absolute top-1/4 right-1/4 w-2 h-32 bg-gradient-to-b from-blue-400/40 to-transparent rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-24 bg-gradient-to-t from-purple-400/30 to-transparent -rotate-12"></div>
        
        {/* Плавающие частицы */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-ping"></div>
        <div 
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-3/4 w-0.5 h-0.5 bg-cyan-400/70 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Основной контент */}
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6">
        
        {/* Заголовок */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <div className="relative mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="glass rounded-full p-6 animate-scale-in">
                <Camera className="w-16 h-16 text-blue-400" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold gradient-text mb-4 floating">
              Photo Gallery
            </h1>
            
            <div className="relative">
              <p className="text-xl text-white/70 font-light mx-auto leading-relaxed">
                Погрузитесь в мир высококачественных изображений с поддержкой 
                <span className="text-blue-400 font-semibold"> HDR</span> и 
                <span className="text-green-400 font-semibold"> SDR</span> форматов
              </p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Карточки галерей */}
        <div 
          className={`grid md:grid-cols-2 gap-8 max-w-4xl w-full transition-all duration-1000 ${
            isVisible ? "animate-scale-in" : "opacity-0"
          }`}
          style={{ animationDelay: "0.3s" }}
        >
          
          {/* HDR Галерея */}
          <div className="glass rounded-3xl p-8 glass-hover cursor-pointer group relative overflow-hidden"
               onClick={() => router.push('/hdr')}>
            
            {/* Фоновый градиент для карточки */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Иконка и бэдж */}
              <div className="flex items-center justify-between mb-6">
                <div className="glass rounded-2xl p-4 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                </div>
                <div className="glass rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-blue-400">HIGH QUALITY</span>
                </div>
              </div>

              {/* Контент */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  HDR Галерея
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Изображения с расширенным динамическим диапазоном для максимального качества и реалистичности
                </p>
                
                {/* Характеристики */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="text-white/60">Высокое качество</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                    <span className="text-white/60">HDR формат</span>
                  </div>
                </div>

                {/* Кнопка */}
                <div className="pt-4">
                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 font-semibold transition-colors">
                    <span className="mr-2">Открыть галерею</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Анимированная подсветка */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>

          {/* SDR Галерея */}
          <div className="glass rounded-3xl p-8 glass-hover cursor-pointer group relative overflow-hidden"
               onClick={() => router.push('/sdr')}>
            
            {/* Фоновый градиент для карточки */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Иконка и бэдж */}
              <div className="flex items-center justify-between mb-6">
                <div className="glass rounded-2xl p-4 group-hover:bg-green-500/20 transition-all duration-300">
                  <Zap className="w-8 h-8 text-green-400 group-hover:text-green-300" />
                </div>
                <div className="glass rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-green-400">STANDARD</span>
                </div>
              </div>

              {/* Контент */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors">
                  SDR Галерея
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Стандартные изображения с оптимальным балансом качества и производительности
                </p>
                
                {/* Характеристики */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-white/60">Быстрая загрузка</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                    <span className="text-white/60">SDR формат</span>
                  </div>
                </div>

                {/* Кнопка */}
                <div className="pt-4">
                  <div className="flex items-center text-green-400 group-hover:text-green-300 font-semibold transition-colors">
                    <span className="mr-2">Открыть галерею</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Анимированная подсветка */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div 
          className={`mt-16 text-center transition-all duration-1000 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="glass rounded-2xl px-6 py-4 inline-block">
            <p className="text-white/50 text-sm">
              Используйте клавиши ←/→ для навигации • ESC для закрытия • I для информации
            </p>
          </div>
        </div>
      </div>

      {/* Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-blue-400/50 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-purple-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 w-px h-20 bg-gradient-to-t from-cyan-400/40 to-transparent"></div>
      </div>
    </div>
  );
}