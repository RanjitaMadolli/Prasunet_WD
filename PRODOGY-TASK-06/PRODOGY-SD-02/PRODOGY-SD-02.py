import random

def main():
    # Generate a random number between 1 and 100
    number_to_guess = random.randint(1, 100)
    attempts = 0
    guess = None

    print("I have generated a random number between 1 and 100.")
    print("Can you guess what it is?")

    while guess != number_to_guess:
        try:
            # Prompt the user to enter their guess
            guess = int(input("Enter your guess: "))
            attempts += 1

            if guess < number_to_guess:
                print("Your guess is too low. Try again.")
            elif guess > number_to_guess:
                print("Your guess is too high. Try again.")
            else:
                print(f"Congratulations! You've guessed the number {number_to_guess} correctly in {attempts} attempts.")
        except ValueError:
            print("Invalid input. Please enter an integer.")

if __name__ == "__main__":
    main()
