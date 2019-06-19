"use strict";
(function () {
    const scene = $("#class-or-not");
    function shuffle(list) {
        for (let i = list.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * i);
            const tmp = list[i];
            list[i] = list[j];
            list[j] = tmp;
        }
        return list;
    }
    function create_grid(size) {
        size = Math.floor(size);
        size = size + (1 - size % 2);
        let grid = {
            size: size,
            center: Math.round(size / 2) - 1,
            viewbox_size: 80 * size,
            items: []
        };
        scene.attr("viewBox", `0 0 ${grid.viewbox_size} ${grid.viewbox_size}`);
        const item = {
            size: grid.viewbox_size / size,
            center: (grid.viewbox_size / size) / 2,
            padding: grid.viewbox_size / size * 0.08
        };
        for (let y = 0; y < size; ++y) {
            let line = [];
            grid.items.push(line);
            for (let x = 0; x < size; ++x) {
                let shape;
                let litted_desc = {
                    get: () => shape.hasClass("litted"),
                    set: (value) => { shape[value ? "addClass" : "removeClass"]("litted"); }
                };
                if (x !== y) {
                    // Circle
                    shape = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
                    scene.append(shape);
                    let coord = {
                        cx: Math.round(x * item.size + item.center),
                        cy: Math.round(y * item.size + item.center),
                        r: Math.round((item.size - item.padding * 2) / 2)
                    };
                    shape.attr(coord);
                    // shape.css("transform-origin", `${coord.cx}px ${coord.cy}px`);
                }
                else {
                    // Rectangle
                    shape = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
                    scene.append(shape);
                    let coord = {
                        x: null,
                        y: null,
                        size: item.size - item.padding * 2
                    };
                    // Losange
                    if (x === grid.center) {
                        coord.size /= Math.sqrt(2);
                        const padding = (item.size - coord.size) / 2;
                        coord.x = x * item.size + padding;
                        coord.y = y * item.size + padding;
                        litted_desc.set = (value) => {
                            shape[value ? "addClass" : "removeClass"]("litted");
                            let timeline = new TimelineLite();
                            const delay = 0.5 / size;
                            for (let x2 = 0; x2 < size; ++x2) {
                                const delta = Math.abs(x2 - x);
                                if (!delta)
                                    continue;
                                timeline.call(() => {
                                    grid.items[y][x2].litted = !grid.items[y][x2].litted;
                                }, null, null, delta * delay);
                            }
                            for (let y2 = 0; y2 < size; ++y2) {
                                const delta = Math.abs(y2 - y);
                                if (!delta)
                                    continue;
                                timeline.call(() => {
                                    grid.items[y2][x].litted = !grid.items[y2][x].litted;
                                }, null, null, delta * delay);
                            }
                        };
                        shape.css("transform-origin", `${coord.x + coord.size / 2}px ${coord.y + coord.size / 2}px`);
                        shape.attr("transform", `rotate(45)`);
                    }
                    else {
                        coord.x = x * item.size + item.padding;
                        coord.y = y * item.size + item.padding;
                        litted_desc.set = (value) => {
                            shape[value ? "addClass" : "removeClass"]("litted");
                            let timeline = new TimelineLite();
                            const delay = 0.5 / size;
                            for (let x2 = 0; x2 < size; ++x2) {
                                const delta = Math.abs(x2 - x);
                                if (!delta)
                                    continue;
                                timeline.call(() => {
                                    grid.items[y][x2].litted = !grid.items[y][x2].litted;
                                }, null, null, delta * delay);
                            }
                            for (let y2 = 0; y2 < size; ++y2) {
                                const delta = Math.abs(y2 - y);
                                if (!delta)
                                    continue;
                                timeline.call(() => {
                                    grid.items[y2][x].litted = value;
                                }, null, null, delta * delay);
                            }
                        };
                    }
                    shape.attr({
                        x: coord.x,
                        y: coord.y,
                        width: coord.size,
                        height: coord.size
                    });
                }
                shape.click((ev) => {
                    shape.litted = !shape.litted;
                });
                Object.defineProperty(shape, "litted", litted_desc);
                line.push(shape);
            }
        }
        return grid;
    }
    function initialization() {
        let grid = create_grid(Math.random() * 15 + 5);
        const blank_btn = $("#all-blank");
        const black_btn = $("#all-black");
        {
            let timeline;
            blank_btn.click(() => {
                if (timeline)
                    timeline.kill();
                timeline = new TimelineLite();
                let children = scene.children(":not(.litted)");
                const delay = 0.8 / children.length;
                shuffle(children);
                children.each((i, value) => {
                    timeline.call(() => {
                        value.classList.add("litted");
                    }, null, null, i * delay);
                });
            });
            black_btn.click(() => {
                if (timeline)
                    timeline.kill();
                timeline = new TimelineLite();
                let children = scene.children(".litted");
                const delay = 0.8 / children.length;
                shuffle(children);
                children.each((i, value) => {
                    timeline.call(() => {
                        value.classList.remove("litted");
                    }, null, null, i * delay);
                });
            });
        }
        const timeline = new TimelineLite();
        timeline.delay(0.5);
        let circles = scene.children("circle");
        shuffle(circles);
        const delay = 1000 / circles.length;
        // circles.each((i, value) => {
        //     timeline.from(value, 0.25, {
        //         scale: 0,
        //         transformOrigin: "50% 50%",
        //         ease: Expo.easeOut
        //     }, i * delay);
        // })
        let i = 0;
        // circles.each((i, circle) => { circle.style.visibility = "hidden";} );
        circles.css("visibility", "hidden");
        $("rect").css("visibility", "hidden");
        let timestamp = Date.now();
        const circles_handler = () => {
            let new_timestamp = Date.now();
            while (new_timestamp - timestamp > delay) {
                timestamp += delay;
                TweenLite.fromTo(circles[i], 0.25, {
                    clearProps: "visibility",
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: Expo.easeOut
                }, {
                    scale: 1
                });
                ++i;
                if (i >= circles.length) {
                    let timeline = new TimelineLite();
                    const diamond = grid.items[grid.center][grid.center];
                    diamond.removeAttr("transform");
                    scene.append(diamond);
                    timeline.fromTo(diamond, 0.25, {
                        transformOrigin: "50% 50%",
                        clearProps: "visibility",
                        scale: 0,
                        z: 1,
                        ease: Expo.easeOut
                    }, { scale: 2 });
                    const delay = 0.5 / (Math.sqrt(2) * grid.center);
                    const rot_delay = 0.8 / 3;
                    for (let i = 0; i < 3; ++i) {
                        timeline.to(diamond, rot_delay, { rotation: "+=45", ease: Expo.easeOut }, (i + 1) * rot_delay);
                    }
                    for (let i = 1; i <= grid.center; ++i) {
                        let target = [
                            grid.items[grid.center - i][grid.center - i],
                            grid.items[grid.center + i][grid.center + i]
                        ];
                        const pos = delay * (i + 1);
                        timeline.fromTo(target, 0.25, {
                            clearProps: "visibility",
                            scale: 0,
                            transformOrigin: "50% 50%",
                            ease: Expo.easeOut
                        }, {
                            scale: 1
                        }, pos);
                    }
                    timeline.to(diamond, 0.25, { scale: 1 });
                    return;
                }
            }
            requestAnimationFrame(circles_handler);
        };
        requestAnimationFrame(circles_handler);
    }
    initialization();
})();
