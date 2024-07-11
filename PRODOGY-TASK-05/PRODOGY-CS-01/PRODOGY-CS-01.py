def caesar_cipher_encrypt(text, shift):
    encrypted_text = ""
    for char in text:
        if char.isalpha():
            shift_base = 65 if char.isupper() else 97
            encrypted_text += chr((ord(char) - shift_base + shift) % 26 + shift_base)
        else:
            encrypted_text += char
    return encrypted_text

def caesar_cipher_decrypt(text, shift):
    return caesar_cipher_encrypt(text, -shift)

def main():
    while True:
        choice = input("Do you want to (e)ncrypt or (d)ecrypt or (q)uit?: ").lower()
        if choice == 'q':
            break
        if choice not in ['e', 'd']:
            print("Invalid choice! Please enter 'e', 'd', or 'q'.")
            continue

        message = input("Enter your message: ")
        shift = int(input("Enter the shift value: "))

        if choice == 'e':
            result = caesar_cipher_encrypt(message, shift)
        else:
            result = caesar_cipher_decrypt(message, shift)

        print(f"Result: {result}\n")

if __name__ == "__main__":
    main()
