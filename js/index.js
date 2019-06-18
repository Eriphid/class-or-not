"use strict";
(function () {
    const scene = document.getElementById("class-or-not");
    function create_grid(size) {
        size = Math.floor(size);
        size = size + (1 - size % 2);
        const grid_center = Math.round(size / 2) - 1;
        const grid_size = 1000;
        scene.setAttributeNS(null, "viewBox", `0 0 ${grid_size} ${grid_size}`);
        const item = {
            size: grid_size / size,
            center: (grid_size / size) / 2,
            padding: grid_size / size * 0.08
        };
        let grid = [];
        for (let y = 0; y < size; ++y) {
            let line = [];
            grid.push(line);
            for (let x = 0; x < size; ++x) {
                let shape;
                let is_blank_desc = {
                    get: () => shape.classList.contains("blank"),
                    set: (value) => shape.classList[value ? "add" : "remove"]("blank")
                };
                if (x !== y) {
                    // Circle
                    shape = scene.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
                    shape.setAttribute("cx", Math.round(x * item.size + item.center));
                    shape.setAttribute("cy", Math.round(y * item.size + item.center));
                    shape.setAttribute("r", Math.round((item.size - item.padding * 2) / 2));
                }
                else {
                    // Rectangle
                    shape = scene.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
                    let coord = {
                        x: null,
                        y: null,
                        size: item.size - item.padding * 2
                    };
                    // Losange
                    if (x === grid_center) {
                        coord.size /= Math.sqrt(2);
                        const padding = (item.size - coord.size) / 2;
                        coord.x = x * item.size + padding;
                        coord.y = y * item.size + padding;
                        shape.setAttribute("transform", `rotate(45 ${coord.x + coord.size / 2} ${coord.y + coord.size / 2})`);
                        is_blank_desc.set = (value) => {
                            shape.classList[value ? "add" : "remove"]("blank");
                            for (let x2 = 0; x2 < size; ++x2) {
                                if (x2 === x)
                                    continue;
                                grid[y][x2].is_blank = !grid[y][x2].is_blank;
                            }
                            for (let y2 = 0; y2 < size; ++y2) {
                                if (y2 === y)
                                    continue;
                                grid[y2][x].is_blank = !grid[y2][x].is_blank;
                            }
                        };
                    }
                    else {
                        coord.x = x * item.size + item.padding;
                        coord.y = y * item.size + item.padding;
                        is_blank_desc.set = (value) => {
                            shape.classList[value ? "add" : "remove"]("blank");
                            for (let x2 = 0; x2 < size; ++x2) {
                                if (x2 === x)
                                    continue;
                                grid[y][x2].is_blank = !grid[y][x2].is_blank;
                            }
                            for (let y2 = 0; y2 < size; ++y2) {
                                if (y2 === y)
                                    continue;
                                grid[y2][x].is_blank = value;
                            }
                        };
                    }
                    shape.setAttribute("x", coord.x);
                    shape.setAttribute("y", coord.y);
                    shape.setAttribute("width", coord.size);
                    shape.setAttribute("height", coord.size);
                }
                shape.addEventListener("click", (ev) => {
                    shape.is_blank = !shape.is_blank;
                });
                Object.defineProperty(shape, "is_blank", is_blank_desc);
                line.push(shape);
            }
        }
    }
    create_grid(Math.random() * 10 + 10);
    const blank_btn = document.getElementById("all-blank");
    const black_btn = document.getElementById("all-black");
    blank_btn.addEventListener("click", () => {
        for (let child of scene.children) {
            child.classList.add("blank");
        }
    });
    black_btn.addEventListener("click", () => {
        for (let child of scene.querySelectorAll(".blank")) {
            child.classList.remove("blank");
        }
    });
})();
