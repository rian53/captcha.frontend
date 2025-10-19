import React, { useRef, useEffect, useCallback, useState } from "react";
import { convertEmojisToHTML } from "@/lib/emojiUtils";

const saveCaretPosition = (el) => {
  const sel = window.getSelection();
  if (!sel || !sel.anchorNode) return 0;
  let pos = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    if (n === sel.anchorNode) return pos + sel.anchorOffset;
    pos += n.textContent.length;
  }
  return pos;
};

const restoreCaretPosition = (el, pos) => {
  const sel = window.getSelection();
  const range = document.createRange();
  let curr = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    const next = curr + n.textContent.length;
    if (pos <= next) {
      range.setStart(n, pos - curr);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    curr = next;
  }
  // fallback end
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
};

const setCaretToEnd = (el) => {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

export default function EmojiTextarea({ value, onChange, placeholder, inputRef, onKeyDown }) {
  const divRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const updateContent = useCallback((text, forceEndCaret = false) => {
    if (!divRef.current) return;
    const caret = forceEndCaret ? null : saveCaretPosition(divRef.current);
    divRef.current.innerHTML = convertEmojisToHTML(text);
    forceEndCaret ? setCaretToEnd(divRef.current) : restoreCaretPosition(divRef.current, caret);
    setIsEmpty(!text);
  }, []);

  const handleInput = useCallback(() => {
    if (!divRef.current) return;
    const plain = divRef.current.textContent || "";
    onChange(plain);
    // Não atualiza o conteúdo aqui para evitar loop infinito
    setIsEmpty(!plain);
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    // Chamar o handler externo se fornecido
    if (onKeyDown) {
      onKeyDown(e);
    }
  }, [onKeyDown]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const clip = e.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, clip);
    requestAnimationFrame(() => {
      const plain = divRef.current.textContent || "";
      onChange(plain);
      updateContent(plain, true);
    });
  }, [onChange, updateContent]);

  useEffect(() => updateContent(value || ""), [value, updateContent]);

  useEffect(() => {
    const div = divRef.current;
    const click = (e) => {
      if (e.target.classList.contains("emoji")) {
        const r = document.createRange();
        r.setStartAfter(e.target);
        r.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        div.focus();
      }
    };
    div.addEventListener("click", click);
    return () => div.removeEventListener("click", click);
  }, []);

  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      document.querySelectorAll(".emoji").forEach((sp) => {
        if (!sel.isCollapsed && range.intersectsNode(sp)) sp.classList.add("selected");
        else sp.classList.remove("selected");
      });
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  useEffect(() => {
    if (!inputRef) return;
    inputRef.current = {
      element: divRef.current,
      insertEmoji: (emoji) => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          sel.getRangeAt(0).insertNode(document.createTextNode(emoji));
        } else {
          divRef.current.appendChild(document.createTextNode(emoji));
        }
        divRef.current.normalize();
        const plain = divRef.current.textContent || "";
        onChange(plain);
        updateContent(plain, true);
      },
      focus: () => divRef.current?.focus(),
      get value() { 
        return divRef.current ? divRef.current.textContent || "" : "";
      },
      set value(val) {
        if (divRef.current) {
          updateContent(val || "", true);
        }
      },
      get selectionStart() {
        return divRef.current ? saveCaretPosition(divRef.current) : 0;
      },
      get selectionEnd() {
        return divRef.current ? saveCaretPosition(divRef.current) : 0;
      },
      setSelectionRange: (start, end) => {
        if (divRef.current) {
          restoreCaretPosition(divRef.current, start);
        }
      },
      addEventListener: (event, handler) => {
        if (divRef.current) {
          divRef.current.addEventListener(event, handler);
        }
      },
      removeEventListener: (event, handler) => {
        if (divRef.current) {
          divRef.current.removeEventListener(event, handler);
        }
      },
      dispatchEvent: (event) => {
        if (divRef.current) {
          divRef.current.dispatchEvent(event);
        }
      }
    };
  }, [inputRef, onChange, updateContent]);

  return (
    <div style={{ position: "relative" }}>
      {isEmpty && placeholder && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            opacity: 0.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {placeholder}
        </div>
      )}
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        style={{
          minHeight: "40px",
          outline: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />
    </div>
  );
}
