/* 
* 1. 获取画布(3为实时跟踪画笔， 2为道路绘制， 1为区域绘制)
* 2. 获取画笔
* 3. 直线，起止点
* 4. 曲线，三点式
* 5. 矩形，对角线起止点
* 6. 多边形，三角形拼接
* 7. 撤回/清空
* 8. 跟踪鼠标变化
* 9. 评价
* 10. 帮助
* 注： 线条宽度像素：15/10/6px
*/

window.onload = function () {
    // 检查浏览器支持
    if (!this.checkBrowser()) {
        alert('当前浏览器不支持canvas画布功能。请使用其他浏览器打开。推荐使用chrome浏览器。');
        document.body.innerHTML = "当前浏览器不支持canvas画布功能。请使用其他浏览器打开。推荐使用chrome浏览器。";
        return ;
    }
    // 初始化绘制工具
    var draw = new Draw();
    draw.init();
    // 初始化评价星级
    var evaluation = null;
    var evaluation_allowed = false;
    // 修改评价星级
    $('.evaluation_icon').mouseover(function (e) {
        var index = parseInt(e.target.id.charAt(11));
        for (var i = 1; i < index + 1; i++) {
            document.getElementById("evaluation_" + i).src = "images/star_full.png";
        }
        for (var j = index+1; j < 6; j++) {
            document.getElementById("evaluation_" + j).src = "images/star_blank.png";
        }
        if (evaluation_allowed) {
            evaluation = index;
        }
    });
    // 提交评价星级
    $('.evaluation_icon').click(uploadEvaluation);
    // 初始化页面当前输出文件名称
    var filename = null;
}

