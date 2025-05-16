/**
 * python-examples.js
 * Contains example Python code snippets for both basic and advanced editors
 */

// Basic examples (for Skulpt - Python 2.x compatible)
const basicPythonExamples = [
    {
        id: "hello",
        title: "Hello World",
        code: `# Simple Hello World example
print("Hello, World!")
`
    },
    {
        id: "variables",
        title: "Variables & Data Types",
        code: `# Variables and basic data types
name = "Python Learner"
age = 25
height = 1.75
is_student = True

print("Name:", name)
print("Age:", age)
print("Height:", height, "meters")
print("Is student?", is_student)

# String concatenation (Python 2.x compatible)
print("Hello, " + name + "!")
`
    },
    {
        id: "conditionals",
        title: "Conditionals",
        code: `# Conditional statements
age = 18

if age < 13:
    print("Child")
elif age < 18:
    print("Teenager")
else:
    print("Adult")

# Nested conditionals and logical operators
has_license = True
if age >= 18:
    if has_license:
        print("You can drive")
    else:
        print("You need to get a license")
else:
    print("You're too young to drive")
`
    },
    {
        id: "loops",
        title: "Loops",
        code: `# For loop with range
print("Counting from 0 to 4:")
for i in range(5):
    print(i)

# Looping through a list
print("\\nLooping through a list:")
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("I like", fruit)

# While loop
print("\\nWhile loop example:")
count = 0
while count < 5:
    print("Count:", count)
    count += 1
`
    },
    {
        id: "functions",
        title: "Functions",
        code: `# Basic function definition
def greet(name):
    return "Hello, " + name + "!"

# Function with default parameter
def greet_with_time(name, time_of_day="day"):
    return "Good " + time_of_day + ", " + name + "!"

# Function calls
print(greet("Alice"))
print(greet_with_time("Bob", "morning"))
print(greet_with_time("Charlie"))

# Function with multiple parameters
def calculate_rectangle_area(length, width):
    return length * width

area = calculate_rectangle_area(5, 3)
print("Rectangle area:", area)
`
    }
];

