from setuptools import setup, find_packages

setup(
    name="roukaour_sudoku_solver",           # Name of your package
    version="1.0.0",                # Package version
    description="A simple Sudoku solver",
    author="roukaour",
    packages=find_packages(),       # Automatically find any subpackages
    py_modules=["sudoku", "board", "cell", "color", "strategies", "utils"],          # Include sudoku.py as a module
    install_requires=[],            # Any dependencies if needed
    entry_points={},
)