// 封装绘制类
class Draw {
    constructor() {
        this.draw_state = null;
        this.is_down = false;
        this.input_canvas_1 = document.getElementById('input_canvas_1');
        this.input_canvas_2 = document.getElementById('input_canvas_2');
        this.input_canvas_3 = document.getElementById('input_canvas_3');
        this.output_canvas = document.getElementById('output_canvas');
        this.ctx_1 = this.input_canvas_1.getContext('2d');
        this.ctx_2 = this.input_canvas_2.getContext('2d');
        this.ctx_3 = this.input_canvas_3.getContext('2d');
        this.ctx_4 = this.output_canvas.getContext('2d');
        this.linear_start_point = null; // {x: null, y: null}
        this.linear_end_point = null; // {x: null, y: null}
        this.lineWidth = 0;
        this.fillColor = "";
        this.curve_start_point = null; // {x: null, y: null}
        this.curve_end_point = null; // {x: null, y: null}
        this.curve_quadratic_point = null; // {x: null, y: null}
        this.rect_x = null;
        this.rect_y = null;
        this.rect_end_x = null;
        this.rect_end_y = null;
        this.polygon_point_list = []; // [{x: null, y: null},{x: null, y: null}]
        this.draw_history = [];
        /*
            draw_history数组元素说明:
            [
                {
                    drawType: "line",
                    lineWidth: 6 | 10 | 15,
                    start_point_x: null,
                    start_point_y: null,
                    end_point_x: null,
                    end_point_y: null,
                },
                {
                    drawType: "curve",
                    lineWidth: 6 | 10 |15,
                    start_point_x: null,
                    start_point_y: null,
                    end_point_x: null,
                    end_point_y: null,
                    cpx: null,
                    cpy: null,
                },
                {
                    drawType: "rectangle",
                    fillColor: "",
                    start_point_x: null,
                    start_point_y: null,
                    end_point_x: null,
                    end_point_y: null,
                },
                {
                    drawType: "polygon",
                    fillColor: "",
                    polygon_point_list: [],
                }
            ]
        */
        this.img_history = [];
        /*
            img_history数组元素说明：
            [
                {
                    src: "",
                },
            ]
        */
        this.curve_state = 0;
        this.polygon_state = 0;
        this.init = function () {
            // 初始化
            var _this = this;
            // 画笔功能切换
            document.getElementById("linear").addEventListener("click", function () {_this.state_change(1)});
            document.getElementById("curve").addEventListener("click", function () {_this.state_change(2)});
            document.getElementById("rectangle").addEventListener("click", function () {_this.state_change(3)});
            document.getElementById("polygon").addEventListener("click", function () {_this.state_change(4)});
            // 绘图图例切换
            $("img.single_icon_1").click(function (e) {
                $("img.single_icon_1").removeClass("selected");
                e.target.className += " selected";
                _this.lineWidth = parseInt(e.target.id.slice(5));
            });
            $("img.single_icon_2").click(function (e) {
                $("img.single_icon_2").removeClass("selected");
                e.target.className += " selected";
                _this.fillColor = e.target.id.slice(5);
            });
            // 初始化画笔状态为直线
            _this.draw_state = 1;
            // 初始化画笔宽度为15px
            _this.lineWidth = 15;
            //初始化画笔填充颜色为白色
            _this.fillColor = "white";
            // 添加鼠标事件监听
            _this.input_canvas_3.addEventListener("mousedown", function (e) {
                e.preventDefault();
                if (_this.draw_state === 1) {
                    _this.linear_start_point = {
                        x: e.layerX,
                        y: e.layerY
                    };
                    _this.is_down = true;
                } else if (_this.draw_state === 2) {
                    if (_this.curve_state === 0) {
                        _this.curve_start_point = {
                            x: e.layerX,
                            y: e.layerY
                        }
                        _this.is_down = true;
                    }else if (_this.curve_state === 1) {
                        _this.is_down = true;
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        _this.drawCurve(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y, e.layerX, e.layerY);
                    }else {
                        console.log("error");
                        return ;
                    }
                } else if (_this.draw_state === 3) {
                    _this.rect_x = e.layerX;
                    _this.rect_y = e.layerY;
                    _this.is_down = true;
                } else if (_this.draw_state === 4) {
                    return ;
                } else {
                    console.log("error");
                    return ;
                }
            });
            _this.input_canvas_3.addEventListener("mousemove", function (e) {
                e.preventDefault();
                if (_this.draw_state === 1) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === true) {
                        _this.drawLine(_this.ctx_3, _this.lineWidth, "#0000ff", _this.linear_start_point.x, _this.linear_start_point.y, e.layerX, e.layerY);
                    }
                } else if (_this.draw_state === 2) {
                    if (_this.curve_state === 0) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.is_down === true) {
                            _this.drawLine(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, e.layerX, e.layerY);
                        }
                    } else if (_this.curve_state === 1) {
                        if (_this.is_down === true) {
                            _this.ctx_3.clearRect(0, 0, 256, 256);
                            _this.drawCurve(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y, e.layerX, e.layerY);
                        }
                    } else {
                        console.log("error");
                        return;
                    }
                } else if (_this.draw_state === 3) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === true) {
                        _this.drawRect(_this.ctx_3, _this.fillColor, _this.rect_x, _this.rect_y, e.layerX, e.layerY);
                    }
                } else if (_this.draw_state === 4) {
                    if (_this.polygon_state === 0) {
                        return ;
                    }else if (_this.polygon_state === 1) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.polygon_point_list.length === 1) {
                            _this.drawLine(_this.ctx_3, 1, _this.fillColor, _this.polygon_point_list[0].x, _this.polygon_point_list[0].y, e.layerX, e.layerY);
                        }else if (_this.polygon_point_list.length > 1) {
                            _this.polygon_point_list.push({
                                x: e.layerX,
                                y: e.layerY
                            });
                            _this.drawPolygon(_this.ctx_3, _this.fillColor, _this.polygon_point_list);
                            _this.polygon_point_list.pop();
                        }else {
                            console.log("error");
                            return ;
                        }
                    }
                } else {
                    console.log("error");
                    return;
                }
            });
            _this.input_canvas_3.addEventListener("mouseup", function (e) {
                e.preventDefault();
                if (_this.draw_state === 1) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === false) {
                        console.log("error");
                        return ;
                    }
                    _this.linear_end_point = {
                        x: e.layerX,
                        y: e.layerY
                    };
                    _this.drawLine(_this.ctx_2, _this.lineWidth, "#0000ff", _this.linear_start_point.x, _this.linear_start_point.y, _this.linear_end_point.x, _this.linear_end_point.y);
                    _this.is_down = false;
                    _this.draw_history.push({
                        drawType: "line",
                        lineWidth: _this.lineWidth,
                        start_point_x: _this.linear_start_point.x,
                        start_point_y: _this.linear_start_point.y,
                        end_point_x: _this.linear_end_point.x,
                        end_point_y: _this.linear_end_point.y,
                    });
                } else if (_this.draw_state === 2) {
                    if (_this.curve_state === 0) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.is_down === false) {
                            console.log("error");
                            return ;
                        }
                        _this.curve_end_point ={
                            x: e.layerX,
                            y: e.layerY
                        }
                        _this.drawLine(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y);
                        _this.is_down = false;
                        _this.curve_state = 1;
                    } else if (_this.curve_state === 1) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.is_down === false) {
                            console.log("error");
                            return;
                        }
                        _this.curve_quadratic_point = {
                            x: e.layerX,
                            y: e.layerY
                        };
                        _this.drawCurve(_this.ctx_2, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y, _this.curve_quadratic_point.x, _this.curve_quadratic_point.y);
                        _this.is_down = false;
                        _this.draw_history.push({
                            drawType: "curve",
                            lineWidth: _this.lineWidth,
                            start_point_x: _this.curve_start_point.x,
                            start_point_y: _this.curve_start_point.y,
                            end_point_x: _this.curve_end_point.x,
                            end_point_y: _this.curve_end_point.y,
                            cpx: _this.curve_quadratic_point.x,
                            cpy: _this.curve_quadratic_point.y,
                        });
                        _this.curve_state = 0;
                    } else {
                        console.log("error");
                        return;
                    }
                } else if (_this.draw_state === 3) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === false) {
                        console.log("error");
                        return ;
                    }
                    _this.rect_end_x = e.layerX;
                    _this.rect_end_y = e.layerY;
                    _this.drawRect(_this.ctx_1, _this.fillColor, _this.rect_x, _this.rect_y, _this.rect_end_x, _this.rect_end_y);
                    _this.is_down = false;
                    _this.draw_history.push({
                        drawType: "rectangle",
                        fillColor: _this.fillColor,
                        start_point_x: _this.rect_x,
                        start_point_y: _this.rect_y,
                        end_point_x: _this.rect_end_x,
                        end_point_y: _this.rect_end_y,
                    });
                } else if (_this.draw_state === 4) {
                    return ;
                } else {
                    console.log("error");
                    return;
                }
            });
            _this.input_canvas_3.addEventListener("click", function (e) {
                e.preventDefault();
                if (_this.draw_state === 4) {
                    if (_this.polygon_state === 0) {
                        _this.polygon_state = 1;
                        _this.polygon_point_list.push({
                            x: e.layerX,
                            y: e.layerY
                        });
                    }else if (_this.polygon_state === 1) {
                        _this.polygon_point_list.push({
                            x: e.layerX,
                            y: e.layerY
                        });
                    }else {
                        console.log("error");
                        return ;
                    }
                } else if (_this.draw_state === 3) {
                    return ;
                } else if (_this.draw_state === 2) {
                    return ;
                } else if (_this.draw_state === 1) {
                    return;
                } else {
                    console.log("error");
                    return;
                }
            });
            _this.input_canvas_3.addEventListener("mouseleave", function (e) {
                e.preventDefault();
                if (_this.draw_state === 4) {
                    if (_this.polygon_state === 1) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        _this.drawPolygon(_this.ctx_1, _this.fillColor, _this.polygon_point_list);
                        _this.draw_history.push({
                            drawType: "polygon",
                            fillColor: _this.fillColor,
                            polygon_point_list: _this.polygon_point_list
                        });
                        _this.polygon_point_list = [];
                        _this.polygon_state = 0;
                    }else {
                        return;
                    }
                } else if (_this.draw_state === 3) {
                    return ;
                } else if (_this.draw_state === 2) {
                    return ;
                } else if (_this.draw_state === 1) {
                    return;
                } else {
                    console.log("error");
                    return;
                }
            });
            // 绑定撤回button
            document.getElementById("cancel").addEventListener("click", function () {_this.undo();});
            // 绑定清空button
            document.getElementById("clear").addEventListener("click", function () {_this.clearAll();});
            // 绑定提交button
            document.getElementById("transfer").addEventListener("click", function () {_this.upload();});
        };
        this.drawLine = function (ctx, ctx_width, ctx_color, start_point_x, start_point_y, end_point_x, end_point_y) {
            // 作直线
            // ctx_color = "#0000ff";
            ctx.beginPath();
            ctx.moveTo(start_point_x, start_point_y);
            ctx.lineTo(end_point_x, end_point_y);
            ctx.lineWidth = ctx_width;
            ctx.strokeStyle = ctx_color;
            ctx.stroke();
            // ctx.closePath();
        };
        this.drawCurve = function (ctx, ctx_width, ctx_color, start_point_x, start_point_y, end_point_x, end_point_y, cpx, cpy) {
            // 作曲线
            // ctx_color = "#0000ff";
            ctx.beginPath();
            ctx.moveTo(start_point_x, start_point_y);
            ctx.quadraticCurveTo(cpx, cpy, end_point_x, end_point_y);
            ctx.lineWidth = ctx_width;
            ctx.strokeStyle = ctx_color;
            ctx.stroke();
            // ctx.closePath();
        };
        this.drawRect = function (ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y) {
            // 作矩形
            var rect_width = Math.abs(point_2_x - point_1_x);
            var rect_height = Math.abs(point_2_y - point_1_y);
            var start_point_x = point_1_x < point_2_x ? point_1_x : point_2_x;
            var start_point_y = point_1_y < point_2_y ? point_1_y : point_2_y;
            ctx.beginPath();
            ctx.fillStyle = ctx_color;
            ctx.fillRect(start_point_x, start_point_y, rect_width, rect_height);
            // ctx.closePath();
        };
        this.drawPolygon = function (ctx, ctx_color, polygon_point_list) {
            // 作多边形
            if (polygon_point_list.length < 3) {
                console.log("polygon_point_list error");
                return;
            }
            const point_1_x = polygon_point_list[0].x;
            const point_1_y = polygon_point_list[0].y;
            var point_2_x;
            var point_2_y;
            var point_3_x;
            var point_3_y;
            for (var i = 1; i < polygon_point_list.length - 1; i++) {
                point_2_x = polygon_point_list[i].x;
                point_2_y = polygon_point_list[i].y;
                point_3_x = polygon_point_list[i + 1].x;
                point_3_y = polygon_point_list[i + 1].y;
                this.drawTriangle(ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y);
            }
        };
        this.drawTriangle = function (ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y) {
            // 作三角形
            ctx.beginPath();
            ctx.moveTo(point_1_x, point_1_y);
            ctx.lineTo(point_2_x, point_2_y);
            ctx.lineTo(point_3_x, point_3_y);
            ctx.closePath();
            ctx.fillStyle = ctx_color;
            ctx.fill();
        };
        this.upload = function () {
            // 上传图片
        };
        this.undo = function () {
            // 撤回
            this.ctx_1.clearRect(0, 0, 256, 256);
            this.ctx_2.clearRect(0, 0, 256, 256);
            this.ctx_3.clearRect(0, 0, 256, 256);
            this.draw_history.pop();
            this.trace(this.draw_history);
        };
        this.trace = function (draw_history) {
            //按照记录重绘canvas画布
            for (var i = 0; i < draw_history.length; i++) {
                var type = draw_history[i].drawType;
                switch (type) {
                    case "line":
                        this.drawLine(this.ctx_2, draw_history[i].lineWidth, "#0000ff", draw_history[i].start_point_x, draw_history[i].start_point_y, draw_history[i].end_point_x, draw_history[i].end_point_y);
                        break;
                    case "curve":
                        this.drawCurve(this.ctx_2, draw_history[i].lineWidth, "#0000ff", draw_history[i].start_point_x, draw_history[i].start_point_y, draw_history[i].end_point_x, draw_history[i].end_point_y, draw_history[i].cpx, draw_history[i].cpy);
                        break;
                    case "rectangle":
                        this.drawRect(this.ctx_1, draw_history[i].fillColor, draw_history[i].start_point_x, draw_history[i].start_point_y, draw_history[i].end_point_x, draw_history[i].end_point_y);
                        break;
                    case "polygon":
                        this.drawPolygon(this.ctx_1, draw_history[i].fillColor, draw_history[i].polygon_point_list);
                        break;
                }
            }
        };
        this.clearAll = function () {
            this.ctx_1.clearRect(0, 0, 256, 256);
            this.ctx_2.clearRect(0, 0, 256, 256);
            this.ctx_3.clearRect(0, 0, 256, 256);
            this.ctx_4.clearRect(0, 0, 256, 256);
            this.draw_history = [];
            this.img_history = [];
        };
        this.state_change = function (state) {
            if (state !== 1 && state !== 2 && state !== 3 && state !== 4) {
                console.log("error");
                return;
            }
            this.draw_state = state;
        };
    }
}

// 检查浏览器的支持
function checkBrowser () {
    if (!FileReader) {
        return false;
    }else {
        return true;
    }
}

// 提交评分
function uploadEvaluation () {
    if (evaluation_allowed === true && evaluation !== null && filename !== null) {
        var formData = new FormData();
        formData.append("filename", filename);
        formData.append("score", evaluation);
        $.ajax({
            type: "post",
            url: "/score",
            data: formData,
            success: function (data) {
                if (data === 200) {
                    alert("评价提交成功。感谢您的评价！");
                    evaluation_allowed = false;
                }else if (data === 500) {
                    alert("评价提交失败，请重试。");
                }
            }
        });
    }else {
        alert("当前不可进行评分。");
        return ;
    }
}