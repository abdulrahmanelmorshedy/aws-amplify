import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Zap, Moon, Sun } from 'lucide-react';

const appConfig = {
  "title": "✨ Light & Tricks ✨",
  "buttons": [
    {
      "id": "main-light",
      "label": "Lights",
      "icon": "Lightbulb",
      "states": {
        "off": {
          "text": "Lights OFF",
          "bgColor": "bg-gray-700",
          "textColor": "text-white",
          "shadow": ""
        },
        "on": {
          "text": "Lights ON",
          "bgColor": "bg-yellow-400",
          "textColor": "text-gray-900",
          "shadow": "shadow-yellow-400/50"
        }
      },
      "effect": "spotlight",
      "backgroundColor": "bg-yellow-50"
    },
    {
      "id": "disco",
      "label": "Disco",
      "icon": "Zap",
      "states": {
        "off": {
          "text": "Disco Mode",
          "bgColor": "bg-gray-700",
          "textColor": "text-white",
          "shadow": ""
        },
        "on": {
          "text": "Disco ON",
          "bgColor": "bg-purple-600",
          "textColor": "text-white",
          "shadow": "shadow-purple-600/50"
        }
      },
      "effect": "disco",
      "colors": ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
      "interval": 200
    },
    {
      "id": "sparkles",
      "label": "Magic Sparkles",
      "icon": "Sparkles",
      "bgColor": "bg-gradient-to-br from-pink-500 to-purple-600",
      "textColor": "text-white",
      "shadow": "hover:shadow-pink-500/50",
      "effect": "sparkles",
      "duration": 1000,
      "count": 20
    },
    {
      "id": "dark-mode",
      "label": "Mode",
      "icon": "Moon",
      "states": {
        "off": {
          "text": "Day Mode",
          "icon": "Sun",
          "bgColor": "bg-orange-400",
          "textColor": "text-gray-900",
          "shadow": "shadow-orange-400/50"
        },
        "on": {
          "text": "Night Mode",
          "icon": "Moon",
          "bgColor": "bg-indigo-900",
          "textColor": "text-white",
          "shadow": "shadow-indigo-900/50"
        }
      },
      "effect": "darkMode",
      "backgroundColor": "bg-gray-900"
    }
  ],
  "messages": {
    "default": "Click a button to start! 🚀",
    "spotlight": "Move your mouse around to control the spotlight! ✨",
    "disco": "Feel the rhythm! 🎵",
    "darkMode": "Peaceful night mode 🌙"
  }
};

const iconMap = {
  Lightbulb,
  Sparkles,
  Zap,
  Moon,
  Sun
};

export default function App() {
  const [activeEffects, setActiveEffects] = useState({});
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [showSparkles, setShowSparkles] = useState(false);
  const [discoColor, setDiscoColor] = useState('#ff0000');

  const discoConfig = appConfig.buttons.find(b => b.id === 'disco');

  useEffect(() => {
    let interval;
    if (activeEffects.disco) {
      interval = setInterval(() => {
        const colors = discoConfig.colors;
        setDiscoColor(colors[Math.floor(Math.random() * colors.length)]);
      }, discoConfig.interval);
    }
    return () => clearInterval(interval);
  }, [activeEffects.disco]);

  const handleMouseMove = (e) => {
    if (activeEffects.spotlight) {
      setSpotlight({ x: e.clientX, y: e.clientY });
    }
  };

  const handleButtonClick = (button) => {
    if (button.effect === 'sparkles') {
      const sparklesConfig = appConfig.buttons.find(b => b.id === 'sparkles');
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), sparklesConfig.duration);
    } else if (button.states) {
      const newState = !activeEffects[button.effect];
      setActiveEffects({
        [button.effect]: newState
      });
    }
  };

  const getBackgroundClass = () => {
    if (activeEffects.darkMode) return appConfig.buttons.find(b => b.effect === 'darkMode').backgroundColor;
    if (activeEffects.disco) return '';
    if (activeEffects.spotlight) return appConfig.buttons.find(b => b.effect === 'spotlight').backgroundColor;
    return 'bg-gray-800';
  };

  const getMessage = () => {
    if (activeEffects.spotlight) return appConfig.messages.spotlight;
    if (activeEffects.disco) return appConfig.messages.disco;
    if (activeEffects.darkMode && !activeEffects.spotlight && !activeEffects.disco) return appConfig.messages.darkMode;
    return appConfig.messages.default;
  };

  const getButtonState = (button) => {
    if (!button.states) return null;
    return activeEffects[button.effect] ? button.states.on : button.states.off;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${getBackgroundClass()}`}
      style={activeEffects.disco ? { backgroundColor: discoColor } : {}}
    >
      {activeEffects.spotlight && !activeEffects.disco && (
        <div
          className="pointer-events-none fixed w-96 h-96 rounded-full opacity-30 blur-3xl transition-all duration-100"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,150,0.8) 0%, transparent 70%)',
            left: spotlight.x - 192,
            top: spotlight.y - 192,
          }}
        />
      )}

      {showSparkles && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(appConfig.buttons.find(b => b.id === 'sparkles').count)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              <Sparkles className="text-yellow-400" size={24} />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <h1
          className={`text-5xl font-bold mb-12 transition-all duration-500 ${
            activeEffects.darkMode || (!activeEffects.spotlight && !activeEffects.disco) ? 'text-white' : 'text-gray-800'
          }`}
        >
          {appConfig.title}
        </h1>

        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
          {appConfig.buttons.map((button) => {
            const state = getButtonState(button);
            const IconComponent = iconMap[state?.icon || button.icon];
            const bgColor = state?.bgColor || button.bgColor;
            const textColor = state?.textColor || button.textColor;
            const shadow = state?.shadow || button.shadow || '';
            const text = state?.text || button.label;

            return (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button)}
                className={`p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 ${bgColor} ${textColor} ${shadow}`}
              >
                <IconComponent size={48} className="mx-auto mb-3" />
                <span className="text-xl font-semibold">{text}</span>
              </button>
            );
          })}
        </div>

        <p
          className={`mt-12 text-center text-lg ${
            activeEffects.darkMode || (!activeEffects.spotlight && !activeEffects.disco) ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {getMessage()}
        </p>

        <div className={`mt-8 text-center ${
          activeEffects.darkMode || (!activeEffects.spotlight && !activeEffects.disco) ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-sm font-semibold">Made with by Team2</p>
        </div>
      </div>
    </div>
  );
}
