from PIL import Image
import numpy as np

def encrypt_image(image_path, key):
    # Open the image
    img = Image.open(image_path)
    img_array = np.array(img)

    # Encrypt the image
    encrypted_array = (img_array + key) % 256
    encrypted_img = Image.fromarray(encrypted_array.astype('uint8'))

    # Save the encrypted image
    encrypted_img.save("encrypted_image.png")
    print("Image encrypted and saved as 'encrypted_image.png'")

def decrypt_image(encrypted_image_path, key):
    # Open the encrypted image
    encrypted_img = Image.open(encrypted_image_path)
    encrypted_array = np.array(encrypted_img)

    # Decrypt the image
    decrypted_array = (encrypted_array - key) % 256
    decrypted_img = Image.fromarray(decrypted_array.astype('uint8'))

    # Save the decrypted image
    decrypted_img.save("decrypted_image.png")
    print("Image decrypted and saved as 'decrypted_image.png'")

if __name__ == "__main__":
    # Example usage
    key = 50  # This is a simple key for demonstration. You can choose any integer value.

    # Encrypt the image
    encrypt_image("C://Users//hp//OneDrive//Documents//prateek//Desktop//p.jpg", key)

    # Decrypt the image
    decrypt_image("encrypted_image.png", key)
