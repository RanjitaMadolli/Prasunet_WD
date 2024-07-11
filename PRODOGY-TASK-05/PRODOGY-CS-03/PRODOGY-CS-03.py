import re

def evaluate_password_strength(password):
    length_criteria = len(password) >= 8
    lowercase_criteria = re.search(r"[a-z]", password) is not None
    uppercase_criteria = re.search(r"[A-Z]", password) is not None
    number_criteria = re.search(r"\d", password) is not None
    special_character_criteria = re.search(r"[!@#$%^&*(),.?\":{}|<>]", password) is not None

    strength = 0
    if length_criteria:
        strength += 1
    if lowercase_criteria:
        strength += 1
    if uppercase_criteria:
        strength += 1
    if number_criteria:
        strength += 1
    if special_character_criteria:
        strength += 1

    if strength == 5:
        return "Strong", "Your password is strong."
    elif strength >= 3:
        return "Moderate", "Your password is moderate. Consider adding more diverse characters to increase its strength."
    else:
        return "Weak", "Your password is weak. Consider making it longer and including uppercase letters, numbers, and special characters."

if __name__ == "__main__":
    password = input("Enter your password: ")
    strength, feedback = evaluate_password_strength(password)
    print(f"Password Strength: {strength}")
    print(f"Feedback: {feedback}")
