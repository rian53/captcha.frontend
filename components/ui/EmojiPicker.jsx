import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Smile, Rabbit, Lightbulb, AppleIcon, Earth, Flag, Gamepad2, BadgeInfo, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Virtuoso } from 'react-virtuoso';
import { getEmojiUrl } from "@/lib/emojiUtils"; // ✅ importa o util centralizado

const EmojiPicker = ({ 
  onEmojiSelect, 
  children, 
  className,
  disabled = false,
  align = "start",
  side = "bottom",
  sideOffset = 4
}) => {
  const [open, setOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const virtuosoRef = useRef(null);
  const isScrollingRef = useRef(false);

  const [recentEmojis, setRecentEmojis] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('emoji-picker-recents');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const addToRecentEmojis = useCallback((emojiUnicode) => {
    setRecentEmojis(current => {
      const filtered = current.filter(emoji => emoji !== emojiUnicode);
      const updated = [emojiUnicode, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('emoji-picker-recents', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar emoji recente:', err);
      }
      return updated;
    });
  }, []);
  const basicEmojis = useMemo(() => ({
    faces: ['😀','😃','😄','😁','😆','😅','😊','😇','🙂','🙃','😉','😌','😍','😘','😗','😙','😚','😋','😛','😝','😜','😎','🙂','😏','😒','🙂','😞','😔','😟','🙁','😣','😖','😫','😩','😭','😤','😠','😡','😳','😶','😱','😨','😰','😥','😓','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','😪','😮','💨','😵','😵','💫','😷','😈','👿','👹','👺','💩','👻','💀','👽','👾','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾','👐','🙌','👏','👍','👎','👊','✊','✊','👊','🙏','💅','💪','👤','👥','👶','👦','👧','👩','👨','👱','👱','👱','👵','👴','👲','👰','🎓','🏫','🌾','🍳','🔧','🏭','💼','🔬','💻','🎤','🎨','🚀','🚒','👮','💂','👷','👸','🙍','🙎','🙅','🙆','💁','🙋','🙇','🚶','🏃','💃','🕺','🏄','🚣','🚴','🚵','👚','👕','👖','👔','👗','👙','👘','👠','👡','👢','👞','👟','🎩','👒','🎓','👑','💍','👝','👛','👜','💼','🎒','👓','🌂'],
    animals: ['🐶','🐱','🐭','🐹','🐰','🐻','🐼','🐻','🐨','🐯','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🐦','🐺','🐗','🐴','🐝','🐛','🐌','🐞','🐜','🐢','🐍','🐙','🐡','🐠','🐟','🐬','🐳','🐋','🐊','🐅','🐆','🐘','🐪','🐫','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🐐','🐕','🐩','🐕','🐈','🐈','🐓','🐇','🐁','🐀','🐾','🐉','🐲','🐦','🔥','🌵','🎄','🌲','🌳','🌴','🌱','🌿','🍀','🎍','🎋','🍃','🍂','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','💫','🌟','✨','⚡','💥','🔥','🌈','⛅','⛄','💨','💧','💦','🌊'],
    food: ['🍏','🍎','🍐','🍊','🍋','🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🍍','🍅','🍆','🌽','🍠','🍞','🍳','🍗','🍖','🌭','🍔','🍟','🍕','🌮','🌯','🍝','🍜','🍲','🍛','🍣','🍱','🍤','🍙','🍚','🍘','🍥','🍢','🍡','🍧','🍨','🍦','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🍯','🍼','🍵','🍶','🍺','🍻','🍷','🍸','🍹','🍾','🍴'],
    travel: ['🚗','🚕','🚙','🚌','🚎','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🛴','🚲','🛵','🛺','🛞','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','🛫','🛬','💺','🛸','🚁','🛶','⛵','🚤','🚢','🛟','⚓','⛽','🚧','🚦','🚥','🚏','🗿','🗽','🗼','🏰','🏯','🎡','🎢','🎠','⛲','🌋','🗻','⛺','🛖','🏠','🏡','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','⛪','🕌','🕍','🛕','🕋','🗾','🎑','🌅','🌄','🌠','🎇','🎆','🌇','🌆','🌃','🌌','🌉','🌁'],
    activities: ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🏒','🏑','🏏','⛳','🛝','🏹','🎣','🎽','🛹','🛼','🛷','🎿','🏂','🏇','🏄','🏊','🏊','🏊','🚣','🚣','🚣','🚵','🚵','🚵','🚴','🚴','🚴','🏆','🏅','🎫','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🎷','🎺','🎸','🎻','🎲','🎯','🎳','🎮','🎰'],
    objects: ['📱','📲','💻','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📞','📟','📠','📺','📻','📡','🔋','🔌','💡','🔦','💸','💵','💴','💶','💷','💰','💳','💎','🔧','🔨','🔩','💥','🔫','💣','🔪','🚬','🏺','🔮','📿','💈','🔭','🔬','💊','💉','🚽','🚰','🚿','🛁','🛀','🔑','🚪','🛌','🛒','🎁','🎈','🎏','🎀','📅','📇','📋','📁','📂','📰','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🔗','📎','📐','📏','📌','📍','📝','🔍','🔎','🔏','🔐','🔒','🔓'],
    symbols: ['💛','💚','💙','💜','🖤','❤️','💔','🔥','💕','💞','💓','💗','💖','💘','💝','💟','🔯','🕎','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','📴','📳','💮','❌','🛑','⛔','📛','🚫','💯','💢','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','🔅','🔆','🚸','🔱','🔰','✅','💹','❎','🌐','💠','🌀','💤','🏧','🚾','♿','🛗','🛂','🛃','🛄','🛅','🛜','🚹','🚺','🚼','🚻','🚮','🎦','📶','🎴','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'],
    flags: ['🏴','🏴','🏁','🚩','🌈','🇺🇳','🇦🇫','🇦🇱','🇦🇹','🇦🇺','🇦🇼','🇦🇲','🇦🇷','🇦🇬','🇦🇶','🇦🇮','🇦🇴','🇦🇩','🇦🇸','🇩🇿','🇦🇿','🇧🇸','🇧🇭','🇧🇩','🇧🇧','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇲','🇧🇹','🇧🇴','🇮🇨','🇨🇦','🇨🇲','🇰🇭','🇧🇮','🇧🇫','🇧🇬','🇧🇳','🇻🇬','🇧🇷','🇧🇼','🇧🇦','🇨🇻','🇧🇶','🇰🇾','🇨🇫','🇹🇩','🇮🇴','🇨🇱','🇨🇳','🇨🇽','🇨🇨','🇨🇴','🇰🇲','🇩🇯','🇩🇰','🇨🇿','🇨🇾','🇨🇼','🇨🇺','🇭🇷','🇨🇮','🇨🇷','🇨🇰','🇨🇩','🇨🇬','🇩🇲','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇸🇿','🇪🇹','🇪🇺','🇫🇰','🇬🇭','🇩🇪','🇬🇪','🇬🇲','🇬🇦','🇹🇫','🇵🇫','🇬🇫','🇫🇷','🇫🇮','🇫🇯','🇫🇴','🇬🇮','🇬🇷','🇬🇱','🇬🇩','🇬🇵','🇬🇺','🇬🇹','🇬🇬','🇬🇳','🇬🇼','🇬🇾','🇭🇹','🇮🇹','🇮🇱','🇮🇲','🇮🇪','🇮🇶','🇮🇷','🇮🇩','🇮🇳','🇮🇸','🇭🇺','🇭🇰','🇭🇳','🇯🇲','🇯🇵','🎌','🇯🇪','🇯🇴','🇰🇿','🇰🇪','🇰🇮','🇽🇰','🇰🇼','🇰🇬','🇱🇦','🇲🇾','🇲🇼','🇲🇬','🇲🇴','🇱🇺','🇱🇹','🇱🇮','🇱🇾','🇱🇷','🇱🇸','🇱🇧','🇱🇻','🇲🇻','🇲🇱','🇲🇹','🇲🇭','🇲🇶','🇲🇷','🇲🇺','🇾🇹','🇲🇽','🇫🇲','🇲🇩','🇲🇨','🇳🇿','🇳🇨','🇳🇱','🇳🇵','🇳🇷','🇳🇦','🇲🇲','🇲🇿','🇲🇦','🇲🇸','🇲🇪','🇲🇳','🇳🇮','🇳🇪','🇳🇺','🇳🇫','🇰🇵','🇲🇰','🇲🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇼','🇷🇪','🇶🇦','🇵🇷','🇵🇹','🇵🇱','🇵🇳','🇵🇭','🇵🇪','🇵🇾','🇵🇬','🇵🇦','🇵🇸','🇷🇴','🇷🇺','🇷🇼','🇼🇸','🇸🇲','🇸🇹','🇸🇦','🇸🇳','🇷🇸','🇸🇨','🇸🇱','🇸🇬','🇧🇱','🇱🇰','🇸🇸','🇰🇷','🇿🇦','🇸🇴','🇸🇧','🇬🇸','🇸🇮','🇸🇰','🇸🇽','🇸🇭','🇰🇳','🇱🇨','🇵🇲','🇻🇨','🇸🇩','🇸🇷','🇸🇪','🇨🇭','🇸🇾','🇹🇼','🇹🇯','🇹🇻','🇹🇨','🇹🇲','🇹🇷','🇹🇳','🇹🇴','🇹🇰','🇹🇬','🇹🇱','🇹🇭','🇹🇿','🇻🇮','🇺🇬','🇺🇦','🇦🇪','🇬🇧','🏴','🏴','🏴','🇺🇸','🏴','🇺🇾','🇺🇿','🇿🇼','🇿🇲','🇾🇪','🇪🇭','🇼🇫','🇻🇳','🇻🇪','🇻🇦','🇻🇺']
  }), []);

  const virtualizedData = useMemo(() => {
    const categories = {
      recent: { name: 'Recentes', icon: Clock, emojis: [] },
      faces: { name: 'Rostos', icon: Smile, emojis: [] },
      animals: { name: 'Animais', icon: Rabbit, emojis: [] },
      food: { name: 'Comida', icon: AppleIcon, emojis: [] },
      travel: { name: 'Viagem', icon: Earth, emojis: [] },
      activities: { name: 'Atividades', icon: Gamepad2, emojis: [] },
      objects: { name: 'Objetos', icon: Lightbulb, emojis: [] },
      symbols: { name: 'Símbolos', icon: BadgeInfo, emojis: [] },
      flags: { name: 'Bandeiras', icon: Flag, emojis: [] }
    };
    const categoryOrder = Object.keys(categories);
    if (recentEmojis.length > 0) {
      recentEmojis.forEach(e => categories.recent.emojis.push({ unicode: e, name: e }));
    }
    Object.keys(basicEmojis).forEach(cat => {
      basicEmojis[cat].forEach(emoji => {
        if (!searchTerm || emoji.includes(searchTerm)) {
          categories[cat].emojis.push({ unicode: emoji, name: emoji });
        }
      });
    });
    const virtualItems = [], categoriesMap = {}, categoryRanges = {};
    let currentIndex = 0;
    categoryOrder.forEach(key => {
      const cat = categories[key];
      if (cat.emojis.length === 0) return;
      const start = currentIndex;
      virtualItems.push({ type: 'header', categoryKey: key, categoryName: cat.name, index: currentIndex++ });
      for (let i = 0; i < cat.emojis.length; i += 10) {
        virtualItems.push({ type: 'row', emojis: cat.emojis.slice(i, i+10), categoryKey: key, index: currentIndex++ });
      }
      categoriesMap[key] = start;
      categoryRanges[key] = { start, end: currentIndex-1 };
    });
    return { categories, categoryOrder, virtualItems, categoriesMap, categoryRanges, total: virtualItems.length };
  }, [recentEmojis, searchTerm, basicEmojis]);

  const handleRangeChanged = useCallback(range => {
    if (!range || isScrollingRef.current) return;
    const mid = Math.floor((range.startIndex + range.endIndex) / 2);
    for (const [key, r] of Object.entries(virtualizedData.categoryRanges)) {
      if (mid >= r.start && mid <= r.end) {
        if (currentCategory !== key) setCurrentCategory(key);
        break;
      }
    }
  }, [currentCategory, virtualizedData.categoryRanges]);

  const scrollToCategory = useCallback(key => {
    const index = virtualizedData.categoriesMap[key];
    if (index !== undefined && virtuosoRef.current) {
      isScrollingRef.current = true;
      virtuosoRef.current.scrollToIndex({ index, align: 'start' });
      setCurrentCategory(key);
      setTimeout(() => isScrollingRef.current = false, 500);
    }
  }, [virtualizedData.categoriesMap]);

  const handleEmojiSelect = useCallback((emoji, event) => {
    // Parar propagação do evento para evitar fechar o modal pai
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    addToRecentEmojis(emoji.unicode);
    onEmojiSelect?.(emoji.unicode);
    
    // Fechar o popover após selecionar o emoji
    setOpen(false);
  }, [onEmojiSelect, addToRecentEmojis]);

  const EmojiButton = useCallback(({ emoji }) => {
    const url = getEmojiUrl(emoji.unicode);
    return (
      <button 
        onClick={(e) => {
          handleEmojiSelect(emoji, e);
        }} 
        className="h-8 w-8 flex items-center justify-center hover:bg-accent/80 rounded transition"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: '24px 24px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        title={emoji.name}
      />
    );
  }, [handleEmojiSelect]);
  const renderVirtualItem = useCallback(index => {
    const item = virtualizedData.virtualItems[index];
    if (item.type === 'header') {
      return (
        <div key={`header-${item.categoryKey}`} className="px-3 py-2 text-sm font-medium sticky top-0 z-10 bg-background">
          {item.categoryName}
        </div>
      );
    }
    if (item.type === 'row') {
      return (
        <div key={`row-${item.categoryKey}-${index}`} className="flex gap-1 p-2">
          {item.emojis.map(emoji => <EmojiButton key={emoji.unicode} emoji={emoji} />)}
        </div>
      );
    }
    return null;
  }, [virtualizedData.virtualItems, EmojiButton]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          React.cloneElement(children, {
            onClick: () => setOpen(!open),
            ...children.props
          })
        ) : (
          <Button variant="ghost" size="sm"
            className={cn("h-8 w-8 p-0", className)}
            disabled={disabled}
            onClick={() => setOpen(!open)}>
            <Smile className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 max-h-[500px]" 
        align={align} 
        side={side} 
        sideOffset={sideOffset} 
        onOpenAutoFocus={e => e.preventDefault()}
        onPointerDownOutside={(e) => {
          // Evitar fechar se clicar em um emoji
          const target = e.target;
          if (target && target.closest) {
            const emojiButton = target.closest('button[title]');
            if (emojiButton) {
              e.preventDefault();
              return;
            }
          }
          setOpen(false);
        }}
        onEscapeKeyDown={() => setOpen(false)}
      >
        <Command>
          <div className="p-3 flex justify-between">
            {virtualizedData.categoryOrder.map(key => {
              const CatIcon = virtualizedData.categories[key].icon;
              const active = currentCategory === key;
              return (
                <button key={key} className="h-8 w-8 flex justify-center relative" onClick={() => scrollToCategory(key)}>
                  <CatIcon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground hover:text-foreground")} />
                  {active && <motion.div className="absolute top-6 h-0.5 w-6 bg-primary rounded" layoutId="activeEmojiCategory" />}
                </button>
              );
            })}
          </div>
          <div className="py-1 px-2">
            <Input placeholder="Buscar emojis..." value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 rounded-full"/>
          </div>
          <div className="max-h-80 min-h-80">
            {virtualizedData.virtualItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Nenhum emoji encontrado</div>
            ) : (
              <Virtuoso
                ref={virtuosoRef}
                totalCount={virtualizedData.virtualItems.length}
                itemContent={renderVirtualItem}
                className="h-80"
                style={{ height: '320px' }}
                rangeChanged={handleRangeChanged}
              />
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
