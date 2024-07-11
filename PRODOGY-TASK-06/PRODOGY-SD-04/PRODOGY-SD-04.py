def print_grid(grid):
    for row in grid:
        print(" ".join(str(num) if num != 0 else "." for num in row))


def is_valid(grid, row, col, num):
    # Check if 'num' is not in the current row, column, and 3x3 subgrid
    for i in range(9):
        if grid[row][i] == num or grid[i][col] == num:
            return False

    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if grid[start_row + i][start_col + j] == num:
                return False

    return True


def solve_sudoku(grid):
    for row in range(9):
        for col in range(9):
            if grid[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(grid, row, col, num):
                        grid[row][col] = num
                        if solve_sudoku(grid):
                            return True
                        grid[row][col] = 0
                return False
    return True


def main():
    sudoku_grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]

    print("Unsolved Sudoku Grid:")
    print_grid(sudoku_grid)

    if solve_sudoku(sudoku_grid):
        print("\nSolved Sudoku Grid:")
        print_grid(sudoku_grid)
    else:
        print("No solution exists for the given Sudoku puzzle.")


if __name__ == "__main__":
    main()