// Advanced examples (for Pyodide - Modern Python 3.x)
const advancedPythonExamples = [
    {
        id: "fstrings",
        title: "Modern Python Syntax: F-strings",
        code: `# F-strings (formatted string literals) - Python 3.6+
name = "Alice"
age = 30
height = 1.75

# F-strings make string formatting much cleaner and more readable
print(f"My name is {name} and I am {age} years old.")
print(f"In 5 years, I'll be {age + 5} years old.")
print(f"My height is {height:.2f} meters.")

# F-strings can include expressions
print(f"Is my age even? {age % 2 == 0}")

# F-strings with dictionaries
person = {"name": "Bob", "job": "Developer"}
print(f"{person['name']} works as a {person['job']}.")

# Using repr format specifier
print(f"The variable name is {name!r}")
`
    },
    {
        id: "list_comprehensions",
        title: "List Comprehensions & Generator Expressions",
        code: `# List comprehensions provide a concise way to create lists
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Create a list of squares of even numbers
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(f"Squares of even numbers: {even_squares}")

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(f"Flattened matrix: {flattened}")

# Generator expressions - similar to list comprehensions but more memory-efficient
# as they generate values on-the-fly instead of creating a whole list in memory
gen = (x**2 for x in range(10))
print("Generator expression output:")
for i in gen:
    print(i, end=" ")

# Dictionary comprehension
word = "hello"
letter_count = {letter: word.count(letter) for letter in word}
print(f"\\nLetter count in '{word}': {letter_count}")
`
    },
    {
        id: "lambda",
        title: "Lambda Functions",
        code: `# Lambda functions are small anonymous functions defined with the lambda keyword
# Syntax: lambda arguments: expression

# Simple lambda functions
add = lambda x, y: x + y
square = lambda x: x**2

print(f"Add function: 5 + 3 = {add(5, 3)}")
print(f"Square function: 7² = {square(7)}")

# Using lambda with built-in functions
numbers = [1, 5, 3, 9, 7, 6]

# Sort a list using a lambda key function
sorted_numbers = sorted(numbers, key=lambda x: abs(5-x))  # Sort by distance from 5
print(f"Original list: {numbers}")
print(f"Sorted by distance from 5: {sorted_numbers}")

# Filter even numbers using lambda
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Even numbers: {even_numbers}")

# Map function with lambda to square all numbers
squared = list(map(lambda x: x**2, numbers))
print(f"Squared numbers: {squared}")
`
    },
    {
        id: "data_structures",
        title: "Advanced Data Structures",
        code: `# Advanced operations with lists, dictionaries, sets, and tuples

# ----- LISTS -----
# List methods and operations
fruits = ["apple", "banana", "cherry", "date"]
print("List operations:")
fruits.append("elderberry")  # Add to the end
fruits.insert(1, "blueberry")  # Insert at index
print(f"After adding: {fruits}")

removed = fruits.pop(2)  # Remove by index and return
print(f"Removed: {removed}")
print(f"After removal: {fruits}")

fruits.sort()  # Sort in-place
print(f"Sorted: {fruits}")

fruits.reverse()  # Reverse in-place
print(f"Reversed: {fruits}")

# List slicing
print(f"First two items: {fruits[:2]}")
print(f"Last two items: {fruits[-2:]}")
print(f"Every other item: {fruits[::2]}")
print(f"Reversed list: {fruits[::-1]}")

# ----- DICTIONARIES -----
print("\\nDictionary operations:")
person = {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "JavaScript", "SQL"]
}

# Dictionary methods
person["location"] = "New York"  # Add new key-value
print(f"Keys: {list(person.keys())}")
print(f"Values: {list(person.values())}")
print(f"Items: {list(person.items())}")

# Get with default value
print(f"Job: {person.get('job', 'Not specified')}")

# Dictionary comprehension with conditional
numbers = {x: x**2 for x in range(1, 6) if x % 2 == 0}
print(f"Even number squares: {numbers}")

# ----- SETS -----
print("\\nSet operations:")
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}

print(f"Union: {set_a | set_b}")  # or set_a.union(set_b)
print(f"Intersection: {set_a & set_b}")  # or set_a.intersection(set_b)
print(f"Difference: {set_a - set_b}")  # or set_a.difference(set_b)
print(f"Symmetric difference: {set_a ^ set_b}")  # or set_a.symmetric_difference(set_b)

# Set comprehension
even_squares = {x**2 for x in range(10) if x % 2 == 0}
print(f"Set of even squares: {even_squares}")

# ----- TUPLES -----
print("\\nTuple operations:")
# Tuples are immutable but can be used in creative ways
point = (10, 20)
x, y = point  # Unpacking
print(f"Unpacked coordinates: x={x}, y={y}")

# Named tuples for more readable code
from collections import namedtuple
Person = namedtuple('Person', ['name', 'age', 'job'])
p = Person('Bob', 35, 'Developer')
print(f"Named tuple: {p}")
print(f"Access by name: {p.name}, {p.age}, {p.job}")
`
    },
    {
        id: "oop",
        title: "Object-Oriented Programming",
        code: `# Object-Oriented Programming with Python

# ----- BASIC CLASS DEFINITION -----
class Animal:
    """A simple Animal class to demonstrate OOP concepts"""
    
    # Class attribute - shared by all instances
    species_count = 0
    
    def __init__(self, name, species):
        """Initialize with name and species"""
        self.name = name
        self.species = species
        Animal.species_count += 1
    
    # Instance method
    def make_sound(self):
        """Default sound method"""
        return "Some generic animal sound"
    
    # String representation
    def __str__(self):
        return f"{self.name} is a {self.species}"
    
    # Representation (useful for debugging)
    def __repr__(self):
        return f"Animal(name='{self.name}', species='{self.species}')"

# Creating instances
generic_animal = Animal("Generic", "Unknown")
print(generic_animal)
print(f"Sound: {generic_animal.make_sound()}")
print(f"Number of animals: {Animal.species_count}")

# ----- INHERITANCE -----
class Dog(Animal):
    """Dog class that inherits from Animal"""
    
    def __init__(self, name, breed):
        # Call parent's __init__
        super().__init__(name, "Dog")
        self.breed = breed
    
    # Override the parent method
    def make_sound(self):
        return "Woof!"
    
    # Additional method
    def fetch(self, item):
        return f"{self.name} is fetching {item}"

# Create a Dog instance
buddy = Dog("Buddy", "Golden Retriever")
print(f"\\n{buddy}")
print(f"Breed: {buddy.breed}")
print(f"Sound: {buddy.make_sound()}")
print(buddy.fetch("ball"))
print(f"Number of animals: {Animal.species_count}")

# ----- ENCAPSULATION -----
class BankAccount:
    """A class demonstrating encapsulation with private attributes"""
    
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance  # Protected attribute (convention)
        self.__account_number = "12345"  # Private attribute (name mangling)
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False
    
    def get_balance(self):
        return self._balance
    
    # Property decorator - allows access as if it's an attribute
    @property
    def balance(self):
        return self._balance

# Using the BankAccount class - IMPORTANT: Define account variable inside the code block
print("\\nEncapsulation example:")
my_account = BankAccount("Alice", 1000)
my_account.deposit(500)
print(f"Balance: ${my_account.get_balance()}")
print(f"Balance (via property): ${my_account.balance}")
# print(my_account.__account_number)  # This would raise an AttributeError

# ----- POLYMORPHISM -----
class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name, "Cat")
        self.color = color
    
    def make_sound(self):
        return "Meow!"

print("\\nPolymorphism example:")
animals = [Dog("Rex", "German Shepherd"), Cat("Whiskers", "Tabby")]

for animal in animals:
    # Polymorphism: the make_sound method behaves differently based on the actual object type
    print(f"{animal.name} says: {animal.make_sound()}")
`
    },
    {
        id: "error_handling",
        title: "Error Handling: Try-Except-Else-Finally",
        code: `# Comprehensive error handling with try-except-else-finally blocks

# ----- BASIC ERROR HANDLING -----
print("Basic error handling:")
try:
    # Code that might raise an exception
    x = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# ----- HANDLING MULTIPLE EXCEPTIONS -----
print("\\nHandling multiple exceptions:")
try:
    # This could raise different types of exceptions
    num = int("abc")
except ValueError:
    print("Invalid conversion to integer")
except (TypeError, ZeroDivisionError):
    print("Type error or division by zero")
except Exception as e:
    print(f"Some other error occurred: {e}")

# ----- USING ELSE AND FINALLY -----
print("\\nUsing else and finally clauses:")
try:
    value = int("42")
except ValueError:
    print("Not a valid integer")
else:
    # This runs if no exception occurs
    print(f"Conversion successful, value = {value}")
finally:
    # This always runs, regardless of whether an exception occurred
    print("This cleanup code always executes")

# ----- CUSTOM EXCEPTIONS -----
print("\\nCustom exception handling:")
class InvalidAgeError(Exception):
    """Exception raised when an invalid age is provided."""
    pass

def validate_age(age):
    if age < 0 or age > 120:
        raise InvalidAgeError(f"Age {age} is outside valid range (0-120)")
    return age

# Using the custom exception
try:
    validate_age(150)
except InvalidAgeError as e:
    print(f"Error: {e}")

# ----- CONTEXT MANAGERS -----
print("\\nUsing a context manager:")
try:
    # File handling with context manager
    with open("nonexistent_file.txt") as file:
        content = file.read()
except FileNotFoundError:
    print("The file does not exist")

# ----- TRY-EXCEPT AS AN EXPRESSION -----
print("\\nUsing exception handling as an expression:")
# Python 3.8+ allows try-except as an expression using the := operator
result = (
    int(value) 
    if (value := "42").isdigit() 
    else "not a number"
)
print(f"Result: {result}")

# ----- CATCHING AND RE-RAISING -----
print("\\nCatching and re-raising modified exception:")
try:
    # Catch, modify, and re-raise
    try:
        1 / 0
    except ZeroDivisionError:
        raise ValueError("Operation caused a division by zero")
except ValueError as e:
    print(f"Caught: {e}")
`
    },
    {
        id: "modules",
        title: "Modules & Importing",
        code: `# Working with modules and packages in Python

# ----- MATH MODULE -----
import math

print("Math module examples:")
print(f"Square root of 16: {math.sqrt(16)}")
print(f"Value of π: {math.pi}")
print(f"Ceiling of 4.3: {math.ceil(4.3)}")
print(f"Floor of 4.7: {math.floor(4.7)}")
print(f"5² = {math.pow(5, 2)}")
print(f"e^2 = {math.exp(2)}")
print(f"log₁₀(100) = {math.log10(100)}")

# ----- RANDOM MODULE -----
import random

print("\\nRandom module examples:")
print(f"Random float (0.0 to 1.0): {random.random()}")
print(f"Random integer from 1 to 10: {random.randint(1, 10)}")
print(f"Random choice from list: {random.choice(['red', 'green', 'blue'])}")

colors = ['red', 'green', 'blue', 'yellow', 'purple']
random.shuffle(colors)
print(f"Shuffled list: {colors}")
print(f"Random sample of 2 items: {random.sample(colors, 2)}")

# ----- DATETIME MODULE -----
import datetime

print("\\nDatetime module examples:")
now = datetime.datetime.now()
print(f"Current date and time: {now}")
print(f"Formatted date: {now.strftime('%Y-%m-%d')}")
print(f"Formatted time: {now.strftime('%H:%M:%S')}")

# Date arithmetic
future = now + datetime.timedelta(days=30)
print(f"Date 30 days from now: {future}")

# Create a specific date
specific_date = datetime.datetime(2023, 12, 31, 23, 59, 59)
print(f"New Year's Eve: {specific_date}")

# ----- JSON MODULE -----
import json

print("\\nJSON module examples:")
# Python object to JSON string
person = {
    'name': 'Alice',
    'age': 30,
    'city': 'New York',
    'skills': ['Python', 'JavaScript', 'SQL'],
    'active': True
}

# Convert Python object to JSON string
json_string = json.dumps(person, indent=2)
print("Python to JSON:")
print(json_string)

# Convert JSON string back to Python object
python_obj = json.loads(json_string)
print(f"\\nJSON to Python - Name: {python_obj['name']}, Age: {python_obj['age']}")

# ----- RE (REGULAR EXPRESSIONS) MODULE -----
import re

print("\\nRegular expressions examples:")
text = "Python was created in 1991 by Guido van Rossum. Python 3.9 was released in 2020."

# Search for a pattern
match = re.search(r'Python \d\.\d', text)
if match:
    print(f"Found pattern: {match.group()}")

# Find all matches
all_matches = re.findall(r'Python', text)
print(f"All matches: {all_matches}")

# Replace pattern
modified = re.sub(r'Python', 'PYTHON', text)
print(f"Modified text: {modified}")

# Split string by pattern
split_text = re.split(r'\.', text)
print(f"Split text: {split_text}")

# ----- OS MODULE -----
import os

print("\\nOS module examples:")
print(f"Current working directory: {os.getcwd()}")
print(f"List directory: {os.listdir('.')[:5]}") # Show first 5 entries

# Platform-independent path manipulation
print(f"Join path: {os.path.join('folder', 'subfolder', 'file.txt')}")
print(f"Split path: {os.path.split('/path/to/file.txt')}")
print(f"File extension: {os.path.splitext('file.txt')}")
`
    },
    {
        id: "fileio",
        title: "File I/O (Simulated)",
        code: `# File I/O Operations
# Note: In this browser environment, files are simulated in memory

# ----- WRITING TO FILES -----
# Write a text file
with open("example.txt", "w") as f:
    f.write("Hello, world!\\n")
    f.write("This is a sample file.\\n")
    f.write("Python file I/O is easy and powerful.\\n")

print("File written successfully!")

# Writing multiple lines at once
lines = [
    "Line 1: Python is great for data processing.\\n",
    "Line 2: It offers intuitive file handling.\\n",
    "Line 3: And much more!\\n"
]

with open("multiline.txt", "w") as f:
    f.writelines(lines)

# ----- READING FROM FILES -----
print("\\nReading entire file at once:")
with open("example.txt", "r") as f:
    content = f.read()
    print(content)

print("\\nReading line by line:")
with open("example.txt", "r") as f:
    for line in f:
        print(f"Line: {line.strip()}")

print("\\nReading with readlines():")
with open("multiline.txt", "r") as f:
    all_lines = f.readlines()
    print(f"Number of lines: {len(all_lines)}")
    print(f"First line: {all_lines[0].strip()}")

# ----- APPENDING TO FILES -----
with open("example.txt", "a") as f:
    f.write("This line was appended later.\\n")
    f.write("Append mode adds to the end of the file.\\n")

print("\\nFile after appending:")
with open("example.txt", "r") as f:
    print(f.read())

# ----- WORKING WITH BINARY FILES -----
# Binary files can be useful for non-text data
print("\\nWorking with binary data:")
data = bytes([65, 66, 67, 68, 69])  # ASCII values for ABCDE

with open("binary_file.bin", "wb") as f:
    f.write(data)

with open("binary_file.bin", "rb") as f:
    binary_data = f.read()
    print(f"Binary data (as bytes): {binary_data}")
    print(f"Decoded to ASCII: {binary_data.decode('ascii')}")

# ----- WORKING WITH JSON FILES -----
import json

# Writing JSON to a file
person = {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "Data Analysis", "Machine Learning"],
    "contact": {
        "email": "alice@example.com",
        "phone": "555-1234"
    }
}

with open("person.json", "w") as f:
    json.dump(person, f, indent=4)

print("\\nJSON file written successfully")

# Reading JSON from a file
with open("person.json", "r") as f:
    loaded_data = json.load(f)
    print(f"Name: {loaded_data['name']}")
    print(f"Skills: {', '.join(loaded_data['skills'])}")
    print(f"Email: {loaded_data['contact']['email']}")

# ----- LISTING FILES (SIMULATION) -----
print("\\nListing virtual files in our simulated filesystem:")

# This function is defined in our file system simulation
import builtins
# In a real Python environment, we'd use os.listdir() instead
try:
    files = list_virtual_files()
    for file in files:
        print(f"- {file}")
except:
    print("list_virtual_files function not available in this context")
`
    }
];

// Export the examples for use in other files
try {
    // Make sure examples are defined and exported
    if (typeof basicPythonExamples !== 'undefined' && typeof advancedPythonExamples !== 'undefined') {
        // Safely export to window object
        window.basicPythonExamples = basicPythonExamples;
        window.advancedPythonExamples = advancedPythonExamples;
        console.log("Python examples loaded successfully:", 
                    basicPythonExamples.length, "basic examples,", 
                    advancedPythonExamples.length, "advanced examples");
    } else {
        console.error("Python examples arrays not properly defined");
    }
} catch (e) {
    console.error("Failed to export Python examples:", e);
}