const grid = document.getElementById('grid');

for (let i = 0; i < 15 * 15; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => {
        cell.innerHTML = cell.innerHTML === "<img src='/brand/TdA_Ikonky/SVG/X/X_cervene.svg' width='10' height='10'>" ? "<img src='/brand/TdA_Ikonky/SVG/O/O_modre.svg' width='10' height='10'>" : "<img src='/brand/TdA_Ikonky/SVG/O/O_modre.svg' width='10' height='10'>";
    });
    grid.appendChild(cell);
}
