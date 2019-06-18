interface HTMLCollection {
    [Symbol.iterator]: () => Iterator<HTMLElement>
}
interface NodeListOf<TNode> {
    [Symbol.iterator]: () => Iterator<TNode>
}

interface Shape extends JQuery<any> {
    is_blank?: boolean
}

(function () {
    const scene = $("#class-or-not");

    function create_grid(size: number) {
        size = Math.floor(size);
        size = size + (1 - size % 2);

        const grid_center = Math.round(size / 2) - 1;
        const grid_size = 1000;
        scene.attr("viewBox", `0 0 ${grid_size} ${grid_size}`);
        const item = {
            size: grid_size / size,
            center: (grid_size / size) / 2,
            padding: grid_size / size * 0.08
        }

        let grid: Shape[][] = [];
        for (let y = 0; y < size; ++y) {
            let line: Shape[] = [];
            grid.push(line);
            for (let x = 0; x < size; ++x) {
                let shape: Shape;

                let is_blank_desc = {
                    get: () => shape.hasClass("blank"),
                    set: (value: boolean) => { shape[value ? "addClass" : "removeClass"]("blank"); }
                }

                if (x !== y) {
                    // Circle
                    shape = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
                    scene.append(shape);
                    shape.attr({
                        cx: Math.round(x * item.size + item.center),
                        cy: Math.round(y * item.size + item.center),
                        r: Math.round((item.size - item.padding * 2) / 2)
                    })
                    
                }
                else {
                    // Rectangle
                    shape = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
                    scene.append(shape);

                    let coord = {
                        x: null as number,
                        y: null as number,
                        size: item.size - item.padding * 2
                    }

                    // Losange
                    if (x === grid_center) {
                        coord.size /= Math.sqrt(2);
                        const padding = (item.size - coord.size) / 2;
                        coord.x = x * item.size + padding;
                        coord.y = y * item.size + padding;
                        shape.attr("transform", `rotate(45 ${coord.x + coord.size / 2} ${coord.y + coord.size / 2})`);
                        is_blank_desc.set = (value) => {
                            shape[value ? "addClass" : "removeClass"]("blank");
                            for (let x2 = 0; x2 < size; ++x2) {
                                if (x2 === x) continue;
                                grid[y][x2].is_blank = !grid[y][x2].is_blank;
                            }
                            for (let y2 = 0; y2 < size; ++y2) {
                                if (y2 === y) continue;
                                grid[y2][x].is_blank = !grid[y2][x].is_blank;
                            }
                        }
                    }
                    else {
                        coord.x = x * item.size + item.padding;
                        coord.y = y * item.size + item.padding;
                        is_blank_desc.set = (value) => {
                            shape[value ? "addClass" : "removeClass"]("blank");
                            for (let x2 = 0; x2 < size; ++x2) {
                                if (x2 === x) continue;
                                grid[y][x2].is_blank = !grid[y][x2].is_blank;
                            }
                            for (let y2 = 0; y2 < size; ++y2) {
                                if (y2 === y) continue;
                                grid[y2][x].is_blank = value;
                            }
                        }
                    }
                    shape.attr({
                        x: coord.x,
                        y: coord.y,
                        width: coord.size,
                        height: coord.size
                    })
                }

                shape.click((ev) => {
                    shape.is_blank = !shape.is_blank;
                })
                console.log(shape.is_blank);
                Object.defineProperty(shape, "is_blank", is_blank_desc);
                line.push(shape);
            }
        }
    }

    create_grid(Math.random() * 10 + 10);

    const blank_btn = $("#all-blank");
    const black_btn = $("#all-black");

    blank_btn.click(() => {
        scene.children().addClass("blank");
    });
    black_btn.click(() => {
        $(".blank").removeClass("blank");
    });
})()