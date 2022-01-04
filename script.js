const c = document.getElementById("canvas")
const click = document.getElementById("klikaj")
const ctx = c.getContext("2d")
let k = 100
const sliderk = document.getElementById("kvalue")
const sliderr = document.getElementById("rvalue")
let r = 10
let tmp = ctx.getImageData(0, 0, c.width, c.height);
ctx.save()
var electrons = []
sliderk.addEventListener("change", element => {
    k = element.target.value
})
sliderr.addEventListener("change", element => {
    r = element.target.value
})
class Electron {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
function add(e) {
    var electron = new Electron(e.offsetX, e.offsetY)
    let now = ctx.getImageData(electron.x, electron.y, 1, 1).data
    if (click.checked && now[0] != 0) {
        electrons.push(electron)
    }
}
function color(e) {
    ctx.lineWidth = r
    ctx.strokeStyle = "#ff0000"
    ctx.lineCap = "round"
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
}
function draw(e) {
    ctx.putImageData(tmp, 0, 0)
    c.addEventListener("mousemove", color)
}
function stop(e) {
    ctx.beginPath()
    c.removeEventListener("mousemove", color)
    tmp = ctx.getImageData(0, 0, c.width, c.height)

}
c.addEventListener("click", add)

function loop() {
    if (click.checked) {
        c.removeEventListener("mousedown", draw)
        c.removeEventListener("mouseup", stop)

        ctx.clearRect(0, 0, c.width, c.height)
        ctx.putImageData(tmp, 0, 0)
        electrons.forEach((element) => {
            ctx.beginPath();
            ctx.arc(element.x, element.y, 5, 0, 2 * Math.PI);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";
            ctx.stroke();
        })
        for (var i = 0; i < electrons.length; i++) {
            var difx = 0
            var dify = 0
            for (var j = 0; j < electrons.length; j++) {
                if (j != i) {
                    var diffx = electrons[j].x - electrons[i].x
                    var diffy = electrons[j].y - electrons[i].y
                    var diff = Math.pow(Math.sqrt(Math.pow(diffx, 2) + Math.pow(diffy, 2)), 3)
                    difx += diffx / diff
                    dify += diffy / diff
                }

            }
            //move
            electrons[i].x -= k * difx
            electrons[i].y -= k * dify
            //checking if outside the canvas
            if (electrons[i].y < 10) {
                electrons[i].y = 10
            }
            if (electrons[i].y > c.height - 10) {
                electrons[i].y = c.height - 10
            }
            if (electrons[i].x < 10) {
                electrons[i].x = 10
            }
            if (electrons[i].x > c.width - 10) {
                electrons[i].x = c.width - 10
            }
            let now = ctx.getImageData(electrons[i].x, electrons[i].y, 1, 1).data
            if (now[0] != 255) {
                electrons[i].x += k * difx
                electrons[i].y += k * dify
            }
        }
    } else {
        c.addEventListener("mousedown", draw)
        c.addEventListener("mouseup", stop)
    }
}
let interval = setInterval(loop)
