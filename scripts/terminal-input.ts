import { stdin, stdout } from 'node:process';
import { emitKeypressEvents } from 'node:readline';

export function askHidden(prompt: string): Promise<string> {
  stdout.write(prompt);
  emitKeypressEvents(stdin);
  const wasRaw = stdin.isRaw;
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let answer = '';
    function finish(error?: Error) {
      stdin.off('keypress', onKeypress);
      stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
      stdout.write('\n');
      if (error) reject(error);
      else resolve(answer);
    }
    function onKeypress(character: string, key: { name?: string; ctrl?: boolean; meta?: boolean }) {
      if (key.ctrl && (key.name === 'c' || key.name === 'd')) return finish(new Error('Dibatalkan.'));
      if (key.name === 'return' || key.name === 'enter') return finish();
      if (key.name === 'backspace') answer = answer.slice(0, -1);
      else if (character && !key.ctrl && !key.meta && key.name !== 'escape') answer += character;
    }
    stdin.on('keypress', onKeypress);
  });
}
