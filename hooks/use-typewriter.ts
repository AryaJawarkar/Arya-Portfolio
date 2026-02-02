import { number } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypeWriter {
    words: string[];
    typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}

const useTypewriter = (
  {words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1500}: TypeWriter
) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words?.[wordIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting && text.length < currentWord?.length) {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && text.length === currentWord?.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && text.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return text;
};

export default useTypewriter;
